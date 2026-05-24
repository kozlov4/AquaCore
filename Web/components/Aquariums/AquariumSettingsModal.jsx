"use client";

import { useEffect, useState } from "react";
import { X, Upload, CalendarDays } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

function todayInputDate() {
  return new Date().toISOString().slice(0, 10);
}

function toInputDate(value) {
  if (!value) return "";

  try {
    return new Date(value).toISOString().slice(0, 10);
  } catch {
    return "";
  }
}

function getInitialForm(aquarium) {
  return {
    name: aquarium?.name || "",
    volume: aquarium?.volume ? String(aquarium.volume).replace(" л", "") : "",
    type: aquarium?.type || aquarium?.environment || "Прісноводний",
    created_at: toInputDate(aquarium?.created_at) || "",
    image_id: aquarium?.image_id || null,
  };
}

export function AquariumSettingsModal({
  isOpen,
  aquarium,
  onClose,
  onSave,
  onDelete,
  isSaving = false,
}) {
  const [formData, setFormData] = useState(getInitialForm(aquarium));
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData(getInitialForm(aquarium));
      setErrorMessage("");
      setIsSubmitting(false);
      setIsDeleting(false);
    }
  }, [isOpen, aquarium]);

  const saving = isSaving || isSubmitting || isDeleting;

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

      if (!aquarium?.id) {
        throw new Error("Не передано id акваріума");
      }

      if (!formData.name.trim()) {
        throw new Error("Введіть назву акваріума");
      }

      if (!formData.volume || Number(formData.volume) <= 0) {
        throw new Error("Вкажіть коректний обʼєм акваріума");
      }

      await onSave?.({
        id: aquarium.id,
        name: formData.name.trim(),
        volume: Number(formData.volume),
        type: formData.type,
        created_at: formData.created_at
          ? new Date(formData.created_at).toISOString()
          : aquarium.created_at || new Date().toISOString(),
        image_id: formData.image_id,
      });

      onClose?.();
    } catch (error) {
      setErrorMessage(error.message || "Не вдалося зберегти зміни");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      setErrorMessage("");

      if (!aquarium?.id) {
        throw new Error("Не передано id акваріума");
      }

      await onDelete?.(aquarium.id);

      onClose?.();
    } catch (error) {
      setErrorMessage(error.message || "Не вдалося видалити акваріум");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[80] bg-black/45 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              if (!saving) onClose?.();
            }}
          />

          <motion.div
            className="fixed inset-0 z-[90] flex items-center justify-center px-4 py-6"
            initial={{ opacity: 0, y: 26, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 26, scale: 0.96 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            <div
              className="w-full max-w-[470px] overflow-hidden rounded-[18px] bg-white shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-[#eef0f4] px-6 py-5">
                <h2 className="text-[20px] font-extrabold tracking-[-0.03em] text-[#111827]">
                  Налаштування акваріума
                </h2>

                <button
                  type="button"
                  onClick={onClose}
                  disabled={saving}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-[#9ca3af] transition hover:bg-slate-100 hover:text-[#111827] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="max-h-[72vh] overflow-y-auto px-6 py-5">
                {errorMessage && (
                  <div className="mb-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-red-500">
                    {errorMessage}
                  </div>
                )}

                <div className="mb-5">
                  <label className="mb-2 block text-[13px] font-extrabold text-[#475467]">
                    Обкладинка (необовʼязково)
                  </label>

                  <button
                    type="button"
                    disabled={saving}
                    className="flex h-[118px] w-full flex-col items-center justify-center rounded-[4px] border border-dashed border-[#b9c6d8] bg-[#f8fbff] text-center transition hover:bg-[#f3f7ff] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <span className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#635bff] shadow-sm">
                      <Upload size={18} />
                    </span>

                    <span className="text-[12px] font-extrabold text-[#635bff]">
                      Натисніть для завантаження
                    </span>

                    <span className="mt-1 text-[10px] font-medium text-[#98a2b3]">
                      або перетягніть фото сюди (PNG, JPG)
                    </span>
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-[13px] font-extrabold text-[#475467]">
                      Назва
                    </label>

                    <input
                      value={formData.name}
                      onChange={(event) => handleChange("name", event.target.value)}
                      disabled={saving}
                      className="h-11 w-full rounded-[7px] border border-[#d6dbe4] px-4 text-[14px] font-semibold text-[#111827] outline-none transition focus:border-[#635bff] focus:ring-4 focus:ring-[#635bff]/10 disabled:bg-slate-100"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-[13px] font-extrabold text-[#475467]">
                      Обʼєм (Літри)
                    </label>

                    <input
                      type="number"
                      min="1"
                      value={formData.volume}
                      onChange={(event) =>
                        handleChange("volume", event.target.value)
                      }
                      disabled={saving}
                      className="h-11 w-full rounded-[7px] border border-[#d6dbe4] px-4 text-[14px] font-semibold text-[#111827] outline-none transition focus:border-[#635bff] focus:ring-4 focus:ring-[#635bff]/10 disabled:bg-slate-100"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-[13px] font-extrabold text-[#475467]">
                      Тип середовища
                    </label>

                    <select
                      value={formData.type}
                      onChange={(event) => handleChange("type", event.target.value)}
                      disabled={saving}
                      className="h-11 w-full rounded-[7px] border border-[#d6dbe4] bg-white px-4 text-[14px] font-semibold text-[#111827] outline-none transition focus:border-[#635bff] focus:ring-4 focus:ring-[#635bff]/10 disabled:bg-slate-100"
                    >
                      <option value="Прісноводний">Прісноводний</option>
                      <option value="Морський">Морський</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-[13px] font-extrabold text-[#475467]">
                      Дата запуску
                    </label>

                    <div className="relative">
                      <input
                        type="date"
                        value={formData.created_at}
                        onChange={(event) =>
                          handleChange("created_at", event.target.value)
                        }
                        disabled={saving}
                        className="h-11 w-full rounded-[7px] border border-[#d6dbe4] px-4 pr-11 text-[14px] font-semibold text-[#111827] outline-none transition focus:border-[#635bff] focus:ring-4 focus:ring-[#635bff]/10 disabled:bg-slate-100"
                      />

                      <CalendarDays
                        size={17}
                        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#6b7280]"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-5 rounded-[10px] border border-red-200 bg-red-50 p-4">
                  <h3 className="text-[13px] font-extrabold text-red-500">
                    Небезпечна зона
                  </h3>

                  <p className="mt-1 text-[11px] font-medium leading-relaxed text-red-500">
                    Видалення акваріума назавжди знищить усю історію параметрів,
                    жителів та завдань.
                  </p>

                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={saving}
                    className="mt-4 h-10 w-full rounded-[7px] border border-red-300 bg-white text-[13px] font-extrabold text-red-500 transition hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isDeleting ? "Видалення..." : "Видалити акваріум"}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-[#eef0f4] bg-[#f8fafc] px-6 py-5">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={saving}
                  className="rounded-[8px] px-5 py-3 text-[13px] font-extrabold text-[#475467] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Скасувати
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="rounded-[8px] bg-[#5b4cf6] px-5 py-3 text-[13px] font-extrabold text-white shadow-[0_12px_28px_rgba(91,76,246,0.24)] transition hover:bg-[#4d3fe0] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? "Збереження..." : "Зберегти зміни"}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default AquariumSettingsModal;