from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import FileResponse, JSONResponse
from uuid import uuid4
from pathlib import Path
import shutil
import os
import json
import redis
from celery import Celery
from dotenv import load_dotenv

load_dotenv()

# Directories (mounted by docker-compose)
UPLOAD_DIR = Path(os. environ. get("UPLOAD_DIR", "/data/uploads"))
RESULT_DIR = Path(os.environ. get("RESULT_DIR", "/data/results"))
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
RESULT_DIR.mkdir(parents=True, exist_ok=True)

# Redis for job status
REDIS_HOST = os. environ.get("REDIS_HOST", "redis")
REDIS_PORT = int(os.environ.get("REDIS_PORT", 6379))
CELERY_BROKER_URL = os.environ.get("CELERY_BROKER_URL", "redis://redis:6379/0")

# Lazy connections
_rdb = None
_celery_client = None

def get_redis():
    global _rdb
    if _rdb is None:
        _rdb = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, db=0, decode_responses=True)
    return _rdb

def get_celery():
    global _celery_client
    if _celery_client is None:
        _celery_client = Celery(broker=CELERY_BROKER_URL)
    return _celery_client

app = FastAPI(title="Depth->STL processing service (API)")


def set_status(job_id: str, state: str, detail: str = "", result: str = ""):
    payload = {"state": state, "detail": detail, "result": result}
    get_redis().set(job_id, json.dumps(payload))


@app.post("/upload/")
async def upload_image(file: UploadFile = File(... )):
    # Basic validation
    if not file.content_type. startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")

    job_id = str(uuid4())
    safe_name = Path(file.filename).name
    fname = f"{job_id}_{safe_name}"
    save_path = UPLOAD_DIR / fname

    # Save uploaded file to mounted volume
    try:
        with save_path.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save upload: {e}")

    # Mark queued and enqueue Celery task
    set_status(job_id, "QUEUED", "Job received and queued")
    try:
        async_result = get_celery().send_task(
            "tasks.process_image_task",
            args=[str(save_path), str(RESULT_DIR), job_id],
            kwargs={},
            queue=os.environ.get("CELERY_QUEUE", None),
        )
    except Exception as e:
        set_status(job_id, "FAILURE", f"Failed to enqueue task: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to enqueue task: {e}")

    return {"job_id": job_id, "celery_id": str(async_result.id)}


@app.get("/status/{job_id}")
def status(job_id: str):
    raw = get_redis().get(job_id)
    if not raw:
        return JSONResponse({"state": "UNKNOWN", "detail": "No such job_id"}, status_code=404)
    return JSONResponse(json.loads(raw))


@app.get("/download/{job_id}")
def download(job_id: str):
    raw = get_redis().get(job_id)
    if not raw:
        raise HTTPException(status_code=404, detail="No such job")
    info = json.loads(raw)
    if info.get("state") != "SUCCESS":
        raise HTTPException(status_code=404, detail="Result not ready")
    stl_path = info.get("result")
    if not stl_path or not Path(stl_path).exists():
        raise HTTPException(status_code=404, detail="Result file missing")
    return FileResponse(path=stl_path, filename=Path(stl_path).name, media_type="application/sla")