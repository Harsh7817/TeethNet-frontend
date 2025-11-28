# TeethNet Frontend

A minimal React + Vite frontend for:
- User signup/login (JWT)
- Submitting 2D images to the Node backend (/submit)
- Polling job status
- Viewing and downloading generated 3D STL models

## Prerequisites

Backend services running:
- Node API (port 3000)
- Python API (port 8000)
- Redis
- GPU worker (optional, launched separately with `docker run --gpus all ...`)

Ensure Node backend has environment variables:
- `MONGODB_URI`
- `JWT_SECRET`
- `PYTHON_URL=http://python-api:8000`

## Setup

```bash
cd frontend
npm install
npm run dev
```

Open: http://localhost:5173

## Environment Variables

Create `.env` (optional):

```
VITE_API_BASE=http://localhost:3000
```

If omitted, defaults to `http://localhost:3000`.

## Flow

1. Sign Up or Login → token stored in `localStorage`.
2. Upload image → POST /submit (auth required).
3. Response returns `job_id`.
4. Poll /status/:jobId until `SUCCESS`.
5. STL viewer loads `http://localhost:3000/download/:jobId`.

## STL Viewer

Simple 3D viewer (Three.js) with:
- Drag rotate
- Mouse wheel zoom
- Automatic centering/bounding box normalization

## Extending

- Implement `/jobs` endpoint in backend to list historical jobs.
- Add progress percentages by extending Python API status.
- Add colorized depth preview side-by-side.

## Production Build

```bash
npm run build
```

Artifacts in `dist/`. Serve behind a reverse proxy (Nginx/Caddy) or let Vite preview:

```bash
npm run preview
```

## Security Notes

- JWT stored in localStorage (simplest). For higher security use httpOnly cookies.
- Add rate limiting on auth endpoints (e.g., express-rate-limit).
- Enforce HTTPS in production.

## Troubleshooting

| Issue | Fix |
|-------|-----|
| CORS errors | Add `cors()` middleware in Node with proper origin. |
| STL not loading | Confirm `/download/:jobId` returns 200 and correct Content-Type. |
| Depth seems flat | Adjust pipeline env `ORTHO_SCALE_FACTOR`, `POISSON_DEPTH`. |

## License

Internal project scaffold. Customize freely.