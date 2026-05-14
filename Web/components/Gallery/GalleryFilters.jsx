"use client";

import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

export function GalleryFilters() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 }}
      className="
        rounded-2xl border border-slate-100
        bg-white p-3 shadow-sm
        sm:p-4
      "
    >
      <div
        className="
          flex flex-col gap-3
          lg:flex-row lg:items-center lg:justify-between
        "
      >
        <div
          className="
            grid grid-cols-1 gap-3
            sm:grid-cols-2
            lg:flex
          "
        >
          <button
            type="button"
            className="
              flex w-full items-center justify-between
              rounded-xl border border-slate-200
              px-4 py-3 text-sm font-bold text-slate-800
              transition hover:border-[#635BFF]/40
              lg:min-w-[220px]
            "
          >
            Головний Травник
            <ChevronDown size={17} className="shrink-0 text-slate-400" />
          </button>

          <button
            type="button"
            className="
              flex w-full items-center justify-between
              rounded-xl border border-slate-200
              px-4 py-3 text-sm font-bold text-slate-800
              transition hover:border-[#635BFF]/40
              lg:min-w-[180px]
            "
          >
            Всі фотографії
            <ChevronDown size={17} className="shrink-0 text-slate-400" />
          </button>
        </div>

        <div className="grid grid-cols-2 rounded-xl bg-slate-100 p-1 sm:flex">
          <button
            type="button"
            className="
              rounded-lg bg-white px-4 py-2
              text-xs font-black text-slate-950 shadow-sm
            "
          >
            Найновіші
          </button>

          <button
            type="button"
            className="
              rounded-lg px-4 py-2 text-xs font-black
              text-slate-400 transition hover:text-slate-700
            "
          >
            Найстаріші
          </button>
        </div>
      </div>
    </motion.section>
  );
}