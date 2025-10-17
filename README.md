# 🚀 URL Shortener App

A **full-stack URL Shortener** built with **Node.js, Express, MongoDB, Redis, and React**.
The app generates short URLs for long URLs, caches them for faster redirects, and tracks click counts.

---

## 🔗 Features

* Shorten any long URL with a unique short code
* Fast redirects using **Redis caching**
* Track clicks on each short URL
* Persistent storage using **MongoDB**
* React frontend with a clean interface
* Fully Dockerized for easy development and deployment
* Configurable `BASE_URL` for custom short domains
* Environment variables for secure configuration
* Supports local development and cloud deployment

---

## 🏗️ Tech Stack

| Layer      | Technology                   |
| ---------- | ---------------------------- |
| Frontend   | React, Vite, TypeScript, CSS |
| Backend    | Node.js, Express             |
| Database   | MongoDB (Atlas or local)     |
| Cache      | Redis (Upstash or local)     |
| Container  | Docker, Docker Compose       |
| Deployment | Render / Railway / Vercel    |

---

## 📂 Project Structure

```text
url-shortener/
├─ backend/
│  ├─ controllers/
│  │  └─ urlController.js
│  ├─ models/
│  │  └─ url.js
│  ├─ routes/
│  │  └─ urlRoutes.js
│  ├─ config/
│  │  └─ redisClient.js
│  ├─ index.js
├─ frontend/
│  ├─ src/
│  │  ├─ components/
│  │  │  ├─ ShortenerForm.tsx
│  │  │  └─ ResultDisplay.tsx
│  │  ├─ App.tsx
│  │  └─ main.tsx
├─ docker-compose.yml
├─ Dockerfile (frontend)
├─ Dockerfile (backend)
├─ .env
├─ .gitignore
└─ README.md
```

---

## ⚙️ Environment Variables

Create a `.env` file in the **backend folder**:

```env
PORT=5000
BASE_URL=http://localhost:5000   # Change to your domain in production
MONGO_URI=mongodb://mongo:27017/urlShortener
REDIS_URL=redis://redis:6379
```

**Frontend `.env`** (`frontend/.env`):

```env
VITE_BACKEND_URL=http://localhost:5000
VITE_FRONTEND_URL=http://localhost:5173  # optional, used for display
```

---

## 🐳 Docker Setup

### 1️⃣ docker-compose.yml

```yaml
version: "3.9"
services:
  mongo:
    image: mongo
    container_name: mongo
    volumes:
      - mongo_data:/data/db
    networks:
      - app-network

  redis:
    image: redis
    container_name: redis
    networks:
      - app-network

  backend:
    build: ./backend
    container_name: backend
    env_file: ./backend/.env
    ports:
      - "5000:5000"
    depends_on:
      - mongo
      - redis
    networks:
      - app-network

  frontend:
    build: ./frontend
    container_name: frontend
    env_file: ./frontend/.env
    ports:
      - "5173:80"
    depends_on:
      - backend
    networks:
      - app-network

volumes:
  mongo_data:

networks:
  app-network:
    driver: bridge
```

### 2️⃣ Commands

```bash
# Build all containers
docker-compose up --build -d

# Restart only frontend/backend
docker-compose restart frontend
docker-compose restart backend

# View logs
docker-compose logs -f frontend
docker-compose logs -f backend
```

---

## 📝 Backend Routes

| Route               | Method | Description                  |
| ------------------- | ------ | ---------------------------- |
| `/api/url/shortern` | POST   | Shorten a long URL           |
| `/:code`            | GET    | Redirect to the original URL |

**Example request:**

```bash
POST /api/url/shortern
Content-Type: application/json

{
  "longUrl": "https://www.example.com/very/long/url"
}
```

**Response:**

```json
{
  "shortUrl": "http://localhost:5000/wkTYk24Cs",
  "cached": false
}
```

---

## 🖥️ Frontend

* React app with `ShortenerForm` and `ResultDisplay`
* Handles:

  * Submitting long URLs
  * Displaying short URLs
  * Copying to clipboard
* `.env` config points frontend to backend

---

## ⚡ Redis Caching

* **longUrl → shortCode**: avoid duplicate entries
* **shortCode → longUrl**: fast redirects
* TTL: 1 hour (3600 seconds)

---


