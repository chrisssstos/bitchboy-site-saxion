import React, { useEffect, useCallback, useState } from 'react';
import { useVJ } from '../contexts/VJContext';
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
		instructions: "Listen to the beat and trigger clips on the downbeat (1-2-3-4)",
		challenge: {
			type: 'beat',
			requiredActions: ['beat_trigger', 'beat_trigger', 'beat_trigger', 'beat_trigger'],
			timeLimit: 60000,
			beatTolerance: 200 // ms tolerance for beat matching
		},
		points: 200
	},
	4: {
		title: "OPACITY CONTROL",
		description: "Learn to fade layers in and out smoothly",
		instructions: "Use A/S keys to adjust blur, create smooth transitions",
		challenge: {
			type: 'opacity',
			requiredActions: ['opacity_change', 'opacity_change', 'opacity_change'],
			timeLimit: 45000
		},
		points: 180
	},
	5: {
		title: "EFFECT MASTERY",
		description: "Apply visual effects rhythmically",
		instructions: "Use Q (invert), W/E (hue), R (colorize), F (strobe) in rhythm",
		challenge: {
			type: 'effects',
			requiredActions: ['effect_invert', 'effect_hue', 'effect_colorize', 'effect_strobe'],
			timeLimit: 60000
		},
		points: 250
	},
	6: {
		title: "COMPLEX COMBINATIONS",
		description: "Combine multiple layers and effects",
		instructions: "Layer 2+ videos, apply 3+ effects, maintain rhythm",
		challenge: {
			type: 'combination',
			requiredActions: ['multi_layer', 'multi_effect', 'rhythm_maintain'],
			timeLimit: 90000
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

	// Current level data
	const currentLevelData = GAME_LEVELS[gameMode.currentLevel];

	// Initialize audio context for beat detection
	useEffect(() => {
		if (gameMode.isActive && !audioContext) {
			const ctx = new (window.AudioContext || window.webkitAudioContext)();
			setAudioContext(ctx);
		}
	}, [gameMode.isActive, audioContext]);

	// Start level timer
	const startLevel = useCallback(() => {
		if (!currentLevelData) return;

		const challenge = currentLevelData.challenge;
		actions.setGameChallenge(challenge);
		setTimeRemaining(challenge.timeLimit);

		// Clear any existing timer
		if (gameTimer) {
			clearInterval(gameTimer);
		}

		// Start countdown timer
		const timer = setInterval(() => {
			setTimeRemaining(prev => {
				if (prev <= 1000) {
					// Time's up!
					clearInterval(timer);
					handleLevelFail();
					return 0;
				}
				return prev - 1000;
			});
		}, 1000);

		setGameTimer(timer);

		// Start beat detection for rhythm-based levels
		if (challenge.type === 'beat' || challenge.type === 'freestyle') {
			startBeatDetection();
		}

		actions.setGameFeedback("LEVEL STARTED!");
		setTimeout(() => actions.setGameFeedback(null), 2000);
	}, [currentLevelData, actions, gameTimer]);

	// Beat detection simulation (simplified)
	const startBeatDetection = useCallback(() => {
		if (beatTimer) clearInterval(beatTimer);

		// Simulate 120 BPM beat detection
		const bpm = 120;
		const beatInterval = (60 / bpm) * 1000; // ms per beat

		const timer = setInterval(() => {
			actions.updateGameAudio({
				beatPosition: (Date.now() % beatInterval) / beatInterval,
				lastBeatTime: Date.now()
			});
		}, beatInterval / 4); // Update 4 times per beat for smooth animation

		setBeatTimer(timer);
	}, [actions, beatTimer]);

	// Handle different types of game actions
	const handleGameAction = useCallback((actionType, actionData = {}) => {
		if (!gameMode.isActive || !currentLevelData) return;

		const challenge = gameMode.challenge;
		const requiredActions = challenge.requiredActions;
		const completedActions = gameMode.challenge.completedActions;

		// Check if this action is required
		const isRequiredAction = requiredActions.some(req => {
			switch (challenge.type) {
				case 'trigger':
					return req === `launch_${actionData.layer}` && actionType === 'launch';
				case 'management':
					return (req === 'launch_any' && actionType === 'launch') ||
						(req === 'stop_any' && actionType === 'stop');
				case 'beat':
					return req === 'beat_trigger' && actionType === 'launch' && checkBeatTiming();
				case 'opacity':
					return req === 'opacity_change' && actionType === 'opacity';
				case 'effects':
					return req.startsWith('effect_') && actionType === 'effect' &&
						req === `effect_${actionData.effect}`;
				default:
					return false;
			}
		});

		if (isRequiredAction) {
			// Good action!
			const points = calculatePoints(actionType, actionData);
			actions.updateGameScore(points);
			actions.completeChallengeAction(actionType);

			// Show feedback
			const feedbacks = ["NICE!", "GOOD!", "PERFECT!", "AWESOME!"];
			const feedback = feedbacks[Math.floor(Math.random() * feedbacks.length)];
			actions.setGameFeedback(feedback);
			setTimeout(() => actions.setGameFeedback(null), 1500);

			// Check if level is complete
			if (completedActions.length + 1 >= requiredActions.length) {
				handleLevelComplete();
			}
		} else if (challenge.type !== 'freestyle') {
			// Wrong action (except in freestyle mode)
			actions.updateGameScore(-10);
			actions.setGameFeedback("WRONG!");
			setTimeout(() => actions.setGameFeedback(null), 1000);
		}
	}, [gameMode, currentLevelData, actions]);

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
				actions.setGameFeedback("YOU ARE A TRUE VJ!");
			}
		}, 3000);
	}, [gameTimer, beatTimer, timeRemaining, currentLevelData, actions, gameMode.currentLevel]);

	// Handle level failure
	const handleLevelFail = useCallback(() => {
		if (gameTimer) {
			clearInterval(gameTimer);
			setGameTimer(null);
		}
		if (beatTimer) {
			clearInterval(beatTimer);
			setBeatTimer(null);
		}

		actions.setGameFeedback("TIME'S UP! TRY AGAIN");

		// Restart level after 2 seconds
		setTimeout(() => {
			actions.setGameFeedback(null);
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

	// Cleanup timers on unmount
	useEffect(() => {
		return () => {
			if (gameTimer) clearInterval(gameTimer);
			if (beatTimer) clearInterval(beatTimer);
		};
	}, [gameTimer, beatTimer]);

	// Auto-start first level when game mode activates
	useEffect(() => {
		if (gameMode.isActive && gameMode.currentLevel === 1 && timeRemaining === 0) {
			setTimeout(startLevel, 1000); // Give UI time to render
		}
	}, [gameMode.isActive, gameMode.currentLevel, timeRemaining, startLevel]);

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
						{gameMode.challenge.completedActions.length} / {gameMode.challenge.requiredActions.length}
					</div>
				</div>
				<div className="progress-bar">
					<div
						className="progress-fill"
						style={{
							width: `${(gameMode.challenge.completedActions.length /
								(gameMode.challenge.requiredActions.length || 1)) * 100}%`
						}}
					/>
				</div>
			</div>

			{/* Beat Indicator (for rhythm levels) - Now inside panel */}
			{(currentLevelData?.challenge.type === 'beat' || currentLevelData?.challenge.type === 'freestyle') && (
				<div className="beat-indicator">
					<div
						className={`beat-pulse ${Math.abs(gameMode.audio.beatPosition - 0.5) < 0.1 ? 'on-beat' : ''}`}
						style={{
							transform: `scale(${1 + gameMode.audio.beatPosition * 0.3})`
						}}
					/>
					<div className="beat-text">BEAT</div>
				</div>
			)}

			{/* Level Controls */}
			<div className="level-controls">
				<button
					className="start-button"
					onClick={startLevel}
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
		const completed = challenge.completedActions.length;
		const required = challenge.requiredActions;

		if (completed >= required.length) return "LEVEL COMPLETE!";

		const nextAction = required[completed];

		switch (challenge.type) {
			case 'trigger':
				const layerNum = nextAction.split('_')[1];
				return `Press ${layerNum} to launch video on Layer ${layerNum}`;
			case 'management':
				return nextAction.includes('launch') ?
					"Launch any video (Press 1-4)" :
					"Stop any layer (Shift+1-4)";
			case 'beat':
				return "Wait for the BEAT indicator to glow, then press 1-4";
			case 'opacity':
				return "Adjust blur using A/S keys";
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