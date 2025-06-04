

import VJController from './components/VJController';
import './App.css';
import { Canvas } from '@react-three/fiber';
import { Stage, PresentationControls } from '@react-three/drei';
import Model from './components/3DModel';

function App() {
  return (
    <div className="AppContainer">
      {/* Background UI Effects - Full Screen */}
      <div className="UIBackground">
        <VJController />
      </div>
      
      {/* Overlaid 3D Model - Positioned in lower portion */}
      <div className="ModelOverlay">
        <Canvas
          dpr={[1, 2]}
          shadows
          camera={{ position: [0, 0, 5], fov: 45 }}
          style={{ width: '100%', height: '100%', background: 'transparent' }}
          gl={{ alpha: true, premultipliedAlpha: false }}
        >
          <PresentationControls
            enabled={false}
            global={false}
          >
            <Stage environment="sunset" intensity={0.0005}>
              <Model scale={0.01} />
            </Stage>
          </PresentationControls>
        </Canvas>
      </div>
    </div>
  );
}

export default App;
