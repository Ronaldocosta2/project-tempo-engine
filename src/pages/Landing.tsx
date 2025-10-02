import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { FolderKanban, Calendar, Users, BarChart3, Shield, Workflow } from "lucide-react";

export default function Landing() {
  const navigate = useNavigate();

  const features = [
    {
      icon: FolderKanban,
      title: "Gestão de Projetos",
      description: "Gerencie múltiplos projetos com visão completa de progresso e status"
    },
    {
      icon: Calendar,
      title: "Cronograma Inteligente",
      description: "Planejamento e acompanhamento de tarefas com detecção de conflitos"
    },
    {
      icon: Users,
      title: "Stakeholders",
      description: "Mapeamento e análise de stakeholders com matriz poder/interesse"
    },
    {
      icon: BarChart3,
      title: "Métricas e KPIs",
      description: "Indicadores em tempo real para tomada de decisão estratégica"
    },
    {
      icon: Shield,
      title: "Governança",
      description: "Gestão de riscos, issues e compliance do projeto"
    },
    {
      icon: Workflow,
      title: "Automação",
      description: "Automatize processos e otimize o fluxo de trabalho"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10">
      {/* Hero Section */}
      <div className="container mx-auto px-6 pt-20 pb-16 max-w-6xl">
        <div className="text-center space-y-6 mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <FolderKanban className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Sistema de Gestão de Projetos</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
            Gerencie Projetos com
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mt-2">
              Inteligência e Eficiência
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Plataforma completa para gestão estratégica de projetos, com análise de stakeholders, 
            cronogramas inteligentes e governança integrada.
          </p>

          <div className="flex gap-4 justify-center pt-6">
            <Button 
              size="lg" 
              onClick={() => navigate("/dashboard")}
              className="text-base px-8"
            >
              Acessar Dashboard
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="text-base px-8"
            >
              Saiba Mais
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index}
                className="border-border/50 bg-card/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300 hover-scale"
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <h3 className="font-semibold text-foreground">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Stats Section */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-center animate-fade-in" style={{ animationDelay: "0.4s" }}>
          <div>
            <div className="text-4xl font-bold text-primary mb-2">100%</div>
            <div className="text-sm text-muted-foreground">Visibilidade dos Projetos</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary mb-2">Real-time</div>
            <div className="text-sm text-muted-foreground">Atualizações Instantâneas</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary mb-2">360°</div>
            <div className="text-sm text-muted-foreground">Visão Estratégica</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-border/50 mt-16">
        <div className="container mx-auto px-6 py-6 text-center">
          <p className="text-sm text-muted-foreground">
            © 2025 Sistema de Gestão de Projetos. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  );
}
