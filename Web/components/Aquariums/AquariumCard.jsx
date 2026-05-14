"use client";

import { useEffect, useMemo, useState } from "react";
import { X, Upload, CalendarDays } from "lucide-react";
import { motion } from "framer-motion";
import { toInputDate } from "../../services/aquariumsApi";

const waterTypes = [
  "Прісноводний",
  "Морський",
  "Креветочник",
  "Травник",
  "Цихлідник",
];

export function AddAquariumModal({
  isOpen,
  aquarium = null,
  onClose,
  onSave,
  isLoading = false,
}) {
  const isEdit = Boolean(aquarium?.id);

  const [name, setName] = useState("");
  const [volume, setVolume] = useState("100");
  const [type, setType] = useState("Прісноводний");
  const [createdAt, setCreatedAt] = useState(toInputDate());
  const [file, setFile] = useState(null);
  const [localError, setLocalError] = useState("");

  useEffect(() => {
    if (!aquarium) {
      setName("");
      setVolume("100");
      setType("Прісноводний");
      setCreatedAt(toInputDate());
      setFile(null);
      setLocalError("");
      return;
    }

    setName(aquarium.name || "");
    setVolume(String(aquarium.volumeValue || "").replace(/\D/g, "") || "100");
    setType(aquarium.type || aquarium.environment || "Прісноводний");
    setCreatedAt(toInputDate(aquarium.createdAt));
    setFile(null);
    setLocalError("");
  }, [aquarium, isOpen]);

  const previewUrl = useMemo(() => {
    if (file) return URL.createObjectURL(file);
    return aquarium?.imageUrl || aquarium?.image || "";
  }, [file, aquarium]);

  const handleSave = async () => {
    try {
      setLocalError("");

      if (!name.trim()) {
        setLocalError("Введіть назву акваріума");
        return;
      }

      if (!volume || Number(volume) <= 0) {
        setLocalError("Введіть коректний обʼєм");
        return;
      }

      if (!createdAt) {
        setLocalError("Оберіть дату запуску");
        return;
      }

      await onSave?.({
        name: name.trim(),
        volume: Number(volume),
        type,
        createdAt: new Date(createdAt).toISOString(),
        file,
      });
    } catch (error) {
      setLocalError(error.message || "Не вдалося зберегти акваріум");
    }
  };

  if (!isOpen) return null;

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
        transition={{ duration: 0.24, ease: "easeOut" }}
        className="
          fixed left-1/2 top-1/2 z-50
          max-h-[92vh] w-[calc(100%-28px)]
          max-w-[520px] -translate-x-1/2 -translate-y-1/2
          overflow-hidden rounded-2xl bg-white
          shadow-[0_28px_85px_rgba(0,0,0,0.34)]
        "
      >
        <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <h2 className="text-xl font-black text-slate-950">
              {isEdit ? "Редагування акваріума" : "Нова екосистема"}
            </h2>

            {isEdit && (
              <p className="mt-1 text-xs font-bold text-[#635BFF]">
                ID: #{aquarium.id}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <X size={22} />
          </button>
        </div>

        <div className="max-h-[calc(92vh-150px)] space-y-5 overflow-y-auto px-6 py-6">
          <label
            className="
              relative flex h-[150px] w-full cursor-pointer flex-col items-center justify-center
              overflow-hidden rounded-2xl border-2 border-dashed border-slate-300
              bg-slate-50 text-slate-500 transition
              hover:border-[#635BFF] hover:bg-[#635BFF]/5
            "
          >
            {previewUrl ? (
              <>
                <img
                  src={previewUrl}
                  alt="Aquarium preview"
                  className="h-full w-full object-cover"
                />

                <div className="absolute inset-0 flex items-center justify-center bg-black/35">
                  <span className="rounded-full bg-white px-4 py-2 text-xs font-black text-slate-700 shadow-lg">
                    Замінити фото
                  </span>
                </div>
              </>
            ) : (
              <>
                <div className="mb-2 rounded-full bg-white p-3 text-[#635BFF] shadow-sm">
                  <Upload size={22} />
                </div>

                <span className="text-sm font-black">
                  Завантажити обкладинку
                </span>

                <span className="mt-1 text-xs text-slate-400">
                  PNG, JPG до 10 MB
                </span>
              </>
            )}

            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </label>

          <div>
            <label className="mb-2 block text-xs font-black uppercase text-slate-500">
              Назва
            </label>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Напр. Головний Травник"
              className="
                w-full rounded-xl border border-slate-300
                px-4 py-3 text-sm font-bold outline-none transition
                placeholder:text-slate-400
                focus:border-[#635BFF]
                focus:ring-4 focus:ring-[#635BFF]/10
              "
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-black uppercase text-slate-500">
                Обʼєм
              </label>

              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="1"
                  value={volume}
                  onChange={(e) => setVolume(e.target.value)}
                  className="
                    w-full rounded-xl border border-slate-300
                    px-4 py-3 text-sm font-bold outline-none transition
                    focus:border-[#635BFF]
                    focus:ring-4 focus:ring-[#635BFF]/10
                  "
                />

                <span className="text-sm font-black text-slate-500">л</span>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-black uppercase text-slate-500">
                Дата запуску
              </label>

              <div className="relative">
                <input
                  type="date"
                  value={createdAt}
                  onChange={(e) => setCreatedAt(e.target.value)}
                  className="
                    w-full rounded-xl border border-slate-300
                    px-4 py-3 text-sm font-bold outline-none transition
                    focus:border-[#635BFF]
                    focus:ring-4 focus:ring-[#635BFF]/10
                  "
                />

                <CalendarDays
                  size={16}
                  className="pointer-events-none absolute right-4 top-1/2 hidden -translate-y-1/2 text-slate-400"
                />
              </div>
            </div>
          </div>

          <div>
            <p className="mb-3 text-xs font-black uppercase text-slate-500">
              Тип води / екосистема
            </p>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {waterTypes.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setType(item)}
                  className={`
                    rounded-xl border px-3 py-2
                    text-left text-sm font-black transition
                    ${
                      type === item
                        ? "border-[#635BFF] bg-[#635BFF]/10 text-[#635BFF] shadow-sm"
                        : "border-slate-200 text-slate-500 hover:border-[#635BFF]/40 hover:text-[#635BFF]"
                    }
                  `}
                >
                  {item}
                </button>
              ))}
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
            disabled={isLoading}
            whileHover={
              isLoading
                ? {}
                : {
                    y: -2,
                    boxShadow: "0 12px 24px rgba(99,91,255,0.28)",
                  }
            }
            whileTap={isLoading ? {} : { scale: 0.96 }}
            className={`
              rounded-xl px-6 py-3 text-sm font-black text-white
              transition
              ${
                isLoading
                  ? "cursor-not-allowed bg-[#635BFF]/60"
                  : "cursor-pointer bg-[#635BFF] hover:bg-[#5147f5]"
              }
            `}
          >
            {isLoading
              ? "Збереження..."
              : isEdit
              ? "Зберегти зміни"
              : "Створити акваріум"}
          </motion.button>
        </div>
      </motion.div>
    </>
  );
}