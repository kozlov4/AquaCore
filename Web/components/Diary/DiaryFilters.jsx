"use client";

import { Search, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { diaryTags } from "../../services/diaryApi";

const filters = [
  {
    label: "Всі записи",
    value: "all",
  },
  ...diaryTags,
];

export function DiaryFilters({
  search,
  setSearch,
  aquariums = [],
  selectedAquariumId,
  setSelectedAquariumId,
  selectedTag,
  setSelectedTag,
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 }}
      className="
        rounded-2xl border border-slate-100 bg-white
        p-3 shadow-sm
        sm:p-4
      "
    >
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_220px]">
        <label
          className="
            flex items-center gap-3 rounded-xl border border-slate-200
            px-4 py-3 transition focus-within:border-[#635BFF]/50
            focus-within:ring-4 focus-within:ring-[#635BFF]/10
          "
        >
          <Search size={17} className="text-slate-400" />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Пошук по нотатках, тваринах, водоростях..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
          />
        </label>

        <label className="relative">
          <select
            value={selectedAquariumId}
            onChange={(e) => setSelectedAquariumId(e.target.value)}
            className="
              w-full appearance-none rounded-xl border border-slate-200
              bg-white px-4 py-3 pr-10 text-sm font-bold text-slate-700
              outline-none transition hover:border-[#635BFF]/40
            "
          >
            <option value="all">Усі екосистеми</option>

            {aquariums.map((aquarium) => (
              <option key={aquarium.id} value={aquarium.id}>
                {aquarium.name}
              </option>
            ))}
          </select>

          <ChevronDown
            size={17}
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
          />
        </label>
      </div>

      <div className="mt-5 flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible">
        {filters.map((filter) => {
          const isActive = selectedTag === filter.value;

          return (
            <motion.button
              key={filter.value}
              type="button"
              onClick={() => setSelectedTag(filter.value)}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.96 }}
              className={`
                shrink-0 rounded-full border px-4 py-2
                text-xs font-black transition
                ${
                  isActive
                    ? "border-[#635BFF] bg-[#635BFF] text-white shadow-[0_12px_28px_rgba(99,91,255,0.28)]"
                    : "border-slate-100 bg-white text-slate-600 hover:border-[#635BFF]/30 hover:text-[#635BFF]"
                }
              `}
            >
              {filter.label}
            </motion.button>
          );
        })}
      </div>
    </motion.section>
  );
}