"use client";

import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

export function GalleryFilters() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 }}
      className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"
    >
      <div className="flex items-center justify-between">
        <div className="flex gap-3">
          <button className="flex min-w-[220px] items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-800 transition hover:border-[#635BFF]/40">
            Головний Травник
            <ChevronDown size={17} className="text-slate-400" />
          </button>

          <button className="flex min-w-[180px] items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-800 transition hover:border-[#635BFF]/40">
            Всі фотографії
            <ChevronDown size={17} className="text-slate-400" />
          </button>
        </div>

        <div className="flex rounded-xl bg-slate-100 p-1">
          <button className="rounded-lg bg-white px-4 py-2 text-xs font-black text-slate-950 shadow-sm">
            Найновіші
          </button>

          <button className="rounded-lg px-4 py-2 text-xs font-black text-slate-400 transition hover:text-slate-700">
            Найстаріші
          </button>
        </div>
      </div>
    </motion.section>
  );
}