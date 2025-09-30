-- Add actual_end_date to track when tasks were really completed
ALTER TABLE public.tasks
ADD COLUMN actual_end_date date;

-- Add comment for documentation
COMMENT ON COLUMN public.tasks.actual_end_date IS 'Data real de conclusão da tarefa para comparação com end_date planejado';