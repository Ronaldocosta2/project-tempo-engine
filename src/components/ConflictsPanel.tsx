import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTaskConflicts, useScanConflicts, useResolveConflict } from "@/hooks/useTaskConflicts";
import { useTaskPriorities } from "@/hooks/useTaskPriorities";
import { Task } from "@/hooks/useTasks";
import { 
  AlertTriangle, 
  Calendar, 
  Users, 
  GitBranch, 
  RefreshCw,
  CheckCircle,
  TrendingUp,
  Award,
  Clock,
  Target,
} from "lucide-react";
import { useState } from "react";

interface ConflictsPanelProps {
  projectId: string;
  tasks: Task[];
}

const conflictTypeConfig = {
  resource: {
    label: "Recurso",
    icon: Users,
    color: "text-critical",
    bgColor: "bg-critical-light",
    borderColor: "border-critical/20",
    description: "Mesmo responsável em tarefas sobrepostas",
  },
  capacity: {
    label: "Capacidade",
    icon: TrendingUp,
    color: "text-warning",
    bgColor: "bg-warning-light",
    borderColor: "border-warning/20",
    description: "Alocação excede 100% do recurso",
  },
  dependency: {
    label: "Dependência",
    icon: GitBranch,
    color: "text-critical",
    bgColor: "bg-critical-light",
    borderColor: "border-critical/20",
    description: "Tarefa inicia antes do predecessor",
  },
  calendar: {
    label: "Calendário",
    icon: Calendar,
    color: "text-muted-foreground",
    bgColor: "bg-muted/50",
    borderColor: "border-muted",
    description: "Tarefa em dia não útil",
  },
};

const severityConfig = {
  high: { color: "text-critical", bg: "bg-critical-light border-critical/20" },
  medium: { color: "text-warning", bg: "bg-warning-light border-warning/20" },
  low: { color: "text-muted-foreground", bg: "bg-muted/50 border-muted" },
};

export const ConflictsPanel = ({ projectId, tasks }: ConflictsPanelProps) => {
  const { data: conflicts = [], isLoading } = useTaskConflicts(projectId);
  const scanConflicts = useScanConflicts();
  const resolveConflict = useResolveConflict();
  const priorities = useTaskPriorities(tasks);
  const [selectedType, setSelectedType] = useState<string>("all");

  const openConflicts = conflicts.filter(c => c.status === "open");
  const conflictsByType = {
    all: openConflicts,
    resource: openConflicts.filter(c => c.conflict_type === "resource"),
    capacity: openConflicts.filter(c => c.conflict_type === "capacity"),
    dependency: openConflicts.filter(c => c.conflict_type === "dependency"),
    calendar: openConflicts.filter(c => c.conflict_type === "calendar"),
  };

  const handleScan = () => {
    scanConflicts.mutate({ projectId, tasks });
  };

  const handleResolve = (conflictId: string, action: string) => {
    resolveConflict.mutate({ conflictId, action });
  };

  const getTaskById = (taskId: string) => tasks.find(t => t.id === taskId);
  const getPriorityForTask = (taskId: string) => priorities.find(p => p.taskId === taskId);

  if (isLoading) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">Carregando conflitos...</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with scan button */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-foreground">Conflitos e Prioridades</h2>
          <p className="text-sm text-muted-foreground">
            Detecte conflitos de recursos, capacidade, dependências e calendário
          </p>
        </div>
        <Button 
          onClick={handleScan}
          disabled={scanConflicts.isPending}
          className="shadow-primary"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${scanConflicts.isPending ? 'animate-spin' : ''}`} />
          {scanConflicts.isPending ? "Analisando..." : "Analisar Conflitos"}
        </Button>
      </div>

      {/* Summary Alert */}
      {openConflicts.length > 0 && (
        <Alert className="border-critical/20 bg-critical-light">
          <AlertTriangle className="h-4 w-4 text-critical" />
          <AlertDescription className="text-critical font-medium">
            {openConflicts.length} conflitos ativos detectados no projeto
          </AlertDescription>
        </Alert>
      )}

      {/* Conflict Type Chips */}
      <div className="flex gap-2 flex-wrap">
        <Button
          variant={selectedType === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedType("all")}
        >
          Todos ({openConflicts.length})
        </Button>
        {Object.entries(conflictsByType).map(([type, typeConflicts]) => {
          if (type === "all") return null;
          const config = conflictTypeConfig[type as keyof typeof conflictTypeConfig];
          const Icon = config.icon;
          
          return (
            <Button
              key={type}
              variant={selectedType === type ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedType(type)}
              className={selectedType === type ? "" : config.color}
            >
              <Icon className="h-3 w-3 mr-1" />
              {config.label} ({typeConflicts.length})
            </Button>
          );
        })}
      </div>

      <Tabs defaultValue="conflicts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="conflicts">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Conflitos
          </TabsTrigger>
          <TabsTrigger value="priorities">
            <Award className="h-4 w-4 mr-2" />
            Prioridades
          </TabsTrigger>
        </TabsList>

        <TabsContent value="conflicts" className="space-y-4">
          {conflictsByType[selectedType as keyof typeof conflictsByType].length === 0 ? (
            <Card className="p-8 text-center">
              <CheckCircle className="h-12 w-12 text-success mx-auto mb-4" />
              <p className="text-muted-foreground">
                {openConflicts.length === 0 
                  ? "Nenhum conflito detectado. Execute uma análise para verificar."
                  : "Nenhum conflito deste tipo."}
              </p>
            </Card>
          ) : (
            <div className="space-y-3">
              {conflictsByType[selectedType as keyof typeof conflictsByType].map((conflict) => {
                const config = conflictTypeConfig[conflict.conflict_type];
                const Icon = config.icon;
                const taskA = getTaskById(conflict.task_a_id);
                const taskB = conflict.task_b_id ? getTaskById(conflict.task_b_id) : null;
                const priorityA = taskA ? getPriorityForTask(taskA.id) : null;
                const priorityB = taskB ? getPriorityForTask(taskB.id) : null;

                return (
                  <Card key={conflict.id} className={`p-4 border ${config.borderColor} ${config.bgColor}`}>
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <Icon className={`h-5 w-5 ${config.color} mt-0.5`} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="outline" className={severityConfig[conflict.severity].bg}>
                                {conflict.severity === "high" && "Alta"}
                                {conflict.severity === "medium" && "Média"}
                                {conflict.severity === "low" && "Baixa"}
                              </Badge>
                              <Badge variant="outline" className={config.borderColor}>
                                {config.label}
                              </Badge>
                            </div>
                            
                            <div className="space-y-2">
                              {taskA && (
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-sm">{taskA.wbs}</span>
                                  <span className="text-sm">{taskA.name}</span>
                                  {priorityA && (
                                    <Badge variant="outline" className="ml-auto">
                                      Score: {priorityA.score}
                                    </Badge>
                                  )}
                                </div>
                              )}
                              
                              {taskB && (
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-sm">{taskB.wbs}</span>
                                  <span className="text-sm">{taskB.name}</span>
                                  {priorityB && (
                                    <Badge variant="outline" className="ml-auto">
                                      Score: {priorityB.score}
                                    </Badge>
                                  )}
                                </div>
                              )}

                              {conflict.details && (
                                <p className="text-xs text-muted-foreground">
                                  {conflict.conflict_type === "resource" && (
                                    <>Sobreposição: {conflict.details.overlap_start} a {conflict.details.overlap_end}</>
                                  )}
                                  {conflict.conflict_type === "capacity" && (
                                    <>Capacidade total: {conflict.details.total_capacity}% em {conflict.details.date}</>
                                  )}
                                  {conflict.conflict_type === "dependency" && (
                                    <>Violação de {conflict.details.days_violation} dias</>
                                  )}
                                  {conflict.conflict_type === "calendar" && (
                                    <>{conflict.details.issue}: {conflict.details.date}</>
                                  )}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleResolve(conflict.id, "manual")}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Resolver
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="priorities" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Ranking de Prioridades
            </h3>
            <div className="space-y-3">
              {priorities.slice(0, 10).map((priority, index) => {
                const task = getTaskById(priority.taskId);
                if (!task) return null;

                return (
                  <div key={task.id} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                    <Badge className="w-8 h-8 flex items-center justify-center bg-primary text-primary-foreground">
                      {index + 1}
                    </Badge>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm">{task.wbs}</span>
                        <span className="text-sm truncate">{task.name}</span>
                      </div>
                      <div className="flex gap-2 text-xs text-muted-foreground">
                        {task.is_milestone && (
                          <Badge variant="outline" className="h-5">
                            <Award className="h-3 w-3 mr-1" />
                            Milestone
                          </Badge>
                        )}
                        {task.sla_critical && (
                          <Badge variant="outline" className="h-5 bg-critical-light text-critical border-critical/20">
                            <Clock className="h-3 w-3 mr-1" />
                            SLA Crítico
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">{priority.score}</div>
                      <div className="text-xs text-muted-foreground">pontos</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
