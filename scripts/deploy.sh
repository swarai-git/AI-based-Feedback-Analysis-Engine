#!/bin/bash

echo "🚀 Deploying application..."

# Build frontend
cd frontend
npm run build
cd ..

# Start services with Docker
cd docker
docker-compose up -d --build

echo " Deployment complete!"
echo " Frontend: http://localhost"
echo " Backend API: http://localhost:5000"
echo " ML Server: http://localhost:8000"