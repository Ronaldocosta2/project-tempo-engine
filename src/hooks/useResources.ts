import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Resource {
  id: string;
  project_id: string;
  name: string;
  daily_capacity: number;
  calendar_id?: string;
  skills?: string[];
  created_at?: string;
  updated_at?: string;
}

export const useResources = (projectId: string) => {
  return useQuery({
    queryKey: ["resources", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("resources")
        .select("*")
        .eq("project_id", projectId);

      if (error) throw error;
      return data as Resource[];
    },
    enabled: !!projectId,
  });
};

export const useCreateResource = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (resource: Omit<Resource, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("resources")
        .insert(resource)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["resources", data.project_id] });
      toast.success("Recurso criado com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao criar recurso: " + error.message);
    },
  });
};

export const useUpdateResource = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Resource> & { id: string }) => {
      const { data, error } = await supabase
        .from("resources")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["resources", data.project_id] });
      toast.success("Recurso atualizado com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao atualizar recurso: " + error.message);
    },
  });
};

export const useDeleteResource = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, projectId }: { id: string; projectId: string }) => {
      const { error } = await supabase.from("resources").delete().eq("id", id);

      if (error) throw error;
      return projectId;
    },
    onSuccess: (projectId) => {
      queryClient.invalidateQueries({ queryKey: ["resources", projectId] });
      toast.success("Recurso deletado com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao deletar recurso: " + error.message);
    },
  });
};
