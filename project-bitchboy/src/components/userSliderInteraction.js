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
    const trackWorldQuat = new THREE.Quaternion();
    track.getWorldQuaternion(trackWorldQuat);

    // Apply track's rotation to the plane normal
    const localNormal = planeNormal.clone().applyQuaternion(trackWorldQuat);
    const plane = new THREE.Plane(localNormal, -trackWorldPos.dot(localNormal));

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
        // Convert intersection to track's local space to get the X coordinate
        const localIntersection = track.worldToLocal(intersection.clone());

        // Get current slider position in track's local space
        const sliderWorldPos = new THREE.Vector3();
        e.object.getWorldPosition(sliderWorldPos);
        const sliderLocalInTrack = track.worldToLocal(sliderWorldPos.clone());

        // Calculate offset along the track's X-axis (which is the movement axis)
        initialOffset.current = localIntersection.x - sliderLocalInTrack.x;

        console.log(`Initial offset for ${e.object.name}:`, initialOffset.current);
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

    const intersection = getWorldIntersection(e.clientX, e.clientY, track, planeNormal);
    if (!intersection) return false;

    // Convert intersection to track's local space
    const localIntersection = track.worldToLocal(intersection.clone());

    // Get track geometry bounds
    const geometry = track.geometry || (track.children[0] && track.children[0].geometry);
    if (!geometry) return false;
    if (!geometry.boundingBox) geometry.computeBoundingBox();
    const box = geometry.boundingBox;

    // Apply the initial offset and clamp to track bounds
    const targetX = localIntersection.x - initialOffset.current;
    const clampedCoord = Math.max(box.min.x, Math.min(box.max.x, targetX));

    // Map from track's local X coordinate to slider's parent coordinate system
    const trackAxisMin = box.min.x;
    const trackAxisMax = box.max.x;

    const trackStartLocal = new THREE.Vector3(trackAxisMin, 0, 0);
    const trackEndLocal = new THREE.Vector3(trackAxisMax, 0, 0);

    const trackStartWorld = track.localToWorld(trackStartLocal.clone());
    const trackEndWorld = track.localToWorld(trackEndLocal.clone());
    const trackStartInParent = activeSlider.parent.worldToLocal(trackStartWorld.clone());
    const trackEndInParent = activeSlider.parent.worldToLocal(trackEndWorld.clone());
    // You can adjust this value to set how much you want to "raise" the minimum position for bottom sliders.
    // For example, set to 0.2 to prevent the slider from going all the way to the bottom.
    const BOTTOM_SLIDER_MIN_LIMIT = 0.2; // 0 = full range, 0.2 = 20% up from bottom

    let sliderMin = isBottom
      ? Math.min(trackStartInParent.x, trackEndInParent.x)
      : Math.min(trackStartInParent.z, trackEndInParent.z);
    let sliderMax = isBottom
      ? Math.max(trackStartInParent.x, trackEndInParent.x)
      : Math.max(trackStartInParent.z, trackEndInParent.z);

    const normalized = (clampedCoord - trackAxisMin) / (trackAxisMax - trackAxisMin);

    // For bottom sliders, raise the minimum limit by a percentage of the range
    if (isBottom) {
      const range = sliderMax - sliderMin;
      sliderMin = sliderMin + range * BOTTOM_SLIDER_MIN_LIMIT;
    }

    const mappedCoord = sliderMin + normalized * (sliderMax - sliderMin);

    if (isBottom) {
      activeSlider.position.set(mappedCoord, activeSlider.position.y, activeSlider.position.z);
    } else {
      activeSlider.position.set(activeSlider.position.x, activeSlider.position.y, mappedCoord);
    }

    
    // Connect to VJ system
    if (window.vjController && window.vjController.handleSliderChange) {
      // Extract slider index from name (assuming format like "Slider_knob_top_1", "Slider_knob_bottom_1", etc.)
      const match = activeSlider.name.match(/Slider_knob_(top|bottom)_(\d+)/);
      if (match) {
        const group = match[1]; // 'top' or 'bottom'
        const index = parseInt(match[2]) - 1; // Convert to 0-based index
        const value = normalized * 100; // Convert to 0-100 range

        console.log(`🎚️ VJ Slider ${group}_${index} moved to:`, value.toFixed(1));
        window.vjController.handleSliderChange(group, index, value);
      }
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
    initialOffset.current = 0; // Reset offset

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