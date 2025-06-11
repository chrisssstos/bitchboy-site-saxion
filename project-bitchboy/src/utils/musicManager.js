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

		const extensions = ['wav', 'mp3', 'ogg'];

		for (const file of musicFiles) {
			for (const ext of extensions) {
				try {
					const audio = new Audio(`/music/${file}.${ext}`);
					audio.preload = 'metadata';

					// Test if file exists by trying to load it
					await new Promise((resolve, reject) => {
						audio.addEventListener('canplaythrough', resolve, { once: true });
						audio.addEventListener('error', reject, { once: true });
						audio.load();
					});

					this.musicFiles[file] = audio;
					console.log(`✅ Loaded music file: ${file}.${ext}`);
					break; // Found this file, move to next
				} catch (error) {
					// File doesn't exist or can't load, try next extension
					continue;
				}
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
		this.stop(); // Stop any current music

		const musicKey = `bitchboys-song-${level}`;
		const audio = this.musicFiles[musicKey];

		if (!audio) {
			console.warn(`No music file found for level ${level}, using fallback beat`);
			this.playFallbackBeat(beatCallback);
			return;
		}

		this.currentAudio = audio;
		this.currentLevel = level;
		this.beatCallback = beatCallback;

		// Set up looping
		audio.loop = true;

		// Start playback
		audio.play().then(() => {
			this.isPlaying = true;
			console.log(`🎵 Playing level ${level} music`);

			// Start beat detection for this track
			if (beatCallback) {
				this.startBeatDetection(audio);
			}
		}).catch(error => {
			console.error(`Failed to play level ${level} music:`, error);
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
		// Fallback when no music file is available
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

			console.log('🥁 Using fallback beat detection (no music file)');
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
		if (!this.audioContext) return;

		const oscillator = this.audioContext.createOscillator();
		const gainNode = this.audioContext.createGain();

		oscillator.connect(gainNode);
		gainNode.connect(this.audioContext.destination);

		oscillator.frequency.value = frequency;
		oscillator.type = 'sine';

		gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
		gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

		oscillator.start(this.audioContext.currentTime);
		oscillator.stop(this.audioContext.currentTime + duration);
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