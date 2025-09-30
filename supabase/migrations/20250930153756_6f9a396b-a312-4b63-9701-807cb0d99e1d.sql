-- Add priority and business fields to tasks table
ALTER TABLE public.tasks
ADD COLUMN IF NOT EXISTS priority_business integer DEFAULT 3 CHECK (priority_business >= 1 AND priority_business <= 5),
ADD COLUMN IF NOT EXISTS sla_critical boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS is_milestone boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS client_importance integer DEFAULT 3 CHECK (client_importance >= 1 AND client_importance <= 5),
ADD COLUMN IF NOT EXISTS capacity_percent integer DEFAULT 100 CHECK (capacity_percent > 0 AND capacity_percent <= 200),
ADD COLUMN IF NOT EXISTS effort_hours numeric DEFAULT 0;

-- Add comments for documentation
COMMENT ON COLUMN public.tasks.priority_business IS 'Business priority from 1 (lowest) to 5 (highest)';
COMMENT ON COLUMN public.tasks.sla_critical IS 'Whether this task has critical SLA requirements';
COMMENT ON COLUMN public.tasks.is_milestone IS 'Whether this task is a milestone';
COMMENT ON COLUMN public.tasks.client_importance IS 'Client importance rating from 1 (lowest) to 5 (highest)';
COMMENT ON COLUMN public.tasks.capacity_percent IS 'Percentage of resource capacity allocated (e.g., 50% = part-time)';
COMMENT ON COLUMN public.tasks.effort_hours IS 'Total effort in hours for this task';

-- Create conflicts table to track detected conflicts
CREATE TABLE IF NOT EXISTS public.task_conflicts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  task_a_id uuid REFERENCES public.tasks(id) ON DELETE CASCADE NOT NULL,
  task_b_id uuid REFERENCES public.tasks(id) ON DELETE CASCADE,
  conflict_type text NOT NULL CHECK (conflict_type IN ('resource', 'capacity', 'dependency', 'calendar')),
  severity text DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high')),
  details jsonb DEFAULT '{}'::jsonb,
  status text DEFAULT 'open' CHECK (status IN ('open', 'resolved', 'ignored')),
  detected_at timestamp with time zone DEFAULT now(),
  resolved_at timestamp with time zone,
  resolution_action text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.task_conflicts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Allow public access to task_conflicts"
ON public.task_conflicts
FOR ALL
USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_task_conflicts_project ON public.task_conflicts(project_id);
CREATE INDEX IF NOT EXISTS idx_task_conflicts_status ON public.task_conflicts(status);
CREATE INDEX IF NOT EXISTS idx_task_conflicts_type ON public.task_conflicts(conflict_type);
CREATE INDEX IF NOT EXISTS idx_tasks_resource_dates ON public.tasks(resource_id, start_date, end_date) WHERE status NOT IN ('completed');

-- Create trigger for updated_at
CREATE TRIGGER update_task_conflicts_updated_at
  BEFORE UPDATE ON public.task_conflicts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();