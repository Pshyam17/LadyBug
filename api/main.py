"""Ladybug API — PE malware detection via CNN."""
import os
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from model import predict, demo_predict, load_model

app = FastAPI(
    title="Ladybug — PE Malware Detection API",
    description="Upload a PE file (.exe, .dll) and get a CNN-based malware classification.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://*.vercel.app", os.getenv("FRONTEND_URL", "")],
    allow_credentials=True, allow_methods=["*"], allow_headers=["*"],
)

MODEL_LOADED = False
try:
    load_model()
    MODEL_LOADED = True
except FileNotFoundError:
    pass

@app.get("/health")
def health():
    return {"status": "ok", "model_loaded": MODEL_LOADED, "service": "ladybug-api"}

@app.post("/scan")
async def scan(file: UploadFile = File(...)):
    """Upload a PE file and get benign/malicious classification."""
    ALLOWED = {".exe", ".dll", ".sys", ".scr", ".com"}
    ext = os.path.splitext(file.filename or "")[1].lower()
    if ext not in ALLOWED:
        raise HTTPException(status_code=400, detail=f"Unsupported file type '{ext}'. Allowed: {ALLOWED}")
    MAX_SIZE = 10 * 1024 * 1024  # 10 MB
    contents = await file.read()
    if len(contents) > MAX_SIZE:
        raise HTTPException(status_code=413, detail="File too large. Max 10MB.")
    try:
        if MODEL_LOADED:
            result = predict(contents)
        else:
            result = demo_predict(file.filename, len(contents))
            result["warning"] = "Model not loaded — showing demo prediction"
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    return {
        "filename":  file.filename,
        "size_bytes": len(contents),
        **result,
    }

@app.get("/")
def root():
    return {"name": "Ladybug API", "version": "1.0.0", "docs": "/docs", "model_loaded": MODEL_LOADED}
