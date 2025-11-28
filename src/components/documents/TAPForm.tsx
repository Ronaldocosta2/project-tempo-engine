import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Eye, FileDown } from "lucide-react";
import { useCreateDocument } from "@/hooks/useProjectDocuments";
import { useProjects } from "@/hooks/useProjects";
import { DocumentViewer } from "./DocumentViewer";

interface TAPFormProps {
  projectId: string;
  onBack: () => void;
  onClose: () => void;
}

export const TAPForm = ({ projectId, onBack, onClose }: TAPFormProps) => {
  const { data: projects } = useProjects();
  const project = projects?.find(p => p.id === projectId);
  const createDocument = useCreateDocument();
  const [showPreview, setShowPreview] = useState(false);

  const [formData, setFormData] = useState({
    projectName: project?.name || "",
    sponsor: "",
    manager: "",
    startDate: project?.start_date || "",
    endDate: project?.end_date || "",
    budget: project?.budget || "",
    justification: "",
    objectives: "",
    scope: "",
    deliverables: "",
    constraints: "",
    assumptions: "",
    risks: "",
    stakeholders: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await createDocument.mutateAsync({
      project_id: projectId,
      document_type: "tap",
      title: `TAP - ${formData.projectName}`,
      content: formData,
    });

    onClose();
  };

  const handlePreview = () => {
    setShowPreview(true);
  };

  if (showPreview) {
    return (
      <DocumentViewer
        type="tap"
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
          <Label htmlFor="projectName">Nome do Projeto *</Label>
          <Input
            id="projectName"
            value={formData.projectName}
            onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="sponsor">Patrocinador *</Label>
          <Input
            id="sponsor"
            value={formData.sponsor}
            onChange={(e) => setFormData({ ...formData, sponsor: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="manager">Gerente do Projeto *</Label>
          <Input
            id="manager"
            value={formData.manager}
            onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="budget">Orçamento</Label>
          <Input
            id="budget"
            value={formData.budget}
            onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="startDate">Data de Início</Label>
          <Input
            id="startDate"
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="endDate">Data de Término</Label>
          <Input
            id="endDate"
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="justification">Justificativa do Projeto *</Label>
        <Textarea
          id="justification"
          value={formData.justification}
          onChange={(e) => setFormData({ ...formData, justification: e.target.value })}
          rows={3}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="objectives">Objetivos *</Label>
        <Textarea
          id="objectives"
          value={formData.objectives}
          onChange={(e) => setFormData({ ...formData, objectives: e.target.value })}
          rows={3}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="scope">Escopo do Projeto *</Label>
        <Textarea
          id="scope"
          value={formData.scope}
          onChange={(e) => setFormData({ ...formData, scope: e.target.value })}
          rows={3}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="deliverables">Principais Entregas</Label>
        <Textarea
          id="deliverables"
          value={formData.deliverables}
          onChange={(e) => setFormData({ ...formData, deliverables: e.target.value })}
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="constraints">Restrições</Label>
        <Textarea
          id="constraints"
          value={formData.constraints}
          onChange={(e) => setFormData({ ...formData, constraints: e.target.value })}
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="assumptions">Premissas</Label>
        <Textarea
          id="assumptions"
          value={formData.assumptions}
          onChange={(e) => setFormData({ ...formData, assumptions: e.target.value })}
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="risks">Riscos Principais</Label>
        <Textarea
          id="risks"
          value={formData.risks}
          onChange={(e) => setFormData({ ...formData, risks: e.target.value })}
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="stakeholders">Principais Stakeholders</Label>
        <Textarea
          id="stakeholders"
          value={formData.stakeholders}
          onChange={(e) => setFormData({ ...formData, stakeholders: e.target.value })}
          rows={2}
        />
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="button" variant="outline" onClick={handlePreview}>
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
