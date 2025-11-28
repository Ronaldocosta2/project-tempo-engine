import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle2, Clock, TrendingUp } from "lucide-react";
import { ProjectRisk } from "@/hooks/useProjectRisks";
import { ProjectIssue } from "@/hooks/useProjectIssues";

interface ProjectHealthPanelProps {
  risks: ProjectRisk[];
  issues: ProjectIssue[];
  tasksCount: number;
  criticalTasksCount: number;
}

export function ProjectHealthPanel({
  risks,
  issues,
  tasksCount,
  criticalTasksCount,
}: ProjectHealthPanelProps) {
  const activeRisks = risks.filter((r) => r.status === "active");
  const highRisks = activeRisks.filter((r) => r.probability * r.impact >= 15);
  const openIssues = issues.filter((i) => i.status === "open" || i.status === "in-progress");
  const criticalIssues = openIssues.filter((i) => i.severity === "critical" || i.severity === "high");

  const getHealthStatus = () => {
    if (criticalIssues.length > 0 || highRisks.length > 2) {
      return { label: "Crítico", color: "bg-red-500/10 text-red-400 border-red-500/20", icon: AlertTriangle, iconColor: "text-red-400" };
    }
    if (openIssues.length > 3 || highRisks.length > 0) {
      return { label: "Atenção", color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20", icon: Clock, iconColor: "text-yellow-400" };
    }
    return { label: "Saudável", color: "bg-green-500/10 text-green-400 border-green-500/20", icon: CheckCircle2, iconColor: "text-green-400" };
  };

  const health = getHealthStatus();
  const HealthIcon = health.icon;

  return (
    <Card className="border-white/5 bg-white/5 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium text-white flex items-center gap-2">
          <HealthIcon className={`h-5 w-5 ${health.iconColor}`} />
          Saúde do Projeto
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5">
          <span className="text-sm font-medium text-slate-300">Status Geral</span>
          <Badge className={`${health.color} border`}>{health.label}</Badge>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1 p-3 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-400" />
              <span className="text-xs font-medium text-slate-400">Riscos Ativos</span>
            </div>
            <p className="text-2xl font-bold text-white">{activeRisks.length}</p>
            <p className="text-xs text-slate-500">
              {highRisks.length} de alto impacto
            </p>
          </div>

          <div className="space-y-1 p-3 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-400" />
              <span className="text-xs font-medium text-slate-400">Problemas</span>
            </div>
            <p className="text-2xl font-bold text-white">{openIssues.length}</p>
            <p className="text-xs text-slate-500">
              {criticalIssues.length} críticos
            </p>
          </div>

          <div className="space-y-1 p-3 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-400" />
              <span className="text-xs font-medium text-slate-400">Tarefas</span>
            </div>
            <p className="text-2xl font-bold text-white">{tasksCount}</p>
          </div>

          <div className="space-y-1 p-3 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-purple-400" />
              <span className="text-xs font-medium text-slate-400">Críticas</span>
            </div>
            <p className="text-2xl font-bold text-white">{criticalTasksCount}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
