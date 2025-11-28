import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { TablesInsert } from "@/integrations/supabase/types";

export interface ProjectDocument {
  id: string;
  project_id: string;
  document_type: string;
  title: string;
  content: any;
  version: number;
  created_at: string;
  updated_at: string;
  created_by?: string;
}

export const useProjectDocuments = (projectId: string) => {
  return useQuery({
    queryKey: ["project-documents", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("project_documents")
        .select("*")
        .eq("project_id", projectId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as ProjectDocument[];
    },
    enabled: !!projectId,
  });
};

export const useCreateDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (doc: TablesInsert<"project_documents">) => {
      const { data, error } = await supabase
        .from("project_documents")
        .insert([doc])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["project-documents", variables.project_id] });
      toast.success("Documento criado com sucesso!");
    },
    onError: (error: any) => {
      toast.error("Erro ao criar documento: " + error.message);
    },
  });
};

export const useUpdateDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<ProjectDocument> & { id: string }) => {
      const { data, error } = await supabase
        .from("project_documents")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["project-documents", data.project_id] });
      toast.success("Documento atualizado!");
    },
    onError: (error: any) => {
      toast.error("Erro ao atualizar: " + error.message);
    },
  });
};

export const useDeleteDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, projectId }: { id: string; projectId: string }) => {
      const { error } = await supabase
        .from("project_documents")
        .delete()
        .eq("id", id);

      if (error) throw error;
      return { projectId };
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["project-documents", result.projectId] });
      toast.success("Documento excluído!");
    },
    onError: (error: any) => {
      toast.error("Erro ao excluir: " + error.message);
    },
  });
};
