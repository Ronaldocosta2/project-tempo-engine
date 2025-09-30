import { useState } from "react";
import { Header } from "@/components/Header";
import { ProjectCard } from "@/components/ProjectCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useProjects } from "@/hooks/useProjects";
import { Search, Filter } from "lucide-react";

export default function Index() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: projects = [], isLoading } = useProjects();

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary-light/30 to-secondary-light/20">
      <Header onNewProject={() => console.log("Novo projeto")} />

      <main className="container py-12 px-8">
        {/* Hero Section */}
        <div className="mb-12 space-y-6 animate-fade-in-up">
          <div className="relative">
            <div className="absolute -top-8 -left-8 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute -top-4 right-20 w-24 h-24 bg-secondary/10 rounded-full blur-2xl" />
            <h2 className="text-5xl font-bold text-foreground mb-3 relative">
              Seus Projetos
            </h2>
            <p className="text-xl text-muted-foreground relative">
              Gerencie cronogramas com precisão usando diagramas Gantt avançados
            </p>
          </div>

          {/* Search and Filters */}
          <div className="flex items-center gap-3 pt-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Buscar projetos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 h-12 bg-card/80 backdrop-blur-sm border-border/50 shadow-sm hover:shadow-md transition-shadow"
              />
            </div>
            <Button variant="outline" className="h-12 shadow-sm hover:shadow-md transition-all hover:scale-105">
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
          </div>
        </div>

        {/* Projects Grid */}
        {isLoading ? (
          <div className="text-center py-24">
            <div className="inline-flex items-center gap-3 text-muted-foreground text-lg">
              <div className="w-6 h-6 border-3 border-primary border-t-transparent rounded-full animate-spin" />
              Carregando projetos...
            </div>
          </div>
        ) : filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 animate-fade-in">
            {filteredProjects.map((project, index) => (
              <div
                key={project.id}
                style={{ animationDelay: `${index * 0.1}s` }}
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
          <div className="text-center py-24">
            <div className="max-w-md mx-auto space-y-4">
              <div className="w-20 h-20 mx-auto bg-muted/50 rounded-full flex items-center justify-center">
                <Search className="w-10 h-10 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground text-xl">
                {searchQuery ? "Nenhum projeto encontrado" : "Nenhum projeto cadastrado ainda"}
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
