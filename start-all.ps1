# ============================================================
#  Stark Market - Start All Services
#  Run this from the project root directory:
#  .\start-all.ps1
# ============================================================

$root = $PSScriptRoot

function Start-Service {
    param(
        [string]$Name,
        [string]$Dir,
        [string]$Color = "Cyan"
    )
    Write-Host "  >> Starting $Name..." -ForegroundColor $Color
    Start-Process powershell -ArgumentList "-NoExit", "-Command", `
        "cd '$root\$Dir'; `$host.UI.RawUI.WindowTitle = '$Name'; Write-Host '=== $Name ===' -ForegroundColor Green; mvn spring-boot:run"
}

Clear-Host
Write-Host ""
Write-Host "  ============================================" -ForegroundColor Magenta
Write-Host "    STARK MARKET - Microservices Launcher    " -ForegroundColor Magenta
Write-Host "  ============================================" -ForegroundColor Magenta
Write-Host ""

# ── 1. Discovery Server ──────────────────────────────────────
Start-Service -Name "Discovery Server (Eureka :8761)" -Dir "discovery-server" -Color "Yellow"
Write-Host "  Waiting 15s for Eureka to be ready..." -ForegroundColor DarkGray
Start-Sleep -Seconds 15

# ── 2. Config Server ─────────────────────────────────────────
Start-Service -Name "Config Server (:8888)" -Dir "config-server" -Color "Yellow"
Write-Host "  Waiting 10s for Config Server to be ready..." -ForegroundColor DarkGray
Start-Sleep -Seconds 10

# ── 3. API Gateway ───────────────────────────────────────────
Start-Service -Name "API Gateway (:8080)" -Dir "api-gateway" -Color "Green"
Start-Sleep -Seconds 5

# ── 4. Product Service ───────────────────────────────────────
Start-Service -Name "Product Service (:8081)" -Dir "product-service" -Color "Cyan"
Start-Sleep -Seconds 3

# ── 5. Order Service ─────────────────────────────────────────
Start-Service -Name "Order Service (:8082)" -Dir "order-service" -Color "Cyan"
Start-Sleep -Seconds 3

# ── 6. Inventory Service ─────────────────────────────────────
Start-Service -Name "Inventory Service (:8083)" -Dir "inventory-service" -Color "Cyan"
Start-Sleep -Seconds 3

# ── 7. User Service ──────────────────────────────────────────
Start-Service -Name "User Service (:8084)" -Dir "user-service" -Color "Cyan"
Start-Sleep -Seconds 3

# ── 8. Frontend ──────────────────────────────────────────────
Write-Host "  >> Starting Frontend (Vite :5173)..." -ForegroundColor Blue
Start-Process powershell -ArgumentList "-NoExit", "-Command", `
    "cd '$root\frontend'; `$host.UI.RawUI.WindowTitle = 'Frontend (Vite)'; Write-Host '=== Frontend ===' -ForegroundColor Blue; npm run dev"

Write-Host ""
Write-Host "  ============================================" -ForegroundColor Magenta
Write-Host "   All services launched in separate windows  " -ForegroundColor Green
Write-Host "  ============================================" -ForegroundColor Magenta
Write-Host ""
Write-Host "  Service URLs:" -ForegroundColor White
Write-Host "    Frontend    -> http://localhost:5173" -ForegroundColor Blue
Write-Host "    API Gateway -> http://localhost:8080" -ForegroundColor Green
Write-Host "    Eureka      -> http://localhost:8761" -ForegroundColor Yellow
Write-Host "    Config      -> http://localhost:8888" -ForegroundColor Yellow
Write-Host ""
Write-Host "  Tip: Close individual windows to stop a service." -ForegroundColor DarkGray
Write-Host ""
