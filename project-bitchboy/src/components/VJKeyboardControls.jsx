import React, { useEffect, useCallback } from 'react';
import { useVJ } from '../contexts/VJContext';
import './VJKeyboardControls.css';

const VJKeyboardControls = () => {
	const { state, actions } = useVJ();
	const { effects } = state;

	const handleKeyDown = useCallback((event) => {
		const key = event.key.toLowerCase();

		// Prevent default for space and arrow keys
		if ([' ', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(key)) {
			event.preventDefault();
		}

		// VIDEO LAYER CONTROLS (Numbers 1-4)
		if (key >= '1' && key <= '4') {
			const layerNum = parseInt(key);
			// For now, just launch the first video in that layer
			// This can be expanded with a video selection system
			const videos = state.videoLibrary;
			if (videos.length > 0) {
				actions.launchVideo(layerNum, videos[layerNum - 1] || videos[0]);
			}
			return;
		}

		// LAYER STOP CONTROLS (Shift + Numbers)
		if (event.shiftKey && key >= '1' && key <= '4') {
			const layerNum = parseInt(key);
			actions.stopLayer(layerNum);
			return;
		}

		// COLOR EFFECTS (Q-T row)
		switch (key) {
			case 'q': // Invert
				actions.toggleEffect('invert');
				break;
			case 'w': // Hue rotate +
				actions.setEffectParam('hueRotate', 'degrees',
					(effects.hueRotate.degrees + 30) % 360);
				if (!effects.hueRotate.active) actions.toggleEffect('hueRotate');
				break;
			case 'e': // Hue rotate -
				actions.setEffectParam('hueRotate', 'degrees',
					(effects.hueRotate.degrees - 30 + 360) % 360);
				if (!effects.hueRotate.active) actions.toggleEffect('hueRotate');
				break;
			case 'r': // Colorize
				actions.toggleEffect('colorize');
				break;
			case 't': // Reset color effects
				actions.setEffectParam('hueRotate', 'degrees', 0);
				actions.toggleEffect('hueRotate', false);
				actions.toggleEffect('invert', false);
				actions.toggleEffect('colorize', false);
				break;

			// FILTER EFFECTS (A-G row)
			case 'a': // Blur +
				const newBlur = Math.min(effects.loRez.blur + 1, 10);
				actions.setEffectParam('loRez', 'blur', newBlur);
				if (newBlur > 0 && !effects.loRez.active) actions.toggleEffect('loRez');
				if (newBlur === 0 && effects.loRez.active) actions.toggleEffect('loRez');
				break;
			case 's': // Blur -
				const reducedBlur = Math.max(effects.loRez.blur - 1, 0);
				actions.setEffectParam('loRez', 'blur', reducedBlur);
				if (reducedBlur === 0 && effects.loRez.active) actions.toggleEffect('loRez');
				break;
			case 'd': // Dot screen
				actions.toggleEffect('dotScreen');
				break;
			case 'f': // Strobe
				actions.toggleEffect('strobe');
				break;
			case 'g': // Reset filter effects
				actions.toggleEffect('loRez', false);
				actions.toggleEffect('dotScreen', false);
				actions.toggleEffect('strobe', false);
				actions.setEffectParam('loRez', 'blur', 0);
				break;

			// TRANSFORM EFFECTS (Z-M row)
			case 'z': // Zoom +
				const newScale = Math.min(effects.infiniteZoom.scale + 0.1, 3);
				actions.setEffectParam('infiniteZoom', 'scale', newScale);
				if (newScale > 1 && !effects.infiniteZoom.active) actions.toggleEffect('infiniteZoom');
				if (newScale === 1 && effects.infiniteZoom.active) actions.toggleEffect('infiniteZoom');
				break;
			case 'x': // Zoom -
				const reducedScale = Math.max(effects.infiniteZoom.scale - 0.1, 1);
				actions.setEffectParam('infiniteZoom', 'scale', reducedScale);
				if (reducedScale === 1 && effects.infiniteZoom.active) actions.toggleEffect('infiniteZoom');
				break;
			case 'c': // Mirror
				actions.toggleEffect('mirror');
				break;
			case 'v': // Warp +
				const newWarp = Math.min(effects.warpSpeed.perspective + 25, 200);
				actions.setEffectParam('warpSpeed', 'perspective', newWarp);
				if (newWarp > 0 && !effects.warpSpeed.active) actions.toggleEffect('warpSpeed');
				if (newWarp === 0 && effects.warpSpeed.active) actions.toggleEffect('warpSpeed');
				break;
			case 'b': // Warp -
				const reducedWarp = Math.max(effects.warpSpeed.perspective - 25, 0);
				actions.setEffectParam('warpSpeed', 'perspective', reducedWarp);
				if (reducedWarp === 0 && effects.warpSpeed.active) actions.toggleEffect('warpSpeed');
				break;
			case 'n': // Sphere rotation
				actions.toggleEffect('stingySphere');
				break;
			case 'm': // Reset transform effects
				actions.setEffectParam('infiniteZoom', 'scale', 1);
				actions.setEffectParam('warpSpeed', 'perspective', 0);
				actions.toggleEffect('infiniteZoom', false);
				actions.toggleEffect('warpSpeed', false);
				actions.toggleEffect('mirror', false);
				actions.toggleEffect('stingySphere', false);
				break;

			// GLOBAL CONTROLS
			case ' ': // Reset ALL effects
				actions.resetEffects();
				break;
			case 'escape': // Panic - stop all layers
				[1, 2, 3, 4].forEach(layer => actions.stopLayer(layer));
				actions.resetEffects();
				break;
		}
	}, [state, actions, effects]);

	useEffect(() => {
		document.addEventListener('keydown', handleKeyDown);
		return () => document.removeEventListener('keydown', handleKeyDown);
	}, [handleKeyDown]);

	return (
		<div className="vj-keyboard-controls">
			<div className="control-section">
				<h3>🎬 LAYERS</h3>
				<div className="key-row">
					<span className="key">1</span><span className="desc">Layer 1</span>
					<span className="key">2</span><span className="desc">Layer 2</span>
					<span className="key">3</span><span className="desc">Layer 3</span>
					<span className="key">4</span><span className="desc">Layer 4</span>
				</div>
				<div className="key-row">
					<span className="key">Shift+1-4</span><span className="desc">Stop Layer</span>
				</div>
			</div>

			<div className="control-section">
				<h3>🎨 COLOR EFFECTS</h3>
				<div className="key-row">
					<span className="key">Q</span><span className="desc">Invert RGB</span>
					<span className="key">W</span><span className="desc">Hue +30°</span>
					<span className="key">E</span><span className="desc">Hue -30°</span>
					<span className="key">R</span><span className="desc">Colorize</span>
					<span className="key">T</span><span className="desc">Reset Colors</span>
				</div>
			</div>

			<div className="control-section">
				<h3>🔧 FILTER EFFECTS</h3>
				<div className="key-row">
					<span className="key">A</span><span className="desc">Blur +</span>
					<span className="key">S</span><span className="desc">Blur -</span>
					<span className="key">D</span><span className="desc">Dot Screen</span>
					<span className="key">F</span><span className="desc">Strobe</span>
					<span className="key">G</span><span className="desc">Reset Filters</span>
				</div>
			</div>

			<div className="control-section">
				<h3>🔄 TRANSFORM EFFECTS</h3>
				<div className="key-row">
					<span className="key">Z</span><span className="desc">Zoom +</span>
					<span className="key">X</span><span className="desc">Zoom -</span>
					<span className="key">C</span><span className="desc">Mirror</span>
					<span className="key">V</span><span className="desc">Warp +</span>
					<span className="key">B</span><span className="desc">Warp -</span>
					<span className="key">N</span><span className="desc">Sphere</span>
					<span className="key">M</span><span className="desc">Reset Transform</span>
				</div>
			</div>

			<div className="control-section">
				<h3>⚡ GLOBAL</h3>
				<div className="key-row">
					<span className="key">Space</span><span className="desc">Reset All Effects</span>
					<span className="key">Esc</span><span className="desc">PANIC (Stop All)</span>
				</div>
			</div>

			{/* Current Status Display */}
			<div className="status-display">
				<h3>📊 STATUS</h3>
				<div className="status-grid">
					{Object.entries(effects).map(([effectName, effectData]) => {
						if (effectName === 'transform') return null;
						return (
							<div key={effectName} className={`status-item ${effectData.active ? 'active' : ''}`}>
								<span className="effect-name">{effectName}</span>
								<span className="effect-value">
									{effectData.active ? 'ON' : 'OFF'}
									{effectData.degrees !== undefined && ` (${effectData.degrees}°)`}
									{effectData.scale !== undefined && effectData.scale !== 1 && ` (${effectData.scale.toFixed(1)}x)`}
									{effectData.blur !== undefined && effectData.blur > 0 && ` (${effectData.blur}px)`}
									{effectData.perspective !== undefined && effectData.perspective > 0 && ` (${effectData.perspective}px)`}
								</span>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
};

export default VJKeyboardControls; 