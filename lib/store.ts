import { v4 as uuidv4 } from "uuid";
import { Task, TaskStatus } from "./types";

// fetch tasks
export const loadTasks = (): Task[] => {
  if (typeof window === "undefined") return [];

  const saved = sessionStorage.getItem("tasks");
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to parse saved tasks", e);
    }
  }
  return [];
};

// Save tasks to sessionStorage
export const saveTasks = (tasks: Task[]) => {
  if (typeof window === "undefined") return;
  sessionStorage.setItem("tasks", JSON.stringify(tasks));
};

// Add a new task
export const addTask = (
  tasks: Task[],
  content: string,
  status: TaskStatus,
): Task[] => {
  const newTask: Task = {
    id: uuidv4(),
    content,
    status,
    completed: false,
    order: tasks.length > 0 ? Math.max(...tasks.map((t) => t.order)) + 1 : 0,
  };
  const updatedTasks = [...tasks, newTask];
  saveTasks(updatedTasks);
  return updatedTasks;
};

// Update a task
export const updateTask = (
  tasks: Task[],
  id: string,
  content: string,
): Task[] => {
  const updatedTasks = tasks.map((task) =>
    task.id === id ? { ...task, content } : task,
  );
  saveTasks(updatedTasks);
  return updatedTasks;
};

// Delete a task
export const deleteTask = (tasks: Task[], id: string): Task[] => {
  const updatedTasks = tasks.filter((task) => task.id !== id);
  saveTasks(updatedTasks);
  return updatedTasks;
};

// Move a task to a different status or reorder within the same status
export const reorderTasks = (
  tasks: Task[],
  taskId: string,
  destinationStatus: TaskStatus,
  newIndex: number,
): Task[] => {
  const taskToMove = tasks.find((task) => task.id === taskId);
  if (!taskToMove) return tasks;

  const tasksWithoutMoved = tasks.filter((task) => task.id !== taskId);

  // Get tasks with the destination status
  const destinationTasks = tasksWithoutMoved.filter(
    (task) => task.status === destinationStatus,
  );

  // Insert the task at the new index
  const updatedDestinationTasks = [
    ...destinationTasks.slice(0, newIndex),
    { ...taskToMove, status: destinationStatus },
    ...destinationTasks.slice(newIndex),
  ];

  // Combine all tasks
  const otherTasks = tasksWithoutMoved.filter(
    (task) => task.status !== destinationStatus,
  );
  const updatedTasks = [...otherTasks, ...updatedDestinationTasks];

  saveTasks(updatedTasks);
  return updatedTasks;
};

export function completeTask(
  tasks: Task[],
  id: string,
  completed: boolean,
): Task[] {
  return tasks.map((task) => (task.id === id ? { ...task, completed } : task));
}
