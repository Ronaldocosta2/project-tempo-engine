-- Criar tabela de stakeholders
CREATE TABLE public.stakeholders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  power_level INTEGER CHECK (power_level >= 1 AND power_level <= 5) DEFAULT 3,
  interest_level INTEGER CHECK (interest_level >= 1 AND interest_level <= 5) DEFAULT 3,
  influence TEXT CHECK (influence IN ('baixa', 'media', 'alta')) DEFAULT 'media',
  expectation TEXT,
  communication_preference TEXT,
  last_contact_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar tabela de reuniões
CREATE TABLE public.meetings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  meeting_date TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  location TEXT,
  meeting_type TEXT CHECK (meeting_type IN ('planejamento', 'status', 'decisao', 'retrospectiva', 'outro')) DEFAULT 'status',
  status TEXT CHECK (status IN ('agendada', 'realizada', 'cancelada')) DEFAULT 'agendada',
  summary TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar tabela de participantes das reuniões
CREATE TABLE public.meeting_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id UUID NOT NULL REFERENCES public.meetings(id) ON DELETE CASCADE,
  stakeholder_id UUID NOT NULL REFERENCES public.stakeholders(id) ON DELETE CASCADE,
  attendance TEXT CHECK (attendance IN ('presente', 'ausente', 'confirmado')) DEFAULT 'confirmado',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(meeting_id, stakeholder_id)
);

-- Criar tabela de combinados/ações
CREATE TABLE public.action_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id UUID REFERENCES public.meetings(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  task_id UUID REFERENCES public.tasks(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  responsible_id UUID REFERENCES public.stakeholders(id) ON DELETE SET NULL,
  due_date DATE,
  priority TEXT CHECK (priority IN ('baixa', 'media', 'alta', 'urgente')) DEFAULT 'media',
  status TEXT CHECK (status IN ('pendente', 'em-andamento', 'concluida', 'cancelada')) DEFAULT 'pendente',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar tabela de relacionamento stakeholder-tarefa
CREATE TABLE public.task_stakeholders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  stakeholder_id UUID NOT NULL REFERENCES public.stakeholders(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('responsavel', 'aprovador', 'informado', 'consultado')) DEFAULT 'informado',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(task_id, stakeholder_id)
);

-- Índices para melhor performance
CREATE INDEX idx_stakeholders_project_id ON public.stakeholders(project_id);
CREATE INDEX idx_meetings_project_id ON public.meetings(project_id);
CREATE INDEX idx_meetings_date ON public.meetings(meeting_date);
CREATE INDEX idx_meeting_participants_meeting_id ON public.meeting_participants(meeting_id);
CREATE INDEX idx_meeting_participants_stakeholder_id ON public.meeting_participants(stakeholder_id);
CREATE INDEX idx_action_items_project_id ON public.action_items(project_id);
CREATE INDEX idx_action_items_meeting_id ON public.action_items(meeting_id);
CREATE INDEX idx_action_items_responsible_id ON public.action_items(responsible_id);
CREATE INDEX idx_task_stakeholders_task_id ON public.task_stakeholders(task_id);
CREATE INDEX idx_task_stakeholders_stakeholder_id ON public.task_stakeholders(stakeholder_id);

-- Habilitar RLS
ALTER TABLE public.stakeholders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meeting_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.action_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_stakeholders ENABLE ROW LEVEL SECURITY;

-- RLS policies (acesso público por enquanto)
CREATE POLICY "Allow public access to stakeholders" ON public.stakeholders FOR ALL USING (true);
CREATE POLICY "Allow public access to meetings" ON public.meetings FOR ALL USING (true);
CREATE POLICY "Allow public access to meeting_participants" ON public.meeting_participants FOR ALL USING (true);
CREATE POLICY "Allow public access to action_items" ON public.action_items FOR ALL USING (true);
CREATE POLICY "Allow public access to task_stakeholders" ON public.task_stakeholders FOR ALL USING (true);

-- Triggers para atualizar updated_at
CREATE TRIGGER update_stakeholders_updated_at
  BEFORE UPDATE ON public.stakeholders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_meetings_updated_at
  BEFORE UPDATE ON public.meetings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_action_items_updated_at
  BEFORE UPDATE ON public.action_items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();