import { Task } from "@/hooks/useTasks";

export interface ImportError {
  line: number;
  code: string;
  message: string;
  severity: "error" | "warning";
}

export interface ImportResult {
  tasks: Partial<Task>[];
  errors: ImportError[];
  warnings: ImportError[];
  total: number;
  success: number;
  failed: number;
}

export interface ImportOptions {
  useBusinessDays: boolean;
  projectId: string;
}

// Mapeamento de colunas com sinônimos
const COLUMN_MAPPINGS: Record<string, string[]> = {
  wbs: ["wbs", "id_wbs", "id"],
  name: ["nome", "tarefa", "name", "summary", "task"],
  start_date: ["inicio", "start", "data_inicio", "start_date", "data inicio"],
  end_date: ["fim", "end", "data_fim", "end_date", "data fim"],
  duration: ["duracao", "duration", "dias", "duração"],
  progress: ["progresso", "%", "percent", "percent_complete", "percent complete"],
  status: ["status", "state", "estado"],
  parent_wbs: ["pai", "wbs_pai", "parent_wbs", "parent", "wbs pai"],
  critical: ["critica", "critical", "crítica"],
};

// Mapeamento de status
const STATUS_MAP: Record<string, Task["status"]> = {
  "não iniciado": "not-started",
  "nao iniciado": "not-started",
  "not started": "not-started",
  "ni": "not-started",
  "em andamento": "in-progress",
  "em progresso": "in-progress",
  "in progress": "in-progress",
  "ea": "in-progress",
  "concluído": "completed",
  "concluido": "completed",
  "completed": "completed",
  "c": "completed",
  "bloqueado": "in-progress",
  "blocked": "in-progress",
  "b": "in-progress",
};

function normalizeHeader(header: string): string {
  return header.toLowerCase().trim().replace(/[_\s]+/g, " ");
}

function detectColumn(header: string): string | null {
  const normalized = normalizeHeader(header);
  for (const [key, synonyms] of Object.entries(COLUMN_MAPPINGS)) {
    if (synonyms.some(s => normalized === normalizeHeader(s))) {
      return key;
    }
  }
  return null;
}

function parseDate(value: string): string | null {
  if (!value) return null;
  
  // Aceita dd/mm/aaaa
  const ddmmyyyyMatch = value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (ddmmyyyyMatch) {
    const [, day, month, year] = ddmmyyyyMatch;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }
  
  // Aceita yyyy-mm-dd (ISO)
  const isoMatch = value.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (isoMatch) {
    const [, year, month, day] = isoMatch;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }
  
  return null;
}

function parseDuration(value: string | number): number | null {
  if (typeof value === 'number') return value;
  if (!value) return null;
  
  const str = String(value).trim();
  
  // Aceita "5", "5d", "40h"
  const match = str.match(/^(\d+)(d|h)?$/i);
  if (match) {
    const num = parseInt(match[1]);
    const unit = match[2]?.toLowerCase();
    
    if (unit === 'h') {
      return Math.ceil(num / 8); // 8h por dia
    }
    return num;
  }
  
  return null;
}

function parsePercent(value: string | number): number {
  if (typeof value === 'number') {
    return Math.max(0, Math.min(100, value));
  }
  if (!value) return 0;
  
  const num = parseFloat(String(value).replace('%', '').trim());
  return isNaN(num) ? 0 : Math.max(0, Math.min(100, num));
}

function parseStatus(value: string, progress: number): Task["status"] {
  if (!value) {
    // Auto-detect baseado no progresso
    if (progress === 100) return "completed";
    if (progress > 0) return "in-progress";
    return "not-started";
  }
  
  const normalized = normalizeHeader(value);
  return STATUS_MAP[normalized] || "not-started";
}

function parseBool(value: string | boolean): boolean {
  if (typeof value === 'boolean') return value;
  if (!value) return false;
  
  const str = String(value).toLowerCase().trim();
  return ['true', '1', 'sim', 'yes', 's', 'y'].includes(str);
}

function validateWBS(wbs: string): boolean {
  return /^\d+(\.\d+)*$/.test(wbs);
}

function calculateBusinessDays(startDate: Date, days: number): Date {
  let current = new Date(startDate);
  let remaining = days;
  
  while (remaining > 0) {
    current.setDate(current.getDate() + 1);
    const dayOfWeek = current.getDay();
    // Pula fins de semana (0 = domingo, 6 = sábado)
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      remaining--;
    }
  }
  
  return current;
}

function addDays(date: Date, days: number, useBusinessDays: boolean): Date {
  if (useBusinessDays) {
    return calculateBusinessDays(date, days);
  }
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function daysBetween(start: Date, end: Date, useBusinessDays: boolean): number {
  if (!useBusinessDays) {
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  }
  
  let count = 0;
  const current = new Date(start);
  
  while (current < end) {
    current.setDate(current.getDate() + 1);
    const dayOfWeek = current.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      count++;
    }
  }
  
  return count;
}

function computeDatesWithTwoOfThree(
  task: Partial<Task>,
  useBusinessDays: boolean
): { start_date?: string; end_date?: string; duration?: number } {
  const hasStart = !!task.start_date;
  const hasEnd = !!task.end_date;
  const hasDuration = task.duration !== undefined && task.duration !== null;
  
  const count = [hasStart, hasEnd, hasDuration].filter(Boolean).length;
  
  if (count < 2) {
    throw new Error("É necessário fornecer pelo menos 2 de 3 valores: Data de Início, Data de Término, Duração");
  }
  
  if (hasStart && hasEnd) {
    const start = new Date(task.start_date!);
    const end = new Date(task.end_date!);
    const duration = daysBetween(start, end, useBusinessDays);
    return { start_date: task.start_date, end_date: task.end_date, duration };
  }
  
  if (hasStart && hasDuration) {
    const start = new Date(task.start_date!);
    const end = addDays(start, task.duration!, useBusinessDays);
    const endStr = end.toISOString().split('T')[0];
    return { start_date: task.start_date, end_date: endStr, duration: task.duration };
  }
  
  if (hasEnd && hasDuration) {
    const end = new Date(task.end_date!);
    const start = new Date(end);
    start.setDate(start.getDate() - task.duration!);
    const startStr = start.toISOString().split('T')[0];
    return { start_date: startStr, end_date: task.end_date, duration: task.duration };
  }
  
  return {};
}

export function parseCSV(csvText: string, options: ImportOptions): ImportResult {
  const lines = csvText.split(/\r?\n/).filter(line => line.trim());
  const errors: ImportError[] = [];
  const warnings: ImportError[] = [];
  const tasks: Partial<Task>[] = [];
  
  if (lines.length < 2) {
    errors.push({
      line: 0,
      code: "E000",
      message: "Arquivo vazio ou sem dados",
      severity: "error",
    });
    return { tasks, errors, warnings, total: 0, success: 0, failed: 0 };
  }
  
  // Parse header
  const headerLine = lines[0];
  const headers = headerLine.split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  
  // Detectar colunas
  const columnMap: Record<string, number> = {};
  headers.forEach((header, index) => {
    const detected = detectColumn(header);
    if (detected) {
      columnMap[detected] = index;
    }
  });
  
  // Validar colunas obrigatórias
  if (!columnMap.wbs || !columnMap.name) {
    errors.push({
      line: 0,
      code: "E000",
      message: "Colunas obrigatórias faltando: WBS e Nome",
      severity: "error",
    });
    return { tasks, errors, warnings, total: 0, success: 0, failed: 0 };
  }
  
  // Parse data lines
  for (let i = 1; i < lines.length; i++) {
    const lineNumber = i + 1;
    const line = lines[i];
    const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
    
    try {
      const rawTask: any = {};
      Object.entries(columnMap).forEach(([key, index]) => {
        rawTask[key] = values[index];
      });
      
      // Parse WBS
      const wbs = rawTask.wbs?.trim();
      if (!wbs) {
        errors.push({
          line: lineNumber,
          code: "E001",
          message: "WBS é obrigatório",
          severity: "error",
        });
        continue;
      }
      
      if (!validateWBS(wbs)) {
        errors.push({
          line: lineNumber,
          code: "E003",
          message: `WBS inválido: ${wbs}. Use formato: 1.0 ou 1.1.2`,
          severity: "error",
        });
        continue;
      }
      
      // Parse Name
      const name = rawTask.name?.trim();
      if (!name || name.length < 3 || name.length > 120) {
        errors.push({
          line: lineNumber,
          code: "E001",
          message: "Nome é obrigatório e deve ter entre 3 e 120 caracteres",
          severity: "error",
        });
        continue;
      }
      
      // Parse dates and duration
      const start_date = parseDate(rawTask.start_date);
      const end_date = parseDate(rawTask.end_date);
      const duration = parseDuration(rawTask.duration);
      
      const task: Partial<Task> = {
        project_id: options.projectId,
        wbs,
        name,
        start_date: start_date || undefined,
        end_date: end_date || undefined,
        duration: duration || undefined,
      };
      
      // Apply 2-of-3 rule
      try {
        const computed = computeDatesWithTwoOfThree(task, options.useBusinessDays);
        task.start_date = computed.start_date;
        task.end_date = computed.end_date;
        task.duration = computed.duration;
      } catch (error) {
        errors.push({
          line: lineNumber,
          code: "E001",
          message: (error as Error).message,
          severity: "error",
        });
        continue;
      }
      
      // Validar datas
      if (task.start_date && task.end_date) {
        const start = new Date(task.start_date);
        const end = new Date(task.end_date);
        if (end < start) {
          errors.push({
            line: lineNumber,
            code: "E002",
            message: "Data de término deve ser posterior à data de início",
            severity: "error",
          });
          continue;
        }
      }
      
      // Parse progress
      task.progress = parsePercent(rawTask.progress);
      
      // Parse status
      task.status = parseStatus(rawTask.status, task.progress);
      
      // Ajustar data de término se concluído
      if (task.status === "completed" && task.progress === 100) {
        const today = new Date().toISOString().split('T')[0];
        if (task.end_date && task.end_date < today) {
          // OK, mantém a data original
        } else {
          task.end_date = today;
        }
      }
      
      // Parse critical
      task.is_critical = parseBool(rawTask.critical);
      
      // Parse parent WBS
      if (rawTask.parent_wbs) {
        const parentWbs = rawTask.parent_wbs.trim();
        if (parentWbs && validateWBS(parentWbs)) {
          // Será resolvido depois para parent_id
          (task as any)._parent_wbs = parentWbs;
        } else if (parentWbs) {
          warnings.push({
            line: lineNumber,
            code: "W001",
            message: `WBS pai inválido: ${parentWbs}. Tarefa será criada na raiz.`,
            severity: "warning",
          });
        }
      }
      
      task.parent_id = null;
      
      tasks.push(task);
    } catch (error) {
      errors.push({
        line: lineNumber,
        code: "E999",
        message: `Erro ao processar linha: ${(error as Error).message}`,
        severity: "error",
      });
    }
  }
  
  return {
    tasks,
    errors,
    warnings,
    total: lines.length - 1,
    success: tasks.length,
    failed: errors.filter(e => e.severity === "error").length,
  };
}
