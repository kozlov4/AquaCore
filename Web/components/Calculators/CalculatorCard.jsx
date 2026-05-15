"use client";

import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const accentMap = {
  blue: {
    iconBg: "bg-blue-50",
    link: "text-[#635BFF]",
    shadow: "rgba(99,91,255,0.18)",
  },
  yellow: {
    iconBg: "bg-yellow-50",
    link: "text-yellow-600",
    shadow: "rgba(234,179,8,0.18)",
  },
  green: {
    iconBg: "bg-green-50",
    link: "text-emerald-600",
    shadow: "rgba(16,185,129,0.18)",
  },
  cyan: {
    iconBg: "bg-cyan-50",
    link: "text-blue-600",
    shadow: "rgba(59,130,246,0.18)",
  },
  red: {
    iconBg: "bg-red-50",
    link: "text-rose-500",
    shadow: "rgba(244,63,94,0.18)",
  },
};

export function CalculatorCard({ calculator, index, onOpen }) {
  const accent = accentMap[calculator.accent] || accentMap.blue;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.05, duration: 0.35 }}
      whileHover={{
        y: -6,
        scale: 1.01,
        boxShadow: `0 24px 60px ${accent.shadow}`,
      }}
      className="
        group flex min-h-[190px] flex-col justify-between
        rounded-2xl border border-slate-100 bg-white
        p-5 shadow-sm transition
        sm:min-h-[205px] sm:p-6
        lg:min-h-[215px]
      "
    >
      <div>
        <div
          className={`
            mb-5 flex h-12 w-12 items-center justify-center
            rounded-2xl text-2xl
            sm:mb-6 sm:h-14 sm:w-14 sm:text-3xl
            ${accent.iconBg}
          `}
        >
          {calculator.icon}
        </div>

        <h3 className="text-lg font-black text-slate-950 sm:text-xl">
          {calculator.title}
        </h3>

        <p className="mt-2 text-sm leading-6 text-slate-500 sm:mt-3">
          {calculator.description}
        </p>
      </div>

      <motion.button
        type="button"
        onClick={onOpen}
        whileHover={{ x: 4 }}
        whileTap={{ scale: 0.96 }}
        className={`
          mt-5 flex w-fit items-center gap-2
          text-sm font-black
          sm:mt-6
          ${accent.link}
        `}
      >
        Відкрити
        <ArrowRight size={16} />
      </motion.button>
    </motion.article>
  );
}