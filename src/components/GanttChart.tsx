import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Plus, ChevronDown, ChevronRight, ZoomIn, ZoomOut, Maximize2, Upload } from "lucide-react";
import { useState } from "react";
import { GanttImportDialog } from "./GanttImportDialog";
import { calculateAllTasksProgress } from "@/lib/ganttFileParser";

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

export const GanttChart = ({ tasks, onTasksChange, onTaskUpdate }: GanttChartProps) => {
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());
  const [zoomMode, setZoomMode] = useState<ZoomMode>('month');
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [editingCell, setEditingCell] = useState<{ taskId: string; field: string } | null>(null);
  const [editValue, setEditValue] = useState<string>("");

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
    // Cores baseadas no status
    if (task.status === "completed") return "#22c55e"; // Verde
    if (task.status === "in-progress") return "#eab308"; // Amarelo
    if (task.status === "not-started") return "#94a3b8"; // Cinza
    
    // Fallback para cor customizada ou crítica
    if (task.color) return task.color;
    if (task.isCritical) return "#ef4444"; // Vermelho
    return "#3b82f6"; // Azul padrão
  };
  
  const getTaskDelay = (task: Task): number => {
    const today = new Date();
    const endDate = new Date(task.endDate);
    
    if (task.status !== "completed") {
      const delay = Math.ceil((today.getTime() - endDate.getTime()) / (1000 * 60 * 60 * 24));
      return delay > 0 ? delay : 0;
    }
    return 0;
  };
  
  const isTaskDelayed = (task: Task): boolean => {
    return getTaskDelay(task) > 0 && task.status !== "completed";
  };

  return (
    <Card className="overflow-hidden h-[calc(100vh-300px)] flex flex-col">
      {/* Toolbar */}
      <div className="h-12 border-b bg-muted/30 flex items-center gap-2 px-4 flex-shrink-0">
        <Button variant="ghost" size="sm" className="h-8">
          <Plus className="h-4 w-4 mr-1" />
          Add
        </Button>
        <Button variant="ghost" size="sm" className="h-8" onClick={() => setImportDialogOpen(true)}>
          <Upload className="h-4 w-4 mr-1" />
          Import
        </Button>
        <Button variant="ghost" size="sm" className="h-8" onClick={expandAll}>
          Expand all
        </Button>
        <Button variant="ghost" size="sm" className="h-8" onClick={collapseAll}>
          Collapse all
        </Button>
        <div className="w-px h-6 bg-border mx-1" />
        <Button variant="ghost" size="sm" className="h-8" onClick={handleZoomIn} disabled={zoomMode === 'day'}>
          <ZoomIn className="h-4 w-4 mr-1" />
          Zoom in
        </Button>
        <Button variant="ghost" size="sm" className="h-8" onClick={handleZoomOut} disabled={zoomMode === 'quarter'}>
          <ZoomOut className="h-4 w-4 mr-1" />
          Zoom out
        </Button>
        <Button variant="ghost" size="sm" className="h-8" onClick={handleZoomToFit}>
          <Maximize2 className="h-4 w-4 mr-1" />
          Zoom to fit
        </Button>
        <span className="text-xs text-muted-foreground ml-2">
          {zoomMode === 'day' ? 'Dia' : zoomMode === 'month' ? 'Mês' : 'Trimestre'}
        </span>
      </div>

      <GanttImportDialog
        open={importDialogOpen}
        onOpenChange={setImportDialogOpen}
        onImport={handleImportTasks}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Coluna de tarefas */}
        <div className="border-r bg-background flex-shrink-0 overflow-y-auto" style={{ width: '720px' }}>
          {/* Header */}
          <div className="h-[72px] border-b bg-muted/30 flex items-center text-xs font-semibold sticky top-0 z-10">
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
                
                {/* Task Name - Editable */}
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
                      className="flex-1 px-1 py-0.5 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  ) : (
                    <span 
                      className="truncate font-medium cursor-pointer hover:bg-muted/50 px-1 py-0.5 rounded flex-1"
                      onClick={() => startEditing(task.id, 'name', task.name)}
                    >
                      {task.name}
                    </span>
                  )}
                </div>

                {/* Start Date - Editable */}
                <div className="w-28 text-center border-r">
                  {editingCell?.taskId === task.id && editingCell?.field === 'startDate' ? (
                    <input
                      type="date"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onBlur={() => saveEdit(task.id, 'startDate')}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveEdit(task.id, 'startDate');
                        if (e.key === 'Escape') cancelEdit();
                      }}
                      autoFocus
                      className="w-full px-1 py-0.5 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  ) : (
                    <span 
                      className="cursor-pointer hover:bg-muted/50 px-1 py-0.5 rounded inline-block text-muted-foreground"
                      onClick={() => startEditing(task.id, 'startDate', task.startDate)}
                    >
                      {new Date(task.startDate).toLocaleDateString("en-CA")}
                    </span>
                  )}
                </div>

                {/* End Date - Editable */}
                <div className="w-28 text-center border-r">
                  {editingCell?.taskId === task.id && editingCell?.field === 'endDate' ? (
                    <input
                      type="date"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onBlur={() => saveEdit(task.id, 'endDate')}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveEdit(task.id, 'endDate');
                        if (e.key === 'Escape') cancelEdit();
                      }}
                      autoFocus
                      className="w-full px-1 py-0.5 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  ) : (
                    <span 
                      className="cursor-pointer hover:bg-muted/50 px-1 py-0.5 rounded inline-block text-muted-foreground"
                      onClick={() => startEditing(task.id, 'endDate', task.endDate)}
                    >
                      {new Date(task.endDate).toLocaleDateString("en-CA")}
                    </span>
                  )}
                </div>

                {/* Duration - Read only */}
                <div className="w-24 text-center border-r text-muted-foreground">
                  {task.duration} days
                </div>

                {/* Progress - Editable */}
                <div className="w-24 text-center border-r">
                  {editingCell?.taskId === task.id && editingCell?.field === 'progress' ? (
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onBlur={() => saveEdit(task.id, 'progress')}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveEdit(task.id, 'progress');
                        if (e.key === 'Escape') cancelEdit();
                      }}
                      autoFocus
                      className="w-full px-1 py-0.5 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-primary text-center"
                    />
                  ) : (
                    <span 
                      className="cursor-pointer hover:bg-muted/50 px-1 py-0.5 rounded inline-block"
                      onClick={() => startEditing(task.id, 'progress', task.progress.toString())}
                    >
                      {task.progress}
                    </span>
                  )}
                </div>

                {/* Dependency - Read only */}
                <div className="w-24 text-center border-r text-muted-foreground">
                  {task.dependencies?.join(", ") || ""}
                </div>

                {/* Resources - Editable */}
                <div className="w-32 text-center border-r">
                  {editingCell?.taskId === task.id && editingCell?.field === 'resources' ? (
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onBlur={() => saveEdit(task.id, 'resources')}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveEdit(task.id, 'resources');
                        if (e.key === 'Escape') cancelEdit();
                      }}
                      autoFocus
                      className="w-full px-1 py-0.5 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  ) : (
                    <span 
                      className="cursor-pointer hover:bg-muted/50 px-1 py-0.5 rounded inline-block text-muted-foreground truncate px-2"
                      onClick={() => startEditing(task.id, 'resources', task.resources || '')}
                    >
                      {task.resources || ""}
                    </span>
                  )}
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
        <div className="flex-1 overflow-x-auto overflow-y-auto">
          <div style={{ minWidth: zoomMode === 'day' ? '1200px' : zoomMode === 'month' ? '800px' : '600px' }}>
            {/* Header de períodos */}
            <div className="h-[72px] border-b bg-muted/30 sticky top-0">
              {timePeriods.type === 'day' && (
                <>
                  {/* Linha de semanas */}
                  <div className="h-9 flex border-b">
                    {(timePeriods.periods as { start: Date; days: Date[] }[]).map((week, idx) => (
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
                    {(timePeriods.periods as { start: Date; days: Date[] }[]).flatMap((week) =>
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
                </>
              )}
              {timePeriods.type === 'month' && (
                <div className="h-full flex">
                  {(timePeriods.periods as { start: Date; end: Date }[]).map((month, idx) => {
                    const monthDays = Math.ceil((month.end.getTime() - month.start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
                    return (
                      <div
                        key={idx}
                        className="flex items-center justify-center text-xs font-semibold border-r"
                        style={{ width: `${(monthDays / totalDays) * 100}%` }}
                      >
                        {month.start.toLocaleDateString("pt-BR", { month: "short", year: "numeric" })}
                      </div>
                    );
                  })}
                </div>
              )}
              {timePeriods.type === 'quarter' && (
                <div className="h-full flex">
                  {(timePeriods.periods as { start: Date; end: Date; label: string }[]).map((quarter, idx) => {
                    const quarterDays = Math.ceil((quarter.end.getTime() - quarter.start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
                    return (
                      <div
                        key={idx}
                        className="flex items-center justify-center text-xs font-semibold border-r"
                        style={{ width: `${(quarterDays / totalDays) * 100}%` }}
                      >
                        {quarter.label}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Barras do Gantt */}
            <div className="relative">
              {/* Grid de fundo */}
              {timePeriods.type === 'day' && (
                <div className="absolute inset-0 flex pointer-events-none">
                  {(timePeriods.periods as { start: Date; days: Date[] }[]).flatMap((week) =>
                    week.days.map((_, dayIdx) => (
                      <div
                        key={`grid-${week.start.getTime()}-${dayIdx}`}
                        className="border-r h-full"
                        style={{ width: `${(1 / totalDays) * 100}%` }}
                      />
                    ))
                  )}
                </div>
              )}

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
                          <div className="relative">
                            <div
                              className="absolute top-1/2 -translate-y-1/2 h-7 rounded cursor-pointer hover:opacity-80 transition-opacity flex items-center px-2"
                              style={{
                                left: `${left}%`,
                                width: `${width}%`,
                                minWidth: "40px",
                                backgroundColor: getTaskColor(task),
                              }}
                            >
                              <div
                                className="h-full rounded bg-white/30"
                                style={{ width: `${task.progress}%` }}
                              />
                            </div>
                            {isTaskDelayed(task) && (
                              <div
                                className="absolute top-1/2 -translate-y-1/2"
                                style={{
                                  left: `${left + width}%`,
                                  marginLeft: '8px'
                                }}
                              >
                                <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-600 rounded-full animate-pulse">
                                  !
                                </span>
                              </div>
                            )}
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
