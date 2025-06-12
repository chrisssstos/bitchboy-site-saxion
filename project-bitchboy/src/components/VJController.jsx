import React, { useEffect, useRef, useState, useCallback } from 'react';
import { animate } from 'animejs';
import './VJController.css';

const VJController = () => {
	const video1Ref = useRef(null);
	const video2Ref = useRef(null);
	const video3Ref = useRef(null);
	const video4Ref = useRef(null);
	const video5Ref = useRef(null);

	const [activeVideo, setActiveVideo] = useState(1);
	const [effects, setEffects] = useState({
		crossFader: 0,
		blendMode: 'normal',
		invert: false,
		hueRotate: 0,
		colorize: false,
		infiniteZoom: 0,
		strobe: false,
		strobeInterval: null,
		dotScreen: false,
		warpSpeed: 0,
		stingySphere: false,
		mirror: false,
		loRez: 0,
		transform: {
			scale: 1,
			rotateX: 0,
			rotateY: 0,
			rotateZ: 0,
			translateX: 0,
			translateY: 0
		}
	});

	// Get current active video element
	const getCurrentVideo = useCallback(() => {
		switch (activeVideo) {
			case 1: return video1Ref.current;
			case 2: return video2Ref.current;
			case 3: return video3Ref.current;
			case 4: return video4Ref.current;
			case 5: return video5Ref.current;
			default: return video1Ref.current;
		}
	}, [activeVideo]);

	// Apply all effects to current video
	const applyAllEffects = useCallback(() => {
		const video = getCurrentVideo();
		if (!video) return;

		// Reset all styles first
		video.style.filter = '';
		video.style.transform = '';
		video.style.mixBlendMode = effects.blendMode;

		// Build filter string
		let filterString = '';

		// Invert RGB
		if (effects.invert) {
			filterString += 'invert(1) ';
		}

		// Hue Rotate
		if (effects.hueRotate !== 0) {
			filterString += `hue-rotate(${effects.hueRotate}deg) `;
		}

		// Colorize (using sepia)
		if (effects.colorize) {
			filterString += 'sepia(1) saturate(5) ';
		}

		// Dot Screen (using url pattern or pixelate)
		if (effects.dotScreen) {
			filterString += 'url(#dot-screen) contrast(1.4) ';
		}

		// Lo-Rez (pixelate effect using blur)
		if (effects.loRez > 0) {
			filterString += `blur(${effects.loRez}px) contrast(1.2) `;
		}

		// Apply filters
		if (filterString) {
			video.style.filter = filterString;
		}

		// Apply transform effects
		let transformString = '';

		// Scale (Infinite Zoom)
		transformString += `scale(${1 + effects.infiniteZoom}) `;

		// WarpSpeed (perspective effect)
		if (effects.warpSpeed > 0) {
			transformString += `perspective(500px) translateZ(${effects.warpSpeed}px) `;
		}

		// Mirror effect
		if (effects.mirror) {
			transformString += 'scaleX(-1) ';
		}

		// Stingy Sphere (bulge effect)
		if (effects.stingySphere) {
			// This is approximated with rotation
			transformString += 'perspective(500px) rotateY(15deg) ';
		}

		// General transform properties
		const t = effects.transform;
		transformString += `scale(${t.scale}) rotateX(${t.rotateX}deg) rotateY(${t.rotateY}deg) rotateZ(${t.rotateZ}deg) translateX(${t.translateX}px) translateY(${t.translateY}px)`;

		// Apply transforms
		video.style.transform = transformString;
	}, [effects, getCurrentVideo]);

	// Function to switch between videos
	const switchVideo = useCallback((videoNumber) => {
		if (videoNumber === activeVideo) return;

		const currentVideo = getCurrentVideo();
		let newVideoRef;

		switch (videoNumber) {
			case 1: newVideoRef = video1Ref; break;
			case 2: newVideoRef = video2Ref; break;
			case 3: newVideoRef = video3Ref; break;
			case 4: newVideoRef = video4Ref; break;
			case 5: newVideoRef = video5Ref; break;
			default: return;
		}

		const newVideo = newVideoRef.current;
		if (!currentVideo || !newVideo) return;

		// Hide current video
		animate(currentVideo, {
			opacity: 0,
			duration: 0,
			ease: 'outQuad',
			onComplete: function () {
				// Hide all videos
				[video1Ref, video2Ref, video3Ref, video4Ref, video5Ref].forEach(ref => {
					if (ref.current) {
						ref.current.classList.add('hidden');
					}
				});
				// Show new video
				newVideo.classList.remove('hidden');
				// Set new video to be fully visible immediately
				newVideo.style.opacity = 1;
			}
		});

		setActiveVideo(videoNumber);
	}, [activeVideo, getCurrentVideo]);

	// Reset all effects
	const resetEffects = useCallback(() => {
		// Stop any intervals
		if (effects.strobeInterval) {
			clearInterval(effects.strobeInterval);
		}

		// Reset effect states
		setEffects({
			crossFader: 0,
			blendMode: 'normal',
			invert: false,
			hueRotate: 0,
			colorize: false,
			infiniteZoom: 0,
			strobe: false,
			strobeInterval: null,
			dotScreen: false,
			warpSpeed: 0,
			stingySphere: false,
			mirror: false,
			loRez: 0,
			transform: {
				scale: 1,
				rotateX: 0,
				rotateY: 0,
				rotateZ: 0,
				translateX: 0,
				translateY: 0
			}
		});
	}, [effects.strobeInterval]);

	// Handle keyboard events
	const handleKeyDown = useCallback((event) => {
		const key = event.key.toLowerCase();
		let needsUpdate = true;

		setEffects(prevEffects => {
			const newEffects = { ...prevEffects };

			// Switch videos with number keys
			if (key === '1') {
				switchVideo(1);
				console.log("AAAAHHH");
				needsUpdate = false;
			} else if (key === '2') {
				switchVideo(2);
				needsUpdate = false;
			} else if (key === '3') {
				switchVideo(3);
				needsUpdate = false;
			} else if (key === '4') {
				switchVideo(4);
				needsUpdate = false;
			} else if (key === '5') {
				switchVideo(5);
				needsUpdate = false;
			}
			// Invert RGB - Q
			else if (key === 'q') {
				newEffects.invert = !newEffects.invert;
			}
			// Hue Rotate - W (increase) / S (decrease)
			else if (key === 'w') {
				newEffects.hueRotate = (newEffects.hueRotate + 30) % 360;
			}
			else if (key === 's') {
				newEffects.hueRotate = (newEffects.hueRotate - 30 + 360) % 360;
			}
			// Colorize - E
			else if (key === 'e') {
				newEffects.colorize = !newEffects.colorize;
			}
			// Infinite Zoom - R (increase) / F (decrease)
			else if (key === 'r') {
				newEffects.infiniteZoom = Math.min(newEffects.infiniteZoom + 0.1, 1);
			}
			else if (key === 'f') {
				newEffects.infiniteZoom = Math.max(newEffects.infiniteZoom - 0.1, 0);
			}
			// Strobe - T
			else if (key === 't') {
				newEffects.strobe = !newEffects.strobe;
			}
			// Dot Screen - Y
			else if (key === 'y') {
				newEffects.dotScreen = !newEffects.dotScreen;
			}
			// WarpSpeed - U (increase) / J (decrease)
			else if (key === 'u') {
				newEffects.warpSpeed = Math.min(newEffects.warpSpeed + 50, 200);
			}
			else if (key === 'j') {
				newEffects.warpSpeed = Math.max(newEffects.warpSpeed - 50, 0);
			}
			// Stingy Sphere - I
			else if (key === 'i') {
				newEffects.stingySphere = !newEffects.stingySphere;
			}
			// Mirror - O
			else if (key === 'o') {
				newEffects.mirror = !newEffects.mirror;
			}
			// Lo-Rez - P (increase) / L (decrease)
			else if (key === 'p') {
				newEffects.loRez = Math.min(newEffects.loRez + 1, 10);
			}
			else if (key === 'l') {
				newEffects.loRez = Math.max(newEffects.loRez - 1, 0);
			}
			// Transform rotations
			else if (key === 'z') {
				newEffects.transform.rotateX = (newEffects.transform.rotateX + 45) % 360;
			}
			else if (key === 'x') {
				newEffects.transform.rotateY = (newEffects.transform.rotateY + 45) % 360;
			}
			else if (key === 'c') {
				newEffects.transform.rotateZ = (newEffects.transform.rotateZ + 45) % 360;
			}
			// Reset all effects - Space
			else if (key === ' ') {
				resetEffects();
				needsUpdate = false;
			}
			else {
				needsUpdate = false;
			}

			return newEffects;
		});
	}, [switchVideo, resetEffects]);

	// Initialize videos and event listeners
	useEffect(() => {
		const videos = [video1Ref, video2Ref, video3Ref, video4Ref, video5Ref];
		videos.forEach(ref => {
			if (ref.current) {
				ref.current.play();
			}
		});

		// Add event listener
		document.addEventListener('keydown', handleKeyDown);

		return () => {
			document.removeEventListener('keydown', handleKeyDown);
			// Clean up intervals
			if (effects.strobeInterval) {
				clearInterval(effects.strobeInterval);
			}
		};
	}, [handleKeyDown, effects.strobeInterval]);

	// Apply effects when they change
	useEffect(() => {
		applyAllEffects();

		// Handle strobe effect directly here
		if (effects.strobe && !effects.strobeInterval) {
			// Start strobe effect
			let isVisible = true;
			const strobeInterval = setInterval(() => {
				const video = getCurrentVideo();
				if (video) {
					isVisible = !isVisible;
					video.style.opacity = isVisible ? 1 : 0;
				}
			}, 100);
			setEffects(prev => ({ ...prev, strobeInterval }));
		} else if (!effects.strobe && effects.strobeInterval) {
			// Stop strobe effect
			clearInterval(effects.strobeInterval);
			const video = getCurrentVideo();
			if (video) {
				video.style.opacity = 1;
			}
			setEffects(prev => ({ ...prev, strobeInterval: null }));
		}
	}, [effects, applyAllEffects, getCurrentVideo]);

	return (
		<div className="vj-container">
			{/* SVG Filters */}
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

			<div className="container">
				<h1>Bitch Boy Controller - VJ Interface</h1>
				<div className="video-container">
					<video
						ref={video1Ref}
						id="video1"
						className="video-player"
						src="/movs/bitchboy_spiral.mp4"
						muted
						loop
					/>
					<video
						ref={video2Ref}
						id="video2"
						className="video-player hidden"
						src="/movs/bitchboy_anime.mp4"
						muted
						loop
					/>
					<video
						ref={video3Ref}
						id="video3"
						className="video-player hidden"
						src="/movs/bitchboy_cool.mp4"
						muted
						loop
					/>
					<video
						ref={video4Ref}
						id="video4"
						className="video-player hidden"
						src="/movs/bitchboy_eye.mp4"
						muted
						loop
					/>
					<video
						ref={video5Ref}
						id="video5"
						className="video-player hidden"
						src="/movs/bitchboy_unc.mp4"
						muted
						loop
					/>
				</div>
				<div className="controls">
					<p>Press <strong>1-5</strong> to switch between animations</p>
					<p>Press <strong>Q</strong> to toggle Invert RGB ({effects.invert ? 'ON' : 'OFF'})</p>
					<p>Press <strong>W</strong> to increase / <strong>S</strong> to decrease Hue Rotation ({effects.hueRotate}°)</p>
					<p>Press <strong>E</strong> to toggle Colorize ({effects.colorize ? 'ON' : 'OFF'})</p>
					<p>Press <strong>R</strong> to increase / <strong>F</strong> to decrease Infinite Zoom ({effects.infiniteZoom.toFixed(1)})</p>
					<p>Press <strong>T</strong> to toggle Strobe ({effects.strobe ? 'ON' : 'OFF'})</p>
					<p>Press <strong>Y</strong> to toggle Dot Screen ({effects.dotScreen ? 'ON' : 'OFF'})</p>
					<p>Press <strong>U</strong> to increase / <strong>J</strong> to decrease WarpSpeed ({effects.warpSpeed})</p>
					<p>Press <strong>I</strong> to toggle Stingy Sphere ({effects.stingySphere ? 'ON' : 'OFF'})</p>
					<p>Press <strong>O</strong> to toggle Mirror ({effects.mirror ? 'ON' : 'OFF'})</p>
					<p>Press <strong>P</strong> to increase / <strong>L</strong> to decrease Lo-Rez ({effects.loRez})</p>
					<p>Press <strong>Z</strong> to rotate X / <strong>X</strong> to rotate Y / <strong>C</strong> to rotate Z</p>
					<p>Press <strong>Space</strong> to reset all effects</p>
				</div>
			</div>
		</div>
	);
};

export default VJController; 