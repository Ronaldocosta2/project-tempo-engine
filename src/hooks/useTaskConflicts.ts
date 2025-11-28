import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Task } from "./useTasks";

export interface TaskConflict {
  id: string;
  project_id: string;
  task_a_id: string;
  task_b_id: string | null;
  conflict_type: "resource" | "capacity" | "dependency" | "calendar";
  severity: "low" | "medium" | "high";
  details: Record<string, any>;
  status: "open" | "resolved" | "ignored";
  detected_at: string;
  resolved_at?: string;
  resolution_action?: string;
}

interface ConflictDetectionResult {
  conflicts: TaskConflict[];
  taskA?: Task;
  taskB?: Task;
}

// Helper to check if two date ranges overlap
const datesOverlap = (start1: string, end1: string, start2: string, end2: string): boolean => {
  const s1 = new Date(start1);
  const e1 = new Date(end1);
  const s2 = new Date(start2);
  const e2 = new Date(end2);
  return s1 < e2 && s2 < e1;
};

// Detect resource conflicts (same resource, overlapping dates)
const detectResourceConflicts = (tasks: Task[]): Omit<TaskConflict, "id" | "created_at" | "updated_at" | "detected_at">[] => {
  const conflicts: Omit<TaskConflict, "id" | "created_at" | "updated_at" | "detected_at">[] = [];
  const activeTasks = tasks.filter(t => t.status !== "completed" && t.resource_id);

  for (let i = 0; i < activeTasks.length; i++) {
    for (let j = i + 1; j < activeTasks.length; j++) {
      const taskA = activeTasks[i];
      const taskB = activeTasks[j];

      if (
        taskA.resource_id === taskB.resource_id &&
        datesOverlap(taskA.start_date, taskA.end_date, taskB.start_date, taskB.end_date)
      ) {
        conflicts.push({
          project_id: taskA.project_id,
          task_a_id: taskA.id,
          task_b_id: taskB.id,
          conflict_type: "resource",
          severity: "high",
          status: "open",
          details: {
            resource_id: taskA.resource_id,
            overlap_start: new Date(Math.max(new Date(taskA.start_date).getTime(), new Date(taskB.start_date).getTime())).toISOString().split('T')[0],
            overlap_end: new Date(Math.min(new Date(taskA.end_date).getTime(), new Date(taskB.end_date).getTime())).toISOString().split('T')[0],
          },
        });
      }
    }
  }

  return conflicts;
};

// Detect capacity conflicts (resource allocation > 100% in same period)
const detectCapacityConflicts = (tasks: Task[]): Omit<TaskConflict, "id" | "created_at" | "updated_at" | "detected_at">[] => {
  const conflicts: Omit<TaskConflict, "id" | "created_at" | "updated_at" | "detected_at">[] = [];
  const activeTasks = tasks.filter(t => t.status !== "completed" && t.resource_id);

  // Group by resource and check total capacity per day
  const resourceMap = new Map<string, Task[]>();
  activeTasks.forEach(task => {
    if (!task.resource_id) return;
    if (!resourceMap.has(task.resource_id)) {
      resourceMap.set(task.resource_id, []);
    }
    resourceMap.get(task.resource_id)!.push(task);
  });

  resourceMap.forEach((resourceTasks, resourceId) => {
    // Check each day for capacity overflow
    const dateMap = new Map<string, Task[]>();
    
    resourceTasks.forEach(task => {
      const start = new Date(task.start_date);
      const end = new Date(task.end_date);
      
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const dateKey = d.toISOString().split('T')[0];
        if (!dateMap.has(dateKey)) {
          dateMap.set(dateKey, []);
        }
        dateMap.get(dateKey)!.push(task);
      }
    });

    dateMap.forEach((tasksOnDate, date) => {
      const totalCapacity = tasksOnDate.reduce((sum, t) => sum + (t.capacity_percent || 100), 0);
      
      if (totalCapacity > 100) {
        tasksOnDate.forEach(task => {
          conflicts.push({
            project_id: task.project_id,
            task_a_id: task.id,
            task_b_id: null,
            conflict_type: "capacity",
            severity: totalCapacity > 150 ? "high" : "medium",
            status: "open",
            details: {
              resource_id: resourceId,
              date,
              total_capacity: totalCapacity,
              other_tasks: tasksOnDate.filter(t => t.id !== task.id).map(t => ({ id: t.id, name: t.name, capacity: t.capacity_percent || 100 })),
            },
          });
        });
      }
    });
  });

  return conflicts;
};

// Detect dependency conflicts (task starts before predecessor ends)
const detectDependencyConflicts = async (projectId: string, tasks: Task[]): Promise<Omit<TaskConflict, "id" | "created_at" | "updated_at" | "detected_at">[]> => {
  const conflicts: Omit<TaskConflict, "id" | "created_at" | "updated_at" | "detected_at">[] = [];
  
  const { data: dependencies } = await supabase
    .from("task_dependencies")
    .select("*")
    .in("predecessor_id", tasks.map(t => t.id));

  if (!dependencies) return conflicts;

  dependencies.forEach(dep => {
    const predecessor = tasks.find(t => t.id === dep.predecessor_id);
    const successor = tasks.find(t => t.id === dep.successor_id);

    if (predecessor && successor) {
      const predEnd = new Date(predecessor.end_date);
      const succStart = new Date(successor.start_date);
      
      if (succStart < predEnd) {
        conflicts.push({
          project_id: projectId,
          task_a_id: successor.id,
          task_b_id: predecessor.id,
          conflict_type: "dependency",
          severity: "high",
          status: "open",
          details: {
            dependency_type: dep.dependency_type,
            lag_days: dep.lag_days,
            predecessor_end: predecessor.end_date,
            successor_start: successor.start_date,
            days_violation: Math.ceil((predEnd.getTime() - succStart.getTime()) / (1000 * 60 * 60 * 24)),
          },
        });
      }
    }
  });

  return conflicts;
};

// Detect calendar conflicts (task on non-working days)
const detectCalendarConflicts = (tasks: Task[]): Omit<TaskConflict, "id" | "created_at" | "updated_at" | "detected_at">[] => {
  const conflicts: Omit<TaskConflict, "id" | "created_at" | "updated_at" | "detected_at">[] = [];
  
  tasks.forEach(task => {
    const start = new Date(task.start_date);
    const end = new Date(task.end_date);
    const dayOfWeek = start.getDay(); // 0 = Sunday, 6 = Saturday
    
    // Check if starts/ends on weekend
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      conflicts.push({
        project_id: task.project_id,
        task_a_id: task.id,
        task_b_id: null,
        conflict_type: "calendar",
        severity: "low",
        status: "open",
        details: {
          issue: "Task starts on weekend",
          date: task.start_date,
          day: dayOfWeek === 0 ? "Sunday" : "Saturday",
        },
      });
    }
  });

  return conflicts;
};

export const useTaskConflicts = (projectId: string) => {
  return useQuery({
    queryKey: ["task-conflicts", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("task_conflicts")
        .select("*")
        .eq("project_id", projectId)
        .order("detected_at", { ascending: false });

      if (error) throw error;
      return data as TaskConflict[];
    },
    enabled: !!projectId,
  });
};

export const useScanConflicts = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ projectId, tasks }: { projectId: string; tasks: Task[] }) => {
      // Detect all types of conflicts
      const resourceConflicts = detectResourceConflicts(tasks);
      const capacityConflicts = detectCapacityConflicts(tasks);
      const dependencyConflicts = await detectDependencyConflicts(projectId, tasks);
      const calendarConflicts = detectCalendarConflicts(tasks);

      const allConflicts = [
        ...resourceConflicts,
        ...capacityConflicts,
        ...dependencyConflicts,
        ...calendarConflicts,
      ];

      // Clear old conflicts
      await supabase
        .from("task_conflicts")
        .delete()
        .eq("project_id", projectId);

      // Insert new conflicts
      if (allConflicts.length > 0) {
        const { error } = await supabase
          .from("task_conflicts")
          .insert(allConflicts);

        if (error) throw error;
      }

      return allConflicts;
    },
    onSuccess: (conflicts, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ["task-conflicts", projectId] });
      toast.success(`Análise concluída: ${conflicts.length} conflitos detectados`);
    },
    onError: (error) => {
      toast.error("Erro ao analisar conflitos: " + error.message);
    },
  });
};

export const useResolveConflict = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      conflictId, 
      action 
    }: { 
      conflictId: string; 
      action: string;
    }) => {
      const { data, error } = await supabase
        .from("task_conflicts")
        .update({
          status: "resolved",
          resolved_at: new Date().toISOString(),
          resolution_action: action,
        })
        .eq("id", conflictId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["task-conflicts", data.project_id] });
      toast.success("Conflito resolvido!");
    },
    onError: (error) => {
      toast.error("Erro ao resolver conflito: " + error.message);
    },
  });
};
