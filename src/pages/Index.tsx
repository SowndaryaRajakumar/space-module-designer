import { useState } from "react";
import { Header } from "@/components/Header";
import { ViewSwitcher } from "@/components/ViewSwitcher";
import { ShapePalette } from "@/components/ShapePalette";
import { PropertiesPanel } from "@/components/PropertiesPanel";
import { CalculationsPanel } from "@/components/CalculationsPanel";
import { Canvas2D } from "@/components/Canvas2D";
import { Canvas3D } from "@/components/Canvas3D";
import { InteriorDesigner } from "@/components/InteriorDesigner";
import { HabitatModule, ModuleType, ViewMode, InteriorElementType, InteriorElement } from "@/types/habitat";
import { toast } from "sonner";

const Index = () => {
  const [modules, setModules] = useState<HabitatModule[]>([]);
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("top");

  const selectedModule = modules.find((m) => m.id === selectedModuleId) || null;

  const handleNewHabitat = () => {
    setModules([]);
    setSelectedModuleId(null);
  };

  const handleExport = () => {
    const data = JSON.stringify(modules, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `habitat-design-${Date.now()}.json`;
    a.click();
  };

  const handleAddModule = (type: ModuleType) => {
    const newModule: HabitatModule = {
      id: `module-${Date.now()}`,
      type,
      position: { x: Math.random() * 10 - 5, y: Math.random() * 10 - 5, z: 0 },
      dimensions:
        type === "cylinder"
          ? { radius: 2, height: 4 }
          : type === "dome"
          ? { radius: 3 }
          : type === "cube"
          ? { width: 3, length: 3, depth: 3 }
          : { radius: 1, height: 2 },
      rotation: 0,
      material: "aluminum",
      temperature: { min: 18, max: 24 },
      name: `${type.charAt(0).toUpperCase() + type.slice(1)} Module`,
      interiorElements: [],
      safetySystem: {
        fireSuppressionActive: true,
        emergencyOxygenUnits: 2,
        emergencyExits: 1,
        medicalBays: 0,
        airlocks: type === "connector" ? 1 : 0,
      },
    };

    setModules([...modules, newModule]);
    setSelectedModuleId(newModule.id);
    toast.success(`${newModule.name} added to habitat`);
  };

  const handleUpdateModule = (updatedModule: HabitatModule) => {
    setModules(modules.map((m) => (m.id === updatedModule.id ? updatedModule : m)));
  };

  const handleAddInteriorElement = (moduleId: string, elementType: InteriorElementType) => {
    const module = modules.find((m) => m.id === moduleId);
    if (!module) return;

    const newElement: InteriorElement = {
      id: `element-${Date.now()}`,
      type: elementType,
      position: { 
        x: (Math.random() - 0.5) * 2, 
        y: Math.random() * 2, 
        z: (Math.random() - 0.5) * 2 
      },
      rotation: Math.random() * Math.PI * 2,
      scale: 1,
    };

    const updatedModule: HabitatModule = {
      ...module,
      interiorElements: [...(module.interiorElements || []), newElement],
      safetySystem: {
        ...module.safetySystem!,
        fireSuppressionActive: elementType === "fire-extinguisher" ? true : module.safetySystem!.fireSuppressionActive,
        emergencyOxygenUnits: elementType === "oxygen-tank" 
          ? (module.safetySystem!.emergencyOxygenUnits || 0) + 1 
          : module.safetySystem!.emergencyOxygenUnits,
        emergencyExits: elementType === "emergency-exit"
          ? (module.safetySystem!.emergencyExits || 0) + 1
          : module.safetySystem!.emergencyExits,
        medicalBays: elementType === "medical-bay"
          ? (module.safetySystem!.medicalBays || 0) + 1
          : module.safetySystem!.medicalBays,
        airlocks: elementType === "airlock"
          ? (module.safetySystem!.airlocks || 0) + 1
          : module.safetySystem!.airlocks,
      },
    };

    handleUpdateModule(updatedModule);
    toast.success(`${elementType.replace('-', ' ')} added to ${module.name}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header onNewHabitat={handleNewHabitat} onExport={handleExport} />

      <div className="flex-1 flex flex-col">
        <div className="container mx-auto px-6 py-4">
          <ViewSwitcher currentView={viewMode} onViewChange={setViewMode} />
        </div>

        <div className="flex-1 flex gap-4 container mx-auto px-6 pb-4">
          <ShapePalette onSelectShape={handleAddModule} />

          <div className="flex-1">
            {viewMode === "3d" || viewMode === "interior" ? (
              <Canvas3D modules={modules} showInterior={viewMode === "interior"} />
            ) : (
              <Canvas2D
                modules={modules}
                viewMode={viewMode}
                selectedModuleId={selectedModuleId}
                onSelectModule={setSelectedModuleId}
                onUpdateModule={handleUpdateModule}
              />
            )}
          </div>

          <div className="space-y-4">
            <PropertiesPanel selectedModule={selectedModule} onUpdateModule={handleUpdateModule} />
            {(viewMode === "interior" || viewMode === "3d") && (
              <InteriorDesigner 
                selectedModule={selectedModule} 
                onAddInteriorElement={handleAddInteriorElement} 
              />
            )}
          </div>
        </div>
      </div>

      <CalculationsPanel modules={modules} />
    </div>
  );
};

export default Index;
