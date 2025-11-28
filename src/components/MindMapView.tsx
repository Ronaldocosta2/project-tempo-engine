import { useEffect, useRef } from "react";
import { Task } from "@/hooks/useTasks";

interface MindMapViewProps {
  tasks: Task[];
}

interface TreeNode {
  task: Task;
  children: TreeNode[];
  x: number;
  y: number;
}

export const MindMapView = ({ tasks }: MindMapViewProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || tasks.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Build tree structure
    const tree = buildTree(tasks);

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Calculate positions
    calculatePositions(tree, canvas.width / 2, 50, canvas.width / 4);

    // Draw tree
    drawTree(ctx, tree);
  }, [tasks]);

  const buildTree = (tasks: Task[]): TreeNode[] => {
    const taskMap = new Map<string, TreeNode>();
    const roots: TreeNode[] = [];

    // Create nodes
    tasks.forEach((task) => {
      taskMap.set(task.id, { task, children: [], x: 0, y: 0 });
    });

    // Build hierarchy
    tasks.forEach((task) => {
      const node = taskMap.get(task.id)!;
      if (task.parent_id && taskMap.has(task.parent_id)) {
        const parent = taskMap.get(task.parent_id)!;
        parent.children.push(node);
      } else {
        roots.push(node);
      }
    });

    return roots;
  };

  const calculatePositions = (
    nodes: TreeNode[],
    x: number,
    y: number,
    spacing: number
  ) => {
    const totalWidth = nodes.length * spacing;
    let currentX = x - totalWidth / 2;

    nodes.forEach((node) => {
      node.x = currentX + spacing / 2;
      node.y = y;
      currentX += spacing;

      if (node.children.length > 0) {
        calculatePositions(node.children, node.x, y + 120, spacing / node.children.length);
      }
    });
  };

  const drawTree = (ctx: CanvasRenderingContext2D, nodes: TreeNode[]) => {
    nodes.forEach((node) => {
      // Draw connections to children
      node.children.forEach((child) => {
        ctx.beginPath();
        ctx.moveTo(node.x, node.y + 30);
        ctx.lineTo(child.x, child.y - 10);
        ctx.strokeStyle = node.task.is_critical ? "#ef4444" : "#94a3b8";
        ctx.lineWidth = node.task.is_critical ? 3 : 2;
        ctx.stroke();
      });

      // Draw node
      const boxWidth = 180;
      const boxHeight = 60;
      const x = node.x - boxWidth / 2;
      const y = node.y - boxHeight / 2;

      // Background
      ctx.fillStyle = node.task.is_critical ? "#fef2f2" : "#f8fafc";
      ctx.strokeStyle = node.task.is_critical ? "#ef4444" : "#3b82f6";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(x, y, boxWidth, boxHeight, 8);
      ctx.fill();
      ctx.stroke();

      // WBS
      ctx.fillStyle = node.task.is_critical ? "#dc2626" : "#2563eb";
      ctx.font = "bold 12px sans-serif";
      ctx.fillText(node.task.wbs, x + 10, y + 20);

      // Task name
      ctx.fillStyle = "#0f172a";
      ctx.font = "14px sans-serif";
      const taskName =
        node.task.name.length > 20
          ? node.task.name.substring(0, 20) + "..."
          : node.task.name;
      ctx.fillText(taskName, x + 10, y + 38);

      // Progress
      ctx.fillStyle = "#64748b";
      ctx.font = "11px sans-serif";
      ctx.fillText(`${node.task.progress}%`, x + 10, y + 52);

      // Status indicator
      const statusColors = {
        "not-started": "#94a3b8",
        "in-progress": "#f59e0b",
        completed: "#10b981",
      };
      ctx.fillStyle = statusColors[node.task.status];
      ctx.beginPath();
      ctx.arc(x + boxWidth - 15, y + boxHeight - 15, 6, 0, Math.PI * 2);
      ctx.fill();

      // Draw children
      drawTree(ctx, node.children);
    });
  };

  return (
    <div className="w-full h-[600px] bg-background border rounded-lg overflow-auto">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
};
