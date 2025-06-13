import React, { useEffect, useCallback } from 'react';
import { useVJ } from '../contexts/VJContext';

// Mapping configuration for 3D controller elements
const CONTROLLER_MAPPING = {
	// Grid buttons (for launching videos)
	buttons: {
		// Top row (Layer 1)
		0: { type: 'launch', layer: 1, video: 'bitchboy_spiral.mp4' },
		1: { type: 'launch', layer: 1, video: 'bitchboy_anime.mp4' },
		2: { type: 'launch', layer: 1, video: 'bitchboy_cool.mp4' },
		3: { type: 'launch', layer: 1, video: 'bitchboy_unc.mp4' },
		4: { type: 'launch', layer: 1, video: 'bitchboy_eye.mp4' },

		// Second row (Layer 2)
		8: { type: 'launch', layer: 2, video: 'bitchboy_spiral.mp4' },
		9: { type: 'launch', layer: 2, video: 'bitchboy_anime.mp4' },
		10: { type: 'launch', layer: 2, video: 'bitchboy_cool.mp4' },
		11: { type: 'launch', layer: 2, video: 'bitchboy_unc.mp4' },
		12: { type: 'launch', layer: 2, video: 'bitchboy_eye.mp4'},

		// Third row (Layer 3)
		16: { type: 'launch', layer: 3, video: 'bitchboy_spiral.mp4' },
		17: { type: 'launch', layer: 3, video: 'bitchboy_anime.mp4' },
		18: { type: 'launch', layer: 3, video: 'bitchboy_cool.mp4' },
		19: { type: 'launch', layer: 3, video: 'bitchboy_unc.mp4' },
		20: { type: 'launch', layer: 3, video: 'bitchboy_eye.mp4' },

		// Fourth row (Layer 4)
		24: { type: 'launch', layer: 4, video: 'bitchboy_spiral.mp4' },
		25: { type: 'launch', layer: 4, video: 'bitchboy_anime.mp4' },
		26: { type: 'launch', layer: 4, video: 'bitchboy_cool.mp4' },
		27: { type: 'launch', layer: 4, video: 'bitchboy_unc.mp4' },
		28: { type: 'launch', layer: 4, video: 'bitchboy_eye.mp4' }
	},

	// Bottom sliders (layer opacity control)
	bottomSliders: {
		0: { type: 'layerOpacity', layer: 1 },
		1: { type: 'layerOpacity', layer: 2 },
		2: { type: 'layerOpacity', layer: 3 },
		3: { type: 'layerOpacity', layer: 4 }
	},

	// Top sliders (effect activation/intensity)
	topSliders: {
		0: { type: 'effectIntensity', effect: 'hueRotate', param: 'degrees', range: [0, 360] },
		1: { type: 'effectIntensity', effect: 'infiniteZoom', param: 'scale', range: [1, 3] },
		2: { type: 'effectIntensity', effect: 'warpSpeed', param: 'perspective', range: [0, 200] },
		3: { type: 'effectIntensity', effect: 'loRez', param: 'blur', range: [0, 10] },
		4: { type: 'effectIntensity', effect: 'colorize', param: 'intensity', range: [0, 2] },
		5: { type: 'effectIntensity', effect: 'stingySphere', param: 'intensity', range: [0, 45] },
		6: { type: 'effectIntensity', effect: 'strobe', param: 'speed', range: [1, 30] }
	},

	// Knobs (fine-tune effect parameters)
	knobs: {
		0: { type: 'transform', param: 'rotateX', range: [0, 360] },
		1: { type: 'transform', param: 'rotateY', range: [0, 360] },
		2: { type: 'transform', param: 'rotateZ', range: [0, 360] },
		3: { type: 'transform', param: 'scale', range: [0.5, 2] },
		4: { type: 'transform', param: 'translateX', range: [-100, 100] },
		5: { type: 'transform', param: 'translateY', range: [-100, 100] }
	}
};

const VJ3DController = ({
	onSliderChange,
	onKnobChange,
	onButtonPress,
	sliderValues = {},
	knobValues = {},
	buttonStates = {}
}) => {
	const { state, actions } = useVJ();

	// Convert slider value (0-100) to mapped range
	const mapSliderValue = useCallback((value, range) => {
		const [min, max] = range;
		return min + (value / 100) * (max - min);
	}, []);

	// Convert knob value (0-100) to mapped range  
	const mapKnobValue = useCallback((value, range) => {
		const [min, max] = range;
		return min + (value / 100) * (max - min);
	}, []);

	// Handle slider changes from 3D model
	const handleSliderChange = useCallback((group, index, value) => {
		actions.updateSlider(group, index, value);

		const mapping = group === 'top' ?
			CONTROLLER_MAPPING.topSliders[index] :
			CONTROLLER_MAPPING.bottomSliders[index];

		if (!mapping) return;

		if (mapping.type === 'layerOpacity') {
			// Convert 0-100 to 0-1 for opacity
			const opacity = value / 100;
			actions.setLayerOpacity(mapping.layer, opacity);
		} else if (mapping.type === 'effectIntensity') {
			const mappedValue = mapSliderValue(value, mapping.range);

			// Only activate effect if it's not already active and value > 0
			if (value > 0 && !state.effects[mapping.effect].active) {
				actions.toggleEffect(mapping.effect);
			}
			// Always update the parameter value
			actions.setEffectParam(mapping.effect, mapping.param, mappedValue);

			// Deactivate effect if value goes to 0
			if (value === 0 && state.effects[mapping.effect].active) {
				actions.toggleEffect(mapping.effect);
			}
		}

		// Notify parent component
		if (onSliderChange) {
			onSliderChange(group, index, value);
		}
	}, [actions, mapSliderValue, onSliderChange, state.effects]);

	// Handle knob changes from 3D model
	const handleKnobChange = useCallback((index, value) => {
		actions.updateKnob(index, value);

		const mapping = CONTROLLER_MAPPING.knobs[index];
		if (!mapping) return;

		if (mapping.type === 'transform') {
			const mappedValue = mapKnobValue(value, mapping.range);
			actions.setEffectParam('transform', mapping.param, mappedValue);
		}

		// Notify parent component
		if (onKnobChange) {
			onKnobChange(index, value);
		}
	}, [actions, mapKnobValue, onKnobChange]);

	// Handle button presses from 3D model
	const handleButtonPress = useCallback((index, pressed = true) => {
		actions.pressButton(index, pressed);

		const mapping = CONTROLLER_MAPPING.buttons[index];
		if (!mapping) return;

		// Only trigger on button press, not release
		if (!pressed) return;

		switch (mapping.type) {
			case 'launch':
				actions.launchVideo(mapping.layer, mapping.video);
				break;

			case 'stop':
				actions.stopLayer(mapping.layer);
				break;

			case 'effect':
				actions.toggleEffect(mapping.effect);
				break;

			case 'reset':
				actions.resetEffects();
				break;

			case 'page':
				actions.changePage(mapping.page);
				break;
		}

		// Notify parent component
		if (onButtonPress) {
			onButtonPress(index, pressed);
		}
	}, [actions, onButtonPress]);

	// Listen for external slider changes and apply them
	useEffect(() => {
		Object.entries(sliderValues).forEach(([key, value]) => {
			const [group, index] = key.split('_');
			if (group && index !== undefined) {
				handleSliderChange(group, parseInt(index), value);
			}
		});
	}, [sliderValues, handleSliderChange]);

	// Listen for external knob changes and apply them
	useEffect(() => {
		Object.entries(knobValues).forEach(([index, value]) => {
			handleKnobChange(parseInt(index), value);
		});
	}, [knobValues, handleKnobChange]);

	// Listen for external button changes and apply them
	useEffect(() => {
		Object.entries(buttonStates).forEach(([index, pressed]) => {
			handleButtonPress(parseInt(index), pressed);
		});
	}, [buttonStates, handleButtonPress]);

	// Expose handlers for 3D model to use
	useEffect(() => {
		// Store handlers in global scope for 3D model to access
		window.vjController = {
			handleSliderChange,
			handleKnobChange,
			handleButtonPress
		};

		return () => {
			delete window.vjController;
		};
	}, [handleSliderChange, handleKnobChange, handleButtonPress]);

	return (
		<div className="vj-3d-controller">
			{/* This component doesn't render anything visible */}
			{/* It just manages the connection between 3D model and VJ state */}

			{/* Debug info - can be removed in production */}
			<div className="controller-debug" style={{
				position: 'absolute',
				top: '10px',
				right: '10px',
				background: 'rgba(0,0,0,0.8)',
				color: 'white',
				padding: '10px',
				borderRadius: '5px',
				fontSize: '12px',
				fontFamily: 'monospace',
				zIndex: 999,
				pointerEvents: 'none'
			}}>
				<div>Active Effects: {Object.entries(state.effects).filter(([key, effect]) => effect.active).map(([key]) => key).join(', ') || 'None'}</div>
				<div>Active Layers: {Object.entries(state.layers).filter(([key, layer]) => layer.isPlaying).map(([key]) => `L${key}`).join(', ') || 'None'}</div>
			</div>
		</div>
	);
};

export default VJ3DController; 