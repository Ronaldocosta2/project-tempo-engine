import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Stakeholder {
  id: string;
  project_id: string;
  name: string;
  role: string;
  email?: string;
  phone?: string;
  power_level: number;
  interest_level: number;
  influence: "baixa" | "media" | "alta";
  expectation?: string;
  communication_preference?: string;
  last_contact_date?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export const useStakeholders = (projectId: string) => {
  return useQuery({
    queryKey: ["stakeholders", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("stakeholders")
        .select("*")
        .eq("project_id", projectId)
        .order("name", { ascending: true });

      if (error) throw error;
      return data as Stakeholder[];
    },
    enabled: !!projectId,
  });
};

export const useCreateStakeholder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (stakeholder: Omit<Stakeholder, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("stakeholders")
        .insert(stakeholder)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["stakeholders", data.project_id] });
      toast.success("Stakeholder adicionado com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao adicionar stakeholder: " + error.message);
    },
  });
};

export const useUpdateStakeholder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Stakeholder> & { id: string }) => {
      const { data, error } = await supabase
        .from("stakeholders")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["stakeholders", data.project_id] });
      toast.success("Stakeholder atualizado com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao atualizar stakeholder: " + error.message);
    },
  });
};

export const useDeleteStakeholder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, projectId }: { id: string; projectId: string }) => {
      const { error } = await supabase.from("stakeholders").delete().eq("id", id);

      if (error) throw error;
      return projectId;
    },
    onSuccess: (projectId) => {
      queryClient.invalidateQueries({ queryKey: ["stakeholders", projectId] });
      toast.success("Stakeholder removido com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao remover stakeholder: " + error.message);
    },
  });
};
