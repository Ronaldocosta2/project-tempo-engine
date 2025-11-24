import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle2, 
  Clock, 
  Circle, 
  AlertTriangle, 
  TrendingUp,
  Calendar,
  AlertCircle
} from "lucide-react";
import { ProjectStats } from "@/hooks/useProjectStats";
import { Task } from "@/hooks/useTasks";

interface ProjectDashboardProps {
  stats: ProjectStats;
  projectName: string;
}

export const ProjectDashboard = ({ stats, projectName }: ProjectDashboardProps) => {
  const getStatusColor = (status: Task["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-500/20 text-green-700 dark:text-green-400";
      case "in-progress":
        return "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400";
      case "not-started":
        return "bg-gray-500/20 text-gray-700 dark:text-gray-400";
      default:
        return "bg-gray-500/20 text-gray-700 dark:text-gray-400";
    }
  };

  const getDelayColor = (delay: number) => {
    if (delay === 0) return "text-green-600 dark:text-green-400";
    if (delay <= 3) return "text-yellow-600 dark:text-yellow-400";
    if (delay <= 7) return "text-orange-600 dark:text-orange-400";
    return "text-red-600 dark:text-red-400";
  };

  return (
    <div className="space-y-6">
      {/* Header com título e percentual geral */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">{projectName}</h2>
          <p className="text-muted-foreground">Dashboard do Projeto</p>
        </div>
        <div className="text-right">
          <div className="text-4xl font-bold text-primary">{stats.completionPercentage}%</div>
          <p className="text-sm text-muted-foreground">Concluído</p>
        </div>
      </div>

      {/* Barra de progresso geral */}
      <Card className="p-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium">Progresso Geral</span>
            <span className="text-muted-foreground">
              {stats.completedTasks} de {stats.totalTasks} tarefas
            </span>
          </div>
          <Progress value={stats.completionPercentage} className="h-3" />
        </div>
      </Card>

      {/* Cards de resumo */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.completedTasks}</p>
              <p className="text-sm text-muted-foreground">Concluídas</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-500/10 rounded-lg">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.inProgressTasks}</p>
              <p className="text-sm text-muted-foreground">Em Andamento</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-500/10 rounded-lg">
              <Circle className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.notStartedTasks}</p>
              <p className="text-sm text-muted-foreground">Não Iniciadas</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500/10 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.delayedTasks}</p>
              <p className="text-sm text-muted-foreground">Atrasadas</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Métricas adicionais e alertas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Métricas */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Métricas Importantes
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Tarefas Críticas</span>
              <Badge variant="destructive">{stats.criticalTasks}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Atraso Médio</span>
              <span className={`font-semibold ${getDelayColor(stats.averageDelay)}`}>
                {stats.averageDelay} {stats.averageDelay === 1 ? 'dia' : 'dias'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Total de Tarefas</span>
              <span className="font-semibold">{stats.totalTasks}</span>
            </div>
          </div>
        </Card>

        {/* Próximas Entregas */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Próximas Entregas (7 dias)
          </h3>
          <div className="space-y-3">
            {stats.upcomingDeadlines.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhuma entrega próxima</p>
            ) : (
              stats.upcomingDeadlines.map((task) => (
                <div key={task.id} className="flex justify-between items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{task.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(task.end_date).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <Badge className={getStatusColor(task.status)} variant="secondary">
                    {task.status === "in-progress" ? "Em Andamento" : "Não Iniciada"}
                  </Badge>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Tarefas Mais Atrasadas */}
        {stats.mostDelayedTasks.length > 0 && (
          <Card className="p-6 md:col-span-2">
            <h3 className="font-semibold mb-4 flex items-center gap-2 text-red-600 dark:text-red-400">
              <AlertCircle className="h-5 w-5" />
              Atenção: Tarefas Mais Atrasadas
            </h3>
            <div className="space-y-3">
              {stats.mostDelayedTasks.map((task) => {
                const delay = new Date().getTime() - new Date(task.end_date).getTime();
                const daysDelay = Math.ceil(delay / (1000 * 60 * 60 * 24));
                
                return (
                  <div key={task.id} className="flex justify-between items-center p-3 bg-red-500/5 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{task.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Previsto: {new Date(task.end_date).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <Badge variant="destructive" className="shrink-0">
                      {daysDelay} {daysDelay === 1 ? 'dia' : 'dias'} de atraso
                    </Badge>
                  </div>
                );
              })}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
