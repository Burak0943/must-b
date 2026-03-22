# must-b installer for Windows (PowerShell)
# https://must-b.com
# Usage: irm https://must-b.com/install.ps1 | iex

$ErrorActionPreference = "Stop"
$MUSTB_VERSION = "1.2.2"
$NPM_PACKAGE = "@must-b/must-b@$MUSTB_VERSION"

Write-Host ""
Write-Host "  ╔══════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "  ║        must-b Installer v$MUSTB_VERSION        ║" -ForegroundColor Cyan
Write-Host "  ╚══════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Check for Node.js
try {
    $nodeVersion = (node -e "process.stdout.write(process.versions.node.split('.')[0])") -as [int]
} catch {
    Write-Host "  ✗ Node.js not found. Please install Node.js 18+ from https://nodejs.org" -ForegroundColor Red
    exit 1
}

if ($nodeVersion -lt 18) {
    Write-Host "  ✗ Node.js 18+ is required. Current version: $(node -v)" -ForegroundColor Red
    exit 1
}

Write-Host "  ✓ Node.js $(node -v) detected" -ForegroundColor Green

# Check for npm
try {
    $null = Get-Command npm -ErrorAction Stop
} catch {
    Write-Host "  ✗ npm not found. Please install npm." -ForegroundColor Red
    exit 1
}

Write-Host "  ↳ Installing $NPM_PACKAGE..."
npm install -g $NPM_PACKAGE

Write-Host ""
Write-Host "  ✓ must-b v$MUSTB_VERSION installed successfully." -ForegroundColor Green
Write-Host ""
Write-Host "  Run the following to start your agent:"
Write-Host "    must-b gateway" -ForegroundColor Cyan
Write-Host ""
