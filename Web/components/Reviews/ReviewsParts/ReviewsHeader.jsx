"use client";

import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export function ReviewsHeader({ showAll, onShowAll }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="
        mb-8 flex flex-col gap-5
        sm:mb-10
        lg:mb-12 lg:flex-row lg:items-start lg:justify-between
      "
    >
      <div>
        <p className="mb-2 text-sm font-semibold text-[#5B4CF6]">
          Відгуки клієнтів
        </p>

        <h1
          className="
            max-w-[900px] text-2xl font-bold leading-tight
            tracking-tight text-[#171827]
            sm:text-3xl
            lg:text-4xl
          "
        >
          Що Кажуть Користувачі Після Використання Нашого Продукту
        </h1>
      </div>

      {!showAll && (
        <motion.button
          type="button"
          onClick={onShowAll}
          whileHover={{ x: 5 }}
          whileTap={{ scale: 0.98 }}
          className="
            flex w-fit cursor-pointer items-center gap-2
            text-sm font-semibold text-[#5B4CF6]
            sm:text-base
            lg:mt-4
          "
        >
          Дивитись всі
          <ArrowRight size={18} />
        </motion.button>
      )}
    </motion.div>
  );
}