import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Plus, ChevronDown, ChevronRight, ZoomIn, ZoomOut, Maximize2, Upload, MoreHorizontal, GripVertical } from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import { GanttImportDialog } from "./GanttImportDialog";
import { calculateAllTasksProgress } from "@/lib/ganttFileParser";
import { Badge } from "@/components/ui/badge";

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
  onTasksChange?: (tasks: Task[]) => void;
  onTaskUpdate?: (taskId: string, updates: Partial<Task>) => void;
}

type ZoomMode = 'day' | 'month' | 'quarter';

interface DragState {
  type: 'move' | 'resize-start' | 'resize-end' | 'progress';
  taskId: string;
  startX: number;
  originalStart: Date;
  originalEnd: Date;
  originalProgress: number;
}

export const GanttChart = ({ tasks, onTasksChange, onTaskUpdate }: GanttChartProps) => {
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());
  const [zoomMode, setZoomMode] = useState<ZoomMode>('month');
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [editingCell, setEditingCell] = useState<{ taskId: string; field: string } | null>(null);
  const [editValue, setEditValue] = useState<string>("");

  // Drag & Drop State
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [tempTaskState, setTempTaskState] = useState<{ [key: string]: Partial<Task> }>({});
  const timelineRef = useRef<HTMLDivElement>(null);

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

  const handleImportTasks = (importedTasks: Task[]) => {
    const tasksWithProgress = calculateAllTasksProgress(importedTasks);
    onTasksChange?.(tasksWithProgress);
  };

  const startEditing = (taskId: string, field: string, currentValue: string) => {
    setEditingCell({ taskId, field });
    setEditValue(currentValue);
  };

  const saveEdit = (taskId: string, field: string) => {
    if (!onTaskUpdate) return;

    const updates: Partial<Task> = {};

    if (field === 'name') {
      updates.name = editValue;
    } else if (field === 'startDate') {
      updates.startDate = editValue;
    } else if (field === 'endDate') {
      updates.endDate = editValue;
    } else if (field === 'progress') {
      updates.progress = parseInt(editValue) || 0;
    } else if (field === 'resources') {
      updates.resources = editValue;
    }

    onTaskUpdate(taskId, updates);
    setEditingCell(null);
    setEditValue("");
  };

  const cancelEdit = () => {
    setEditingCell(null);
    setEditValue("");
  };

  const handleZoomIn = () => {
    if (zoomMode === 'quarter') setZoomMode('month');
    else if (zoomMode === 'month') setZoomMode('day');
  };

  const handleZoomOut = () => {
    if (zoomMode === 'day') setZoomMode('month');
    else if (zoomMode === 'month') setZoomMode('quarter');
  };

  const handleZoomToFit = () => {
    setZoomMode('month');
  };

  const sortedTasks = [...tasks];

  // Calcular range de datas para o timeline
  const allDates = sortedTasks.flatMap((t) => [new Date(t.startDate), new Date(t.endDate)]);
  const minDate = new Date(Math.min(...allDates.map((d) => d.getTime())));
  const maxDate = new Date(Math.max(...allDates.map((d) => d.getTime())));

  // Adicionar margem de datas
  minDate.setDate(minDate.getDate() - 7);
  maxDate.setDate(maxDate.getDate() + 14);

  const totalDays = Math.ceil((maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24));

  // Gerar períodos baseado no zoom
  const generateTimePeriods = () => {
    if (zoomMode === 'day') {
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
      return { type: 'day', periods: weeks };
    } else if (zoomMode === 'month') {
      const months: { start: Date; end: Date }[] = [];
      let currentDate = new Date(minDate.getFullYear(), minDate.getMonth(), 1);

      while (currentDate <= maxDate) {
        const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        months.push({ start: new Date(currentDate), end: monthEnd });
        currentDate.setMonth(currentDate.getMonth() + 1);
      }
      return { type: 'month', periods: months };
    } else {
      const quarters: { start: Date; end: Date; label: string }[] = [];
      let currentDate = new Date(minDate.getFullYear(), Math.floor(minDate.getMonth() / 3) * 3, 1);

      while (currentDate <= maxDate) {
        const quarterEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 3, 0);
        const quarterNum = Math.floor(currentDate.getMonth() / 3) + 1;
        quarters.push({
          start: new Date(currentDate),
          end: quarterEnd,
          label: `Q${quarterNum} ${currentDate.getFullYear()}`
        });
        currentDate.setMonth(currentDate.getMonth() + 3);
      }
      return { type: 'quarter', periods: quarters };
    }
  };

  const timePeriods = generateTimePeriods();

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
    if (task.status === "completed") return "bg-emerald-500";
    if (task.status === "in-progress") return "bg-blue-500";
    if (task.isCritical) return "bg-red-500";
    return "bg-slate-400";
  };

  const isTaskDelayed = (task: Task): boolean => {
    const today = new Date();
    const endDate = new Date(task.endDate);
    return task.status !== "completed" && today > endDate;
  };

  // --- Drag & Drop Handlers ---

  const handleMouseDown = (e: React.MouseEvent, task: Task, type: DragState['type']) => {
    e.stopPropagation();
    e.preventDefault();
    setDragState({
      type,
      taskId: task.id,
      startX: e.clientX,
      originalStart: new Date(task.startDate),
      originalEnd: new Date(task.endDate),
      originalProgress: task.progress,
    });
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!dragState || !timelineRef.current) return;

    const timelineWidth = timelineRef.current.offsetWidth;
    // Calculate pixels per day based on current zoom
    // We know totalDays maps to 100% width (or more if scrolled)
    // But since we are using percentage based positioning, we need to convert px delta to percentage delta
    // Then percentage delta to days delta.

    // Better approach:
    // Calculate deltaX in pixels.
    // Convert deltaX to deltaDays.
    // timelineWidth represents totalDays.
    // deltaDays = (deltaX / timelineWidth) * totalDays

    // Wait, timelineRef is the container. The inner content width is what matters.
    // The inner content width is set by minWidth style on the child div.
    const scrollContainer = timelineRef.current.querySelector('div[style*="min-width"]');
    if (!scrollContainer) return;

    const contentWidth = scrollContainer.getBoundingClientRect().width;
    const deltaX = e.clientX - dragState.startX;
    const deltaPercent = deltaX / contentWidth;
    const deltaDays = Math.round(deltaPercent * totalDays);

    if (dragState.type === 'move') {
      const newStart = new Date(dragState.originalStart);
      newStart.setDate(newStart.getDate() + deltaDays);

      const newEnd = new Date(dragState.originalEnd);
      newEnd.setDate(newEnd.getDate() + deltaDays);

      setTempTaskState(prev => ({
        ...prev,
        [dragState.taskId]: {
          startDate: newStart.toISOString(),
          endDate: newEnd.toISOString(),
        }
      }));
    } else if (dragState.type === 'resize-end') {
      const newEnd = new Date(dragState.originalEnd);
      newEnd.setDate(newEnd.getDate() + deltaDays);

      // Prevent end date before start date
      if (newEnd > dragState.originalStart) {
        setTempTaskState(prev => ({
          ...prev,
          [dragState.taskId]: {
            endDate: newEnd.toISOString(),
            duration: Math.ceil((newEnd.getTime() - dragState.originalStart.getTime()) / (1000 * 60 * 60 * 24))
          }
        }));
      }
    } else if (dragState.type === 'resize-start') {
      const newStart = new Date(dragState.originalStart);
      newStart.setDate(newStart.getDate() + deltaDays);

      // Prevent start date after end date
      if (newStart < dragState.originalEnd) {
        setTempTaskState(prev => ({
          ...prev,
          [dragState.taskId]: {
            startDate: newStart.toISOString(),
            duration: Math.ceil((dragState.originalEnd.getTime() - newStart.getTime()) / (1000 * 60 * 60 * 24))
          }
        }));
      }
    }
  }, [dragState, totalDays]);

  const handleMouseUp = useCallback(() => {
    if (dragState && onTaskUpdate) {
      const tempUpdates = tempTaskState[dragState.taskId];
      if (tempUpdates) {
        onTaskUpdate(dragState.taskId, tempUpdates);
      }
    }
    setDragState(null);
    setTempTaskState({});
  }, [dragState, onTaskUpdate, tempTaskState]);

  useEffect(() => {
    if (dragState) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragState, handleMouseMove, handleMouseUp]);

  return (
    <Card className="overflow-hidden h-[calc(100vh-250px)] flex flex-col border-border/50 shadow-sm select-none">
      {/* Toolbar */}
      <div className="h-14 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center gap-2 px-4 flex-shrink-0 justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8" onClick={() => setImportDialogOpen(true)}>
            <Upload className="h-4 w-4 mr-2" />
            Importar
          </Button>
          <div className="h-4 w-px bg-border mx-2" />
          <Button variant="ghost" size="sm" className="h-8" onClick={expandAll}>
            Expandir
          </Button>
          <Button variant="ghost" size="sm" className="h-8" onClick={collapseAll}>
            Recolher
          </Button>
        </div>

        <div className="flex items-center gap-2 bg-muted/50 p-1 rounded-lg">
          <Button
            variant={zoomMode === 'day' ? 'secondary' : 'ghost'}
            size="sm"
            className="h-7 px-3 text-xs"
            onClick={() => setZoomMode('day')}
          >
            Dia
          </Button>
          <Button
            variant={zoomMode === 'month' ? 'secondary' : 'ghost'}
            size="sm"
            className="h-7 px-3 text-xs"
            onClick={() => setZoomMode('month')}
          >
            Mês
          </Button>
          <Button
            variant={zoomMode === 'quarter' ? 'secondary' : 'ghost'}
            size="sm"
            className="h-7 px-3 text-xs"
            onClick={() => setZoomMode('quarter')}
          >
            Trimestre
          </Button>
        </div>
      </div>

      <GanttImportDialog
        open={importDialogOpen}
        onOpenChange={setImportDialogOpen}
        onImport={handleImportTasks}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Coluna de tarefas - Largura reduzida e visual limpo */}
        <div className="border-r bg-background flex-shrink-0 overflow-y-auto w-[400px] shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)] z-10">
          {/* Header */}
          <div className="h-12 border-b bg-muted/40 flex items-center text-xs font-medium text-muted-foreground sticky top-0 z-20 backdrop-blur-sm">
            <div className="w-10 text-center">#</div>
            <div className="flex-1 px-4">Tarefa</div>
            <div className="w-24 text-center">Início</div>
            <div className="w-24 text-center">Fim</div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-border/30">
            {sortedTasks.map((task, idx) => {
              // Use temp state if dragging
              const displayTask = tempTaskState[task.id] ? { ...task, ...tempTaskState[task.id] } : task;

              return (
                <div
                  key={task.id}
                  className="h-10 flex items-center text-xs hover:bg-muted/30 transition-colors group"
                >
                  <div className="w-10 text-center font-mono text-muted-foreground/70">{idx + 1}</div>

                  {/* Task Name */}
                  <div className="flex-1 px-4 flex items-center gap-2 min-w-0">
                    {task.children && task.children.length > 0 && (
                      <button onClick={() => toggleExpand(task.id)} className="p-0.5 hover:bg-muted rounded">
                        {expandedTasks.has(task.id) ? (
                          <ChevronDown className="h-3 w-3" />
                        ) : (
                          <ChevronRight className="h-3 w-3" />
                        )}
                      </button>
                    )}
                    {editingCell?.taskId === task.id && editingCell?.field === 'name' ? (
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={() => saveEdit(task.id, 'name')}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') saveEdit(task.id, 'name');
                          if (e.key === 'Escape') cancelEdit();
                        }}
                        autoFocus
                        className="flex-1 px-1 py-0.5 bg-background border rounded focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    ) : (
                      <span
                        className="truncate font-medium cursor-pointer text-foreground/90 group-hover:text-primary transition-colors"
                        onClick={() => startEditing(task.id, 'name', task.name)}
                        title={task.name}
                      >
                        {task.name}
                      </span>
                    )}
                  </div>

                  {/* Start Date */}
                  <div className="w-24 text-center text-muted-foreground">
                    {new Date(displayTask.startDate).toLocaleDateString("pt-BR")}
                  </div>

                  {/* End Date */}
                  <div className="w-24 text-center text-muted-foreground">
                    {new Date(displayTask.endDate).toLocaleDateString("pt-BR")}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Timeline Gantt */}
        <div className="flex-1 overflow-x-auto overflow-y-auto bg-muted/5 relative" ref={timelineRef}>
          <div style={{ minWidth: zoomMode === 'day' ? '150%' : '100%' }}>
            {/* Header de períodos */}
            <div className="h-12 border-b bg-background sticky top-0 z-10 flex shadow-sm">
              {timePeriods.type === 'day' && (
                <>
                  {(timePeriods.periods as { start: Date; days: Date[] }[]).map((week, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col border-r border-border/50"
                      style={{ width: `${(week.days.length / totalDays) * 100}%` }}
                    >
                      <div className="h-6 flex items-center justify-center text-[10px] font-medium text-muted-foreground bg-muted/20">
                        {week.start.toLocaleDateString("pt-BR", { month: "short", day: "2-digit" })}
                      </div>
                      <div className="h-6 flex">
                        {week.days.map((day, dayIdx) => (
                          <div
                            key={dayIdx}
                            className="flex-1 flex items-center justify-center text-[10px] text-muted-foreground/70 border-r border-border/30 last:border-r-0"
                          >
                            {day.getDate()}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </>
              )}
              {timePeriods.type === 'month' && (
                (timePeriods.periods as { start: Date; end: Date }[]).map((month, idx) => {
                  const monthDays = Math.ceil((month.end.getTime() - month.start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
                  return (
                    <div
                      key={idx}
                      className="flex items-center justify-center text-xs font-medium text-muted-foreground border-r border-border/50 bg-muted/10"
                      style={{ width: `${(monthDays / totalDays) * 100}%` }}
                    >
                      {month.start.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}
                    </div>
                  );
                })
              )}
            </div>

            {/* Corpo do Gráfico */}
            <div className="relative min-h-[calc(100%-48px)]">
              {/* Grid de fundo */}
              <div className="absolute inset-0 flex pointer-events-none">
                {timePeriods.type === 'day' ? (
                  (timePeriods.periods as { start: Date; days: Date[] }[]).flatMap((week) =>
                    week.days.map((_, dayIdx) => (
                      <div
                        key={`grid-${week.start.getTime()}-${dayIdx}`}
                        className="border-r border-border/20 h-full"
                        style={{ width: `${(1 / totalDays) * 100}%` }}
                      />
                    ))
                  )
                ) : (
                  (timePeriods.periods as { start: Date; end: Date }[]).map((month, idx) => {
                    const monthDays = Math.ceil((month.end.getTime() - month.start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
                    return (
                      <div
                        key={`grid-month-${idx}`}
                        className="border-r border-border/30 h-full"
                        style={{ width: `${(monthDays / totalDays) * 100}%` }}
                      />
                    );
                  })
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
                    const sourceY = (depIndex * 40) + 20; // 40px height per row
                    const targetY = (taskIdx * 40) + 20;

                    const sourceX = calculatePosition(depTask.endDate);
                    const targetX = calculatePosition(task.startDate);

                    return (
                      <path
                        key={`${task.id}-${depId}`}
                        d={`M ${sourceX}% ${sourceY} L ${(sourceX + targetX) / 2}% ${sourceY} L ${(sourceX + targetX) / 2}% ${targetY} L ${targetX}% ${targetY}`}
                        stroke="#94a3b8"
                        strokeWidth="1.5"
                        fill="none"
                        opacity="0.5"
                      />
                    );
                  });
                })}
              </svg>

              {/* Barras de tarefas */}
              <div className="py-2"> {/* Padding top para alinhar com as linhas */}
                {sortedTasks.map((task) => {
                  // Use temp state if dragging
                  const displayTask = tempTaskState[task.id] ? { ...task, ...tempTaskState[task.id] } : task;
                  const left = calculatePosition(displayTask.startDate);
                  const width = calculateWidth(displayTask.startDate, displayTask.endDate);
                  const colorClass = getTaskColor(displayTask);
                  const isDragging = dragState?.taskId === task.id;

                  return (
                    <div key={task.id} className="h-10 relative group">
                      <TooltipProvider>
                        <Tooltip delayDuration={0}>
                          <TooltipTrigger asChild>
                            <div className="relative h-full w-full">
                              {/* Barra de progresso */}
                              <div
                                className={`absolute top-1/2 -translate-y-1/2 h-6 rounded-md shadow-sm cursor-grab active:cursor-grabbing hover:brightness-110 transition-all ${colorClass} ${isDragging ? 'shadow-lg ring-2 ring-primary ring-offset-2 z-50' : ''}`}
                                style={{
                                  left: `${left}%`,
                                  width: `${width}%`,
                                  minWidth: "24px",
                                }}
                                onMouseDown={(e) => handleMouseDown(e, task, 'move')}
                              >
                                {/* Handle Esquerdo (Resize Start) */}
                                <div
                                  className="absolute left-0 top-0 bottom-0 w-2 cursor-w-resize hover:bg-white/20 rounded-l-md z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                                  onMouseDown={(e) => handleMouseDown(e, task, 'resize-start')}
                                />

                                {/* Progresso interno */}
                                <div
                                  className="h-full rounded-md bg-white/20 pointer-events-none"
                                  style={{ width: `${displayTask.progress}%` }}
                                />

                                {/* Handle Direito (Resize End) */}
                                <div
                                  className="absolute right-0 top-0 bottom-0 w-2 cursor-e-resize hover:bg-white/20 rounded-r-md z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                                  onMouseDown={(e) => handleMouseDown(e, task, 'resize-end')}
                                />
                              </div>

                              {/* Indicador de atraso */}
                              {isTaskDelayed(displayTask) && (
                                <div
                                  className="absolute top-1/2 -translate-y-1/2"
                                  style={{
                                    left: `${left + width}%`,
                                    marginLeft: '8px'
                                  }}
                                >
                                  <Badge variant="destructive" className="h-5 px-1 text-[10px]">
                                    !
                                  </Badge>
                                </div>
                              )}
                            </div>
                          </TooltipTrigger>
                          {!isDragging && (
                            <TooltipContent side="top" className="text-xs">
                              <div className="font-bold mb-1">{displayTask.name}</div>
                              <div className="text-muted-foreground">
                                {new Date(displayTask.startDate).toLocaleDateString("pt-BR")} - {new Date(displayTask.endDate).toLocaleDateString("pt-BR")}
                              </div>
                              <div className="mt-1 flex items-center justify-between gap-4">
                                <span>Progresso:</span>
                                <span className="font-mono">{displayTask.progress}%</span>
                              </div>
                            </TooltipContent>
                          )}
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
