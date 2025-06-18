import React, { useEffect, useCallback } from 'react';
import { useVJ } from '../contexts/VJContext';

const VJKeyboardHandler = () => {    
    const { state, actions } = useVJ();
    const { effects, gameMode } = state;

    // Track extreme values for level progression
    const [sliderAtMin, setSliderAtMin] = React.useState(false);
    const [sliderAtMax, setSliderAtMax] = React.useState(false);
    const [zoomAtMin, setZoomAtMin] = React.useState(false);
    const [zoomAtMax, setZoomAtMax] = React.useState(false);

    // Dispatch game actions when in game mode
    const dispatchGameAction = useCallback((actionType, actionData = {}) => {
        if (gameMode.isActive) {
            window.dispatchEvent(new CustomEvent('vj-game-action', {
                detail: { type: actionType, ...actionData }
            }));
        }
    }, [gameMode.isActive]);

    const handleKeyDown = useCallback((event) => {
        const key = event.key.toLowerCase();

        // Debug ALL key presses
        console.log('🎹 Key pressed:', key, 'shiftKey:', event.shiftKey);

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

                // Dispatch game action
                dispatchGameAction('launch', { layer: layerNum, video: videos[layerNum - 1] || videos[0] });
            }
            return;
        }

        // LAYER STOP CONTROLS (Shift + Numbers)
        // Check for both event.shiftKey and key combination
        if ((event.shiftKey && key >= '1' && key <= '4') ||
            (key === '!' || key === '@' || key === '#' || key === '$')) {
            event.preventDefault(); // Prevent browser shortcuts

            let layerNum;
            if (event.shiftKey && key >= '1' && key <= '4') {
                layerNum = parseInt(key);
            } else {
                // Handle shifted number keys (!, @, #, $)
                const shiftMap = { '!': 1, '@': 2, '#': 3, '$': 4 };
                layerNum = shiftMap[key];
            }

            console.log('🛑 STOP KEY DETECTED:', `Shift+${layerNum}`, 'actual key:', key, 'shiftKey:', event.shiftKey);
            console.log('🛑 Current state layers:', state.layers);

            // ALWAYS stop the layer - this is the core functionality!
            actions.stopLayer(layerNum);

            // Also dispatch the game action for tracking
            dispatchGameAction('stop', { layer: layerNum });

            console.log('🛑 Layer stop action called for:', layerNum);
            return;
        }

        // COLOR EFFECTS (Q-T row)
        switch (key) {
            case 'q': // Invert
                actions.toggleEffect('invert');
                dispatchGameAction('effect', { effect: 'invert' });
                break;
            case 'w': // Hue rotate +
                actions.setEffectParam('hueRotate', 'degrees',
                    (effects.hueRotate.degrees + 30) % 360);
                if (!effects.hueRotate.active) actions.toggleEffect('hueRotate');
                dispatchGameAction('effect', { effect: 'hue' });
                break;
            case 'e': // Hue rotate -
                actions.setEffectParam('hueRotate', 'degrees',
                    (effects.hueRotate.degrees - 30 + 360) % 360);
                if (!effects.hueRotate.active) actions.toggleEffect('hueRotate');
                dispatchGameAction('effect', { effect: 'hue' });
                break;
            case 'r': // Colorize
                actions.toggleEffect('colorize');
                dispatchGameAction('effect', { effect: 'colorize' });
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

                // Track cycles for Level 4
                if (newBlur === 10 && !sliderAtMax) {
                    setSliderAtMax(true);
                    if (sliderAtMin) {
                        dispatchGameAction('opacity', { value: newBlur, cycle: true });
                        setSliderAtMin(false);
                    }
                }
                dispatchGameAction('opacity', { value: newBlur });
                break;
            case 's': // Blur -
                const reducedBlur = Math.max(effects.loRez.blur - 1, 0);
                actions.setEffectParam('loRez', 'blur', reducedBlur);
                if (reducedBlur === 0 && effects.loRez.active) actions.toggleEffect('loRez');

                // Track cycles for Level 4
                if (reducedBlur === 0 && !sliderAtMin) {
                    setSliderAtMin(true);
                    if (sliderAtMax) {
                        dispatchGameAction('opacity', { value: reducedBlur, cycle: true });
                        setSliderAtMax(false);
                    }
                }
                dispatchGameAction('opacity', { value: reducedBlur });
                break;
            case 'd': // Dot screen
                actions.toggleEffect('dotScreen');
                dispatchGameAction('effect', { effect: 'dotscreen' });
                break;
            case 'f': // Strobe
                actions.toggleEffect('strobe');
                dispatchGameAction('effect', { effect: 'strobe' });
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

                // Track cycles for Level 6
                if (Math.abs(newScale - 3) < 0.05 && !zoomAtMax) {
                    setZoomAtMax(true);
                    if (zoomAtMin) {
                        dispatchGameAction('effect', { effect: 'zoom', cycle: true });
                        setZoomAtMin(false);
                    }
                }
                dispatchGameAction('effect', { effect: 'zoom' });
                break;
            case 'x': // Zoom -
                const reducedScale = Math.max(effects.infiniteZoom.scale - 0.1, 1);
                actions.setEffectParam('infiniteZoom', 'scale', reducedScale);
                if (reducedScale === 1 && effects.infiniteZoom.active) actions.toggleEffect('infiniteZoom');

                // Track cycles for Level 6
                if (Math.abs(reducedScale - 1) < 0.05 && !zoomAtMin) {
                    setZoomAtMin(true);
                    if (zoomAtMax) {
                        dispatchGameAction('effect', { effect: 'zoom', cycle: true });
                        setZoomAtMax(false);
                    }
                }
                dispatchGameAction('effect', { effect: 'zoom' });
                break;
            case 'c': // Mirror
                actions.toggleEffect('mirror');
                dispatchGameAction('effect', { effect: 'mirror' });
                break;
            case 'v': // Warp +
                const newWarp = Math.min(effects.warpSpeed.perspective + 25, 200);
                actions.setEffectParam('warpSpeed', 'perspective', newWarp);
                if (newWarp > 0 && !effects.warpSpeed.active) actions.toggleEffect('warpSpeed');
                if (newWarp === 0 && effects.warpSpeed.active) actions.toggleEffect('warpSpeed');
                dispatchGameAction('effect', { effect: 'warp' });
                break;
            case 'b': // Warp -
                const reducedWarp = Math.max(effects.warpSpeed.perspective - 25, 0);
                actions.setEffectParam('warpSpeed', 'perspective', reducedWarp);
                if (reducedWarp === 0 && effects.warpSpeed.active) actions.toggleEffect('warpSpeed');
                dispatchGameAction('effect', { effect: 'warp' });
                break;
            case 'n': // Sphere rotation
                actions.toggleEffect('stingySphere');
                dispatchGameAction('effect', { effect: 'sphere' });
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
    }, [state, actions, effects, dispatchGameAction]);

    useEffect(() => {
        console.log('🎹 VJKeyboardControls mounted - adding event listener');
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            console.log('🎹 VJKeyboardControls unmounting - removing event listener');
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleKeyDown]);
}

export default VJKeyboardHandler;