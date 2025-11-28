import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { FolderKanban, Calendar, Users, BarChart3, Shield, Workflow, Check, ArrowRight, Lock } from "lucide-react";
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
        description: "Senha incorreta. Tente novamente.",
      });
      setPassword("");
    }
  };

  const features = [
    {
      icon: FolderKanban,
      title: "Gestão Centralizada",
      description: "Controle todos os seus projetos em um único lugar com visão 360°."
    },
    {
      icon: Calendar,
      title: "Cronogramas Dinâmicos",
      description: "Gantt interativo com arrastar e soltar para ajustes rápidos."
    },
    {
      icon: Users,
      title: "Colaboração em Equipe",
      description: "Mantenha todos alinhados com atualizações em tempo real."
    },
    {
      icon: BarChart3,
      title: "Analytics Avançado",
      description: "Dashboards automáticos com métricas cruciais de desempenho."
    },
    {
      icon: Shield,
      title: "Segurança e Governança",
      description: "Controle de acesso granular e auditoria completa de ações."
    },
    {
      icon: Workflow,
      title: "Fluxos Automatizados",
      description: "Reduza o trabalho manual com automações inteligentes."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 selection:bg-purple-500/30">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[120px]" />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 border-b border-white/10 bg-slate-950/50 backdrop-blur-md">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-tr from-purple-500 to-blue-500 p-2 rounded-lg">
              <FolderKanban className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">Project Tempo</span>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              className="text-slate-300 hover:text-white hover:bg-white/5"
              onClick={() => setIsAboutDialogOpen(true)}
            >
              Sobre
            </Button>
            <Button
              className="bg-white text-slate-950 hover:bg-slate-200 font-medium"
              onClick={handleAccessDashboard}
            >
              Entrar
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 container mx-auto px-6 pt-24 pb-20 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-8 animate-fade-in">
          <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-sm font-medium text-slate-300">Nova versão 2.0 disponível</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400 max-w-4xl mx-auto leading-tight">
          A evolução da gestão de projetos complexos
        </h1>

        <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Uma plataforma poderosa que une simplicidade e controle.
          Planeje, execute e entregue com precisão cirúrgica.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            size="lg"
            className="h-12 px-8 text-base bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 border-0 shadow-lg shadow-purple-500/20 transition-all hover:scale-105"
            onClick={handleAccessDashboard}
          >
            Começar Agora
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-12 px-8 text-base border-white/10 bg-white/5 hover:bg-white/10 text-white backdrop-blur-sm"
            onClick={() => setIsAboutDialogOpen(true)}
          >
            Saiba Mais
          </Button>
        </div>
      </div>

      {/* Features Grid */}
      <div className="relative z-10 container mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className="group border-white/5 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 hover:-translate-y-1"
              >
                <CardContent className="p-6">
                  <div className="mb-4 inline-flex p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 group-hover:from-purple-500/30 group-hover:to-blue-500/30 transition-colors">
                    <Icon className="h-6 w-6 text-purple-400 group-hover:text-purple-300" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-slate-400 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Stats Section */}
      <div className="relative z-10 border-y border-white/5 bg-white/5 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-white mb-2">+500</div>
              <div className="text-sm text-slate-400 uppercase tracking-wider">Projetos Entregues</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">98%</div>
              <div className="text-sm text-slate-400 uppercase tracking-wider">Satisfação dos Clientes</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">24/7</div>
              <div className="text-sm text-slate-400 uppercase tracking-wider">Disponibilidade</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 container mx-auto px-6 py-8 text-center text-slate-500 text-sm">
        <p>© 2025 Project Tempo Engine. Todos os direitos reservados.</p>
      </footer>

      {/* Password Dialog */}
      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <DialogContent className="sm:max-w-md bg-slate-900 border-white/10 text-white">
          <DialogHeader>
            <div className="mx-auto bg-white/10 p-3 rounded-full mb-4 w-fit">
              <Lock className="h-6 w-6 text-purple-400" />
            </div>
            <DialogTitle className="text-center text-xl">Área Restrita</DialogTitle>
            <DialogDescription className="text-center text-slate-400">
              Digite sua credencial de acesso para continuar.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handlePasswordSubmit} className="space-y-4 mt-4">
            <Input
              type="password"
              placeholder="Senha de acesso"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
              className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-purple-500"
            />
            <div className="flex gap-2 justify-end">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsPasswordDialogOpen(false)}
                className="text-slate-400 hover:text-white hover:bg-white/5"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-purple-600 hover:bg-purple-500 text-white"
              >
                Acessar
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* About Dialog */}
      <Dialog open={isAboutDialogOpen} onOpenChange={setIsAboutDialogOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto bg-slate-900 border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl">Sobre a Plataforma</DialogTitle>
            <DialogDescription className="text-base mt-2 text-slate-400">
              Solução enterprise para gestão de portfólio e projetos.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-8 mt-6">
            <div>
              <h3 className="font-semibold text-lg text-white mb-3">Por que escolher o Project Tempo?</h3>
              <p className="text-slate-400 leading-relaxed">
                Desenvolvemos uma arquitetura focada em performance e usabilidade.
                Diferente de ferramentas tradicionais, nossa plataforma se adapta ao seu fluxo de trabalho,
                permitindo desde uma gestão ágil simples até governança corporativa complexa.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div key={index} className="flex gap-3 p-4 rounded-lg bg-white/5 border border-white/5">
                  <feature.icon className="h-5 w-5 text-purple-400 shrink-0" />
                  <div>
                    <h4 className="font-medium text-white mb-1">{feature.title}</h4>
                    <p className="text-sm text-slate-400">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3 pt-6 border-t border-white/10">
              <Button
                className="flex-1 bg-purple-600 hover:bg-purple-500"
                onClick={() => {
                  setIsAboutDialogOpen(false);
                  handleAccessDashboard();
                }}
              >
                Acessar Sistema
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-white/10 bg-transparent hover:bg-white/5 text-white"
                onClick={() => setIsAboutDialogOpen(false)}
              >
                Fechar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
