import { Canvas } from "@react-three/fiber";
import { useGLTF, Stage, PresentationControls } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three"

function Model(props) {
  const { scene } = useGLTF("/bitchboy3d(v8).glb");
  const originalMaterials = useRef(new Map());
  const [activeObject, setActiveObject] = useState(null);
  const [dragMode, setDragMode] = useState(null);
  const dragStartX = useRef(0);
  const [isDragging, setIsDragging] = useState(false);
  const pointer = useRef(new THREE.Vector2());
  const raycaster = useRef(new THREE.Raycaster());
  const dragOffset = useRef(0); // New
  const sliderTrackMap = useRef(new Map());


  useEffect(() => {
  const trackMap = new Map();

  scene.traverse((child) => {
    if (child.isMesh) {
      // Store original material for reset
      originalMaterials.current.set(child.uuid, child.material.clone());
      child.userData.isToggled = false;
      child.userData.clickable = true;

      // If it's a knob, find its matching track
      if (child.name.startsWith("Slider_knob_")) {
        const index = child.name.split("_").pop(); // gets the number
        const trackName = `Slider_top_track_${index}`;
        const track = scene.getObjectByName(trackName);
        // console.log(track);

        if (track) {
          trackMap.set(child.name, track);
        }
      }
    }
  });

  sliderTrackMap.current = trackMap;
}, [scene]);

  function handlePointerDown(e) {
  const obj = e.object;

  if (obj.name.includes("Slider_knob")) {
    setActiveObject(obj);
    setDragMode("slider");
    setIsDragging(true);

    pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    raycaster.current.setFromCamera(pointer.current, e.camera);

    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -obj.position.y);
    const intersection = new THREE.Vector3();
    raycaster.current.ray.intersectPlane(plane, intersection);

    if (intersection) {
      dragOffset.current = intersection.z - obj.position.z;
    }

  } else if (obj.name.includes("knob")) {
    setActiveObject(obj);
    setDragMode("knob");
    setIsDragging(true);
    dragStartX.current = e.clientX;
  }
}


  function handlePointerUp() {
  setIsDragging(false);
  setActiveObject(null);
  setDragMode(null);
}


  function handleClick(e) {
    e.stopPropagation();
    const mesh = e.object;
    console.log("Clicked on:", mesh.name, mesh);
    // if (!mesh.name.includes("Button")) return;
    if (!mesh.userData.clickable) return;

    // temporary knob rotation
    // if (mesh.name.includes("knob")) {
    //   mesh.rotation.y += 0.5;
    // }

    if (mesh.name.includes("Button")) {
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
  }

 function handlePointerMove(e) {
  if (!isDragging || !activeObject) return;

  if (dragMode === "slider") {
    pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.current.y = -(e.clientY / window.innerHeight) * 2 + 1;

    raycaster.current.setFromCamera(pointer.current, e.camera);

    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -activeObject.position.y);
    const intersection = new THREE.Vector3();
    raycaster.current.ray.intersectPlane(plane, intersection);

    if (intersection) {
      const track = sliderTrackMap.current.get(activeObject.name);
      if (!track) return;

      const box = new THREE.Box3().setFromObject(track);
      let newZ = intersection.z;
      newZ = Math.max(box.min.z, Math.min(box.max.z, newZ));

      activeObject.position.z = newZ;
    }
  }

  else if (dragMode === "knob") {
    const deltaX = e.clientX - dragStartX.current;
    dragStartX.current = e.clientX;

    // Adjust this factor to control sensitivity
    const rotationFactor = 0.01;
    activeObject.rotation.y += deltaX * rotationFactor;
  }
}



  return (
    <primitive
      object={scene}
      {...props}
      onClick={handleClick}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerMove={handlePointerMove}
    />
  );
}



function App() {
  return (
    <Canvas dpr={[1,2]} shadows camera={{ fov: 45 }} style={{"position": "absolute"}}>
      <color attach="background" args={["#050505"]} />
      {/* <PresentationControls speed={1.5} polar={[-0.1, Math.PI / 4]}> */}
        <Stage environment="sunset" intensity={0.0005}>
          <Model scale={0.01} />
        </Stage>
      {/* </PresentationControls> */}
    </Canvas>
  );
}



export default App;