export interface GanttTask {
  id: string;
  wbs: string;
  name: string;
  startDate: string;
  endDate: string;
  duration: number;
  progress: number;
  isCritical: boolean;
  status: "not-started" | "in-progress" | "completed";
  dependencies?: string[];
  resources?: string;
  color?: string;
  children?: GanttTask[];
}

interface GanttJsonTask {
  TaskID: number;
  TaskName: string;
  StartDate: string;
  EndDate: string;
  Duration: number;
  Predecessor: string | null;
  resources: Array<{ resourceName: string }>;
  Progress: number;
  color: string;
  subtasks?: GanttJsonTask[];
}

interface GanttJsonFile {
  data: GanttJsonTask[];
  resources?: Array<{ resourceName: string }>;
}

export const parseGanttFile = (content: string): GanttTask[] => {
  try {
    // Try to parse as JSON first
    const jsonData: GanttJsonFile = JSON.parse(content);
    if (jsonData.data && Array.isArray(jsonData.data)) {
      return parseJsonFormat(jsonData.data);
    }
  } catch (e) {
    // If JSON parsing fails, try CSV/TSV format
    return parseCsvFormat(content);
  }
  
  return [];
};

const parseJsonFormat = (data: GanttJsonTask[], parentWbs: string = ""): GanttTask[] => {
  const tasks: GanttTask[] = [];
  
  data.forEach((item, index) => {
    const wbs = parentWbs ? `${parentWbs}.${index + 1}` : `${index + 1}`;
    const dependencies = parsePredecessor(item.Predecessor);
    const resourcesStr = item.resources?.map(r => r.resourceName).join(", ") || "";
    
    const task: GanttTask = {
      id: item.TaskID.toString(),
      wbs,
      name: item.TaskName,
      startDate: new Date(item.StartDate).toISOString().split('T')[0],
      endDate: new Date(item.EndDate).toISOString().split('T')[0],
      duration: item.Duration,
      progress: item.Progress,
      isCritical: false,
      status: determineStatus(item.Progress),
      dependencies,
      resources: resourcesStr,
      color: item.color || undefined,
      children: item.subtasks ? parseJsonFormat(item.subtasks, wbs) : undefined,
    };
    
    tasks.push(task);
  });
  
  return tasks;
};

const parsePredecessor = (predecessor: string | null): string[] | undefined => {
  if (!predecessor) return undefined;
  
  // Parse format like "2FS", "3SS", "4,5FS"
  const matches = predecessor.match(/\d+/g);
  return matches || undefined;
};

const parseCsvFormat = (content: string): GanttTask[] => {
  const lines = content.split('\n').filter(line => line.trim());
  const tasks: GanttTask[] = [];
  
  // Skip header line if exists
  const startIndex = lines[0].toLowerCase().includes('id') || lines[0].toLowerCase().includes('task') ? 1 : 0;
  
  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // Parse tab or comma separated values
    const parts = line.includes('\t') ? line.split('\t') : line.split(',').map(p => p.trim());
    
    if (parts.length < 5) continue;
    
    const [id, name, start, end, durationStr, progressStr, dependenciesStr, resourcesStr, colorStr, criticalStr] = parts;
    
    const task: GanttTask = {
      id: id || `task-${Date.now()}-${i}`,
      wbs: id || `${i}`,
      name: name || 'Unnamed Task',
      startDate: parseDate(start),
      endDate: parseDate(end),
      duration: parseInt(durationStr) || 0,
      progress: parseInt(progressStr) || 0,
      isCritical: criticalStr?.toLowerCase() === 'true' || criticalStr === '1',
      status: determineStatus(parseInt(progressStr) || 0),
      dependencies: dependenciesStr ? dependenciesStr.split(';').filter(d => d.trim()) : undefined,
      resources: resourcesStr || undefined,
      color: colorStr || undefined,
    };
    
    tasks.push(task);
  }
  
  return tasks;
}

const parseDate = (dateStr: string): string => {
  if (!dateStr) return new Date().toISOString().split('T')[0];
  
  // Try different date formats
  const formats = [
    /^\d{4}-\d{2}-\d{2}$/, // YYYY-MM-DD
    /^\d{2}\/\d{2}\/\d{4}$/, // DD/MM/YYYY
    /^\d{2}-\d{2}-\d{4}$/, // DD-MM-YYYY
  ];
  
  if (formats[0].test(dateStr)) {
    return dateStr;
  }
  
  if (formats[1].test(dateStr) || formats[2].test(dateStr)) {
    const separator = dateStr.includes('/') ? '/' : '-';
    const [day, month, year] = dateStr.split(separator);
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }
  
  // Try to parse as Date
  const date = new Date(dateStr);
  if (!isNaN(date.getTime())) {
    return date.toISOString().split('T')[0];
  }
  
  return new Date().toISOString().split('T')[0];
};

const determineStatus = (progress: number): "not-started" | "in-progress" | "completed" => {
  if (progress === 0) return "not-started";
  if (progress === 100) return "completed";
  return "in-progress";
};

export const calculateTaskProgress = (task: GanttTask, allTasks: GanttTask[]): number => {
  // Se a tarefa não tem dependências, retorna o progresso dela mesma
  if (!task.dependencies || task.dependencies.length === 0) {
    return task.progress;
  }
  
  // Se tem dependências, calcula baseado nas dependências
  const dependentTasks = allTasks.filter(t => task.dependencies?.includes(t.id));
  
  if (dependentTasks.length === 0) {
    return task.progress;
  }
  
  // Calcula a média do progresso das tarefas dependentes
  const totalProgress = dependentTasks.reduce((sum, t) => sum + t.progress, 0);
  return Math.round(totalProgress / dependentTasks.length);
};

export const calculateAllTasksProgress = (tasks: GanttTask[]): GanttTask[] => {
  return tasks.map(task => ({
    ...task,
    progress: calculateTaskProgress(task, tasks),
  }));
};
