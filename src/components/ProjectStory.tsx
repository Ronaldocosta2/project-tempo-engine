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
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <CardTitle>História e Contexto</CardTitle>
          </div>
          {!isEditing ? (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleCancel}>
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
              <Button size="sm" onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Salvar
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-medium mb-2">Origem do Projeto</h4>
          {isEditing ? (
            <Textarea
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              placeholder="Como e por que este projeto surgiu?"
              rows={3}
            />
          ) : (
            <p className="text-muted-foreground">
              {origin || "Nenhuma informação cadastrada."}
            </p>
          )}
        </div>

        <div>
          <h4 className="font-medium mb-2">História</h4>
          {isEditing ? (
            <Textarea
              value={story}
              onChange={(e) => setStory(e.target.value)}
              placeholder="Conte a história do projeto..."
              rows={4}
            />
          ) : (
            <p className="text-muted-foreground">
              {story || "Nenhuma história cadastrada."}
            </p>
          )}
        </div>

        <div>
          <h4 className="font-medium mb-2">Impacto Esperado</h4>
          {isEditing ? (
            <Textarea
              value={impact}
              onChange={(e) => setImpact(e.target.value)}
              placeholder="Qual o impacto esperado deste projeto?"
              rows={3}
            />
          ) : (
            <p className="text-muted-foreground">
              {impact || "Nenhum impacto cadastrado."}
            </p>
          )}
        </div>

        <div>
          <h4 className="font-medium mb-2">Objetivos Principais</h4>
          {isEditing ? (
            <Textarea
              value={objectives}
              onChange={(e) => setObjectives(e.target.value)}
              placeholder="Quais são os objetivos principais?"
              rows={3}
            />
          ) : (
            <p className="text-muted-foreground">
              {objectives || "Nenhum objetivo cadastrado."}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
