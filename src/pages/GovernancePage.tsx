import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { StakeholderMatrix } from "@/components/StakeholderMatrix";
import { useStakeholders } from "@/hooks/useStakeholders";
import { useMeetings } from "@/hooks/useMeetings";
import { useActionItems } from "@/hooks/useActionItems";
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
  
  const { data: stakeholders = [], isLoading: stakeholdersLoading } = useStakeholders(id || "");
  const { data: meetings = [], isLoading: meetingsLoading } = useMeetings(id || "");
  const { data: actionItems = [], isLoading: actionItemsLoading } = useActionItems(id || "");

  if (stakeholdersLoading || meetingsLoading || actionItemsLoading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  const criticalStakeholders = stakeholders.filter(
    (s) => s.power_level >= 4 && s.interest_level >= 4
  );

  const upcomingMeetings = meetings.filter(
    (m) => m.status === "agendada" && new Date(m.meeting_date) > new Date()
  );

  const pendingActions = actionItems.filter((a) => a.status === "pendente");

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
            <h1 className="text-3xl font-bold text-foreground">
              Governança & Engajamento
            </h1>
            <p className="text-muted-foreground">
              Gerencie stakeholders, reuniões e combinados
            </p>
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

        {/* Tabs */}
        <Tabs defaultValue="stakeholders" className="space-y-4">
          <TabsList>
            <TabsTrigger value="stakeholders">Stakeholders</TabsTrigger>
            <TabsTrigger value="meetings">Reuniões</TabsTrigger>
            <TabsTrigger value="actions">Combinados</TabsTrigger>
          </TabsList>

          {/* Stakeholders Tab */}
          <TabsContent value="stakeholders" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">
                Stakeholders do Projeto
              </h2>
              <Button variant="default">
                <Plus className="h-4 w-4 mr-2" />
                Novo Stakeholder
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <StakeholderMatrix stakeholders={stakeholders} />
              
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Lista de Stakeholders</h3>
                <div className="space-y-2 max-h-[500px] overflow-y-auto">
                  {stakeholders.map((stakeholder) => (
                    <div
                      key={stakeholder.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{stakeholder.name}</h4>
                          <Badge variant="outline" className="text-xs">
                            {stakeholder.role}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          <span>Poder: {stakeholder.power_level}/5</span>
                          <span>Interesse: {stakeholder.interest_level}/5</span>
                          <Badge
                            variant="outline"
                            className={
                              stakeholder.influence === "alta"
                                ? "bg-success-light text-success"
                                : stakeholder.influence === "media"
                                ? "bg-warning-light text-warning"
                                : "bg-muted"
                            }
                          >
                            Influência: {stakeholder.influence}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {stakeholders.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">
                      Nenhum stakeholder cadastrado
                    </p>
                  )}
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Meetings Tab */}
          <TabsContent value="meetings" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">Reuniões</h2>
              <Button variant="default">
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
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
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
              <Button variant="default">
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
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
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
    </div>
  );
}
