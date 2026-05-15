"use client";

import { useState } from "react";
import { X, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

const categories = ["🌀 Фільтрація", "💡 Освітлення", "🌡️ Обігрів", "⚙️ Інше"];

export function AddEquipmentInventoryModal({ onClose, onSave }) {
  const [aquarium, setAquarium] = useState("Головний Травник (60 Л)");
  const [category, setCategory] = useState("🌀 Фільтрація");
  const [model, setModel] = useState("");
  const [date, setDate] = useState("2026-04-24");
  const [service, setService] = useState("Кожні 30 днів");

  const handleSave = () => {
    if (!model.trim()) return;

    onSave?.({
      aquarium,
      category,
      model,
      date,
      service,
    });

    onClose();
  };

  return (
    <>
      <motion.div
        className="fixed inset-0 z-40 bg-black/65 backdrop-blur-sm"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 26 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 16 }}
        transition={{ duration: 0.24 }}
        className="fixed left-1/2 top-1/2 z-50 w-[500px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[24px] bg-white shadow-[0_28px_85px_rgba(0,0,0,.34)]"
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <h2 className="text-2xl font-black text-slate-950">
            Нове обладнання
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <X size={22} />
          </button>
        </div>

        <div className="space-y-5 px-6 py-6">
          <div>
            <label className="mb-2 block text-sm font-black text-slate-700">
              Для якої екосистеми?
            </label>

            <button className="flex w-full items-center justify-between rounded-xl border border-slate-300 px-4 py-3 text-sm font-black text-slate-900">
              {aquarium}
              <ChevronDown size={18} className="text-slate-400" />
            </button>
          </div>

          <div>
            <p className="mb-2 text-sm font-black text-slate-700">
              Категорія
            </p>

            <div className="flex flex-wrap gap-2">
              {categories.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setCategory(item)}
                  className={`rounded-xl border px-3 py-2 text-sm font-bold transition ${
                    category === item
                      ? "border-[#635BFF] bg-[#635BFF] text-white"
                      : "border-slate-200 text-slate-600 hover:border-[#635BFF]/40"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-black text-slate-700">
              Бренд та Модель
            </label>

            <input
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="Напр. Tetra EX 800 Plus"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#635BFF] focus:ring-4 focus:ring-[#635BFF]/10"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-black text-slate-700">
                Дата установки
              </label>

              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm font-black outline-none transition focus:border-[#635BFF] focus:ring-4 focus:ring-[#635BFF]/10"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-black text-slate-700">
                Обслуговування
              </label>

              <button className="flex w-full items-center justify-between rounded-xl border border-slate-300 px-4 py-3 text-sm font-black text-slate-900">
                {service}
                <ChevronDown size={18} className="text-slate-400" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-5 bg-slate-50 px-6 py-5">
          <button
            type="button"
            onClick={onClose}
            className="text-sm font-black text-slate-600 transition hover:text-slate-950"
          >
            Скасувати
          </button>

          <motion.button
            type="button"
            onClick={handleSave}
            whileHover={{
              y: -2,
              boxShadow: "0 14px 28px rgba(99,91,255,.32)",
            }}
            whileTap={{ scale: 0.96 }}
            className="rounded-xl bg-[#635BFF] px-6 py-3 text-sm font-black text-white transition hover:bg-[#5147f5]"
          >
            Додати пристрій
          </motion.button>
        </div>
      </motion.div>
    </>
  );
}