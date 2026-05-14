"use client";

import { motion } from "framer-motion";

const categories = [
  "Усі інструменти",
  "Базові розміри",
  "Хімія та Добрива",
  "Обладнання",
];

export function CalculatorFilters({ activeCategory, setActiveCategory }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.14 }}
      className="
        mt-5 flex gap-2 overflow-x-auto pb-2
        sm:flex-wrap sm:gap-3 sm:overflow-visible sm:pb-0
      "
    >
      {categories.map((category) => (
        <motion.button
          key={category}
          type="button"
          onClick={() => setActiveCategory(category)}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.96 }}
          className={`
            shrink-0 rounded-full border px-4 py-2
            text-xs font-black transition
            ${
              activeCategory === category
                ? "border-[#635BFF] bg-[#635BFF] text-white shadow-[0_12px_25px_rgba(99,91,255,0.28)]"
                : "border-slate-200 bg-white text-slate-600 hover:border-[#635BFF]/30 hover:text-[#635BFF]"
            }
          `}
        >
          {category}
        </motion.button>
      ))}
    </motion.div>
  );
}