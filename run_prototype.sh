#!/bin/bash

echo "🚀 Starting Nutrition Tracker Prototype"
echo "========================================"

command -v poetry >/dev/null 2>&1 || { echo "❌ Poetry is required but not installed. Please install Poetry first."; exit 1; }
command -v npm >/dev/null 2>&1 || { echo "❌ npm is required but not installed. Please install Node.js and npm first."; exit 1; }

echo "📦 Starting FastAPI backend..."
cd backend
poetry install --quiet
poetry run fastapi dev app/main.py &
BACKEND_PID=$!
echo "✅ Backend started on http://localhost:8000 (PID: $BACKEND_PID)"

sleep 3

echo "🎨 Starting React frontend..."
cd ../frontend
npm install --silent
npm run dev &
FRONTEND_PID=$!
echo "✅ Frontend started on http://localhost:5173 (PID: $FRONTEND_PID)"

echo ""
echo "🎉 Prototype is running!"
echo "📱 Frontend: http://localhost:5173"
echo "🔧 Backend API: http://localhost:8000"
echo "📚 API Docs: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop both servers"

cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "✅ Servers stopped"
    exit 0
}

trap cleanup SIGINT SIGTERM

wait
