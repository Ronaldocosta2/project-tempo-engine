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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ActionItem } from "@/hooks/useActionItems";
import { Stakeholder } from "@/hooks/useStakeholders";
import { Meeting } from "@/hooks/useMeetings";

interface ActionItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (actionItem: Partial<ActionItem>) => void;
  actionItem?: ActionItem | null;
  projectId: string;
  stakeholders: Stakeholder[];
  meetings: Meeting[];
}

export const ActionItemDialog = ({
  open,
  onOpenChange,
  onSave,
  actionItem,
  projectId,
  stakeholders,
  meetings,
}: ActionItemDialogProps) => {
  const [formData, setFormData] = useState<Partial<ActionItem>>({
    title: "",
    description: "",
    responsible_id: undefined,
    due_date: "",
    priority: "media",
    status: "pendente",
    meeting_id: undefined,
    task_id: undefined,
    project_id: projectId,
  });

  useEffect(() => {
    if (actionItem) {
      setFormData(actionItem);
    } else {
      setFormData({
        title: "",
        description: "",
        responsible_id: undefined,
        due_date: "",
        priority: "media",
        status: "pendente",
        meeting_id: undefined,
        task_id: undefined,
        project_id: projectId,
      });
    }
  }, [actionItem, projectId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{actionItem ? "Editar Combinado" : "Novo Combinado"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Ex: Preparar ambiente de homologação"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description || ""}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descreva o combinado em detalhes..."
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="responsible_id">Responsável</Label>
              <Select
                value={formData.responsible_id || "none"}
                onValueChange={(value) =>
                  setFormData({ ...formData, responsible_id: value === "none" ? undefined : value })
                }
              >
                <SelectTrigger id="responsible_id">
                  <SelectValue placeholder="Selecionar..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Nenhum</SelectItem>
                  {stakeholders.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name} - {s.role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="due_date">Data de Vencimento</Label>
              <Input
                id="due_date"
                type="date"
                value={formData.due_date || ""}
                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Prioridade</Label>
              <Select
                value={formData.priority}
                onValueChange={(value: ActionItem["priority"]) =>
                  setFormData({ ...formData, priority: value })
                }
              >
                <SelectTrigger id="priority">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="baixa">Baixa</SelectItem>
                  <SelectItem value="media">Média</SelectItem>
                  <SelectItem value="alta">Alta</SelectItem>
                  <SelectItem value="urgente">Urgente</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: ActionItem["status"]) =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="em-andamento">Em Andamento</SelectItem>
                  <SelectItem value="concluida">Concluída</SelectItem>
                  <SelectItem value="cancelada">Cancelada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="meeting_id">Reunião Relacionada (opcional)</Label>
            <Select
              value={formData.meeting_id || "none"}
              onValueChange={(value) =>
                setFormData({ ...formData, meeting_id: value === "none" ? undefined : value })
              }
            >
              <SelectTrigger id="meeting_id">
                <SelectValue placeholder="Selecionar..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Nenhuma</SelectItem>
                {meetings.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.title} - {new Date(m.meeting_date).toLocaleDateString("pt-BR")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
