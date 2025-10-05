import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid, PerspectiveCamera } from "@react-three/drei";
import { HabitatModule } from "@/types/habitat";
import * as THREE from "three";

interface Canvas3DProps {
  modules: HabitatModule[];
}

const ModuleMesh = ({ module }: { module: HabitatModule }) => {
  let geometry: THREE.BufferGeometry | null = null;
  const position: [number, number, number] = [
    module.position.x,
    module.position.y,
    module.position.z,
  ];

  switch (module.type) {
    case "cylinder":
    case "connector":
      geometry = new THREE.CylinderGeometry(
        module.dimensions.radius || 2,
        module.dimensions.radius || 2,
        module.dimensions.height || 4,
        32
      );
      break;
    case "dome":
      geometry = new THREE.SphereGeometry(module.dimensions.radius || 3, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
      break;
    case "cube":
      geometry = new THREE.BoxGeometry(
        module.dimensions.width || 3,
        module.dimensions.height || 3,
        module.dimensions.depth || 3
      );
      break;
  }

  const color = module.type === "dome" ? "#a855f7" : module.type === "cube" ? "#22c55e" : "#06b6d4";

  return (
    <mesh position={position} geometry={geometry || undefined} rotation={[0, module.rotation, 0]}>
      <meshStandardMaterial color={color} transparent opacity={0.7} metalness={0.8} roughness={0.2} />
    </mesh>
  );
};

export const Canvas3D = ({ modules }: Canvas3DProps) => {
  return (
    <div className="w-full h-full bg-canvas-bg rounded-lg border border-border overflow-hidden">
      <Canvas>
        <PerspectiveCamera makeDefault position={[15, 15, 15]} />
        <OrbitControls enableDamping dampingFactor={0.05} />
        
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -5]} intensity={0.5} color="#06b6d4" />
        
        <Grid
          args={[50, 50]}
          cellSize={1}
          cellThickness={0.5}
          cellColor="#1e293b"
          sectionSize={5}
          sectionThickness={1}
          sectionColor="#06b6d4"
          fadeDistance={50}
          fadeStrength={1}
          followCamera={false}
        />
        
        {modules.map((module) => (
          <ModuleMesh key={module.id} module={module} />
        ))}
        
        {/* Astronaut path visualization - simple lines between modules */}
        {modules.length > 1 && (
          <lineSegments>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={modules.length}
                array={new Float32Array(
                  modules.flatMap((m) => [m.position.x, m.position.y, m.position.z])
                )}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial color="#06b6d4" opacity={0.5} transparent />
          </lineSegments>
        )}
      </Canvas>
    </div>
  );
};
