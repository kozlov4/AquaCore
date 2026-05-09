"use client";

import { Image as ImageIcon } from "lucide-react";
import { motion } from "framer-motion";

export function DiaryCard({ entry, index }) {
  const tagClasses = {
    red: "bg-red-50 text-red-500",
    green: "bg-green-50 text-green-600",
    gray: "bg-slate-100 text-slate-600",
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.05, duration: 0.35 }}
      whileHover={{ y: -5 }}
      className={`overflow-hidden rounded-3xl border bg-white shadow-sm transition hover:shadow-[0_22px_60px_rgba(15,23,42,0.1)] ${
        entry.pinned
          ? "border-[#635BFF]/20 bg-[#F6F7FF]"
          : "border-slate-100"
      }`}
    >
      {entry.image && (
        <div className="relative flex h-[155px] items-center justify-center bg-gradient-to-br from-[#23135F] to-[#37269B]">
          <button className="absolute right-4 top-4 rounded-lg bg-white/90 p-2 text-slate-500">
            <ImageIcon size={16} />
          </button>
        </div>
      )}

      <div className="p-6">
        <p className="text-xs font-bold text-slate-400">
          {entry.pinned && <span className="text-[#635BFF]">📌 Закріплено • </span>}
          {entry.date}
          {entry.aquarium && (
            <>
              {" "}
              • <span className="text-[#635BFF]">{entry.aquarium}</span>
            </>
          )}
        </p>

        <h3 className="mt-4 text-lg font-black text-slate-950">
          {entry.title}
        </h3>

        <p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-600">
          {entry.text}
        </p>

        <span
          className={`mt-5 inline-flex rounded-lg px-3 py-1.5 text-xs font-black uppercase ${
            tagClasses[entry.tagColor]
          }`}
        >
          {entry.tag}
        </span>
      </div>
    </motion.article>
  );
}