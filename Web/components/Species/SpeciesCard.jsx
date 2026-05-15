"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export function SpeciesCard({ item, index }) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.04, duration: 0.35 }}
      whileHover={{
        y: -6,
        scale: 1.015,
        boxShadow: "0 24px 60px rgba(15,23,42,0.12)",
      }}
      className="group overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition"
    >
      <div className="relative flex h-[150px] items-center justify-center bg-gradient-to-br from-[#EEF2FF] to-[#ECFEFF]">
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <span className="text-6xl">{item.icon || "🐟"}</span>
        )}

        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-black text-[#635BFF] shadow-sm">
          {item.category}
        </span>

        <span className="absolute right-4 top-4 rounded-full bg-black/50 px-3 py-1 text-xs font-bold text-white backdrop-blur">
          {item.water}
        </span>
      </div>

      <div className="p-5">
        <h3 className="text-lg font-black text-slate-950 transition group-hover:text-[#635BFF]">
          {item.name}
        </h3>

        <p className="mt-1 text-sm italic text-slate-400">{item.latin}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {item.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-slate-100 bg-slate-50 px-3 py-1 text-xs font-bold text-slate-500"
            >
              {tag}
            </span>
          ))}
        </div>

        <Link
          href={`/species-details?id=${item.id}`}
          className="
            mt-6 inline-flex w-full items-center justify-center
            rounded-xl bg-slate-950 px-4 py-3
            text-sm font-black text-white transition
            hover:bg-[#635BFF]
          "
        >
          Детальніше
        </Link>
      </div>
    </motion.article>
  );
}