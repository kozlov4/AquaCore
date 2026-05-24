"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function todayInputDate() {
  return new Date().toISOString().slice(0, 10);
}

export function WaterParamsModal({ isOpen, onClose, onSave, isSaving = false }) {
  const [formData, setFormData] = useState({
    date: todayInputDate(),
    ph: "7.0",
    gh: "8",
    kh: "4",
    nh3: "0.0",
    no2: "0.0",
    no3: "10",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setErrorMessage("");
      setFormData((prev) => ({
        ...prev,
        date: todayInputDate(),
      }));
    }
  }, [isOpen]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setIsSubmitting(true);
      setErrorMessage("");

      if (onSave) {
        await onSave({
          test_date: formData.date,
          date: formData.date,
          ph: formData.ph,
          gh: formData.gh,
          kh: formData.kh,
          nh3: formData.nh3,
          no2: formData.no2,
          no3: formData.no3,
        });
      }

      onClose();
    } catch (error) {
      setErrorMessage(error.message || "Не вдалося зберегти тест води");
    } finally {
      setIsSubmitting(false);
    }
  };

  const saving = isSubmitting || isSaving;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[80] bg-black/40 backdrop-blur-sm"
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            onClick={() => {
              if (!saving) onClose();
            }}
          />

          <motion.div
            className="fixed inset-0 z-[90] flex items-center justify-center px-4 py-6"
            initial={{
              opacity: 0,
              y: 28,
              scale: 0.96,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 28,
              scale: 0.96,
            }}
            transition={{
              duration: 0.22,
              ease: "easeOut",
            }}
          >
            <div
              className="max-h-[92vh] w-full max-w-[620px] overflow-y-auto rounded-[24px] bg-white p-6 shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-[26px] font-extrabold tracking-[-0.03em] text-[#111827]">
                    Запис параметрів води
                  </h2>

                  <p className="mt-2 text-sm font-medium text-slate-500">
                    Створіть новий тест води для обраного акваріума.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  disabled={saving}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <X size={19} />
                </button>
              </div>

              {errorMessage && (
                <div className="mb-5 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-red-500">
                  {errorMessage}
                </div>
              )}

              <div className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Дата тестування
                  </label>

                  <input
                    type="date"
                    value={formData.date}
                    onChange={(event) => handleChange("date", event.target.value)}
                    disabled={saving}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base outline-none transition focus:border-[#5B4CF6] focus:ring-4 focus:ring-[#5B4CF6]/10 disabled:bg-slate-100"
                  />
                </div>

                <div>
                  <h3 className="mb-3 text-base font-extrabold text-[#111827]">
                    Основні показники
                  </h3>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <div>
                      <label className="mb-1 block text-xs font-bold text-slate-500">
                        pH
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={formData.ph}
                        onChange={(event) => handleChange("ph", event.target.value)}
                        disabled={saving}
                        className="w-full rounded-lg border border-gray-300 px-3 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:bg-slate-100"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-bold text-slate-500">
                        GH
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={formData.gh}
                        onChange={(event) => handleChange("gh", event.target.value)}
                        disabled={saving}
                        className="w-full rounded-lg border border-gray-300 px-3 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:bg-slate-100"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-bold text-slate-500">
                        KH
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={formData.kh}
                        onChange={(event) => handleChange("kh", event.target.value)}
                        disabled={saving}
                        className="w-full rounded-lg border border-gray-300 px-3 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:bg-slate-100"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 text-base font-extrabold text-[#111827]">
                    Азотний цикл
                  </h3>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <div>
                      <label className="mb-1 block text-xs font-bold text-slate-500">
                        Аміак NH3
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.nh3}
                        onChange={(event) =>
                          handleChange("nh3", event.target.value)
                        }
                        disabled={saving}
                        className="w-full rounded-lg border border-gray-300 px-3 py-3 outline-none transition focus:border-red-500 focus:ring-4 focus:ring-red-500/10 disabled:bg-slate-100"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-bold text-slate-500">
                        Нітрити NO2
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.no2}
                        onChange={(event) =>
                          handleChange("no2", event.target.value)
                        }
                        disabled={saving}
                        className="w-full rounded-lg border border-gray-300 px-3 py-3 outline-none transition focus:border-red-500 focus:ring-4 focus:ring-red-500/10 disabled:bg-slate-100"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-bold text-slate-500">
                        Нітрати NO3
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={formData.no3}
                        onChange={(event) =>
                          handleChange("no3", event.target.value)
                        }
                        disabled={saving}
                        className="w-full rounded-lg border border-gray-300 px-3 py-3 outline-none transition focus:border-red-500 focus:ring-4 focus:ring-red-500/10 disabled:bg-slate-100"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={saving}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-extrabold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Скасувати
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="rounded-xl bg-[#5B4CF6] px-5 py-3 text-sm font-extrabold text-white shadow-[0_12px_28px_rgba(91,76,246,0.25)] transition hover:bg-[#4d3fe0] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {saving ? "Збереження..." : "Зберегти результати"}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default WaterParamsModal;