import React, { useRef, useEffect, useCallback } from 'react';
import { useVJ } from '../contexts/VJContext';
import './MultiLayerVideo.css';

const MultiLayerVideo = () => {
	const { state } = useVJ();
	const { layers, effects } = state;

	// Video refs for each layer
	const layer1Ref = useRef(null);
	const layer2Ref = useRef(null);
	const layer3Ref = useRef(null);
	const layer4Ref = useRef(null);

	const videoRefs = {
		1: layer1Ref,
		2: layer2Ref,
		3: layer3Ref,
		4: layer4Ref
	};

	// Apply effects to a video element
	const applyEffectsToVideo = useCallback((videoElement, layerEffects = effects) => {
		if (!videoElement) return;

		// Reset styles
		videoElement.style.filter = '';
		videoElement.style.transform = '';
		videoElement.style.mixBlendMode = 'normal';

		// Build filter string
		let filterString = '';

		// Color effects
		if (layerEffects.invert.active) {
			filterString += 'invert(1) ';
		}

		if (layerEffects.hueRotate.active && layerEffects.hueRotate.degrees !== 0) {
			filterString += `hue-rotate(${layerEffects.hueRotate.degrees}deg) `;
		}

		if (layerEffects.colorize.active) {
			const intensity = layerEffects.colorize.intensity || 1;
			filterString += `sepia(${intensity}) saturate(${intensity * 3}) `;
		}

		// Filter effects
		if (layerEffects.dotScreen.active) {
			filterString += 'url(#dot-screen) contrast(1.4) ';
		}

		if (layerEffects.loRez.active && layerEffects.loRez.blur > 0) {
			filterString += `blur(${layerEffects.loRez.blur}px) contrast(1.2) `;
		}

		// Apply filters
		if (filterString) {
			videoElement.style.filter = filterString;
		}

		// Build transform string
		let transformString = '';

		// Transform effects
		if (layerEffects.infiniteZoom.active) {
			transformString += `scale(${layerEffects.infiniteZoom.scale}) `;
		}

		if (layerEffects.warpSpeed.active && layerEffects.warpSpeed.perspective > 0) {
			transformString += `perspective(500px) translateZ(${layerEffects.warpSpeed.perspective}px) `;
		}

		if (layerEffects.mirror.active) {
			transformString += 'scaleX(-1) ';
		}

		if (layerEffects.stingySphere.active) {
			const intensity = layerEffects.stingySphere.intensity || 15;
			transformString += `perspective(500px) rotateY(${intensity}deg) `;
		}

		// Global transform
		const t = layerEffects.transform;
		transformString += `scale(${t.scale}) rotateX(${t.rotateX}deg) rotateY(${t.rotateY}deg) rotateZ(${t.rotateZ}deg) translateX(${t.translateX}px) translateY(${t.translateY}px)`;

		// Apply transform
		videoElement.style.transform = transformString;

	}, [effects]);

	// Handle strobe effect
	useEffect(() => {
		let strobeInterval = null;

		if (effects.strobe.active) {
			let isVisible = true;
			strobeInterval = setInterval(() => {
				Object.values(videoRefs).forEach(ref => {
					if (ref.current) {
						isVisible = !isVisible;
						ref.current.style.opacity = isVisible ? ref.current.dataset.layerOpacity || 1 : 0;
					}
				});
			}, 1000 / (effects.strobe.speed || 10));
		}

		return () => {
			if (strobeInterval) {
				clearInterval(strobeInterval);
			}
		};
	}, [effects.strobe.active, effects.strobe.speed]);

	// Apply effects when they change
	useEffect(() => {
		Object.values(videoRefs).forEach(ref => {
			if (ref.current) {
				applyEffectsToVideo(ref.current);
			}
		});
	}, [effects, applyEffectsToVideo]);

	// Handle video playback and opacity changes
	useEffect(() => {
		console.log('🎬 MultiLayerVideo: layers state changed:', layers);
		Object.entries(layers).forEach(([layerNum, layer]) => {
			const videoRef = videoRefs[layerNum];
			if (!videoRef.current) return;

			const videoElement = videoRef.current;

			console.log(`🎬 Layer ${layerNum}:`, {
				video: layer.video,
				isPlaying: layer.isPlaying,
				shouldShow: layer.video && layer.isPlaying
			});

			// Handle video source changes
			if (layer.video && layer.isPlaying) {
				const newSrc = `/movs/${layer.video}`;
				if (videoElement.src !== newSrc) {
					console.log(`🎬 Loading new video for layer ${layerNum}:`, newSrc);
					videoElement.src = newSrc;
					videoElement.load();
					videoElement.play().catch(err => {
						console.warn(`Video play failed for layer ${layerNum}:`, err);
						// Try to continue anyway
					});
				}
				videoElement.style.display = 'block';
				console.log(`🎬 Layer ${layerNum} set to visible`);
			} else {
				videoElement.style.display = 'none';
				if (!videoElement.paused) {
					videoElement.pause();
				}
				console.log(`🎬 Layer ${layerNum} set to hidden (video: ${layer.video}, isPlaying: ${layer.isPlaying})`);
			}
		});
	}, [layers[1].video, layers[1].isPlaying, layers[2].video, layers[2].isPlaying, layers[3].video, layers[3].isPlaying, layers[4].video, layers[4].isPlaying]); // Only depend on video/playing state

	// Handle opacity and z-index changes separately
	useEffect(() => {
		Object.entries(layers).forEach(([layerNum, layer]) => {
			const videoRef = videoRefs[layerNum];
			if (!videoRef.current) return;

			const videoElement = videoRef.current;

			// Handle opacity changes - always update, strobe will override if active
			videoElement.style.opacity = layer.opacity;
			videoElement.dataset.layerOpacity = layer.opacity;

			// Handle z-index changes for layer stacking
			videoElement.style.zIndex = layer.zIndex;
		});
	}, [layers[1].opacity, layers[2].opacity, layers[3].opacity, layers[4].opacity, layers[1].zIndex, layers[2].zIndex, layers[3].zIndex, layers[4].zIndex]); // Depend on opacity and z-index changes

	return (
		<div className="multi-layer-video">
			{/* SVG Filters for effects */}
			<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="0" height="0" style={{ position: 'absolute' }}>
				<defs>
					<filter id="dot-screen">
						<feFlood floodColor="#000000" result="black" />
						<feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
						<feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
							result="dotscreen" />
						<feComposite in="dotscreen" in2="black" operator="in" result="dots" />
						<feComposite in="SourceGraphic" in2="dots" operator="lighter" />
					</filter>
				</defs>
			</svg>

			{/* Video Layers Container */}
			<div className="video-layers-container">
				{/* Layer 1 (Bottom) */}
				<video
					ref={layer1Ref}
					className="video-layer layer-1"
					muted
					loop
					playsInline
					style={{ display: 'none' }}
				/>

				{/* Layer 2 */}
				<video
					ref={layer2Ref}
					className="video-layer layer-2"
					muted
					loop
					playsInline
					style={{ display: 'none' }}
				/>

				{/* Layer 3 */}
				<video
					ref={layer3Ref}
					className="video-layer layer-3"
					muted
					loop
					playsInline
					style={{ display: 'none' }}
				/>

				{/* Layer 4 (Top) */}
				<video
					ref={layer4Ref}
					className="video-layer layer-4"
					muted
					loop
					playsInline
					style={{ display: 'none' }}
				/>
			</div>

			{/* Debug Info */}
			<div className="layer-debug-info">
				{Object.entries(layers).map(([layerNum, layer]) => (
					<div key={layerNum} className="layer-info">
						<strong>Layer {layerNum}:</strong>
						{layer.isPlaying ? (
							<span> {layer.video} (Opacity: {Math.round(layer.opacity * 100)}%)</span>
						) : (
							<span> Stopped</span>
						)}
					</div>
				))}
			</div>
		</div>
	);
};

export default MultiLayerVideo; 