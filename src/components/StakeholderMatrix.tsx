import { Stakeholder } from "@/hooks/useStakeholders";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface StakeholderMatrixProps {
  stakeholders: Stakeholder[];
  onStakeholderClick?: (stakeholder: Stakeholder) => void;
}

export const StakeholderMatrix = ({ stakeholders, onStakeholderClick }: StakeholderMatrixProps) => {
  const getQuadrantTitle = (power: number, interest: number) => {
    if (power >= 4 && interest >= 4) return "Gerenciar de Perto";
    if (power >= 4 && interest < 4) return "Manter Satisfeito";
    if (power < 4 && interest >= 4) return "Manter Informado";
    return "Monitorar";
  };

  const getQuadrantColor = (power: number, interest: number) => {
    if (power >= 4 && interest >= 4) return "bg-critical-light border-critical";
    if (power >= 4 && interest < 4) return "bg-warning-light border-warning";
    if (power < 4 && interest >= 4) return "bg-primary-light border-primary";
    return "bg-muted border-border";
  };

  const getPosition = (level: number) => {
    return `${(level - 1) * 25}%`;
  };

  return (
    <Card className="p-6">
      <h3 className="text-xl font-bold mb-2">Matriz Poder vs Interesse</h3>
      <p className="text-sm text-muted-foreground mb-6">
        Análise de stakeholders por nível de poder e interesse no projeto
      </p>
      
      <div className="relative w-full min-h-[600px] bg-background rounded-lg border-2 border-border overflow-hidden">
        {/* Quadrantes coloridos de fundo */}
        <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
          {/* Bottom Left - Monitorar */}
          <div className="bg-muted/30" />
          {/* Bottom Right - Manter Informado */}
          <div className="bg-primary/10" />
          {/* Top Left - Manter Satisfeito */}
          <div className="bg-warning/10" />
          {/* Top Right - Gerenciar de Perto */}
          <div className="bg-critical/10" />
        </div>

        {/* Eixos principais - mais grossos e destacados */}
        <div className="absolute bottom-1/2 left-0 right-0 h-1 bg-foreground z-10" />
        <div className="absolute top-0 bottom-0 left-1/2 w-1 bg-foreground z-10" />
        
        {/* Labels dos eixos - muito mais visíveis */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-base font-bold text-foreground bg-background px-4 py-2 rounded-lg border-2 border-border shadow-lg z-20">
          INTERESSE →
        </div>
        <div className="absolute top-1/2 left-4 transform -translate-y-1/2 -rotate-90 text-base font-bold text-foreground bg-background px-4 py-2 rounded-lg border-2 border-border shadow-lg z-20">
          PODER →
        </div>

        {/* Grid lines secundárias */}
        {[25, 75].map((i) => (
          <div key={`grid-${i}`}>
            <div
              className="absolute left-0 right-0 h-px bg-border/40"
              style={{ top: `${i}%` }}
            />
            <div
              className="absolute top-0 bottom-0 w-px bg-border/40"
              style={{ left: `${i}%` }}
            />
          </div>
        ))}

        {/* Labels dos quadrantes - muito maiores e mais destacados */}
        <div className="absolute top-8 right-8 z-20">
          <div className="bg-critical/90 text-white p-4 rounded-lg shadow-lg border-2 border-critical">
            <div className="text-lg font-bold mb-1">Gerenciar de Perto</div>
            <div className="text-xs opacity-90">Alto Poder + Alto Interesse</div>
          </div>
        </div>
        
        <div className="absolute top-8 left-8 z-20">
          <div className="bg-warning/90 text-white p-4 rounded-lg shadow-lg border-2 border-warning">
            <div className="text-lg font-bold mb-1">Manter Satisfeito</div>
            <div className="text-xs opacity-90">Alto Poder + Baixo Interesse</div>
          </div>
        </div>
        
        <div className="absolute bottom-8 right-8 z-20">
          <div className="bg-primary/90 text-white p-4 rounded-lg shadow-lg border-2 border-primary">
            <div className="text-lg font-bold mb-1">Manter Informado</div>
            <div className="text-xs opacity-90">Baixo Poder + Alto Interesse</div>
          </div>
        </div>
        
        <div className="absolute bottom-8 left-8 z-20">
          <div className="bg-muted-foreground/80 text-white p-4 rounded-lg shadow-lg border-2 border-muted-foreground">
            <div className="text-lg font-bold mb-1">Monitorar</div>
            <div className="text-xs opacity-90">Baixo Poder + Baixo Interesse</div>
          </div>
        </div>

        {/* Stakeholders - badges muito maiores e mais visíveis */}
        {stakeholders.map((stakeholder) => (
          <div
            key={stakeholder.id}
            className="absolute cursor-pointer hover:scale-125 transition-all duration-200 z-30"
            style={{
              left: getPosition(stakeholder.interest_level),
              bottom: getPosition(stakeholder.power_level),
              transform: "translate(-50%, 50%)",
            }}
            onClick={() => onStakeholderClick?.(stakeholder)}
            title={`${stakeholder.name} - ${stakeholder.role}\nPoder: ${stakeholder.power_level}/5 | Interesse: ${stakeholder.interest_level}/5`}
          >
            <Badge
              className={`${getQuadrantColor(
                stakeholder.power_level,
                stakeholder.interest_level
              )} cursor-pointer whitespace-nowrap text-base font-bold px-4 py-2 shadow-xl hover:shadow-2xl transition-all border-2`}
            >
              {stakeholder.name.split(" ")[0]}
            </Badge>
          </div>
        ))}

        {/* Legendas de escala */}
        <div className="absolute bottom-2 left-2 text-xs font-medium text-muted-foreground bg-background/80 px-2 py-1 rounded z-20">
          Baixo (1-3)
        </div>
        <div className="absolute bottom-2 right-2 text-xs font-medium text-muted-foreground bg-background/80 px-2 py-1 rounded z-20">
          Alto (4-5)
        </div>
        <div className="absolute top-2 left-2 text-xs font-medium text-muted-foreground bg-background/80 px-2 py-1 rounded z-20">
          Baixo (1-3)
        </div>
        <div className="absolute top-2 right-2 text-xs font-medium text-muted-foreground bg-background/80 px-2 py-1 rounded z-20">
          Alto (4-5)
        </div>
      </div>
      
      <div className="mt-6 space-y-2">
        <div className="text-sm font-medium text-foreground">
          Clique nos stakeholders para ver detalhes completos
        </div>
        <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-critical" />
            <span>Gerenciar de Perto ({stakeholders.filter(s => s.power_level >= 4 && s.interest_level >= 4).length})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-warning" />
            <span>Manter Satisfeito ({stakeholders.filter(s => s.power_level >= 4 && s.interest_level < 4).length})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span>Manter Informado ({stakeholders.filter(s => s.power_level < 4 && s.interest_level >= 4).length})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-muted-foreground" />
            <span>Monitorar ({stakeholders.filter(s => s.power_level < 4 && s.interest_level < 4).length})</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
