import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { FolderKanban, Calendar, Users, BarChart3, Shield, Workflow, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Landing() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [isAboutDialogOpen, setIsAboutDialogOpen] = useState(false);
  const [password, setPassword] = useState("");

  const handleAccessDashboard = () => {
    setIsPasswordDialogOpen(true);
    setPassword("");
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password === "Ron@ldo2789") {
      setIsPasswordDialogOpen(false);
      navigate("/auth");
    } else {
      toast({
        variant: "destructive",
        title: "Acesso Negado",
        description: "Senha inválida. Entre em contato com o administrador do sistema.",
      });
      setPassword("");
    }
  };

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
              onClick={handleAccessDashboard}
              className="text-base px-8"
            >
              Acessar Dashboard
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="text-base px-8"
              onClick={() => setIsAboutDialogOpen(true)}
            >
              Saiba Mais
            </Button>
            <Button 
              size="lg" 
              variant="secondary"
              className="text-base px-8"
              onClick={() => navigate("/pricing")}
            >
              Ver Planos
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

      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Acesso ao Sistema</DialogTitle>
            <DialogDescription>
              Digite a senha para acessar o dashboard
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <Input
              type="password"
              placeholder="Digite a senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
            />
            <div className="flex gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsPasswordDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">
                Acessar
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isAboutDialogOpen} onOpenChange={setIsAboutDialogOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Sobre o Sistema de Gestão de Projetos</DialogTitle>
            <DialogDescription className="text-base mt-4">
              Uma plataforma completa para gerenciar seus projetos de forma estratégica e eficiente
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 mt-4">
            <div>
              <h3 className="font-semibold text-lg text-foreground mb-2">O que é?</h3>
              <p className="text-muted-foreground leading-relaxed">
                Nossa plataforma é uma solução completa de gestão de projetos que combina metodologias ágeis 
                com governança corporativa. Desenvolvida para atender desde pequenas equipes até grandes organizações, 
                oferece ferramentas avançadas para planejamento, execução e monitoramento de projetos complexos.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg text-foreground mb-3">Principais Funcionalidades</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div key={index} className="flex gap-3 p-3 rounded-lg bg-muted/50">
                      <div className="p-2 rounded-lg bg-primary/10 h-fit">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground mb-1">{feature.title}</h4>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg text-foreground mb-2">Benefícios</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-muted-foreground">
                  <div className="rounded-full bg-success/10 p-1 mt-0.5">
                    <Check className="h-3 w-3 text-success" />
                  </div>
                  <span>Aumente a produtividade da equipe em até 40% com automação inteligente</span>
                </li>
                <li className="flex items-start gap-2 text-muted-foreground">
                  <div className="rounded-full bg-success/10 p-1 mt-0.5">
                    <Check className="h-3 w-3 text-success" />
                  </div>
                  <span>Reduza riscos e conflitos com detecção automática e alertas proativos</span>
                </li>
                <li className="flex items-start gap-2 text-muted-foreground">
                  <div className="rounded-full bg-success/10 p-1 mt-0.5">
                    <Check className="h-3 w-3 text-success" />
                  </div>
                  <span>Melhore a comunicação com stakeholders através de dashboards em tempo real</span>
                </li>
                <li className="flex items-start gap-2 text-muted-foreground">
                  <div className="rounded-full bg-success/10 p-1 mt-0.5">
                    <Check className="h-3 w-3 text-success" />
                  </div>
                  <span>Tome decisões baseadas em dados com KPIs e métricas personalizadas</span>
                </li>
                <li className="flex items-start gap-2 text-muted-foreground">
                  <div className="rounded-full bg-success/10 p-1 mt-0.5">
                    <Check className="h-3 w-3 text-success" />
                  </div>
                  <span>Garanta compliance e governança com gestão integrada de riscos e issues</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg text-foreground mb-2">Para quem é?</h3>
              <p className="text-muted-foreground leading-relaxed">
                Ideal para gerentes de projeto, PMOs, diretores de operações e equipes que precisam de 
                visibilidade completa sobre seus projetos. Desde startups ágeis até grandes corporações 
                com múltiplos projetos simultâneos.
              </p>
            </div>

            <div className="flex gap-3 pt-4 border-t border-border">
              <Button 
                className="flex-1" 
                onClick={() => {
                  setIsAboutDialogOpen(false);
                  navigate("/pricing");
                }}
              >
                Ver Planos e Preços
              </Button>
              <Button 
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setIsAboutDialogOpen(false);
                  handleAccessDashboard();
                }}
              >
                Acessar Agora
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
