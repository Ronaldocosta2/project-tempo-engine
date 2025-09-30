import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface ProjectRisk {
  id: string;
  project_id: string;
  title: string;
  description: string | null;
  probability: number;
  impact: number;
  status: "active" | "mitigated" | "occurred" | "closed";
  mitigation_plan: string | null;
  owner_id: string | null;
  created_at?: string;
  updated_at?: string;
}

export const useProjectRisks = (projectId: string) => {
  return useQuery({
    queryKey: ["project-risks", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("project_risks")
        .select("*")
        .eq("project_id", projectId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as ProjectRisk[];
    },
    enabled: !!projectId,
  });
};

export const useCreateRisk = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (risk: Omit<ProjectRisk, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("project_risks")
        .insert(risk)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["project-risks", variables.project_id] });
      toast.success("Risco criado com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao criar risco: " + error.message);
    },
  });
};
