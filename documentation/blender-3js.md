# 📊 Blender Model Integration Guide

This project uses [Three.js](https://threejs.org/) to display the 3D model of the Bitchboy.

---

## 🔧 Naming Conventions

To have the model properly integrate with this project's implementation, we suggest following a naming convention for the different components of the Bitchboy.

### Top buttons

![top](/documentation/images/top-buttons.png)

The top section of the buttons of the Bitchboy, which is primarily used for activating the animations and layers, should be named **Button_1** to **Button_32**.

### Bottom buttons

![bot](/documentation/images/bot-buttons.png)

The bottom section of the buttons of the Bitchboy, which in our implementation has no use, should be named **Button_bottom_1** to **Button_bottom_8**.

### Middle buttons

![mid](/documentation/images/mid-buttons.png)

The middle section of the buttons of the Bitchboy, which in our implementation has no use, should be named **Button_middle_1** to **Button_middle_9**.

### Top sliders

![top-slide](/documentation/images/top-sliders.png)

The sliders on the top section of the Bitchboy, which control several effects, should be named **Slider_knob_top_1** **Slider_knob_top_4**.

### Bottom sliders

![bot-slide](/documentation/images/bot-sliders.png)

The sliders on the bottom section of the Bitchboy, which control the opacity of the layers, should be named **Slider_knob_bottom_1** **Slider_knob_bottom_8**.

### Knobs

![knobs](/documentation/images/knobs.png)

The knobs on the Bitchboy, which also control several effects, should be named **knob_1** to **knob_8**.

### Touchpad

![touchpad](/documentation/images/touchpad.png)

Currently, our implementation does not have any interaction with the touchpad, so the  naming of it can be whatever suits future implementation.

## Importing Blender Model

![blender-angle](/documentation/images/blender-angle.png)

Before importing the model, we suggest angling it in a way that it looks like it is propped up/leaning down. This is primarily for aesthetic purposes in the **Interactive** page.

![blender-export](/documentation/images/blender-export.png)

Afterwards, export the Blender model as a gltF 2.0 (.glb/.gltf) and place it in the **public** directory.

## Relevant Functionality

```
const { scene } = useGLTF("/bitchboy3d(v11).glb");
```
This is where the model is used and imported into the Three.js scene.

```
const match = child.name.match(/^Button_(\d+)$/);
        if (match) {
          const index = parseInt(match[1], 10);

          const skipButtons =
            (index >= 6 && index <= 8) ||
            (index >= 14 && index <= 16) ||
            (index >= 22 && index <= 24) ||
            (index >= 30 && index <= 32);

          if (index >= 1 && index <= 29 && !skipButtons) {
            child.material = new THREE.MeshStandardMaterial({ color: "#FFA500" });
          }

          if (skipButtons) {
            child.material = new THREE.MeshStandardMaterial({ color: "#636363" })
          }

        }
```
This code snippet (found in [3DModel.jsx](../project-bitchboy/src/components/3DModel.jsx)) determines the color of the buttons. In our case, the two columns to the very right are unused, hence they are colored dark gray (**#636363**), and the usable buttons are colored orange (**#FFA500**).

The buttons to skip are determined by the index and can be changed at will.

```
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
          console.log("Middle");
          // Adding functionality to the middle (3x3) is possible here
        }
      } else {
        console.log("Bottom");
        // Adding functionality to the bottom row is possible here
      }

    }
```

As mentioned previously, our implementation has no use for the bottom buttons and the middle buttons, but in this code snippet (found in [userButtonInteraction.js](../project-bitchboy/src/components/userButtonInteraction.js)) has two else blocks that are open for additional features.


## OriginalMaterialsRef

In [3DModel.jsx](../project-bitchboy/src/components/3DModel.jsx) and [userButtonInteraction.js](../project-bitchboy/src/components/userButtonInteraction.js) there are comments denoted by **BL**. In Three.js, there is a built in method called **OriginalMaterialsRef**, where we can store and use the original material of components of the Blender model. This was previously used when the buttons were a temporary press, where the buttons would only shortly turn green and the colors of the buttons unpressed were the original grey from the model.

After switching to make all the buttons orange, this became redundant. However, in the future, if the Blender model were to be changed to have the desired color, the code comments denoted by BL can be used in order to restore the previous functionality.

## Known Issues

### Knob Irregularity
The knob interaction ([userKnobInteraction.js](../project-bitchboy/src/components/userKnobInteraction.js)) is quite erratic and innacurate when done very quickly. In precise and slow turns, it is accurate.

### Innacurate Base Values
Before interaction, the position of the sliders and knobs are not indicative of their actual values. For example:

![base-value1](/documentation/images/base-value1.png)

When launching a visual on layer 4 and not interacting with its corresponding slider, the opacity is at 100%, even though the slider is not at the very top (where 100% would be).

![base-value1](/documentation/images/base-value2.png)

Only when interacting with the slider, does the correct value update.

However, this could be seen as not an issue, instead an aesthetic. To have all the knobs and sliders at 0% or 100% in the beginning would look a bit dull.

### Performance
Pressing the usable buttons rapidly has shown to cause performance issues.
