import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Meeting {
  id: string;
  project_id: string;
  title: string;
  description?: string;
  meeting_date: string;
  duration_minutes: number;
  location?: string;
  meeting_type: "planejamento" | "status" | "decisao" | "retrospectiva" | "outro";
  status: "agendada" | "realizada" | "cancelada";
  summary?: string;
  created_at?: string;
  updated_at?: string;
}

export const useMeetings = (projectId: string) => {
  return useQuery({
    queryKey: ["meetings", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("meetings")
        .select("*")
        .eq("project_id", projectId)
        .order("meeting_date", { ascending: false });

      if (error) throw error;
      return data as Meeting[];
    },
    enabled: !!projectId,
  });
};

export const useCreateMeeting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (meeting: Omit<Meeting, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("meetings")
        .insert(meeting)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["meetings", data.project_id] });
      toast.success("Reunião criada com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao criar reunião: " + error.message);
    },
  });
};

export const useUpdateMeeting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Meeting> & { id: string }) => {
      const { data, error } = await supabase
        .from("meetings")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["meetings", data.project_id] });
      toast.success("Reunião atualizada com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao atualizar reunião: " + error.message);
    },
  });
};

export const useDeleteMeeting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, projectId }: { id: string; projectId: string }) => {
      const { error } = await supabase.from("meetings").delete().eq("id", id);

      if (error) throw error;
      return projectId;
    },
    onSuccess: (projectId) => {
      queryClient.invalidateQueries({ queryKey: ["meetings", projectId] });
      toast.success("Reunião removida com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao remover reunião: " + error.message);
    },
  });
};
