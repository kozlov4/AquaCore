"use client";

import { useState } from "react";
import { Filter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Sidebar } from "../Profile/Sidebar";
import { TimelineTopFilters } from "./TimelineTopFilters";
import { TimelineEventCard } from "./TimelineEventCard";
import { TimelineFiltersModal } from "./TimelineFiltersModal";

const events = [
  {
    id: 1,
    type: "water",
    title: "Записано нові параметри води",
    text: "Система зафіксувала стабільні показники.",
    date: "Сьогодні, 10:30",
    icon: "💧",
    color: "blue",
    data: ["pH 7.2", "GH: 8", "NH3: 0.0"],
  },
  {
    id: 2,
    type: "population",
    title: "Заселення нових жителів",
    text: "Неон звичайний • 10 шт",
    subtext: "Paracheirodon innesi",
    date: "23 Квіт, 18:45",
    icon: "🐟",
    color: "violet",
  },
  {
    id: 3,
    type: "alert",
    title: "Температурна аномалія",
    text: "Зафіксовано різке падіння температури до 21°C. Було згенеровано автоматичне системне попередження.",
    date: "18 Квітня, 08:15",
    icon: "🚨",
    color: "red",
  },
  {
    id: 4,
    type: "equipment",
    title: "Нове обладнання",
    text: "Додано зовнішній фільтр Tetra EX 800 Plus.",
    date: "10 Жовтня 2025",
    icon: "⚙️",
    color: "gray",
  },
  {
    id: 5,
    type: "system",
    title: "Екосистему засновано!",
    text: 'Акваріум "Головний Травник" (60 Л) успішно створено в системі.',
    date: "12 Жовтня 2023",
    icon: "🏆",
    color: "yellow",
  },
];

export function Timeline() {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [activeType, setActiveType] = useState("Усі події");

  return (
    <div className="min-h-screen bg-white">
      <Sidebar />

      <main className="ml-[88px] px-16 py-10">
        <div className="mx-auto max-w-[760px]">
          <motion.header
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 flex items-start justify-between"
          >
            <div>
              <h1 className="text-3xl font-black text-slate-950">
                Хронологія екосистеми
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                Автоматичний журнал системних подій та змін
              </p>
            </div>

            <motion.button
              type="button"
              onClick={() => setIsFiltersOpen(true)}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.96 }}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition hover:border-[#635BFF]/40 hover:text-[#635BFF]"
            >
              <Filter size={16} />
              Фільтри
            </motion.button>
          </motion.header>

          <TimelineTopFilters
            activeType={activeType}
            setActiveType={setActiveType}
          />

          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative mt-8 space-y-5"
          >
            <div className="absolute left-[26px] top-0 h-full w-px bg-slate-200" />

            {events.map((event, index) => (
              <TimelineEventCard key={event.id} event={event} index={index} />
            ))}
          </motion.section>
        </div>
      </main>

      <AnimatePresence>
        {isFiltersOpen && (
          <TimelineFiltersModal onClose={() => setIsFiltersOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}