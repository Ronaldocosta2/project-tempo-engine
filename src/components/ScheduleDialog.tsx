import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { GanttChart } from "@/components/GanttChart";
import { useTasks, useUpdateTask } from "@/hooks/useTasks";
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

  const ganttTasks = tasks.map((t) => ({
    id: t.id,
    wbs: t.wbs,
    name: t.name,
    startDate: t.start_date,
    endDate: t.end_date,
    duration: t.duration,
    progress: t.progress || 0,
    isCritical: t.is_critical || false,
    status: t.status as "not-started" | "in-progress" | "completed",
    actualEndDate: t.actual_end_date || undefined,
  }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="p-4 pb-3 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold">
              {projectName} - Cronograma
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

        <div className="flex-1 overflow-hidden">
          {ganttTasks.length > 0 ? (
            <GanttChart 
              tasks={ganttTasks} 
              onTaskUpdate={(taskId, updates) => {
                updateTask.mutate({ id: taskId, ...updates });
              }}
            />
          ) : (
            <div className="p-8 text-center">
              <p className="text-muted-foreground">Nenhuma tarefa cadastrada ainda.</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
