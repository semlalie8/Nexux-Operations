@echo off
echo ========================================================
echo Launching Nexus Operations Platform
echo ========================================================

echo.
echo [1/3] Tearing down existing containers...
docker compose down

echo.
echo [2/3] Building and starting new containers...
docker compose up -d --build

echo.
echo [3/3] Pulling Local Agentic AI Models into Ollama...
echo This may take a while depending on your internet connection.

docker exec nexus_ollama ollama pull qwen3.5:cloud
docker exec nexus_ollama ollama pull deepseek-r1:8b
docker exec nexus_ollama ollama pull qwen3.5:9b
docker exec nexus_ollama ollama pull gemma:7b
docker exec nexus_ollama ollama pull gemma4:E4B
docker exec nexus_ollama ollama pull gemma4:E2B
docker exec nexus_ollama ollama pull nomic-embed-text:latest

echo.
echo ========================================================
echo All Systems Operational! 
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:3001
echo ========================================================
pause
