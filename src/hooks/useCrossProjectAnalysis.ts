import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Task } from "./useTasks";

export interface CrossProjectTask {
  task: Task;
  project_name: string;
  overlapping_tasks: {
    task: Task;
    project_name: string;
    days_overlap: number;
  }[];
}

export const useCrossProjectAnalysis = () => {
  return useQuery({
    queryKey: ["cross-project-analysis"],
    queryFn: async () => {
      // Get all tasks from all projects
      const { data: tasks, error: tasksError } = await supabase
        .from("tasks")
        .select(`
          *,
          project:projects(name)
        `)
        .neq("status", "completed")
        .order("start_date", { ascending: true });

      if (tasksError) throw tasksError;

      // Build a map of overlapping tasks
      const crossProjectConflicts: CrossProjectTask[] = [];
      const processedPairs = new Set<string>();

      tasks?.forEach((taskA: any) => {
        const overlappingTasks: CrossProjectTask["overlapping_tasks"] = [];

        tasks?.forEach((taskB: any) => {
          if (
            taskA.id !== taskB.id &&
            taskA.project_id !== taskB.project_id &&
            !processedPairs.has(`${taskA.id}-${taskB.id}`) &&
            !processedPairs.has(`${taskB.id}-${taskA.id}`)
          ) {
            const startA = new Date(taskA.start_date);
            const endA = new Date(taskA.end_date);
            const startB = new Date(taskB.start_date);
            const endB = new Date(taskB.end_date);

            // Check if dates overlap
            if (startA < endB && startB < endA) {
              const overlapStart = new Date(Math.max(startA.getTime(), startB.getTime()));
              const overlapEnd = new Date(Math.min(endA.getTime(), endB.getTime()));
              const daysOverlap = Math.ceil((overlapEnd.getTime() - overlapStart.getTime()) / (1000 * 60 * 60 * 24));

              overlappingTasks.push({
                task: taskB,
                project_name: taskB.project.name,
                days_overlap: daysOverlap,
              });

              processedPairs.add(`${taskA.id}-${taskB.id}`);
            }
          }
        });

        if (overlappingTasks.length > 0) {
          crossProjectConflicts.push({
            task: taskA,
            project_name: taskA.project.name,
            overlapping_tasks: overlappingTasks,
          });
        }
      });

      // Sort by critical tasks first, then by number of overlaps
      return crossProjectConflicts.sort((a, b) => {
        if (a.task.is_critical && !b.task.is_critical) return -1;
        if (!a.task.is_critical && b.task.is_critical) return 1;
        return b.overlapping_tasks.length - a.overlapping_tasks.length;
      });
    },
  });
};
