import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Upload, FileText, AlertCircle, CheckCircle2, AlertTriangle } from "lucide-react";
import { parseCSV, ImportResult } from "@/lib/taskImportParser";
import { Task } from "@/hooks/useTasks";

interface TaskImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (tasks: Partial<Task>[]) => Promise<void>;
  projectId: string;
}

export const TaskImportDialog = ({
  open,
  onOpenChange,
  onImport,
  projectId,
}: TaskImportDialogProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [useBusinessDays, setUseBusinessDays] = useState(true);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    
    // Parse CSV
    const text = await selectedFile.text();
    const result = parseCSV(text, {
      useBusinessDays,
      projectId,
    });
    
    setImportResult(result);
  };

  const handleImport = async () => {
    if (!importResult || importResult.tasks.length === 0) return;
    
    setIsImporting(true);
    try {
      await onImport(importResult.tasks);
      onOpenChange(false);
      resetDialog();
    } catch (error) {
      console.error("Erro ao importar:", error);
    } finally {
      setIsImporting(false);
    }
  };

  const resetDialog = () => {
    setFile(null);
    setImportResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClose = () => {
    resetDialog();
    onOpenChange(false);
  };

  const hasErrors = importResult && importResult.errors.length > 0;
  const canImport = importResult && importResult.tasks.length > 0 && !hasErrors;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Importar Tarefas do Cronograma
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
          {/* File Upload Area */}
          {!file && (
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center space-y-4">
              <div className="flex justify-center">
                <FileText className="h-12 w-12 text-muted-foreground" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Selecione um arquivo CSV</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Arquivo deve conter colunas: WBS, Nome, e 2 de 3 (Início, Fim, Duração)
                </p>
                <Button onClick={() => fileInputRef.current?.click()}>
                  Escolher Arquivo
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            </div>
          )}

          {/* Options */}
          {file && !importResult && (
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-2">
                <Label htmlFor="business-days">Usar dias úteis (excluir fins de semana)</Label>
              </div>
              <Switch
                id="business-days"
                checked={useBusinessDays}
                onCheckedChange={setUseBusinessDays}
              />
            </div>
          )}

          {/* Import Result */}
          {importResult && (
            <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
              {/* Summary Cards */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total</span>
                    <Badge variant="outline">{importResult.total}</Badge>
                  </div>
                </div>
                <div className="p-4 border rounded-lg bg-success-light/10">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Sucesso</span>
                    <Badge className="bg-success-light text-success border-success/20">
                      {importResult.success}
                    </Badge>
                  </div>
                </div>
                <div className="p-4 border rounded-lg bg-critical-light/10">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Erros</span>
                    <Badge className="bg-critical-light text-critical border-critical/20">
                      {importResult.failed}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Errors and Warnings */}
              {(importResult.errors.length > 0 || importResult.warnings.length > 0) && (
                <ScrollArea className="flex-1 border rounded-lg p-4">
                  <div className="space-y-2">
                    {importResult.errors.map((error, idx) => (
                      <Alert key={`error-${idx}`} variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          <span className="font-semibold">Linha {error.line}</span> [{error.code}]: {error.message}
                        </AlertDescription>
                      </Alert>
                    ))}
                    {importResult.warnings.map((warning, idx) => (
                      <Alert key={`warning-${idx}`}>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          <span className="font-semibold">Linha {warning.line}</span> [W001]: {warning.message}
                        </AlertDescription>
                      </Alert>
                    ))}
                  </div>
                </ScrollArea>
              )}

              {/* Preview Tasks */}
              {importResult.tasks.length > 0 && (
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    Preview das Tarefas ({Math.min(10, importResult.tasks.length)} de {importResult.tasks.length})
                  </h4>
                  <ScrollArea className="h-[200px]">
                    <div className="space-y-2">
                      {importResult.tasks.slice(0, 10).map((task, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-2 rounded bg-muted/50 text-sm">
                          <Badge variant="outline">{task.wbs}</Badge>
                          <span className="flex-1 truncate">{task.name}</span>
                          <span className="text-muted-foreground">{task.duration}d</span>
                          <Badge variant="outline">{task.progress}%</Badge>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="flex items-center justify-between">
          <div className="flex-1">
            {file && (
              <Button variant="ghost" onClick={resetDialog}>
                Escolher Outro Arquivo
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button
              onClick={handleImport}
              disabled={!canImport || isImporting}
            >
              {isImporting ? "Importando..." : `Importar ${importResult?.tasks.length || 0} Tarefas`}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
