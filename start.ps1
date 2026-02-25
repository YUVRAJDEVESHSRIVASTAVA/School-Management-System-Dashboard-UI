# ── School Management System - Start Script ──────────────────────────────────
# Starts both the backend (port 8080) and frontend (port 5500)

$ROOT = Split-Path -Parent $MyInvocation.MyCommand.Path
$JAR  = "$ROOT\backend\target\school-management-system-1.0.0.jar"
$JAVA = "C:\Program Files\Java\jdk-21\bin\java.exe"

# Kill anything already on 8080 or 5500
foreach ($port in @(8080, 5500)) {
    $pids = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue |
            Select-Object -ExpandProperty OwningProcess -Unique
    $pids | ForEach-Object { Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue }
}
Start-Sleep -Seconds 1

# Build JAR if it doesn't exist
if (-not (Test-Path $JAR)) {
    Write-Host "Building backend JAR..." -ForegroundColor Cyan
    $env:JAVA_HOME = "C:\Program Files\Java\jdk-21"
    $env:PATH = "C:\Program Files\Java\jdk-21\bin;C:\Users\yuvra\.maven\maven-3.9.12\bin;$env:PATH"
    Push-Location "$ROOT\backend"
    mvn package -DskipTests -q
    Pop-Location
}

# Start backend
Write-Host "Starting backend on http://localhost:8080 ..." -ForegroundColor Green
Start-Process -FilePath $JAVA -ArgumentList "-jar `"$JAR`"" -WindowStyle Minimized

# Start frontend (serve from frontend/ folder so 127.0.0.1:5500 → index.html)
Write-Host "Starting frontend on http://127.0.0.1:5500 ..." -ForegroundColor Green
Start-Process -FilePath "python" -ArgumentList "-m http.server 5500" -WorkingDirectory "$ROOT\frontend" -WindowStyle Minimized

# Wait and confirm
Start-Sleep -Seconds 8
$be = Invoke-WebRequest "http://localhost:8080/api/students" -UseBasicParsing -ErrorAction SilentlyContinue
$fe = Invoke-WebRequest "http://127.0.0.1:5500/frontend/pages/dashboard.html" -UseBasicParsing -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host " Backend  → http://localhost:8080  [$( if($be) {'✓ UP'} else {'✗ FAILED'} )]" -ForegroundColor $(if($be){'Green'}else{'Red'})
Write-Host " Frontend → http://127.0.0.1:5500  [$( if($fe) {'✓ UP'} else {'✗ FAILED'} )]" -ForegroundColor $(if($fe){'Green'}else{'Red'})
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""
Write-Host "Open: http://127.0.0.1:5500/frontend/pages/dashboard.html" -ForegroundColor Yellow
