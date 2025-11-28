import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { GanttChart } from "@/components/GanttChart";
import { SimpleTaskTable } from "@/components/SimpleTaskTable";
import { TaskDialog } from "@/components/TaskDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTasks, useUpdateTask, useCreateTask, useDeleteTask, Task } from "@/hooks/useTasks";
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
  const createTask = useCreateTask();
  const deleteTask = useDeleteTask();

  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

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

  const handleTaskUpdate = (taskId: string, updates: any) => {
    // Mapear campos do Gantt para campos do banco de dados
    const dbUpdates: any = {};

    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.startDate !== undefined) dbUpdates.start_date = updates.startDate;
    if (updates.endDate !== undefined) dbUpdates.end_date = updates.endDate;
    if (updates.progress !== undefined) dbUpdates.progress = updates.progress;
    if (updates.resources !== undefined) dbUpdates.resource_id = updates.resources;
    if (updates.status !== undefined) dbUpdates.status = updates.status;

    updateTask.mutate({ id: taskId, ...dbUpdates });
  };

  const handleSaveTask = (taskData: Partial<Task>) => {
    if (selectedTask) {
      updateTask.mutate({ ...taskData, id: selectedTask.id });
    } else {
      createTask.mutate({
        ...taskData,
        project_id: projectId,
      } as Omit<Task, "id" | "created_at" | "updated_at">);
    }
    setSelectedTask(null);
    setTaskDialogOpen(false);
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setTaskDialogOpen(true);
  };

  const handleDeleteTask = (taskId: string) => {
    if (confirm("Tem certeza que deseja deletar esta tarefa?")) {
      deleteTask.mutate({ id: taskId, projectId });
    }
  };

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

        <div className="flex-1 overflow-hidden p-4">
          <Tabs defaultValue="simple-list" className="h-full flex flex-col">
            <TabsList>
              <TabsTrigger value="simple-list">Lista Simples</TabsTrigger>
              <TabsTrigger value="gantt">Cronograma Gantt</TabsTrigger>
            </TabsList>

            <TabsContent value="simple-list" className="flex-1 overflow-auto mt-4">
              <SimpleTaskTable
                tasks={tasks}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
                onAdd={() => {
                  setSelectedTask(null);
                  setTaskDialogOpen(true);
                }}
              />
            </TabsContent>

            <TabsContent value="gantt" className="flex-1 overflow-hidden mt-4">
              {ganttTasks.length > 0 ? (
                <GanttChart
                  tasks={ganttTasks}
                  onTaskUpdate={handleTaskUpdate}
                />
              ) : (
                <div className="p-8 text-center">
                  <p className="text-muted-foreground">Nenhuma tarefa cadastrada ainda.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>

      <TaskDialog
        open={taskDialogOpen}
        onOpenChange={setTaskDialogOpen}
        onSave={handleSaveTask}
        task={selectedTask}
        projectId={projectId}
        tasks={tasks}
      />
    </Dialog>
  );
};
