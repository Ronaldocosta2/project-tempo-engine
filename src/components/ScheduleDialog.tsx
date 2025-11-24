import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GanttChart } from "@/components/GanttChart";
import { MindMapView } from "@/components/MindMapView";
import { ScheduleMetrics } from "@/components/ScheduleMetrics";
import { ConflictsPanel } from "@/components/ConflictsPanel";
import { CrossProjectAnalysis } from "@/components/CrossProjectAnalysis";
import { useTasks, useUpdateTask } from "@/hooks/useTasks";
import { useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";

interface ScheduleDialogProps {
  projectId: string;
  projectName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ScheduleDialog = ({ projectId, projectName, open, onOpenChange }: ScheduleDialogProps) => {
  const { data: tasks = [] } = useTasks(projectId);
  const updateTask = useUpdateTask();
  const queryClient = useQueryClient();

  const handleRecalculate = () => {
    if (!projectId) return;
    queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
    queryClient.invalidateQueries({ queryKey: ["projects", projectId] });
  };

  const ganttTasks = tasks.map((t) => ({
    id: t.id,
    wbs: t.wbs,
    name: t.name,
    startDate: t.start_date,
    endDate: t.end_date,
    duration: t.duration,
    progress: t.progress,
    isCritical: t.is_critical,
    status: t.status,
    actualEndDate: t.actual_end_date,
  }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="p-6 pb-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold">
              Cronograma - {projectName}
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="h-8 w-8"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Schedule Metrics - Motor de Agendamento */}
          <ScheduleMetrics projectId={projectId} onRecalculate={handleRecalculate} />

          {/* Conflicts and Priorities Panel */}
          <ConflictsPanel projectId={projectId} tasks={tasks} />

          {/* Tabs para Gantt e Mapa Mental */}
          <Tabs defaultValue="gantt" className="space-y-4">
            <TabsList>
              <TabsTrigger value="gantt">Cronograma Gantt</TabsTrigger>
              <TabsTrigger value="mindmap">Mapa Mental (EAP)</TabsTrigger>
              <TabsTrigger value="cross-project">Cross-Project</TabsTrigger>
            </TabsList>

            <TabsContent value="gantt" className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-foreground">Cronograma Gantt</h2>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    Exportar CSV
                  </Button>
                  <Button variant="outline" size="sm">
                    Baseline
                  </Button>
                </div>
              </div>
              {ganttTasks.length > 0 ? (
                <GanttChart 
                  tasks={ganttTasks} 
                  onTaskUpdate={(taskId, updates) => {
                    updateTask.mutate({ id: taskId, ...updates });
                  }}
                />
              ) : (
                <div className="p-8 text-center border rounded-lg bg-muted/20">
                  <p className="text-muted-foreground">Nenhuma tarefa cadastrada ainda.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="mindmap" className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">Estrutura Analítica do Projeto (EAP)</h2>
              {tasks.length > 0 ? (
                <MindMapView tasks={tasks} />
              ) : (
                <div className="p-8 text-center border rounded-lg bg-muted/20">
                  <p className="text-muted-foreground">Nenhuma tarefa cadastrada ainda.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="cross-project" className="space-y-4">
              <CrossProjectAnalysis />
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};
