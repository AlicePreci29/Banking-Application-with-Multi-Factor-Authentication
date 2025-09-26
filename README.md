# Multi-Factor Authentication & Fraud Detection

A **simple web application** built with **React + Express.js + Firebase Auth + Azure**, featuring:

* 🔑 Multi-Factor Authentication (Email + Password + Phone OTP)
* 📊 Secure transaction dashboard
* 📂 Cloud database on Azure
* 🤖 Machine Learning API for fraud detection

---

## 🏗️ Project Architecture

```
Frontend (React + Vite + Tailwind)
   ↓ Axios
Backend (Express.js)
   ↓ REST API
Auth Service (Firebase Auth for MFA)
   ↓
Database (Azure SQL Database / Cosmos DB)
   ↓
ML Service (Python - Isolation Forest / LSTM)
   ↓ REST API
Deployment (Azure App Service + Azure Static Web Apps)
```

---

## ⚙️ Tech Stack

* **Frontend** → React (Vite, Tailwind, ShadCN/UI)
* **Backend** → Express.js (Node.js)
* **Authentication** → Firebase Auth (Email + Password + Phone MFA)
* **Database** → Azure SQL Database or Cosmos DB
* **ML Model** → Python (Isolation Forest / One-Class SVM / LSTM)
* **Deployment** → Azure App Service (Backend) + Azure Static Web Apps (Frontend)

---

## 🚀 Features

* **Sign up & Login** with Firebase Auth
* **Phone OTP Verification** for MFA
* **PIN Security** (stored in Azure DB)
* **Dashboard** with mock transactions
* **Fraud Detection API** using ML models (to flag suspicious transactions)
* **Scalable cloud hosting on Azure**

---

## 📂 Folder Structure

```
banking-app/
│── frontend/               # React (Vite + Tailwind)
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── components/     # LoginPage, SignupPage, Dashboard, Captcha, UI
│   │   ├── services/       # api.ts (Axios client)
│   │   ├── firebaseConfig.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   └── index.html
│
│── backend/                # Express.js API
│   ├── server.js           # Entry point
│   ├── routes/             # API routes (auth, user, etc.)
│   ├── models/             # DB models (User, Transactions, etc.)
│   └── package.json
│
│── ml-service/             # Python ML fraud detection
│   ├── model.py
│   └── app.py (FastAPI/Flask)
│
│── README.md
```

---

## 🔑 Environment Setup

### 1. Frontend (`/frontend`)

```bash
cd frontend
npm install
npm run dev
```

Create a `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

---

### 2. Backend (`/backend`)

```bash
cd backend
npm install
npm run dev
```

`.env` file:

```env
PORT=5000
DB_URL=your_azure_sql_or_cosmosdb_url
JWT_SECRET=supersecretkey
```

---

### 3. Machine Learning Service (`/ml-service`)

```bash
cd ml-service
pip install fastapi uvicorn scikit-learn pandas numpy
uvicorn app:app --reload
```

---

## ☁️ Azure Deployment

### 🔹 Frontend

* Deploy via **Azure Static Web Apps**

### 🔹 Backend

* Deploy via **Azure App Service**
* Connect to **Azure SQL Database / Cosmos DB**

### 🔹 ML Service

* Use **Azure Functions** (for lightweight inference)
* Or deploy **FastAPI/Flask** on **Azure App Service**

---

## 📊 Future Enhancements

* 🔒 Role-based access control
* 📡 Real-time fraud monitoring (streaming)
* 📈 Integrate **Grafana/Kibana dashboards** with logs
* 🌍 Multi-region deployment for scalability

---

✅ Cleaned for your project setup: Firebase Auth + Azure DB + Azure Deployment.

Do you want me to also **add a professional architecture diagram** (boxes + arrows) for this README?
