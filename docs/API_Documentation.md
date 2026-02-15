# API Documentation

## Base URLs
- Backend API: `http://localhost:5000/api`
- ML Server: `http://localhost:8000/api`

## Authentication Endpoints

### Register User
**POST** `/auth/register`
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "analyst"
}
```

### Login
**POST** `/auth/login`
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

## Feedback Endpoints

### Submit Feedback
**POST** `/feedback`
```json
{
  "legislationId": "65a1b2c3d4e5f6g7h8i9j0k1",
  "submitterName": "John Doe",
  "submitterEmail": "john@example.com",
  "commentText": "This is my feedback...",
  "provision": "Section 4"
}
```

### Get All Feedbacks
**GET** `/feedback?legislationId=xxx&page=1&limit=10`

### Get Feedback by ID
**GET** `/feedback/:id`

## Analysis Endpoints

### Analyze Single Feedback
**POST** `/analysis/analyze/:feedbackId`

### Get Analysis Results
**GET** `/analysis/:feedbackId`

### Batch Analysis
**POST** `/analysis/batch`
```json
{
  "legislationId": "65a1b2c3d4e5f6g7h8i9j0k1"
}
```

## Dashboard Endpoints

### Get Dashboard Statistics
**GET** `/dashboard/stats/:legislationId`

### Get Sentiment Distribution
**GET** `/dashboard/sentiment/:legislationId`

### Get Top Keywords
**GET** `/dashboard/keywords/:legislationId?limit=20`

## ML Server Endpoints

### Sentiment Analysis
**POST** `/analyze/sentiment`
```json
{
  "text": "Your text here"
}
```

### Keyword Extraction
**POST** `/analyze/keywords`
```json
{
  "text": "Your text here",
  "top_n": 10
}
```

### Text Summarization
**POST** `/analyze/summarize`
```json
{
  "text": "Your text here",
  "max_length": 150
}
```