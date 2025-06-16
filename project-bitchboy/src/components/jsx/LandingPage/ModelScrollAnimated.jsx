import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { useRef, useEffect, useMemo } from "react";
import * as THREE from "three";

const ANIMATION_CONFIG = {
  sectionStart: {
    start: 0,
    end: 0.1,
    position: { x: -5, y: 10, z: 0 },
    rotation: { x: 0, y: Math.PI/2, z: 0 },
    scale: { x: 0, y: 0, z: 0 },
    opacity: 1
  },

  sectionIntro: {
    start: 0.2,
    end: 0.35,
    position: { x: -1.5, y: -1, z: 3 },
    rotation: { x: 0.3, y: Math.PI/5, z: 0 },
    scale: { x: 1.5, y: 1.5, z: 1.5 },
    opacity: 1
  },

  sectionLines1: {
    start: 0.35,
    end: 0.40,
    position: { x: 3.5, y: -1, z: 0 },
    rotation: { x: 0.4, y: -0.4, z: 0 },
    scale: { x: 2, y: 2, z: 2 },
    opacity: 1
  },

  holdLines1: {
    start: 0.40,
    end: 0.60,
    position: { x: 3.5, y: -1, z: 0 },
    rotation: { x: 0.4, y: -0.4, z: 0 },
    scale: { x: 2, y: 2, z: 2 },
    opacity: 1
  },

  sectionLines2: {
    start: 0.60,
    end: 0.70, 
    position: { x: -2.5, y: -2, z: 0 },
    rotation: { x: 0.2, y: 0.4, z: 0 },
    scale: { x: 2, y: 2, z: 2 },
    opacity: 1
  },

  holdLines2: {
    start: 0.70,
    end: 0.85,
    position: { x: -2.5, y: -2, z: 0 }, 
    rotation: { x: 0.2, y: 0.4, z: 0 },
    scale: { x: 2, y: 2, z: 2 },
    opacity: 1
  },

  sectionEnd: {
    start: 0.95,
    end: 1,
    position: { x: -2, y: -0.7, z: 0 },
    rotation: { x: 0.2, y: 0.5, z: 0 },
    scale: { x: 1.5, y: 1.5, z: 1.5 },
    opacity: 1
  },
};

function ScrollAnimatedModel() {
  const { scene } = useGLTF("/bitchboy3d(v10).glb");
  const meshRef = useRef();
  const groupRef = useRef();

  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((obj) => {
      if (obj.isMesh) {
        obj.castShadow = true;
        obj.receiveShadow = true;
      }
    });
    return clone;
  }, [scene]);

  const interpolateKeyframes = (progress, startFrame, endFrame, frameStart, frameEnd) => {
    if (progress < frameStart) return startFrame;
    if (progress > frameEnd) return endFrame;

    const localProgress = (progress - frameStart) / (frameEnd - frameStart);
    const smoothProgress = THREE.MathUtils.smoothstep(localProgress, 0, 1);

    return {
      position: {
        x: THREE.MathUtils.lerp(startFrame.position.x, endFrame.position.x, smoothProgress),
        y: THREE.MathUtils.lerp(startFrame.position.y, endFrame.position.y, smoothProgress),
        z: THREE.MathUtils.lerp(startFrame.position.z, endFrame.position.z, smoothProgress)
      },
      rotation: {
        x: THREE.MathUtils.lerp(startFrame.rotation.x, endFrame.rotation.x, smoothProgress),
        y: THREE.MathUtils.lerp(startFrame.rotation.y, endFrame.rotation.y, smoothProgress),
        z: THREE.MathUtils.lerp(startFrame.rotation.z, endFrame.rotation.z, smoothProgress)
      },
      scale: {
        x: THREE.MathUtils.lerp(startFrame.scale.x, endFrame.scale.x, smoothProgress),
        y: THREE.MathUtils.lerp(startFrame.scale.y, endFrame.scale.y, smoothProgress),
        z: THREE.MathUtils.lerp(startFrame.scale.z, endFrame.scale.z, smoothProgress)
      },
      opacity: THREE.MathUtils.lerp(startFrame.opacity, endFrame.opacity, smoothProgress)
    };
  };

  const getAnimationState = (scrollProgress) => {
    const config = ANIMATION_CONFIG;

    if (scrollProgress <= config.sectionStart.end) {
      return interpolateKeyframes(scrollProgress, config.sectionStart, config.sectionIntro, 
        config.sectionStart.start, config.sectionStart.end);
    } else if (scrollProgress <= config.sectionIntro.end) {
      return interpolateKeyframes(scrollProgress, config.sectionIntro, config.sectionLines1, 
        config.sectionIntro.start, config.sectionIntro.end);
    } else if (scrollProgress <= config.sectionLines1.end) {
      return interpolateKeyframes(scrollProgress, config.sectionLines1, config.holdLines1, 
        config.sectionLines1.start, config.sectionLines1.end);
    } else if (scrollProgress <= config.holdLines1.end) {
      return config.holdLines1;
    } else if (scrollProgress <= config.sectionLines2.end) {
      return interpolateKeyframes(scrollProgress, config.holdLines1, config.sectionLines2, 
        config.sectionLines2.start, config.sectionLines2.end);
    } else if (scrollProgress <= config.holdLines2.end) {
      return config.holdLines2;
    } else if (scrollProgress <= config.sectionEnd.end) {
      return interpolateKeyframes(scrollProgress, config.holdLines2, config.sectionEnd, 
        config.sectionEnd.start, config.sectionEnd.end);
    }
  };

  useFrame((state) => {
    if (!meshRef.current || !groupRef.current) return;

    const scrollProgress = Math.min(window.scrollY / (document.body.scrollHeight - window.innerHeight), 1);

    const animState = getAnimationState(scrollProgress);
    groupRef.current.position.set(animState.position.x, animState.position.y, animState.position.z);
    groupRef.current.rotation.set(animState.rotation.x, animState.rotation.y, animState.rotation.z);
    groupRef.current.scale.set(animState.scale.x, animState.scale.y, animState.scale.z);

    groupRef.current.traverse((child) => {
      if (child.isMesh && child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach(material => {
            material.transparent = true;
            material.opacity = animState.opacity;
          });
        } else {
          child.material.transparent = true;
          child.material.opacity = animState.opacity;
        }
      }
    });

    const elapsed = state.clock.getElapsedTime();
    const floatY = Math.sin(elapsed * 0.5) * 0.1;
    groupRef.current.position.y += floatY;
  });

  useEffect(() => {
    const handleScroll = () => {
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <group ref={groupRef}>
      <primitive
        ref={meshRef}
        object={clonedScene}
        scale={1}
        position={[0, 0, 0]}
        rotation={[0, 0, 0]}
      />
    </group>
  );
}

export default function ScrollModelAnimation() {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 1,
        pointerEvents: "none",
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        gl={{ alpha: true }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={0.8}
          castShadow
        />
        <pointLight 
          position={[-5, -5, 5]} 
          intensity={0.4} 
          color="#ff6b35"
        />

        <ScrollAnimatedModel />
      </Canvas>
    </div>
  );
}

export { ANIMATION_CONFIG };