import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { GanttChart } from "@/components/GanttChart";
import {
  ArrowLeft,
  Calendar,
  Users,
  TrendingUp,
  AlertTriangle,
  Clock,
  Plus,
} from "lucide-react";

export default function ProjectView() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock data - em produção viria do backend
  const project = {
    id: id || "1",
    name: "Sistema de Gestão Empresarial",
    description: "Desenvolvimento completo de ERP com módulos financeiro, RH e vendas",
    startDate: "01/03/2025",
    endDate: "30/11/2025",
    progress: 35,
    status: "on-track" as const,
    teamSize: 12,
    budget: "R$ 450.000",
    criticalTasks: 5,
  };

  const tasks = [
    {
      id: "1",
      wbs: "1.0",
      name: "Iniciação do Projeto",
      startDate: "2025-03-01",
      endDate: "2025-03-15",
      duration: 14,
      progress: 100,
      isCritical: true,
      status: "completed" as const,
    },
    {
      id: "2",
      wbs: "2.0",
      name: "Análise de Requisitos",
      startDate: "2025-03-16",
      endDate: "2025-04-30",
      duration: 45,
      progress: 85,
      isCritical: true,
      status: "in-progress" as const,
    },
    {
      id: "3",
      wbs: "3.0",
      name: "Desenho da Arquitetura",
      startDate: "2025-04-15",
      endDate: "2025-05-31",
      duration: 46,
      progress: 60,
      isCritical: true,
      status: "in-progress" as const,
    },
    {
      id: "4",
      wbs: "4.0",
      name: "Desenvolvimento Backend",
      startDate: "2025-06-01",
      endDate: "2025-08-31",
      duration: 91,
      progress: 0,
      isCritical: true,
      status: "not-started" as const,
      dependencies: ["3"],
    },
    {
      id: "5",
      wbs: "5.0",
      name: "Desenvolvimento Frontend",
      startDate: "2025-07-01",
      endDate: "2025-09-30",
      duration: 91,
      progress: 0,
      isCritical: false,
      status: "not-started" as const,
      dependencies: ["4"],
    },
    {
      id: "6",
      wbs: "6.0",
      name: "Testes e QA",
      startDate: "2025-10-01",
      endDate: "2025-10-31",
      duration: 30,
      progress: 0,
      isCritical: true,
      status: "not-started" as const,
      dependencies: ["5"],
    },
    {
      id: "7",
      wbs: "7.0",
      name: "Implantação",
      startDate: "2025-11-01",
      endDate: "2025-11-30",
      duration: 30,
      progress: 0,
      isCritical: true,
      status: "not-started" as const,
      dependencies: ["6"],
    },
  ];

  const stats = [
    {
      label: "Tarefas Totais",
      value: tasks.length.toString(),
      icon: TrendingUp,
      color: "text-primary",
    },
    {
      label: "Tarefas Críticas",
      value: project.criticalTasks.toString(),
      icon: AlertTriangle,
      color: "text-critical",
    },
    {
      label: "Dias Restantes",
      value: "215",
      icon: Clock,
      color: "text-warning",
    },
    {
      label: "Equipe",
      value: project.teamSize.toString(),
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
              onClick={() => navigate("/")}
              className="mb-2 -ml-2"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar aos Projetos
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
                {project.startDate} - {project.endDate}
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                {project.teamSize} pessoas
              </div>
            </div>
          </div>

          <Button variant="default" className="shadow-primary">
            <Plus className="h-4 w-4 mr-2" />
            Nova Tarefa
          </Button>
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

        {/* Gantt Chart */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Cronograma Gantt</h2>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                Exportar CSV
              </Button>
              <Button variant="outline" size="sm">
                Baseline
              </Button>
              <Button variant="default" size="sm">
                Recalcular
              </Button>
            </div>
          </div>
          <GanttChart tasks={tasks} />
        </div>

        {/* Caminho Crítico */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-critical" />
            Caminho Crítico
          </h3>
          <div className="space-y-2">
            {tasks
              .filter((t) => t.isCritical)
              .map((task) => (
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
      </div>
    </div>
  );
}
