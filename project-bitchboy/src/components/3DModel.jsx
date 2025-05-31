// Updated Model component
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

  // Combined pointer handlers that delegate to appropriate handlers
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
    
    // Add other interaction handlers here (knobs, pads, etc.)
    // Your colleagues can add their handlers here without conflicts
    
    // Example placeholder for other interactions:
    // if (handleKnobPointerDown(e)) return;
    // if (handlePadPointerDown(e)) return;
  }

  function handlePointerMove(e) {
    // Try slider handler first
    if (handleSliderPointerMove(e)) {
      return; // Slider handled it, we're done
    }
    
    // Add other interaction handlers here
    // if (handleKnobPointerMove(e)) return;
    // if (handlePadPointerMove(e)) return;
  }

  function handlePointerUp(e) {
    // Try slider handler first
    if (handleSliderPointerUp(e)) {
      return; // Slider handled it, we're done
    }
    
    // Add other interaction handlers here
    // if (handleKnobPointerUp(e)) return;
    // if (handlePadPointerUp(e)) return;
  }

  function handleClick(e) {
    e.stopPropagation();
    const mesh = e.object;
    
    // Skip if we're dragging (to avoid click after drag)
    if (isDragging) return;
    
    // Button logic (this can also be separated if needed)
    if (!mesh.name.includes("Button")) return;
    if (!mesh.userData.clickable) return;

    if (mesh.userData.isToggled) {
      mesh.material = originalMaterials.current.get(mesh.uuid);
      mesh.userData.isToggled = false;
      mesh.position.z += 0.1;
    } else {
      mesh.material = new THREE.MeshStandardMaterial({ color: "#ada0a3" });
      mesh.position.z -= 0.1;
      mesh.userData.isToggled = true;
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
