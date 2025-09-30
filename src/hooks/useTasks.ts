import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Task {
  id: string;
  project_id: string;
  wbs: string;
  name: string;
  start_date: string;
  end_date: string;
  duration: number;
  progress: number;
  is_critical: boolean;
  status: "not-started" | "in-progress" | "completed";
  parent_id: string | null;
  created_at?: string;
  updated_at?: string;
  optimistic_duration?: number;
  most_likely_duration?: number;
  pessimistic_duration?: number;
  use_pert?: boolean;
  early_start?: string;
  early_finish?: string;
  late_start?: string;
  late_finish?: string;
  slack?: number;
  constraint_type?: string;
  constraint_date?: string;
  resource_id?: string;
  buffer_id?: string;
  baseline_duration?: number;
  baseline_start_date?: string;
  baseline_end_date?: string;
  priority_business?: number;
  sla_critical?: boolean;
  is_milestone?: boolean;
  client_importance?: number;
  capacity_percent?: number;
  effort_hours?: number;
}

export const useTasks = (projectId: string) => {
  return useQuery({
    queryKey: ["tasks", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("project_id", projectId)
        .order("wbs", { ascending: true });

      if (error) throw error;
      return data as Task[];
    },
    enabled: !!projectId,
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (task: Omit<Task, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("tasks")
        .insert(task)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["tasks", data.project_id] });
      toast.success("Tarefa criada com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao criar tarefa: " + error.message);
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Task> & { id: string }) => {
      const { data, error } = await supabase
        .from("tasks")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["tasks", data.project_id] });
      toast.success("Tarefa atualizada com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao atualizar tarefa: " + error.message);
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, projectId }: { id: string; projectId: string }) => {
      const { error } = await supabase.from("tasks").delete().eq("id", id);

      if (error) throw error;
      return projectId;
    },
    onSuccess: (projectId) => {
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
      toast.success("Tarefa deletada com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao deletar tarefa: " + error.message);
    },
  });
};
