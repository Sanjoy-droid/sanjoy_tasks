import { useState } from "react";
import { Task } from "@/lib/types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Pencil, Trash2, Check, CircleCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface TaskItemProps {
  task: Task;
  onDelete: (id: string) => void;
  onEdit: (id: string, content: string) => void;
  onComplete?: (id: string, isCompleted: boolean) => void;
}

export function TaskItem({
  task,
  onDelete,
  onEdit,
  onComplete,
}: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(task.content);

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleSave = () => {
    if (editContent.trim()) {
      onEdit(task.id, editContent);
    }
    setIsEditing(false);
  };

  const handleToggleComplete = () => {
    if (onComplete) {
      onComplete(task.id, !task.completed);
    }
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={`p-3 mb-2 rounded-md shadow-sm border cursor-grab ${
          task.completed
            ? "bg-slate-100 dark:bg-slate-700 border-slate-200 dark:border-slate-600"
            : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
        }`}
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="ghost"
              onClick={handleToggleComplete}
              className="h-6 w-6"
            >
              {task.completed ? (
                <CircleCheck size={16} className="text-green-500" />
              ) : (
                <Check size={16} />
              )}
            </Button>
            <span
              className={`text-sm ${
                task.completed
                  ? "line-through text-slate-500 dark:text-slate-400"
                  : ""
              }`}
            >
              {task.content}
            </span>
          </div>

          <div className="flex space-x-1">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setIsEditing(true)}
              className="h-6 w-6"
            >
              <Pencil size={16} />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => onDelete(task.id)}
              className="h-6 w-6"
            >
              <Trash2 size={16} />
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              placeholder="Task content"
              className="w-full"
            />
          </div>
          <DialogFooter className="sm:justify-end">
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
