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
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-2xl">{project.name}</CardTitle>
            <p className="text-muted-foreground">{project.description}</p>
          </div>
          {onEdit && (
            <Button variant="outline" size="sm" onClick={onEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Período</p>
              <p className="text-sm text-muted-foreground">
                {new Date(project.start_date).toLocaleDateString("pt-BR")} até{" "}
                {new Date(project.end_date).toLocaleDateString("pt-BR")}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Users className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Equipe</p>
              <p className="text-sm text-muted-foreground">{project.team_size} pessoas</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <TrendingUp className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Status</p>
              <Badge className={getStatusColor()}>{getStatusLabel()}</Badge>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Progresso Geral</span>
            <span className="text-sm font-bold">{project.progress}%</span>
          </div>
          <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
