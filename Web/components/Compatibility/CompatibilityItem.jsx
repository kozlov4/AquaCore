"use client";

import { Minus, Plus, X } from "lucide-react";
import { motion } from "framer-motion";

export function CompatibilityItem({ item, index }) {
  return (
    <motion.article
      initial={{ opacity: 0, x: -24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08 }}
      whileHover={{ y: -3 }}
      className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white px-4 py-4 shadow-sm transition hover:shadow-[0_18px_45px_rgba(15,23,42,0.08)]"
    >
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#EEF2FF] text-2xl">
          {item.icon}
        </div>

        <div>
          <h3 className="text-base font-black text-slate-950">{item.name}</h3>
          <p className="text-xs italic text-slate-400">{item.latin}</p>

          <div className="mt-2 flex gap-2">
            <span
              className={`rounded-md px-2 py-1 text-[10px] font-black ${
                item.danger
                  ? "bg-red-50 text-red-500"
                  : "bg-green-50 text-green-600"
              }`}
            >
              {item.type}
            </span>

            <span className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-black text-slate-500">
              {item.size}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-5">
        <div className="flex items-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
          <button className="px-3 py-2 text-slate-500 transition hover:bg-white hover:text-[#635BFF]">
            <Minus size={14} />
          </button>

          <span className="min-w-8 text-center text-sm font-black text-slate-950">
            {item.count}
          </span>

          <button className="px-3 py-2 text-slate-500 transition hover:bg-white hover:text-[#635BFF]">
            <Plus size={14} />
          </button>
        </div>

        <button className="text-slate-300 transition hover:text-red-500">
          <X size={18} />
        </button>
      </div>
    </motion.article>
  );
}