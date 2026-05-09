"use client";

import { AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

export function CompatibilityResult() {
  return (
    <motion.article
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="overflow-hidden rounded-3xl border border-red-100 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.12)]"
    >
      <div className="bg-red-50 px-7 py-6">
        <div className="flex items-start gap-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-500 text-white shadow-[0_12px_25px_rgba(239,68,68,0.28)]">
            🚨
          </div>

          <div>
            <h3 className="text-xl font-black text-red-700">
              Критична несумісність
            </h3>

            <p className="mt-2 text-sm leading-6 text-red-500">
              Знайдено фатальні конфлікти між обраними видами. Збірка
              нежиттєздатна.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-7 px-7 py-6">
        <section>
          <h4 className="mb-4 text-xs font-black uppercase tracking-wide text-slate-400">
            Виявлені конфлікти
          </h4>

          <div className="flex gap-3">
            <AlertTriangle size={18} className="mt-1 shrink-0 text-red-500" />

            <div>
              <p className="text-sm font-black text-slate-950">
                Хижак та Здобич
              </p>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                Астронотус &#40;Оскар&#41; гарантовано зʼїсть Неон звичайний
                через велику різницю у розмірах.
              </p>
            </div>
          </div>
        </section>

        <section className="border-t border-slate-100 pt-6">
          <h4 className="mb-4 text-xs font-black uppercase tracking-wide text-slate-400">
            Вимоги до екосистеми
          </h4>

          <div className="space-y-4">
            <Requirement icon="💧" label="Мін. обʼєм:" value="від 250 Л" />
            <Requirement icon="🌡️" label="Спільна температура:" value="24 - 26 °C" success />
            <Requirement icon="🧪" label="Спільний pH:" value="6.5 - 7.0" success />
          </div>
        </section>
      </div>
    </motion.article>
  );
}

function Requirement({ icon, label, value, success }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50">
          {icon}
        </span>
        <span className="text-sm font-bold text-slate-600">{label}</span>
      </div>

      <span
        className={`text-sm font-black ${
          success ? "text-green-500" : "text-slate-950"
        }`}
      >
        {value}
      </span>
    </div>
  );
}