import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Box, Sphere } from "@react-three/drei";
import * as THREE from "three";
import { HabitatModule } from "@/types/habitat";

interface AstronautAnimationProps {
  modules: HabitatModule[];
  animate: boolean;
}

export const AstronautAnimation = ({ modules, animate }: AstronautAnimationProps) => {
  const astronautRef = useRef<THREE.Group>(null);
  const timeRef = useRef(0);
  const currentModuleIndex = useRef(0);
  const stateRef = useRef<"approaching" | "opening" | "entering" | "moving">("approaching");

  useEffect(() => {
    if (animate) {
      timeRef.current = 0;
      currentModuleIndex.current = 0;
      stateRef.current = "approaching";
    }
  }, [animate]);

  useFrame((state, delta) => {
    if (!animate || !astronautRef.current || modules.length === 0) return;

    timeRef.current += delta;
    const time = timeRef.current;

    switch (stateRef.current) {
      case "approaching":
        // Astronaut approaches from far away
        const approachProgress = Math.min(time / 3, 1);
        const startX = modules[0].position.x - 15;
        const startY = modules[0].position.y;
        const startZ = modules[0].position.z - 15;
        
        astronautRef.current.position.x = startX + (modules[0].position.x - startX - 3) * approachProgress;
        astronautRef.current.position.y = startY;
        astronautRef.current.position.z = startZ + (modules[0].position.z - startZ - 3) * approachProgress;
        
        // Face the module
        astronautRef.current.rotation.y = Math.PI / 4;

        if (approachProgress >= 1) {
          stateRef.current = "opening";
          timeRef.current = 0;
        }
        break;

      case "opening":
        // Simulate opening airlock (bob up and down)
        const bobAmount = Math.sin(time * 3) * 0.2;
        astronautRef.current.position.y = modules[0].position.y + bobAmount;

        if (time > 2) {
          stateRef.current = "entering";
          timeRef.current = 0;
        }
        break;

      case "entering":
        // Enter the first module
        const enterProgress = Math.min(time / 2, 1);
        const targetModule = modules[currentModuleIndex.current];
        
        astronautRef.current.position.x += (targetModule.position.x - astronautRef.current.position.x) * 0.02;
        astronautRef.current.position.y = targetModule.position.y;
        astronautRef.current.position.z += (targetModule.position.z - astronautRef.current.position.z) * 0.02;

        if (enterProgress >= 1) {
          stateRef.current = "moving";
          timeRef.current = 0;
        }
        break;

      case "moving":
        // Move between modules
        if (currentModuleIndex.current < modules.length - 1) {
          currentModuleIndex.current++;
          const nextModule = modules[currentModuleIndex.current];
          
          // Smooth movement to next module
          const moveProgress = Math.min(time / 3, 1);
          const prevModule = modules[currentModuleIndex.current - 1];
          
          astronautRef.current.position.x = prevModule.position.x + (nextModule.position.x - prevModule.position.x) * moveProgress;
          astronautRef.current.position.y = prevModule.position.y + (nextModule.position.y - prevModule.position.y) * moveProgress;
          astronautRef.current.position.z = prevModule.position.z + (nextModule.position.z - prevModule.position.z) * moveProgress;

          // Rotate to face direction of movement
          const angle = Math.atan2(
            nextModule.position.z - prevModule.position.z,
            nextModule.position.x - prevModule.position.x
          );
          astronautRef.current.rotation.y = angle;

          if (moveProgress >= 1) {
            timeRef.current = 0;
          }
        } else {
          // Loop back to start
          timeRef.current = 0;
          currentModuleIndex.current = 0;
          stateRef.current = "approaching";
        }
        break;
    }

    // Add floating animation
    astronautRef.current.position.y += Math.sin(state.clock.elapsedTime * 2) * 0.01;
  });

  return (
    <group ref={astronautRef}>
      {/* Simple astronaut representation */}
      {/* Helmet */}
      <Sphere args={[0.3, 16, 16]} position={[0, 0.6, 0]}>
        <meshStandardMaterial color="#ffffff" transparent opacity={0.3} metalness={0.9} roughness={0.1} />
      </Sphere>
      
      {/* Visor */}
      <Sphere args={[0.25, 16, 16]} position={[0, 0.6, 0.15]}>
        <meshStandardMaterial color="#06b6d4" transparent opacity={0.7} metalness={1} roughness={0} />
      </Sphere>

      {/* Body */}
      <Box args={[0.4, 0.6, 0.3]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#f0f0f0" metalness={0.6} roughness={0.4} />
      </Box>

      {/* Life support backpack */}
      <Box args={[0.35, 0.5, 0.2]} position={[0, 0, -0.25]}>
        <meshStandardMaterial color="#06b6d4" metalness={0.8} roughness={0.3} />
      </Box>

      {/* Arms */}
      <Box args={[0.15, 0.5, 0.15]} position={[-0.35, 0, 0]}>
        <meshStandardMaterial color="#f0f0f0" metalness={0.6} roughness={0.4} />
      </Box>
      <Box args={[0.15, 0.5, 0.15]} position={[0.35, 0, 0]}>
        <meshStandardMaterial color="#f0f0f0" metalness={0.6} roughness={0.4} />
      </Box>

      {/* Legs */}
      <Box args={[0.15, 0.6, 0.15]} position={[-0.15, -0.6, 0]}>
        <meshStandardMaterial color="#f0f0f0" metalness={0.6} roughness={0.4} />
      </Box>
      <Box args={[0.15, 0.6, 0.15]} position={[0.15, -0.6, 0]}>
        <meshStandardMaterial color="#f0f0f0" metalness={0.6} roughness={0.4} />
      </Box>

      {/* Glowing effect around astronaut */}
      <pointLight position={[0, 0, 0]} intensity={0.5} color="#06b6d4" distance={3} />
    </group>
  );
};
