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
			requiredActions: ['beat_trigger', 'beat_trigger', 'beat_trigger'],
			timeLimit: 60000,
			beatTolerance: 150 // ms tolerance for beat matching
		},
		points: 200
	},
	4: {
		title: "SLIDER MASTERY",
		description: "Learn to control video opacity with smooth movements",
		instructions: "Use A/S keys to adjust blur - move slider fully UP and DOWN 6 times",
		challenge: {
			type: 'slider',
			requiredActions: ['slider_cycle', 'slider_cycle', 'slider_cycle', 'slider_cycle', 'slider_cycle', 'slider_cycle'],
			timeLimit: 60000
		},
		points: 180
	},
	5: {
		title: "NEW BUTTONS UNLOCKED",
		description: "Master the second row of buttons",
		instructions: "Press buttons 5-8 (Q/W/E/R keys) ON THE BEAT - 8 times total",
		challenge: {
			type: 'beat_extended',
			requiredActions: ['beat_trigger_row2', 'beat_trigger_row2', 'beat_trigger_row2', 'beat_trigger_row2', 'beat_trigger_row2', 'beat_trigger_row2', 'beat_trigger_row2', 'beat_trigger_row2'],
			timeLimit: 90000,
			beatTolerance: 150
		},
		points: 250
	},
	6: {
		title: "HORIZONTAL SLIDER FX",
		description: "Master the horizontal slider effects",
		instructions: "Use Z/X keys to cycle zoom slider fully 3 times",
		challenge: {
			type: 'horizontal_sliders',
			requiredActions: ['horizontal_cycle', 'horizontal_cycle', 'horizontal_cycle'],
			timeLimit: 75000
		},
		points: 300
	},
	7: {
		title: "FREESTYLE PERFORMANCE",
		description: "Show your VJ skills - freestyle mode!",
		instructions: "Create an amazing 60-second performance using everything you've learned",
		challenge: {
			type: 'freestyle',
			requiredActions: [], // Open-ended
			timeLimit: 60000
		},
		points: 500
	}
};

const VJGame = () => {
	const { state, actions } = useVJ();
	const { gameMode } = state;
	const [timeRemaining, setTimeRemaining] = useState(0);
	const [gameTimer, setGameTimer] = useState(null);
	const [beatTimer, setBeatTimer] = useState(null);
	const [audioContext, setAudioContext] = useState(null);
	const [musicInitialized, setMusicInitialized] = useState(false);

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
			console.log('🎵 Initializing music manager...');

			// Enable audio context immediately with user interaction
			const enableAudio = () => {
				if (audioContext && audioContext.state === 'suspended') {
					console.log('🎵 Resuming audio context...');
					audioContext.resume();
				}
			};

			// Try to enable audio on any click
			document.addEventListener('click', enableAudio, { once: true });

			// Give music manager time to load files
			setTimeout(() => {
				setMusicInitialized(true);
				console.log('🎵 Music manager ready');
			}, 1000); // Reduced from 2000ms to 1000ms for faster init
		}
	}, [gameMode.isActive, audioContext, musicInitialized]);

	// Start level timer
	const startLevel = useCallback(() => {
		console.log('🎮 ===== STARTING LEVEL =====');
		console.log('Starting level. currentLevelData:', currentLevelData); // Debug log
		if (!currentLevelData) {
			console.error('No currentLevelData available!');
			return;
		}

		// DON'T RESET VISUALS FOR LEVEL 3 - KEEP MUSIC PLAYING
		if (gameMode.currentLevel !== 3) {
			console.log('🔄 Resetting visuals (not Level 3)');
			actions.resetEffects();
			[1, 2, 3, 4].forEach(layer => actions.stopLayer(layer));
		} else {
			console.log('🎵 Level 3 - NOT resetting to preserve music');
		}

		const challenge = currentLevelData.challenge;
		console.log('Setting challenge:', challenge); // Debug log

		// Set challenge with immediate verification
		actions.setGameChallenge(challenge);

		// Add a small delay to ensure state has updated
		setTimeout(() => {
			console.log('Challenge after setting:', gameMode.challenge);
		}, 100);

		console.log(`⏱️ Setting timer to ${challenge.timeLimit}ms (${challenge.timeLimit / 1000}s)`);
		setTimeRemaining(challenge.timeLimit);

		// Clear any existing timer
		if (gameTimer) {
			console.log(`⏱️ Clearing existing timer`);
			clearInterval(gameTimer);
		}

		// Start countdown timer
		const timer = setInterval(() => {
			setTimeRemaining(prev => {
				console.log(`⏱️ Timer tick: ${Math.ceil(prev / 1000)}s remaining`);
				if (prev <= 1000) {
					// Time's up!
					console.log(`⏰ TIME'S UP! Level ${gameMode.currentLevel} failed`);
					clearInterval(timer);
					handleLevelFail();
					return 0;
				}
				return prev - 1000;
			});
		}, 1000);

		setGameTimer(timer);

		// Start music and beat detection for the level
		const level = gameMode.currentLevel;
		console.log(`🎵 ATTEMPTING TO START MUSIC FOR LEVEL ${level}`);
		console.log(`🎵 Music ready: ${musicInitialized}`);
		console.log(`🎵 Challenge type: ${challenge.type}`);

		// Check if we need beat detection for this level
		const needsBeatDetection = challenge.type === 'beat' || challenge.type === 'beat_extended' || challenge.type === 'freestyle';
		console.log(`🎵 Needs beat detection: ${needsBeatDetection}`);

		// SIMPLE MUSIC FOR LEVEL 3 ONLY!
		if (level === 3) {
			console.log(`🎵 🔥 LEVEL 3 - PLAYING MUSIC NOW! 🔥`);

			// Create fresh audio element every time to avoid conflicts
			const audio = new Audio('/music/bitchboys-song-3.wav');
			audio.loop = true;
			audio.volume = 0.7;

			console.log(`🎵 Attempting to play bitchboys-song-3.wav directly...`);
			audio.play().then(() => {
				console.log(`🎵 ✅ MUSIC IS PLAYING! Level 3 success!`);
			}).catch(error => {
				console.error(`🎵 ❌ Music failed:`, error);
			});
		}

		// Start beat detection if needed
		if (needsBeatDetection) {
			console.log(`🎵 Starting beat detection for level ${level}`);
			setTimeout(() => startBeatDetection(), 200);
		}

		actions.setGameFeedback("LEVEL STARTED!");
		setTimeout(() => actions.setGameFeedback(null), 2000);
	}, [currentLevelData, actions, gameMode.challenge, gameMode.currentLevel, musicInitialized]);

	// Beat detection simulation 
	const startBeatDetection = useCallback(() => {
		if (beatTimer) clearInterval(beatTimer);

		// Simulate 120 BPM beat detection (matching Java implementation)
		const bpm = 120;
		const beatInterval = (60 / bpm) * 1000; // ms per beat (500ms at 120 BPM)

		let lastActualBeatTime = Date.now();

		const timer = setInterval(() => {
			const currentTime = Date.now();
			const timeSinceLastBeat = currentTime - lastActualBeatTime;

			// Check if we should trigger a new beat
			if (timeSinceLastBeat >= beatInterval) {
				lastActualBeatTime = currentTime;
				console.log('🎵 BEAT! Time for button press!');

				// NO ANNOYING BEEP SOUND - REMOVED!

				actions.updateGameAudio({
					beatPosition: 1, // Peak of beat
					lastBeatTime: currentTime
				});
			} else {
				// Smooth interpolation for beat position
				const beatPosition = timeSinceLastBeat / beatInterval;
				actions.updateGameAudio({
					beatPosition: beatPosition,
					lastBeatTime: lastActualBeatTime
				});
			}
		}, 50); // Update every 50ms for smooth animation

		setBeatTimer(timer);
	}, [actions, beatTimer]);

	// Check if action is on beat
	const checkBeatTiming = useCallback(() => {
		const { lastBeatTime } = gameMode.audio;
		const currentTime = Date.now();
		const timeSinceBeat = currentTime - lastBeatTime;
		const beatTolerance = currentLevelData?.challenge?.beatTolerance || 200;

		return timeSinceBeat < beatTolerance;
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
			default:
				basePoints = 10;
		}

		// Streak bonus
		const streakMultiplier = Math.min(gameMode.streak * 0.1 + 1, 2);
		return Math.round(basePoints * streakMultiplier);
	}, [gameMode.streak]);

	// Handle level completion
	const handleLevelComplete = useCallback(() => {
		if (gameTimer) {
			clearInterval(gameTimer);
			setGameTimer(null);
		}
		if (beatTimer) {
			clearInterval(beatTimer);
			setBeatTimer(null);
		}

		// Stop current music (unless Level 3)
		if (gameMode.currentLevel !== 3) {
			musicManager.stop();
		}

		// Award completion bonus
		const timeBonus = Math.round(timeRemaining / 1000);
		const levelBonus = currentLevelData.points;
		actions.updateGameScore(timeBonus + levelBonus);
		actions.completeLevel(gameMode.currentLevel);

		actions.setGameFeedback("LEVEL COMPLETE!");

		// Auto-advance to next level after 3 seconds
		setTimeout(() => {
			if (gameMode.currentLevel < 7) {
				actions.setGameLevel(gameMode.currentLevel + 1);
				actions.setGameFeedback(null);
			} else {
				// Game complete!
				console.log('🎮 Game complete - stopping all music');
				musicManager.stop(); // Make sure music stops at end
				actions.setGameFeedback("YOU ARE A TRUE VJ!");
			}
		}, 3000);
	}, [gameTimer, beatTimer, timeRemaining, currentLevelData, actions, gameMode.currentLevel]);

	// Handle different types of game actions
	const handleGameAction = useCallback((actionType, actionData = {}) => {
		console.log('=== GAME ACTION ===');
		console.log('Action:', actionType, actionData);
		console.log('Game active:', gameMode.isActive);
		console.log('Current level:', gameMode.currentLevel);
		console.log('Level data exists:', !!currentLevelData);

		if (!gameMode.isActive || !currentLevelData) {
			console.log('❌ Game not active or no level data');
			return;
		}

		// Get challenge from gameMode or fallback to currentLevelData
		let challenge = gameMode.challenge;

		if (!challenge || !challenge.type || !Array.isArray(challenge.requiredActions)) {
			console.log('🔄 Challenge invalid, using currentLevelData challenge');
			challenge = currentLevelData.challenge;

			// Ensure we have a valid challenge structure
			if (!challenge || !challenge.type || !Array.isArray(challenge.requiredActions)) {
				console.error('❌ No valid challenge available');
				return;
			}

			// Force set the challenge
			actions.setGameChallenge(challenge);
		}

		const requiredActions = challenge.requiredActions;
		const completedActions = gameMode.challenge?.completedActions || [];

		console.log('Challenge type:', challenge.type);
		console.log('Required actions:', requiredActions);
		console.log('Completed actions:', completedActions);

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
				console.log('Launch action - completed:', launchCount, 'required:', requiredLaunchCount);
			} else if (actionType === 'stop') {
				actionString = 'stop_any';
				const stopCount = completedActions.filter(a => a === 'stop_any').length;
				const requiredStopCount = requiredActions.filter(a => a === 'stop_any').length;
				isRequiredAction = requiredActions.includes('stop_any') && stopCount < requiredStopCount;
				console.log('Stop action - completed:', stopCount, 'required:', requiredStopCount);
			}
		} else if (challenge.type === 'trigger') {
			actionString = `${actionType}_${actionData.layer}`;
			isRequiredAction = requiredActions.includes(actionString) && !completedActions.includes(actionString);
		} else if (challenge.type === 'effects') {
			actionString = `effect_${actionData.effect}`;
			isRequiredAction = requiredActions.includes(actionString) && !completedActions.includes(actionString);
		} else if (challenge.type === 'opacity') {
			actionString = 'opacity_change';
			isRequiredAction = requiredActions.includes(actionString) &&
				completedActions.filter(a => a === 'opacity_change').length < requiredActions.filter(a => a === 'opacity_change').length;
		} else if (challenge.type === 'beat') {
			actionString = 'beat_trigger';
			isRequiredAction = requiredActions.includes(actionString) && checkBeatTiming() &&
				completedActions.filter(a => a === 'beat_trigger').length < requiredActions.filter(a => a === 'beat_trigger').length;
		} else if (challenge.type === 'slider') {
			if (actionType === 'opacity' && actionData.cycle) {
				// Track slider movement cycles (complete cycle from min to max or max to min)
				actionString = 'slider_cycle';
				isRequiredAction = requiredActions.includes(actionString) &&
					completedActions.filter(a => a === 'slider_cycle').length < requiredActions.filter(a => a === 'slider_cycle').length;
			}
		} else if (challenge.type === 'beat_extended') {
			// Level 5: beat triggers on second row buttons (Q/W/E/R mapped to effects)
			if (actionType === 'effect' && checkBeatTiming()) {
				actionString = 'beat_trigger_row2';
				isRequiredAction = requiredActions.includes(actionString) &&
					completedActions.filter(a => a === 'beat_trigger_row2').length < requiredActions.filter(a => a === 'beat_trigger_row2').length;
			}
		} else if (challenge.type === 'horizontal_sliders') {
			// Level 6: horizontal slider cycling (Z/X keys for zoom)
			if (actionType === 'effect' && actionData.effect === 'zoom' && actionData.cycle) {
				actionString = 'horizontal_cycle';
				isRequiredAction = requiredActions.includes(actionString) &&
					completedActions.filter(a => a === 'horizontal_cycle').length < requiredActions.filter(a => a === 'horizontal_cycle').length;
			}
		}

		console.log('Action string:', actionString);
		console.log('Is required action:', isRequiredAction);

		if (isRequiredAction) {
			// Good action!
			console.log('✅ GOOD ACTION!');
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
			console.log('Progress:', newCompletedCount, '/', requiredActions.length);
			if (newCompletedCount >= requiredActions.length) {
				console.log('🎉 LEVEL COMPLETE!');
				setTimeout(handleLevelComplete, 500); // Small delay to show final feedback
			}
		} else if (challenge.type !== 'freestyle') {
			// Wrong action (except in freestyle mode)
			console.log('❌ WRONG ACTION');
			actions.updateGameScore(-10);
			actions.setGameFeedback("WRONG!");
			setTimeout(() => actions.setGameFeedback(null), 1000);
		}

		console.log('=== END GAME ACTION ===');
	}, [gameMode, currentLevelData, actions, calculatePoints, checkBeatTiming, handleLevelComplete]);

	// Handle level failure
	const handleLevelFail = useCallback(() => {
		console.log('⏰ Level failed - cleaning up');

		if (gameTimer) {
			clearInterval(gameTimer);
			setGameTimer(null);
		}
		if (beatTimer) {
			clearInterval(beatTimer);
			setBeatTimer(null);
		}

		// Stop music and play fail sound (unless Level 3)
		if (gameMode.currentLevel !== 3) {
			musicManager.stop();
		}
		musicManager.playFailSound();

		// Reset visuals on failure too (with safeguard)
		try {
			actions.resetEffects();
			[1, 2, 3, 4].forEach(layer => {
				console.log(`🛑 Stopping layer ${layer} on fail`);
				actions.stopLayer(layer);
			});
		} catch (error) {
			console.error('Error stopping layers:', error);
		}

		actions.setGameFeedback("TIME'S UP! TRY AGAIN");

		// Restart level after 2 seconds
		setTimeout(() => {
			actions.setGameFeedback(null);
			console.log('🔄 Restarting level after fail');
			startLevel();
		}, 2000);
	}, [gameTimer, beatTimer, actions, startLevel]);

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

	// Cleanup timers and music on unmount or game deactivation
	useEffect(() => {
		return () => {
			if (gameTimer) clearInterval(gameTimer);
			if (beatTimer) clearInterval(beatTimer);
			musicManager.stop();
		};
	}, [gameTimer, beatTimer]);

	// Stop music when game is deactivated (but not when switching levels)
	useEffect(() => {
		if (!gameMode.isActive) {
			console.log('🛑 Game deactivated - stopping music');
			musicManager.stop();
		}
	}, [gameMode.isActive]);

	// Reset timer when level changes
	useEffect(() => {
		console.log(`🔄 Level changed to ${gameMode.currentLevel} - resetting timer`);
		setTimeRemaining(0); // Reset timer to 0 when switching levels

		// Clear any existing timer
		if (gameTimer) {
			clearInterval(gameTimer);
			setGameTimer(null);
		}

		// Clear beat timer too
		if (beatTimer) {
			clearInterval(beatTimer);
			setBeatTimer(null);
		}
	}, [gameMode.currentLevel]);

	// Auto-start certain levels
	useEffect(() => {
		if (gameMode.isActive && timeRemaining === 0 && musicInitialized) {
			if (gameMode.currentLevel === 1) {
				console.log('🎮 Auto-starting Level 1');
				setTimeout(() => startLevel(), 1000);
			} else if (gameMode.currentLevel === 3) {
				console.log('🎮 🎵 Auto-starting Level 3 WITH MUSIC!');
				setTimeout(() => startLevel(), 1000);
			}
		}
	}, [gameMode.isActive, gameMode.currentLevel, timeRemaining, musicInitialized]);

	// Debug: Monitor gameMode.challenge changes (reduced logging)
	useEffect(() => {
		if (gameMode.challenge?.type) {
			console.log('Challenge set:', gameMode.challenge.type, 'Required:', gameMode.challenge.requiredActions?.length);
		}
	}, [gameMode.challenge?.type]);

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
					<div className="game-score">SCORE: {gameMode.score}</div>
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
					<div className="time-remaining">
						TIME: {Math.ceil(timeRemaining / 1000)}s
					</div>
					<div className="actions-remaining">
						{(gameMode.challenge?.completedActions?.length || 0)} / {(gameMode.challenge?.requiredActions?.length || 0)}
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

			{/* Level Controls */}
			<div className="level-controls">
				<button
					className="start-button"
					onClick={() => {
						console.log(`🎮 START LEVEL BUTTON CLICKED - Level ${gameMode.currentLevel}`);
						startLevel();
					}}
					disabled={timeRemaining > 0}
				>
					{timeRemaining > 0 ? 'IN PROGRESS' : 'START LEVEL'}
				</button>

				<button
					className="skip-button"
					onClick={() => {
						if (gameMode.currentLevel < 7) {
							actions.setGameLevel(gameMode.currentLevel + 1);
						}
					}}
				>
					SKIP LEVEL
				</button>

				{/* Debug: Manual music test */}
				<button
					className="test-button"
					onClick={() => {
						console.log('🎵 DIRECT music test - Level 3 WAV file');
						// Direct test of the exact file that loaded successfully
						const audio = new Audio('/music/bitchboys-song-3.wav');
						audio.volume = 0.7;
						audio.loop = false; // Don't loop for test

						audio.addEventListener('loadedmetadata', () => {
							console.log(`📊 Audio loaded: ${audio.duration}s duration`);
						});

						audio.addEventListener('canplay', () => {
							console.log('✅ Audio ready to play');
						});

						audio.addEventListener('error', (e) => {
							console.error('❌ Audio error:', e);
						});

						audio.play().then(() => {
							console.log('✅ MUSIC PLAYING NOW!');
							setTimeout(() => {
								audio.pause();
								console.log('⏸️ Music stopped after 5 seconds');
							}, 5000); // Play for 5 seconds
						}).catch(error => {
							console.error('❌ Play failed:', error);
						});
					}}
					style={{ backgroundColor: '#00ff00', marginLeft: '10px', color: 'black' }}
				>
					🎵 TEST MUSIC
				</button>

				{/* Force start Level 3 with music */}
				<button
					className="test-button"
					onClick={() => {
						console.log('🎵 FORCING LEVEL 3 START WITH MUSIC');
						// Force call music manager directly
						musicManager.playLevel(3, () => {
							const currentTime = Date.now();
							console.log('🎵 BEAT! Time for button press!');
							actions.updateGameAudio({
								beatPosition: 1,
								lastBeatTime: currentTime
							});
						});
					}}
					style={{ backgroundColor: '#ff0000', marginLeft: '10px', color: 'white' }}
				>
					🔥 FORCE LEVEL 3 MUSIC
				</button>
			</div>

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
								className={`level-item ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}
								onClick={() => actions.setGameLevel(levelNum)}
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
			{timeRemaining > 0 && currentLevelData && (
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
				return "Wait for the BEAT indicator to glow, then press 1-4";
			case 'slider':
				const cycleCount = challenge.completedActions.filter(a => a === 'slider_cycle').length;
				return `Move blur slider fully UP and DOWN (${cycleCount + 1}/6 cycles) - Use A/S keys`;
			case 'beat_extended':
				return "Wait for the BEAT, then press Q/W/E/R for effects";
			case 'horizontal_sliders':
				const hCycleCount = challenge.completedActions.filter(a => a === 'horizontal_cycle').length;
				return `Cycle zoom slider fully (${hCycleCount + 1}/3 cycles) - Use Z/X keys`;
			case 'effects':
				const effect = nextAction.split('_')[1];
				const keyMap = {
					'invert': 'Q',
					'hue': 'W or E',
					'colorize': 'R',
					'strobe': 'F'
				};
				return `Press ${keyMap[effect] || effect.toUpperCase()} for ${effect} effect`;
			case 'freestyle':
				return "Show off your VJ skills! Use any controls";
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