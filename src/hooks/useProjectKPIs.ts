import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ProjectKPI {
  id: string;
  project_id: string;
  name: string;
  description: string | null;
  target_value: number | null;
  current_value: number | null;
  unit: string | null;
  category: "schedule" | "cost" | "quality" | "satisfaction" | "custom";
  created_at?: string;
  updated_at?: string;
}

export const useProjectKPIs = (projectId: string) => {
  return useQuery({
    queryKey: ["project-kpis", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("project_kpis")
        .select("*")
        .eq("project_id", projectId)
        .order("category");

      if (error) throw error;
      return data as ProjectKPI[];
    },
    enabled: !!projectId,
  });
};
