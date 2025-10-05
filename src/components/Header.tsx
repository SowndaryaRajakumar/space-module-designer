import { Button } from "@/components/ui/button";
import { Download, Plus, Rocket } from "lucide-react";
import { toast } from "sonner";

interface HeaderProps {
  onNewHabitat: () => void;
  onExport: () => void;
}

export const Header = ({ onNewHabitat, onExport }: HeaderProps) => {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/20 glow-primary">
              <Rocket className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-glow">Space Habitat Layout Creator</h1>
              <p className="text-sm text-muted-foreground">Design & Engineer Space Living Modules</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button
              onClick={() => {
                onNewHabitat();
                toast.success("New habitat workspace created");
              }}
              variant="outline"
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              New Habitat
            </Button>
            <Button
              onClick={() => {
                onExport();
                toast.success("Habitat design exported");
              }}
              className="gap-2 glow-primary"
            >
              <Download className="w-4 h-4" />
              Export Design
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
