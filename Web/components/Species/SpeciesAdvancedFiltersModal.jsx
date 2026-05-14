"use client";

import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SpeciesDropdown } from "./SpeciesDropdown";

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

export function SpeciesAdvancedFiltersModal({
  isOpen,
  onClose,
  category,
  setCategory,
  waterType,
  setWaterType,
  character,
  setCharacter,
}) {
  const resetFilters = () => {
    setCategory("all");
    setWaterType("all");
    setCharacter("all");
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ duration: 0.24, ease: "easeOut" }}
            className="
              fixed left-1/2 top-1/2 z-50
              w-[calc(100%-28px)] max-w-[460px]
              -translate-x-1/2 -translate-y-1/2
              rounded-2xl bg-white p-6
              shadow-[0_28px_85px_rgba(0,0,0,0.34)]
            "
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-slate-950">
                Фільтри видів
              </h2>

              <button
                type="button"
                onClick={onClose}
                className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-950"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <p className="mb-2 text-xs font-black uppercase text-slate-500">
                  Категорія
                </p>
                <SpeciesDropdown
                  value={category}
                  onChange={setCategory}
                  options={categoryOptions}
                />
              </div>

              <div>
                <p className="mb-2 text-xs font-black uppercase text-slate-500">
                  Тип води
                </p>
                <SpeciesDropdown
                  value={waterType}
                  onChange={setWaterType}
                  options={waterOptions}
                />
              </div>

              <div>
                <p className="mb-2 text-xs font-black uppercase text-slate-500">
                  Характер
                </p>
                <SpeciesDropdown
                  value={character}
                  onChange={setCharacter}
                  options={characterOptions}
                />
              </div>
            </div>

            <div className="mt-7 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={resetFilters}
                className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-black text-slate-600 transition hover:bg-slate-50"
              >
                Скинути
              </button>

              <button
                type="button"
                onClick={onClose}
                className="rounded-xl bg-[#635BFF] px-4 py-3 text-sm font-black text-white transition hover:bg-[#5147f5]"
              >
                Застосувати
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}