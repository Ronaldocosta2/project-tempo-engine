import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { StakeholderMatrix } from "@/components/StakeholderMatrix";
import { StakeholderDialog } from "@/components/StakeholderDialog";
import { MeetingDialog } from "@/components/MeetingDialog";
import { ActionItemDialog } from "@/components/ActionItemDialog";
import {
  useStakeholders,
  useCreateStakeholder,
  useUpdateStakeholder,
  useDeleteStakeholder,
  Stakeholder,
} from "@/hooks/useStakeholders";
import {
  useMeetings,
  useCreateMeeting,
  useUpdateMeeting,
  useDeleteMeeting,
  Meeting,
} from "@/hooks/useMeetings";
import {
  useActionItems,
  useCreateActionItem,
  useUpdateActionItem,
  useDeleteActionItem,
  ActionItem,
} from "@/hooks/useActionItems";
import {
  ArrowLeft,
  Users,
  Calendar,
  CheckSquare,
  Plus,
  Edit,
  Trash2,
  AlertCircle,
  TrendingUp,
} from "lucide-react";

export default function GovernancePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [stakeholderDialogOpen, setStakeholderDialogOpen] = useState(false);
  const [selectedStakeholder, setSelectedStakeholder] = useState<Stakeholder | null>(null);
  
  const [meetingDialogOpen, setMeetingDialogOpen] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<ActionItem | null>(null);
  
  const { data: stakeholders = [], isLoading: stakeholdersLoading } = useStakeholders(id || "");
  const { data: meetings = [], isLoading: meetingsLoading } = useMeetings(id || "");
  const { data: actionItems = [], isLoading: actionItemsLoading } = useActionItems(id || "");
  
  const createStakeholder = useCreateStakeholder();
  const updateStakeholder = useUpdateStakeholder();
  const deleteStakeholder = useDeleteStakeholder();
  
  const createMeeting = useCreateMeeting();
  const updateMeeting = useUpdateMeeting();
  const deleteMeeting = useDeleteMeeting();
  
  const createActionItem = useCreateActionItem();
  const updateActionItem = useUpdateActionItem();
  const deleteActionItem = useDeleteActionItem();

  // Handlers para Stakeholders
  const handleSaveStakeholder = (stakeholderData: Partial<Stakeholder>) => {
    if (selectedStakeholder) {
      updateStakeholder.mutate({ ...stakeholderData, id: selectedStakeholder.id });
    } else {
      createStakeholder.mutate(stakeholderData as Omit<Stakeholder, "id" | "created_at" | "updated_at">);
    }
    setSelectedStakeholder(null);
  };

  const handleEditStakeholder = (stakeholder: Stakeholder) => {
    setSelectedStakeholder(stakeholder);
    setStakeholderDialogOpen(true);
  };

  const handleDeleteStakeholder = (stakeholderId: string) => {
    if (confirm("Tem certeza que deseja remover este stakeholder?")) {
      deleteStakeholder.mutate({ id: stakeholderId, projectId: id || "" });
    }
  };

  const handleNewStakeholder = () => {
    setSelectedStakeholder(null);
    setStakeholderDialogOpen(true);
  };

  // Handlers para Reuniões
  const handleSaveMeeting = (meetingData: Partial<Meeting>) => {
    if (selectedMeeting) {
      updateMeeting.mutate({ ...meetingData, id: selectedMeeting.id });
    } else {
      createMeeting.mutate(meetingData as Omit<Meeting, "id" | "created_at" | "updated_at">);
    }
    setSelectedMeeting(null);
  };

  const handleEditMeeting = (meeting: Meeting) => {
    setSelectedMeeting(meeting);
    setMeetingDialogOpen(true);
  };

  const handleDeleteMeeting = (meetingId: string) => {
    if (confirm("Tem certeza que deseja remover esta reunião?")) {
      deleteMeeting.mutate({ id: meetingId, projectId: id || "" });
    }
  };

  const handleNewMeeting = () => {
    setSelectedMeeting(null);
    setMeetingDialogOpen(true);
  };

  // Handlers para Combinados
  const handleSaveActionItem = (actionData: Partial<ActionItem>) => {
    if (selectedAction) {
      updateActionItem.mutate({ ...actionData, id: selectedAction.id });
    } else {
      createActionItem.mutate(actionData as Omit<ActionItem, "id" | "created_at" | "updated_at">);
    }
    setSelectedAction(null);
  };

  const handleEditActionItem = (action: ActionItem) => {
    setSelectedAction(action);
    setActionDialogOpen(true);
  };

  const handleDeleteActionItem = (actionId: string) => {
    if (confirm("Tem certeza que deseja remover este combinado?")) {
      deleteActionItem.mutate({ id: actionId, projectId: id || "" });
    }
  };

  const handleNewActionItem = () => {
    setSelectedAction(null);
    setActionDialogOpen(true);
  };

  const criticalStakeholders = stakeholders.filter(
    (s) => s.power_level >= 4 && s.interest_level >= 4
  );

  const upcomingMeetings = meetings.filter(
    (m) => m.status === "agendada" && new Date(m.meeting_date) > new Date()
  );

  const pendingActions = actionItems.filter((a) => a.status === "pendente");

  if (stakeholdersLoading || meetingsLoading || actionItemsLoading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  const stats = [
    {
      label: "Stakeholders",
      value: stakeholders.length.toString(),
      icon: Users,
      color: "text-primary",
    },
    {
      label: "Críticos",
      value: criticalStakeholders.length.toString(),
      icon: AlertCircle,
      color: "text-critical",
    },
    {
      label: "Reuniões Agendadas",
      value: upcomingMeetings.length.toString(),
      icon: Calendar,
      color: "text-success",
    },
    {
      label: "Ações Pendentes",
      value: pendingActions.length.toString(),
      icon: CheckSquare,
      color: "text-warning",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent-light/20 to-primary-light/10">
      <div className="container py-10 px-8 space-y-8 animate-fade-in-up">
        {/* Header */}
        <div className="flex items-start justify-between backdrop-blur-sm">
          <div className="space-y-3">
            <Button
              variant="ghost"
              onClick={() => navigate(`/project/${id}`)}
              className="mb-2 -ml-2 hover:bg-card/50 transition-all hover:scale-105"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao Projeto
            </Button>
            <div className="relative">
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-accent/10 rounded-full blur-2xl" />
              <h1 className="text-4xl font-bold text-foreground relative">
                Governança & Engajamento
              </h1>
              <p className="text-muted-foreground text-lg mt-2 relative">
                Gerencie stakeholders, reuniões e combinados
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card 
              key={stat.label} 
              className="p-5 shadow-lg border-border/50 bg-card/80 backdrop-blur-sm hover:shadow-xl transition-all hover:scale-105 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-2 font-medium uppercase tracking-wider">{stat.label}</p>
                  <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                </div>
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                  <stat.icon className={`h-7 w-7 ${stat.color}`} />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="stakeholders" className="space-y-4">
          <TabsList>
            <TabsTrigger value="stakeholders">Stakeholders</TabsTrigger>
            <TabsTrigger value="meetings">Reuniões</TabsTrigger>
            <TabsTrigger value="actions">Combinados</TabsTrigger>
          </TabsList>

          {/* Stakeholders Tab */}
          <TabsContent value="stakeholders" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">
                Stakeholders do Projeto
              </h2>
              <Button variant="default" onClick={handleNewStakeholder}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Stakeholder
              </Button>
            </div>

            {/* Matriz expandida */}
            <div className="animate-fade-in">
              <StakeholderMatrix
                stakeholders={stakeholders}
                onStakeholderClick={handleEditStakeholder}
              />
            </div>
            
            {/* Lista de Stakeholders abaixo da matriz */}
            <Card className="p-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Lista Completa de Stakeholders</h3>
                <Badge variant="outline" className="text-sm">
                  {stakeholders.length} {stakeholders.length === 1 ? 'stakeholder' : 'stakeholders'}
                </Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {stakeholders.map((stakeholder, index) => (
                  <div
                    key={stakeholder.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-br from-muted/50 to-muted/30 hover:from-muted/70 hover:to-muted/50 transition-all hover:scale-[1.02] hover:shadow-md border border-border/50 animate-fade-in"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-foreground">{stakeholder.name}</h4>
                        <Badge variant="outline" className="text-xs">
                          {stakeholder.role}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground flex-wrap">
                        <span className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          Poder: {stakeholder.power_level}/5
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          Interesse: {stakeholder.interest_level}/5
                        </span>
                        <Badge
                          variant="outline"
                          className={
                            stakeholder.influence === "alta"
                              ? "bg-success/20 text-success border-success/50"
                              : stakeholder.influence === "media"
                              ? "bg-warning/20 text-warning border-warning/50"
                              : "bg-muted border-border"
                          }
                        >
                          {stakeholder.influence}
                        </Badge>
                      </div>
                      {stakeholder.expectation && (
                        <p className="text-xs text-muted-foreground mt-2 line-clamp-1">
                          Expectativa: {stakeholder.expectation}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditStakeholder(stakeholder)}
                        className="hover:bg-primary/10 hover:text-primary"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteStakeholder(stakeholder.id)}
                        className="hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {stakeholders.length === 0 && (
                  <div className="col-span-2 text-center py-12">
                    <Users className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                    <p className="text-muted-foreground">Nenhum stakeholder cadastrado</p>
                    <Button variant="outline" onClick={handleNewStakeholder} className="mt-4">
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar primeiro stakeholder
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>

          {/* Meetings Tab */}
          <TabsContent value="meetings" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">Reuniões</h2>
              <Button variant="default" onClick={handleNewMeeting}>
                <Plus className="h-4 w-4 mr-2" />
                Nova Reunião
              </Button>
            </div>

            <div className="space-y-2">
              {meetings.map((meeting) => (
                <Card key={meeting.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{meeting.title}</h3>
                        <Badge
                          variant="outline"
                          className={
                            meeting.status === "realizada"
                              ? "bg-success-light text-success"
                              : meeting.status === "agendada"
                              ? "bg-primary-light text-primary"
                              : "bg-muted"
                          }
                        >
                          {meeting.status}
                        </Badge>
                        <Badge variant="outline">{meeting.meeting_type}</Badge>
                      </div>
                      {meeting.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {meeting.description}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                        <span>
                          {new Date(meeting.meeting_date).toLocaleString("pt-BR")}
                        </span>
                        <span>{meeting.duration_minutes} min</span>
                        {meeting.location && <span>📍 {meeting.location}</span>}
                      </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditMeeting(meeting)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteMeeting(meeting.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                  </div>
                </Card>
              ))}
              {meetings.length === 0 && (
                <Card className="p-8 text-center">
                  <p className="text-muted-foreground">Nenhuma reunião cadastrada</p>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Action Items Tab */}
          <TabsContent value="actions" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">Combinados</h2>
              <Button variant="default" onClick={handleNewActionItem}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Combinado
              </Button>
            </div>

            <div className="space-y-2">
              {actionItems.map((item: any) => (
                <Card key={item.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{item.title}</h3>
                        <Badge
                          variant="outline"
                          className={
                            item.status === "concluida"
                              ? "bg-success-light text-success"
                              : item.status === "em-andamento"
                              ? "bg-warning-light text-warning"
                              : "bg-muted"
                          }
                        >
                          {item.status}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={
                            item.priority === "urgente"
                              ? "bg-critical-light text-critical"
                              : item.priority === "alta"
                              ? "bg-warning-light text-warning"
                              : ""
                          }
                        >
                          {item.priority}
                        </Badge>
                      </div>
                      {item.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {item.description}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                        {item.responsible?.name && (
                          <span>👤 {item.responsible.name}</span>
                        )}
                        {item.due_date && (
                          <span>
                            📅 {new Date(item.due_date).toLocaleDateString("pt-BR")}
                          </span>
                        )}
                        {item.meeting?.title && (
                          <span>🎯 Reunião: {item.meeting.title}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditActionItem(item)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteActionItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
              {actionItems.length === 0 && (
                <Card className="p-8 text-center">
                  <p className="text-muted-foreground">Nenhum combinado cadastrado</p>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialogs */}
      <StakeholderDialog
        open={stakeholderDialogOpen}
        onOpenChange={setStakeholderDialogOpen}
        onSave={handleSaveStakeholder}
        stakeholder={selectedStakeholder}
        projectId={id || ""}
      />

      <MeetingDialog
        open={meetingDialogOpen}
        onOpenChange={setMeetingDialogOpen}
        onSave={handleSaveMeeting}
        meeting={selectedMeeting}
        projectId={id || ""}
      />

      <ActionItemDialog
        open={actionDialogOpen}
        onOpenChange={setActionDialogOpen}
        onSave={handleSaveActionItem}
        actionItem={selectedAction}
        projectId={id || ""}
        stakeholders={stakeholders}
        meetings={meetings}
      />
    </div>
  );
}
