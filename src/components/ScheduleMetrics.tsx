import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Calendar, TrendingUp, Activity } from "lucide-react";
import { useSchedulingEngine } from "@/hooks/useSchedulingEngine";
import { toast } from "sonner";

interface ScheduleMetricsProps {
  projectId: string;
  onRecalculate?: () => void;
}

export const ScheduleMetrics = ({ projectId, onRecalculate }: ScheduleMetricsProps) => {
  const { recalculateSchedule, runMonteCarloSimulation } = useSchedulingEngine();
  const [isRecalculating, setIsRecalculating] = useState(false);
  const [metrics, setMetrics] = useState<{
    projectEndDate: string;
    criticalTaskCount: number;
    bottleneckCount: number;
    p50Date?: string;
    p80Date?: string;
  } | null>(null);

  const handleRecalculate = async (options?: { silent?: boolean }) => {
    const silent = !!options?.silent;
    if (!silent) setIsRecalculating(true);
    try {
      const result = await recalculateSchedule(projectId);
      const simulation = await runMonteCarloSimulation(projectId, 1000);

      setMetrics({
        projectEndDate: result.projectEndDate,
        criticalTaskCount: result.criticalPath.length,
        bottleneckCount: result.bottlenecks.length,
        p50Date: simulation.p50,
        p80Date: simulation.p80,
      });

      if (!silent) {
        toast.success("Cronograma recalculado com sucesso!");
        onRecalculate?.();
      }
    } catch (error) {
      if (!silent) toast.error("Erro ao recalcular cronograma");
      console.error(error);
    } finally {
      if (!silent) setIsRecalculating(false);
    }
  };

  useEffect(() => {
    // Recalcular automaticamente ao montar o componente sem acionar callbacks/toasts
    handleRecalculate({ silent: true });
  }, [projectId]);

  if (!metrics) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Métricas de Agendamento</h3>
        <Button 
          onClick={() => handleRecalculate()} 
          disabled={isRecalculating}
          size="sm"
        >
          <Activity className="h-4 w-4 mr-2" />
          {isRecalculating ? "Recalculando..." : "Recalcular"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Data Final Prevista
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Date(metrics.projectEndDate).toLocaleDateString("pt-BR")}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Data mais provável (P50)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Previsão Segura (P80)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.p80Date
                ? new Date(metrics.p80Date).toLocaleDateString("pt-BR")
                : "N/A"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              80% de confiabilidade
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Tarefas Críticas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {metrics.criticalTaskCount}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Folga = 0 dias
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Gargalos Iminentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">
              {metrics.bottleneckCount}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Folga {"<"} 2 dias
            </p>
          </CardContent>
        </Card>
      </div>

      {metrics.p50Date && metrics.p80Date && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-4">
            <div className="flex items-start gap-3">
              <TrendingUp className="h-5 w-5 text-primary mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium">Política de Compromisso</p>
                <div className="text-sm text-muted-foreground">
                  Prazo <Badge variant="outline">Agressivo</Badge>:{" "}
                  {new Date(metrics.p50Date).toLocaleDateString("pt-BR")} (P50) |
                  Prazo <Badge variant="secondary">Seguro</Badge>:{" "}
                  {new Date(metrics.p80Date).toLocaleDateString("pt-BR")} (P80)
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
