import VJController from './components/VJController';
import './App.css';

function App() {
  return (
    <Canvas dpr={[1,2]} shadows camera={{ fov: 45 }} style={{"position": "absolute"}}>
      <color attach="background" args={["#101010"]} />
      <PresentationControls speed={1.5} polar={[-0.1, Math.PI / 4]}>
        <Stage environment="sunset" intensity={0.0005}>
          <Model scale={0.01} />
        </Stage>
      </PresentationControls>
    </Canvas>
  );
}

export default App;