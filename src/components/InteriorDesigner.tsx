import { HabitatModule, InteriorElementType } from "@/types/habitat";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Bed, 
  UtensilsCrossed, 
  Monitor, 
  DoorOpen, 
  Heart, 
  Package, 
  Shield,
  Flame,
  LogOut,
  Wind
} from "lucide-react";

interface InteriorDesignerProps {
  selectedModule: HabitatModule | null;
  onAddInteriorElement: (moduleId: string, elementType: InteriorElementType) => void;
}

const interiorElements: Array<{ type: InteriorElementType; icon: any; label: string; color: string }> = [
  { type: "sleeping-pod", icon: Bed, label: "Sleeping Pod", color: "text-blue-400" },
  { type: "galley", icon: UtensilsCrossed, label: "Galley/Kitchen", color: "text-yellow-400" },
  { type: "workstation", icon: Monitor, label: "Workstation", color: "text-green-400" },
  { type: "airlock", icon: DoorOpen, label: "Airlock", color: "text-purple-400" },
  { type: "medical-bay", icon: Heart, label: "Medical Bay", color: "text-red-400" },
  { type: "storage", icon: Package, label: "Storage Unit", color: "text-gray-400" },
  { type: "handrail", icon: Shield, label: "Handrail", color: "text-cyan-400" },
  { type: "fire-extinguisher", icon: Flame, label: "Fire Extinguisher", color: "text-orange-400" },
  { type: "emergency-exit", icon: LogOut, label: "Emergency Exit", color: "text-red-500" },
  { type: "oxygen-tank", icon: Wind, label: "O₂ Emergency Tank", color: "text-blue-500" },
];

export const InteriorDesigner = ({ selectedModule, onAddInteriorElement }: InteriorDesignerProps) => {
  if (!selectedModule) {
    return (
      <Card className="p-4 bg-card border-border">
        <p className="text-muted-foreground text-sm">Select a module to design its interior</p>
      </Card>
    );
  }

  const interiorCount = selectedModule.interiorElements?.length || 0;

  return (
    <Card className="p-4 bg-card border-border space-y-4">
      <div>
        <h3 className="text-lg font-bold text-foreground mb-2">Interior Design</h3>
        <p className="text-sm text-muted-foreground">
          {selectedModule.name} - {interiorCount} element{interiorCount !== 1 ? 's' : ''} added
        </p>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-semibold text-foreground">Living Quarters</h4>
        <div className="grid grid-cols-2 gap-2">
          {interiorElements.slice(0, 3).map(({ type, icon: Icon, label, color }) => (
            <Button
              key={type}
              onClick={() => onAddInteriorElement(selectedModule.id, type)}
              variant="outline"
              size="sm"
              className="justify-start gap-2 h-auto py-2 hover:border-accent"
            >
              <Icon className={`h-4 w-4 ${color}`} />
              <span className="text-xs">{label}</span>
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-semibold text-foreground">Critical Systems</h4>
        <div className="grid grid-cols-2 gap-2">
          {interiorElements.slice(3, 6).map(({ type, icon: Icon, label, color }) => (
            <Button
              key={type}
              onClick={() => onAddInteriorElement(selectedModule.id, type)}
              variant="outline"
              size="sm"
              className="justify-start gap-2 h-auto py-2 hover:border-accent"
            >
              <Icon className={`h-4 w-4 ${color}`} />
              <span className="text-xs">{label}</span>
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-semibold text-red-400">Emergency & Safety</h4>
        <div className="grid grid-cols-2 gap-2">
          {interiorElements.slice(6).map(({ type, icon: Icon, label, color }) => (
            <Button
              key={type}
              onClick={() => onAddInteriorElement(selectedModule.id, type)}
              variant="outline"
              size="sm"
              className="justify-start gap-2 h-auto py-2 hover:border-red-500/30"
            >
              <Icon className={`h-4 w-4 ${color}`} />
              <span className="text-xs">{label}</span>
            </Button>
          ))}
        </div>
      </div>

      <div className="pt-2 border-t border-border">
        <h4 className="text-sm font-semibold text-foreground mb-2">Safety Status</h4>
        <div className="space-y-1 text-xs text-muted-foreground">
          <div className="flex justify-between">
            <span>Fire Suppression:</span>
            <span className={selectedModule.safetySystem?.fireSuppressionActive ? "text-green-400" : "text-red-400"}>
              {selectedModule.safetySystem?.fireSuppressionActive ? "Active" : "Inactive"}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Emergency O₂:</span>
            <span className="text-cyan-400">{selectedModule.safetySystem?.emergencyOxygenUnits || 0} units</span>
          </div>
          <div className="flex justify-between">
            <span>Emergency Exits:</span>
            <span className="text-orange-400">{selectedModule.safetySystem?.emergencyExits || 0}</span>
          </div>
          <div className="flex justify-between">
            <span>Medical Bays:</span>
            <span className="text-red-400">{selectedModule.safetySystem?.medicalBays || 0}</span>
          </div>
          <div className="flex justify-between">
            <span>Airlocks:</span>
            <span className="text-purple-400">{selectedModule.safetySystem?.airlocks || 0}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
