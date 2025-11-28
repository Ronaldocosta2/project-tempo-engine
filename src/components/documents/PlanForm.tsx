import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Eye } from "lucide-react";
import { useCreateDocument } from "@/hooks/useProjectDocuments";
import { useProjects } from "@/hooks/useProjects";
import { DocumentViewer } from "./DocumentViewer";

interface PlanFormProps {
  projectId: string;
  onBack: () => void;
  onClose: () => void;
}

export const PlanForm = ({ projectId, onBack, onClose }: PlanFormProps) => {
  const { data: projects } = useProjects();
  const project = projects?.find(p => p.id === projectId);
  const createDocument = useCreateDocument();
  const [showPreview, setShowPreview] = useState(false);

  const [formData, setFormData] = useState({
    projectName: project?.name || "",
    version: "1.0",
    date: new Date().toISOString().split('T')[0],
    summary: project?.description || "",
    scope: "",
    schedule: "",
    budget: project?.budget || "",
    quality: "",
    resources: "",
    communications: "",
    risks: "",
    procurement: "",
    stakeholders: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await createDocument.mutateAsync({
      project_id: projectId,
      document_type: "plano",
      title: `Plano de Projeto - ${formData.projectName}`,
      content: formData,
    });

    onClose();
  };

  if (showPreview) {
    return (
      <DocumentViewer
        type="plano"
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          <Label htmlFor="version">Versão</Label>
          <Input
            id="version"
            value={formData.version}
            onChange={(e) => setFormData({ ...formData, version: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="date">Data</Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="summary">Resumo Executivo *</Label>
        <Textarea
          id="summary"
          value={formData.summary}
          onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
          rows={3}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="scope">Plano de Escopo *</Label>
        <Textarea
          id="scope"
          value={formData.scope}
          onChange={(e) => setFormData({ ...formData, scope: e.target.value })}
          rows={3}
          required
          placeholder="Descreva o escopo detalhado, entregas, exclusões..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="schedule">Plano de Cronograma *</Label>
        <Textarea
          id="schedule"
          value={formData.schedule}
          onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
          rows={3}
          required
          placeholder="Fases, marcos, dependências..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="budget">Plano de Custos</Label>
        <Textarea
          id="budget"
          value={formData.budget}
          onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
          rows={2}
          placeholder="Orçamento detalhado, premissas de custo..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="quality">Plano de Qualidade</Label>
        <Textarea
          id="quality"
          value={formData.quality}
          onChange={(e) => setFormData({ ...formData, quality: e.target.value })}
          rows={2}
          placeholder="Padrões, métricas, processos de controle..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="resources">Plano de Recursos</Label>
        <Textarea
          id="resources"
          value={formData.resources}
          onChange={(e) => setFormData({ ...formData, resources: e.target.value })}
          rows={2}
          placeholder="Equipe, papéis, responsabilidades..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="communications">Plano de Comunicações</Label>
        <Textarea
          id="communications"
          value={formData.communications}
          onChange={(e) => setFormData({ ...formData, communications: e.target.value })}
          rows={2}
          placeholder="Stakeholders, frequência, canais..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="risks">Plano de Riscos</Label>
        <Textarea
          id="risks"
          value={formData.risks}
          onChange={(e) => setFormData({ ...formData, risks: e.target.value })}
          rows={2}
          placeholder="Riscos identificados, probabilidade, impacto, mitigação..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="procurement">Plano de Aquisições</Label>
        <Textarea
          id="procurement"
          value={formData.procurement}
          onChange={(e) => setFormData({ ...formData, procurement: e.target.value })}
          rows={2}
          placeholder="Aquisições necessárias, fornecedores, contratos..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="stakeholders">Registro de Stakeholders</Label>
        <Textarea
          id="stakeholders"
          value={formData.stakeholders}
          onChange={(e) => setFormData({ ...formData, stakeholders: e.target.value })}
          rows={2}
          placeholder="Stakeholders principais, interesse, influência..."
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
