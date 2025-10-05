export type ModuleType = "cylinder" | "dome" | "cube" | "connector";

export type Material = "aluminum" | "titanium" | "composite" | "carbon-fiber";

export type ViewMode = "top" | "front" | "2d" | "3d" | "interior" | "navigation";

export type InteriorElementType = 
  | "sleeping-pod" 
  | "galley" 
  | "workstation" 
  | "airlock" 
  | "medical-bay"
  | "storage"
  | "handrail"
  | "fire-extinguisher"
  | "emergency-exit"
  | "oxygen-tank";

export interface InteriorElement {
  id: string;
  type: InteriorElementType;
  position: { x: number; y: number; z: number };
  rotation: number;
  scale?: number;
}

export interface SafetySystem {
  fireSuppressionActive: boolean;
  emergencyOxygenUnits: number;
  emergencyExits: number;
  medicalBays: number;
  airlocks: number;
}

export interface HabitatModule {
  id: string;
  type: ModuleType;
  position: { x: number; y: number; z: number };
  dimensions: {
    radius?: number;
    height?: number;
    width?: number;
    length?: number;
    depth?: number;
  };
  rotation: number;
  material: Material;
  temperature: { min: number; max: number };
  name: string;
  interiorElements?: InteriorElement[];
  safetySystem?: SafetySystem;
}

export interface ModuleCalculations {
  volume: number;
  surfaceArea: number;
  mass: number;
  crewCapacity: number;
  powerRequirement: number;
}

export const MATERIAL_PROPERTIES: Record<Material, { density: number; thickness: number; thermal: number }> = {
  aluminum: { density: 2700, thickness: 0.005, thermal: 237 },
  titanium: { density: 4500, thickness: 0.003, thermal: 21.9 },
  composite: { density: 1600, thickness: 0.004, thermal: 0.5 },
  "carbon-fiber": { density: 1800, thickness: 0.002, thermal: 70 },
};
