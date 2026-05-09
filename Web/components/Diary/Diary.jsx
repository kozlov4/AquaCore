"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Sidebar } from "../Profile/Sidebar";
import { DiaryFilters } from "./DiaryFilters";
import { DiaryCard } from "./DiaryCard";
import { AddDiaryEntryModal } from "./AddDiaryEntryModal";

const initialEntries = [
  {
    id: 1,
    date: "24 Квітня 2026",
    aquarium: "Головний Травник",
    title: "Дивна поведінка Анциструса",
    text: "Сьогодні помітив, що сом постійно сидить біля фільтра і швидко дихає. Аерація включена на максимум, інші риби почуваються нормально.",
    tag: "спостереження",
    tagColor: "red",
  },
  {
    id: 2,
    date: "18 Квітня 2026",
    aquarium: "Креветочник",
    title: "Поява нових водоростей",
    text: "На листях Анубіаса зʼявилися чорні точки. Схоже на вʼєтнамку. Зменшив світловий день до 6 годин і додав профілактику.",
    tag: "рослини",
    tagColor: "green",
    image: true,
  },
  {
    id: 3,
    date: "1 Січня 2026",
    aquarium: "",
    title: "Схема внесення добрив (Базова)",
    text: "1. Понеділок: Макро (2 мл)\n2. Середа: Мікро (1 мл) + Залізо\n3. Пʼятниця: Калій\nСвітло: 14:00 - 22:00.",
    tag: "рутина",
    tagColor: "gray",
    pinned: true,
  },
];

export function Diary() {
  const [entries, setEntries] = useState(initialEntries);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const addEntry = (entry) => {
    setEntries((prev) => [
      {
        id: Date.now(),
        ...entry,
      },
      ...prev,
    ]);
  };

  return (
    <div className="min-h-screen bg-white">
      <Sidebar />

      <main className="ml-[88px] px-16 py-10">
        <div className="mx-auto max-w-[1120px]">
          <motion.header
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 flex items-start justify-between"
          >
            <div>
              <h1 className="text-3xl font-black text-slate-950">
                Щоденник спостережень
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                Зберігайте важливі моменти та аналізуйте поведінку екосистеми
              </p>
            </div>

            <motion.button
              type="button"
              onClick={() => setIsModalOpen(true)}
              whileHover={{
                y: -2,
                boxShadow: "0 16px 35px rgba(99,91,255,0.32)",
              }}
              whileTap={{ scale: 0.96 }}
              className="flex items-center gap-2 rounded-xl bg-[#635BFF] px-6 py-3 text-sm font-black text-white transition hover:bg-[#5147f5]"
            >
              <Pencil size={17} />
              Новий запис
            </motion.button>
          </motion.header>

          <DiaryFilters />

          <motion.section
            layout
            className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3"
          >
            {entries.map((entry, index) => (
              <DiaryCard key={entry.id} entry={entry} index={index} />
            ))}
          </motion.section>
        </div>
      </main>

      <AnimatePresence>
        {isModalOpen && (
          <AddDiaryEntryModal
            onClose={() => setIsModalOpen(false)}
            onSave={addEntry}
          />
        )}
      </AnimatePresence>
    </div>
  );
}