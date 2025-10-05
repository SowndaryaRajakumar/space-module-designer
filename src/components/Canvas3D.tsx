import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid, PerspectiveCamera, Text, Box, Sphere, Cylinder } from "@react-three/drei";
import { HabitatModule, InteriorElement } from "@/types/habitat";
import { AstronautAnimation } from "./AstronautAnimation";
import * as THREE from "three";

interface Canvas3DProps {
  modules: HabitatModule[];
  showInterior?: boolean;
  showAstronaut?: boolean;
}

const InteriorElementMesh = ({ element, modulePosition }: { element: InteriorElement; modulePosition: { x: number; y: number; z: number } }) => {
  const position: [number, number, number] = [
    modulePosition.x + element.position.x,
    modulePosition.y + element.position.y,
    modulePosition.z + element.position.z,
  ];

  const scale = element.scale || 1;

  const getElementGeometry = () => {
    switch (element.type) {
      case "sleeping-pod":
        return <Box args={[1.5 * scale, 0.5 * scale, 2 * scale]} />;
      case "galley":
        return <Box args={[1 * scale, 1 * scale, 1.5 * scale]} />;
      case "workstation":
        return <Box args={[0.8 * scale, 1 * scale, 0.6 * scale]} />;
      case "airlock":
        return <Cylinder args={[0.8 * scale, 0.8 * scale, 2 * scale]} />;
      case "medical-bay":
        return <Box args={[1.5 * scale, 1 * scale, 1.5 * scale]} />;
      case "storage":
        return <Box args={[0.8 * scale, 0.8 * scale, 0.8 * scale]} />;
      case "handrail":
        return <Cylinder args={[0.05 * scale, 0.05 * scale, 2 * scale]} />;
      case "fire-extinguisher":
        return <Cylinder args={[0.15 * scale, 0.15 * scale, 0.5 * scale]} />;
      case "emergency-exit":
        return <Box args={[0.1 * scale, 2 * scale, 1 * scale]} />;
      case "oxygen-tank":
        return <Cylinder args={[0.3 * scale, 0.3 * scale, 1 * scale]} />;
      default:
        return <Box args={[0.5 * scale, 0.5 * scale, 0.5 * scale]} />;
    }
  };

  const getElementColor = () => {
    switch (element.type) {
      case "sleeping-pod": return "#3b82f6";
      case "galley": return "#eab308";
      case "workstation": return "#22c55e";
      case "airlock": return "#a855f7";
      case "medical-bay": return "#ef4444";
      case "storage": return "#6b7280";
      case "handrail": return "#06b6d4";
      case "fire-extinguisher": return "#f97316";
      case "emergency-exit": return "#dc2626";
      case "oxygen-tank": return "#0ea5e9";
      default: return "#ffffff";
    }
  };

  return (
    <mesh position={position} rotation={[0, element.rotation, 0]}>
      {getElementGeometry()}
      <meshStandardMaterial color={getElementColor()} metalness={0.6} roughness={0.4} />
    </mesh>
  );
};

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

export const Canvas3D = ({ modules, showInterior = false, showAstronaut = false }: Canvas3DProps) => {
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
          <>
            <ModuleMesh key={module.id} module={module} />
            {showInterior && module.interiorElements?.map((element) => (
              <InteriorElementMesh 
                key={element.id} 
                element={element} 
                modulePosition={module.position} 
              />
            ))}
          </>
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
        
        {/* Animated astronaut */}
        {showAstronaut && <AstronautAnimation modules={modules} animate={true} />}
      </Canvas>
    </div>
  );
};
