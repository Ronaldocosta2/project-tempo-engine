import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Pricing() {
  const navigate = useNavigate();

  const plans = [
    {
      name: "Básico",
      price: "R$ 299",
      period: "/mês",
      description: "Ideal para pequenas equipes e projetos iniciais",
      features: [
        "Até 5 projetos ativos",
        "10 usuários incluídos",
        "Gestão de tarefas e cronograma",
        "Análise de stakeholders básica",
        "Suporte por email",
        "5GB de armazenamento"
      ],
      popular: false,
      buttonText: "Começar Agora"
    },
    {
      name: "Profissional",
      price: "R$ 799",
      period: "/mês",
      description: "Para equipes que precisam de recursos avançados",
      features: [
        "Projetos ilimitados",
        "50 usuários incluídos",
        "Gestão completa de projetos",
        "Análise avançada de stakeholders",
        "Gestão de riscos e issues",
        "KPIs e métricas em tempo real",
        "Automação de workflows",
        "Suporte prioritário",
        "50GB de armazenamento",
        "Relatórios personalizados"
      ],
      popular: true,
      buttonText: "Mais Popular"
    },
    {
      name: "Enterprise",
      price: "Personalizado",
      period: "",
      description: "Solução completa para grandes organizações",
      features: [
        "Tudo do plano Profissional",
        "Usuários ilimitados",
        "Análise cross-project",
        "Integração com sistemas legados",
        "API dedicada",
        "Suporte 24/7 com SLA",
        "Armazenamento ilimitado",
        "Treinamento presencial",
        "Gerente de conta dedicado",
        "Customizações sob demanda"
      ],
      popular: false,
      buttonText: "Falar com Vendas"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10">
      <div className="container mx-auto px-6 py-12 max-w-7xl">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-8"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>

        <div className="text-center space-y-4 mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <span className="text-sm font-medium text-primary">Planos e Preços</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            Escolha o Plano Ideal
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mt-2">
              Para Sua Organização
            </span>
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Planos flexíveis que crescem com sua empresa. Todos incluem atualizações gratuitas e suporte técnico.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative border-border/50 bg-card/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover-scale ${
                plan.popular ? "border-primary/50 shadow-lg" : ""
              }`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-secondary text-primary-foreground border-0">
                  Mais Popular
                </Badge>
              )}
              
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription className="mt-2">{plan.description}</CardDescription>
                <div className="mt-6">
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  {plan.period && (
                    <span className="text-muted-foreground ml-1">{plan.period}</span>
                  )}
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                        <Check className="h-3 w-3 text-primary" />
                      </div>
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                <Button
                  className="w-full"
                  variant={plan.popular ? "default" : "outline"}
                  size="lg"
                  onClick={() => navigate("/auth")}
                >
                  {plan.buttonText}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center space-y-4 animate-fade-in" style={{ animationDelay: "0.4s" }}>
          <h2 className="text-2xl font-bold text-foreground">Tem dúvidas?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Nossa equipe está pronta para ajudar você a escolher o melhor plano para suas necessidades.
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <Button size="lg" variant="outline">
              Falar com Vendas
            </Button>
            <Button size="lg" variant="ghost">
              Ver FAQ
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
