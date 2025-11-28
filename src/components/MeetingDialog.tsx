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
import { Meeting } from "@/hooks/useMeetings";

interface MeetingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (meeting: Partial<Meeting>) => void;
  meeting?: Meeting | null;
  projectId: string;
}

export const MeetingDialog = ({
  open,
  onOpenChange,
  onSave,
  meeting,
  projectId,
}: MeetingDialogProps) => {
  const [formData, setFormData] = useState<Partial<Meeting>>({
    title: "",
    description: "",
    meeting_date: "",
    duration_minutes: 60,
    location: "",
    meeting_type: "status",
    status: "agendada",
    summary: "",
    project_id: projectId,
  });

  useEffect(() => {
    if (meeting) {
      setFormData({
        ...meeting,
        meeting_date: meeting.meeting_date.substring(0, 16), // Format for datetime-local
      });
    } else {
      const now = new Date();
      const defaultDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
        .toISOString()
        .substring(0, 16);
      setFormData({
        title: "",
        description: "",
        meeting_date: defaultDate,
        duration_minutes: 60,
        location: "",
        meeting_type: "status",
        status: "agendada",
        summary: "",
        project_id: projectId,
      });
    }
  }, [meeting, projectId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{meeting ? "Editar Reunião" : "Nova Reunião"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Ex: Status Semanal"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description || ""}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descreva o objetivo da reunião..."
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="meeting_date">Data e Hora *</Label>
              <Input
                id="meeting_date"
                type="datetime-local"
                value={formData.meeting_date}
                onChange={(e) => setFormData({ ...formData, meeting_date: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration_minutes">Duração (minutos)</Label>
              <Input
                id="duration_minutes"
                type="number"
                min="15"
                step="15"
                value={formData.duration_minutes}
                onChange={(e) =>
                  setFormData({ ...formData, duration_minutes: parseInt(e.target.value) || 60 })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="meeting_type">Tipo</Label>
              <Select
                value={formData.meeting_type}
                onValueChange={(value: Meeting["meeting_type"]) =>
                  setFormData({ ...formData, meeting_type: value })
                }
              >
                <SelectTrigger id="meeting_type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="planejamento">Planejamento</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
                  <SelectItem value="decisao">Decisão</SelectItem>
                  <SelectItem value="retrospectiva">Retrospectiva</SelectItem>
                  <SelectItem value="outro">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: Meeting["status"]) =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="agendada">Agendada</SelectItem>
                  <SelectItem value="realizada">Realizada</SelectItem>
                  <SelectItem value="cancelada">Cancelada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Local/Link</Label>
            <Input
              id="location"
              value={formData.location || ""}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Ex: Sala 301 ou https://meet.google.com/..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="summary">Resumo/Ata</Label>
            <Textarea
              id="summary"
              value={formData.summary || ""}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              placeholder="Resumo da reunião, decisões tomadas..."
              rows={3}
            />
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
