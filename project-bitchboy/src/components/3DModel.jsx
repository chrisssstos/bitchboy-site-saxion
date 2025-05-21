import { Canvas } from "@react-three/fiber";
import { useGLTF, Stage, PresentationControls } from "@react-three/drei";
import { useEffect, useRef } from "react";
import * as THREE from "three"

function Model(props) {
  const { scene } = useGLTF("/bitchboy3d(v5 - test).glb");
  const originalMaterials = useRef(new Map());

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        // Clone and store original material
        originalMaterials.current.set(child.uuid, child.material.clone());
        child.userData.isToggled = false;
        child.userData.clickable = true;
      }
    });
  }, [scene]);

  function handleClick(e) {
    e.stopPropagation();

    const mesh = e.object;
    console.log("Clicked on:", mesh.name, mesh);

    // Very early slider movement
    if(mesh.name.includes("Slider")){
        mesh.position.z += 0.05;
    }

    if(!mesh.name.includes("Button")) return;

    if (!mesh.userData.clickable) return;

    if (mesh.userData.isToggled) {
      // Revert to original material
      mesh.material = originalMaterials.current.get(mesh.uuid);
      mesh.userData.isToggled = false;
    } else {
      // Assign a new red material
      mesh.material = new THREE.MeshStandardMaterial({ color: "black" });
      mesh.userData.isToggled = true;
    }
  }

  return (
    <primitive
      object={scene}
      {...props}
      onClick={handleClick}
    />
  );
}


function App() {
  return (
    <Canvas dpr={[1,2]} shadows camera={{ fov: 45 }} style={{"position": "absolute"}}>
      <color attach="background" args={["#101010"]} />
      {/* <PresentationControls speed={1.5} polar={[-0.1, Math.PI / 4]}> */}
        <Stage environment="sunset" intensity={0.0005}>
          <Model scale={0.01} />
        </Stage>
      {/* </PresentationControls> */}
    </Canvas>
  );
}



export default App;