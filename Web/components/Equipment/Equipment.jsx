"use client";

import { useState } from "react";
import { Plus, ChevronDown, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Sidebar } from "../Profile/Sidebar";
import { EquipmentCard } from "./EquipmentCard";
import { AddEquipmentInventoryModal } from "./AddEquipmentInventoryModal";
import { EquipmentHistoryModal } from "./EquipmentHistoryModal";

const equipmentList = [
  {
    id: 1,
    icon: "🌀",
    category: "Фільтрація",
    name: "Tetra EX 800 Plus",
    installed: "12 Жовтня 2024",
    power: "800 Л/год",
    service: "Очищення ротора та губок",
    daysLeft: "Залишилося 20 днів",
    progress: 65,
    status: "normal",
  },
  {
    id: 2,
    icon: "💡",
    category: "Освітлення",
    name: "Chihiros WRGB II",
    installed: "1 Січня 2025",
    power: "8 годин",
    service: "Очищення від нальоту",
    daysLeft: "Залишилося 3 дні",
    progress: 85,
    status: "warning",
  },
  {
    id: 3,
    icon: "🌡️",
    category: "Температура",
    name: "Eheim Thermocontrol",
    installed: "5 Березня 2026",
    power: "25°C",
    service: "Не потребує регулярного обслуговування",
    daysLeft: "",
    progress: 0,
    status: "inactive",
  },
];

export function Equipment() {
  const [items, setItems] = useState(equipmentList);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [historyItem, setHistoryItem] = useState(null);

  const addEquipment = (device) => {
    setItems((prev) => [
      {
        id: Date.now(),
        icon:
          device.category.includes("Фільтрація")
            ? "🌀"
            : device.category.includes("Освітлення")
            ? "💡"
            : device.category.includes("Обігрів")
            ? "🌡️"
            : "⚙️",
        category: device.category,
        name: device.model,
        installed: device.date,
        power: "—",
        service: `Обслуговування кожні ${device.service}`,
        daysLeft: "Нове обладнання",
        progress: 15,
        status: "normal",
      },
      ...prev,
    ]);
  };

  return (
    <div className="min-h-screen bg-white">
      <Sidebar />

      <main className="ml-[88px] px-16 py-12">
        <div className="mx-auto max-w-[980px]">
          <motion.header
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 flex items-start justify-between"
          >
            <div>
              <h1 className="text-3xl font-black text-slate-950">
                Обладнання та Інвентар
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                Контролюйте стан техніки та графіки її обслуговування
              </p>
            </div>

            <motion.button
              type="button"
              onClick={() => setIsAddOpen(true)}
              whileHover={{ y: -2, boxShadow: "0 16px 35px rgba(99,91,255,.3)" }}
              whileTap={{ scale: 0.96 }}
              className="flex items-center gap-2 rounded-xl bg-[#635BFF] px-6 py-3 text-sm font-black text-white transition hover:bg-[#5147f5]"
            >
              <Plus size={18} />
              Додати пристрій
            </motion.button>
          </motion.header>

          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 grid grid-cols-[1fr_1fr_1.6fr] gap-5"
          >
            <button className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-sm font-black text-slate-800">
              Головний Травник &#40;60 Л&#41;
              <ChevronDown size={16} className="text-slate-400" />
            </button>

            <button className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-sm font-black text-slate-700">
              Усе обладнання
              <ChevronDown size={16} className="text-slate-400" />
            </button>

            <div className="flex items-start gap-4 rounded-2xl border border-yellow-200 bg-yellow-50 px-5 py-4">
              <AlertTriangle size={22} className="mt-1 text-yellow-600" />
              <div className="flex-1">
                <p className="text-sm font-black text-yellow-800">
                  Потребує уваги &#40;1&#41;
                </p>
                <p className="mt-1 text-xs leading-5 text-yellow-700">
                  Лампа Chihiros WRGB II відпрацювала 85% свого ресурсу до
                  планової очистки радіаторів.
                </p>
              </div>
              <button className="rounded-lg bg-yellow-100 px-4 py-2 text-xs font-black text-yellow-800 transition hover:bg-yellow-200">
                Обслужити
              </button>
            </div>
          </motion.section>

          <motion.section
            layout
            className="grid grid-cols-1 gap-5 md:grid-cols-3"
          >
            {items.map((item, index) => (
              <EquipmentCard
                key={item.id}
                item={item}
                index={index}
                onHistory={() => setHistoryItem(item)}
              />
            ))}

            <motion.button
              type="button"
              onClick={() => setIsAddOpen(true)}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
              className="flex min-h-[190px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#C7D2FE] bg-slate-50 text-center transition hover:border-[#635BFF] hover:bg-[#635BFF]/5"
            >
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white text-3xl text-[#635BFF] shadow-sm">
                +
              </div>
              <p className="text-sm font-black text-[#635BFF]">
                Додати обладнання
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Фільтр, світло, CO2 або обігрівач
              </p>
            </motion.button>
          </motion.section>
        </div>
      </main>

      <AnimatePresence>
        {isAddOpen && (
          <AddEquipmentInventoryModal
            onClose={() => setIsAddOpen(false)}
            onSave={addEquipment}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {historyItem && (
          <EquipmentHistoryModal
            equipment={historyItem}
            onClose={() => setHistoryItem(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}