Y# Start VJ Game Development Server
# This script handles PowerShell compatibility issues

Write-Host "🎮 Starting VJ Game Development Server..." -ForegroundColor Green

# Check if we're in the right directory
if (!(Test-Path "package.json")) {
	Write-Host "❌ package.json not found. Make sure you're in the project-bitchboy directory." -ForegroundColor Red
	Read-Host "Press Enter to exit"
	exit 1
}

# Check if node_modules exists
if (!(Test-Path "node_modules")) {
	Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
	npm install
}

# Start the development server
Write-Host "🚀 Starting Vite development server..." -ForegroundColor Cyan
npm run dev 