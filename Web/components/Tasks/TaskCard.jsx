"use client";

import { MoreVertical } from "lucide-react";
import { motion } from "framer-motion";

export function TaskCard({ task, index, onToggle }) {
  const isOverdue = task.status === "overdue";
  const isDone = task.status === "done";

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -2 }}
      className={`relative flex items-center gap-4 rounded-2xl border bg-white px-5 py-5 shadow-sm transition ${
        isOverdue
          ? "border-red-100 before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:rounded-l-2xl before:bg-red-500"
          : isDone
          ? "border-slate-100 bg-slate-50 opacity-55"
          : "border-slate-100 hover:shadow-md"
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border transition ${
          isDone
            ? "border-[#635BFF] bg-[#635BFF] text-white"
            : "border-slate-300 bg-white hover:border-[#635BFF]"
        }`}
      >
        {isDone && "✓"}
      </button>

      <div className="flex-1">
        {isOverdue && (
          <span className="mb-1 inline-block rounded-md bg-red-50 px-2 py-0.5 text-xs font-black uppercase text-red-500">
            Прострочено
          </span>
        )}

        <p className="text-xs font-bold text-slate-400">{task.aquarium}</p>

        <h3 className="text-base font-black text-slate-950">{task.title}</h3>

        {task.description && (
          <p className="mt-1 text-sm text-slate-500">{task.description}</p>
        )}
      </div>

      <button className="text-slate-400 transition hover:text-slate-900">
        <MoreVertical size={18} />
      </button>
    </motion.article>
  );
}