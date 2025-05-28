import { Canvas } from "@react-three/fiber";
import { useGLTF, Stage } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

function Model(props) {
  const { scene } = useGLTF("/bitchboy3d(v8).glb");
  const originalMaterials = useRef(new Map());
  const [activeSlider, setActiveSlider] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const raycaster = useRef(new THREE.Raycaster());
  const camera = useRef(null);
  const initialOffset = useRef(0);
  const sliderTrackMap = useRef(new Map());

  useEffect(() => {
    const trackMap = new Map();

    scene.traverse((child) => {
      if (child.isMesh) {
        originalMaterials.current.set(child.uuid, child.material.clone());
        child.userData.isToggled = false;
        child.userData.clickable = true;

        // Top sliders mapping
        if (child.name.startsWith("Slider_knob_top_")) {
          const index = child.name.split("_").pop();
          const trackName = `Slider_top_track_${index}`;
          const track = scene.getObjectByName(trackName);
          if (track) trackMap.set(child.name, track);
        }

        // Bottom sliders mapping
        if (child.name.startsWith("Slider_knob_bottom_")) {
          const index = child.name.split("_").pop();
          const trackName = `Slider_bottom_track_${index}`;
          const track = scene.getObjectByName(trackName);
          if (track) trackMap.set(child.name, track);
        }
      }
    });

    sliderTrackMap.current = trackMap;
  }, [scene]);

  function getWorldIntersection(clientX, clientY, track, planeNormal) {
    if (!camera.current) return null;

    const pointer = new THREE.Vector2(
      (clientX / window.innerWidth) * 2 - 1,
      -(clientY / window.innerHeight) * 2 + 1
    );

    raycaster.current.setFromCamera(pointer, camera.current);

    const trackWorldPos = new THREE.Vector3();
    track.getWorldPosition(trackWorldPos);

    const plane = new THREE.Plane(planeNormal, -trackWorldPos.dot(planeNormal));
    const intersection = new THREE.Vector3();

    if (raycaster.current.ray.intersectPlane(plane, intersection)) {
      return intersection;
    }

    return null;
  }

  function handlePointerDown(e) {
    if (e.object.name.includes("Slider_knob")) {
      setActiveSlider(e.object);
      setIsDragging(true);
      camera.current = e.camera;

      const track = sliderTrackMap.current.get(e.object.name);
      if (track) {
        console.log("🎯 Start dragging:", e.object.name);

        // Determine plane normal based on slider group
        const isBottom = e.object.name.includes("bottom");
        const planeNormal = isBottom ? new THREE.Vector3(1, 0, 0) : new THREE.Vector3(0, 1, 0);

        const intersection = getWorldIntersection(e.clientX, e.clientY, track, planeNormal);
        if (intersection) {
          const sliderWorldPos = new THREE.Vector3();
          e.object.getWorldPosition(sliderWorldPos);
          initialOffset.current = isBottom ? intersection.y - sliderWorldPos.y : intersection.z - sliderWorldPos.z;
        } else {
          initialOffset.current = 0;
        }
      }

      e.stopPropagation();
    }
  }

  function handlePointerMove(e) {
    if (!isDragging || !activeSlider || !camera.current) return;

    const track = sliderTrackMap.current.get(activeSlider.name);
    if (!track) return;

    const isBottom = activeSlider.name.includes("bottom");
    const planeNormal = isBottom ? new THREE.Vector3(1, 0, 0) : new THREE.Vector3(0, 1, 0);

    // Get pointer ray
    const pointer = new THREE.Vector2(
      (e.clientX / window.innerWidth) * 2 - 1,
      -(e.clientY / window.innerHeight) * 2 + 1
    );
    raycaster.current.setFromCamera(pointer, camera.current);

    const trackWorldPos = new THREE.Vector3();
    track.getWorldPosition(trackWorldPos);
    const trackWorldQuat = new THREE.Quaternion();
    track.getWorldQuaternion(trackWorldQuat);
    const localNormal = planeNormal.clone().applyQuaternion(trackWorldQuat);
    const plane = new THREE.Plane(localNormal, -trackWorldPos.dot(localNormal));

    const intersection = new THREE.Vector3();
    if (!raycaster.current.ray.intersectPlane(plane, intersection)) return;

    const localIntersection = track.worldToLocal(intersection.clone());
    const geometry = track.geometry || (track.children[0] && track.children[0].geometry);
    if (!geometry) return;
    if (!geometry.boundingBox) geometry.computeBoundingBox();
    const box = geometry.boundingBox;

    const clampedCoord = isBottom
      ? Math.max(box.min.y, Math.min(box.max.y, localIntersection.y))
      : Math.max(box.min.x, Math.min(box.max.x, localIntersection.x));

    const trackStartLocal = new THREE.Vector3(box.min.x, 0, 0);
    const trackEndLocal = new THREE.Vector3(box.max.x, 0, 0);
    const trackStartWorld = track.localToWorld(trackStartLocal.clone());
    const trackEndWorld = track.localToWorld(trackEndLocal.clone());
    const trackStartInParent = activeSlider.parent.worldToLocal(trackStartWorld.clone());
    const trackEndInParent = activeSlider.parent.worldToLocal(trackEndWorld.clone());

    const sliderMin = isBottom
      ? Math.min(trackStartInParent.x, trackEndInParent.x)
      : Math.min(trackStartInParent.z, trackEndInParent.z);
    const sliderMax = isBottom
      ? Math.max(trackStartInParent.x, trackEndInParent.x)
      : Math.max(trackStartInParent.z, trackEndInParent.z);

    const normalized = (clampedCoord - box.min.x) / (box.max.x - box.min.x);
    const mappedCoord = sliderMin + normalized * (sliderMax - sliderMin);

    if (isBottom) {
      activeSlider.position.set(mappedCoord, activeSlider.position.y, activeSlider.position.z); 
      // ✨ Map to X-axis for bottom sliders
    } else {
      activeSlider.position.set(activeSlider.position.x, activeSlider.position.y, mappedCoord); 
      // Keep mapping to Z-axis for top sliders
    }
  }

  function handlePointerUp() {
    if (isDragging && activeSlider) {
      console.log('🛑 Released:', activeSlider.name);
    }
    setIsDragging(false);
    setActiveSlider(null);
    camera.current = null;
  }

  function handleClick(e) {
    e.stopPropagation();
    const mesh = e.object;
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
      <Stage environment="sunset" intensity={0.0005}>
        <Model scale={0.01} />
      </Stage>
    </Canvas>
  );
}

export default App;
