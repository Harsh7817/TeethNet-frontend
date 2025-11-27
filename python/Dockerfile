FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt /app/requirements.txt
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential git ffmpeg libgl1 \
    && rm -rf /var/lib/apt/lists/*

RUN pip install --no-cache-dir -r requirements.txt

COPY . /app

ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1

# For GPU: use an nvidia/cuda base image and install the correct torch wheel with CUDA.
# When running with nvidia runtime, pass --gpus=all to docker run or set deploy settings in compose.