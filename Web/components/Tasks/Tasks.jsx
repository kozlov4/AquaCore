"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Sidebar } from "../Profile/Sidebar";
import { TaskCalendar } from "./TaskCalendar";
import { TaskFilters } from "./TaskFilters";
import { TaskCard } from "./TaskCard";
import { AddTaskModal } from "./AddTaskModal";

const initialTasks = [
  {
    id: 1,
    title: "Підміна води 30%",
    description: "Сифонка ґрунту спереду, протерти скло зсередини.",
    aquarium: "Головний Травник",
    status: "overdue",
    category: "water",
    completed: false,
  },
  {
    id: 2,
    title: "Додати добрива (Мікро)",
    description: "2 натискання дозатора (AquaGrow Micro).",
    aquarium: "Креветочник",
    status: "active",
    category: "plants",
    completed: false,
  },
  {
    id: 3,
    title: "Перевірити роботу фільтрів",
    description: "",
    aquarium: "Усі акваріуми",
    status: "done",
    category: "service",
    completed: true,
  },
];

export function Tasks() {
  const [tasks, setTasks] = useState(initialTasks);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const addTask = (task) => {
    setTasks((prev) => [
      {
        id: Date.now(),
        ...task,
        status: "active",
        completed: false,
      },
      ...prev,
    ]);
  };

  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? {
              ...task,
              completed: !task.completed,
              status: !task.completed ? "done" : "active",
            }
          : task
      )
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <Sidebar />

      <main className="ml-[88px] px-16 py-10">
        <div className="mx-auto max-w-[1120px]">
          <motion.header
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 flex items-center justify-between"
          >
            <div>
              <h1 className="text-3xl font-black text-slate-950">
                Планування та Догляд
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                Організуйте рутину для всіх ваших екосистем
              </p>
            </div>

            <motion.button
              type="button"
              onClick={() => setIsModalOpen(true)}
              whileHover={{
                y: -2,
                boxShadow: "0 16px 35px rgba(99,91,255,0.32)",
              }}
              whileTap={{ scale: 0.96 }}
              className="flex items-center gap-2 rounded-xl bg-[#635BFF] px-6 py-3 text-sm font-black text-white transition hover:bg-[#5147f5]"
            >
              <Plus size={18} />
              Нове завдання
            </motion.button>
          </motion.header>

          <div className="grid grid-cols-[310px_1fr] gap-8">
            <aside className="space-y-5">
              <TaskCalendar />
              <TaskFilters total={tasks.length} overdue={1} />
            </aside>

            <section>
              <h2 className="mb-5 text-2xl font-black text-slate-950">
                Сьогодні, 24 Квітня
              </h2>

              <div className="space-y-4">
                {tasks.map((task, index) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    index={index}
                    onToggle={() => toggleTask(task.id)}
                  />
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>

      <AnimatePresence>
        {isModalOpen && (
          <AddTaskModal
            onClose={() => setIsModalOpen(false)}
            onSave={addTask}
          />
        )}
      </AnimatePresence>
    </div>
  );
}