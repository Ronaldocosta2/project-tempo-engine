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
      return { label: "Crítico", color: "bg-critical-light text-critical border-critical/20", icon: AlertTriangle };
    }
    if (openIssues.length > 3 || highRisks.length > 0) {
      return { label: "Atenção", color: "bg-warning-light text-warning border-warning/20", icon: Clock };
    }
    return { label: "Saudável", color: "bg-success-light text-success border-success/20", icon: CheckCircle2 };
  };

  const health = getHealthStatus();
  const HealthIcon = health.icon;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HealthIcon className="h-5 w-5" />
          Saúde do Projeto
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Status Geral</span>
          <Badge className={health.color}>{health.label}</Badge>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-critical" />
              <span className="text-sm font-medium">Riscos Ativos</span>
            </div>
            <p className="text-2xl font-bold">{activeRisks.length}</p>
            <p className="text-xs text-muted-foreground">
              {highRisks.length} de alto impacto
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-warning" />
              <span className="text-sm font-medium">Problemas Abertos</span>
            </div>
            <p className="text-2xl font-bold">{openIssues.length}</p>
            <p className="text-xs text-muted-foreground">
              {criticalIssues.length} críticos
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Tarefas Totais</span>
            </div>
            <p className="text-2xl font-bold">{tasksCount}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-critical" />
              <span className="text-sm font-medium">Tarefas Críticas</span>
            </div>
            <p className="text-2xl font-bold">{criticalTasksCount}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
