# Download Test Music for Level 3 Beat Detection
# This script helps you get a test music file for Level 3

Write-Host "🎵 VJ Game Test Music Setup" -ForegroundColor Green
Write-Host "============================" -ForegroundColor Green
Write-Host ""

$musicDir = "public\music"

# Create music directory if it doesn't exist
if (!(Test-Path $musicDir)) {
	New-Item -ItemType Directory -Path $musicDir -Force
	Write-Host "✅ Created directory: $musicDir" -ForegroundColor Green
}

Write-Host "For Level 3 beat detection testing, you need a music file with a clear beat." -ForegroundColor Yellow
Write-Host ""
Write-Host "🎯 RECOMMENDED SOURCES:" -ForegroundColor Cyan
Write-Host "1. YouTube Audio Library (https://studio.youtube.com/channel/UC.../music)" -ForegroundColor White
Write-Host "2. Freesound.org - Search '120 bpm loop'" -ForegroundColor White
Write-Host "3. Any electronic/house music track (~120 BPM)" -ForegroundColor White
Write-Host "4. Metronome track (search '120 BPM metronome' on YouTube)" -ForegroundColor White
Write-Host ""
Write-Host "🎼 IDEAL CHARACTERISTICS:" -ForegroundColor Cyan
Write-Host "• 120 BPM (beats per minute)" -ForegroundColor White
Write-Host "• Clear, steady drum beat" -ForegroundColor White
Write-Host "• Electronic/EDM/House genre works best" -ForegroundColor White
Write-Host "• At least 1-2 minutes long (will loop)" -ForegroundColor White
Write-Host ""

Write-Host "📂 SETUP STEPS:" -ForegroundColor Cyan
Write-Host "1. Download a music file (.wav or .mp3)" -ForegroundColor White
Write-Host "2. Rename it to: bitchboys-song-3.wav (or .mp3)" -ForegroundColor White
Write-Host "3. Place it in: $musicDir" -ForegroundColor White
Write-Host "4. Run: .\start-dev.ps1" -ForegroundColor White
Write-Host "5. Test Level 3 beat detection!" -ForegroundColor White
Write-Host ""

# Check if test file already exists
$testFiles = @("bitchboys-song-3.wav", "bitchboys-song-3.mp3", "bitchboys-song-3.ogg")
$existingFile = $null

foreach ($file in $testFiles) {
	$fullPath = Join-Path $musicDir $file
	if (Test-Path $fullPath) {
		$existingFile = $file
		break
	}
}

if ($existingFile) {
	Write-Host "✅ Found existing test music: $existingFile" -ForegroundColor Green
	Write-Host "   Ready to test! Run: .\start-dev.ps1" -ForegroundColor Green
}
else {
	Write-Host "⚠️  No Level 3 music file found yet." -ForegroundColor Yellow
	Write-Host "   Place your test track in: $musicDir\bitchboys-song-3.wav" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🎮 TESTING THE BEAT DETECTION:" -ForegroundColor Cyan
Write-Host "• Start Level 3 in the game" -ForegroundColor White
Write-Host "• Watch for the green beat indicator" -ForegroundColor White
Write-Host "• Press buttons 1-4 when it turns GREEN" -ForegroundColor White
Write-Host "• The game detects if you're 'on the beat'" -ForegroundColor White
Write-Host ""

Read-Host "Press Enter to continue" 