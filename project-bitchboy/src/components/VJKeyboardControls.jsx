import { useVJ } from '../contexts/VJContext';
import './VJKeyboardControls.css';

const VJKeyboardControls = () => {
	const { state } = useVJ();
  	const { effects, gameMode } = state;

	// Don't show keyboard controls UI when in game mode (game has its own UI)
	// But keep the keyboard listeners active!
	if (gameMode.isActive) {
		return <div style={{ display: 'none' }} />; // Hidden but still mounted
	}

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