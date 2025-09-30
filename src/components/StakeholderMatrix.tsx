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
      <h3 className="text-lg font-semibold mb-4">Matriz Poder vs Interesse</h3>
      <div className="relative w-full aspect-square bg-gradient-to-br from-background to-muted rounded-lg border-2 overflow-hidden">
        {/* Eixos */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-border" />
        <div className="absolute top-0 bottom-0 left-0 w-0.5 bg-border" />
        
        {/* Labels dos eixos */}
        <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
          Alto Interesse →
        </div>
        <div className="absolute top-2 left-2 text-xs text-muted-foreground rotate-90 origin-left">
          Alto Poder →
        </div>

        {/* Grid lines */}
        {[1, 2, 3, 4].map((i) => (
          <div key={`h-${i}`}>
            <div
              className="absolute left-0 right-0 h-px bg-border/30"
              style={{ bottom: `${i * 20}%` }}
            />
            <div
              className="absolute top-0 bottom-0 w-px bg-border/30"
              style={{ left: `${i * 20}%` }}
            />
          </div>
        ))}

        {/* Quadrantes com labels */}
        <div className="absolute top-1 right-1 text-[10px] font-medium text-critical p-1 bg-critical-light/50 rounded">
          Gerenciar de Perto
        </div>
        <div className="absolute top-1 left-1 text-[10px] font-medium text-warning p-1 bg-warning-light/50 rounded">
          Manter Satisfeito
        </div>
        <div className="absolute bottom-1 right-1 text-[10px] font-medium text-primary p-1 bg-primary-light/50 rounded">
          Manter Informado
        </div>
        <div className="absolute bottom-1 left-1 text-[10px] font-medium text-muted-foreground p-1 bg-muted/50 rounded">
          Monitorar
        </div>

        {/* Stakeholders */}
        {stakeholders.map((stakeholder) => (
          <div
            key={stakeholder.id}
            className="absolute cursor-pointer hover:scale-110 transition-transform"
            style={{
              left: getPosition(stakeholder.interest_level),
              bottom: getPosition(stakeholder.power_level),
              transform: "translate(-50%, 50%)",
            }}
            onClick={() => onStakeholderClick?.(stakeholder)}
            title={`${stakeholder.name} - ${stakeholder.role}`}
          >
            <Badge
              className={`${getQuadrantColor(
                stakeholder.power_level,
                stakeholder.interest_level
              )} cursor-pointer whitespace-nowrap`}
            >
              {stakeholder.name.split(" ")[0]}
            </Badge>
          </div>
        ))}
      </div>
      <div className="mt-4 text-xs text-muted-foreground">
        <p>Clique nos stakeholders para ver detalhes</p>
      </div>
    </Card>
  );
};
