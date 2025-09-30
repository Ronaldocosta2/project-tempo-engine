import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Task } from "@/hooks/useTasks";

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (task: Partial<Task>) => void;
  task?: Task | null;
  projectId: string;
  tasks: Task[];
}

export const TaskDialog = ({
  open,
  onOpenChange,
  onSave,
  task,
  projectId,
  tasks,
}: TaskDialogProps) => {
  const [formData, setFormData] = useState<Partial<Task>>({
    wbs: "",
    name: "",
    start_date: "",
    end_date: "",
    duration: 1,
    progress: 0,
    is_critical: false,
    status: "not-started",
    parent_id: null,
    project_id: projectId,
  });

  useEffect(() => {
    if (task) {
      setFormData(task);
    } else {
      setFormData({
        wbs: "",
        name: "",
        start_date: "",
        end_date: "",
        duration: 1,
        progress: 0,
        is_critical: false,
        status: "not-started",
        parent_id: null,
        project_id: projectId,
      });
    }
  }, [task, projectId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onOpenChange(false);
  };

  const calculateDuration = (start: string, end: string) => {
    if (!start || !end) return 1;
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
  };

  useEffect(() => {
    if (formData.start_date && formData.end_date) {
      const duration = calculateDuration(formData.start_date, formData.end_date);
      setFormData((prev) => ({ ...prev, duration }));
    }
  }, [formData.start_date, formData.end_date]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{task ? "Editar Tarefa" : "Nova Tarefa"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="wbs">WBS</Label>
              <Input
                id="wbs"
                value={formData.wbs}
                onChange={(e) => setFormData({ ...formData, wbs: e.target.value })}
                placeholder="1.0"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Nome da Tarefa</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nome da tarefa"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_date">Data de Início</Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end_date">Data de Término</Label>
              <Input
                id="end_date"
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Duração (dias)</Label>
              <Input
                id="duration"
                type="number"
                value={formData.duration}
                readOnly
                className="bg-muted"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="progress">Progresso (%)</Label>
              <Input
                id="progress"
                type="number"
                min="0"
                max="100"
                value={formData.progress}
                onChange={(e) =>
                  setFormData({ ...formData, progress: parseInt(e.target.value) || 0 })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: Task["status"]) =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="not-started">Não Iniciado</SelectItem>
                  <SelectItem value="in-progress">Em Progresso</SelectItem>
                  <SelectItem value="completed">Concluído</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="parent_id">Tarefa Pai (opcional)</Label>
              <Select
                value={formData.parent_id || "none"}
                onValueChange={(value) =>
                  setFormData({ ...formData, parent_id: value === "none" ? null : value })
                }
              >
                <SelectTrigger id="parent_id">
                  <SelectValue placeholder="Nenhuma" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Nenhuma</SelectItem>
                  {tasks
                    .filter((t) => t.id !== task?.id)
                    .map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.wbs} - {t.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2 pt-8">
              <input
                id="is_critical"
                type="checkbox"
                checked={formData.is_critical}
                onChange={(e) => setFormData({ ...formData, is_critical: e.target.checked })}
                className="h-4 w-4"
              />
              <Label htmlFor="is_critical" className="cursor-pointer">
                Tarefa Crítica
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">Salvar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
