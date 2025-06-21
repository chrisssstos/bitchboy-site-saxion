# 📊 Blender Model Integration Guide

This project uses [Three.js](https://threejs.org/) to display the 3D model of the BitchBoy.

---

## 🔧 Naming Conventions

To have the model properly integrate with this project's implementation, we suggest following a naming convention for the different components of the Bitchboy.

### Top buttons


### Bottom buttons


### Middle buttons


### Top sliders


### Bottom sliders


### Knobs


### Touchpad

## Importing Blender Model

Once the model is angled 

![blender-export](/documentation/images/blender-export.png)

## Relevant Functionality

```
const { scene } = useGLTF("/bitchboy3d(v11).glb");
```



## OriginalMaterialsRef