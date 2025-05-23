import { Canvas } from "@react-three/fiber";
import { useGLTF, Stage, PresentationControls } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three"

function Model(props) {
  const { scene } = useGLTF("/bitchboy3d(v5 - test).glb");
  const originalMaterials = useRef(new Map());
  const [activeSlider, setActiveSlider] = useState(null);
  const pointer = useRef(new THREE.Vector2());
  const raycaster = useRef(new THREE.Raycaster());


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
        setActiveSlider((prev) => (prev == mesh ? null : mesh));
        return;
    }

    if(!mesh.name.includes("Button")) return;

    if (!mesh.userData.clickable) return;

    if (mesh.userData.isToggled) {
      // Revert to original material
      mesh.material = originalMaterials.current.get(mesh.uuid);
      mesh.userData.isToggled = false;
      mesh.position.z += 0.1;
    } else {
      // Assign a new material
      mesh.material = new THREE.MeshStandardMaterial({ color: "#ada0a3" });
      mesh.position.z -= 0.1;
      mesh.userData.isToggled = true;
    }
  }

  function handlePointerMove(e) {
    if (!activeSlider) return;

    pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.current.y = -(e.clientY / window.innerHeight) * 2 + 1;

    raycaster.current.setFromCamera(pointer.current, e.camera);

    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -activeSlider.position.y);

    const intersection = new THREE.Vector3();
    raycaster.current.ray.intersectPlane(plane, intersection);

    // activeSlider.position.z = intersection.z;
    if (intersection) {
      // Clamp Z range, optional — adjust based on your slider's path
      const clampedZ = Math.max(-1, Math.min(1, intersection.z));
      activeSlider.position.z = clampedZ;
    }
  }

  return (
    <primitive
      object={scene}
      {...props}
      onClick={handleClick}
      onPointerMove={handlePointerMove}
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