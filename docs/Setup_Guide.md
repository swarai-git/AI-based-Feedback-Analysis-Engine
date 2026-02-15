# Setup Guide

## Prerequisites
- Node.js 18+ 
- Python 3.11+
- MongoDB 7.0+
- Git

## Installation Steps

### 1. Clone Repository
```bash
git clone <your-repo-url>
cd ai-feedback-analysis-system
```

### 2. Setup Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

### 3. Setup Frontend
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

### 4. Setup ML Server
```bash
cd ml-server
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python -m spacy download en_core_web_sm
python app.py
```

### 5. Initialize Database
```bash
cd database/scripts
node init_db.js
node sample_data.js
```

## Running with Docker
```bash
cd docker
docker-compose up -d
```