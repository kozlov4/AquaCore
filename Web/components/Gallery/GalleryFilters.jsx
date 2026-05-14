"use client";

import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

const categories = [
  "Всі фотографії",
  "Загальний план",
  "Рослини",
  "Жителі",
  "Інше",
];

export function GalleryFilters({
  aquariums = [],
  selectedAquariumName,
  setSelectedAquariumName,
  selectedCategory,
  setSelectedCategory,
  sortOrder,
  setSortOrder,
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 }}
      className="
        rounded-2xl border border-slate-100
        bg-white p-3 shadow-sm
        sm:p-4
      "
    >
      <div
        className="
          flex flex-col gap-3
          lg:flex-row lg:items-center lg:justify-between
        "
      >
        <div
          className="
            grid grid-cols-1 gap-3
            sm:grid-cols-2
            lg:flex
          "
        >
          <label className="relative">
            <select
              value={selectedAquariumName}
              onChange={(e) => setSelectedAquariumName(e.target.value)}
              className="
                w-full appearance-none rounded-xl border border-slate-200
                bg-white px-4 py-3 pr-10 text-sm font-bold text-slate-800
                outline-none transition hover:border-[#635BFF]/40
                lg:min-w-[220px]
              "
            >
              <option value="Усі акваріуми">Усі акваріуми</option>

              {aquariums.map((aquarium) => (
                <option key={aquarium.id} value={aquarium.name}>
                  {aquarium.name}
                </option>
              ))}
            </select>

            <ChevronDown
              size={17}
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
          </label>

          <label className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="
                w-full appearance-none rounded-xl border border-slate-200
                bg-white px-4 py-3 pr-10 text-sm font-bold text-slate-800
                outline-none transition hover:border-[#635BFF]/40
                lg:min-w-[180px]
              "
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <ChevronDown
              size={17}
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
          </label>
        </div>

        <div className="grid grid-cols-2 rounded-xl bg-slate-100 p-1 sm:flex">
          <button
            type="button"
            onClick={() => setSortOrder("newest")}
            className={`
              rounded-lg px-4 py-2 text-xs font-black transition
              ${
                sortOrder === "newest"
                  ? "bg-white text-slate-950 shadow-sm"
                  : "text-slate-400 hover:text-slate-700"
              }
            `}
          >
            Найновіші
          </button>

          <button
            type="button"
            onClick={() => setSortOrder("oldest")}
            className={`
              rounded-lg px-4 py-2 text-xs font-black transition
              ${
                sortOrder === "oldest"
                  ? "bg-white text-slate-950 shadow-sm"
                  : "text-slate-400 hover:text-slate-700"
              }
            `}
          >
            Найстаріші
          </button>
        </div>
      </div>
    </motion.section>
  );
}