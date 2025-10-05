import { Button } from "@/components/ui/button";
import { ViewMode } from "@/types/habitat";
import { Box, Layers, Maximize2, View, Home, Map } from "lucide-react";

interface ViewSwitcherProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

export const ViewSwitcher = ({ currentView, onViewChange }: ViewSwitcherProps) => {
  const views: { mode: ViewMode; label: string; icon: React.ReactNode }[] = [
    { mode: "top", label: "Top View", icon: <Layers className="w-4 h-4" /> },
    { mode: "front", label: "Front View", icon: <View className="w-4 h-4" /> },
    { mode: "2d", label: "2D Layout", icon: <Maximize2 className="w-4 h-4" /> },
    { mode: "3d", label: "3D View", icon: <Box className="w-4 h-4" /> },
    { mode: "interior", label: "Interior View", icon: <Home className="w-4 h-4" /> },
    { mode: "navigation", label: "Navigation Map", icon: <Map className="w-4 h-4" /> },
  ];

  return (
    <div className="flex gap-2 p-2 bg-card/50 rounded-lg border border-border">
      {views.map((view) => (
        <Button
          key={view.mode}
          variant={currentView === view.mode ? "default" : "ghost"}
          size="sm"
          onClick={() => onViewChange(view.mode)}
          className={currentView === view.mode ? "glow-primary" : ""}
        >
          {view.icon}
          <span className="ml-2">{view.label}</span>
        </Button>
      ))}
    </div>
  );
};
