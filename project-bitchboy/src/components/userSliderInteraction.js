// useSliderInteraction.js
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export function useSliderInteraction(scene) {
  const [activeSlider, setActiveSlider] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const raycaster = useRef(new THREE.Raycaster());
  const camera = useRef(null);
  const initialOffset = useRef(0);
  const sliderTrackMap = useRef(new Map());

  useEffect(() => {
    if (!scene) return;
    
    const trackMap = new Map();

    scene.traverse((child) => {
      if (child.isMesh) {
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

  function handleSliderPointerDown(e) {
    // Only handle slider knobs
    if (!e.object.name.includes("Slider_knob")) return false;

    setActiveSlider(e.object);
    setIsDragging(true);
    camera.current = e.camera;

    const track = sliderTrackMap.current.get(e.object.name);
    if (track) {
      console.log("🎯 Start dragging:", e.object.name);

      // Determine plane normal based on slider group
      const isBottom = e.object.name.includes("bottom");
      const planeNormal = isBottom ? new THREE.Vector3(0, 0, 1) : new THREE.Vector3(0, 1, 0);

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
    return true; // Indicate that this event was handled
  }

  function handleSliderPointerMove(e) {
    if (!isDragging || !activeSlider || !camera.current) return false;

    const track = sliderTrackMap.current.get(activeSlider.name);
    if (!track) return false;

    const isBottom = activeSlider.name.includes("bottom");
    const planeNormal = isBottom ? new THREE.Vector3(0, 0, 1) : new THREE.Vector3(0, 1, 0);

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
    if (!raycaster.current.ray.intersectPlane(plane, intersection)) return false;

    const localIntersection = track.worldToLocal(intersection.clone());
    const geometry = track.geometry || (track.children[0] && track.children[0].geometry);
    if (!geometry) return false;
    if (!geometry.boundingBox) geometry.computeBoundingBox();
    const box = geometry.boundingBox;

    const clampedCoord = Math.max(box.min.x, Math.min(box.max.x, localIntersection.x));

    const trackAxisMin = box.min.x;
    const trackAxisMax = box.max.x;

    const trackStartLocal = new THREE.Vector3(trackAxisMin, 0, 0);
    const trackEndLocal = new THREE.Vector3(trackAxisMax, 0, 0);

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

    const normalized = (clampedCoord - trackAxisMin) / (trackAxisMax - trackAxisMin);
    const mappedCoord = sliderMin + normalized * (sliderMax - sliderMin);

    if (isBottom) {
      activeSlider.position.set(mappedCoord, activeSlider.position.y, activeSlider.position.z);
    } else {
      activeSlider.position.set(activeSlider.position.x, activeSlider.position.y, mappedCoord);
    }

    return true; // Indicate that this event was handled
  }

  function handleSliderPointerUp() {
    if (!isDragging) return false;

    if (activeSlider) {
      console.log('🛑 Released:', activeSlider.name);
    }
    
    setIsDragging(false);
    setActiveSlider(null);
    camera.current = null;
    
    return true; // Indicate that this event was handled
  }

  // Return the handlers and state
  return {
    // Handlers that return true if they handled the event
    handleSliderPointerDown,
    handleSliderPointerMove,
    handleSliderPointerUp,
    // State for other components to use if needed
    isDragging,
    activeSlider
  };
}