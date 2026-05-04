"use client";

import { motion } from "framer-motion";

function highlightText(text, query) {
  if (!query) return text;

  const parts = text.split(new RegExp(`(${query})`, "gi"));

  return parts.map((part, index) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <span key={index} className="rounded bg-yellow-200 px-1">
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
    className: "bg-red-50 text-red-600 border-red-100",
  },
  medium: {
    label: "Помірна небезпека",
    className: "bg-yellow-50 text-yellow-700 border-yellow-100",
  },
};

export function DiseaseCard({ disease, searchValue, onOpen }) {
  const danger = dangerStyles[disease.danger] || dangerStyles.medium;

  return (
    <motion.article
      whileHover={{ y: -8, scale: 1.015 }}
      whileTap={{ scale: 0.99 }}
      className="group overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-[0_12px_35px_rgba(15,23,42,0.05)] transition hover:shadow-[0_24px_60px_rgba(15,23,42,0.12)]"
    >
      <div className="relative flex h-[120px] items-center justify-center overflow-hidden bg-gradient-to-br from-[#FFF2DC] to-[#FFE7BC]">
        <motion.div
          whileHover={{ rotate: 8, scale: 1.14 }}
          transition={{ type: "spring", stiffness: 260, damping: 16 }}
          className="text-5xl"
        >
          🐟
        </motion.div>

        <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/30 blur-xl transition group-hover:scale-125" />
      </div>

      <div className="p-5">
        <div
          className={`mb-3 inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${danger.className}`}
        >
          {danger.label}
        </div>

        <h3 className="text-lg font-bold tracking-tight text-gray-900 transition group-hover:text-[#5B4CF6]">
          {highlightText(disease.title, searchValue)}
        </h3>

        <div className="mt-4 flex flex-wrap gap-2">
          {disease.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 transition group-hover:bg-[#5B4CF6]/10 group-hover:text-[#5B4CF6]"
            >
              #{tag}
            </span>
          ))}
        </div>

        <motion.button
          type="button"
          onClick={() => onOpen(disease)}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.97 }}
          className="mt-6 w-full rounded-xl cursor-pointer bg-gray-50 py-3 text-sm font-semibold text-gray-700 transition hover:bg-[#5B4CF6] hover:text-white hover:shadow-[0_12px_28px_rgba(91,76,246,0.24)]"
        >
          Детальніше
        </motion.button>
      </div>
    </motion.article>
  );
}