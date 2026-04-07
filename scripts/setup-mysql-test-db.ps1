param(
    [string]$Database = 'college_management',
    [string]$User = 'root',
    [string]$Password = ''
)

$ErrorActionPreference = 'Stop'
$repoRoot = Split-Path -Parent $PSScriptRoot
$sqlFile = Join-Path $repoRoot 'database\mysql\001_college_management_setup.sql'
$mysqlExe = 'C:\xampp\mysql\bin\mysql.exe'

if (-not (Test-Path $mysqlExe)) {
    throw "MySQL client not found at $mysqlExe"
}

Write-Host "Importing MySQL setup script into $Database..." -ForegroundColor Cyan

$mysqlArgs = @('-u', $User)
if ($Password -ne '') {
    $mysqlArgs += "-p$Password"
}

Get-Content -Raw $sqlFile | & $mysqlExe @mysqlArgs

$summaryArgs = @('-u', $User)
if ($Password -ne '') {
    $summaryArgs += "-p$Password"
}
$summaryArgs += @('-D', $Database, '-e', "SHOW TABLES; SELECT COUNT(*) AS users_count FROM users; SELECT COUNT(*) AS enquiries_count FROM enquiries; SELECT COUNT(*) AS certificates_count FROM certificate_requests;")

& $mysqlExe @summaryArgs

Write-Host "MySQL test database is ready." -ForegroundColor Green
Write-Host "Demo login: superadmin / Password@123" -ForegroundColor Cyan
