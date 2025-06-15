# Copy the working music file to all levels for testing
# This copies bitchboys-song-3.wav to all other level slots

$musicDir = "public\music"
$sourceFile = "bitchboys-song-3.wav"
$sourcePath = Join-Path $musicDir $sourceFile

Write-Host "🎵 Copying Music File to All Levels" -ForegroundColor Green
Write-Host "====================================" -ForegroundColor Green

# Check if source file exists
if (!(Test-Path $sourcePath)) {
	Write-Host "❌ Source file not found: $sourcePath" -ForegroundColor Red
	Write-Host "Make sure bitchboys-song-3.wav exists in the music folder."
	Read-Host "Press Enter to exit"
	exit
}

Write-Host "📁 Source file: $sourcePath" -ForegroundColor Cyan
Write-Host "📁 Target directory: $musicDir" -ForegroundColor Cyan
Write-Host ""

# Copy to all levels
$levels = @(1, 2, 4, 5, 6, 7) # Skip 3 since it already exists

foreach ($level in $levels) {
	$targetFile = "bitchboys-song-$level.wav"
	$targetPath = Join-Path $musicDir $targetFile
    
	try {
		Copy-Item $sourcePath $targetPath -Force
		Write-Host "✅ Copied to: $targetFile" -ForegroundColor Green
	}
 catch {
		Write-Host "❌ Failed to copy to: $targetFile" -ForegroundColor Red
		Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
	}
}

Write-Host ""
Write-Host "🎵 All levels now have music files!" -ForegroundColor Green
Write-Host "You can now test any level with music." -ForegroundColor Green
Write-Host ""
Write-Host "📂 Music files created:" -ForegroundColor Cyan
Get-ChildItem $musicDir -Filter "*.wav" | ForEach-Object {
	Write-Host "   $($_.Name) ($([math]::Round($_.Length / 1MB, 1)) MB)" -ForegroundColor White
}

Write-Host ""
Read-Host "Press Enter to continue" 