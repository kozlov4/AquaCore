"use client";

import { X } from "lucide-react";
import { motion } from "framer-motion";

const history = [
  {
    icon: "✅",
    title: "Планове обслуговування",
    text: "Очищення ротора та промивка губок в акваріумній воді.",
    date: "Сьогодні, 14:20",
    type: "success",
  },
  {
    icon: "🔧",
    title: "Ремонт / Поломка",
    text: "Почав сильно гудіти. Замінив керамічну вісь ротора на нову.",
    date: "12 Лютого 2026",
    type: "repair",
  },
  {
    icon: "✅",
    title: "Планове обслуговування",
    text: "Швидка промивка префільтра.",
    date: "1 Січня 2026",
    type: "success",
  },
];

export function EquipmentHistoryModal({ equipment, onClose }) {
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
        className="fixed left-1/2 top-1/2 z-50 w-[560px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[24px] bg-white shadow-[0_28px_85px_rgba(0,0,0,.34)]"
      >
        <div className="flex items-start justify-between border-b border-slate-100 px-7 py-6">
          <div>
            <h2 className="text-3xl font-black text-slate-950">
              Історія обслуговування
            </h2>
            <p className="mt-1 text-base text-slate-500">{equipment.name}</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <X size={22} />
          </button>
        </div>

        <div>
          {history.map((item) => (
            <div
              key={`${item.title}-${item.date}`}
              className="flex gap-5 border-b border-slate-100 px-7 py-6 last:border-b-0"
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg ${
                  item.type === "success" ? "bg-green-50" : "bg-yellow-50"
                }`}
              >
                {item.icon}
              </div>

              <div>
                <h3 className="text-xl font-black text-slate-950">
                  {item.title}
                </h3>
                <p className="mt-2 text-base text-slate-500">{item.text}</p>
                <p className="mt-4 text-sm font-bold text-slate-400">
                  {item.date}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-slate-50 px-7 py-5">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-xl border border-slate-200 bg-white px-5 py-3 text-base font-black text-slate-600 transition hover:border-[#635BFF]/40 hover:text-[#635BFF]"
          >
            Закрити
          </button>
        </div>
      </motion.div>
    </>
  );
}