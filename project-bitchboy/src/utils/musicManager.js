// Music Manager for VJ Game
// Handles loading, playing, and beat detection for music files

class MusicManager {
	constructor() {
		this.audioContext = null;
		this.currentAudio = null;
		this.currentLevel = null;
		this.beatCallback = null;
		this.isPlaying = false;
		this.beatInterval = null;
		this.musicFiles = {};
		this.failSound = null;

		// Initialize audio context
		this.initAudioContext();

		// Preload music files
		this.loadMusicFiles();
	}

	async initAudioContext() {
		try {
			this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
		} catch (error) {
			console.warn('Web Audio API not supported, falling back to basic audio');
		}
	}

	async loadMusicFiles() {
		const musicFiles = [
			'bitchboys-song-1',
			'bitchboys-song-2',
			'bitchboys-song-3',
			'bitchboys-song-4',
			'bitchboys-song-5',
			'bitchboys-song-6',
			'bitchboys-song-7'
		];

		const extensions = ['mp3', 'wav', 'ogg']; // Try mp3 first since that's what we have

		console.log('🎵 Starting to load music files...');

		for (const file of musicFiles) {
			let fileFound = false;
			for (const ext of extensions) {
				try {
					// First, check if file exists using fetch (avoids audio errors)
					const response = await fetch(`/music/${file}.${ext}`, { method: 'HEAD' });
					if (!response.ok) {
						continue; // File doesn't exist, try next extension
					}

					// File exists, now create audio element
					const audio = new Audio(`/music/${file}.${ext}`);
					audio.preload = 'metadata';

					// Test if file can be loaded as audio
					await new Promise((resolve, reject) => {
						const timeout = setTimeout(() => {
							reject(new Error('Load timeout'));
						}, 3000); // 3 second timeout

						audio.addEventListener('canplaythrough', () => {
							clearTimeout(timeout);
							resolve();
						}, { once: true });

						audio.addEventListener('error', (e) => {
							clearTimeout(timeout);
							reject(e);
						}, { once: true });

						audio.load();
					});

					this.musicFiles[file] = audio;
					console.log(`✅ Successfully loaded: ${file}.${ext} (Duration: ${audio.duration}s)`);
					fileFound = true;
					break; // Found this file, move to next
				} catch (error) {
					// File doesn't exist or can't load, try next extension
					continue;
				}
			}

			if (!fileFound) {
				console.log(`⚠️ No file found for ${file} in any format`);
			}
		}

		// Load fail sound
		for (const ext of extensions) {
			try {
				const audio = new Audio(`/music/fail.${ext}`);
				audio.preload = 'metadata';

				await new Promise((resolve, reject) => {
					audio.addEventListener('canplaythrough', resolve, { once: true });
					audio.addEventListener('error', reject, { once: true });
					audio.load();
				});

				this.failSound = audio;
				console.log(`✅ Loaded fail sound: fail.${ext}`);
				break;
			} catch (error) {
				continue;
			}
		}

		console.log('🎵 Music Manager initialized. Available files:', Object.keys(this.musicFiles));
	}

	playLevel(level, beatCallback = null) {
		console.log(`🎵 playLevel called for level ${level}`);
		this.stop(); // Stop any current music

		const musicKey = `bitchboys-song-${level}`;
		let audio = this.musicFiles[musicKey];

		console.log(`🔍 Looking for music key: ${musicKey}, Available:`, Object.keys(this.musicFiles));

		// If no preloaded audio, try to create one directly
		if (!audio) {
			console.log(`🔄 No preloaded audio, trying direct load for level ${level}`);
			const extensions = ['mp3', 'wav', 'ogg'];

			for (const ext of extensions) {
				try {
					audio = new Audio(`/music/bitchboys-song-${level}.${ext}`);
					audio.preload = 'auto';
					console.log(`🎵 Trying direct load: /music/bitchboys-song-${level}.${ext}`);
					break;
				} catch (error) {
					continue;
				}
			}
		}

		if (!audio) {
			console.warn(`❌ No music file found for level ${level}, using fallback beat`);
			this.playFallbackBeat(beatCallback);
			return;
		}

		console.log(`✅ Found audio for level ${level}, attempting to play...`);

		this.currentAudio = audio;
		this.currentLevel = level;
		this.beatCallback = beatCallback;

		// Set up looping
		audio.loop = true;
		audio.volume = 0.7; // Set reasonable volume

		console.log(`🔊 Audio ready: duration=${audio.duration}s, state=${audio.readyState}`);

		// Start playback
		console.log(`🎵 Attempting to play audio...`);
		audio.play().then(() => {
			this.isPlaying = true;
			console.log(`🎵 ✅ MUSIC IS PLAYING! Level ${level} music started successfully!`);
			console.log(`🎵 Current time: ${audio.currentTime}, Duration: ${audio.duration}`);

			// Start beat detection for this track
			if (beatCallback) {
				console.log(`🥁 Starting beat detection for level ${level}`);
				this.startBeatDetection(audio);
			}
		}).catch(error => {
			console.error(`❌ Failed to play level ${level} music:`, error);
			console.error(`❌ Error details:`, {
				name: error.name,
				message: error.message,
				code: error.code
			});
			console.log(`🔄 Falling back to silent beat detection`);
			this.playFallbackBeat(beatCallback);
		});
	}

	startBeatDetection(audio) {
		if (!this.beatCallback) return;

		// For real music, we'll use a simple BPM-based approach
		// In a real implementation, you'd want to use Web Audio API 
		// to analyze the actual audio for beat detection

		const BPM = 120; // Match the Java code BPM
		const beatInterval = (60 / BPM) * 1000; // Convert to milliseconds

		this.beatInterval = setInterval(() => {
			if (this.isPlaying && this.beatCallback) {
				this.beatCallback();
			}
		}, beatInterval);

		console.log(`🥁 Beat detection started at ${BPM} BPM`);
	}

	playFallbackBeat(beatCallback) {
		// Fallback when no music file is available - SILENT VERSION
		this.beatCallback = beatCallback;
		this.isPlaying = true;

		if (beatCallback) {
			const BPM = 120;
			const beatInterval = (60 / BPM) * 1000;

			this.beatInterval = setInterval(() => {
				if (this.isPlaying && this.beatCallback) {
					this.beatCallback();
				}
			}, beatInterval);

			console.log('🥁 Using fallback beat detection (SILENT - no annoying sounds)');
		}
	}

	stop() {
		if (this.currentAudio) {
			this.currentAudio.pause();
			this.currentAudio.currentTime = 0;
		}

		if (this.beatInterval) {
			clearInterval(this.beatInterval);
			this.beatInterval = null;
		}

		this.isPlaying = false;
		this.beatCallback = null;
		this.currentLevel = null;

		console.log('🛑 Music stopped');
	}

	playFailSound() {
		if (this.failSound) {
			this.failSound.currentTime = 0;
			this.failSound.play().catch(error => {
				console.error('Failed to play fail sound:', error);
			});
		} else {
			// Fallback beep sound using Web Audio API
			this.playBeep(200, 0.1); // Lower frequency for fail sound
		}
	}

	playBeep(frequency = 800, duration = 0.1) {
		// DISABLED - No more annoying beeps!
		console.log('🔇 Beep sound disabled (was annoying)');
		return;
	}

	setVolume(level, volume) {
		const musicKey = `bitchboys-song-${level}`;
		const audio = this.musicFiles[musicKey];
		if (audio) {
			audio.volume = Math.max(0, Math.min(1, volume));
		}
	}

	hasMusicFile(level) {
		const musicKey = `bitchboys-song-${level}`;
		return !!this.musicFiles[musicKey];
	}

	// Get list of available music files
	getAvailableMusic() {
		return Object.keys(this.musicFiles);
	}
}

// Create singleton instance
export const musicManager = new MusicManager();
export default musicManager; 