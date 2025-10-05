import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { HabitatModule, Material } from "@/types/habitat";
import { calculateModuleProperties } from "@/utils/calculations";
import { Settings } from "lucide-react";

interface PropertiesPanelProps {
  selectedModule: HabitatModule | null;
  onUpdateModule: (module: HabitatModule) => void;
}

export const PropertiesPanel = ({ selectedModule, onUpdateModule }: PropertiesPanelProps) => {
  if (!selectedModule) {
    return (
      <div className="w-80 flex items-center justify-center">
        <Card className="p-6 w-full">
          <div className="text-center text-muted-foreground">
            <Settings className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Select a module to view properties</p>
          </div>
        </Card>
      </div>
    );
  }

  const calculations = calculateModuleProperties(selectedModule);

  const updateDimension = (key: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    onUpdateModule({
      ...selectedModule,
      dimensions: { ...selectedModule.dimensions, [key]: numValue },
    });
  };

  const updateMaterial = (material: Material) => {
    onUpdateModule({ ...selectedModule, material });
  };

  return (
    <div className="w-80 space-y-4">
      <Card className="p-4">
        <h3 className="text-sm font-semibold text-primary mb-4 flex items-center gap-2">
          <Settings className="w-4 h-4" />
          MODULE PROPERTIES
        </h3>
        
        <div className="space-y-4">
          <div>
            <Label className="text-xs text-muted-foreground">Module Name</Label>
            <Input
              value={selectedModule.name}
              onChange={(e) => onUpdateModule({ ...selectedModule, name: e.target.value })}
              className="mt-1"
            />
          </div>

          <div>
            <Label className="text-xs text-muted-foreground">Type</Label>
            <div className="mt-1 px-3 py-2 bg-muted rounded-md text-sm font-mono capitalize">
              {selectedModule.type}
            </div>
          </div>

          <div>
            <Label className="text-xs text-muted-foreground">Material</Label>
            <Select value={selectedModule.material} onValueChange={(value) => updateMaterial(value as Material)}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="aluminum">Aluminum</SelectItem>
                <SelectItem value="titanium">Titanium</SelectItem>
                <SelectItem value="composite">Composite</SelectItem>
                <SelectItem value="carbon-fiber">Carbon Fiber</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3 pt-2 border-t border-border">
            <Label className="text-xs text-muted-foreground">Dimensions (meters)</Label>
            
            {selectedModule.dimensions.radius !== undefined && (
              <div>
                <Label className="text-xs">Radius</Label>
                <Input
                  type="number"
                  value={selectedModule.dimensions.radius}
                  onChange={(e) => updateDimension("radius", e.target.value)}
                  className="mt-1 font-mono"
                  step="0.1"
                />
              </div>
            )}
            
            {selectedModule.dimensions.height !== undefined && (
              <div>
                <Label className="text-xs">Height</Label>
                <Input
                  type="number"
                  value={selectedModule.dimensions.height}
                  onChange={(e) => updateDimension("height", e.target.value)}
                  className="mt-1 font-mono"
                  step="0.1"
                />
              </div>
            )}
            
            {selectedModule.dimensions.width !== undefined && (
              <div>
                <Label className="text-xs">Width</Label>
                <Input
                  type="number"
                  value={selectedModule.dimensions.width}
                  onChange={(e) => updateDimension("width", e.target.value)}
                  className="mt-1 font-mono"
                  step="0.1"
                />
              </div>
            )}
            
            {selectedModule.dimensions.length !== undefined && (
              <div>
                <Label className="text-xs">Length</Label>
                <Input
                  type="number"
                  value={selectedModule.dimensions.length}
                  onChange={(e) => updateDimension("length", e.target.value)}
                  className="mt-1 font-mono"
                  step="0.1"
                />
              </div>
            )}
          </div>

          <div className="pt-2 border-t border-border">
            <Label className="text-xs text-muted-foreground mb-2 block">Temperature Range (°C)</Label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs">Min</Label>
                <Input
                  type="number"
                  value={selectedModule.temperature.min}
                  onChange={(e) =>
                    onUpdateModule({
                      ...selectedModule,
                      temperature: { ...selectedModule.temperature, min: parseFloat(e.target.value) },
                    })
                  }
                  className="mt-1 font-mono"
                />
              </div>
              <div>
                <Label className="text-xs">Max</Label>
                <Input
                  type="number"
                  value={selectedModule.temperature.max}
                  onChange={(e) =>
                    onUpdateModule({
                      ...selectedModule,
                      temperature: { ...selectedModule.temperature, max: parseFloat(e.target.value) },
                    })
                  }
                  className="mt-1 font-mono"
                />
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-4 bg-primary/5 border-primary/30">
        <h3 className="text-sm font-semibold text-primary mb-3">CALCULATED VALUES</h3>
        <div className="space-y-2 font-mono text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Volume:</span>
            <span className="text-data-positive">{calculations.volume} m³</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Surface Area:</span>
            <span className="text-data-positive">{calculations.surfaceArea} m²</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Mass:</span>
            <span className="text-data-warning">{calculations.mass} kg</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Crew Cap.:</span>
            <span className="text-foreground">{calculations.crewCapacity}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Power Req.:</span>
            <span className="text-data-warning">{calculations.powerRequirement} kW</span>
          </div>
        </div>
      </Card>
    </div>
  );
};
