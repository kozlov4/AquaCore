"use client";

import { Plus } from "lucide-react";
import { motion } from "framer-motion";

export function EmptyAquariums({ onCreate, onAdd }) {
  const handleClick = onCreate || onAdd;

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="
        flex min-h-[420px] flex-col items-center justify-center
        rounded-[32px] border border-dashed border-slate-200
        bg-slate-50 px-6 py-12 text-center
      "
    >
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white text-4xl shadow-sm">
        🐠
      </div>

      <h2 className="mt-6 text-2xl font-black text-slate-950">
        У вас ще немає акваріумів
      </h2>

      <p className="mt-3 max-w-[420px] text-sm leading-6 text-slate-500">
        Створіть першу екосистему, щоб вести щоденник, галерею, параметри води
        та догляд.
      </p>

      <motion.button
        type="button"
        onClick={handleClick}
        whileHover={{
          y: -2,
          boxShadow: "0 16px 35px rgba(99,91,255,0.32)",
        }}
        whileTap={{ scale: 0.96 }}
        className="
          mt-7 flex items-center gap-2
          rounded-xl bg-[#635BFF] px-6 py-3
          text-sm font-black text-white transition hover:bg-[#5147f5]
        "
      >
        <Plus size={17} />
        Створити акваріум
      </motion.button>
    </motion.section>
  );
}