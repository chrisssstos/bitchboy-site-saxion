import VJController from './components/VJController';
import './App.css';
import { Canvas } from '@react-three/fiber';
import { Stage, PresentationControls } from '@react-three/drei';
import Model from './components/3DModel';

function App() {
  return (
    <>
    <div className="AppContainer">
      <div className="UISection">
        <VJController />
      </div>
      <div className="ModelSection">
        <Model />
      </div>
    </div>
    </>
  );
}

export default App;
