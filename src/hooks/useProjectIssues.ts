import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface ProjectIssue {
  id: string;
  project_id: string;
  title: string;
  description: string | null;
  severity: "low" | "medium" | "high" | "critical";
  status: "open" | "in-progress" | "resolved" | "closed";
  assigned_to: string | null;
  resolution: string | null;
  created_at?: string;
  updated_at?: string;
  resolved_at?: string;
}

export const useProjectIssues = (projectId: string) => {
  return useQuery({
    queryKey: ["project-issues", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("project_issues")
        .select("*")
        .eq("project_id", projectId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as ProjectIssue[];
    },
    enabled: !!projectId,
  });
};
