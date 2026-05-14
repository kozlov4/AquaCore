"use client";

import { motion } from "framer-motion";

const sortOptions = ["Нові спочатку", "Найкращий рейтинг", "Найнижчий рейтинг"];

export function ReviewsFilter({
  selectedRating,
  setSelectedRating,
  selectedSort,
  setSelectedSort,
}) {
  return (
    <motion.aside
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35 }}
      className="
        h-fit w-full rounded-2xl border border-gray-100
        bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.06)]
        lg:sticky lg:top-8 lg:w-[230px] lg:shrink-0
      "
    >
      <h3 className="mb-5 text-lg font-bold text-[#171827] sm:mb-6">
        Фільтр
      </h3>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:block">
        <div className="lg:mb-8">
          <p className="mb-3 text-sm font-semibold text-[#171827]">
            Оцінка
          </p>

          {[5, 4, 3, 2].map((rating) => (
            <label
              key={rating}
              className="
                mb-2 flex cursor-pointer items-center gap-2
                text-sm text-[#171827] transition hover:text-[#5B4CF6]
              "
            >
              <input
                type="radio"
                name="rating"
                checked={selectedRating === rating}
                onChange={() => setSelectedRating(rating)}
                className="accent-[#5B4CF6]"
              />

              <span className="text-orange-500">{"★".repeat(rating)}</span>
              <span>і вище</span>
            </label>
          ))}

          <label className="mt-3 flex cursor-pointer items-center gap-2 text-sm text-[#171827] transition hover:text-[#5B4CF6]">
            <input
              type="radio"
              name="rating"
              checked={selectedRating === 0}
              onChange={() => setSelectedRating(0)}
              className="accent-[#5B4CF6]"
            />

            <span>Усі оцінки</span>
          </label>
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold text-[#171827]">
            Сортувати за
          </p>

          {sortOptions.map((item) => (
            <label
              key={item}
              className="
                mb-2 flex cursor-pointer items-center gap-2
                text-sm text-[#171827] transition hover:text-[#5B4CF6]
              "
            >
              <input
                type="radio"
                name="sort"
                checked={selectedSort === item}
                onChange={() => setSelectedSort(item)}
                className="accent-[#5B4CF6]"
              />

              {item}
            </label>
          ))}
        </div>
      </div>
    </motion.aside>
  );
}