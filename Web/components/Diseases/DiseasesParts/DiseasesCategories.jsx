"use client";

import { motion } from "framer-motion";

export function DiseasesCategories({ activeTargetType, setActiveTargetType }) {
  const categories = [
    {
      label: "🐟 Риби",
      value: "Риби",
      className: "border-blue-100 text-blue-600",
    },
    {
      label: "🦐 Безхребетні",
      value: "Безхребетні",
      className: "border-orange-100 text-orange-600",
    },
  ];

  const handleClick = (value) => {
    setActiveTargetType((prev) => (prev === value ? "" : value));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.24, duration: 0.4 }}
      className="
        mt-5 flex flex-wrap justify-center gap-2
        sm:mt-6 sm:gap-3
      "
    >
      {categories.map((category) => {
        const isActive = activeTargetType === category.value;

        return (
          <button
            key={category.value}
            type="button"
            onClick={() => handleClick(category.value)}
            className={`
              rounded-full border bg-white/80 px-4 py-2
              text-sm font-black shadow-sm backdrop-blur
              transition hover:-translate-y-0.5 hover:shadow-md
              ${category.className}
              ${
                isActive
                  ? "ring-4 ring-[#5B4CF6]/10"
                  : ""
              }
            `}
          >
            {category.label}
          </button>
        );
      })}
    </motion.div>
  );
}