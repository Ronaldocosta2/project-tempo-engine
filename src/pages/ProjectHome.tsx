import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectOverview } from "@/components/ProjectOverview";
import { ProjectStory } from "@/components/ProjectStory";
import { ProjectHealthPanel } from "@/components/ProjectHealthPanel";
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
  Clock,
  MoreHorizontal
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ProjectHome() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [documentDialogOpen, setDocumentDialogOpen] = useState(false);

  const { data: project, isLoading: projectLoading } = useProject(id || "", user?.id);
  const { data: tasks = [] } = useTasks(id || "");
  const { data: context } = useProjectContext(id || "");
  const createTask = useCreateTask();
  const { data: risks = [] } = useProjectRisks(id || "");
  const { data: issues = [] } = useProjectIssues(id || "");
  const { data: stakeholders = [] } = useStakeholders(id || "");
  const { data: meetings = [] } = useMeetings(id || "");
  const { data: actionItems = [] } = useActionItems(id || "");

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  if (authLoading || projectLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="inline-flex items-center gap-2 text-slate-400">
          <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          Carregando...
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <p className="text-slate-400">Projeto não encontrado</p>
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
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <div className="container py-8 px-6 max-w-7xl mx-auto space-y-8 animate-fade-in-up">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/")}
              className="rounded-full hover:bg-white/10 text-slate-400 hover:text-white"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">{project.name}</h1>
              <p className="text-slate-400 text-sm flex items-center gap-2">
                <span className={`inline-block w-2 h-2 rounded-full ${project.status === 'on-track' ? 'bg-green-500' :
                    project.status === 'at-risk' ? 'bg-yellow-500' : 'bg-red-500'
                  }`} />
                {project.status === 'on-track' ? 'No Prazo' :
                  project.status === 'at-risk' ? 'Em Risco' : 'Atrasado'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => setScheduleDialogOpen(true)}
              className="border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white backdrop-blur-sm"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Cronograma
            </Button>
            <Button
              variant="outline"
              onClick={() => setDocumentDialogOpen(true)}
              className="border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white backdrop-blur-sm"
            >
              <FileText className="h-4 w-4 mr-2" />
              Docs
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-white/10">
                  <MoreHorizontal className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-slate-900 border-white/10 text-slate-200">
                <DropdownMenuItem onClick={() => navigate(`/project/${id}/governance`)} className="hover:bg-white/10 cursor-pointer">
                  <UserCheck className="h-4 w-4 mr-2" />
                  Governança
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-400 hover:bg-red-500/10 cursor-pointer">
                  Arquivar Projeto
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Overview Component */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
          <ProjectOverview project={project} />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            <ProjectStory projectId={id || ""} context={context || null} />

            {/* Recent Activity */}
            <Card className="border-white/5 bg-white/5 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-medium text-white flex items-center gap-2">
                  <Clock className="h-5 w-5 text-purple-400" />
                  Atividade Recente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="meetings" className="w-full">
                  <TabsList className="w-full bg-slate-900/50 border border-white/5">
                    <TabsTrigger value="meetings" className="flex-1 data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                      <Users className="h-4 w-4 mr-2" />
                      Reuniões
                    </TabsTrigger>
                    <TabsTrigger value="actions" className="flex-1 data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                      <ListTodo className="h-4 w-4 mr-2" />
                      Ações
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="meetings" className="space-y-3 mt-4">
                    {recentMeetings.length > 0 ? (
                      recentMeetings.map((meeting) => (
                        <div
                          key={meeting.id}
                          className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/5"
                        >
                          <div>
                            <p className="font-medium text-slate-200">{meeting.title}</p>
                            <p className="text-sm text-slate-500">
                              {new Date(meeting.meeting_date).toLocaleDateString("pt-BR")}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-slate-500">
                        Nenhuma reunião recente
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="actions" className="space-y-3 mt-4">
                    {pendingActions.length > 0 ? (
                      pendingActions.slice(0, 5).map((action) => (
                        <div
                          key={action.id}
                          className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/5"
                        >
                          <div>
                            <p className="font-medium text-slate-200">{action.title}</p>
                            <p className="text-sm text-slate-500">
                              Prazo: {new Date(action.due_date).toLocaleDateString("pt-BR")}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-slate-500">
                        Nenhuma ação pendente
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Gantt Chart Preview */}
            <Card className="border-white/5 bg-white/5 backdrop-blur-sm overflow-hidden">
              <CardHeader className="pb-3 border-b border-white/5">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-medium text-white flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-blue-400" />
                    Cronograma
                  </CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setScheduleDialogOpen(true)} className="text-slate-400 hover:text-white">
                    Expandir
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="opacity-75 hover:opacity-100 transition-opacity">
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
                </div>
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

            <Card className="border-white/5 bg-white/5 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-medium text-white flex items-center gap-2">
                  <Users className="h-5 w-5 text-green-400" />
                  Stakeholders
                </CardTitle>
              </CardHeader>
              <CardContent>
                {stakeholders.length > 0 ? (
                  <div className="space-y-2">
                    {stakeholders.slice(0, 5).map((stakeholder) => (
                      <div
                        key={stakeholder.id}
                        className="flex items-center justify-between p-2 rounded bg-white/5 border border-white/5"
                      >
                        <div>
                          <p className="text-sm font-medium text-slate-200">{stakeholder.name}</p>
                          <p className="text-xs text-slate-500">{stakeholder.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500 text-center py-4">Nenhum stakeholder</p>
                )}
                <Button
                  variant="outline"
                  className="w-full mt-4 border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
                  onClick={() => navigate(`/project/${id}/governance`)}
                >
                  Gerenciar Equipe
                </Button>
              </CardContent>
            </Card>

            <Card className="border-white/5 bg-white/5 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-medium text-white flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-orange-400" />
                  Próximos Marcos
                </CardTitle>
              </CardHeader>
              <CardContent>
                {criticalTasks.length > 0 ? (
                  <div className="space-y-2">
                    {criticalTasks.slice(0, 5).map((task) => (
                      <div key={task.id} className="p-2 rounded bg-white/5 border border-white/5">
                        <p className="text-sm font-medium text-slate-200">{task.name}</p>
                        <p className="text-xs text-slate-500">
                          {new Date(task.end_date).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500 text-center py-4">Nenhum marco definido</p>
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
