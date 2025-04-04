export type TaskStatus = "DO_FIRST" | "DO_LATER" | "DELEGATE" | "ELIMINATE";

export interface Task {
  id: string;
  content: string;
  status: TaskStatus;
  completed?: boolean; // Add this property
  order: number;
}
