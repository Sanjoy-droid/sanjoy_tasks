import { useState, useEffect } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { TaskColumn } from "./TaskColumn";
import { TaskItem } from "./TaskItem";
import { Task, TaskStatus } from "@/lib/types";
import {
  loadTasks,
  addTask,
  updateTask,
  deleteTask,
  reorderTasks,
  completeTask,
} from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function TaskBoard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newTaskContent, setNewTaskContent] = useState("");
  const [newTaskStatus, setNewTaskStatus] = useState<TaskStatus>("DO_FIRST");

  useEffect(() => {
    setTasks(loadTasks());
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleAddTask = () => {
    if (newTaskContent.trim()) {
      setTasks(addTask(tasks, newTaskContent, newTaskStatus));
      setNewTaskContent("");
      setIsAddDialogOpen(false);
    }
  };

  const handleEditTask = (id: string, content: string) => {
    setTasks(updateTask(tasks, id, content));
  };

  const handleDeleteTask = (id: string) => {
    setTasks(deleteTask(tasks, id));
  };

  const handleCompleteTask = (id: string, isCompleted: boolean) => {
    setTasks(completeTask(tasks, id, isCompleted));
  };

  const handleDragStart = (event: any) => {
    const { active } = event;
    const draggedTask = tasks.find((task) => task.id === active.id);
    if (draggedTask) {
      setActiveTask(draggedTask);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const overId = String(over.id);

    if (tasks.some((task) => task.id === overId)) return;

    const validStatuses: TaskStatus[] = [
      "DO_FIRST",
      "DO_LATER",
      "DELEGATE",
      "ELIMINATE",
    ];
    if (validStatuses.includes(overId as TaskStatus)) {
      const updatedTasks = tasks.map((task) =>
        task.id === active.id ? { ...task, status: overId as TaskStatus } : task
      );
      setTasks(updatedTasks);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveTask(null);
      return;
    }

    const activeId = String(active.id);
    const overId = String(over.id);

    if (activeId === overId) {
      setActiveTask(null);
      return;
    }

    const activeTask = tasks.find((task) => task.id === activeId);
    if (!activeTask) {
      setActiveTask(null);
      return;
    }

    const validStatuses: TaskStatus[] = [
      "DO_FIRST",
      "DO_LATER",
      "DELEGATE",
      "ELIMINATE",
    ];

    // If dropped over a column
    if (validStatuses.includes(overId as TaskStatus)) {
      const statusTasks = tasks.filter((task) => task.status === overId);
      setTasks(
        reorderTasks(tasks, activeId, overId as TaskStatus, statusTasks.length)
      );
    }
    // If dropped over another task
    else {
      const overTask = tasks.find((task) => task.id === overId);
      if (overTask) {
        const statusTasks = tasks.filter(
          (task) => task.status === overTask.status
        );
        const overIndex = statusTasks.findIndex((task) => task.id === overId);
        setTasks(reorderTasks(tasks, activeId, overTask.status, overIndex));
      }
    }

    setActiveTask(null);
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 relative">
        <TaskColumn
          title="DO FIRST"
          status="DO_FIRST"
          tasks={tasks}
          onAddTask={(content, status) =>
            setTasks(addTask(tasks, content, status))
          }
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteTask}
          onCompleteTask={handleCompleteTask}
          showAddInput={false}
        />
        <TaskColumn
          title="DO LATER"
          status="DO_LATER"
          tasks={tasks}
          onAddTask={(content, status) =>
            setTasks(addTask(tasks, content, status))
          }
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteTask}
          onCompleteTask={handleCompleteTask}
          showAddInput={false}
        />
        <TaskColumn
          title="DELEGATE"
          status="DELEGATE"
          tasks={tasks}
          onAddTask={(content, status) =>
            setTasks(addTask(tasks, content, status))
          }
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteTask}
          onCompleteTask={handleCompleteTask}
          showAddInput={false}
        />
        <TaskColumn
          title="ELIMINATE"
          status="ELIMINATE"
          tasks={tasks}
          onAddTask={(content, status) =>
            setTasks(addTask(tasks, content, status))
          }
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteTask}
          onCompleteTask={handleCompleteTask}
          showAddInput={false}
        />

        {/* Central Add Button */}
        <div className="absolute inset-x-0 bottom-0 flex justify-center transform translate-y-1/2 z-10">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-full h-14 w-14 shadow-lg bg-primary">
                <Plus size={24} />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Task</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-2">
                <Input
                  value={newTaskContent}
                  onChange={(e) => setNewTaskContent(e.target.value)}
                  placeholder="Task content"
                  className="w-full"
                />
                <Select
                  value={newTaskStatus}
                  onValueChange={(value) =>
                    setNewTaskStatus(value as TaskStatus)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select quadrant" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DO_FIRST">Do First</SelectItem>
                    <SelectItem value="DO_LATER">Do Later</SelectItem>
                    <SelectItem value="DELEGATE">Delegate</SelectItem>
                    <SelectItem value="ELIMINATE">Eliminate</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter className="sm:justify-end mt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleAddTask}>Add Task</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <DragOverlay>
        {activeTask ? (
          <TaskItem task={activeTask} onDelete={() => {}} onEdit={() => {}} />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
