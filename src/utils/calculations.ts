import { HabitatModule, ModuleCalculations, MATERIAL_PROPERTIES } from "@/types/habitat";

export function calculateModuleProperties(module: HabitatModule): ModuleCalculations {
  const { type, dimensions, material } = module;
  const materialProps = MATERIAL_PROPERTIES[material];
  
  let volume = 0;
  let surfaceArea = 0;
  
  switch (type) {
    case "cylinder":
      const r = dimensions.radius || 2;
      const h = dimensions.height || 4;
      volume = Math.PI * r * r * h;
      surfaceArea = 2 * Math.PI * r * h + 2 * Math.PI * r * r;
      break;
      
    case "dome":
      const domeR = dimensions.radius || 3;
      volume = (2 / 3) * Math.PI * domeR * domeR * domeR;
      surfaceArea = 2 * Math.PI * domeR * domeR;
      break;
      
    case "cube":
      const w = dimensions.width || 3;
      const l = dimensions.length || 3;
      const d = dimensions.depth || 3;
      volume = w * l * d;
      surfaceArea = 2 * (w * l + l * d + w * d);
      break;
      
    case "connector":
      const connR = dimensions.radius || 1;
      const connH = dimensions.height || 2;
      volume = Math.PI * connR * connR * connH;
      surfaceArea = 2 * Math.PI * connR * connH;
      break;
  }
  
  const mass = surfaceArea * materialProps.thickness * materialProps.density;
  const crewCapacity = Math.floor(volume / 10); // ~10m³ per crew member
  const powerRequirement = volume * 0.5; // 0.5 kW per m³
  
  return {
    volume: Math.round(volume * 100) / 100,
    surfaceArea: Math.round(surfaceArea * 100) / 100,
    mass: Math.round(mass * 100) / 100,
    crewCapacity,
    powerRequirement: Math.round(powerRequirement * 100) / 100,
  };
}

export function calculateTotalStats(modules: HabitatModule[]): ModuleCalculations {
  return modules.reduce(
    (total, module) => {
      const calc = calculateModuleProperties(module);
      return {
        volume: total.volume + calc.volume,
        surfaceArea: total.surfaceArea + calc.surfaceArea,
        mass: total.mass + calc.mass,
        crewCapacity: total.crewCapacity + calc.crewCapacity,
        powerRequirement: total.powerRequirement + calc.powerRequirement,
      };
    },
    { volume: 0, surfaceArea: 0, mass: 0, crewCapacity: 0, powerRequirement: 0 }
  );
}
