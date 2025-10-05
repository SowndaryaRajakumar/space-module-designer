import { HabitatModule } from "@/types/habitat";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface NavigationMapProps {
  modules: HabitatModule[];
}

export const NavigationMap = ({ modules }: NavigationMapProps) => {
  const getModuleConnections = () => {
    return modules.map((module, index) => {
      const nextModule = modules[index + 1];
      return { from: module, to: nextModule };
    }).filter(conn => conn.to);
  };

  const connections = getModuleConnections();

  return (
    <div className="w-full h-full bg-canvas-bg rounded-lg border border-border p-6 overflow-auto">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">Habitat Navigation Map</h2>
          <Badge variant="outline" className="text-primary">
            {modules.length} Module{modules.length !== 1 ? 's' : ''}
          </Badge>
        </div>

        <div className="space-y-4">
          {modules.map((module, index) => (
            <div key={module.id} className="space-y-2">
              <Card className="p-4 bg-card/50 border-primary/30 hover:border-primary/60 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="default" className="bg-primary/20 text-primary">
                        Module {index + 1}
                      </Badge>
                      <h3 className="font-semibold text-lg">{module.name}</h3>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Type:</span>
                        <span className="ml-2 text-foreground capitalize">{module.type}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Material:</span>
                        <span className="ml-2 text-foreground capitalize">{module.material}</span>
                      </div>
                    </div>

                    {module.interiorElements && module.interiorElements.length > 0 && (
                      <div className="pt-2 border-t border-border/50">
                        <span className="text-sm text-muted-foreground">Interior Elements:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {module.interiorElements.map((element) => (
                            <Badge key={element.id} variant="outline" className="text-xs">
                              {element.type.replace('-', ' ')}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {module.safetySystem && (
                      <div className="pt-2 border-t border-border/50">
                        <span className="text-sm text-muted-foreground">Safety Systems:</span>
                        <div className="grid grid-cols-2 gap-2 mt-1 text-xs">
                          <div className="flex items-center gap-1">
                            <div className={`w-2 h-2 rounded-full ${module.safetySystem.fireSuppressionActive ? 'bg-green-500' : 'bg-red-500'}`} />
                            <span>Fire Suppression</span>
                          </div>
                          <div>Emergency Exits: {module.safetySystem.emergencyExits}</div>
                          <div>Oxygen Units: {module.safetySystem.emergencyOxygenUnits}</div>
                          <div>Medical Bays: {module.safetySystem.medicalBays}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Card>

              {connections[index] && (
                <div className="flex items-center justify-center py-2">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-0.5 bg-primary/50" />
                    <span className="text-xs text-muted-foreground">Connected via pathway</span>
                    <div className="h-8 w-0.5 bg-primary/50" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {modules.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p>No modules added yet. Add modules to see the navigation map.</p>
          </div>
        )}
      </div>
    </div>
  );
};
