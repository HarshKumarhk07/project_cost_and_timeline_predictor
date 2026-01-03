# Start Backend
Write-Host "Starting Backend on Port 5000..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; npm start"

# Start Frontend
Write-Host "Starting Frontend on Port 5173..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"

# Start ML Service
Write-Host "Starting ML Service on Port 5001..."
if (Test-Path "ml\venv") {
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd ml; .\.venv\Scripts\Activate.ps1; python app.py"
} else {
    Write-Host "ML venv not found, trying global python..."
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd ml; python app.py"
}

Write-Host "---------------------------------------------------"
Write-Host "Attempting to start all services..."
Write-Host "Frontend: http://localhost:5173"
Write-Host "Backend:  http://localhost:5000"
Write-Host "ML Service: http://localhost:5001"
Write-Host "---------------------------------------------------"
