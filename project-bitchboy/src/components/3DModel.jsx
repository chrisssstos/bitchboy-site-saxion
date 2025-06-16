// Updated Model component
import { Canvas } from "@react-three/fiber";
import { useGLTF, Stage } from "@react-three/drei";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useSliderInteraction } from "../components/userSliderInteraction"; // ✅ UNCOMMENTED
import { useKnobInteraction } from "../components/userKnobInteraction";
import { useButtonInteraction } from "../components/userButtonInteraction";

function Model(props) {
  // blender model
  const { scene } = useGLTF("/bitchboy3d(v11).glb");
  const originalMaterials = useRef(new Map());

  // ✅ ADD SLIDER HOOK BACK
  const {
    handleSliderPointerDown,
    handleSliderPointerMove,
    handleSliderPointerUp,
    isDragging: isDraggingSlider,
    activeSlider: _activeSlider,
  } = useSliderInteraction(scene);

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

        // Buttons 1-28 become orange
        const match = child.name.match(/^Button_(\d+)$/);
        if (match) {
          const index = parseInt(match[1], 10);

          const skipButtons =
            (index >= 6 && index <= 8) ||
            (index >= 14 && index <= 16) ||
            (index >= 22 && index <= 24) ||
            (index >= 30 && index <= 32);

          if (index >= 1 && index <= 29 && !skipButtons) {
            child.material = new THREE.MeshStandardMaterial({ color: "#FFA500" });
          }

          if (skipButtons) {
            child.material = new THREE.MeshStandardMaterial({ color: "#636363" })
          }

        }

        // gray out bottom buttons
        const bottomMatch = child.name.match(/^Button_bottom_(\d+)$/);
        if (bottomMatch) {
          const index = parseInt(bottomMatch[1], 10);
          if (index >= 1 && index <= 8){
            child.material = new THREE.MeshStandardMaterial({ color: "#636363" })
          }
        }

          // gray out middle buttons
          const middleMatch = child.name.match(/^Button_middle_(\d+)$/);
          if (middleMatch) {
            const index = parseInt(middleMatch[1], 10);
            if (index >= 1 && index <= 9){
              child.material = new THREE.MeshStandardMaterial({ color: "#636363" })
            }
          }

      }
    });
  }, [scene]);

  // Combined pointer handlers that delegate to appropriate handlers
  function handlePointerDown(e) {
    console.log("Clicked:", e.object.name);

    // ✅ TRY SLIDER FIRST
    if (handleSliderPointerDown(e)) return;
    if (handleKnobPointerDown(e)) return;
    if (handleButtonPointerDown(e)) return;
  }

  // ✅ SINGLE POINTER MOVE FUNCTION
  function handlePointerMove(e) {
    if (handleSliderPointerMove(e)) return;
    if (handleKnobPointerMove(e)) return;
  }

  // ✅ SINGLE POINTER UP FUNCTION
  function handlePointerUp(e) {
    if (handleSliderPointerUp(e)) return;
    if (handleKnobPointerUp(e)) return;
    if (handleButtonPointerUp(e)) return;
  }

  // Add pointer capture for better drag handling
  function handlePointerMissed(e) {
    // This fires when clicking on empty space
    if (isDraggingKnob) {
      handleKnobPointerUp(e);
    }
    if (isDraggingSlider) {
      handleSliderPointerUp(e);
    }
  }

  // ✅ FIXED CLICK HANDLER
  function handleClick(e) {
    e.stopPropagation();
    const mesh = e.object;

    // ✅ USE CORRECT DRAGGING VARIABLES
    if (isDraggingSlider || isDraggingKnob) return;

    // Button logic (this can also be separated if needed)
    if (!mesh.name.includes("Button")) return;
    if (!mesh.userData.clickable) return;
  }

  return (
    <primitive
      object={scene}
      {...props}
      onClick={handleClick} // ✅ RESTORED CLICK HANDLER
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerMissed={handlePointerMissed}
    />
  );
}

// function App() {
//   return (
//     <Canvas dpr={[1, 2]} shadows camera={{ fov: 45 }} style={{ position: "absolute" }}>
//       <color attach="background" args={["#050505"]} />
//       <Stage environment="sunset" intensity={0.0005}>
//         <Model scale={0.01} />
//       </Stage>
//     </Canvas>
//   );
// }

// export default App;

export default Model;

