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
      <h3 className="text-lg font-semibold mb-6">Matriz Poder vs Interesse</h3>
      <div className="relative w-full min-h-[500px] aspect-square bg-gradient-to-br from-background to-muted rounded-lg border-2 border-border overflow-hidden">
        {/* Eixos principais */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-foreground/80" />
        <div className="absolute top-0 bottom-0 left-0 w-1 bg-foreground/80" />
        
        {/* Labels dos eixos - maiores e mais visíveis */}
        <div className="absolute bottom-4 right-4 text-sm font-medium text-foreground bg-background/80 px-2 py-1 rounded">
          Alto Interesse →
        </div>
        <div className="absolute top-4 left-4 text-sm font-medium text-foreground bg-background/80 px-2 py-1 rounded rotate-90 origin-left">
          Alto Poder →
        </div>

        {/* Grid lines - mais visíveis */}
        {[1, 2, 3, 4].map((i) => (
          <div key={`h-${i}`}>
            <div
              className="absolute left-0 right-0 h-px bg-border/50"
              style={{ bottom: `${i * 20}%` }}
            />
            <div
              className="absolute top-0 bottom-0 w-px bg-border/50"
              style={{ left: `${i * 20}%` }}
            />
          </div>
        ))}

        {/* Quadrantes com labels - maiores e mais destacados */}
        <div className="absolute top-2 right-2 text-xs font-semibold text-critical p-2 bg-critical/20 border border-critical rounded shadow-sm">
          Gerenciar de Perto
        </div>
        <div className="absolute top-2 left-2 text-xs font-semibold text-warning p-2 bg-warning/20 border border-warning rounded shadow-sm">
          Manter Satisfeito
        </div>
        <div className="absolute bottom-2 right-2 text-xs font-semibold text-primary p-2 bg-primary/20 border border-primary rounded shadow-sm">
          Manter Informado
        </div>
        <div className="absolute bottom-2 left-2 text-xs font-semibold text-muted-foreground p-2 bg-muted border border-border rounded shadow-sm">
          Monitorar
        </div>

        {/* Stakeholders - badges maiores */}
        {stakeholders.map((stakeholder) => (
          <div
            key={stakeholder.id}
            className="absolute cursor-pointer hover:scale-110 transition-transform z-10"
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
              )} cursor-pointer whitespace-nowrap text-sm px-3 py-1.5 shadow-md hover:shadow-lg transition-shadow`}
            >
              {stakeholder.name.split(" ")[0]}
            </Badge>
          </div>
        ))}
      </div>
      <div className="mt-4 text-sm text-muted-foreground">
        <p>Clique nos stakeholders para ver detalhes</p>
      </div>
    </Card>
  );
};
