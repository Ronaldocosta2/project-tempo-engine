import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Eye } from "lucide-react";
import { useCreateDocument } from "@/hooks/useProjectDocuments";
import { useProjects } from "@/hooks/useProjects";
import { DocumentViewer } from "./DocumentViewer";

interface StatusReportFormProps {
  projectId: string;
  onBack: () => void;
  onClose: () => void;
}

export const StatusReportForm = ({ projectId, onBack, onClose }: StatusReportFormProps) => {
  const { data: projects } = useProjects();
  const project = projects?.find(p => p.id === projectId);
  const createDocument = useCreateDocument();
  const [showPreview, setShowPreview] = useState(false);

  const [formData, setFormData] = useState({
    projectName: project?.name || "",
    reportDate: new Date().toISOString().split('T')[0],
    period: "",
    overallStatus: project?.status || "on-track",
    progress: project?.progress?.toString() || "0",
    summary: "",
    accomplishments: "",
    upcoming: "",
    issues: "",
    risks: "",
    budget: "",
    schedule: "",
    scope: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await createDocument.mutateAsync({
      project_id: projectId,
      document_type: "relatorio",
      title: `Relatório de Status - ${formData.period}`,
      content: formData,
    });

    onClose();
  };

  if (showPreview) {
    return (
      <DocumentViewer
        type="relatorio"
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
          <Label htmlFor="reportDate">Data do Relatório</Label>
          <Input
            id="reportDate"
            type="date"
            value={formData.reportDate}
            onChange={(e) => setFormData({ ...formData, reportDate: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="period">Período *</Label>
          <Input
            id="period"
            value={formData.period}
            onChange={(e) => setFormData({ ...formData, period: e.target.value })}
            placeholder="Ex: Semana 15/01 a 21/01"
            required
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
            onChange={(e) => setFormData({ ...formData, progress: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="overallStatus">Status Geral</Label>
          <Select value={formData.overallStatus} onValueChange={(value) => setFormData({ ...formData, overallStatus: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="on-track">No prazo</SelectItem>
              <SelectItem value="at-risk">Em risco</SelectItem>
              <SelectItem value="delayed">Atrasado</SelectItem>
              <SelectItem value="completed">Concluído</SelectItem>
            </SelectContent>
          </Select>
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
        <Label htmlFor="accomplishments">Realizações do Período *</Label>
        <Textarea
          id="accomplishments"
          value={formData.accomplishments}
          onChange={(e) => setFormData({ ...formData, accomplishments: e.target.value })}
          rows={3}
          required
          placeholder="Descreva as principais entregas e conquistas..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="upcoming">Próximas Atividades</Label>
        <Textarea
          id="upcoming"
          value={formData.upcoming}
          onChange={(e) => setFormData({ ...formData, upcoming: e.target.value })}
          rows={3}
          placeholder="O que está planejado para o próximo período..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="issues">Problemas e Obstáculos</Label>
        <Textarea
          id="issues"
          value={formData.issues}
          onChange={(e) => setFormData({ ...formData, issues: e.target.value })}
          rows={2}
          placeholder="Descreva problemas enfrentados e ações tomadas..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="risks">Riscos</Label>
        <Textarea
          id="risks"
          value={formData.risks}
          onChange={(e) => setFormData({ ...formData, risks: e.target.value })}
          rows={2}
          placeholder="Riscos identificados e planos de mitigação..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="budget">Status do Orçamento</Label>
        <Textarea
          id="budget"
          value={formData.budget}
          onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
          rows={2}
          placeholder="Situação financeira, desvios, previsões..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="schedule">Status do Cronograma</Label>
        <Textarea
          id="schedule"
          value={formData.schedule}
          onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
          rows={2}
          placeholder="Marcos atingidos, atrasos, previsão de conclusão..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="scope">Status do Escopo</Label>
        <Textarea
          id="scope"
          value={formData.scope}
          onChange={(e) => setFormData({ ...formData, scope: e.target.value })}
          rows={2}
          placeholder="Mudanças de escopo, entregas adicionais..."
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
