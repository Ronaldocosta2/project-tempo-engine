import { useState } from "react";
import { Header } from "@/components/Header";
import { ProjectCard } from "@/components/ProjectCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";

export default function Index() {
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data - em produção viria do backend
  const projects = [
    {
      id: "1",
      name: "Sistema de Gestão Empresarial",
      description: "Desenvolvimento completo de ERP com módulos financeiro, RH e vendas",
      startDate: "01/03/2025",
      endDate: "30/11/2025",
      progress: 35,
      tasksCount: 127,
      teamSize: 12,
      status: "on-track" as const,
    },
    {
      id: "2",
      name: "Migração de Infraestrutura Cloud",
      description: "Migração completa dos servidores on-premise para AWS com arquitetura serverless",
      startDate: "15/02/2025",
      endDate: "30/06/2025",
      progress: 62,
      tasksCount: 85,
      teamSize: 8,
      status: "on-track" as const,
    },
    {
      id: "3",
      name: "App Mobile de Vendas",
      description: "Aplicativo mobile para força de vendas com integração CRM e offline-first",
      startDate: "01/04/2025",
      endDate: "31/08/2025",
      progress: 18,
      tasksCount: 94,
      teamSize: 6,
      status: "at-risk" as const,
    },
    {
      id: "4",
      name: "Portal do Cliente B2B",
      description: "Portal web responsivo para clientes com área de pedidos, histórico e suporte",
      startDate: "10/01/2025",
      endDate: "31/05/2025",
      progress: 78,
      tasksCount: 56,
      teamSize: 5,
      status: "delayed" as const,
    },
  ];

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase())
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} {...project} />
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">
              Nenhum projeto encontrado
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
