# 🌍 Earthquake Dashboard (Serverless Cloud Project)

A real-time earthquake analytics dashboard using a **fully serverless AWS backend** and a **Next.js frontend**.  
Data is pulled live from the USGS feed, stored in S3, processed via Lambda, and visualized on a global map.

---

## 🚀 Architecture Overview

### **Backend (AWS)**
- **EventBridge → Lambda (IngestFunction)**  
  Fetches USGS hourly feed → stores both raw + curated JSON in S3.
- **S3 (earthquake-data-dev)**  
  `/raw/` — complete USGS feed  
  `/curated/` — slimmed list of events for UI
- **FastAPI** deployed via **AWS Lambda + API Gateway** using SAM.
- **SSM Parameter Store**  
  Stores bucket name + USGS feed URL.
- **GitHub Actions CI/CD**  
  Push → auto-deploy via SAM.

### **Frontend (Next.js on Vercel)**
- Fetches data directly from API Gateway.
- Interactive **Leaflet map** with colored markers.
- **Magnitude band statistics** and summary cards.
- Fully generated client-side using server-safe fetch helpers.

---

## 🔥 API Endpoints

Base URL:  
`https://<api-id>.execute-api.<region>.amazonaws.com/Prod`

| Endpoint | Description |
|---------|-------------|
| `/health` | Backend health + env check |
| `/earthquakes/latest` | Raw USGS feed (latest snapshot) |
| `/earthquakes/summary` | Curated list (id, magnitude, coords, etc.) |
| `/earthquakes/stats` | Aggregated stats (max mag, counts by band) |

---

## 📦 Data Shapes

### **Raw**
```
{
  "type": "FeatureCollection",
  "features": [ ... ]
}
```

### **Curated**
```
[
  {
    "id": "us7000rfg1",
    "time": 1764820000000,
    "mag": 5.1,
    "mag_band": "moderate",
    "place": "...",
    "lat": 33.2,
    "lon": -117.3,
    "depth_km": 10
  }
]
```

### **Stats**
```
{
  "total_events": 17,
  "max_magnitude": 5.3,
  "count_by_mag_band": {
    "micro": 12,
    "light": 3,
    "moderate": 2
  }
}
```

---

## 🧠 How Ingestion Works

1. EventBridge fires every hour.
2. Lambda downloads USGS GeoJSON.
3. Saves:
   - `raw/<timestamp>.json`
   - `curated/<timestamp>.json`
4. Frontend fetches the latest file directly through API Gateway.

---

## 🖥️ Frontend Setup

Create `.env.local`:
```
NEXT_PUBLIC_API_BASE_URL=https://<api-id>.execute-api.<region>.amazonaws.com/Prod
```

Install deps:
```
npm install
```

Run locally:
```
npm run dev
```

Deploy to Vercel → add the same environment variable.

---

## ✔️ Status: Completed

- Backend fully deployed & ingesting data  
- API live on API Gateway  
- Frontend deployed on Vercel  
- Map + stats UI functional  

---