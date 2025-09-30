import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectOverview } from "@/components/ProjectOverview";
import { ProjectStory } from "@/components/ProjectStory";
import { ProjectHealthPanel } from "@/components/ProjectHealthPanel";
import { StakeholderMatrix } from "@/components/StakeholderMatrix";
import { useProject } from "@/hooks/useProjects";
import { useTasks } from "@/hooks/useTasks";
import { useProjectContext } from "@/hooks/useProjectContext";
import { useProjectRisks } from "@/hooks/useProjectRisks";
import { useProjectIssues } from "@/hooks/useProjectIssues";
import { useStakeholders } from "@/hooks/useStakeholders";
import { useMeetings } from "@/hooks/useMeetings";
import { useActionItems } from "@/hooks/useActionItems";
import {
  ArrowLeft,
  Calendar,
  BarChart3,
  Users,
  ListTodo,
  UserCheck,
} from "lucide-react";

export default function ProjectHome() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: project, isLoading: projectLoading } = useProject(id || "");
  const { data: tasks = [] } = useTasks(id || "");
  const { data: context } = useProjectContext(id || "");
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

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container py-8 px-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate("/")} className="-ml-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar aos Projetos
          </Button>

          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => navigate(`/project/${id}/schedule`)}>
              <Calendar className="h-4 w-4 mr-2" />
              Cronograma Gantt
            </Button>
            <Button variant="outline" onClick={() => navigate(`/project/${id}/governance`)}>
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
            <Card>
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
          </div>

          {/* Right Column - 1/3 width */}
          <div className="space-y-6">
            <ProjectHealthPanel
              risks={risks}
              issues={issues}
              tasksCount={tasks.length}
              criticalTasksCount={criticalTasks.length}
            />

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <Users className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Stakeholders</h3>
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

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Próximos Marcos</h3>
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
    </div>
  );
}
