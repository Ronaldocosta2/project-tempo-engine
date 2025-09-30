import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Users, TrendingUp, MoreVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ProjectCardProps {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  progress: number;
  tasksCount: number;
  teamSize: number;
  status: "on-track" | "at-risk" | "delayed";
}

export const ProjectCard = ({
  id,
  name,
  description,
  startDate,
  endDate,
  progress,
  tasksCount,
  teamSize,
  status,
}: ProjectCardProps) => {
  const navigate = useNavigate();

  const statusColors = {
    "on-track": "bg-success-light text-success border-success/20",
    "at-risk": "bg-warning-light text-warning border-warning/20",
    delayed: "bg-critical-light text-critical border-critical/20",
  };

  const statusLabels = {
    "on-track": "No Prazo",
    "at-risk": "Em Risco",
    delayed: "Atrasado",
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden border-2 hover:border-primary/30">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
              {name}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
          </div>
          <Button variant="ghost" size="icon" className="ml-2">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{startDate} - {endDate}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              <span>{tasksCount} tarefas</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{teamSize} pessoas</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progresso</span>
              <span className="font-semibold text-foreground">{progress}%</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-primary transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <Badge className={statusColors[status]} variant="outline">
              {statusLabels[status]}
            </Badge>
            <Button
              variant="default"
              size="sm"
              onClick={() => navigate(`/project/${id}`)}
              className="shadow-primary"
            >
              Ver Gantt
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};
