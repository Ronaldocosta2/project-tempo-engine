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
        return "bg-green-500/10 text-green-400 border-green-500/20";
      case "at-risk":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
      case "delayed":
        return "bg-red-500/10 text-red-400 border-red-500/20";
      default:
        return "bg-slate-800 text-slate-400";
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
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-white">Visão Geral</h2>
          <p className="text-slate-400 max-w-3xl leading-relaxed">{project.description}</p>
        </div>
        {onEdit && (
          <Button
            variant="outline"
            size="sm"
            onClick={onEdit}
            className="border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
          >
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
          <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
            <Calendar className="h-5 w-5 text-purple-400" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Período</p>
            <p className="text-sm font-medium text-slate-200 mt-0.5">
              {new Date(project.start_date).toLocaleDateString("pt-BR")} - {new Date(project.end_date).toLocaleDateString("pt-BR")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
          <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
            <Users className="h-5 w-5 text-blue-400" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Equipe</p>
            <p className="text-sm font-medium text-slate-200 mt-0.5">{project.team_size} membros</p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
          <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
            <TrendingUp className="h-5 w-5 text-green-400" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Status</p>
            <Badge className={`${getStatusColor()} mt-0.5 border`}>
              {getStatusLabel()}
            </Badge>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-400">Progresso Geral</span>
          <span className="text-white font-medium">{project.progress}%</span>
        </div>
        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full bg-purple-600 transition-all duration-500"
            style={{ width: `${project.progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
