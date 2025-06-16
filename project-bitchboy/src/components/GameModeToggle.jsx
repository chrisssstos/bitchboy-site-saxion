import React from 'react';
import { useVJ } from '../contexts/VJContext';
import './GameModeToggle.css';

const GameModeToggle = () => {
	const { state, actions } = useVJ();
	const { gameMode } = state;

	const handleToggle = () => {
		actions.toggleGameMode();

		// Reset effects when switching modes
		if (!gameMode.isActive) {
			actions.resetEffects();
		}
	};

	return (
		<button
			className={`game-mode-toggle ${gameMode.isActive ? 'active' : ''}`}
			onClick={handleToggle}
			title={gameMode.isActive ? 'Exit Game Mode' : 'Enter Game Mode'}
		>
			<div className="toggle-icon">
				{gameMode.isActive ? (
					// Exit game icon
					<>
						<div className="icon-line line1"></div>
						<div className="icon-line line2"></div>
					</>
				) : (
					// Game controller icon
					<>
						<div className="controller-body"></div>
						<div className="controller-button btn1"></div>
						<div className="controller-button btn2"></div>
						<div className="controller-dpad"></div>
					</>
				)}
			</div>
			<div className="toggle-text">
				{gameMode.isActive ? 'EXIT GAME' : 'GAME MODE'}
			</div>
			{!gameMode.isActive && (
				<div className="toggle-subtitle">
					SUPER VJ PRO
				</div>
			)}
		</button>
	);
};

export default GameModeToggle; 