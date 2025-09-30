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
    <Card className="group relative hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border-border/50 bg-card/80 backdrop-blur-sm hover:-translate-y-1">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="relative p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
              {name}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
          </div>
          <Button variant="ghost" size="icon" className="ml-2 hover:bg-muted/50">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm p-3 rounded-lg bg-muted/30">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Calendar className="h-4 w-4 text-primary" />
            </div>
            <span className="text-muted-foreground font-medium">{startDate} - {endDate}</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-accent" />
              </div>
              <span className="text-muted-foreground font-medium">{tasksCount} tarefas</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center">
                <Users className="h-4 w-4 text-secondary" />
              </div>
              <span className="text-muted-foreground font-medium">{teamSize} pessoas</span>
            </div>
          </div>

          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground font-medium">Progresso</span>
              <span className="font-bold text-foreground text-base">{progress}%</span>
            </div>
            <div className="relative h-2.5 bg-muted/50 rounded-full overflow-hidden shadow-sm">
              <div
                className="h-full bg-gradient-primary transition-all duration-500 shadow-primary"
                style={{ width: `${progress}%` }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-border/50">
            <Badge className={`${statusColors[status]} shadow-sm px-3 py-1.5 font-semibold`} variant="outline">
              {statusLabels[status]}
            </Badge>
            <Button
              variant="default"
              size="sm"
              onClick={() => navigate(`/project/${id}`)}
              className="shadow-md hover:shadow-lg transition-all hover:scale-105"
            >
              Ver Projeto
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};
