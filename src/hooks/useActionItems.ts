import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface ActionItem {
  id: string;
  meeting_id?: string;
  project_id: string;
  task_id?: string;
  title: string;
  description?: string;
  responsible_id?: string;
  due_date?: string;
  priority: "baixa" | "media" | "alta" | "urgente";
  status: "pendente" | "em-andamento" | "concluida" | "cancelada";
  created_at?: string;
  updated_at?: string;
}

export const useActionItems = (projectId: string) => {
  return useQuery({
    queryKey: ["action_items", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("action_items")
        .select(`
          *,
          responsible:stakeholders(name),
          meeting:meetings(title)
        `)
        .eq("project_id", projectId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!projectId,
  });
};

export const useCreateActionItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (actionItem: Omit<ActionItem, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("action_items")
        .insert(actionItem)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["action_items", data.project_id] });
      toast.success("Combinado criado com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao criar combinado: " + error.message);
    },
  });
};

export const useUpdateActionItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<ActionItem> & { id: string }) => {
      const { data, error } = await supabase
        .from("action_items")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["action_items", data.project_id] });
      toast.success("Combinado atualizado com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao atualizar combinado: " + error.message);
    },
  });
};

export const useDeleteActionItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, projectId }: { id: string; projectId: string }) => {
      const { error } = await supabase.from("action_items").delete().eq("id", id);

      if (error) throw error;
      return projectId;
    },
    onSuccess: (projectId) => {
      queryClient.invalidateQueries({ queryKey: ["action_items", projectId] });
      toast.success("Combinado removido com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao remover combinado: " + error.message);
    },
  });
};
