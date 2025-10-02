import { useState } from "react";
import { Header } from "@/components/Header";
import { ProjectCard } from "@/components/ProjectCard";
import { ProjectFormDialog } from "@/components/ProjectFormDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProjects } from "@/hooks/useProjects";
import { Search, Filter, FolderKanban, TrendingUp, AlertCircle, CheckCircle2 } from "lucide-react";

export default function Index() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { data: projects = [], isLoading } = useProjects();

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalProjects = projects.length;
  const onTrackProjects = projects.filter(p => p.status === "on-track").length;
  const atRiskProjects = projects.filter(p => p.status === "at-risk").length;
  const delayedProjects = projects.filter(p => p.status === "delayed").length;
  const avgProgress = projects.length > 0 
    ? Math.round(projects.reduce((acc, p) => acc + p.progress, 0) / projects.length) 
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary-light/30 to-secondary-light/20">
      <Header onNewProject={() => setIsDialogOpen(true)} />
      <ProjectFormDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />

      <main className="container py-6 px-6 max-w-7xl">
        {/* Executive Dashboard Header */}
        <div className="mb-6 animate-fade-in-up">
          <h1 className="text-3xl font-bold text-foreground mb-1">Dashboard Executivo</h1>
          <p className="text-sm text-muted-foreground">
            Visão geral dos seus projetos e indicadores-chave
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 animate-fade-in">
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <FolderKanban className="h-4 w-4" />
                Total de Projetos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{totalProjects}</div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-success" />
                No Prazo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-success">{onTrackProjects}</div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-warning" />
                Em Risco / Atrasados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-warning">{atRiskProjects + delayedProjects}</div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                Progresso Médio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{avgProgress}%</div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="mb-4 space-y-3">
          <h2 className="text-xl font-semibold text-foreground">Projetos</h2>
          <div className="flex items-center gap-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar projetos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 text-sm bg-card/80 backdrop-blur-sm border-border/50"
              />
            </div>
            <Button variant="outline" size="sm" className="h-9">
              <Filter className="h-3.5 w-3.5 mr-1.5" />
              Filtros
            </Button>
          </div>
        </div>

        {/* Projects Grid */}
        {isLoading ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center gap-2 text-muted-foreground">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              Carregando projetos...
            </div>
          </div>
        ) : filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in">
            {filteredProjects.map((project, index) => (
              <div
                key={project.id}
                style={{ animationDelay: `${index * 0.05}s` }}
                className="animate-fade-in-up"
              >
                <ProjectCard 
                  id={project.id}
                  name={project.name}
                  description={project.description || ""}
                  startDate={new Date(project.start_date).toLocaleDateString("pt-BR")}
                  endDate={new Date(project.end_date).toLocaleDateString("pt-BR")}
                  progress={project.progress}
                  status={project.status as "on-track" | "at-risk" | "delayed"}
                  tasksCount={0}
                  teamSize={project.team_size}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto space-y-3">
              <div className="w-16 h-16 mx-auto bg-muted/50 rounded-full flex items-center justify-center">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">
                {searchQuery ? "Nenhum projeto encontrado" : "Nenhum projeto cadastrado ainda"}
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
