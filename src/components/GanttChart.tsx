import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle2, Clock } from "lucide-react";

interface Task {
  id: string;
  wbs: string;
  name: string;
  startDate: string;
  endDate: string;
  duration: number;
  progress: number;
  isCritical: boolean;
  status: "not-started" | "in-progress" | "completed";
  dependencies?: string[];
}

interface GanttChartProps {
  tasks: Task[];
}

export const GanttChart = ({ tasks }: GanttChartProps) => {
  // Calcular range de datas para o timeline
  const allDates = tasks.flatMap((t) => [new Date(t.startDate), new Date(t.endDate)]);
  const minDate = new Date(Math.min(...allDates.map((d) => d.getTime())));
  const maxDate = new Date(Math.max(...allDates.map((d) => d.getTime())));
  
  const totalDays = Math.ceil((maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24));
  const months: string[] = [];
  
  // Gerar meses para o header
  let currentDate = new Date(minDate);
  while (currentDate <= maxDate) {
    const monthYear = currentDate.toLocaleDateString("pt-BR", { month: "short", year: "numeric" });
    if (!months.includes(monthYear)) {
      months.push(monthYear);
    }
    currentDate.setMonth(currentDate.getMonth() + 1);
  }

  const calculatePosition = (date: string) => {
    const taskDate = new Date(date);
    const daysDiff = Math.ceil((taskDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24));
    return (daysDiff / totalDays) * 100;
  };

  const calculateWidth = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const duration = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return (duration / totalDays) * 100;
  };

  const getStatusIcon = (status: Task["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-success" />;
      case "in-progress":
        return <Clock className="h-4 w-4 text-warning" />;
      default:
        return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className="flex">
        {/* Coluna de tarefas */}
        <div className="w-96 border-r bg-muted/30">
          <div className="h-16 border-b bg-card flex items-center px-4 font-semibold text-sm sticky top-0">
            <div className="w-16">WBS</div>
            <div className="flex-1">Tarefa</div>
            <div className="w-20 text-center">Duração</div>
          </div>
          <div className="divide-y">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="h-12 flex items-center px-4 hover:bg-muted/50 transition-colors text-sm group"
              >
                <div className="w-16 font-mono text-muted-foreground">{task.wbs}</div>
                <div className="flex-1 flex items-center gap-2 min-w-0">
                  {getStatusIcon(task.status)}
                  <span className="truncate font-medium">{task.name}</span>
                  {task.isCritical && (
                    <Badge variant="outline" className="bg-critical-light text-critical border-critical/20 text-xs">
                      Crítica
                    </Badge>
                  )}
                </div>
                <div className="w-20 text-center text-muted-foreground">
                  {task.duration}d
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline Gantt */}
        <div className="flex-1 overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Header de meses */}
            <div className="h-16 border-b bg-card flex sticky top-0">
              {months.map((month, idx) => (
                <div
                  key={idx}
                  className="flex-1 flex items-center justify-center text-sm font-semibold border-l first:border-l-0"
                >
                  {month}
                </div>
              ))}
            </div>

            {/* Barras do Gantt */}
            <div className="divide-y relative">
              {/* Grid de fundo */}
              <div className="absolute inset-0 flex pointer-events-none">
                {months.map((_, idx) => (
                  <div key={idx} className="flex-1 border-l first:border-l-0" />
                ))}
              </div>

              {tasks.map((task) => {
                const left = calculatePosition(task.startDate);
                const width = calculateWidth(task.startDate, task.endDate);

                return (
                  <div key={task.id} className="h-12 relative group">
                    <div
                      className="absolute top-1/2 -translate-y-1/2 h-8 rounded-md transition-all duration-300 group-hover:h-9 cursor-pointer overflow-hidden"
                      style={{
                        left: `${left}%`,
                        width: `${width}%`,
                        minWidth: "40px",
                      }}
                    >
                      <div
                        className={`h-full rounded-md border-2 relative ${
                          task.isCritical
                            ? "bg-critical/20 border-critical"
                            : "bg-primary-light border-primary"
                        }`}
                      >
                        <div
                          className={`h-full rounded-md transition-all duration-500 ${
                            task.isCritical ? "bg-critical" : "bg-gradient-primary"
                          }`}
                          style={{ width: `${task.progress}%` }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-foreground">
                          {task.progress}%
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
