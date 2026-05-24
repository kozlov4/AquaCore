"use client";

import { useState, useEffect } from "react";
import { X, Upload } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function getVolumeValue(volume) {
  if (volume === null || volume === undefined) return "";

  return String(volume).replace(" л", "");
}

function getAquariumType(aquarium) {
  return aquarium?.type || aquarium?.environment || "Прісноводний";
}

function getCreatedAtValue(aquarium) {
  const value = aquarium?.createdAt || aquarium?.created_at;

  if (!value) return "";

  try {
    return new Date(value).toISOString().slice(0, 10);
  } catch {
    return "";
  }
}

export function AquariumSettingsModal({
  isOpen,
  aquarium,
  onClose,
  onSave,
  onDelete,
  isSaving = false,
}) {
  const [name, setName] = useState("");
  const [volume, setVolume] = useState("");
  const [type, setType] = useState("Прісноводний");
  const [createdAt, setCreatedAt] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLocalSaving, setIsLocalSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (isOpen && aquarium) {
      setName(aquarium.name || "");
      setVolume(getVolumeValue(aquarium.volume));
      setType(getAquariumType(aquarium));
      setCreatedAt(getCreatedAtValue(aquarium));
      setErrorMessage("");
      setIsLocalSaving(false);
      setIsDeleting(false);
    }
  }, [isOpen, aquarium]);

  const saving = isSaving || isLocalSaving || isDeleting;

  const handleSave = async () => {
    try {
      setIsLocalSaving(true);
      setErrorMessage("");

      if (!aquarium?.id) {
        throw new Error("Не передано id акваріума");
      }

      if (!name.trim()) {
        throw new Error("Введіть назву акваріума");
      }

      if (!volume || Number(volume) <= 0) {
        throw new Error("Вкажіть коректний обʼєм акваріума");
      }

      await onSave?.({
        id: aquarium.id,
        name: name.trim(),
        volume: Number(volume),
        type,
        createdAt: createdAt
          ? new Date(createdAt).toISOString()
          : aquarium.createdAt || aquarium.created_at || new Date().toISOString(),
        keepImage: true,
      });

      onClose?.();
    } catch (error) {
      setErrorMessage(error.message || "Не вдалося зберегти зміни");
    } finally {
      setIsLocalSaving(false);
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
      {isOpen && aquarium && (
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
                      value={name}
                      onChange={(event) => setName(event.target.value)}
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
                      value={volume}
                      onChange={(event) => setVolume(event.target.value)}
                      disabled={saving}
                      className="h-11 w-full rounded-[7px] border border-[#d6dbe4] px-4 text-[14px] font-semibold text-[#111827] outline-none transition focus:border-[#635bff] focus:ring-4 focus:ring-[#635bff]/10 disabled:bg-slate-100"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-[13px] font-extrabold text-[#475467]">
                      Тип середовища
                    </label>

                    <select
                      value={type}
                      onChange={(event) => setType(event.target.value)}
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

                    <input
                      type="date"
                      value={createdAt}
                      onChange={(event) => setCreatedAt(event.target.value)}
                      disabled={saving}
                      className="h-11 w-full rounded-[7px] border border-[#d6dbe4] px-4 text-[14px] font-semibold text-[#111827] outline-none transition focus:border-[#635bff] focus:ring-4 focus:ring-[#635bff]/10 disabled:bg-slate-100"
                    />
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
                  {isLocalSaving ? "Збереження..." : "Зберегти зміни"}
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