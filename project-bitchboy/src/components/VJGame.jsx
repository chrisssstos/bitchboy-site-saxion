import React, { useEffect, useCallback, useState } from 'react';
import { useVJ } from '../contexts/VJContext';
import { musicManager } from '../utils/musicManager';
import './VJGame.css';

// Game levels configuration
const GAME_LEVELS = {
	1: {
		title: "CLIP TRIGGER BASICS",
		description: "Learn to trigger video clips using buttons 1-4",
		instructions: "Press buttons 1, 2, 3, and 4 to launch videos on each layer",
		challenge: {
			type: 'trigger',
			requiredActions: ['launch_1', 'launch_2', 'launch_3', 'launch_4'],
			timeLimit: 30000 // 30 seconds
		},
		points: 100
	},
	2: {
		title: "LAYER MANAGEMENT",
		description: "Master starting and stopping video layers",
		instructions: "Launch 2 videos, then stop them using Shift+1, Shift+2",
		challenge: {
			type: 'management',
			requiredActions: ['launch_any', 'launch_any', 'stop_any', 'stop_any'],
			timeLimit: 45000
		},
		points: 150
	},
	3: {
		title: "BEAT SYNCHRONIZATION",
		description: "Time your triggers to the beat of the music",
		instructions: "Press buttons 1-4 ON THE BEAT - listen for the rhythm!",
		challenge: {
			type: 'beat',
			requiredActions: Array(20).fill('beat_trigger'), // 20 beat presses required
			timeLimit: 60000,
			beatTolerance: 200 // ms tolerance for beat matching (more forgiving)
		},
		points: 200
	},
	4: {
		title: "SLIDER MASTERY",
		description: "Master opacity control using the bottom sliders",
		instructions: "Move any bottom slider to 0% or 100% opacity to score points!",
		challenge: {
			type: 'slider',
			requiredActions: ['slider_extreme', 'slider_extreme', 'slider_extreme'], // 3 extreme slider positions required
			timeLimit: 45000 // 45 seconds
		},
		points: 250
	}
};

const VJGame = () => {
	const { state, actions } = useVJ();
	const { gameMode } = state;
	const [beatTimer, setBeatTimer] = useState(null);
	const [audioContext, setAudioContext] = useState(null);
	const [musicInitialized, setMusicInitialized] = useState(false);
	const [tutorialMusic, setTutorialMusic] = useState(null); // Track tutorial music instance
	const [levelStarted, setLevelStarted] = useState(false); // Prevent infinite start loops

	// Current level data
	const currentLevelData = GAME_LEVELS[gameMode.currentLevel];

	// Initialize audio context and music manager
	useEffect(() => {
		if (gameMode.isActive && !audioContext) {
			const ctx = new (window.AudioContext || window.webkitAudioContext)();
			setAudioContext(ctx);
		}

		// Initialize music manager when game becomes active
		if (gameMode.isActive && !musicInitialized) {
			// Enable audio context immediately with user interaction
			const enableAudio = () => {
				if (audioContext && audioContext.state === 'suspended') {
					audioContext.resume();
				}
			};

			// Try to enable audio on any click
			document.addEventListener('click', enableAudio, { once: true });

			// Give music manager time to load files
			setTimeout(() => {
				setMusicInitialized(true);
			}, 1000); // Reduced from 2000ms to 1000ms for faster init
		}
	}, [gameMode.isActive, audioContext, musicInitialized]);

	// Start tutorial music when game mode becomes active
	useEffect(() => {
		if (gameMode.isActive && musicInitialized && !tutorialMusic) {
			console.log('🎵 Starting tutorial music...');

			// Stop any existing music from musicManager first (no await needed for stop)
			musicManager.stop();

			// Create tutorial music instance
			const audio = new Audio('/music/bitchboys-song-3.wav');
			audio.loop = true;
			audio.volume = 0.35; // Consistent volume for all levels (50% of original)
			audio.preload = 'auto';

			// Add event listeners to track audio state
			const handlePlay = () => {
				console.log('🎵 ✅ Tutorial music is playing');
			};

			const handlePause = () => {
				console.log('⏸️ Tutorial music paused');
			};

			const handleEnded = () => {
				console.log('🔄 Tutorial music ended (should loop)');
			};

			const handleError = (e) => {
				console.error('❌ Tutorial music error:', e);
			};

			audio.addEventListener('play', handlePlay);
			audio.addEventListener('pause', handlePause);
			audio.addEventListener('ended', handleEnded);
			audio.addEventListener('error', handleError);

			// Set the audio instance immediately to prevent race conditions
			setTutorialMusic(audio);

			// Try to play the music with better error handling
			const attemptPlay = async () => {
				try {
					await audio.play();
					console.log('🎵 ✅ Tutorial music started successfully!');
				} catch (error) {
					console.error('❌ Tutorial music failed to start:', error);
					// Try again after a short delay (user interaction might be needed)
					setTimeout(async () => {
						try {
							await audio.play();
							console.log('🎵 ✅ Tutorial music started on retry!');
						} catch (retryError) {
							console.log('🔇 Tutorial music requires user interaction, will start on first click');
							// Set up a one-time click listener to start music
							const startOnClick = async () => {
								try {
									await audio.play();
									console.log('🎵 ✅ Tutorial music started after user interaction!');
									document.removeEventListener('click', startOnClick);
								} catch (clickError) {
									console.error('❌ Tutorial music still failed after click:', clickError);
								}
							};
							document.addEventListener('click', startOnClick, { once: true });
						}
					}, 500);
				}
			};

			attemptPlay();
		}

		// Stop tutorial music when game mode is deactivated
		if (!gameMode.isActive && tutorialMusic) {
			console.log('🛑 Stopping tutorial music...');
			tutorialMusic.pause();
			tutorialMusic.currentTime = 0;
			setTutorialMusic(null);
		}
	}, [gameMode.isActive, musicInitialized, tutorialMusic]);

	// Start level 
	const startLevel = useCallback(() => {
		if (!currentLevelData || levelStarted) {
			return;
		}

		console.log(`🎮 Starting Level ${gameMode.currentLevel}`);
		setLevelStarted(true);

		// DON'T RESET VISUALS FOR LEVEL 3 - KEEP MUSIC PLAYING
		if (gameMode.currentLevel !== 3) {
			actions.resetEffects();
			[1, 2, 3, 4].forEach(layer => actions.stopLayer(layer));
		}

		const challenge = currentLevelData.challenge;
		actions.setGameChallenge(challenge);

		// Start music and beat detection for the level
		const level = gameMode.currentLevel;
		const needsBeatDetection = challenge.type === 'beat' || challenge.type === 'beat_extended' || challenge.type === 'freestyle';

		// Handle Level 3 - use existing tutorial music (same volume as other levels)
		if (level === 3) {
			if (tutorialMusic && !tutorialMusic.paused) {
				console.log('🎵 Level 3: Using existing tutorial music (consistent volume)');
				tutorialMusic.volume = 0.35; // Same volume as all other levels

				// Make sure it's still playing
				if (tutorialMusic.paused) {
					console.log('🎵 Level 3: Tutorial music was paused, restarting...');
					tutorialMusic.play().catch(error => {
						console.error('❌ Failed to restart tutorial music for Level 3:', error);
					});
				}

				// Start beat detection synchronized with existing music
				if (needsBeatDetection) {
					setTimeout(() => startBeatDetection(), 100);
				}
			} else {
				console.log('🎵 Level 3: No active tutorial music found, creating new music instance');
				// Fallback: create fresh audio element
				const audio = new Audio('/music/bitchboys-song-3.wav');
				audio.loop = true;
				audio.volume = 0.35;

				audio.play().then(() => {
					setTutorialMusic(audio); // Update the tutorial music reference
					if (needsBeatDetection) {
						setTimeout(() => startBeatDetection(), 100);
					}
				}).catch(error => {
					console.error('❌ Level 3 fallback music failed:', error);
					// Start beat detection anyway for fallback
					if (needsBeatDetection) {
						setTimeout(() => startBeatDetection(), 200);
					}
				});
			}
		} else {
			// For other levels, maintain the same consistent volume
			if (tutorialMusic && !tutorialMusic.paused) {
				console.log(`🎵 Level ${level}: Using consistent tutorial music volume`);
				tutorialMusic.volume = 0.35; // Same volume as all other levels

				// Make sure it's still playing
				if (tutorialMusic.paused) {
					console.log(`🎵 Level ${level}: Tutorial music was paused, restarting...`);
					tutorialMusic.play().catch(error => {
						console.error('❌ Failed to restart tutorial music for background:', error);
					});
				}
			}

			// Start beat detection if needed (for other levels)
			if (needsBeatDetection) {
				setTimeout(() => startBeatDetection(), 200);
			}
		}

		actions.setGameFeedback("LEVEL STARTED!");
		setTimeout(() => actions.setGameFeedback(null), 2000);
	}, [currentLevelData, actions, gameMode.currentLevel, tutorialMusic, levelStarted]);

	// Beat detection simulation - lightweight and optimized
	const startBeatDetection = useCallback(() => {
		if (beatTimer) clearInterval(beatTimer);

		let lastActualBeatTime = Date.now();

		// Set initial beat state
		actions.updateGameAudio({
			beatPosition: 1,
			lastBeatTime: lastActualBeatTime
		});

		// Simple timer that only updates beat time every 500ms (120 BPM)
		const timer = setInterval(() => {
			lastActualBeatTime = Date.now();
			actions.updateGameAudio({
				beatPosition: 1,
				lastBeatTime: lastActualBeatTime
			});
		}, 500); // Only update on actual beats, not every 25ms

		setBeatTimer(timer);
	}, [actions, beatTimer]);

	// Check if action is on beat - simplified and lightweight
	const checkBeatTiming = useCallback(() => {
		const { lastBeatTime } = gameMode.audio || {};
		if (!lastBeatTime) {
			return true; // Allow actions when beat detection hasn't started yet
		}

		const currentTime = Date.now();
		const timeSinceBeat = currentTime - lastBeatTime;
		const beatTolerance = currentLevelData?.challenge?.beatTolerance || 300;

		// Simple check: within tolerance of the last beat
		const onBeat = timeSinceBeat < beatTolerance;
		return onBeat;
	}, [gameMode.audio, currentLevelData]);

	// Calculate points based on action quality
	const calculatePoints = useCallback((actionType, actionData) => {
		let basePoints = 10;

		switch (actionType) {
			case 'launch':
				basePoints = 20;
				break;
			case 'effect':
				basePoints = 15;
				break;
			case 'beat_trigger':
				basePoints = 30; // Bonus for timing
				break;
			case 'slider_extreme':
				basePoints = 25; // Good points for slider mastery
				break;
			default:
				basePoints = 10;
		}

		// Streak bonus
		const streakMultiplier = Math.min(gameMode.streak * 0.1 + 1, 2);
		return Math.round(basePoints * streakMultiplier);
	}, [gameMode.streak]);

	// Handle level completion
	const handleLevelComplete = useCallback(() => {
		if (beatTimer) {
			clearInterval(beatTimer);
			setBeatTimer(null);
		}

		// Keep tutorial music playing between levels - don't stop it!
		// Volume stays consistent across all levels now
		if (tutorialMusic) {
			console.log('🎵 Level complete: Maintaining consistent music volume');
			tutorialMusic.volume = 0.35; // Consistent volume for all levels
		}

		// Award completion bonus
		const levelBonus = currentLevelData.points;
		actions.updateGameScore(levelBonus);
		actions.completeLevel(gameMode.currentLevel);

		actions.setGameFeedback("LEVEL COMPLETE!");

		// Auto-advance to next level after 3 seconds
		setTimeout(() => {
			if (gameMode.currentLevel < 4) {
				actions.setGameLevel(gameMode.currentLevel + 1);
				actions.setGameFeedback(null);
			} else {
				// Game complete! Stop tutorial music at the very end
				if (tutorialMusic) {
					console.log('🛑 Game complete: Stopping tutorial music');
					tutorialMusic.pause();
					tutorialMusic.currentTime = 0;
					setTutorialMusic(null);
				}
				musicManager.stop(); // Clean up any other music (no await needed for stop)
				actions.setGameFeedback("YOU ARE A TRUE VJ!");
			}
		}, 3000);
	}, [beatTimer, currentLevelData, actions, gameMode.currentLevel, tutorialMusic]);

	// Handle different types of game actions
	const handleGameAction = useCallback((actionType, actionData = {}) => {
		if (!gameMode.isActive || !currentLevelData) {
			return;
		}

		// Get challenge from gameMode or fallback to currentLevelData
		let challenge = gameMode.challenge;

		if (!challenge || !challenge.type || !Array.isArray(challenge.requiredActions)) {
			challenge = currentLevelData.challenge;
			if (!challenge || !challenge.type || !Array.isArray(challenge.requiredActions)) {
				return;
			}
			actions.setGameChallenge(challenge);
		}

		const requiredActions = challenge.requiredActions;
		const completedActions = gameMode.challenge?.completedActions || [];

		// Check if this action is required and not already completed
		let isRequiredAction = false;
		let actionString = actionType;

		// For Level 2 (management), we need to handle launch_any and stop_any
		if (challenge.type === 'management') {
			if (actionType === 'launch') {
				actionString = 'launch_any';
				const launchCount = completedActions.filter(a => a === 'launch_any').length;
				const requiredLaunchCount = requiredActions.filter(a => a === 'launch_any').length;
				isRequiredAction = requiredActions.includes('launch_any') && launchCount < requiredLaunchCount;
			} else if (actionType === 'stop') {
				actionString = 'stop_any';
				const stopCount = completedActions.filter(a => a === 'stop_any').length;
				const requiredStopCount = requiredActions.filter(a => a === 'stop_any').length;
				isRequiredAction = requiredActions.includes('stop_any') && stopCount < requiredStopCount;
			}
		} else if (challenge.type === 'trigger') {
			actionString = `${actionType}_${actionData.layer}`;
			isRequiredAction = requiredActions.includes(actionString) && !completedActions.includes(actionString);
		} else if (challenge.type === 'beat') {
			// Level 3: Beat synchronization - buttons 1-4 on the beat
			if (actionType === 'launch') {
				actionString = 'beat_trigger';
				const onBeat = checkBeatTiming();
				isRequiredAction = requiredActions.includes(actionString) && onBeat &&
					completedActions.filter(a => a === 'beat_trigger').length < requiredActions.filter(a => a === 'beat_trigger').length;
			}
		} else if (challenge.type === 'slider') {
			// Level 4: Slider mastery - move sliders to 0 or 100
			if (actionType === 'slider_extreme') {
				actionString = 'slider_extreme';
				isRequiredAction = requiredActions.includes(actionString) &&
					completedActions.filter(a => a === 'slider_extreme').length < requiredActions.filter(a => a === 'slider_extreme').length;
			}
		}

		if (isRequiredAction) {
			// Good action!
			const points = calculatePoints(actionType, actionData);
			actions.updateGameScore(points);
			actions.completeChallengeAction(actionString);

			// Show feedback
			const feedbacks = ["NICE!", "GOOD!", "PERFECT!", "AWESOME!"];
			const feedback = feedbacks[Math.floor(Math.random() * feedbacks.length)];
			actions.setGameFeedback(feedback);
			setTimeout(() => actions.setGameFeedback(null), 1500);

			// Check if level is complete
			const newCompletedCount = completedActions.length + 1;
			if (newCompletedCount >= requiredActions.length) {
				setTimeout(handleLevelComplete, 500); // Small delay to show final feedback
			}
		} else if (challenge.type !== 'freestyle' && challenge.type !== 'slider') {
			// Wrong action (except in freestyle mode and slider mode)
			actions.updateGameScore(-10);
			actions.setGameFeedback("WRONG!");
			setTimeout(() => actions.setGameFeedback(null), 1000);
		}
	}, [gameMode, currentLevelData, actions, calculatePoints, checkBeatTiming, handleLevelComplete]);

	// Note: No level failure functionality since there's no timer

	// Listen for VJ actions and convert them to game actions
	useEffect(() => {
		const handleVJGameAction = (event) => {
			const { type, ...actionData } = event.detail;
			handleGameAction(type, actionData);
		};

		window.addEventListener('vj-game-action', handleVJGameAction);

		return () => {
			window.removeEventListener('vj-game-action', handleVJGameAction);
		};
	}, [handleGameAction]);

	// Cleanup music on unmount or game deactivation
	useEffect(() => {
		return () => {
			if (beatTimer) clearInterval(beatTimer);
			// Note: Don't stop tutorialMusic here - it's managed in its own useEffect
			// Only stop the old musicManager system (no await needed for stop)
			musicManager.stop();
		};
	}, [beatTimer]);

	// Additional cleanup for tutorial music is now handled in the tutorial music useEffect above

	// Clear beat timer when level changes and reset level started flag
	useEffect(() => {
		// Clear beat timer when switching levels
		if (beatTimer) {
			clearInterval(beatTimer);
			setBeatTimer(null);
		}
		// Reset level started flag when level changes
		setLevelStarted(false);
	}, [gameMode.currentLevel]);

	// Auto-start all levels
	useEffect(() => {
		if (gameMode.isActive && musicInitialized && !levelStarted) {
			setTimeout(() => startLevel(), 500);
		}
	}, [gameMode.isActive, gameMode.currentLevel, musicInitialized, levelStarted]);

	if (!gameMode.isActive) {
		return null;
	}

	return (
		<div className="vj-game">
			{/* Game Header */}
			<div className="game-header">
				<div className="game-title">SUPER VJ PRO</div>
				<div className="game-header-row">
					<div className="game-level">LEVEL {gameMode.currentLevel}</div>
				</div>
			</div>

			{/* Level Info */}
			<div className="level-info">
				<h2 className="level-title">{currentLevelData?.title}</h2>
				<p className="level-description">{currentLevelData?.description}</p>
				<p className="level-instructions">{currentLevelData?.instructions}</p>
			</div>

			{/* Game Status */}
			<div className="game-status">
				<div className="status-row">
					<div className="actions-remaining">
						PROGRESS: {(gameMode.challenge?.completedActions?.length || 0)} / {(gameMode.challenge?.requiredActions?.length || 0)}
					</div>
				</div>
				<div className="progress-bar">
					<div
						className="progress-fill"
						style={{
							width: `${((gameMode.challenge?.completedActions?.length || 0) /
								(gameMode.challenge?.requiredActions?.length || 1)) * 100}%`
						}}
					/>
				</div>
			</div>

			{/* BEAT INDICATOR REMOVED - IT WAS CAUSING PROBLEMS! */}

			{/* Progress Overview */}
			<div className="progress-overview">
				<h3>PROGRESS</h3>
				<div className="level-grid">
					{Object.keys(GAME_LEVELS).map(level => {
						const levelNum = parseInt(level);
						const isCompleted = gameMode.progress.levelsCompleted.includes(levelNum);
						const isCurrent = gameMode.currentLevel === levelNum;

						return (
							<div
								key={level}
								className={`level-item ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''} non-clickable`}
							>
								{level}
							</div>
						);
					})}
				</div>
			</div>

			{/* Feedback Display - Positioned over main video area */}
			{gameMode.feedback && (
				<div className={`game-feedback ${gameMode.feedback.toLowerCase().replace(/[^a-z]/g, '')}`}>
					{gameMode.feedback}
				</div>
			)}

			{/* Current Action Hint */}
			{currentLevelData && (
				<div className="current-action-hint">
					{getActionHint()}
				</div>
			)}
		</div>
	);

	// Helper function to show current action hints
	function getActionHint() {
		const challenge = gameMode.challenge;

		// Handle null challenge case
		if (!challenge || !challenge.requiredActions || !challenge.completedActions) {
			return "Loading challenge...";
		}

		const completed = challenge.completedActions.length;
		const required = challenge.requiredActions;

		if (completed >= required.length) return "LEVEL COMPLETE!";

		// Find the next required action that hasn't been completed
		const nextAction = required.find(req => !challenge.completedActions.includes(req));

		if (!nextAction) return "LEVEL COMPLETE!";

		switch (challenge.type) {
			case 'trigger':
				const layerNum = nextAction.split('_')[1];
				return `Press ${layerNum} to launch video on Layer ${layerNum}`;
			case 'management':
				const launchCount = challenge.completedActions.filter(a => a === 'launch_any').length;
				const stopCount = challenge.completedActions.filter(a => a === 'stop_any').length;

				if (nextAction === 'launch_any') {
					return `Launch video ${launchCount + 1}/2 (Press 1-4)`;
				} else {
					return `Stop layer ${stopCount + 1}/2 (Shift+1-4)`;
				}
			case 'beat':
				const beatCount = challenge.completedActions.filter(a => a === 'beat_trigger').length;
				return `Listen for the beat and press 1-4 ON THE BEAT (${beatCount}/20 complete)`;
			case 'slider':
				const sliderCount = challenge.completedActions.filter(a => a === 'slider_extreme').length;
				return `Move bottom sliders to 0% or 100% opacity (${sliderCount}/3 complete)`;
			default:
				return "Follow the instructions above";
		}
	}
};

// Export game action handler for use by other components
export const useGameActions = () => {
	const { state } = useVJ();

	const handleLaunchVideo = useCallback((layer, video) => {
		if (state.gameMode.isActive) {
			// Convert to game action
			window.dispatchEvent(new CustomEvent('vj-game-action', {
				detail: { type: 'launch', layer, video }
			}));
		}
	}, [state.gameMode.isActive]);

	const handleEffect = useCallback((effect) => {
		if (state.gameMode.isActive) {
			window.dispatchEvent(new CustomEvent('vj-game-action', {
				detail: { type: 'effect', effect }
			}));
		}
	}, [state.gameMode.isActive]);

	return { handleLaunchVideo, handleEffect };
};

export default VJGame; 