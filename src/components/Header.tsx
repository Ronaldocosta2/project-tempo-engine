import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, LayoutDashboard } from "lucide-react";
import { ProjectFormDialog } from "@/components/ProjectFormDialog";
interface HeaderProps {
  onNewProject?: () => void;
}

export const Header = ({ onNewProject }: HeaderProps) => {
  const [open, setOpen] = useState(false);
  
  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container flex h-14 items-center justify-between px-6">
          <Link to="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="h-7 w-7 rounded-lg bg-gradient-primary flex items-center justify-center">
              <LayoutDashboard className="h-4 w-4 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              GanttFlow
            </h1>
          </Link>

          <Button
            variant="default"
            size="sm"
            onClick={() => (onNewProject ? onNewProject() : setOpen(true))}
            className="shadow-primary h-9"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            Novo Projeto
          </Button>
        </div>
      </header>

      {/* Fallback dialog when no handler is provided by the page */}
      {!onNewProject && (
        <ProjectFormDialog open={open} onOpenChange={setOpen} />
      )}
    </>
  );
};
