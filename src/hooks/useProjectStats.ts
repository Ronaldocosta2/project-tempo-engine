import { useMemo } from "react";
import { Task } from "./useTasks";

export interface ProjectStats {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  notStartedTasks: number;
  blockedTasks: number;
  delayedTasks: number;
  completionPercentage: number;
  averageDelay: number;
  criticalTasks: number;
  upcomingDeadlines: Task[];
  mostDelayedTasks: Task[];
}

const calculateDelay = (task: Task): number => {
  const today = new Date();
  const endDate = new Date(task.end_date);
  
  if (task.status === "completed" && task.actual_end_date) {
    // Tarefa concluída: calcular diferença entre data real e prevista
    const actualEnd = new Date(task.actual_end_date);
    return Math.ceil((actualEnd.getTime() - endDate.getTime()) / (1000 * 60 * 60 * 24));
  } else if (task.status !== "completed") {
    // Tarefa não concluída: calcular diferença entre hoje e data prevista
    const delay = Math.ceil((today.getTime() - endDate.getTime()) / (1000 * 60 * 60 * 24));
    return delay > 0 ? delay : 0; // Apenas atrasos positivos
  }
  
  return 0;
};

export const useProjectStats = (tasks: Task[]): ProjectStats => {
  return useMemo(() => {
    const totalTasks = tasks.length;
    
    // Contagem por status
    const completedTasks = tasks.filter(t => t.status === "completed").length;
    const inProgressTasks = tasks.filter(t => t.status === "in-progress").length;
    const notStartedTasks = tasks.filter(t => t.status === "not-started").length;
    const blockedTasks = 0; // Adicionar quando tivermos status bloqueado
    
    // Calcular atrasos
    const tasksWithDelay = tasks.map(task => ({
      ...task,
      delay: calculateDelay(task)
    }));
    
    const delayedTasks = tasksWithDelay.filter(t => t.delay > 0 && t.status !== "completed").length;
    
    // Média de atraso
    const totalDelay = tasksWithDelay.reduce((sum, t) => sum + t.delay, 0);
    const averageDelay = totalTasks > 0 ? Math.round(totalDelay / totalTasks) : 0;
    
    // Percentual de conclusão (baseado no progresso médio)
    const totalProgress = tasks.reduce((sum, t) => sum + (t.progress || 0), 0);
    const completionPercentage = totalTasks > 0 ? Math.round(totalProgress / totalTasks) : 0;
    
    // Tarefas críticas
    const criticalTasks = tasks.filter(t => t.is_critical || t.sla_critical).length;
    
    // Próximas entregas (próximos 7 dias, não concluídas)
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    const upcomingDeadlines = tasks
      .filter(t => {
        const endDate = new Date(t.end_date);
        return t.status !== "completed" && endDate >= today && endDate <= nextWeek;
      })
      .sort((a, b) => new Date(a.end_date).getTime() - new Date(b.end_date).getTime())
      .slice(0, 5);
    
    // Tarefas mais atrasadas
    const mostDelayedTasks = tasksWithDelay
      .filter(t => t.delay > 0 && t.status !== "completed")
      .sort((a, b) => b.delay - a.delay)
      .slice(0, 5);
    
    return {
      totalTasks,
      completedTasks,
      inProgressTasks,
      notStartedTasks,
      blockedTasks,
      delayedTasks,
      completionPercentage,
      averageDelay,
      criticalTasks,
      upcomingDeadlines,
      mostDelayedTasks: mostDelayedTasks as Task[],
    };
  }, [tasks]);
};

export const getTaskDelay = (task: Task): number => {
  return calculateDelay(task);
};

export const getTaskDelayLabel = (task: Task): string => {
  const delay = calculateDelay(task);
  
  if (delay === 0) return "No prazo";
  if (delay > 0 && task.status === "completed") {
    return `Atrasou ${delay} dia${delay > 1 ? 's' : ''}`;
  }
  if (delay > 0) {
    return `${delay} dia${delay > 1 ? 's' : ''} de atraso`;
  }
  
  return "No prazo";
};
