export type ModuleType = "cylinder" | "dome" | "cube" | "connector";

export type Material = "aluminum" | "titanium" | "composite" | "carbon-fiber";

export type ViewMode = "top" | "front" | "2d" | "3d";

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
