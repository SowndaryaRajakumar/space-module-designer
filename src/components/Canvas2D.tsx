import { useEffect, useRef, useState } from "react";
import { Canvas as FabricCanvas, Circle, Rect, Object as FabricObject } from "fabric";
import { HabitatModule, ModuleType, ViewMode } from "@/types/habitat";
import { toast } from "sonner";
import { ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "./ui/button";

interface Canvas2DProps {
  modules: HabitatModule[];
  viewMode: ViewMode;
  selectedModuleId: string | null;
  onSelectModule: (id: string | null) => void;
  onUpdateModule: (module: HabitatModule) => void;
}

export const Canvas2D = ({
  modules,
  viewMode,
  selectedModuleId,
  onSelectModule,
  onUpdateModule,
}: Canvas2DProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: 1200,
      height: 600,
      backgroundColor: "hsl(220, 25%, 10%)",
    });

    setFabricCanvas(canvas);
    toast.success("Canvas ready! Add modules from the palette");

    return () => {
      canvas.dispose();
    };
  }, []);

  useEffect(() => {
    if (!fabricCanvas) return;

    // Clear canvas
    fabricCanvas.clear();
    fabricCanvas.backgroundColor = "hsl(220, 25%, 10%)";

    // Draw grid
    const gridSize = 50;
    for (let i = 0; i < fabricCanvas.width! / gridSize; i++) {
      fabricCanvas.add(
        new FabricObject({
          left: i * gridSize,
          top: 0,
          width: 1,
          height: fabricCanvas.height,
          fill: "hsl(220, 20%, 20%)",
          selectable: false,
          evented: false,
        } as any)
      );
    }
    for (let i = 0; i < fabricCanvas.height! / gridSize; i++) {
      fabricCanvas.add(
        new FabricObject({
          left: 0,
          top: i * gridSize,
          width: fabricCanvas.width,
          height: 1,
          fill: "hsl(220, 20%, 20%)",
          selectable: false,
          evented: false,
        } as any)
      );
    }

    // Draw modules
    modules.forEach((module) => {
      let shape: FabricObject | null = null;
      const scale = 30; // pixels per meter

      switch (module.type) {
        case "cylinder":
        case "connector": {
          const radius = (module.dimensions.radius || 2) * scale;
          shape = new Circle({
            left: module.position.x * scale + 200,
            top: module.position.y * scale + 200,
            radius: radius,
            fill: "hsl(190, 95%, 55%, 0.3)",
            stroke: "hsl(190, 95%, 55%)",
            strokeWidth: 2,
          });
          break;
        }
        case "dome": {
          const radius = (module.dimensions.radius || 3) * scale;
          shape = new Circle({
            left: module.position.x * scale + 200,
            top: module.position.y * scale + 200,
            radius: radius,
            fill: "hsl(270, 70%, 60%, 0.3)",
            stroke: "hsl(270, 70%, 60%)",
            strokeWidth: 2,
          });
          break;
        }
        case "cube": {
          const size = (module.dimensions.width || 3) * scale;
          shape = new Rect({
            left: module.position.x * scale + 200,
            top: module.position.y * scale + 200,
            width: size,
            height: size,
            fill: "hsl(140, 85%, 55%, 0.3)",
            stroke: "hsl(140, 85%, 55%)",
            strokeWidth: 2,
          });
          break;
        }
      }

      if (shape) {
        shape.set({ data: { moduleId: module.id } } as any);
        fabricCanvas.add(shape);
      }
    });

    // Handle selection
    fabricCanvas.on("selection:created", (e) => {
      const selected = e.selected?.[0];
      if (selected) {
        const moduleId = (selected as any).data?.moduleId;
        if (moduleId) onSelectModule(moduleId);
      }
    });

    fabricCanvas.on("selection:updated", (e) => {
      const selected = e.selected?.[0];
      if (selected) {
        const moduleId = (selected as any).data?.moduleId;
        if (moduleId) onSelectModule(moduleId);
      }
    });

    fabricCanvas.on("selection:cleared", () => {
      onSelectModule(null);
    });

    fabricCanvas.renderAll();
  }, [fabricCanvas, modules, viewMode]);

  const handleZoom = (delta: number) => {
    const newZoom = Math.max(0.5, Math.min(2, zoom + delta));
    setZoom(newZoom);
    if (fabricCanvas) {
      fabricCanvas.setZoom(newZoom);
      fabricCanvas.renderAll();
    }
  };

  return (
    <div className="relative flex-1">
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <Button size="icon" variant="secondary" onClick={() => handleZoom(0.1)}>
          <ZoomIn className="w-4 h-4" />
        </Button>
        <Button size="icon" variant="secondary" onClick={() => handleZoom(-0.1)}>
          <ZoomOut className="w-4 h-4" />
        </Button>
      </div>
      <div className="w-full h-full flex items-center justify-center bg-canvas-bg grid-pattern rounded-lg border border-border">
        <canvas ref={canvasRef} className="shadow-2xl" />
      </div>
    </div>
  );
};
