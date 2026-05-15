"use client";

import { Trash2, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { Sidebar } from "../Profile/Sidebar";
import { CompatibilityItem } from "./CompatibilityItem";
import { CompatibilityResult } from "./CompatibilityResult";

const selectedSpecies = [
  {
    id: 1,
    icon: "🐟",
    name: "Астронотус (Оскар)",
    latin: "Astronotus ocellatus",
    type: "ХИЖАК",
    size: "до 35 см",
    count: 1,
    danger: true,
  },
  {
    id: 2,
    icon: "🐠",
    name: "Неон звичайний",
    latin: "Paracheirodon innesi",
    type: "МИРНА",
    size: "до 4 см",
    count: 15,
    danger: false,
  },
];

export function Compatibility() {
  return (
    <div className="min-h-screen bg-white">
      <Sidebar />

      <main className="ml-[88px] px-16 py-12">
        <div className="mx-auto max-w-[1120px]">
          <motion.header
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-8 flex items-start justify-between"
          >
            <div>
              <h1 className="text-3xl font-black text-slate-950">
                Лабораторія сумісності
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Зберіть віртуальний акваріум та перевірте, чи уживуться види
                разом
              </p>
            </div>

            <motion.button
              type="button"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.96 }}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:border-red-200 hover:bg-red-50 hover:text-red-500"
            >
              <Trash2 size={16} />
              Очистити все
            </motion.button>
          </motion.header>

          <div className="grid grid-cols-[1fr_390px] gap-8">
            <section>
              <h2 className="mb-4 text-sm font-black uppercase tracking-wide text-slate-400">
                Ваша збірка &#40;2 види&#41;
              </h2>

              <div className="space-y-4">
                {selectedSpecies.map((item, index) => (
                  <CompatibilityItem key={item.id} item={item} index={index} />
                ))}

                <motion.button
                  type="button"
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex h-[78px] w-full items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-slate-300 bg-white text-sm font-black text-slate-500 transition hover:border-[#635BFF] hover:bg-[#635BFF]/5 hover:text-[#635BFF]"
                >
                  <Plus size={22} />
                  Додати вид до збірки
                </motion.button>
              </div>
            </section>

            <section>
              <h2 className="mb-4 text-sm font-black uppercase tracking-wide text-slate-400">
                Результат аналізу
              </h2>

              <CompatibilityResult />
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}