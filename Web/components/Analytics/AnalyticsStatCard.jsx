"use client";

import { motion } from "framer-motion";

export function AnalyticsStatCard({ stat, index }) {
  const isDanger = stat.type === "danger";
  const isSuccess = stat.type === "success";

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.28 + index * 0.05 }}
      whileHover={{ y: -4 }}
      className={`relative overflow-hidden rounded-2xl border bg-white p-5 shadow-sm transition hover:shadow-[0_16px_35px_rgba(15,23,42,0.08)] ${
        isDanger
          ? "border-red-100 before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-red-500"
          : "border-slate-100"
      }`}
    >
      <p className="text-xs font-black uppercase tracking-wide text-slate-400">
        {stat.title}
      </p>

      <div className="mt-3 flex items-end gap-2">
        <span
          className={`text-3xl font-black ${
            isDanger ? "text-red-500" : "text-slate-950"
          }`}
        >
          {stat.value}
        </span>

        <span
          className={`mb-1 text-sm font-bold ${
            isSuccess ? "text-green-500" : "text-slate-400"
          }`}
        >
          {stat.description}
        </span>
      </div>
    </motion.div>
  );
}