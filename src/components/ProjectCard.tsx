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
    <Card className="group relative hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden border-border/50 bg-card/80 backdrop-blur-sm hover:-translate-y-0.5">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="relative p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-foreground mb-1 group-hover:text-primary transition-colors line-clamp-1">
              {name}
            </h3>
            <p className="text-xs text-muted-foreground line-clamp-2">{description}</p>
          </div>
          <Button variant="ghost" size="icon" className="ml-2 h-7 w-7 hover:bg-muted/50">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-1.5 text-xs p-2 rounded-md bg-muted/30">
            <Calendar className="h-3.5 w-3.5 text-primary flex-shrink-0" />
            <span className="text-muted-foreground font-medium truncate">{startDate} - {endDate}</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs">
              <TrendingUp className="h-3.5 w-3.5 text-accent flex-shrink-0" />
              <span className="text-muted-foreground font-medium">{tasksCount}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <Users className="h-3.5 w-3.5 text-secondary flex-shrink-0" />
              <span className="text-muted-foreground font-medium">{teamSize}</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Progresso</span>
              <span className="font-bold text-foreground">{progress}%</span>
            </div>
            <div className="relative h-2 bg-muted/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-primary transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-border/50">
            <Badge className={`${statusColors[status]} px-2 py-0.5 text-xs font-semibold`} variant="outline">
              {statusLabels[status]}
            </Badge>
            <Button
              variant="default"
              size="sm"
              onClick={() => navigate(`/project/${id}`)}
              className="h-7 px-3 text-xs"
            >
              Abrir
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};
