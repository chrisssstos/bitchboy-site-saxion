import React, { createContext, useContext, useReducer, useCallback } from 'react';

// Initial state for the VJ controller
const initialState = {
	// Video layers (up to 4 layers as per client requirements)
	layers: {
		1: { video: null, opacity: 1, isPlaying: false },
		2: { video: null, opacity: 1, isPlaying: false },
		3: { video: null, opacity: 1, isPlaying: false },
		4: { video: null, opacity: 1, isPlaying: false }
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

	// Effect actions
	TOGGLE_EFFECT: 'TOGGLE_EFFECT',
	SET_EFFECT_PARAM: 'SET_EFFECT_PARAM',
	RESET_EFFECTS: 'RESET_EFFECTS',

	// Controller actions
	UPDATE_SLIDER: 'UPDATE_SLIDER',
	UPDATE_KNOB: 'UPDATE_KNOB',
	PRESS_BUTTON: 'PRESS_BUTTON',

	// Page actions
	CHANGE_PAGE: 'CHANGE_PAGE'
};

// Reducer function
function vjReducer(state, action) {
	switch (action.type) {
		case VJ_ACTIONS.LAUNCH_VIDEO:
			return {
				...state,
				layers: {
					...state.layers,
					[action.layer]: {
						...state.layers[action.layer],
						video: action.video,
						isPlaying: true
					}
				}
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