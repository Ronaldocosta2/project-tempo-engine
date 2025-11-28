import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectOverview } from "@/components/ProjectOverview";
import { ProjectStory } from "@/components/ProjectStory";
import { ProjectHealthPanel } from "@/components/ProjectHealthPanel";
import { StakeholderMatrix } from "@/components/StakeholderMatrix";
import { ScheduleDialog } from "@/components/ScheduleDialog";
import { DocumentDialog } from "@/components/DocumentDialog";
import { useProject } from "@/hooks/useProjects";
import { useTasks, useCreateTask } from "@/hooks/useTasks";
import { useProjectContext } from "@/hooks/useProjectContext";
import { useProjectRisks } from "@/hooks/useProjectRisks";
import { useProjectIssues } from "@/hooks/useProjectIssues";
import { useStakeholders } from "@/hooks/useStakeholders";
import { useMeetings } from "@/hooks/useMeetings";
import { useActionItems } from "@/hooks/useActionItems";
import { GanttChart } from "@/components/GanttChart";
import {
  ArrowLeft,
  Calendar,
  BarChart3,
  Users,
  ListTodo,
  UserCheck,
  FileText,
} from "lucide-react";

export default function ProjectHome() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [documentDialogOpen, setDocumentDialogOpen] = useState(false);

  const { data: project, isLoading: projectLoading } = useProject(id || "");
  const { data: tasks = [] } = useTasks(id || "");
  const { data: context } = useProjectContext(id || "");
  const createTask = useCreateTask();
  const { data: risks = [] } = useProjectRisks(id || "");
  const { data: issues = [] } = useProjectIssues(id || "");
  const { data: stakeholders = [] } = useStakeholders(id || "");
  const { data: meetings = [] } = useMeetings(id || "");
  const { data: actionItems = [] } = useActionItems(id || "");

  if (projectLoading) {
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

  const criticalTasks = tasks.filter((t) => t.is_critical);
  const recentMeetings = meetings.slice(0, 3);
  const pendingActions = actionItems.filter((a) => a.status === "pendente");

  const handleTasksChange = async (newTasks: any[]) => {
    for (const task of newTasks) {
      await createTask.mutateAsync({
        project_id: id || "",
        wbs: task.wbs,
        name: task.name,
        start_date: task.startDate,
        end_date: task.endDate,
        duration: task.duration,
        progress: task.progress,
        status: task.status,
        is_critical: task.isCritical,
        parent_id: null,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary-light/20 to-accent-light/10">
      <div className="container py-10 px-8 space-y-8 animate-fade-in-up">
        {/* Header */}
        <div className="flex items-center justify-between backdrop-blur-sm">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/")} 
            className="-ml-2 hover:bg-card/50 transition-all hover:scale-105"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar aos Projetos
          </Button>

          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              onClick={() => setScheduleDialogOpen(true)}
              className="shadow-sm hover:shadow-md transition-all hover:scale-105 border-border/50 bg-card/50 backdrop-blur-sm"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Ver Cronograma
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setDocumentDialogOpen(true)}
              className="shadow-sm hover:shadow-md transition-all hover:scale-105 border-border/50 bg-card/50 backdrop-blur-sm"
            >
              <FileText className="h-4 w-4 mr-2" />
              Documentação
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate(`/project/${id}/governance`)}
              className="shadow-sm hover:shadow-md transition-all hover:scale-105 border-border/50 bg-card/50 backdrop-blur-sm"
            >
              <UserCheck className="h-4 w-4 mr-2" />
              Governança
            </Button>
          </div>
        </div>

        {/* Overview Card */}
        <ProjectOverview project={project} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            <ProjectStory projectId={id || ""} context={context || null} />

            {/* Recent Activity */}
            <Card className="shadow-lg border-border/50 bg-card/80 backdrop-blur-sm hover:shadow-xl transition-shadow">
              <CardContent className="pt-6">
                <Tabs defaultValue="meetings">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="meetings">
                      <Calendar className="h-4 w-4 mr-2" />
                      Últimas Reuniões
                    </TabsTrigger>
                    <TabsTrigger value="actions">
                      <ListTodo className="h-4 w-4 mr-2" />
                      Ações Pendentes
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="meetings" className="space-y-3 mt-4">
                    {recentMeetings.length > 0 ? (
                      recentMeetings.map((meeting) => (
                        <div
                          key={meeting.id}
                          className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{meeting.title}</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(meeting.meeting_date).toLocaleDateString("pt-BR")}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        Nenhuma reunião registrada
                      </p>
                    )}
                  </TabsContent>

                  <TabsContent value="actions" className="space-y-3 mt-4">
                    {pendingActions.length > 0 ? (
                      pendingActions.slice(0, 5).map((action) => (
                        <div
                          key={action.id}
                          className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                        >
                          <p className="font-medium">{action.title}</p>
                          <p className="text-sm text-muted-foreground">
                            Prazo: {new Date(action.due_date).toLocaleDateString("pt-BR")}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        Nenhuma ação pendente
                      </p>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Gantt Chart */}
            <Card className="shadow-lg border-border/50 bg-card/80 backdrop-blur-sm hover:shadow-xl transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg">Cronograma</h3>
                </div>
                <GanttChart 
                  tasks={tasks.map(task => ({
                    id: task.id,
                    wbs: task.wbs,
                    name: task.name,
                    startDate: task.start_date,
                    endDate: task.end_date,
                    duration: task.duration,
                    progress: task.progress,
                    isCritical: task.is_critical,
                    status: task.status,
                  }))}
                  onTasksChange={handleTasksChange}
                />
              </CardContent>
            </Card>
          </div>

          {/* Right Column - 1/3 width */}
          <div className="space-y-6">
            <ProjectHealthPanel
              risks={risks}
              issues={issues}
              tasksCount={tasks.length}
              criticalTasksCount={criticalTasks.length}
            />

            <Card className="shadow-lg border-border/50 bg-card/80 backdrop-blur-sm hover:shadow-xl transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg">Stakeholders</h3>
                </div>
                {stakeholders.length > 0 ? (
                  <div className="space-y-2">
                    {stakeholders.slice(0, 5).map((stakeholder) => (
                      <div
                        key={stakeholder.id}
                        className="flex items-center justify-between p-2 rounded bg-muted/50"
                      >
                        <div>
                          <p className="text-sm font-medium">{stakeholder.name}</p>
                          <p className="text-xs text-muted-foreground">{stakeholder.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Nenhum stakeholder cadastrado</p>
                )}
                <Button
                  variant="outline"
                  className="w-full mt-4"
                  onClick={() => navigate(`/project/${id}/governance`)}
                >
                  Ver Todos
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-border/50 bg-card/80 backdrop-blur-sm hover:shadow-xl transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                    <BarChart3 className="h-5 w-5 text-accent" />
                  </div>
                  <h3 className="font-semibold text-lg">Próximos Marcos</h3>
                </div>
                {criticalTasks.length > 0 ? (
                  <div className="space-y-2">
                    {criticalTasks.slice(0, 5).map((task) => (
                      <div key={task.id} className="p-2 rounded bg-muted/50">
                        <p className="text-sm font-medium">{task.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(task.end_date).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Nenhum marco cadastrado</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Schedule Dialog */}
      <ScheduleDialog
        projectId={id || ""}
        projectName={project?.name || ""}
        open={scheduleDialogOpen}
        onOpenChange={setScheduleDialogOpen}
      />
      
      {/* Document Dialog */}
      <DocumentDialog
        open={documentDialogOpen}
        onOpenChange={setDocumentDialogOpen}
        projectId={id || ""}
      />
    </div>
  );
}
