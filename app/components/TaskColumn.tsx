import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TaskItem } from "./TaskItem";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Task, TaskStatus } from "@/lib/types";
import { Plus } from "lucide-react";

interface TaskColumnProps {
  title: string;
  status: TaskStatus;
  tasks: Task[];
  onAddTask: (content: string, status: TaskStatus) => void;
  onEditTask: (id: string, content: string) => void;
  onDeleteTask: (id: string) => void;
  onCompleteTask?: (id: string, isCompleted: boolean) => void;
  showAddInput?: boolean;
}

export function TaskColumn({
  title,
  status,
  tasks,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onCompleteTask,
  showAddInput = true,
}: TaskColumnProps) {
  const [newTaskContent, setNewTaskContent] = useState("");
  const { setNodeRef } = useDroppable({ id: status });
  const statusTasks = tasks.filter((task) => task.status === status);

  const handleAddTask = () => {
    if (newTaskContent.trim()) {
      onAddTask(newTaskContent, status);
      setNewTaskContent("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddTask();
    }
  };

  //bg coloring
  const getColumnColor = () => {
    switch (status) {
      case "DO_FIRST":
        return "bg-emerald-100 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800";
      case "DO_LATER":
        return "bg-sky-100 dark:bg-sky-900/30 border-sky-200 dark:border-sky-800";
      case "DELEGATE":
        return "bg-amber-100 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800";
      case "ELIMINATE":
        return "bg-rose-100 dark:bg-rose-900/30 border-rose-200 dark:border-rose-800";
      default:
        return "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700";
    }
  };

  //header text color
  const getHeaderColor = () => {
    switch (status) {
      case "DO_FIRST":
        return "text-emerald-700 dark:text-emerald-300";
      case "DO_LATER":
        return "text-sky-700 dark:text-sky-300";
      case "DELEGATE":
        return "text-amber-700 dark:text-amber-300";
      case "ELIMINATE":
        return "text-rose-700 dark:text-rose-300";
      default:
        return "text-slate-700 dark:text-slate-300";
    }
  };

  return (
    <Card className={`h-full rounded-xl shadow-lg border ${getColumnColor()}`}>
      <CardHeader className="pb-2">
        <CardTitle className={`text-lg font-bold ${getHeaderColor()}`}>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {showAddInput && (
          <div className="mb-4 flex space-x-2">
            <Input
              value={newTaskContent}
              onChange={(e) => setNewTaskContent(e.target.value)}
              placeholder="Add a task..."
              onKeyDown={handleKeyDown}
            />
            <Button onClick={handleAddTask}>
              <Plus size={16} />
            </Button>
          </div>
        )}
        <div ref={setNodeRef} className="min-h-[200px] flex flex-col">
          <SortableContext
            items={statusTasks.map((task) => task.id)}
            strategy={verticalListSortingStrategy}
          >
            {statusTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onDelete={onDeleteTask}
                onEdit={onEditTask}
                onComplete={onCompleteTask}
              />
            ))}
          </SortableContext>
        </div>
      </CardContent>
    </Card>
  );
}
