import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GanttChart } from "@/components/GanttChart";
import { MindMapView } from "@/components/MindMapView";
import { TaskDialog } from "@/components/TaskDialog";
import { ScheduleMetrics } from "@/components/ScheduleMetrics";
import { useProject } from "@/hooks/useProjects";
import { useTasks, useCreateTask, useUpdateTask, useDeleteTask, Task } from "@/hooks/useTasks";
import {
  ArrowLeft,
  Calendar,
  Users,
  TrendingUp,
  AlertTriangle,
  Clock,
  Plus,
  Edit,
  Trash2,
  UserCheck,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

export default function ScheduleView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const { data: project, isLoading: projectLoading } = useProject(id || "");
  const { data: tasks = [], isLoading: tasksLoading } = useTasks(id || "");
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();
  const queryClient = useQueryClient();

  if (projectLoading || tasksLoading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <p className="text-muted-foreground">Projeto não encontrado</p>
      </div>
    );
  }

  const handleSaveTask = (taskData: Partial<Task>) => {
    if (selectedTask) {
      updateTask.mutate({ ...taskData, id: selectedTask.id });
    } else {
      createTask.mutate(taskData as Omit<Task, "id" | "created_at" | "updated_at">);
    }
    setSelectedTask(null);
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setTaskDialogOpen(true);
  };

  const handleDeleteTask = (taskId: string) => {
    if (confirm("Tem certeza que deseja deletar esta tarefa?")) {
      deleteTask.mutate({ id: taskId, projectId: id || "" });
    }
  };

  const handleNewTask = () => {
    setSelectedTask(null);
    setTaskDialogOpen(true);
  };

  const handleRecalculate = () => {
    if (!id) return;
    queryClient.invalidateQueries({ queryKey: ["tasks", id] });
    queryClient.invalidateQueries({ queryKey: ["projects", id] });
  };

  const criticalTasks = tasks.filter((t) => t.is_critical);

  const ganttTasks = tasks.map((t) => ({
    id: t.id,
    wbs: t.wbs,
    name: t.name,
    startDate: t.start_date,
    endDate: t.end_date,
    duration: t.duration,
    progress: t.progress,
    isCritical: t.is_critical,
    status: t.status,
  }));

  const stats = [
    {
      label: "Tarefas Totais",
      value: tasks.length.toString(),
      icon: TrendingUp,
      color: "text-primary",
    },
    {
      label: "Tarefas Críticas",
      value: criticalTasks.length.toString(),
      icon: AlertTriangle,
      color: "text-critical",
    },
    {
      label: "Progresso Médio",
      value: tasks.length > 0 
        ? `${Math.round(tasks.reduce((acc, t) => acc + t.progress, 0) / tasks.length)}%`
        : "0%",
      icon: Clock,
      color: "text-warning",
    },
    {
      label: "Equipe",
      value: project.team_size.toString(),
      icon: Users,
      color: "text-success",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container py-8 px-8 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <Button
              variant="ghost"
              onClick={() => navigate(`/project/${id}`)}
              className="mb-2 -ml-2"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao Projeto
            </Button>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-foreground">{project.name}</h1>
              <Badge className="bg-success-light text-success border-success/20">
                No Prazo
              </Badge>
            </div>
            <p className="text-muted-foreground">{project.description}</p>
            <div className="flex items-center gap-6 text-sm text-muted-foreground pt-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {new Date(project.start_date).toLocaleDateString("pt-BR")} -{" "}
                {new Date(project.end_date).toLocaleDateString("pt-BR")}
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                {project.team_size} pessoas
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => navigate(`/project/${id}/governance`)}
            >
              <UserCheck className="h-4 w-4 mr-2" />
              Governança
            </Button>
            <Button variant="default" className="shadow-primary" onClick={handleNewTask}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Tarefa
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </Card>
          ))}
        </div>

        {/* Schedule Metrics - Motor de Agendamento */}
        <ScheduleMetrics projectId={id || ""} onRecalculate={handleRecalculate} />

        {/* Tabs para Gantt e Mapa Mental */}
        <Tabs defaultValue="gantt" className="space-y-4">
          <TabsList>
            <TabsTrigger value="gantt">Cronograma Gantt</TabsTrigger>
            <TabsTrigger value="mindmap">Mapa Mental (EAP)</TabsTrigger>
            <TabsTrigger value="tasks">Lista de Tarefas</TabsTrigger>
          </TabsList>

          <TabsContent value="gantt" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">Cronograma Gantt</h2>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  Exportar CSV
                </Button>
                <Button variant="outline" size="sm">
                  Baseline
                </Button>
              </div>
            </div>
            {ganttTasks.length > 0 ? (
              <GanttChart tasks={ganttTasks} />
            ) : (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">Nenhuma tarefa cadastrada ainda.</p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="mindmap" className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">Estrutura Analítica do Projeto (EAP)</h2>
            {tasks.length > 0 ? (
              <MindMapView tasks={tasks} />
            ) : (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">Nenhuma tarefa cadastrada ainda.</p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="tasks" className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">Lista de Tarefas</h2>
            {tasks.length > 0 ? (
              <div className="space-y-2">
                {tasks.map((task) => (
                  <Card key={task.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <Badge variant="outline" className={task.is_critical ? "bg-critical-light text-critical border-critical/20" : ""}>
                          {task.wbs}
                        </Badge>
                        <div className="flex-1">
                          <h3 className="font-semibold">{task.name}</h3>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                            <span>{new Date(task.start_date).toLocaleDateString("pt-BR")}</span>
                            <span>→</span>
                            <span>{new Date(task.end_date).toLocaleDateString("pt-BR")}</span>
                            <span>•</span>
                            <span>{task.duration} dias</span>
                            <span>•</span>
                            <span>{task.progress}% concluído</span>
                          </div>
                        </div>
                        <Badge variant="outline">
                          {task.status === "completed" && "Concluído"}
                          {task.status === "in-progress" && "Em Progresso"}
                          {task.status === "not-started" && "Não Iniciado"}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditTask(task)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteTask(task.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">Nenhuma tarefa cadastrada ainda.</p>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Caminho Crítico */}
        {criticalTasks.length > 0 && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-critical" />
              Caminho Crítico
            </h3>
            <div className="space-y-2">
              {criticalTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="bg-critical-light text-critical border-critical/20">
                      {task.wbs}
                    </Badge>
                    <span className="font-medium">{task.name}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{task.duration} dias</span>
                    <span>Folga: 0 dias</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>

      <TaskDialog
        open={taskDialogOpen}
        onOpenChange={setTaskDialogOpen}
        onSave={handleSaveTask}
        task={selectedTask}
        projectId={id || ""}
        tasks={tasks}
      />
    </div>
  );
}
