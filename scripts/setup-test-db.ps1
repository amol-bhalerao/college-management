param(
    [switch]$ResetOnly
)

$ErrorActionPreference = 'Stop'
$repoRoot = Split-Path -Parent $PSScriptRoot
$backendPath = Join-Path $repoRoot 'backend'
$dbFile = Join-Path $backendPath 'writable\database.sqlite'

Write-Host "Preparing local test database..." -ForegroundColor Cyan

if (-not (Test-Path $dbFile)) {
    New-Item -ItemType File -Path $dbFile -Force | Out-Null
    Write-Host "Created database file at $dbFile" -ForegroundColor Green
}

Push-Location $backendPath
try {
    php spark migrate:refresh --all

    if (-not $ResetOnly) {
        php spark db:seed DemoSeeder
    }
}
finally {
    Pop-Location
}

Write-Host "Database is ready for testing." -ForegroundColor Green
Write-Host "Demo login: superadmin / Password@123" -ForegroundColor Cyan
