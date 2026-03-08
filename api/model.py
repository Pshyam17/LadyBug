"""
Ladybug — CNN Malware Detection
Converts PE file bytes to a 150x150 grayscale image, runs CNN inference.
"""
import os
import io
import math
import numpy as np
from PIL import Image
import tensorflow as tf

MODEL_PATH = os.getenv("MODEL_PATH", os.path.join(os.path.dirname(__file__), "artifacts", "ladybug_cnn.keras"))
IMG_SIZE   = (150, 150)
CLASSES    = ["benign", "malicious"]

_model = None

def load_model():
    global _model
    if _model is None:
        if not os.path.exists(MODEL_PATH):
            raise FileNotFoundError(f"Model not found at {MODEL_PATH}. Train and export the model first.")
        _model = tf.keras.models.load_model(MODEL_PATH)
    return _model

def bytes_to_image(file_bytes: bytes) -> np.ndarray:
    """Convert raw PE bytes to a 150x150 grayscale image array."""
    arr = np.frombuffer(file_bytes, dtype=np.uint8)
    side = math.ceil(math.sqrt(len(arr)))
    padded = np.zeros(side * side, dtype=np.uint8)
    padded[:len(arr)] = arr
    img_arr = padded.reshape(side, side)
    img = Image.fromarray(img_arr, mode='L').resize(IMG_SIZE, Image.LANCZOS)
    return np.array(img)

def predict(file_bytes: bytes) -> dict:
    """Run inference on PE file bytes. Returns label, confidence, and class probabilities."""
    model    = load_model()
    img      = bytes_to_image(file_bytes)
    # CNN expects (batch, H, W, C) with values 0-255 normalized to 0-1
    x        = img.astype(np.float32) / 255.0
    x        = np.expand_dims(x, axis=-1)   # add channel dim
    x        = np.expand_dims(x, axis=0)    # add batch dim
    preds    = model.predict(x, verbose=0)[0]
    # Handle both sigmoid (binary) and softmax (2-class) outputs
    if len(preds) == 1:
        mal_prob = float(preds[0])
        ben_prob = 1.0 - mal_prob
    else:
        ben_prob, mal_prob = float(preds[0]), float(preds[1])
    label      = "malicious" if mal_prob >= 0.5 else "benign"
    confidence = mal_prob if label == "malicious" else ben_prob
    return {
        "label":       label,
        "confidence":  round(confidence, 4),
        "probabilities": {
            "benign":    round(ben_prob, 4),
            "malicious": round(mal_prob, 4),
        },
    }

def demo_predict(filename: str, size_bytes: int) -> dict:
    """Deterministic demo prediction used when model is not loaded."""
    import hashlib
    h     = int(hashlib.md5(filename.encode()).hexdigest(), 16)
    score = ((h % 1000) / 1000.0) * 0.85 + (0.1 if size_bytes > 500_000 else 0.0)
    score = min(0.97, score)
    label = "malicious" if score > 0.5 else "benign"
    ben   = round(1 - score, 4)
    mal   = round(score, 4)
    return {
        "label":       label,
        "confidence":  mal if label == "malicious" else ben,
        "probabilities": {"benign": ben, "malicious": mal},
        "demo": True,
    }
