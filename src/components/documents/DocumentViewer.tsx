import { Button } from "@/components/ui/button";
import { ArrowLeft, FileDown } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface DocumentViewerProps {
  type: "tap" | "plano" | "relatorio" | "ata";
  content: any;
  onBack: () => void;
}

export const DocumentViewer = ({ type, content, onBack }: DocumentViewerProps) => {
  const handlePrint = () => {
    window.print();
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      "on-track": "No prazo",
      "at-risk": "Em risco",
      "delayed": "Atrasado",
      "completed": "Concluído",
    };
    return labels[status] || status;
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    try {
      return format(new Date(dateStr), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 mb-4 print:hidden">
        <Button type="button" variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <Button type="button" variant="default" size="sm" onClick={handlePrint}>
          <FileDown className="h-4 w-4 mr-2" />
          Exportar PDF
        </Button>
      </div>

      <div className="bg-white text-black p-8 rounded-lg border print:border-0" id="document-content">
        {type === "tap" && (
          <div className="space-y-6">
            <div className="text-center border-b-2 border-black pb-4">
              <h1 className="text-2xl font-bold mb-2">TERMO DE ABERTURA DE PROJETO</h1>
              <h2 className="text-xl">{content.projectName}</h2>
            </div>

            <section>
              <h3 className="font-bold text-lg mb-2">1. INFORMAÇÕES GERAIS</h3>
              <div className="grid grid-cols-2 gap-4">
                <div><strong>Patrocinador:</strong> {content.sponsor}</div>
                <div><strong>Gerente do Projeto:</strong> {content.manager}</div>
                <div><strong>Data de Início:</strong> {formatDate(content.startDate)}</div>
                <div><strong>Data de Término:</strong> {formatDate(content.endDate)}</div>
                {content.budget && <div><strong>Orçamento:</strong> {content.budget}</div>}
              </div>
            </section>

            <section>
              <h3 className="font-bold text-lg mb-2">2. JUSTIFICATIVA</h3>
              <p className="whitespace-pre-line">{content.justification}</p>
            </section>

            <section>
              <h3 className="font-bold text-lg mb-2">3. OBJETIVOS</h3>
              <p className="whitespace-pre-line">{content.objectives}</p>
            </section>

            <section>
              <h3 className="font-bold text-lg mb-2">4. ESCOPO</h3>
              <p className="whitespace-pre-line">{content.scope}</p>
            </section>

            {content.deliverables && (
              <section>
                <h3 className="font-bold text-lg mb-2">5. PRINCIPAIS ENTREGAS</h3>
                <p className="whitespace-pre-line">{content.deliverables}</p>
              </section>
            )}

            {content.constraints && (
              <section>
                <h3 className="font-bold text-lg mb-2">6. RESTRIÇÕES</h3>
                <p className="whitespace-pre-line">{content.constraints}</p>
              </section>
            )}

            {content.assumptions && (
              <section>
                <h3 className="font-bold text-lg mb-2">7. PREMISSAS</h3>
                <p className="whitespace-pre-line">{content.assumptions}</p>
              </section>
            )}

            {content.risks && (
              <section>
                <h3 className="font-bold text-lg mb-2">8. RISCOS PRINCIPAIS</h3>
                <p className="whitespace-pre-line">{content.risks}</p>
              </section>
            )}

            {content.stakeholders && (
              <section>
                <h3 className="font-bold text-lg mb-2">9. PRINCIPAIS STAKEHOLDERS</h3>
                <p className="whitespace-pre-line">{content.stakeholders}</p>
              </section>
            )}
          </div>
        )}

        {type === "plano" && (
          <div className="space-y-6">
            <div className="text-center border-b-2 border-black pb-4">
              <h1 className="text-2xl font-bold mb-2">PLANO DE PROJETO</h1>
              <h2 className="text-xl mb-1">{content.projectName}</h2>
              <div className="text-sm">Versão {content.version} | {formatDate(content.date)}</div>
            </div>

            <section>
              <h3 className="font-bold text-lg mb-2">1. RESUMO EXECUTIVO</h3>
              <p className="whitespace-pre-line">{content.summary}</p>
            </section>

            <section>
              <h3 className="font-bold text-lg mb-2">2. PLANO DE ESCOPO</h3>
              <p className="whitespace-pre-line">{content.scope}</p>
            </section>

            <section>
              <h3 className="font-bold text-lg mb-2">3. PLANO DE CRONOGRAMA</h3>
              <p className="whitespace-pre-line">{content.schedule}</p>
            </section>

            {content.budget && (
              <section>
                <h3 className="font-bold text-lg mb-2">4. PLANO DE CUSTOS</h3>
                <p className="whitespace-pre-line">{content.budget}</p>
              </section>
            )}

            {content.quality && (
              <section>
                <h3 className="font-bold text-lg mb-2">5. PLANO DE QUALIDADE</h3>
                <p className="whitespace-pre-line">{content.quality}</p>
              </section>
            )}

            {content.resources && (
              <section>
                <h3 className="font-bold text-lg mb-2">6. PLANO DE RECURSOS</h3>
                <p className="whitespace-pre-line">{content.resources}</p>
              </section>
            )}

            {content.communications && (
              <section>
                <h3 className="font-bold text-lg mb-2">7. PLANO DE COMUNICAÇÕES</h3>
                <p className="whitespace-pre-line">{content.communications}</p>
              </section>
            )}

            {content.risks && (
              <section>
                <h3 className="font-bold text-lg mb-2">8. PLANO DE RISCOS</h3>
                <p className="whitespace-pre-line">{content.risks}</p>
              </section>
            )}

            {content.procurement && (
              <section>
                <h3 className="font-bold text-lg mb-2">9. PLANO DE AQUISIÇÕES</h3>
                <p className="whitespace-pre-line">{content.procurement}</p>
              </section>
            )}

            {content.stakeholders && (
              <section>
                <h3 className="font-bold text-lg mb-2">10. REGISTRO DE STAKEHOLDERS</h3>
                <p className="whitespace-pre-line">{content.stakeholders}</p>
              </section>
            )}
          </div>
        )}

        {type === "relatorio" && (
          <div className="space-y-6">
            <div className="text-center border-b-2 border-black pb-4">
              <h1 className="text-2xl font-bold mb-2">RELATÓRIO DE STATUS</h1>
              <h2 className="text-xl mb-1">{content.projectName}</h2>
              <div className="text-sm">{content.period} | {formatDate(content.reportDate)}</div>
            </div>

            <section>
              <h3 className="font-bold text-lg mb-2">STATUS GERAL</h3>
              <div className="grid grid-cols-2 gap-4">
                <div><strong>Status:</strong> {getStatusLabel(content.overallStatus)}</div>
                <div><strong>Progresso:</strong> {content.progress}%</div>
              </div>
            </section>

            <section>
              <h3 className="font-bold text-lg mb-2">RESUMO EXECUTIVO</h3>
              <p className="whitespace-pre-line">{content.summary}</p>
            </section>

            <section>
              <h3 className="font-bold text-lg mb-2">REALIZAÇÕES DO PERÍODO</h3>
              <p className="whitespace-pre-line">{content.accomplishments}</p>
            </section>

            {content.upcoming && (
              <section>
                <h3 className="font-bold text-lg mb-2">PRÓXIMAS ATIVIDADES</h3>
                <p className="whitespace-pre-line">{content.upcoming}</p>
              </section>
            )}

            {content.issues && (
              <section>
                <h3 className="font-bold text-lg mb-2">PROBLEMAS E OBSTÁCULOS</h3>
                <p className="whitespace-pre-line">{content.issues}</p>
              </section>
            )}

            {content.risks && (
              <section>
                <h3 className="font-bold text-lg mb-2">RISCOS</h3>
                <p className="whitespace-pre-line">{content.risks}</p>
              </section>
            )}

            {content.budget && (
              <section>
                <h3 className="font-bold text-lg mb-2">STATUS DO ORÇAMENTO</h3>
                <p className="whitespace-pre-line">{content.budget}</p>
              </section>
            )}

            {content.schedule && (
              <section>
                <h3 className="font-bold text-lg mb-2">STATUS DO CRONOGRAMA</h3>
                <p className="whitespace-pre-line">{content.schedule}</p>
              </section>
            )}

            {content.scope && (
              <section>
                <h3 className="font-bold text-lg mb-2">STATUS DO ESCOPO</h3>
                <p className="whitespace-pre-line">{content.scope}</p>
              </section>
            )}
          </div>
        )}

        {type === "ata" && (
          <div className="space-y-6">
            <div className="text-center border-b-2 border-black pb-4">
              <h1 className="text-2xl font-bold mb-2">ATA DE REUNIÃO</h1>
              <h2 className="text-xl mb-1">{content.projectName}</h2>
              <div className="text-sm">{formatDate(content.meetingDate)}</div>
            </div>

            <section>
              <h3 className="font-bold text-lg mb-2">INFORMAÇÕES DA REUNIÃO</h3>
              <div className="grid grid-cols-2 gap-2">
                <div><strong>Data:</strong> {formatDate(content.meetingDate)}</div>
                {content.startTime && <div><strong>Horário:</strong> {content.startTime} {content.endTime && `- ${content.endTime}`}</div>}
                {content.location && <div><strong>Local:</strong> {content.location}</div>}
                {content.facilitator && <div><strong>Facilitador:</strong> {content.facilitator}</div>}
              </div>
            </section>

            <section>
              <h3 className="font-bold text-lg mb-2">PARTICIPANTES</h3>
              <div><strong>Presentes:</strong></div>
              <p className="whitespace-pre-line mb-2">{content.attendees}</p>
              {content.absentees && (
                <>
                  <div><strong>Ausentes:</strong></div>
                  <p className="whitespace-pre-line">{content.absentees}</p>
                </>
              )}
            </section>

            <section>
              <h3 className="font-bold text-lg mb-2">OBJETIVO</h3>
              <p className="whitespace-pre-line">{content.objective}</p>
            </section>

            {content.agenda && (
              <section>
                <h3 className="font-bold text-lg mb-2">PAUTA</h3>
                <p className="whitespace-pre-line">{content.agenda}</p>
              </section>
            )}

            <section>
              <h3 className="font-bold text-lg mb-2">DISCUSSÕES E COMENTÁRIOS</h3>
              <p className="whitespace-pre-line">{content.discussions}</p>
            </section>

            {content.decisions && (
              <section>
                <h3 className="font-bold text-lg mb-2">DECISÕES TOMADAS</h3>
                <p className="whitespace-pre-line">{content.decisions}</p>
              </section>
            )}

            {content.actionItems && (
              <section>
                <h3 className="font-bold text-lg mb-2">ITENS DE AÇÃO</h3>
                <p className="whitespace-pre-line">{content.actionItems}</p>
              </section>
            )}

            {content.nextMeeting && (
              <section>
                <h3 className="font-bold text-lg mb-2">PRÓXIMA REUNIÃO</h3>
                <p>{content.nextMeeting}</p>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
