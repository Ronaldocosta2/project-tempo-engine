import { Button } from "@/components/ui/button";
import { Plus, LayoutDashboard } from "lucide-react";

interface HeaderProps {
  onNewProject?: () => void;
}

export const Header = ({ onNewProject }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container flex h-16 items-center justify-between px-8">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <LayoutDashboard className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              GanttFlow
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="default" onClick={onNewProject} className="shadow-primary">
            <Plus className="h-4 w-4 mr-2" />
            Novo Projeto
          </Button>
        </div>
      </div>
    </header>
  );
};
