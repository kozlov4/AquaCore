"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Sidebar } from "../Profile/Sidebar";
import { SpeciesCard } from "./SpeciesCard";
import { SpeciesDropdown } from "./SpeciesDropdown";
import { SpeciesAdvancedFiltersModal } from "./SpeciesAdvancedFiltersModal";

const species = [
  {
    id: 1,
    name: "Неон звичайний",
    latin: "Paracheirodon innesi",
    icon: "🐟",
    category: "Риби",
    water: "Прісна",
    character: "Мирні",
    tags: ["від 20 л", "Мирна"],
  },
  {
    id: 2,
    name: "Астронотус (Оскар)",
    latin: "Astronotus ocellatus",
    icon: "🐠",
    category: "Риби",
    water: "Прісна",
    character: "Хижаки",
    tags: ["від 250 л", "Хижак"],
  },
  {
    id: 3,
    name: "Анубіас нана",
    latin: "Anubias barteri var. nana",
    icon: "🌿",
    category: "Рослини",
    water: "Прісна",
    character: "Мирні",
    tags: ["Слабке світло", "Без CO2"],
  },
  {
    id: 4,
    name: "Креветка Амано",
    latin: "Caridina multidentata",
    icon: "🦐",
    category: "Безхребетні",
    water: "Прісна",
    character: "Мирні",
    tags: ["від 10 л", "Водоростей"],
  },
  {
    id: 5,
    name: "Неон звичайний",
    latin: "Paracheirodon innesi",
    icon: "🐟",
    category: "Риби",
    water: "Прісна",
    character: "Мирні",
    tags: ["від 20 л", "Мирна"],
  },
  {
    id: 6,
    name: "Астронотус (Оскар)",
    latin: "Astronotus ocellatus",
    icon: "🐠",
    category: "Риби",
    water: "Прісна",
    character: "Хижаки",
    tags: ["від 250 л", "Хижак"],
  },
  {
    id: 7,
    name: "Анубіас нана",
    latin: "Anubias barteri var. nana",
    icon: "🌿",
    category: "Рослини",
    water: "Прісна",
    character: "Мирні",
    tags: ["Слабке світло", "Без CO2"],
  },
  {
    id: 8,
    name: "Креветка Амано",
    latin: "Caridina multidentata",
    icon: "🦐",
    category: "Безхребетні",
    water: "Прісна",
    character: "Мирні",
    tags: ["від 10 л", "Водоростей"],
  },
];

export function Species() {
  const [searchValue, setSearchValue] = useState("");
  const [category, setCategory] = useState("Риби");
  const [waterType, setWaterType] = useState("Прісна");
  const [character, setCharacter] = useState("Усі види");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const filteredSpecies = useMemo(() => {
    return species.filter((item) => {
      const search = searchValue.trim().toLowerCase();

      const matchesSearch =
        !search ||
        item.name.toLowerCase().includes(search) ||
        item.latin.toLowerCase().includes(search);

      const matchesCategory = category === "Усі риби" || item.category === category;
      const matchesWater = waterType === "Будь-яка вода" || item.water === waterType;
      const matchesCharacter =
        character === "Усі види" || item.character === character;

      return matchesSearch && matchesCategory && matchesWater && matchesCharacter;
    });
  }, [searchValue, category, waterType, character]);

  return (
    <div className="min-h-screen bg-white">
      <Sidebar />

      <main className="ml-[88px] px-12 py-8">
        <div className="mx-auto max-w-[1180px]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="mb-8 flex items-start justify-between"
          >
            <div>
              <h1 className="text-3xl font-black tracking-tight text-slate-950">
                Енциклопедія видів
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Знайдіть ідеальних жителів для вашої екосистеми
              </p>
            </div>

            <div className="flex w-[370px] items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition focus-within:border-[#635BFF] focus-within:ring-4 focus-within:ring-[#635BFF]/10">
              <Search size={18} className="text-slate-400" />

              <input
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Пошук за назвою..."
                className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
              />
            </div>
          </motion.div>

          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.35 }}
            className="mb-8 rounded-2xl border border-slate-100 bg-white p-3 shadow-sm"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="grid flex-1 grid-cols-3 gap-3">
                <SpeciesDropdown
                  label="Категорія"
                  value={category}
                  options={[
                    "Риби",
                    "Рослини",
                    "Безхребетні",
                    "Земноводні",
                  ]}
                  onChange={setCategory}
                />

                <SpeciesDropdown
                  label="Тип води"
                  value={waterType}
                  options={[
                    "Будь-яка вода",
                    "Прісна",
                    "Морська",
                    "Солонувата (Brackish)",
                  ]}
                  onChange={setWaterType}
                />

                <SpeciesDropdown
                  label="Характер"
                  value={character}
                  options={[
                    "Усі види",
                    "Мирні",
                    "Територіальні",
                    "Хижаки",
                  ]}
                  onChange={setCharacter}
                />
              </div>

              <button
                type="button"
                onClick={() => setIsFiltersOpen(true)}
                className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-[#635BFF] transition hover:bg-[#635BFF]/10"
              >
                <SlidersHorizontal size={17} />
                Всі фільтри
              </button>
            </div>
          </motion.section>

          <motion.section
            layout
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {filteredSpecies.map((item, index) => (
              <SpeciesCard key={item.id} item={item} index={index} />
            ))}
          </motion.section>
        </div>
      </main>

      <AnimatePresence>
        {isFiltersOpen && (
          <SpeciesAdvancedFiltersModal
            onClose={() => setIsFiltersOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}