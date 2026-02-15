# AI-based-Feedback-Analysis-Engine

A full-stack AI-powered feedback analysis platform that processes citizen/user feedback, performs sentiment analysis, extracts keywords, matches legislation, and visualizes insights through Power BI dashboards.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [ML Server](#ml-server)
- [Power BI Dashboard](#power-bi-dashboard)
- [Database](#database)
- [Deployment](#deployment)

---

## 🧠 Overview

This system allows users to:
- Submit feedback which is automatically analyzed using AI/ML
- View sentiment scores (positive / neutral / negative)
- Extract keywords and match them against legislation
- Get AI-generated text summaries
- View all insights through interactive Power BI dashboards

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React + Vite (port 5173) |
| **Backend** | Node.js + Express (port 5000) |
| **Database** | MongoDB (local or Atlas) |
| **ML Server** | Python + Flask (port 5001) |
| **Auth** | JWT (JSON Web Tokens) |
| **File Uploads** | Multer |
| **Dashboards** | Microsoft Power BI |
| **Email** | Nodemailer (emailService.js) |
| **Containerization** | Docker |

---

## 📁 Project Structure

```
project/
│
├── backend/                        # Node.js Express API
│   ├── config/
│   │   ├── constants.js            # App-wide constants
│   │   └── database.js             # MongoDB connection config
│   │
│   ├── controllers/                # Route logic
│   │   ├── adminController.js
│   │   ├── analysisController.js
│   │   ├── authController.js
│   │   ├── dashboardController.js
│   │   ├── feedbackController.js
│   │   ├── legislationController.js
│   │   └── uploadController.js
│   │
│   ├── middleware/
│   │   ├── auth.js                 # JWT verification
│   │   ├── upload.js               # Multer file handling
│   │   └── validation.js           # Request validation
│   │
│   ├── models/                     # MongoDB Schemas
│   │   ├── AnalysisResult.js
│   │   ├── Feedback.js
│   │   ├── Legislation.js
│   │   ├── PendingVerification.js
│   │   └── User.js
│   │
│   ├── routes/
│   │   ├── admin.js
│   │   ├── analysis.js
│   │   ├── auth.js
│   │   ├── dashboard.js
│   │   ├── feedback.js
│   │   ├── legislation.js
│   │   ├── powerbi.js              # ← Power BI data endpoints
│   │   └── upload.js
│   │
│   ├── services/
│   │   ├── aiSimilarityService.js  # AI similarity matching
│   │   ├── emailService.js         # Email notifications
│   │   └── similarityService.js    # Text similarity logic
│   │
│   ├── uploads/                    # Uploaded files (auto-created)
│   ├── .env                        # Environment variables
│   ├── server.js                   # Main entry point
│   └── package.json
│
├── ml-server/                      # Python Flask ML microservice
│   ├── services/
│   │   ├── keyword_analysis.py     # Keyword extraction
│   │   ├── preprocessing.py        # Text cleaning
│   │   ├── sentiment_analysis.py   # Sentiment scoring
│   │   └── text_summarization.py   # AI summarization
│   ├── app.py                      # Flask entry point
│   ├── requirements.txt            # Python dependencies
│   └── test_api.py                 # API tests
│
├── frontend/                       # React application
│
├── powerbi-dashboards/             # Power BI .pbix files
│   ├── main-dashboard.pbix
│   └── README.md
│
├── database/scripts/
│   ├── backup_script.js
│   ├── init_db.js                  # DB initialization
│   └── sample_data.js              # Sample seed data
│
├── docs/
│   ├── API_Documentation.md
│   ├── ML_Models.md
│   └── Setup_Guide.md
│
├── scripts/
│   ├── deploy.sh                   # Linux deployment script
│   └── setup.bat                   # Windows setup script
│
└── docker/                         # Docker configuration
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have these installed:
- [Node.js](https://nodejs.org/) v18+
- [Python](https://python.org/) 3.9+
- [MongoDB](https://mongodb.com/) (local) or a MongoDB Atlas account
- [Git](https://git-scm.com/)

---

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

---

### 2. Setup the Backend

```bash
cd backend
npm install
```

Create your `.env` file (see [Environment Variables](#environment-variables) section below).

```bash
# Start the backend server
npm start
```

Backend will run at: `http://localhost:5000`

---

### 3. Setup the ML Server

```bash
cd ml-server
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

pip install -r requirements.txt
python app.py
```

ML Server will run at: `http://localhost:5001`

---

### 4. Setup the Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend will run at: `http://localhost:5173`

---

### 5. Initialize the Database (Optional)

```bash
cd database/scripts
node init_db.js        # Creates collections and indexes
node sample_data.js    # Loads sample data for testing
```

---

## ⚙️ Environment Variables

Create a `.env` file inside the `backend/` folder:

```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB
MONGO_URI=mongodb://localhost:27017/your_database_name

# JWT Authentication
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d

# ML Server
ML_SERVER_URL=http://localhost:5001

# CORS - Frontend URL
ALLOWED_ORIGINS=http://localhost:5173

# Email (optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

> ⚠️ Never commit your `.env` file to Git. It is already in `.gitignore`.

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login and get JWT token |
| GET | `/api/auth/me` | Get current user profile |

### Feedback
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/feedback` | Get all feedback |
| POST | `/api/feedback` | Submit new feedback |
| GET | `/api/feedback/:id` | Get single feedback |
| DELETE | `/api/feedback/:id` | Delete feedback |

### Analysis
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/analysis` | Get all analysis results |
| POST | `/api/analysis/run` | Run analysis on feedback |
| GET | `/api/analysis/:id` | Get single analysis result |

### Legislation
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/legislation` | Get all legislation |
| POST | `/api/legislation` | Add new legislation |
| GET | `/api/legislation/:id` | Get single legislation |

### Dashboard
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/dashboard/stats` | Get dashboard statistics |
| GET | `/api/dashboard/trends` | Get trend data |

### Power BI Data
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/powerbi/summary` | KPI summary numbers |
| GET | `/api/powerbi/analyses` | All analysis results |
| GET | `/api/powerbi/feedback` | All feedback data |

### Health
| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Server health check |

---

## 🐍 ML Server

The Python Flask ML server provides 4 AI services:

| Service | File | Description |
|---|---|---|
| Sentiment Analysis | `sentiment_analysis.py` | Scores text as positive/neutral/negative |
| Keyword Extraction | `keyword_analysis.py` | Extracts top keywords from text |
| Text Summarization | `text_summarization.py` | Generates short AI summaries |
| Preprocessing | `preprocessing.py` | Cleans and normalizes text |

### ML API Endpoints

```
POST http://localhost:5001/sentiment     → { score, label }
POST http://localhost:5001/keywords      → { keywords: [] }
POST http://localhost:5001/summarize     → { summary }
GET  http://localhost:5001/stats         → aggregated stats for Power BI
GET  http://localhost:5001/health        → health check
```

---

## 📊 Power BI Dashboard

### Setup Steps
1. Install [Power BI Desktop](https://microsoft.com/en-us/power-platform/products/power-bi/desktop) (Windows only)
2. Start your backend server (`npm start` in `/backend`)
3. Open Power BI Desktop → Get Data → Web
4. Enter: `http://localhost:5000/api/powerbi/analyses`
5. Load data and build visuals

### Available Dashboard Pages

| Page | Visual Type | Data Source |
|---|---|---|
| Overview | KPI Cards | `/api/powerbi/summary` |
| Sentiment Analysis | Pie Chart | `sentiment` field |
| Score Trends | Line Chart | `sentimentScore` + `analyzedAt` |
| Category Breakdown | Bar Chart | `category` field |
| Keyword Cloud | Word Cloud | `keywords.*` fields |

### Saving Dashboards
Save all `.pbix` files to the `powerbi-dashboards/` folder.

---

## 🗄️ Database

### MongoDB Collections

| Collection | Model File | Description |
|---|---|---|
| `users` | `User.js` | User accounts and roles |
| `feedbacks` | `Feedback.js` | Submitted feedback entries |
| `analysisresults` | `AnalysisResult.js` | ML analysis output |
| `legislations` | `Legislation.js` | Legislation records |
| `pendingverifications` | `PendingVerification.js` | Email verifications |

### Database Scripts

```bash
# Initialize database with indexes
node database/scripts/init_db.js

# Load sample/test data
node database/scripts/sample_data.js

# Backup database
node database/scripts/backup_script.js
```

---

## 🐳 Docker Deployment

```bash
# Build and run all services
cd docker
docker-compose up --build

# Run in background
docker-compose up -d

# Stop all services
docker-compose down
```

---

## 📦 Deployment

### Windows (Development)
```bat
scripts\setup.bat
```

### Linux (Production)
```bash
chmod +x scripts/deploy.sh
./scripts/deploy.sh
```

---

## 🔐 Authentication

This API uses **JWT (JSON Web Tokens)**:

1. Register or login to receive a token
2. Include the token in all protected requests:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## 📝 Running All Services Together

Open **3 separate terminals**:

```bash
# Terminal 1 - Backend
cd backend && npm start

# Terminal 2 - ML Server
cd ml-server && python app.py

# Terminal 3 - Frontend
cd frontend && npm run dev
```

Then open: `http://localhost:5173`

---

## 🧪 Testing

```bash
# Test ML server endpoints
cd ml-server
python test_api.py

# Test backend health
curl http://localhost:5000/health

# Test Power BI endpoints
curl http://localhost:5000/api/powerbi/summary
```

---

## 📚 Documentation

Full documentation is available in the `/docs` folder:

- `API_Documentation.md` — complete API reference
- `ML_Models.md` — ML model details and accuracy metrics
- `Setup_Guide.md` — detailed setup instructions

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "Add your feature"`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

> Built with ❤️ using Node.js, Python, MongoDB, and Power BI
