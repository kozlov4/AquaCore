"use client";

import { motion } from "framer-motion";

const sortOptions = ["Нові спочатку", "Найкращий рейтинг", "Найнижчий рейтинг"];

export function ReviewsFilter() {
  return (
    <motion.aside
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35 }}
      className="sticky top-8 h-fit w-[230px] shrink-0 rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.06)]"
    >
      <h3 className="mb-6 text-lg font-bold text-[#171827]">Фільтр</h3>

      <div className="mb-8">
        <p className="mb-3 text-sm font-semibold text-[#171827]">Оцінка</p>

        {[5, 4, 3, 2].map((rating, index) => (
          <label
            key={rating}
            className="mb-2 flex cursor-pointer items-center gap-2 text-sm text-[#171827] transition hover:text-[#5B4CF6]"
          >
            <input
              type="radio"
              name="rating"
              defaultChecked={index === 0}
              className="accent-[#5B4CF6]"
            />

            <span className="text-orange-500">{"★".repeat(rating)}</span>
            <span>і вище</span>
          </label>
        ))}
      </div>

      <div>
        <p className="mb-3 text-sm font-semibold text-[#171827]">
          Сортувати за
        </p>

        {sortOptions.map((item, index) => (
          <label
            key={item}
            className="mb-2 flex cursor-pointer items-center gap-2 text-sm text-[#171827] transition hover:text-[#5B4CF6]"
          >
            <input
              type="radio"
              name="sort"
              defaultChecked={index === 0}
              className="accent-[#5B4CF6]"
            />

            {item}
          </label>
        ))}
      </div>
    </motion.aside>
  );
}