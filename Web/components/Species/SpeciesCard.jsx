"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export function SpeciesCard({ item, index }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.04, duration: 0.35 }}
      whileHover={{ y: -6, scale: 1.015 }}
      className="group overflow-hidden rounded-3xl border border-slate-100 bg-white p-4 shadow-sm transition hover:border-[#635BFF]/20 hover:shadow-[0_20px_55px_rgba(15,23,42,0.1)]"
    >
      <div className="relative flex h-[155px] items-center justify-center rounded-2xl bg-slate-50">
        <span className="absolute right-3 top-3 rounded-md bg-white px-2 py-1 text-[10px] font-black uppercase text-slate-500">
          {item.category === "Рослини" ? "Рослина" : "Прісна"}
        </span>

        <motion.div
          whileHover={{ scale: 1.16, rotate: 6 }}
          className="text-6xl"
        >
          {item.icon}
        </motion.div>
      </div>

      <div className="mt-4">
        <h3 className="text-base font-black text-slate-950">{item.name}</h3>
        <p className="mt-0.5 text-xs italic text-slate-400">{item.latin}</p>

        <div className="mt-3 flex flex-wrap gap-2">
          {item.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-slate-50 px-2 py-1 text-xs font-bold text-slate-600"
            >
              {tag}
            </span>
          ))}
        </div>

        <Link href="/species-details">
          <motion.button
            type="button"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.96 }}
            className="mt-4 w-full rounded-xl bg-slate-50 py-3 text-sm font-bold text-slate-700 transition hover:bg-[#635BFF] hover:text-white"
          >
            Детальніше
          </motion.button>
        </Link>
      </div>
    </motion.article>
  );
}
