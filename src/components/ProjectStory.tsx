import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Edit, Save, X, BookOpen } from "lucide-react";
import { ProjectContext, useUpsertProjectContext } from "@/hooks/useProjectContext";

interface ProjectStoryProps {
  projectId: string;
  context: ProjectContext | null;
}

export function ProjectStory({ projectId, context }: ProjectStoryProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [story, setStory] = useState(context?.story || "");
  const [origin, setOrigin] = useState(context?.origin || "");
  const [impact, setImpact] = useState(context?.impact || "");
  const [objectives, setObjectives] = useState(context?.objectives || "");

  const upsertContext = useUpsertProjectContext();

  const handleSave = () => {
    upsertContext.mutate({
      project_id: projectId,
      story,
      origin,
      impact,
      objectives,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setStory(context?.story || "");
    setOrigin(context?.origin || "");
    setImpact(context?.impact || "");
    setObjectives(context?.objectives || "");
    setIsEditing(false);
  };

  return (
    <Card className="border-white/5 bg-white/5 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-purple-400" />
            <CardTitle className="text-lg font-medium text-white">História e Contexto</CardTitle>
          </div>
          {!isEditing ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="text-slate-400 hover:text-white hover:bg-white/10"
            >
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancel}
                className="text-slate-400 hover:text-white hover:bg-white/10"
              >
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                className="bg-purple-600 hover:bg-purple-500 text-white"
              >
                <Save className="h-4 w-4 mr-2" />
                Salvar
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h4 className="text-sm font-medium text-slate-300 mb-2">Origem do Projeto</h4>
          {isEditing ? (
            <Textarea
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              placeholder="Como e por que este projeto surgiu?"
              rows={3}
              className="bg-slate-900/50 border-white/10 text-slate-200 placeholder:text-slate-600 focus:border-purple-500"
            />
          ) : (
            <p className="text-slate-400 text-sm leading-relaxed">
              {origin || "Nenhuma informação cadastrada."}
            </p>
          )}
        </div>

        <div>
          <h4 className="text-sm font-medium text-slate-300 mb-2">História</h4>
          {isEditing ? (
            <Textarea
              value={story}
              onChange={(e) => setStory(e.target.value)}
              placeholder="Conte a história do projeto..."
              rows={4}
              className="bg-slate-900/50 border-white/10 text-slate-200 placeholder:text-slate-600 focus:border-purple-500"
            />
          ) : (
            <p className="text-slate-400 text-sm leading-relaxed">
              {story || "Nenhuma história cadastrada."}
            </p>
          )}
        </div>

        <div>
          <h4 className="text-sm font-medium text-slate-300 mb-2">Impacto Esperado</h4>
          {isEditing ? (
            <Textarea
              value={impact}
              onChange={(e) => setImpact(e.target.value)}
              placeholder="Qual o impacto esperado deste projeto?"
              rows={3}
              className="bg-slate-900/50 border-white/10 text-slate-200 placeholder:text-slate-600 focus:border-purple-500"
            />
          ) : (
            <p className="text-slate-400 text-sm leading-relaxed">
              {impact || "Nenhum impacto cadastrado."}
            </p>
          )}
        </div>

        <div>
          <h4 className="text-sm font-medium text-slate-300 mb-2">Objetivos Principais</h4>
          {isEditing ? (
            <Textarea
              value={objectives}
              onChange={(e) => setObjectives(e.target.value)}
              placeholder="Quais são os objetivos principais?"
              rows={3}
              className="bg-slate-900/50 border-white/10 text-slate-200 placeholder:text-slate-600 focus:border-purple-500"
            />
          ) : (
            <p className="text-slate-400 text-sm leading-relaxed">
              {objectives || "Nenhum objetivo cadastrado."}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
