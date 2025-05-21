document.addEventListener('DOMContentLoaded', () => {
	// Get the video elements
	const video1 = document.getElementById('video1');
	const video2 = document.getElementById('video2');
	const video3 = document.getElementById('video3');
	const video4 = document.getElementById('video4');
	const video5 = document.getElementById('video5');

	// Initialize videos
	video1.play();
	video2.play();
	video3.play();
	video4.play();
	video5.play();

	// Currently active video (1 = video1, 2 = video2, etc.)
	let activeVideo = 1;

	// Get current active video element
	const getCurrentVideo = () => {
		switch (activeVideo) {
			case 1: return video1;
			case 2: return video2;
			case 3: return video3;
			case 4: return video4;
			case 5: return video5;
			default: return video1;
		}
	};

	// Effect states
	const effects = {
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
	};

	// Function to switch between videos
	function switchVideo(videoNumber) {
		if (videoNumber === activeVideo) return;

		const currentVideo = getCurrentVideo();
		let newVideo;

		switch (videoNumber) {
			case 1: newVideo = video1; break;
			case 2: newVideo = video2; break;
			case 3: newVideo = video3; break;
			case 4: newVideo = video4; break;
			case 5: newVideo = video5; break;
			default: return;
		}

		// Hide current video
		anime({
			targets: currentVideo,
			opacity: 0,
			duration: 0,
			easing: 'easeOutQuad',
			complete: function () {
				// Hide all videos
				[video1, video2, video3, video4, video5].forEach(v => v.classList.add('hidden'));
				// Show new video
				newVideo.classList.remove('hidden');
				// Set new video to be fully visible immediately
				newVideo.style.opacity = 1;
			}
		});

		activeVideo = videoNumber;
		applyAllEffects();
	}

	// Apply all effects to current video
	function applyAllEffects() {
		const video = getCurrentVideo();

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
	}

	// Handle strobe effect separately
	function toggleStrobe() {
		if (effects.strobe) {
			// Start strobe effect
			let isVisible = true;
			effects.strobeInterval = setInterval(() => {
				const video = getCurrentVideo();
				isVisible = !isVisible;
				video.style.opacity = isVisible ? 1 : 0;
			}, 100);
		} else {
			// Stop strobe effect
			clearInterval(effects.strobeInterval);
			getCurrentVideo().style.opacity = 1;
		}
	}

	// Reset all effects
	function resetEffects() {
		// Stop any intervals
		if (effects.strobeInterval) {
			clearInterval(effects.strobeInterval);
		}

		// Reset effect states
		effects.crossFader = 0;
		effects.blendMode = 'normal';
		effects.invert = false;
		effects.hueRotate = 0;
		effects.colorize = false;
		effects.infiniteZoom = 0;
		effects.strobe = false;
		effects.strobeInterval = null;
		effects.dotScreen = false;
		effects.warpSpeed = 0;
		effects.stingySphere = false;
		effects.mirror = false;
		effects.loRez = 0;
		effects.transform = {
			scale: 1,
			rotateX: 0,
			rotateY: 0,
			rotateZ: 0,
			translateX: 0,
			translateY: 0
		};

		// Apply reset effects
		applyAllEffects();
	}

	// Update control panel
	function updateControlInfo() {
		const controlsDiv = document.querySelector('.controls');
		controlsDiv.innerHTML = `
			<p>Press <strong>1-5</strong> to switch between animations</p>
			<p>Press <strong>Q</strong> to toggle Invert RGB (${effects.invert ? 'ON' : 'OFF'})</p>
			<p>Press <strong>W</strong> to increase / <strong>S</strong> to decrease Hue Rotation (${effects.hueRotate}°)</p>
			<p>Press <strong>E</strong> to toggle Colorize (${effects.colorize ? 'ON' : 'OFF'})</p>
			<p>Press <strong>R</strong> to increase / <strong>F</strong> to decrease Infinite Zoom (${effects.infiniteZoom.toFixed(1)})</p>
			<p>Press <strong>T</strong> to toggle Strobe (${effects.strobe ? 'ON' : 'OFF'})</p>
			<p>Press <strong>Y</strong> to toggle Dot Screen (${effects.dotScreen ? 'ON' : 'OFF'})</p>
			<p>Press <strong>U</strong> to increase / <strong>J</strong> to decrease WarpSpeed (${effects.warpSpeed})</p>
			<p>Press <strong>I</strong> to toggle Stingy Sphere (${effects.stingySphere ? 'ON' : 'OFF'})</p>
			<p>Press <strong>O</strong> to toggle Mirror (${effects.mirror ? 'ON' : 'OFF'})</p>
			<p>Press <strong>P</strong> to increase / <strong>L</strong> to decrease Lo-Rez (${effects.loRez})</p>
			<p>Press <strong>Z</strong> to rotate X / <strong>X</strong> to rotate Y / <strong>C</strong> to rotate Z</p>
			<p>Press <strong>Space</strong> to reset all effects</p>
		`;
	}

	// Initialize control info
	updateControlInfo();

	// Keyboard event listener
	document.addEventListener('keydown', (event) => {
		const key = event.key.toLowerCase();
		let needsUpdate = true;

		// Switch videos with number keys
		if (key === '1') {
			switchVideo(1);
		} else if (key === '2') {
			switchVideo(2);
		} else if (key === '3') {
			switchVideo(3);
		} else if (key === '4') {
			switchVideo(4);
		} else if (key === '5') {
			switchVideo(5);
		}
		// Invert RGB - Q
		else if (key === 'q') {
			effects.invert = !effects.invert;
		}
		// Hue Rotate - W (increase) / S (decrease)
		else if (key === 'w') {
			effects.hueRotate = (effects.hueRotate + 30) % 360;
		}
		else if (key === 's') {
			effects.hueRotate = (effects.hueRotate - 30 + 360) % 360;
		}
		// Colorize - E
		else if (key === 'e') {
			effects.colorize = !effects.colorize;
		}
		// Infinite Zoom - R (increase) / F (decrease)
		else if (key === 'r') {
			effects.infiniteZoom = Math.min(effects.infiniteZoom + 0.1, 1);
		}
		else if (key === 'f') {
			effects.infiniteZoom = Math.max(effects.infiniteZoom - 0.1, 0);
		}
		// Strobe - T
		else if (key === 't') {
			effects.strobe = !effects.strobe;
			toggleStrobe();
		}
		// Dot Screen - Y
		else if (key === 'y') {
			effects.dotScreen = !effects.dotScreen;
		}
		// WarpSpeed - U (increase) / J (decrease)
		else if (key === 'u') {
			effects.warpSpeed = Math.min(effects.warpSpeed + 50, 200);
		}
		else if (key === 'j') {
			effects.warpSpeed = Math.max(effects.warpSpeed - 50, 0);
		}
		// Stingy Sphere - I
		else if (key === 'i') {
			effects.stingySphere = !effects.stingySphere;
		}
		// Mirror - O
		else if (key === 'o') {
			effects.mirror = !effects.mirror;
		}
		// Lo-Rez - P (increase) / L (decrease)
		else if (key === 'p') {
			effects.loRez = Math.min(effects.loRez + 1, 10);
		}
		else if (key === 'l') {
			effects.loRez = Math.max(effects.loRez - 1, 0);
		}
		// Transform rotations
		else if (key === 'z') {
			effects.transform.rotateX = (effects.transform.rotateX + 45) % 360;
		}
		else if (key === 'x') {
			effects.transform.rotateY = (effects.transform.rotateY + 45) % 360;
		}
		else if (key === 'c') {
			effects.transform.rotateZ = (effects.transform.rotateZ + 45) % 360;
		}
		// Reset all effects - Space
		else if (key === ' ') {
			resetEffects();
		}
		else {
			needsUpdate = false;
		}

		// Apply effects if needed
		if (needsUpdate) {
			applyAllEffects();
			updateControlInfo();
		}
	});
}); 