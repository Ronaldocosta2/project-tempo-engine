import { useMemo } from "react";
import { Task } from "./useTasks";

export interface TaskPriority {
  taskId: string;
  score: number;
  reasons: {
    business: number;
    sla: number;
    milestone: number;
    deadline: number;
    client: number;
  };
}

const normalize = (value: number, min: number, max: number): number => {
  return (value - min) / (max - min);
};

const calculateProximityScore = (endDate: string): number => {
  const now = new Date();
  const end = new Date(endDate);
  const daysToDeadline = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysToDeadline < 0) return 1; // Overdue = max urgency
  if (daysToDeadline > 7) return 0; // More than a week = no urgency
  
  return Math.max(0, Math.min(1, (7 - daysToDeadline) / 7));
};

export const calculateTaskPriority = (task: Task): TaskPriority => {
  // Weights for each factor
  const WEIGHT_BUSINESS = 30;
  const WEIGHT_SLA = 25;
  const WEIGHT_MILESTONE = 20;
  const WEIGHT_DEADLINE = 15;
  const WEIGHT_CLIENT = 10;

  // Normalize and calculate each component
  const businessScore = normalize(task.priority_business || 3, 1, 5) * WEIGHT_BUSINESS;
  const slaScore = (task.sla_critical ? 1 : 0) * WEIGHT_SLA;
  const milestoneScore = (task.is_milestone ? 1 : 0) * WEIGHT_MILESTONE;
  const deadlineScore = calculateProximityScore(task.end_date) * WEIGHT_DEADLINE;
  const clientScore = normalize(task.client_importance || 3, 1, 5) * WEIGHT_CLIENT;

  const totalScore = businessScore + slaScore + milestoneScore + deadlineScore + clientScore;

  return {
    taskId: task.id,
    score: Math.round(totalScore),
    reasons: {
      business: Math.round(businessScore),
      sla: Math.round(slaScore),
      milestone: Math.round(milestoneScore),
      deadline: Math.round(deadlineScore),
      client: Math.round(clientScore),
    },
  };
};

export const useTaskPriorities = (tasks: Task[]) => {
  return useMemo(() => {
    const priorities = tasks.map(calculateTaskPriority);
    
    // Sort by score descending
    return priorities.sort((a, b) => b.score - a.score);
  }, [tasks]);
};
