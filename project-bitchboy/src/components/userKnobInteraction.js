import { useRef } from "react";
import * as THREE from "three";

export function useKnobInteraction(scene) {
  const activeKnob = useRef(null);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);

  function handleKnobPointerDown(e) {
    if (!e.object.name.includes("knob")) return false;

    activeKnob.current = e.object.parent;
    isDragging.current = true;
    
    // Try different ways to get clientX
    const clientX = e.clientX || e.nativeEvent?.clientX || 0;
    dragStartX.current = clientX;

    e.stopPropagation();
    console.log("Knob drag started:", e.object.name);
    return true;
  }

  function handleKnobPointerMove(e) {
    if (!isDragging.current || !activeKnob.current) return false;

    // Try different ways to get clientX
    const clientX = e.clientX || e.nativeEvent?.clientX || 0;
    const deltaX = clientX - dragStartX.current;
    dragStartX.current = clientX;

    // adjust for sensitivity
    const rotationFactor = 0.02;

    let newRotation = activeKnob.current.rotation.y + deltaX * rotationFactor;

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
      activeKnob.current.rotation.y = newRotation;
    }

    // value tracking
    const deg = THREE.MathUtils.radToDeg(activeKnob.current.rotation.y) % 360;
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

    return true;
  }

  function handleKnobPointerUp(e) {
    if (!isDragging.current) return false;

    console.log("Knob drag ended");
    isDragging.current = false;
    activeKnob.current = null;

    return true;
  }

  return {
    handleKnobPointerDown,
    handleKnobPointerMove,
    handleKnobPointerUp,
    isDragging: isDragging.current,
    activeKnob: activeKnob.current,
  };
}