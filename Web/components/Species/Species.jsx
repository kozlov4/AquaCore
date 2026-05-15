"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { motion } from "framer-motion";
import { Sidebar } from "../Profile/Sidebar";
import { SpeciesCard } from "./SpeciesCard";
import { SpeciesDropdown } from "./SpeciesDropdown";
import { SpeciesAdvancedFiltersModal } from "./SpeciesAdvancedFiltersModal";
import { useSpecies } from "../../hooks/useSpecies";

const categoryOptions = [
  { label: "Усі категорії", value: "all" },
  { label: "Риби", value: "Риби" },
  { label: "Рослини", value: "Рослини" },
  { label: "Безхребетні", value: "Безхребетні" },
];

const waterOptions = [
  { label: "Будь-яка вода", value: "all" },
  { label: "Прісна", value: "Прісна" },
  { label: "Морська", value: "Морська" },
];

const characterOptions = [
  { label: "Усі види", value: "all" },
  { label: "Мирні", value: "Мирні" },
  { label: "Хижаки", value: "Хижаки" },
  { label: "Територіальні", value: "Територіальні" },
];

export function Species() {
  const species = useSpecies();

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#F8FAFF]">
      <Sidebar />

      <main
        className="
          px-4 pb-28 pt-6
          sm:px-6 sm:pb-32 sm:pt-8
          lg:ml-[88px] lg:px-16 lg:py-12
        "
      >
        <div className="mx-auto max-w-[1180px]">
          <motion.header
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-8"
          >
            <p className="mb-2 text-sm font-black text-[#635BFF]">
              Акваріумна база знань
            </p>

            <h1 className="text-3xl font-black text-slate-950 sm:text-5xl">
              Енциклопедія видів
            </h1>

            <p className="mt-3 max-w-[620px] text-sm leading-6 text-slate-500">
              Знайдіть риб, рослини або безхребетних для своєї екосистеми.
            </p>
          </motion.header>

          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="rounded-3xl border border-white/80 bg-white p-4 shadow-sm"
          >
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_180px_180px_180px_auto]">
              <label
                className="
                  flex items-center gap-3 rounded-xl border border-slate-200
                  px-4 py-3 transition focus-within:border-[#635BFF]/50
                  focus-within:ring-4 focus-within:ring-[#635BFF]/10
                "
              >
                <Search size={17} className="text-slate-400" />

                <input
                  value={species.searchValue}
                  onChange={(event) => species.setSearchValue(event.target.value)}
                  placeholder="Пошук за назвою або латинською назвою..."
                  className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                />
              </label>

              <SpeciesDropdown
                value={species.category}
                onChange={species.setCategory}
                options={categoryOptions}
              />

              <SpeciesDropdown
                value={species.waterType}
                onChange={species.setWaterType}
                options={waterOptions}
              />

              <SpeciesDropdown
                value={species.character}
                onChange={species.setCharacter}
                options={characterOptions}
              />

              <button
                type="button"
                onClick={() => species.setIsFiltersOpen(true)}
                className="
                  flex items-center justify-center gap-2 rounded-xl
                  px-4 py-3 text-sm font-black text-[#635BFF]
                  transition hover:bg-[#635BFF]/10
                "
              >
                <SlidersHorizontal size={17} />
                Всі фільтри
              </button>
            </div>
          </motion.section>

          {species.speciesError && (
            <p className="mt-6 rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm font-bold text-red-500">
              {species.speciesError}
            </p>
          )}

          {species.isLoading && (
            <p className="mt-6 rounded-2xl border border-slate-100 bg-white px-5 py-4 text-sm font-bold text-slate-500">
              Завантаження видів...
            </p>
          )}

          {!species.isLoading && species.filteredSpecies.length === 0 && (
            <div className="mt-8 rounded-3xl border border-slate-100 bg-white p-10 text-center">
              <p className="text-5xl">🔎</p>
              <h3 className="mt-4 text-xl font-black text-slate-950">
                Нічого не знайдено
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                Спробуйте змінити пошук або фільтри.
              </p>
            </div>
          )}

          <motion.section
            layout
            className="
              mt-8 grid grid-cols-1 gap-6
              sm:grid-cols-2
              xl:grid-cols-4
            "
          >
            {species.filteredSpecies.map((item, index) => (
              <SpeciesCard key={item.id} item={item} index={index} />
            ))}
          </motion.section>
        </div>
      </main>

      <SpeciesAdvancedFiltersModal
        isOpen={species.isFiltersOpen}
        onClose={() => species.setIsFiltersOpen(false)}
        category={species.category}
        setCategory={species.setCategory}
        waterType={species.waterType}
        setWaterType={species.setWaterType}
        character={species.character}
        setCharacter={species.setCharacter}
      />
    </div>
  );
}