import { Canvas } from "@react-three/fiber";
import { useGLTF, Stage, PresentationControls } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three"

// function Model(props) {
//   const { scene } = useGLTF("/bitchboy3d(v5 - test).glb");
//   const originalMaterials = useRef(new Map());
//   const [activeSlider, setActiveSlider] = useState(null);
//   const pointer = useRef(new THREE.Vector2());
//   const raycaster = useRef(new THREE.Raycaster());


//   useEffect(() => {
//     scene.traverse((child) => {
//       if (child.isMesh) {
//         // Clone and store original material
//         originalMaterials.current.set(child.uuid, child.material.clone());
//         child.userData.isToggled = false;
//         child.userData.clickable = true;
//       }
//     });
//   }, [scene]);

//   function handleClick(e) {
//     e.stopPropagation();

//     const mesh = e.object;
//     console.log("Clicked on:", mesh.name, mesh);

//     // Very early slider movement
//     if(mesh.name.includes("Slider")){
//         setActiveSlider((prev) => (prev == mesh ? null : mesh));
//         return;
//     }

//     if(!mesh.name.includes("Button")) return;

//     if (!mesh.userData.clickable) return;

//     if (mesh.userData.isToggled) {
//       // Revert to original material
//       mesh.material = originalMaterials.current.get(mesh.uuid);
//       mesh.userData.isToggled = false;
//       mesh.position.z += 0.1;
//     } else {
//       // Assign a new material
//       mesh.material = new THREE.MeshStandardMaterial({ color: "#ada0a3" });
//       mesh.position.z -= 0.1;
//       mesh.userData.isToggled = true;
//     }
//   }

//   function handlePointerMove(e) {
//     if (!activeSlider) return;

//     pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
//     pointer.current.y = -(e.clientY / window.innerHeight) * 2 + 1;

//     raycaster.current.setFromCamera(pointer.current, e.camera);

//     const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -activeSlider.position.y);

//     const intersection = new THREE.Vector3();
//     raycaster.current.ray.intersectPlane(plane, intersection);

//     // activeSlider.position.z = intersection.z;
//     if (intersection) {
//       // Clamp Z range, optional — adjust based on your slider's path
//       const clampedZ = Math.max(-1, Math.min(1, intersection.z));
//       activeSlider.position.z = clampedZ;
//     }
//   }

//   return (
//     <primitive
//       object={scene}
//       {...props}
//       onClick={handleClick}
//       onPointerMove={handlePointerMove}
//     />
//   );
// }

function Model(props) {
  const { scene } = useGLTF("/bitchboy3d(v7).glb");
  const originalMaterials = useRef(new Map());
  const [activeSlider, setActiveSlider] = useState(null);
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
    if (e.object.name.includes("Slider_knob")) {
      setActiveSlider(e.object);
      setIsDragging(true);

      // Save offset between slider and mouse world X
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
      raycaster.current.setFromCamera(pointer.current, e.camera);

      const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -e.object.position.y);
      const intersection = new THREE.Vector3();
      raycaster.current.ray.intersectPlane(plane, intersection);

      if (intersection) {
        dragOffset.current = intersection.z - e.object.position.z;
      }
    }
  }

  function handlePointerUp() {
    setIsDragging(false);
    setActiveSlider(null);
  }

  function handleClick(e) {
    e.stopPropagation();
    const mesh = e.object;
    console.log("Clicked on:", mesh.name, mesh);
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

 function handlePointerMove(e) {
  if (!isDragging || !activeSlider) return;

  pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
  pointer.current.y = -(e.clientY / window.innerHeight) * 2 + 1;

  raycaster.current.setFromCamera(pointer.current, e.camera);

  // Assume movement along X axis (adjust if your sliders move along Z)
  const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -activeSlider.position.y);
  const intersection = new THREE.Vector3();
  raycaster.current.ray.intersectPlane(plane, intersection);

  if (intersection) {
    const track = sliderTrackMap.current.get(activeSlider.name);
    if (!track) {
      console.log("Could not get track");
      return;
    }
    // Get bounding box of the track
    const box = new THREE.Box3().setFromObject(track);
    const min = box.min.z;
    const max = box.max.z;
    console.log("Slider bounds:", box.min.z, box.max.z);

    // Clamp the new position of the slider
    let newZ = intersection.z;
    newZ = Math.max(min, Math.min(max, newZ));

    activeSlider.position.z = newZ;
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