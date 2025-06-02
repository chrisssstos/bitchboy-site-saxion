import { Canvas } from "@react-three/fiber";
import { useRef, useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

function AnimatedModel() {
  const ref = useRef();
  const { scene } = useGLTF("/bitchboy3dnew1.glb");

  // initial position, scale, and rotation
  useEffect(() => {
    if (!ref.current) return;
    ref.current.position.set(0.4, -8, 5);
    ref.current.scale.set(4, 4, 4);
    ref.current.rotation.set(-1, 0, 0);
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (!ref.current) return;

    // Section 1: centered, default
    gsap.to(ref.current.position, {
      x: 0.4,
      y: -6,
      z: -2,
      scrollTrigger: {
        trigger: "#section-1",
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });
    gsap.to(ref.current.rotation, {
      x: 0,
      y: 0,
      z: 0,
      scrollTrigger: {
        trigger: "#section-1",
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });
    gsap.to(ref.current.scale, {
      x: 4,
      y: 4,
      z: 4,
      scrollTrigger: {
        trigger: "#section-1",
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });

    // Section 2: spin in place, stay centered and visible
    gsap.to(ref.current.position, {
      x: 0.4,
      y: -5,
      z: -10,
      scrollTrigger: {
        trigger: "#section-2",
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });
    gsap.to(ref.current.rotation, {
      x: 0,
      y: Math.PI * 2, // full spin on Y axis
      z: 0,
      scrollTrigger: {
        trigger: "#section-2",
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });
    gsap.to(ref.current.scale, {
      x: 4,
      y: 4,
      z: 4, 
      scrollTrigger: {
        trigger: "#section-2",
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });

    // Section 3: shrink and move to left
    gsap.to(ref.current.position, {
      x: 0.4,
      y: -40,
      z: -10,
      scrollTrigger: {
        trigger: "#section-3",
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });
    gsap.to(ref.current.scale, {
      x: 1,
      y: 1,
      z: 1,
      scrollTrigger: {
        trigger: "#section-3",
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });
    gsap.to(ref.current.rotation, {
      x: 0,
      y: Math.PI * 2, // full spin on Y axis
      z: 0,
      scrollTrigger: {
        trigger: "#section-3",
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });

  }, []);

  return <primitive object={scene} ref={ref} />;
}

const ModelAnimated = () => (
  <Canvas
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      zIndex: 2,
      pointerEvents: "none",
    }}
    camera={{ fov: 75, position: [0, 0, 5] }}
    gl={{ alpha: true }}
  >
    <ambientLight intensity={1.8} />
    <directionalLight position={[1, 1, 1]} intensity={0.6} />
    <AnimatedModel />
  </Canvas>
);

export default ModelAnimated;