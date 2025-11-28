import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Eye } from "lucide-react";
import { useCreateDocument } from "@/hooks/useProjectDocuments";
import { useProjects } from "@/hooks/useProjects";
import { DocumentViewer } from "./DocumentViewer";

interface MeetingMinutesFormProps {
  projectId: string;
  onBack: () => void;
  onClose: () => void;
}

export const MeetingMinutesForm = ({ projectId, onBack, onClose }: MeetingMinutesFormProps) => {
  const { data: projects } = useProjects();
  const project = projects?.find(p => p.id === projectId);
  const createDocument = useCreateDocument();
  const [showPreview, setShowPreview] = useState(false);

  const [formData, setFormData] = useState({
    projectName: project?.name || "",
    meetingDate: new Date().toISOString().split('T')[0],
    startTime: "",
    endTime: "",
    location: "",
    facilitator: "",
    attendees: "",
    absentees: "",
    objective: "",
    agenda: "",
    discussions: "",
    decisions: "",
    actionItems: "",
    nextMeeting: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await createDocument.mutateAsync({
      project_id: projectId,
      document_type: "ata",
      title: `Ata de Reunião - ${new Date(formData.meetingDate).toLocaleDateString('pt-BR')}`,
      content: formData,
    });

    onClose();
  };

  if (showPreview) {
    return (
      <DocumentViewer
        type="ata"
        content={formData}
        onBack={() => setShowPreview(false)}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex gap-2 mb-4">
        <Button type="button" variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="projectName">Projeto *</Label>
          <Input
            id="projectName"
            value={formData.projectName}
            onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="meetingDate">Data da Reunião *</Label>
          <Input
            id="meetingDate"
            type="date"
            value={formData.meetingDate}
            onChange={(e) => setFormData({ ...formData, meetingDate: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="startTime">Horário de Início</Label>
          <Input
            id="startTime"
            type="time"
            value={formData.startTime}
            onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="endTime">Horário de Término</Label>
          <Input
            id="endTime"
            type="time"
            value={formData.endTime}
            onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Local/Plataforma</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            placeholder="Sala de reuniões, Teams, Zoom..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="facilitator">Facilitador</Label>
          <Input
            id="facilitator"
            value={formData.facilitator}
            onChange={(e) => setFormData({ ...formData, facilitator: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="attendees">Participantes *</Label>
        <Textarea
          id="attendees"
          value={formData.attendees}
          onChange={(e) => setFormData({ ...formData, attendees: e.target.value })}
          rows={2}
          required
          placeholder="Liste os participantes presentes..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="absentees">Ausentes</Label>
        <Textarea
          id="absentees"
          value={formData.absentees}
          onChange={(e) => setFormData({ ...formData, absentees: e.target.value })}
          rows={2}
          placeholder="Liste os ausentes (se aplicável)..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="objective">Objetivo da Reunião *</Label>
        <Textarea
          id="objective"
          value={formData.objective}
          onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
          rows={2}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="agenda">Pauta</Label>
        <Textarea
          id="agenda"
          value={formData.agenda}
          onChange={(e) => setFormData({ ...formData, agenda: e.target.value })}
          rows={3}
          placeholder="Tópicos discutidos..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="discussions">Discussões e Comentários *</Label>
        <Textarea
          id="discussions"
          value={formData.discussions}
          onChange={(e) => setFormData({ ...formData, discussions: e.target.value })}
          rows={4}
          required
          placeholder="Resumo das discussões principais..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="decisions">Decisões Tomadas</Label>
        <Textarea
          id="decisions"
          value={formData.decisions}
          onChange={(e) => setFormData({ ...formData, decisions: e.target.value })}
          rows={3}
          placeholder="Liste as decisões importantes..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="actionItems">Itens de Ação</Label>
        <Textarea
          id="actionItems"
          value={formData.actionItems}
          onChange={(e) => setFormData({ ...formData, actionItems: e.target.value })}
          rows={3}
          placeholder="Ação | Responsável | Prazo (uma por linha)..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="nextMeeting">Próxima Reunião</Label>
        <Input
          id="nextMeeting"
          value={formData.nextMeeting}
          onChange={(e) => setFormData({ ...formData, nextMeeting: e.target.value })}
          placeholder="Data e horário da próxima reunião..."
        />
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="button" variant="outline" onClick={() => setShowPreview(true)}>
          <Eye className="h-4 w-4 mr-2" />
          Visualizar
        </Button>
        <Button type="submit" disabled={createDocument.isPending}>
          {createDocument.isPending ? "Salvando..." : "Salvar Documento"}
        </Button>
      </div>
    </form>
  );
};
