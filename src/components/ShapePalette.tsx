import { Card } from "@/components/ui/card";
import { ModuleType } from "@/types/habitat";
import { Box, Circle, Cylinder, Link } from "lucide-react";

interface ShapePaletteProps {
  onSelectShape: (type: ModuleType) => void;
}

export const ShapePalette = ({ onSelectShape }: ShapePaletteProps) => {
  const shapes: { type: ModuleType; label: string; icon: React.ReactNode; description: string }[] = [
    { type: "cylinder", label: "Cylinder", icon: <Cylinder className="w-8 h-8" />, description: "Living quarters" },
    { type: "dome", label: "Dome", icon: <Circle className="w-8 h-8" />, description: "Observatory" },
    { type: "cube", label: "Cube", icon: <Box className="w-8 h-8" />, description: "Lab module" },
    { type: "connector", label: "Connector", icon: <Link className="w-8 h-8" />, description: "Passageway" },
  ];

  return (
    <div className="w-64 space-y-2">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider px-2">
        Module Palette
      </h3>
      <div className="space-y-2">
        {shapes.map((shape) => (
          <Card
            key={shape.type}
            className="p-4 cursor-pointer hover:bg-primary/10 hover:border-primary transition-all hover:glow-primary"
            onClick={() => onSelectShape(shape.type)}
          >
            <div className="flex items-center gap-3">
              <div className="text-primary">{shape.icon}</div>
              <div>
                <div className="font-semibold">{shape.label}</div>
                <div className="text-xs text-muted-foreground">{shape.description}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>
      <div className="p-3 bg-muted/50 rounded-lg border border-border mt-4">
        <p className="text-xs text-muted-foreground">
          Click on a module type to add it to the canvas. Drag modules to reposition them.
        </p>
      </div>
    </div>
  );
};
