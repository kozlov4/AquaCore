"use client";

import { motion } from "framer-motion";

function highlightText(text, query) {
  if (!query) return text;

  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = text.split(new RegExp(`(${escapedQuery})`, "gi"));

  return parts.map((part, index) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <span
        key={index}
        className="rounded-md bg-[#FFE8A3] px-1.5 py-0.5 text-[#7A4E00]"
      >
        {part}
      </span>
    ) : (
      part
    )
  );
}

const dangerStyles = {
  high: {
    label: "Висока небезпека",
    className:
      "border-red-200/80 bg-red-50/90 text-red-600 shadow-red-100/60",
    glow: "from-red-400/25 via-orange-300/20 to-transparent",
    iconBg: "from-red-100 via-orange-50 to-white",
  },
  medium: {
    label: "Помірна небезпека",
    className:
      "border-amber-200/80 bg-amber-50/90 text-amber-700 shadow-amber-100/60",
    glow: "from-amber-300/30 via-yellow-200/20 to-transparent",
    iconBg: "from-amber-100 via-yellow-50 to-white",
  },
};

export function DiseaseCard({ disease, searchValue, onOpen }) {
  const danger = dangerStyles[disease.danger] || dangerStyles.medium;
  const label = disease.dangerLabel || danger.label;

  return (
    <motion.article
      whileHover={{ y: -8, scale: 1.012 }}
      whileTap={{ scale: 0.985 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="
        group relative overflow-hidden rounded-[26px]
        border border-white/80 bg-white/85
        shadow-[0_20px_55px_rgba(15,23,42,0.08)]
        backdrop-blur-xl transition-all duration-500
        hover:border-[#5B4CF6]/20
        hover:shadow-[0_30px_85px_rgba(91,76,246,0.18)]
        sm:rounded-[30px]
      "
    >
      <div
        className={`pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gradient-to-br ${danger.glow} blur-2xl transition duration-500 group-hover:scale-125`}
      />

      <div
        className={`relative flex h-[115px] items-center justify-center overflow-hidden bg-gradient-to-br ${danger.iconBg} sm:h-[130px]`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.95),transparent_36%)]" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />

        <motion.div
          whileHover={{ rotate: 10, scale: 1.18 }}
          transition={{ type: "spring", stiffness: 280, damping: 15 }}
          className="relative z-10 text-5xl drop-shadow-sm sm:text-6xl"
        >
          🐟
        </motion.div>

        <motion.div
          animate={{
            y: [0, -8, 0],
            opacity: [0.45, 0.9, 0.45],
          }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute left-6 top-5 h-3 w-3 rounded-full bg-white/80"
        />

        <motion.div
          animate={{
            y: [0, -10, 0],
            opacity: [0.35, 0.75, 0.35],
          }}
          transition={{
            duration: 4.2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-8 right-10 h-2 w-2 rounded-full bg-white/80"
        />
      </div>

      <div className="relative p-5">
        <div
          className={`mb-3 inline-flex rounded-full border px-3 py-1 text-xs font-bold shadow-sm ${danger.className}`}
        >
          {label}
        </div>

        <h3
          className="
            min-h-0 text-lg font-black leading-snug
            tracking-tight text-slate-950
            transition-colors duration-300
            group-hover:text-[#5B4CF6]
            xl:min-h-[56px]
          "
        >
          {highlightText(disease.title, searchValue)}
        </h3>

        <div className="mt-4 flex flex-wrap gap-2">
          {disease.tags.map((tag) => (
            <span
              key={tag}
              className="
                rounded-full border border-slate-100 bg-slate-50
                px-3 py-1 text-xs font-semibold text-slate-500
                transition-all duration-300
                group-hover:border-[#5B4CF6]/15
                group-hover:bg-[#5B4CF6]/10
                group-hover:text-[#5B4CF6]
              "
            >
              #{tag}
            </span>
          ))}
        </div>

        <motion.button
          type="button"
          onClick={() => onOpen(disease)}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.96 }}
          className="
            mt-6 w-full cursor-pointer rounded-2xl
            bg-slate-950 py-3 text-sm font-bold text-white
            shadow-[0_16px_35px_rgba(15,23,42,0.16)]
            transition-all duration-300
            hover:bg-[#5B4CF6]
            hover:shadow-[0_18px_40px_rgba(91,76,246,0.32)]
          "
        >
          Детальніше
        </motion.button>
      </div>
    </motion.article>
  );
}