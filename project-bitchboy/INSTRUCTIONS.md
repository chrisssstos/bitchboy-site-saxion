# VJ Game Instructions

## Running the Game

### Option 1: Use the PowerShell Script (Recommended)
```powershell
.\start-dev.ps1
```

### Option 2: Manual Commands
```powershell
cd project-bitchboy; npm run dev
```

## Adding Music Files

The game now supports real music files! Place your music files in `public/music/` with these exact names:

- `bitchboys-song-1.wav` (or .mp3) - Level 1 music
- `bitchboys-song-2.wav` (or .mp3) - Level 2 music  
- `bitchboys-song-3.wav` (or .mp3) - Level 3 music (BEAT DETECTION)
- `bitchboys-song-4.wav` (or .mp3) - Level 4 music
- `bitchboys-song-5.wav` (or .mp3) - Level 5 music
- `bitchboys-song-6.wav` (or .mp3) - Level 6 music
- `bitchboys-song-7.wav` (or .mp3) - Level 7 music
- `fail.wav` (or .mp3) - Failure sound effect

### From Original Java Code
If you have the original music files from the Java version, they were located at:
`C:\Users\hrist\Pictures\bitchboy\Assets\`

Copy those files to `public/music/` and rename them to match the names above.

### Supported Formats
- .wav (recommended for best quality)
- .mp3 
- .ogg

The game will automatically detect and use these files when available. If no music files are found, it will fall back to simple beat sounds.

## Music Features

- **Level-specific music**: Each level plays its own track
- **Beat detection**: Levels 3, 5, and 7 synchronize button presses to the music beat
- **Loop playback**: Music loops continuously during each level
- **Fail sounds**: Special sound effects for mistakes
- **Automatic volume**: Music volume is optimized for gameplay

## PowerShell Note

Windows PowerShell doesn't support the `&&` operator. Use `;` instead:
- ❌ `cd project-bitchboy && npm run dev` 
- ✅ `cd project-bitchboy; npm run dev`

The provided `start-dev.ps1` script handles this automatically. 