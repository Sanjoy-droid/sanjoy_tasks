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
} from "@/lib/store";

export function TaskBoard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

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

  const handleAddTask = (content: string, status: TaskStatus) => {
    setTasks(addTask(tasks, content, status));
  };

  const handleEditTask = (id: string, content: string) => {
    setTasks(updateTask(tasks, id, content));
  };

  const handleDeleteTask = (id: string) => {
    setTasks(deleteTask(tasks, id));
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <TaskColumn
          title="DO FIRST"
          status="DO_FIRST"
          tasks={tasks}
          onAddTask={handleAddTask}
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteTask}
        />
        <TaskColumn
          title="DO LATER"
          status="DO_LATER"
          tasks={tasks}
          onAddTask={handleAddTask}
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteTask}
        />
        <TaskColumn
          title="DELEGATE"
          status="DELEGATE"
          tasks={tasks}
          onAddTask={handleAddTask}
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteTask}
        />
        <TaskColumn
          title="ELIMINATE"
          status="ELIMINATE"
          tasks={tasks}
          onAddTask={handleAddTask}
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteTask}
        />
      </div>

      <DragOverlay>
        {activeTask ? (
          <TaskItem task={activeTask} onDelete={() => {}} onEdit={() => {}} />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
