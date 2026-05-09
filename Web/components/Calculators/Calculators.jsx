"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Sidebar } from "../Profile/Sidebar";
import { CalculatorCard } from "./CalculatorCard";
import { CalculatorFilters } from "./CalculatorFilters";
import { VolumeWeightCalculatorModal } from "./VolumeWeightCalculatorModal";
import { GroundCalculatorModal } from "./GroundCalculatorModal";
import { LightCalculatorModal } from "./LightCalculatorModal";
import { Co2CalculatorModal } from "./Co2CalculatorModal";
import { GlassCalculatorModal } from "./GlassCalculatorModal";
import { HeaterCalculatorModal } from "./HeaterCalculatorModal";

const calculators = [
  {
    id: 1,
    title: "Обʼєм та Вага",
    description:
      "Розрахунок чистого літражу акваріума та його приблизної ваги з водою для вибору тумби.",
    icon: "📐",
    category: "Базові розміри",
    accent: "blue",
    modal: "volume",
  },
  {
    id: 2,
    title: "Кількість ґрунту",
    description:
      "Дізнайтеся, скільки кілограмів або літрів ґрунту потрібно купити для створення ідеального шару.",
    icon: "🪨",
    category: "Базові розміри",
    accent: "yellow",
    modal: "ground",
  },
  {
    id: 3,
    title: "Потужність освітлення",
    description:
      "Підбір правильної кількості люменів або Ват на літр для травників чи рибних акваріумів.",
    icon: "💡",
    category: "Обладнання",
    accent: "yellow",
    modal: "light",
  },
  {
    id: 4,
    title: "Концентрація CO2",
    description:
      "Математичний розрахунок рівня розчиненого вуглекислого газу на основі показників pH та KH.",
    icon: "🧪",
    category: "Хімія та Добрива",
    accent: "green",
    modal: "co2",
  },
  {
    id: 5,
    title: "Товщина скла",
    description:
      "Калькулятор безпеки: визначте правильну товщину скла для склейки акваріума за вашими розмірами.",
    icon: "🧊",
    category: "Базові розміри",
    accent: "cyan",
    modal: "glass",
  },
  {
    id: 6,
    title: "Потужність обігрівача",
    description:
      "Скільки Ват потрібно для підтримки стабільної температури залежно від прохолоди у кімнаті.",
    icon: "🌡️",
    category: "Обладнання",
    accent: "red",
    modal: "heater",
  },
];

export function Calculators() {
  const [searchValue, setSearchValue] = useState("");
  const [activeCategory, setActiveCategory] = useState("Усі інструменти");
  const [activeModal, setActiveModal] = useState(null);

  const filteredCalculators = useMemo(() => {
    const value = searchValue.trim().toLowerCase();

    return calculators.filter((calculator) => {
      const matchesSearch =
        !value ||
        calculator.title.toLowerCase().includes(value) ||
        calculator.description.toLowerCase().includes(value) ||
        calculator.category.toLowerCase().includes(value);

      const matchesCategory =
        activeCategory === "Усі інструменти" ||
        calculator.category === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchValue, activeCategory]);

  const closeModal = () => setActiveModal(null);

  return (
    <div className="min-h-screen bg-white">
      <Sidebar />

      <main className="ml-[88px] px-16 py-12">
        <div className="mx-auto max-w-[980px]">
          <motion.header
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-black text-slate-950">
              Банк калькуляторів
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Швидкі математичні інструменти для точних розрахунків
            </p>
          </motion.header>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"
          >
            <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 transition focus-within:border-[#635BFF] focus-within:ring-4 focus-within:ring-[#635BFF]/10">
              <Search size={18} className="text-slate-400" />

              <input
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Знайти калькулятор..."
                className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
              />
            </div>
          </motion.div>

          <CalculatorFilters
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
          />

          <motion.section
            layout
            className="mt-7 grid grid-cols-1 gap-5 md:grid-cols-3"
          >
            {filteredCalculators.map((calculator, index) => (
              <CalculatorCard
                key={calculator.id}
                calculator={calculator}
                index={index}
                onOpen={() => setActiveModal(calculator.modal)}
              />
            ))}
          </motion.section>
        </div>
      </main>

      <AnimatePresence>
        {activeModal === "volume" && (
          <VolumeWeightCalculatorModal isOpen onClose={closeModal} />
        )}
        {activeModal === "ground" && <GroundCalculatorModal onClose={closeModal} />}
        {activeModal === "light" && <LightCalculatorModal onClose={closeModal} />}
        {activeModal === "co2" && <Co2CalculatorModal onClose={closeModal} />}
        {activeModal === "glass" && <GlassCalculatorModal onClose={closeModal} />}
        {activeModal === "heater" && <HeaterCalculatorModal onClose={closeModal} />}
      </AnimatePresence>
    </div>
  );
}