@echo off
setlocal

cls
echo.
echo   ==========================================
echo      NEXUS OPERATIONS  --  LAUNCHER
echo   ==========================================
echo.

:: -- 1. Check Docker is installed
echo   [1/5] Checking Docker...
where docker >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo   ERROR: Docker not found.
    echo   Install Docker Desktop from https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)
echo   OK    Docker found.

:: -- 2. Check Docker daemon is running
echo   [2/5] Checking Docker daemon...
docker info >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo   ERROR: Docker daemon is not running.
    echo   Please start Docker Desktop and try again.
    pause
    exit /b 1
)
echo   OK    Docker daemon is running.

:: -- 3. Build images
echo   [3/5] Building images (cached layers will be skipped)...
docker compose build
if %ERRORLEVEL% neq 0 (
    echo   ERROR: docker compose build failed. See output above.
    pause
    exit /b 1
)
echo   OK    Images ready.

:: -- 4. Start all containers in background
echo   [4/5] Starting Postgres + API + Frontend...
docker compose up -d
if %ERRORLEVEL% neq 0 (
    echo   ERROR: docker compose up failed. See output above.
    pause
    exit /b 1
)
echo   OK    All containers started.

:: -- 5. Wait for API health check
echo   [5/5] Waiting for API to be ready...
set /a attempt=0
:healthloop
set /a attempt+=1
if %attempt% gtr 30 (
    echo   WARN: API did not respond after 60s. It may still be starting.
    echo         Check logs with: docker compose logs api
    goto :open
)
ping 127.0.0.1 -n 3 >nul
curl -s -o nul -w "%%{http_code}" http://localhost:3001/health 2>nul | findstr "200" >nul
if %ERRORLEVEL% neq 0 (
    echo         Attempt %attempt%/30...
    goto :healthloop
)
echo   OK    API is healthy.

:open
:: -- Open browser
echo.
echo   Opening Nexus Operations in your browser...
timeout /t 2 /nobreak >nul
start http://localhost:3000

:: -- Summary
echo.
echo   ==========================================
echo      NEXUS OPERATIONS IS LIVE
echo   ==========================================
echo   Frontend  ->  http://localhost:3000
echo   API       ->  http://localhost:3001
echo   Database  ->  localhost:5432
echo   ------------------------------------------
echo   Logs :  docker compose logs -f
echo   Stop :  docker compose down
echo   ==========================================
echo.

endlocal
