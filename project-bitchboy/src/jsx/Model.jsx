import React from "react";
import { useGLTF } from "@react-three/drei";

export default function Model(props) {
  const gltf = useGLTF("/bitchboy3dnew1.glb");
  return <primitive object={gltf.scene} {...props} />;
}