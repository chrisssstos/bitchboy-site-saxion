//userButtonInteraction.js
import * as THREE from "three";

export function useButtonInteraction(scene, originalMaterialsRef) {
  const activeButtonInRow = new Map();

  // there has to be a better way of doing this
  function getRowForButton(buttonName) {
    if (buttonName.match(/^Button_([1-5])$/)) return 1;
    if (buttonName.match(/^Button_(9|10|11|12|13)$/)) return 2;
    if (buttonName.match(/^Button_(17|18|19|20|21)$/)) return 3;
    if (buttonName.match(/^Button_(25|26|27|28|29)$/)) return 4;
    return null;
  }

  function handleButtonPointerDown(e) {
    // Ensure this is the topmost intersection
    if (e.intersections && e.intersections[0].object.uuid !== e.object.uuid) {
      return false;
    }

    const obj = e.object;
    if (!obj.name.includes("Button")) return false;

    const row = getRowForButton(obj.name);
    if (!row) return false;

    const activeButtonName = activeButtonInRow.get(row);
    if (activeButtonName && activeButtonName !== obj.name) {
      const activeButton = scene.getObjectByName(activeButtonName);
      if (activeButton && originalMaterialsRef.current.has(activeButton.uuid)) {
        activeButton.material = originalMaterialsRef.current.get(activeButton.uuid).clone();
      }
    }

    activeButtonInRow.set(row, obj.name);
    obj.material = new THREE.MeshStandardMaterial({ color: "#50C878" }); // green
    obj.position.z -= 0.1;
    obj.userData.wasPressed = true;

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
          // Adding functionality to the middle (3x3) is possible here
        }
      } else {
        console.log("Bottom?");
        // Adding functionality to the bottom row is possible here
      }

    }

    return true;
  }

  function handleButtonPointerUp() {
    scene.traverse((child) => {
      if (child.name.includes("Button") && child.userData.wasPressed) {
        child.position.z += 0.1;
        child.userData.wasPressed = false;

        const row = getRowForButton(child.name);
        if (row && activeButtonInRow.get(row) !== child.name) {
          if (originalMaterialsRef.current.has(child.uuid)) {
            child.material = originalMaterialsRef.current.get(child.uuid).clone;
          }
        }

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
