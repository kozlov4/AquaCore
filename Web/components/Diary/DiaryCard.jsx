"use client";

import Image from "next/image";
import { Image as ImageIcon } from "lucide-react";
import { motion } from "framer-motion";

export function DiaryCard({ entry, index, onOpen }) {
  const tagClasses = {
    red: "bg-red-50 text-red-500",
    green: "bg-green-50 text-green-600",
    yellow: "bg-yellow-50 text-yellow-600",
    gray: "bg-slate-100 text-slate-600",
  };

  return (
    <motion.article
      layout
      onClick={onOpen}
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.05, duration: 0.35 }}
      whileHover={{
        y: -6,
        scale: 1.015,
        boxShadow: "0 24px 60px rgba(15,23,42,0.12)",
      }}
      whileTap={{ scale: 0.98 }}
      className={`
        group cursor-pointer overflow-hidden rounded-2xl border
        bg-white transition-all duration-300
        ${
          entry.pinned
            ? "border-[#635BFF]/20 bg-[#F5F6FF]"
            : "border-slate-100"
        }
      `}
    >
      {entry.imageUrl ? (
        <div className="relative h-[150px] bg-slate-100">
          <Image
            src={entry.imageUrl}
            alt={entry.title}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        </div>
      ) : entry.image ? (
        <div className="flex h-[150px] items-center justify-center bg-[#2C2676] text-white">
          <ImageIcon size={22} />
        </div>
      ) : null}

      <div className="p-5">
        <p className="text-xs font-bold text-slate-400">
          {entry.pinned && <span className="text-red-500">Закріплено • </span>}
          {entry.date}
          {entry.aquarium && (
            <>
              {" "}
              • <span className="text-[#635BFF]">{entry.aquarium}</span>
            </>
          )}
        </p>

        <h3 className="mt-3 line-clamp-2 text-base font-black leading-snug text-slate-950">
          {entry.title}
        </h3>

        <p className="mt-3 line-clamp-4 text-sm leading-6 text-slate-500">
          {entry.text}
        </p>

        <span
          className={`
            mt-4 inline-flex rounded-md px-2.5 py-1
            text-[11px] font-black uppercase
            ${tagClasses[entry.tagColor] || tagClasses.gray}
          `}
        >
          {entry.tagLabel}
        </span>
      </div>
    </motion.article>
  );
}