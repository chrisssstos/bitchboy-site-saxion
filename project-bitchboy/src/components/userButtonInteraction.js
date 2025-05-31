//userButtonInteraction.js
import * as THREE from "three";

export function useButtonInteraction(scene, originalMaterialsRef) {
  function handleButtonPointerDown(e) {
    const obj = e.object;
    if (!obj.name.includes("Button")) return false;

    // Store original material if not already saved
    if (!originalMaterialsRef.current.has(obj.uuid)) {
      originalMaterialsRef.current.set(obj.uuid, obj.material.clone());
    }

    obj.position.z -= 0.1;
    obj.userData.wasPressed = true;

    obj.material = new THREE.MeshStandardMaterial({ color: "#ada0a3" });

    return true;
  }

  function handleButtonPointerUp() {
    scene.traverse((child) => {
      if (child.name.includes("Button") && child.userData.wasPressed) {
        child.position.z += 0.1;
        child.userData.wasPressed = false;

        const originalMat = originalMaterialsRef.current.get(child.uuid);
        if (originalMat) {
          child.material = originalMat;
        }
      }
    });
    return true;
  }

  return {
    handleButtonPointerDown,
    handleButtonPointerUp,
  };
}
