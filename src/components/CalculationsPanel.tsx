import { Card } from "@/components/ui/card";
import { HabitatModule } from "@/types/habitat";
import { calculateTotalStats } from "@/utils/calculations";
import { Activity, Database, Users, Zap } from "lucide-react";

interface CalculationsPanelProps {
  modules: HabitatModule[];
}

export const CalculationsPanel = ({ modules }: CalculationsPanelProps) => {
  const totals = calculateTotalStats(modules);

  const stats = [
    { label: "Total Volume", value: `${totals.volume} m³`, icon: <Database className="w-5 h-5" />, color: "text-data-positive" },
    { label: "Surface Area", value: `${totals.surfaceArea} m²`, icon: <Activity className="w-5 h-5" />, color: "text-data-positive" },
    { label: "Total Mass", value: `${totals.mass} kg`, icon: <Activity className="w-5 h-5" />, color: "text-data-warning" },
    { label: "Crew Capacity", value: `${totals.crewCapacity} persons`, icon: <Users className="w-5 h-5" />, color: "text-foreground" },
    { label: "Power Required", value: `${totals.powerRequirement} kW`, icon: <Zap className="w-5 h-5" />, color: "text-data-warning" },
  ];

  return (
    <div className="border-t border-border bg-card/30 backdrop-blur-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Habitat Statistics
          </h3>
          <div className="flex gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="px-4 py-2 bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className={stat.color}>{stat.icon}</div>
                  <div>
                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                    <div className={`text-sm font-mono font-semibold ${stat.color}`}>{stat.value}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
