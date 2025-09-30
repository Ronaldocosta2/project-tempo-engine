import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Calendar, TrendingUp, Edit } from "lucide-react";
import { Project } from "@/hooks/useProjects";

interface ProjectOverviewProps {
  project: Project;
  onEdit?: () => void;
}

export function ProjectOverview({ project, onEdit }: ProjectOverviewProps) {
  const getStatusColor = () => {
    switch (project.status) {
      case "on-track":
        return "bg-success-light text-success border-success/20";
      case "at-risk":
        return "bg-warning-light text-warning border-warning/20";
      case "delayed":
        return "bg-critical-light text-critical border-critical/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusLabel = () => {
    switch (project.status) {
      case "on-track":
        return "No Prazo";
      case "at-risk":
        return "Em Risco";
      case "delayed":
        return "Atrasado";
      case "completed":
        return "Concluído";
      default:
        return project.status;
    }
  };

  return (
    <Card className="overflow-hidden shadow-xl border-border/50 bg-card/80 backdrop-blur-sm hover:shadow-2xl transition-all">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-primary opacity-90" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMwLTkuOTQtOC4wNi0xOC0xOC0xOCIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjEiIG9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] opacity-10" />
        <CardHeader className="relative">
          <div className="flex items-start justify-between">
            <div className="flex-1 space-y-2">
              <CardTitle className="text-3xl font-bold text-white">{project.name}</CardTitle>
              <p className="text-white/90 text-base">{project.description}</p>
            </div>
            {onEdit && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onEdit}
                className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm"
              >
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Button>
            )}
          </div>
        </CardHeader>
      </div>
      <CardContent className="pt-8 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-all hover:scale-105">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Período</p>
              <p className="text-sm font-semibold text-foreground mt-1">
                {new Date(project.start_date).toLocaleDateString("pt-BR")} até{" "}
                {new Date(project.end_date).toLocaleDateString("pt-BR")}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-all hover:scale-105">
            <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center">
              <Users className="h-6 w-6 text-secondary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Equipe</p>
              <p className="text-sm font-semibold text-foreground mt-1">{project.team_size} pessoas</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-all hover:scale-105">
            <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Status</p>
              <Badge className={`${getStatusColor()} mt-1 px-3 py-1 font-semibold shadow-sm`}>
                {getStatusLabel()}
              </Badge>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-border/50">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-foreground uppercase tracking-wider">Progresso Geral</span>
            <span className="text-2xl font-bold text-foreground">{project.progress}%</span>
          </div>
          <div className="relative h-3 bg-muted/50 rounded-full overflow-hidden shadow-sm">
            <div
              className="h-full bg-gradient-primary transition-all duration-500 shadow-primary"
              style={{ width: `${project.progress}%` }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
