# 🐞 Ladybug — PE Malware Detection

> CNN-based malware detection for Windows PE files via byte visualization. Upload an EXE/DLL and get an instant benign/malicious classification.

[![Python](https://img.shields.io/badge/Python-3.11-3776AB?logo=python&logoColor=white)](https://python.org)
[![TensorFlow](https://img.shields.io/badge/TensorFlow-2.15-FF6F00?logo=tensorflow&logoColor=white)](https://tensorflow.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.109-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org)

> **Security research only.** Do not upload production or sensitive files.

---

## How It Works

1. Upload any `.exe`, `.dll`, `.sys`, `.scr`, or `.com` file
2. Raw bytes are reshaped into a **150×150 grayscale image**
3. CNN predicts **benign or malicious** with a confidence score
4. Results show full class probabilities

---

## Model

- **Architecture:** CNN trained with TensorFlow/Keras
- **Input:** 150×150 byte visualization image
- **Classes:** `benign` / `malicious`
- **Training data:** 801 PE files (641 train / 160 validation)
- **Technique:** Byte visualization — no manual feature engineering

---

## Quickstart

### Frontend only (demo mode)
```bash
cd frontend
npm install && npm run dev
```

### With backend
```bash
cd api
pip install -r requirements.txt
# Export your trained model as artifacts/ladybug_cnn.keras
uvicorn main:app --reload --port 8000

cd ../frontend
NEXT_PUBLIC_API_URL=http://localhost:8000 npm run dev
```

### Export your model
In your Colab notebook, after training add:
```python
model.save('ladybug_cnn.keras')
```
Then copy to `api/artifacts/ladybug_cnn.keras`.

---

## Project Structure
```
ladybug/
├── api/
│   ├── main.py        # FastAPI — /scan endpoint
│   ├── model.py       # Byte→image conversion + CNN inference
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── pages/
│   │   ├── scan.js    # File upload + drag-and-drop UI
│   │   └── about.js
│   ├── components/
│   │   ├── Layout.js
│   │   └── ResultCard.js
│   └── lib/api.js
├── notebooks/         # Original training notebook
└── vercel.json
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Model | TensorFlow/Keras CNN |
| Inference | Pillow byte→image, NumPy |
| API | FastAPI + python-multipart |
| Frontend | Next.js 14 + Tailwind CSS |
| Deployment | Vercel (frontend) + Docker (backend) |

---

## License
MIT
