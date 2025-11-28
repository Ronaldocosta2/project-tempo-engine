import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileText, FileCheck, BarChart3, Users } from "lucide-react";
import { TAPForm } from "./documents/TAPForm";
import { PlanForm } from "./documents/PlanForm";
import { StatusReportForm } from "./documents/StatusReportForm";
import { MeetingMinutesForm } from "./documents/MeetingMinutesForm";

interface DocumentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
}

type DocumentType = "tap" | "plano" | "relatorio" | "ata" | null;

export const DocumentDialog = ({ open, onOpenChange, projectId }: DocumentDialogProps) => {
  const [selectedType, setSelectedType] = useState<DocumentType>(null);

  const documentTypes = [
    {
      type: "tap" as const,
      icon: FileCheck,
      label: "TAP (Termo de Abertura)",
      description: "Documento de abertura do projeto",
      color: "text-blue-500",
    },
    {
      type: "plano" as const,
      icon: FileText,
      label: "Plano de Projeto",
      description: "Documento completo do projeto",
      color: "text-green-500",
    },
    {
      type: "relatorio" as const,
      icon: BarChart3,
      label: "Relatório de Status",
      description: "Relatório periódico de andamento",
      color: "text-orange-500",
    },
    {
      type: "ata" as const,
      icon: Users,
      label: "Ata de Reunião",
      description: "Registro de reunião realizada",
      color: "text-purple-500",
    },
  ];

  const handleBack = () => {
    setSelectedType(null);
  };

  const handleClose = () => {
    setSelectedType(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {!selectedType ? "Gerar Documentação" : "Preencher Documento"}
          </DialogTitle>
        </DialogHeader>

        {!selectedType ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            {documentTypes.map((doc) => {
              const Icon = doc.icon;
              return (
                <Button
                  key={doc.type}
                  variant="outline"
                  className="h-auto flex-col items-start p-6 hover:bg-accent"
                  onClick={() => setSelectedType(doc.type)}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Icon className={`h-6 w-6 ${doc.color}`} />
                    <h3 className="font-semibold text-left">{doc.label}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground text-left">
                    {doc.description}
                  </p>
                </Button>
              );
            })}
          </div>
        ) : (
          <div>
            {selectedType === "tap" && (
              <TAPForm projectId={projectId} onBack={handleBack} onClose={handleClose} />
            )}
            {selectedType === "plano" && (
              <PlanForm projectId={projectId} onBack={handleBack} onClose={handleClose} />
            )}
            {selectedType === "relatorio" && (
              <StatusReportForm projectId={projectId} onBack={handleBack} onClose={handleClose} />
            )}
            {selectedType === "ata" && (
              <MeetingMinutesForm projectId={projectId} onBack={handleBack} onClose={handleClose} />
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
