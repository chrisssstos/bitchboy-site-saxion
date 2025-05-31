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

  if (obj.name.includes("Button")) {
  obj.position.z -= 0.1; // Button goes down
  obj.userData.wasPressed = true; // Remember it was pressed

  // Store original material if not already stored
  if (!originalMaterials.current.has(obj.uuid)) {
    originalMaterials.current.set(obj.uuid, obj.material.clone());
  }

  // Apply highlight color
  obj.material = new THREE.MeshStandardMaterial({ color: "#ada0a3" });
}


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
    setActiveObject(obj.parent);
    setDragMode("knob");
    setIsDragging(true);
    dragStartX.current = e.clientX;
  }
}


  function handlePointerUp() {
    scene.traverse((child) => {
      if (child.name.includes("Button") && child.userData.wasPressed) {
        child.position.z += 0.1; // Button goes back up
        child.userData.wasPressed = false;

        const originalMat = originalMaterials.current.get(child.uuid);
        if (originalMat) {
          child.material = originalMat;
        }
      }
    });

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

    // if (mesh.name.includes("Button")) {
    //   if (mesh.userData.isToggled) {
    //     mesh.material = originalMaterials.current.get(mesh.uuid);
    //     mesh.userData.isToggled = false;
    //     mesh.position.z += 0.1;
    //   } else {
    //     mesh.material = new THREE.MeshStandardMaterial({ color: "#ada0a3" });
    //     mesh.position.z -= 0.1;
    //     mesh.userData.isToggled = true;
    //   }
    // }
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

    // adjust for sensitivity
    const rotationFactor = 0.02;
    let newRotation = activeObject.rotation.y + deltaX * rotationFactor;

    // goat math
    newRotation = newRotation % (Math.PI * 2);
    if (newRotation < 0) newRotation += Math.PI * 2;

    // the blender knobs are upside down lmao
    // prob ask anh for a v9 then i can just remove this line of code
    const rotated = (newRotation + Math.PI) % (Math.PI * 2);

    const MIN = THREE.MathUtils.degToRad(25);
    const MAX = THREE.MathUtils.degToRad(335);

    // dead zone limiter
    if (rotated >= MIN && rotated <= MAX) {
      activeObject.rotation.y = newRotation;
    }

    // value tracking
    const deg = THREE.MathUtils.radToDeg(activeObject.rotation.y) % 360;
      const normalizedDeg = deg < 0 ? deg + 360 : deg;

    const minDeg = 25;
    const maxDeg = 335;

    let value = 0;
    if (normalizedDeg >= minDeg && normalizedDeg <= maxDeg) {
      value = ((normalizedDeg - minDeg) / (maxDeg - minDeg)) * 100;
      value = Math.round(value);
      console.log("Knob value:", value);
    } else {
      // shouldnt be possible
      console.log("Knob in dead zone");
    }
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