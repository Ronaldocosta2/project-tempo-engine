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
    <div className="min-h-screen bg-gradient-subtle">
      <Header onNewProject={() => console.log("Novo projeto")} />

      <main className="container py-8 px-8">
        {/* Hero Section */}
        <div className="mb-8 space-y-4">
          <div>
            <h2 className="text-4xl font-bold text-foreground mb-2">
              Seus Projetos
            </h2>
            <p className="text-lg text-muted-foreground">
              Gerencie cronogramas com precisão usando diagramas Gantt avançados
            </p>
          </div>

          {/* Search and Filters */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar projetos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
          </div>
        </div>

        {/* Projects Grid */}
        {isLoading ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">Carregando projetos...</p>
          </div>
        ) : filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard 
                key={project.id}
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
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">
              {searchQuery ? "Nenhum projeto encontrado" : "Nenhum projeto cadastrado ainda"}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
