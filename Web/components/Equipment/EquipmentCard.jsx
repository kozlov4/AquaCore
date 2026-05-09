"use client";

import { motion } from "framer-motion";

export function EquipmentCard({ item, index, onHistory }) {
  const isWarning = item.status === "warning";
  const isInactive = item.status === "inactive";

  return (
    <motion.article
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.06 }}
      whileHover={{ y: -5 }}
      className={`rounded-2xl border bg-white p-5 shadow-sm transition hover:shadow-[0_20px_55px_rgba(15,23,42,.1)] ${
        isWarning ? "border-yellow-300" : "border-slate-100"
      }`}
    >
      <div className="mb-5 flex items-start gap-4">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-2xl text-2xl ${
            isWarning ? "bg-yellow-50" : "bg-blue-50"
          }`}
        >
          {item.icon}
        </div>

        <div>
          <p className="text-[10px] font-black uppercase tracking-wide text-slate-400">
            {item.category}
          </p>
          <h3 className="text-base font-black text-slate-950">{item.name}</h3>
        </div>
      </div>

      <div className="space-y-2 text-xs">
        <div className="flex justify-between">
          <span className="text-slate-400">Встановлено:</span>
          <span className="font-black text-slate-950">{item.installed}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-400">
            {item.category === "Температура" ? "Цільова температура:" : "Потужність:"}
          </span>
          <span className="font-black text-slate-950">{item.power}</span>
        </div>
      </div>

      {!isInactive ? (
        <>
          <div className="mt-5 flex justify-between text-xs font-bold">
            <span className="text-slate-500">{item.service}</span>
            <span className={isWarning ? "text-orange-500" : "text-green-500"}>
              {item.daysLeft}
            </span>
          </div>

          <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              style={{ width: `${item.progress}%` }}
              className={`h-full rounded-full ${
                isWarning ? "bg-orange-400" : "bg-green-500"
              }`}
            />
          </div>

          <div className="mt-5 grid grid-cols-[1fr_auto] gap-3">
            <button className="rounded-lg bg-[#635BFF] px-4 py-2.5 text-xs font-black text-white transition hover:bg-[#5147f5]">
              Обслужив
            </button>

            <button
              type="button"
              onClick={onHistory}
              className="rounded-lg border border-slate-200 px-4 py-2.5 text-xs font-black text-slate-600 transition hover:border-[#635BFF]/40 hover:text-[#635BFF]"
            >
              Історія
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="mt-5 rounded-lg bg-slate-50 px-4 py-3 text-center text-xs font-bold text-slate-400">
            Не потребує регулярного обслуговування
          </div>

          <button
            type="button"
            onClick={onHistory}
            className="mt-5 w-full rounded-lg border border-slate-200 px-4 py-2.5 text-xs font-black text-slate-600 transition hover:border-[#635BFF]/40 hover:text-[#635BFF]"
          >
            Історія поломок
          </button>
        </>
      )}
    </motion.article>
  );
}