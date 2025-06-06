import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Stage, useGLTF } from "@react-three/drei";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";

function BitchboyModel({ isInteracting, onReturningToPosition }) {
  const { scene } = useGLTF("/bitchboy3dnew1.glb");
  const meshRef = useRef();
  const { camera } = useThree();
  const controlsRef = useRef();

  // here i store the original camera position and target
  const originalCameraPosition = useRef(new THREE.Vector3(0, 2, 10));
  const originalTarget = useRef(new THREE.Vector3(0, 0, 0));
  const isReturningToPosition = useRef(false);

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

  useFrame((state) => {
    if (!meshRef.current) return;

    const elapsed = state.clock.getElapsedTime();
    const idleY = 0.2 + Math.sin(elapsed * 1.2) * 0.2;

    // if stopped interactin return to original position
    if (!isInteracting && !isReturningToPosition.current) {
      isReturningToPosition.current = true;
      onReturningToPosition(true);
    }

    if (isReturningToPosition.current && !isInteracting) {
        // lerp for smoooth transition
      camera.position.lerp(originalCameraPosition.current, 0.05);

      if (controlsRef.current) {
        controlsRef.current.target.lerp(originalTarget.current, 0.05);
        controlsRef.current.update();
      }

      const threshold = 0.1;
      const distance = camera.position.distanceTo(originalCameraPosition.current);

      if (distance < threshold) {
        // snap to exact target when close enough and stop returning
        camera.position.copy(originalCameraPosition.current);
        if (controlsRef.current) {
          controlsRef.current.target.copy(originalTarget.current);
          controlsRef.current.update();
        }
        isReturningToPosition.current = false;
        onReturningToPosition(false);
      }
    }

    // hover animation
    if (!isInteracting) {
      meshRef.current.position.y = THREE.MathUtils.lerp(
        meshRef.current.position.y,
        idleY,
        0.05
      );
    }

    if (isInteracting && isReturningToPosition.current) {
      isReturningToPosition.current = false;
      onReturningToPosition(false);
    }
  });

  const setControlsRef = (controls) => {
    controlsRef.current = controls;
  };

  return (
    <>
      <primitive
        ref={meshRef}
        object={clonedScene}
        scale={2.2}
        position={[0, -0.5, 0]}
        rotation={[-Math.PI / 6, -Math.PI / 10, 0]}
      />
      <OrbitControls
        ref={setControlsRef}
        enablePan={false}
        enableZoom={false}
      />
    </>
  );
}

export default function ModelSpin() {
  const [isInteracting, setIsInteracting] = useState(false);
  const [isReturningToPosition, setIsReturningToPosition] = useState(false);
  const timeoutRef = useRef();

  const handleStart = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsInteracting(true);
  };

  const handleEnd = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIsInteracting(false);
    }, 700);
  };

  return (
    <div
      style={{
        position: "absolute",
        top: -150,
        left: 125,
        width: "100vw",
        height: "100vh",
        zIndex: 2,
        pointerEvents: "none",
      }}
    >
      {isReturningToPosition && (
        <p style={{ color: "white", position: "absolute", top: 20, left: 20 }}>
          cam resetting...
        </p>
      )}
      <Canvas
        shadows
        camera={{ position: [0, 2, 10], fov: 50 }}
        onPointerDown={handleStart}
        onPointerUp={handleEnd}
        onPointerOut={handleEnd}
      >
        <ambientLight intensity={0.5} />
        <directionalLight
          castShadow
          position={[0, 10, 5]}
          intensity={1}
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <Stage
          environment={null}
          intensity={1}
          shadows={{ type: "contact", opacity: 0.8, blur: 2}}
          adjustCamera={false}
        >
          <BitchboyModel 
            isInteracting={isInteracting} 
            onReturningToPosition={setIsReturningToPosition}
          />
        </Stage>
      </Canvas>
    </div>
  );
}