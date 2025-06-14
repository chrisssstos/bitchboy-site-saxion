import React, { createContext, useContext, useReducer, useCallback } from 'react';

// Initial state for the VJ controller
const initialState = {
	// Video layers (up to 4 layers as per client requirements)
	layers: {
		1: { video: null, opacity: 1, isPlaying: false, zIndex: 1 },
		2: { video: null, opacity: 1, isPlaying: false, zIndex: 2 },
		3: { video: null, opacity: 1, isPlaying: false, zIndex: 3 },
		4: { video: null, opacity: 1, isPlaying: false, zIndex: 4 }
	},

	// Available videos for the grid
	videoLibrary: [
		'bitchboy_spiral.mp4',
		'bitchboy_anime.mp4',
		'bitchboy_cool.mp4',
		'bitchboy_unc.mp4',
		'bitchboy_eye.mp4'
	],

	// Current page (for multiple grids)
	currentPage: 1,

	// Game mode state
	gameMode: {
		isActive: false,
		currentLevel: 1,
		score: 0,
		streak: 0,
		bestScore: 0,
		isPlaying: false,
		feedback: null, // "NICE!", "PERFECT!", "FAIL!", etc.
		progress: {
			levelsCompleted: [],
			skillsUnlocked: [],
			totalScore: 0
		},
		audio: {
			isPlaying: false,
			currentTrack: null,
			bpm: 120,
			beatPosition: 0,
			lastBeatTime: 0
		},
		challenge: {
			type: null, // 'trigger', 'beat', 'opacity', 'effects', 'freestyle'
			target: null,
			timeLimit: null,
			requiredActions: [],
			completedActions: []
		}
	},

	// Effects state
	effects: {
		// Color effects
		invert: { active: false, intensity: 0 },
		hueRotate: { active: false, degrees: 0 },
		colorize: { active: false, intensity: 0 },

		// Transform effects  
		infiniteZoom: { active: false, scale: 1 },
		warpSpeed: { active: false, perspective: 0 },
		mirror: { active: false },

		// Filter effects
		dotScreen: { active: false, intensity: 0 },
		loRez: { active: false, blur: 0 },
		strobe: { active: false, speed: 10 },
		stingySphere: { active: false, intensity: 0 },

		// Global transform
		transform: {
			rotateX: 0,
			rotateY: 0,
			rotateZ: 0,
			translateX: 0,
			translateY: 0,
			scale: 1
		}
	},

	// 3D controller state
	controller: {
		sliders: {
			// Top sliders (effects)
			top: Array(8).fill(0), // 8 top sliders for effects
			// Bottom sliders (layer opacity)  
			bottom: Array(8).fill(100) // 8 bottom sliders for layer controls
		},
		knobs: Array(16).fill(50), // Knobs for effect parameters
		buttons: Array(32).fill(false) // Grid buttons + function buttons
	}
};

// Action types
const VJ_ACTIONS = {
	// Layer actions
	LAUNCH_VIDEO: 'LAUNCH_VIDEO',
	STOP_LAYER: 'STOP_LAYER',
	SET_LAYER_OPACITY: 'SET_LAYER_OPACITY',
	BRING_LAYER_TO_FRONT: 'BRING_LAYER_TO_FRONT',

	// Effect actions
	TOGGLE_EFFECT: 'TOGGLE_EFFECT',
	SET_EFFECT_PARAM: 'SET_EFFECT_PARAM',
	RESET_EFFECTS: 'RESET_EFFECTS',

	// Controller actions
	UPDATE_SLIDER: 'UPDATE_SLIDER',
	UPDATE_KNOB: 'UPDATE_KNOB',
	PRESS_BUTTON: 'PRESS_BUTTON',

	// Page actions
	CHANGE_PAGE: 'CHANGE_PAGE',

	// Game mode actions
	TOGGLE_GAME_MODE: 'TOGGLE_GAME_MODE',
	SET_GAME_LEVEL: 'SET_GAME_LEVEL',
	UPDATE_GAME_SCORE: 'UPDATE_GAME_SCORE',
	SET_GAME_FEEDBACK: 'SET_GAME_FEEDBACK',
	UPDATE_GAME_AUDIO: 'UPDATE_GAME_AUDIO',
	SET_GAME_CHALLENGE: 'SET_GAME_CHALLENGE',
	COMPLETE_CHALLENGE_ACTION: 'COMPLETE_CHALLENGE_ACTION',
	COMPLETE_LEVEL: 'COMPLETE_LEVEL',
	RESET_GAME_STATE: 'RESET_GAME_STATE'
};

// Reducer function
function vjReducer(state, action) {
	switch (action.type) {
		case VJ_ACTIONS.LAUNCH_VIDEO:
			// When launching a video, also bring that layer to front
			const maxZIndex = Math.max(...Object.values(state.layers).map(layer => layer.zIndex));
			const updatedLayers = { ...state.layers };

			// Set the activated layer to have the highest z-index
			updatedLayers[action.layer] = {
				...state.layers[action.layer],
				video: action.video,
				isPlaying: true,
				zIndex: maxZIndex + 1
			};

			return {
				...state,
				layers: updatedLayers
			};

		case VJ_ACTIONS.STOP_LAYER:
			return {
				...state,
				layers: {
					...state.layers,
					[action.layer]: {
						...state.layers[action.layer],
						video: null,
						isPlaying: false
					}
				}
			};

		case VJ_ACTIONS.SET_LAYER_OPACITY:
			return {
				...state,
				layers: {
					...state.layers,
					[action.layer]: {
						...state.layers[action.layer],
						opacity: action.opacity
					}
				}
			};

		case VJ_ACTIONS.BRING_LAYER_TO_FRONT:
			const currentMaxZIndex = Math.max(...Object.values(state.layers).map(layer => layer.zIndex));
			return {
				...state,
				layers: {
					...state.layers,
					[action.layer]: {
						...state.layers[action.layer],
						zIndex: currentMaxZIndex + 1
					}
				}
			};

		case VJ_ACTIONS.TOGGLE_EFFECT:
			return {
				...state,
				effects: {
					...state.effects,
					[action.effect]: {
						...state.effects[action.effect],
						active: !state.effects[action.effect].active
					}
				}
			};

		case VJ_ACTIONS.SET_EFFECT_PARAM:
			return {
				...state,
				effects: {
					...state.effects,
					[action.effect]: {
						...state.effects[action.effect],
						[action.param]: action.value
					}
				}
			};

		case VJ_ACTIONS.UPDATE_SLIDER:
			return {
				...state,
				controller: {
					...state.controller,
					sliders: {
						...state.controller.sliders,
						[action.group]: state.controller.sliders[action.group].map((val, idx) =>
							idx === action.index ? action.value : val
						)
					}
				}
			};

		case VJ_ACTIONS.UPDATE_KNOB:
			return {
				...state,
				controller: {
					...state.controller,
					knobs: state.controller.knobs.map((val, idx) =>
						idx === action.index ? action.value : val
					)
				}
			};

		case VJ_ACTIONS.PRESS_BUTTON:
			return {
				...state,
				controller: {
					...state.controller,
					buttons: state.controller.buttons.map((val, idx) =>
						idx === action.index ? action.pressed : val
					)
				}
			};

		case VJ_ACTIONS.CHANGE_PAGE:
			return {
				...state,
				currentPage: action.page
			};

		case VJ_ACTIONS.RESET_EFFECTS:
			return {
				...state,
				effects: initialState.effects
			};

		// Game mode actions
		case VJ_ACTIONS.TOGGLE_GAME_MODE:
			return {
				...state,
				gameMode: {
					...state.gameMode,
					isActive: !state.gameMode.isActive,
					currentLevel: state.gameMode.isActive ? 1 : state.gameMode.currentLevel,
					feedback: null
				}
			};

		case VJ_ACTIONS.SET_GAME_LEVEL:
			return {
				...state,
				gameMode: {
					...state.gameMode,
					currentLevel: action.level,
					challenge: {
						type: null,
						target: null,
						timeLimit: null,
						requiredActions: [],
						completedActions: []
					}
				}
			};

		case VJ_ACTIONS.UPDATE_GAME_SCORE:
			const newScore = state.gameMode.score + action.points;
			return {
				...state,
				gameMode: {
					...state.gameMode,
					score: newScore,
					bestScore: Math.max(state.gameMode.bestScore, newScore),
					streak: action.points > 0 ? state.gameMode.streak + 1 : 0
				}
			};

		case VJ_ACTIONS.SET_GAME_FEEDBACK:
			return {
				...state,
				gameMode: {
					...state.gameMode,
					feedback: action.feedback
				}
			};

		case VJ_ACTIONS.UPDATE_GAME_AUDIO:
			return {
				...state,
				gameMode: {
					...state.gameMode,
					audio: {
						...state.gameMode.audio,
						...action.audioData
					}
				}
			};

		case VJ_ACTIONS.SET_GAME_CHALLENGE:
			return {
				...state,
				gameMode: {
					...state.gameMode,
					challenge: {
						...action.challenge,
						completedActions: []
					}
				}
			};

		case VJ_ACTIONS.COMPLETE_CHALLENGE_ACTION:
			return {
				...state,
				gameMode: {
					...state.gameMode,
					challenge: {
						...state.gameMode.challenge,
						completedActions: [...state.gameMode.challenge.completedActions, action.action]
					}
				}
			};

		case VJ_ACTIONS.COMPLETE_LEVEL:
			return {
				...state,
				gameMode: {
					...state.gameMode,
					progress: {
						...state.gameMode.progress,
						levelsCompleted: [...state.gameMode.progress.levelsCompleted, action.level],
						totalScore: state.gameMode.progress.totalScore + state.gameMode.score
					}
				}
			};

		case VJ_ACTIONS.RESET_GAME_STATE:
			return {
				...state,
				gameMode: {
					...initialState.gameMode,
					progress: state.gameMode.progress // Keep progress
				}
			};

		default:
			return state;
	}
}

// Create context
const VJContext = createContext();

// Provider component
export function VJProvider({ children }) {
	const [state, dispatch] = useReducer(vjReducer, initialState);

	// Action creators
	const actions = {
		launchVideo: useCallback((layer, video) => {
			dispatch({ type: VJ_ACTIONS.LAUNCH_VIDEO, layer, video });
		}, []),

		stopLayer: useCallback((layer) => {
			dispatch({ type: VJ_ACTIONS.STOP_LAYER, layer });
		}, []),

		setLayerOpacity: useCallback((layer, opacity) => {
			dispatch({ type: VJ_ACTIONS.SET_LAYER_OPACITY, layer, opacity });
		}, []),

		bringLayerToFront: useCallback((layer) => {
			dispatch({ type: VJ_ACTIONS.BRING_LAYER_TO_FRONT, layer });
		}, []),

		toggleEffect: useCallback((effect) => {
			dispatch({ type: VJ_ACTIONS.TOGGLE_EFFECT, effect });
		}, []),

		setEffectParam: useCallback((effect, param, value) => {
			dispatch({ type: VJ_ACTIONS.SET_EFFECT_PARAM, effect, param, value });
		}, []),

		updateSlider: useCallback((group, index, value) => {
			dispatch({ type: VJ_ACTIONS.UPDATE_SLIDER, group, index, value });
		}, []),

		updateKnob: useCallback((index, value) => {
			dispatch({ type: VJ_ACTIONS.UPDATE_KNOB, index, value });
		}, []),

		pressButton: useCallback((index, pressed = true) => {
			dispatch({ type: VJ_ACTIONS.PRESS_BUTTON, index, pressed });
		}, []),

		changePage: useCallback((page) => {
			dispatch({ type: VJ_ACTIONS.CHANGE_PAGE, page });
		}, []),

		resetEffects: useCallback(() => {
			dispatch({ type: VJ_ACTIONS.RESET_EFFECTS });
		}, []),

		toggleGameMode: useCallback(() => {
			dispatch({ type: VJ_ACTIONS.TOGGLE_GAME_MODE });
		}, []),

		setGameLevel: useCallback((level) => {
			dispatch({ type: VJ_ACTIONS.SET_GAME_LEVEL, level });
		}, []),

		updateGameScore: useCallback((points) => {
			dispatch({ type: VJ_ACTIONS.UPDATE_GAME_SCORE, points });
		}, []),

		setGameFeedback: useCallback((feedback) => {
			dispatch({ type: VJ_ACTIONS.SET_GAME_FEEDBACK, feedback });
		}, []),

		updateGameAudio: useCallback((audioData) => {
			dispatch({ type: VJ_ACTIONS.UPDATE_GAME_AUDIO, audioData });
		}, []),

		setGameChallenge: useCallback((challenge) => {
			dispatch({ type: VJ_ACTIONS.SET_GAME_CHALLENGE, challenge });
		}, []),

		completeChallengeAction: useCallback((action) => {
			dispatch({ type: VJ_ACTIONS.COMPLETE_CHALLENGE_ACTION, action });
		}, []),

		completeLevel: useCallback((level) => {
			dispatch({ type: VJ_ACTIONS.COMPLETE_LEVEL, level });
		}, []),

		resetGameState: useCallback(() => {
			dispatch({ type: VJ_ACTIONS.RESET_GAME_STATE });
		}, [])
	};

	const value = {
		state,
		actions
	};

	return (
		<VJContext.Provider value={value}>
			{children}
		</VJContext.Provider>
	);
}

// Hook to use VJ context
export function useVJ() {
	const context = useContext(VJContext);
	if (!context) {
		throw new Error('useVJ must be used within a VJProvider');
	}
	return context;
}

export { VJ_ACTIONS }; 