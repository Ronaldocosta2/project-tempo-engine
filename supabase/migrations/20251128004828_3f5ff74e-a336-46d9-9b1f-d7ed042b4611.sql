-- Criar tabela para armazenar documentações de projeto
CREATE TABLE public.project_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL, -- 'tap', 'plano', 'relatorio', 'ata'
  title TEXT NOT NULL,
  content JSONB NOT NULL, -- Campos específicos de cada tipo de documento
  version INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Índices para performance
CREATE INDEX idx_project_documents_project_id ON public.project_documents(project_id);
CREATE INDEX idx_project_documents_type ON public.project_documents(document_type);

-- RLS policies
ALTER TABLE public.project_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view documents of their projects"
  ON public.project_documents FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.projects 
      WHERE projects.id = project_documents.project_id 
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create documents for their projects"
  ON public.project_documents FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.projects 
      WHERE projects.id = project_documents.project_id 
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update documents of their projects"
  ON public.project_documents FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.projects 
      WHERE projects.id = project_documents.project_id 
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete documents of their projects"
  ON public.project_documents FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.projects 
      WHERE projects.id = project_documents.project_id 
      AND projects.user_id = auth.uid()
    )
  );

-- Trigger para atualizar updated_at
CREATE TRIGGER update_project_documents_updated_at
  BEFORE UPDATE ON public.project_documents
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();