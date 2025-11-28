import { useState } from "react";
import { Task } from "@/hooks/useTasks";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Edit, Trash2, Plus, Calendar, CheckCircle2, Circle, Clock } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface SimpleTaskTableProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onAdd: (task: Partial<Task>) => void;
}

export const SimpleTaskTable = ({ tasks, onEdit, onDelete, onAdd }: SimpleTaskTableProps) => {
  const [newTaskName, setNewTaskName] = useState("");
  const [newTaskStart, setNewTaskStart] = useState("");
  const [newTaskEnd, setNewTaskEnd] = useState("");

  const handleQuickAdd = () => {
    if (!newTaskName || !newTaskStart || !newTaskEnd) return;

    onAdd({
      name: newTaskName,
      start_date: newTaskStart,
      end_date: newTaskEnd,
      status: "not-started",
      progress: 0,
      wbs: String(tasks.length + 1), // Auto-generate simple WBS
      is_critical: false,
    });

    setNewTaskName("");
    setNewTaskStart("");
    setNewTaskEnd("");
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "in-progress":
        return <Clock className="h-4 w-4 text-blue-500" />;
      default:
        return <Circle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "completed":
        return "Concluída";
      case "in-progress":
        return "Em Andamento";
      default:
        return "A Fazer";
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-card rounded-lg border shadow-sm p-4">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Plus className="h-4 w-4 text-primary" />
          Adicionar Rápido
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium">Nome da Tarefa</label>
            <Input
              placeholder="Ex: Definir escopo do projeto"
              value={newTaskName}
              onChange={(e) => setNewTaskName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Início</label>
            <Input
              type="date"
              value={newTaskStart}
              onChange={(e) => setNewTaskStart(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Fim</label>
            <div className="flex gap-2">
              <Input
                type="date"
                value={newTaskEnd}
                onChange={(e) => setNewTaskEnd(e.target.value)}
              />
              <Button onClick={handleQuickAdd} disabled={!newTaskName || !newTaskStart || !newTaskEnd}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">Status</TableHead>
              <TableHead>Tarefa</TableHead>
              <TableHead>Período</TableHead>
              <TableHead>Duração</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  Nenhuma tarefa cadastrada. Use o formulário acima para adicionar.
                </TableCell>
              </TableRow>
            ) : (
              tasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell>
                    <div className="flex items-center justify-center" title={getStatusLabel(task.status)}>
                      {getStatusIcon(task.status)}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {task.name}
                    {task.is_critical && (
                      <Badge variant="outline" className="ml-2 text-xs border-red-200 text-red-600 bg-red-50">
                        Crítica
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(task.start_date), "dd/MM/yyyy")} - {format(new Date(task.end_date), "dd/MM/yyyy")}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">{task.duration} dias</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => onEdit(task)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => onDelete(task.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
