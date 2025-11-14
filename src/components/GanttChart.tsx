import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Plus, ChevronDown, ChevronRight, ZoomIn, ZoomOut, Maximize2 } from "lucide-react";
import { useState } from "react";

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
  resources?: string;
  color?: string;
  children?: Task[];
  actualEndDate?: string;
}

interface GanttChartProps {
  tasks: Task[];
}

export const GanttChart = ({ tasks }: GanttChartProps) => {
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());
  const [zoomLevel, setZoomLevel] = useState(1);

  const toggleExpand = (taskId: string) => {
    const newExpanded = new Set(expandedTasks);
    if (newExpanded.has(taskId)) {
      newExpanded.delete(taskId);
    } else {
      newExpanded.add(taskId);
    }
    setExpandedTasks(newExpanded);
  };

  const expandAll = () => {
    const allIds = new Set(tasks.map(t => t.id));
    setExpandedTasks(allIds);
  };

  const collapseAll = () => {
    setExpandedTasks(new Set());
  };

  const sortedTasks = [...tasks];

  // Calcular range de datas para o timeline
  const allDates = sortedTasks.flatMap((t) => [new Date(t.startDate), new Date(t.endDate)]);
  const minDate = new Date(Math.min(...allDates.map((d) => d.getTime())));
  const maxDate = new Date(Math.max(...allDates.map((d) => d.getTime())));
  
  const totalDays = Math.ceil((maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24));
  
  // Gerar semanas para o header
  const weeks: { start: Date; days: Date[] }[] = [];
  let currentDate = new Date(minDate);
  
  while (currentDate <= maxDate) {
    const weekStart = new Date(currentDate);
    const days: Date[] = [];
    
    for (let i = 0; i < 7 && currentDate <= maxDate; i++) {
      days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    weeks.push({ start: weekStart, days });
  }

  // Criar mapa de índices de tarefas para desenhar dependências
  const taskIndexMap = new Map(sortedTasks.map((task, idx) => [task.id, idx]));

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

  const getTaskColor = (task: Task) => {
    if (task.color) return task.color;
    if (task.isCritical) return "#ef4444";
    return "hsl(var(--primary))";
  };

  return (
    <Card className="overflow-hidden">
      {/* Toolbar */}
      <div className="h-12 border-b bg-muted/30 flex items-center gap-2 px-4">
        <Button variant="ghost" size="sm" className="h-8">
          <Plus className="h-4 w-4 mr-1" />
          Add
        </Button>
        <Button variant="ghost" size="sm" className="h-8" onClick={expandAll}>
          Expand all
        </Button>
        <Button variant="ghost" size="sm" className="h-8" onClick={collapseAll}>
          Collapse all
        </Button>
        <div className="w-px h-6 bg-border mx-1" />
        <Button variant="ghost" size="sm" className="h-8" onClick={() => setZoomLevel(Math.min(zoomLevel + 0.2, 2))}>
          <ZoomIn className="h-4 w-4 mr-1" />
          Zoom in
        </Button>
        <Button variant="ghost" size="sm" className="h-8" onClick={() => setZoomLevel(Math.max(zoomLevel - 0.2, 0.5))}>
          <ZoomOut className="h-4 w-4 mr-1" />
          Zoom out
        </Button>
        <Button variant="ghost" size="sm" className="h-8" onClick={() => setZoomLevel(1)}>
          <Maximize2 className="h-4 w-4 mr-1" />
          Zoom to fit
        </Button>
      </div>

      <div className="flex">
        {/* Coluna de tarefas */}
        <div className="border-r bg-background">
          {/* Header */}
          <div className="h-[72px] border-b bg-muted/30 flex items-center text-xs font-semibold sticky top-0">
            <div className="w-12 text-center border-r">ID</div>
            <div className="w-48 px-3 border-r">Task Name</div>
            <div className="w-28 text-center border-r">Start</div>
            <div className="w-28 text-center border-r">End</div>
            <div className="w-24 text-center border-r">Duration</div>
            <div className="w-24 text-center border-r">Progress %</div>
            <div className="w-24 text-center border-r">Dependency</div>
            <div className="w-32 text-center border-r">Resources</div>
            <div className="w-20 text-center border-r">Color</div>
          </div>

          {/* Rows */}
          <div>
            {sortedTasks.map((task, idx) => (
              <div
                key={task.id}
                className="h-12 flex items-center text-xs hover:bg-muted/50 transition-colors border-b"
              >
                <div className="w-12 text-center border-r font-mono text-muted-foreground">{idx + 1}</div>
                <div className="w-48 px-3 border-r flex items-center gap-1">
                  {task.children && task.children.length > 0 && (
                    <button onClick={() => toggleExpand(task.id)} className="p-0.5">
                      {expandedTasks.has(task.id) ? (
                        <ChevronDown className="h-3 w-3" />
                      ) : (
                        <ChevronRight className="h-3 w-3" />
                      )}
                    </button>
                  )}
                  <span className="truncate font-medium">{task.name}</span>
                </div>
                <div className="w-28 text-center border-r text-muted-foreground">
                  {new Date(task.startDate).toLocaleDateString("en-CA")}
                </div>
                <div className="w-28 text-center border-r text-muted-foreground">
                  {new Date(task.endDate).toLocaleDateString("en-CA")}
                </div>
                <div className="w-24 text-center border-r text-muted-foreground">
                  {task.duration} days
                </div>
                <div className="w-24 text-center border-r">{task.progress}</div>
                <div className="w-24 text-center border-r text-muted-foreground">
                  {task.dependencies?.join(", ") || ""}
                </div>
                <div className="w-32 text-center border-r text-muted-foreground truncate px-2">
                  {task.resources || ""}
                </div>
                <div className="w-20 flex items-center justify-center border-r">
                  <div
                    className="w-6 h-6 rounded border"
                    style={{ backgroundColor: getTaskColor(task) }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline Gantt */}
        <div className="flex-1 overflow-x-auto">
          <div style={{ minWidth: `${800 * zoomLevel}px` }}>
            {/* Header de semanas e dias */}
            <div className="h-[72px] border-b bg-muted/30 sticky top-0">
              {/* Linha de semanas */}
              <div className="h-9 flex border-b">
                {weeks.map((week, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-center text-xs font-semibold border-r"
                    style={{ width: `${(week.days.length / totalDays) * 100}%` }}
                  >
                    {week.start.toLocaleDateString("pt-BR", { month: "short", day: "2-digit", year: "numeric" })}
                  </div>
                ))}
              </div>
              {/* Linha de dias */}
              <div className="h-9 flex">
                {weeks.flatMap((week) =>
                  week.days.map((day, dayIdx) => (
                    <div
                      key={`${week.start.getTime()}-${dayIdx}`}
                      className="flex items-center justify-center text-xs border-r"
                      style={{ width: `${(1 / totalDays) * 100}%` }}
                    >
                      {day.getDate()}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Barras do Gantt */}
            <div className="relative">
              {/* Grid de fundo */}
              <div className="absolute inset-0 flex pointer-events-none">
                {weeks.flatMap((week) =>
                  week.days.map((_, dayIdx) => (
                    <div
                      key={`grid-${week.start.getTime()}-${dayIdx}`}
                      className="border-r h-full"
                      style={{ width: `${(1 / totalDays) * 100}%` }}
                    />
                  ))
                )}
              </div>

              {/* Linhas de dependência */}
              <svg className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
                {sortedTasks.map((task, taskIdx) => {
                  if (!task.dependencies || task.dependencies.length === 0) return null;
                  
                  return task.dependencies.map((depId) => {
                    const depTask = sortedTasks.find((t) => t.id === depId);
                    if (!depTask) return null;

                    const depIndex = sortedTasks.indexOf(depTask);
                    const sourceY = (depIndex * 48) + 24 + 72;
                    const targetY = (taskIdx * 48) + 24 + 72;
                    
                    const sourceX = calculatePosition(depTask.endDate);
                    const targetX = calculatePosition(task.startDate);

                    return (
                      <g key={`${task.id}-${depId}`}>
                        <defs>
                          <marker
                            id={`arrow-${task.id}-${depId}`}
                            markerWidth="10"
                            markerHeight="10"
                            refX="9"
                            refY="3"
                            orient="auto"
                            markerUnits="strokeWidth"
                          >
                            <path d="M0,0 L0,6 L9,3 z" fill="#3b82f6" />
                          </marker>
                        </defs>
                        <path
                          d={`M ${sourceX}% ${sourceY} L ${(sourceX + targetX) / 2}% ${sourceY} L ${(sourceX + targetX) / 2}% ${targetY} L ${targetX}% ${targetY}`}
                          stroke="#3b82f6"
                          strokeWidth="2"
                          fill="none"
                          markerEnd={`url(#arrow-${task.id}-${depId})`}
                          opacity="0.6"
                        />
                      </g>
                    );
                  });
                })}
              </svg>

              {/* Barras de tarefas */}
              {sortedTasks.map((task) => {
                const left = calculatePosition(task.startDate);
                const width = calculateWidth(task.startDate, task.endDate);

                return (
                  <div key={task.id} className="h-12 relative border-b">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div
                            className="absolute top-1/2 -translate-y-1/2 h-7 rounded cursor-pointer"
                            style={{
                              left: `${left}%`,
                              width: `${width}%`,
                              minWidth: "40px",
                              backgroundColor: getTaskColor(task),
                              opacity: 0.9,
                            }}
                          >
                            <div className="absolute inset-0 flex items-center justify-center text-[10px] font-semibold text-white">
                              {task.progress}%
                            </div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="space-y-1">
                            <div className="font-semibold">{task.name}</div>
                            <div className="text-xs">
                              {new Date(task.startDate).toLocaleDateString("pt-BR")} - {new Date(task.endDate).toLocaleDateString("pt-BR")}
                            </div>
                            <div className="text-xs">Progresso: {task.progress}%</div>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
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
