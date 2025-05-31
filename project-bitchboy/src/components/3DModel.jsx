import { Canvas } from "@react-three/fiber";
import { useGLTF, Stage } from "@react-three/drei";
import { useEffect, useRef } from "react";
import * as THREE from "three";

// import { useSliderInteraction } from "../components/useSliderInteraction";
import { useKnobInteraction } from "../components/userKnobInteraction";
import { useButtonInteraction } from "../components/userButtonInteraction";

function Model(props) {
  const { scene } = useGLTF("/bitchboy3d(v8).glb");
  const originalMaterials = useRef(new Map());

  const {
    handleKnobPointerDown,
    handleKnobPointerMove,
    handleKnobPointerUp,
    isDragging: isDraggingKnob
  } = useKnobInteraction(scene);

  const {
    handleButtonPointerDown,
    handleButtonPointerUp
  } = useButtonInteraction(scene, originalMaterials);

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        originalMaterials.current.set(child.uuid, child.material.clone());
        child.userData.isToggled = false;
        child.userData.clickable = true;
      }
    });
  }, [scene]);

  function handlePointerDown(e) {
    console.log("Clicked:", e.object.name);
    if (handleKnobPointerDown(e)) return;
    if (handleButtonPointerDown(e)) return;
  }

  function handlePointerMove(e) {
    if (handleKnobPointerMove(e)) return;
  }

  function handlePointerUp(e) {
    if (handleKnobPointerUp(e)) return;
    if (handleButtonPointerUp(e)) return;
  }

  // Add pointer capture for better drag handling
  function handlePointerMissed(e) {
    // This fires when clicking on empty space
    if (isDraggingKnob) {
      handleKnobPointerUp(e);
    }
  }

  return (
    <primitive
      object={scene}
      {...props}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerMissed={handlePointerMissed}
    />
  );
}

function App() {
  return (
    <Canvas dpr={[1, 2]} shadows camera={{ fov: 45 }} style={{ position: "absolute" }}>
      <color attach="background" args={["#050505"]} />
      <Stage environment="sunset" intensity={0.0005}>
        <Model scale={0.01} />
      </Stage>
    </Canvas>
  );
}

export default App;
