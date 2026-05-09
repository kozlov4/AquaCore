"use client";

import { motion } from "framer-motion";
import { categories } from "../../../hooks/useFeed";

export function CategoriesBlock() {
  return (
    <motion.aside
      className="sticky top-24 w-[260px] self-start"
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, ease: "easeOut", delay: 0.15 }}
    >
      <h3 className="mb-4 text-sm font-semibold text-gray-500">Категорії</h3>

      <div className="space-y-3">
        {categories.map((category, index) => (
          <motion.button
            key={category.id}
            type="button"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.24,
              ease: "easeOut",
              delay: index * 0.04,
            }}
            whileHover={{ x: 4, backgroundColor: "rgba(243,244,246,1)" }}
            whileTap={{ scale: 0.985 }}
            className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-2 py-2 text-left"
          >
            <motion.span
              className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-lg"
              whileHover={{ scale: 1.06 }}
              transition={{ type: "spring", stiffness: 280, damping: 18 }}
            >
              {category.icon}
            </motion.span>

            <div>
              <p className="text-sm font-medium text-gray-900">
                {category.title}
              </p>
              <p className="text-xs text-gray-400">+100</p>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.aside>
  );
}