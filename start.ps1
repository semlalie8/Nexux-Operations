# ═══════════════════════════════════════════════════════════════
#  Nexus Operations — Platform Launcher
#  Usage:  .\start.ps1
# ═══════════════════════════════════════════════════════════════

$ErrorActionPreference = "Stop"

function Write-Step($msg) {
    Write-Host ""
    Write-Host "  ▶  $msg" -ForegroundColor Cyan
}

function Write-Ok($msg) {
    Write-Host "  ✔  $msg" -ForegroundColor Green
}

function Write-Fail($msg) {
    Write-Host "  ✘  $msg" -ForegroundColor Red
    exit 1
}

Clear-Host
Write-Host ""
Write-Host "  ╔══════════════════════════════════════╗" -ForegroundColor DarkCyan
Write-Host "  ║     NEXUS OPERATIONS  —  LAUNCHER    ║" -ForegroundColor Cyan
Write-Host "  ╚══════════════════════════════════════╝" -ForegroundColor DarkCyan
Write-Host ""

# ── 1. Check Docker is installed ────────────────────────────────
Write-Step "Checking Docker..."
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Fail "Docker not found. Install Docker Desktop from https://www.docker.com/products/docker-desktop"
}
Write-Ok "Docker found."

# ── 2. Check Docker daemon is running ───────────────────────────
Write-Step "Checking Docker daemon..."
$dockerInfo = docker info 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Fail "Docker daemon is not running. Please start Docker Desktop and try again."
}
Write-Ok "Docker daemon is running."

# ── 3. Build images (skipped if already up-to-date) ─────────────
Write-Step "Building images (skipped if cached)..."
docker compose build
if ($LASTEXITCODE -ne 0) {
    Write-Fail "docker compose build failed. Check the output above."
}
Write-Ok "Images ready."

# ── 4. Bring the stack up (detached) ────────────────────────────
Write-Step "Starting all services (Postgres + API + Frontend)..."
docker compose up -d
if ($LASTEXITCODE -ne 0) {
    Write-Fail "docker compose up failed. Check the output above."
}
Write-Ok "All containers started."

# ── 5. Wait for the API to be healthy ───────────────────────────
Write-Step "Waiting for API to be ready..."
$maxAttempts = 30
$attempt = 0
$ready = $false
while ($attempt -lt $maxAttempts) {
    Start-Sleep -Seconds 2
    $attempt++
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3001/health" -UseBasicParsing -TimeoutSec 2 -ErrorAction SilentlyContinue
        if ($response.StatusCode -eq 200) {
            $ready = $true
            break
        }
    } catch {}
    Write-Host "  …  Attempt $attempt/$maxAttempts" -ForegroundColor DarkGray
}

if (-not $ready) {
    Write-Host ""
    Write-Host "  ⚠  API did not respond in time — it may still be starting." -ForegroundColor Yellow
    Write-Host "     Check logs with:  docker compose logs api" -ForegroundColor DarkGray
} else {
    Write-Ok "API is healthy."
}

# ── 6. Open browser ─────────────────────────────────────────────
Write-Step "Opening Nexus Operations in your browser..."
Start-Sleep -Seconds 2
Start-Process "http://localhost:3000"

# ── 7. Summary ──────────────────────────────────────────────────
Write-Host ""
Write-Host "  ╔══════════════════════════════════════════╗" -ForegroundColor DarkGreen
Write-Host "  ║        NEXUS OPERATIONS IS LIVE          ║" -ForegroundColor Green
Write-Host "  ╠══════════════════════════════════════════╣" -ForegroundColor DarkGreen
Write-Host "  ║  Frontend  →  http://localhost:3000      ║" -ForegroundColor White
Write-Host "  ║  API       →  http://localhost:3001      ║" -ForegroundColor White
Write-Host "  ║  Database  →  localhost:5432             ║" -ForegroundColor White
Write-Host "  ╠══════════════════════════════════════════╣" -ForegroundColor DarkGreen
Write-Host "  ║  Logs:   docker compose logs -f          ║" -ForegroundColor DarkGray
Write-Host "  ║  Stop:   docker compose down             ║" -ForegroundColor DarkGray
Write-Host "  ╚══════════════════════════════════════════╝" -ForegroundColor DarkGreen
Write-Host ""
