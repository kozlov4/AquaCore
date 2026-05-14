"use client";

import { useEffect, useState } from "react";
import { X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function AddSpeciesToAquariumModal({
  isOpen,
  onClose,
  species,
  aquariums = [],
  onSave,
  isLoading = false,
}) {
  const [count, setCount] = useState("10");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [aquariumId, setAquariumId] = useState("");
  const [localError, setLocalError] = useState("");

  useEffect(() => {
    if (isOpen && aquariums.length > 0 && !aquariumId) {
      setAquariumId(String(aquariums[0].id));
    }
  }, [isOpen, aquariums, aquariumId]);

  useEffect(() => {
    if (!isOpen) {
      setCount("10");
      setDate(new Date().toISOString().slice(0, 10));
      setAquariumId("");
      setLocalError("");
    }
  }, [isOpen]);

  const handleSave = async () => {
    try {
      setLocalError("");

      if (!aquariumId) {
        setLocalError("Оберіть акваріум");
        return;
      }

      if (!count || Number(count) <= 0) {
        setLocalError("Введіть коректну кількість");
        return;
      }

      await onSave?.({
  aquariumId,
  quantity: Number(count),
  settlementDate: date,
});
    } catch (error) {
      setLocalError(error.message || "Не вдалося заселити вид");
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && species && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ duration: 0.24, ease: "easeOut" }}
            className="
              fixed left-1/2 top-1/2 z-50
              w-[calc(100%-28px)] max-w-[480px]
              -translate-x-1/2 -translate-y-1/2
              overflow-hidden rounded-2xl bg-white
              shadow-[0_28px_85px_rgba(0,0,0,0.34)]
            "
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <h2 className="text-xl font-black text-slate-950">
                Заселення жителів
              </h2>

              <button
                type="button"
                onClick={onClose}
                className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-950"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-5 px-6 py-6">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-black uppercase text-slate-400">
                  Обраний вид
                </p>

                <h3 className="mt-2 text-lg font-black text-slate-950">
                  {species.name}
                </h3>

                <p className="text-sm italic text-slate-500">
                  {species.latin}
                </p>
              </div>

              <div>
                <label className="mb-2 block text-xs font-black uppercase text-slate-500">
                  Куди поселити?
                </label>

                <div className="relative">
                  <select
                    value={aquariumId}
                    onChange={(event) => setAquariumId(event.target.value)}
                    disabled={aquariums.length === 0}
                    className="
                      w-full appearance-none rounded-xl border border-slate-300
                      bg-white px-4 py-3 pr-10 text-sm font-bold text-slate-800
                      outline-none transition focus:border-[#635BFF]
                      focus:ring-4 focus:ring-[#635BFF]/10
                      disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400
                    "
                  >
                    <option value="">
                      {aquariums.length === 0
                        ? "Акваріуми не знайдені"
                        : "Оберіть екосистему..."}
                    </option>

                    {aquariums.map((aquarium) => (
                      <option key={aquarium.id} value={aquarium.id}>
                        {aquarium.name}
                      </option>
                    ))}
                  </select>

                  <ChevronDown
                    size={17}
                    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                </div>

                {aquariums.length === 0 ? (
                  <p className="mt-2 text-xs font-semibold text-red-500">
                    Список акваріумів порожній. Перевірте, чи ви увійшли в акаунт,
                    і чи існує файл pages/api/aquariums/names.js.
                  </p>
                ) : (
                  <p className="mt-2 text-xs text-slate-400">
                    Система автоматично перевірить сумісність після вибору.
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-black uppercase text-slate-500">
                    Кількість
                  </label>

                  <input
                    type="number"
                    min="1"
                    value={count}
                    onChange={(event) => setCount(event.target.value)}
                    className="
                      w-full rounded-xl border border-slate-300 px-4 py-3
                      text-sm font-bold outline-none transition
                      focus:border-[#635BFF] focus:ring-4 focus:ring-[#635BFF]/10
                    "
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-black uppercase text-slate-500">
                    Дата заселення
                  </label>

                  <input
                    type="date"
                    value={date}
                    onChange={(event) => setDate(event.target.value)}
                    className="
                      w-full rounded-xl border border-slate-300 px-4 py-3
                      text-sm font-bold outline-none transition
                      focus:border-[#635BFF] focus:ring-4 focus:ring-[#635BFF]/10
                    "
                  />
                </div>
              </div>

              {localError && (
                <p className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-red-500">
                  {localError}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50 px-6 py-5 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl px-5 py-3 text-sm font-black text-slate-500 transition hover:bg-white hover:text-slate-950"
              >
                Скасувати
              </button>

              <motion.button
                type="button"
                onClick={handleSave}
                disabled={isLoading || aquariums.length === 0}
                whileHover={
                  isLoading || aquariums.length === 0
                    ? {}
                    : {
                        y: -2,
                        boxShadow: "0 12px 24px rgba(99,91,255,0.28)",
                      }
                }
                whileTap={isLoading || aquariums.length === 0 ? {} : { scale: 0.96 }}
                className={`
                  rounded-xl px-6 py-3 text-sm font-black text-white
                  transition
                  ${
                    isLoading || aquariums.length === 0
                      ? "cursor-not-allowed bg-[#635BFF]/60"
                      : "cursor-pointer bg-[#635BFF] hover:bg-[#5147f5]"
                  }
                `}
              >
                {isLoading ? "Заселення..." : "Заселити в акваріум"}
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}