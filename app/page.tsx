"use client";
import ModeToggle from "@/components/ui/mode-toggle";
import { TaskBoard } from "./components/TaskBoard";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-100 dark:bg-slate-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">
              Task Manager
            </h1>
            <p className="text-slate-600 dark:text-slate-300">
              Organize your tasks in four quadrants: Do First, Do Later,
              Delegate, and Eliminate.
            </p>
          </div>
          <ModeToggle />
        </header>
        <TaskBoard />
      </div>
    </main>
  );
}
