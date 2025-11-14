import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, FileText } from "lucide-react";
import { useState, useRef } from "react";
import { parseGanttFile, GanttTask } from "@/lib/ganttFileParser";
import { toast } from "sonner";

interface GanttImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (tasks: GanttTask[]) => void;
}

export const GanttImportDialog = ({ open, onOpenChange, onImport }: GanttImportDialogProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<GanttTask[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);

    try {
      const content = await selectedFile.text();
      const tasks = parseGanttFile(content);
      setPreview(tasks);
      
      if (tasks.length === 0) {
        toast.error("Nenhuma tarefa encontrada no arquivo");
      } else {
        toast.success(`${tasks.length} tarefas encontradas`);
      }
    } catch (error) {
      toast.error("Erro ao ler o arquivo");
      console.error(error);
    }
  };

  const handleImport = () => {
    if (preview.length > 0) {
      onImport(preview);
      handleClose();
      toast.success(`${preview.length} tarefas importadas com sucesso`);
    }
  };

  const handleClose = () => {
    setFile(null);
    setPreview([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Importar Tarefas de Arquivo .gantt</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
            <input
              ref={fileInputRef}
              type="file"
              accept=".gantt,.txt,.csv"
              onChange={handleFileSelect}
              className="hidden"
              id="gantt-file-input"
            />
            <label htmlFor="gantt-file-input" className="cursor-pointer">
              <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-sm font-medium mb-1">
                Clique para selecionar um arquivo .gantt
              </p>
              <p className="text-xs text-muted-foreground">
                Formatos suportados: .gantt, .txt, .csv
              </p>
            </label>
          </div>

          {file && (
            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-medium flex-1">{file.name}</span>
              <span className="text-xs text-muted-foreground">
                {preview.length} tarefas
              </span>
            </div>
          )}

          {preview.length > 0 && (
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-muted px-4 py-2 font-semibold text-sm">
                Preview das Tarefas
              </div>
              <div className="max-h-64 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50 sticky top-0">
                    <tr>
                      <th className="px-3 py-2 text-left">ID</th>
                      <th className="px-3 py-2 text-left">Nome</th>
                      <th className="px-3 py-2 text-left">Início</th>
                      <th className="px-3 py-2 text-left">Fim</th>
                      <th className="px-3 py-2 text-left">Duração</th>
                    </tr>
                  </thead>
                  <tbody>
                    {preview.map((task) => (
                      <tr key={task.id} className="border-t">
                        <td className="px-3 py-2">{task.wbs}</td>
                        <td className="px-3 py-2">{task.name}</td>
                        <td className="px-3 py-2">{task.startDate}</td>
                        <td className="px-3 py-2">{task.endDate}</td>
                        <td className="px-3 py-2">{task.duration} dias</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="bg-muted/50 p-3 rounded-lg text-xs">
            <p className="font-semibold mb-1">Formato esperado:</p>
            <p className="text-muted-foreground">
              ID, Nome, Data Início, Data Fim, Duração, Progresso, Dependências, Recursos, Cor, Crítico
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button onClick={handleImport} disabled={preview.length === 0}>
            Importar {preview.length} Tarefas
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
