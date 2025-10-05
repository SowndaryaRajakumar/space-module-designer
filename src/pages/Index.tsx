import { useState } from "react";
import { Header } from "@/components/Header";
import { ViewSwitcher } from "@/components/ViewSwitcher";
import { ShapePalette } from "@/components/ShapePalette";
import { PropertiesPanel } from "@/components/PropertiesPanel";
import { CalculationsPanel } from "@/components/CalculationsPanel";
import { Canvas2D } from "@/components/Canvas2D";
import { Canvas3D } from "@/components/Canvas3D";
import { HabitatModule, ModuleType, ViewMode } from "@/types/habitat";
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
    };

    setModules([...modules, newModule]);
    setSelectedModuleId(newModule.id);
    toast.success(`${newModule.name} added to habitat`);
  };

  const handleUpdateModule = (updatedModule: HabitatModule) => {
    setModules(modules.map((m) => (m.id === updatedModule.id ? updatedModule : m)));
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
            {viewMode === "3d" ? (
              <Canvas3D modules={modules} />
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

          <PropertiesPanel selectedModule={selectedModule} onUpdateModule={handleUpdateModule} />
        </div>
      </div>

      <CalculationsPanel modules={modules} />
    </div>
  );
};

export default Index;
