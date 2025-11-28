import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCrossProjectAnalysis } from "@/hooks/useCrossProjectAnalysis";
import { Calendar, AlertTriangle, Clock } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const CrossProjectAnalysis = () => {
  const { data: conflicts, isLoading } = useCrossProjectAnalysis();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-96" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!conflicts || conflicts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Análise Cross-Project
          </CardTitle>
          <CardDescription>
            Tarefas de diferentes projetos no mesmo período
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertDescription>
              Nenhum conflito cross-project detectado no momento.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Análise Cross-Project
          <Badge variant="secondary">{conflicts.length}</Badge>
        </CardTitle>
        <CardDescription>
          Tarefas de diferentes projetos com sobreposição de datas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {conflicts.map((conflict) => (
            <div key={conflict.task.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">{conflict.task.name}</h4>
                    {conflict.task.is_critical && (
                      <Badge variant="destructive" className="gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        Crítica
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Projeto: {conflict.project_name}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-sm">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {format(new Date(conflict.task.start_date), "dd/MM/yyyy", { locale: ptBR })}
                      {" → "}
                      {format(new Date(conflict.task.end_date), "dd/MM/yyyy", { locale: ptBR })}
                    </span>
                    <Badge variant="outline">{conflict.task.duration} dias</Badge>
                  </div>
                </div>
              </div>

              <div className="pl-4 border-l-2 border-muted">
                <p className="text-sm font-medium mb-2">
                  Sobreposições com outras tarefas:
                </p>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tarefa</TableHead>
                      <TableHead>Projeto</TableHead>
                      <TableHead>Período</TableHead>
                      <TableHead>Dias Sobrepostos</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {conflict.overlapping_tasks.map((overlap) => (
                      <TableRow key={overlap.task.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{overlap.task.name}</div>
                            {overlap.task.is_critical && (
                              <Badge variant="destructive" className="mt-1 gap-1">
                                <AlertTriangle className="h-3 w-3" />
                                Crítica
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">{overlap.project_name}</TableCell>
                        <TableCell className="text-sm">
                          {format(new Date(overlap.task.start_date), "dd/MM", { locale: ptBR })}
                          {" - "}
                          {format(new Date(overlap.task.end_date), "dd/MM", { locale: ptBR })}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{overlap.days_overlap} dias</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              overlap.task.status === "completed"
                                ? "default"
                                : overlap.task.status === "in-progress"
                                ? "secondary"
                                : "outline"
                            }
                          >
                            {overlap.task.status === "completed"
                              ? "Concluída"
                              : overlap.task.status === "in-progress"
                              ? "Em Andamento"
                              : "Não Iniciada"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
