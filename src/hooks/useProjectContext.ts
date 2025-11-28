import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface ProjectContext {
  id: string;
  project_id: string;
  story: string | null;
  origin: string | null;
  impact: string | null;
  objectives: string | null;
  timeline: any[];
  attachments: any[];
  created_at?: string;
  updated_at?: string;
  updated_by?: string;
}

export const useProjectContext = (projectId: string) => {
  return useQuery({
    queryKey: ["project-context", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("project_context")
        .select("*")
        .eq("project_id", projectId)
        .maybeSingle();

      if (error) throw error;
      return data as ProjectContext | null;
    },
    enabled: !!projectId,
  });
};

export const useUpsertProjectContext = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (context: Partial<ProjectContext> & { project_id: string }) => {
      const { data, error } = await supabase
        .from("project_context")
        .upsert(context, { onConflict: "project_id" })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["project-context", variables.project_id] });
      toast.success("Contexto atualizado com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao atualizar contexto: " + error.message);
    },
  });
};
