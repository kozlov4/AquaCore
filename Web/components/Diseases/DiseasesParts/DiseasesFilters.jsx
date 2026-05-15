"use client";

import { motion } from "framer-motion";

export function DiseasesFilters({ filters, activeFilter, setActiveFilter }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.4 }}
      className="
        mt-6 flex gap-2 overflow-x-auto pb-2
        sm:mt-7 sm:flex-wrap sm:justify-center sm:gap-3 sm:overflow-visible sm:pb-0
      "
    >
      {filters.map((filter) => (
        <motion.button
          key={filter}
          type="button"
          onClick={() => setActiveFilter(filter)}
          whileHover={{ y: -2, scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          className={`
            shrink-0 cursor-pointer rounded-full border
            px-4 py-2 text-sm font-black
            transition-all duration-300
            ${
              activeFilter === filter
                ? "border-[#5B4CF6]/20 bg-[#5B4CF6] text-white shadow-[0_16px_34px_rgba(91,76,246,0.3)]"
                : "border-white/80 bg-white/80 text-slate-700 shadow-sm backdrop-blur hover:border-[#5B4CF6]/30 hover:bg-[#5B4CF6]/10 hover:text-[#5B4CF6]"
            }
          `}
        >
          {filter}
        </motion.button>
      ))}
    </motion.div>
  );
}