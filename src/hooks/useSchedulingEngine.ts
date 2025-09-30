import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Task } from "./useTasks";

interface Dependency {
  id: string;
  predecessor_id: string;
  successor_id: string;
  dependency_type: "FS" | "SS" | "FF" | "SF";
  lag_days: number;
}

interface ScheduleResult {
  tasks: Task[];
  projectEndDate: string;
  criticalPath: string[];
  projectEndDateP50?: string;
  projectEndDateP80?: string;
  bottlenecks: Array<{ taskId: string; reason: string }>;
}

export const useSchedulingEngine = () => {
  // Calcular duração PERT
  const calculatePertDuration = useCallback((task: Task): number => {
    if (
      task.use_pert &&
      task.optimistic_duration &&
      task.most_likely_duration &&
      task.pessimistic_duration
    ) {
      return Math.round(
        (task.optimistic_duration + 4 * task.most_likely_duration + task.pessimistic_duration) / 6
      );
    }
    return task.duration;
  }, []);

  // Calcular duração restante considerando progresso
  const calculateRemainingDuration = useCallback(
    (task: Task): number => {
      const baseDuration = calculatePertDuration(task);
      return Math.max(0, Math.round(baseDuration * (1 - task.progress / 100)));
    },
    [calculatePertDuration]
  );

  // Adicionar dias úteis a uma data (simplificado, pode ser melhorado com calendários)
  const addWorkingDays = useCallback((date: Date, days: number): Date => {
    const result = new Date(date);
    let addedDays = 0;
    
    while (addedDays < days) {
      result.setDate(result.getDate() + 1);
      const dayOfWeek = result.getDay();
      
      // Skip weekends (0 = Sunday, 6 = Saturday)
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        addedDays++;
      }
    }
    
    return result;
  }, []);

  // Forward Pass - Calcula Early Start e Early Finish
  const forwardPass = useCallback(
    (tasks: Task[], dependencies: Dependency[], projectStartDate: string): Task[] => {
      const taskMap = new Map(tasks.map((t) => [t.id, { ...t }]));
      const depMap = new Map<string, Dependency[]>();

      // Agrupar dependências por sucessor
      dependencies.forEach((dep) => {
        if (!depMap.has(dep.successor_id)) {
          depMap.set(dep.successor_id, []);
        }
        depMap.get(dep.successor_id)!.push(dep);
      });

      // Ordenação topológica
      const sorted: Task[] = [];
      const visited = new Set<string>();
      const temp = new Set<string>();

      const visit = (taskId: string) => {
        if (visited.has(taskId)) return;
        if (temp.has(taskId)) return; // Ciclo detectado

        temp.add(taskId);
        
        const deps = depMap.get(taskId) || [];
        deps.forEach((dep) => visit(dep.predecessor_id));
        
        temp.delete(taskId);
        visited.add(taskId);
        const task = taskMap.get(taskId);
        if (task) sorted.push(task);
      };

      tasks.forEach((task) => visit(task.id));

      // Calcular ES e EF
      sorted.forEach((task) => {
        const deps = depMap.get(task.id) || [];
        let maxPredFinish = new Date(projectStartDate);

        deps.forEach((dep) => {
          const pred = taskMap.get(dep.predecessor_id);
          if (!pred?.early_finish) return;

          let predDate = new Date(pred.early_finish);

          switch (dep.dependency_type) {
            case "FS": // Finish-to-Start (padrão)
              predDate = addWorkingDays(predDate, dep.lag_days);
              break;
            case "SS": // Start-to-Start
              predDate = new Date(pred.early_start || pred.start_date);
              predDate = addWorkingDays(predDate, dep.lag_days);
              break;
            case "FF": // Finish-to-Finish
              predDate = new Date(pred.early_finish);
              predDate = addWorkingDays(predDate, dep.lag_days);
              break;
            case "SF": // Start-to-Finish
              predDate = new Date(pred.early_start || pred.start_date);
              predDate = addWorkingDays(predDate, dep.lag_days);
              break;
          }

          if (predDate > maxPredFinish) {
            maxPredFinish = predDate;
          }
        });

        const earlyStart = maxPredFinish;
        const duration = calculateRemainingDuration(task);
        const earlyFinish = addWorkingDays(earlyStart, duration);

        task.early_start = earlyStart.toISOString().split("T")[0];
        task.early_finish = earlyFinish.toISOString().split("T")[0];
        
        taskMap.set(task.id, task);
      });

      return Array.from(taskMap.values());
    },
    [calculateRemainingDuration, addWorkingDays]
  );

  // Backward Pass - Calcula Late Start e Late Finish
  const backwardPass = useCallback(
    (tasks: Task[], dependencies: Dependency[], projectEndDate: string): Task[] => {
      const taskMap = new Map(tasks.map((t) => [t.id, { ...t }]));
      const depMap = new Map<string, Dependency[]>();

      // Agrupar dependências por predecessor
      dependencies.forEach((dep) => {
        if (!depMap.has(dep.predecessor_id)) {
          depMap.set(dep.predecessor_id, []);
        }
        depMap.get(dep.predecessor_id)!.push(dep);
      });

      // Começar do final
      const sorted = [...tasks].reverse();

      sorted.forEach((task) => {
        const deps = depMap.get(task.id) || [];
        let minSuccStart = new Date(projectEndDate);

        if (deps.length === 0) {
          // Tarefa final
          minSuccStart = new Date(task.early_finish || projectEndDate);
        } else {
          deps.forEach((dep) => {
            const succ = taskMap.get(dep.successor_id);
            if (!succ?.late_start) return;

            let succDate = new Date(succ.late_start);

            switch (dep.dependency_type) {
              case "FS":
                succDate = addWorkingDays(succDate, -dep.lag_days);
                break;
              case "SS":
                succDate = new Date(succ.late_start);
                succDate = addWorkingDays(succDate, -dep.lag_days);
                break;
              case "FF":
                succDate = new Date(succ.late_finish || succ.end_date);
                succDate = addWorkingDays(succDate, -dep.lag_days);
                break;
              case "SF":
                succDate = new Date(succ.late_finish || succ.end_date);
                succDate = addWorkingDays(succDate, -dep.lag_days);
                break;
            }

            if (succDate < minSuccStart) {
              minSuccStart = succDate;
            }
          });
        }

        const duration = calculateRemainingDuration(task);
        const lateFinish = minSuccStart;
        const lateStart = addWorkingDays(lateFinish, -duration);

        task.late_start = lateStart.toISOString().split("T")[0];
        task.late_finish = lateFinish.toISOString().split("T")[0];

        // Calcular folga
        const es = new Date(task.early_start || task.start_date);
        const ls = new Date(task.late_start);
        task.slack = Math.floor((ls.getTime() - es.getTime()) / (1000 * 60 * 60 * 24));
        task.is_critical = task.slack === 0;

        taskMap.set(task.id, task);
      });

      return Array.from(taskMap.values());
    },
    [calculateRemainingDuration, addWorkingDays]
  );

  // Recalcular cronograma completo
  const recalculateSchedule = useCallback(
    async (projectId: string): Promise<ScheduleResult> => {
      // Buscar tarefas
      const { data: tasks, error: tasksError } = await supabase
        .from("tasks")
        .select("*")
        .eq("project_id", projectId);

      if (tasksError) throw tasksError;
      if (!tasks || tasks.length === 0) {
        return {
          tasks: [],
          projectEndDate: new Date().toISOString().split("T")[0],
          criticalPath: [],
          bottlenecks: [],
        };
      }

      // Buscar dependências
      const { data: dependenciesData, error: depsError } = await supabase
        .from("task_dependencies")
        .select("*")
        .in(
          "successor_id",
          tasks.map((t) => t.id)
        );

      if (depsError) throw depsError;
      
      const dependencies = (dependenciesData || []).map((dep) => ({
        id: dep.id,
        predecessor_id: dep.predecessor_id,
        successor_id: dep.successor_id,
        dependency_type: (dep.dependency_type || "FS") as "FS" | "SS" | "FF" | "SF",
        lag_days: dep.lag_days || 0,
      }));

      // Buscar projeto para obter data de início
      const { data: project } = await supabase
        .from("projects")
        .select("start_date")
        .eq("id", projectId)
        .single();

      const projectStartDate = project?.start_date || new Date().toISOString().split("T")[0];

      // Forward pass
      let updatedTasks = forwardPass(tasks as Task[], dependencies, projectStartDate);

      // Encontrar data final do projeto
      const projectEndDate = updatedTasks.reduce((latest, task) => {
        const taskEnd = new Date(task.early_finish || task.end_date);
        return taskEnd > new Date(latest) ? task.early_finish || task.end_date : latest;
      }, projectStartDate);

      // Backward pass
      updatedTasks = backwardPass(updatedTasks, dependencies, projectEndDate);

      // Identificar caminho crítico
      const criticalPath = updatedTasks
        .filter((t) => t.is_critical)
        .map((t) => t.id);

      // Identificar gargalos (folga < 2 dias)
      const bottlenecks = updatedTasks
        .filter((t) => t.slack !== undefined && t.slack < 2 && t.slack >= 0)
        .map((t) => ({
          taskId: t.id,
          reason: `Folga de apenas ${t.slack} dia(s)`,
        }));

      // Atualizar tarefas no banco
      await Promise.all(
        updatedTasks.map((task) =>
          supabase
            .from("tasks")
            .update({
              early_start: task.early_start,
              early_finish: task.early_finish,
              late_start: task.late_start,
              late_finish: task.late_finish,
              slack: task.slack,
              is_critical: task.is_critical,
            })
            .eq("id", task.id)
        )
      );

      return {
        tasks: updatedTasks,
        projectEndDate,
        criticalPath,
        bottlenecks,
      };
    },
    [forwardPass, backwardPass]
  );

  // Simulação Monte Carlo (simplificada)
  const runMonteCarloSimulation = useCallback(
    async (projectId: string, iterations: number = 1000): Promise<{ p50: string; p80: string }> => {
      const { data: tasks } = await supabase
        .from("tasks")
        .select("*")
        .eq("project_id", projectId);

      if (!tasks || tasks.length === 0) {
        const today = new Date().toISOString().split("T")[0];
        return { p50: today, p80: today };
      }

      const endDates: number[] = [];

      for (let i = 0; i < iterations; i++) {
        // Simular duração variável usando distribuição Beta-PERT
        const simulatedTasks = tasks.map((task) => {
          let duration = task.duration;
          
          if (
            task.use_pert &&
            task.optimistic_duration &&
            task.most_likely_duration &&
            task.pessimistic_duration
          ) {
            // Simulação simplificada com distribuição triangular
            const random = Math.random();
            const o = task.optimistic_duration;
            const m = task.most_likely_duration;
            const p = task.pessimistic_duration;
            
            if (random < 0.5) {
              duration = o + Math.sqrt(random * 2 * (m - o) * (p - o)) / Math.sqrt(p - o);
            } else {
              duration = p - Math.sqrt((1 - random) * 2 * (p - m) * (p - o)) / Math.sqrt(p - o);
            }
          }
          
          return { ...task, duration: Math.round(duration) };
        });

        // Calcular data final com essas durações
        const maxEnd = simulatedTasks.reduce((latest, task) => {
          const taskEnd = new Date(task.end_date);
          return taskEnd > new Date(latest) ? task.end_date : latest;
        }, tasks[0].end_date);

        endDates.push(new Date(maxEnd).getTime());
      }

      // Ordenar e calcular percentis
      endDates.sort((a, b) => a - b);
      const p50Index = Math.floor(iterations * 0.5);
      const p80Index = Math.floor(iterations * 0.8);

      return {
        p50: new Date(endDates[p50Index]).toISOString().split("T")[0],
        p80: new Date(endDates[p80Index]).toISOString().split("T")[0],
      };
    },
    []
  );

  return {
    recalculateSchedule,
    runMonteCarloSimulation,
    calculatePertDuration,
    calculateRemainingDuration,
  };
};
