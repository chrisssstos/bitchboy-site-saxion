//userButtonInteraction.js
import * as THREE from "three";

export function useButtonInteraction(scene, originalMaterialsRef) {
  function handleButtonPointerDown(e) {
    // Ensure this is the topmost intersection
    if (e.intersections && e.intersections[0].object.uuid !== e.object.uuid) {
      return false;
    }

    const obj = e.object;
    if (!obj.name.includes("Button")) return false;

    // Store original material if not already saved
    if (!originalMaterialsRef.current.has(obj.uuid)) {
      originalMaterialsRef.current.set(obj.uuid, obj.material.clone());
    }

    obj.position.z -= 0.1;
    obj.userData.wasPressed = true;

    obj.material = new THREE.MeshStandardMaterial({ color: "#50C878" });

    // Connect to VJ system
    if (window.vjController && window.vjController.handleButtonPress) {
      // Extract button index from name (assuming format like "Button_01", "Button_02", etc.)
      // skips middle and bottom (nested ifs = cringe i know)
      if(!obj.name.includes('bottom')){
        if(!obj.name.includes('middle')){
          const match = obj.name.match(/Button.*?(\d+)/);
          if (match) {
            const buttonIndex = parseInt(match[1]) - 1; // Convert to 0-based index
            console.log(`🎮 VJ Button ${buttonIndex} pressed:`, obj.name);
            window.vjController.handleButtonPress(buttonIndex, true);
          }
        } else {
          console.log("Middle?");
          // pop up here
        }
        // bottom button
      } else {
        console.log("Bottom?");
        // pop up here
      }

    }

    return true;
  }

  function handleButtonPointerUp() {
    scene.traverse((child) => {
      if (child.name.includes("Button") && child.userData.wasPressed) {
        child.position.z += 0.1;
        child.userData.wasPressed = false;

        // const originalMat = originalMaterialsRef.current.get(child.uuid);
        // if (originalMat) {
        //   child.material = originalMat;
        // }

        // Connect to VJ system for button release
        if (window.vjController && window.vjController.handleButtonPress) {
          const match = child.name.match(/Button.*?(\d+)/);
          if (match) {
            const buttonIndex = parseInt(match[1]) - 1;
            console.log(`🎮 VJ Button ${buttonIndex} released:`, child.name);
            window.vjController.handleButtonPress(buttonIndex, false);
          }
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
