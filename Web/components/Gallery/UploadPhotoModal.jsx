"use client";

import { useMemo, useState } from "react";
import { X, ChevronDown, Upload } from "lucide-react";
import { motion } from "framer-motion";

const categories = ["Загальний план", "Жителі", "Рослини", "Інше"];

export function UploadPhotoModal({
  aquariums = [],
  onClose,
  onSave,
  isLoading = false,
}) {
  const [aquariumId, setAquariumId] = useState(aquariums[0]?.id || "");
  const [category, setCategory] = useState("Загальний план");
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState(null);
  const [localError, setLocalError] = useState("");

  const previewUrl = useMemo(() => {
    if (!file) return "";

    return URL.createObjectURL(file);
  }, [file]);

  const handleSave = async () => {
    try {
      setLocalError("");

      if (!file) {
        setLocalError("Оберіть фото");
        return;
      }

      if (!aquariumId) {
        setLocalError("Оберіть акваріум");
        return;
      }

      await onSave?.({
        file,
        aquariumId,
        category,
        caption,
      });
    } catch (error) {
      setLocalError(error.message || "Не вдалося зберегти фото");
    }
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
        transition={{ duration: 0.24, ease: "easeOut" }}
        className="
          fixed left-1/2 top-1/2 z-50
          max-h-[92vh] w-[calc(100%-28px)]
          max-w-[460px] -translate-x-1/2 -translate-y-1/2
          overflow-hidden rounded-[24px] bg-white
          shadow-[0_28px_85px_rgba(0,0,0,0.34)]
        "
      >
        <div
          className="
            flex items-start justify-between gap-4
            border-b border-slate-100 px-5 py-4
            sm:items-center sm:px-6 sm:py-5
          "
        >
          <h2 className="text-xl font-black leading-tight text-slate-950 sm:text-2xl">
            Завантажити фотографію
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="
              shrink-0 rounded-full p-1.5 text-slate-400
              transition hover:bg-slate-100 hover:text-slate-900
            "
          >
            <X size={21} />
          </button>
        </div>

        <div
          className="
            max-h-[calc(92vh-152px)] space-y-5
            overflow-y-auto px-5 py-5
            sm:px-6 sm:py-6
          "
        >
          <label
            className="
              flex h-[145px] w-full cursor-pointer flex-col items-center justify-center
              overflow-hidden rounded-2xl border-2 border-dashed border-[#C7D2FE]
              bg-slate-50 text-center transition
              hover:border-[#635BFF] hover:bg-[#635BFF]/5
              sm:h-[165px]
            "
          >
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Preview"
                className="h-full w-full object-cover"
              />
            ) : (
              <>
                <div className="mb-4 rounded-full bg-white p-4 text-[#635BFF] shadow-sm">
                  <Upload size={24} />
                </div>

                <p className="text-sm font-black text-[#2F2A8F]">
                  Натисніть для вибору файлу
                </p>

                <p className="mt-1 max-w-[260px] text-xs leading-5 text-slate-400">
                  або перетягніть фотографію сюди &#40;до 10 MB&#41;
                </p>
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
            <label className="mb-2 block text-sm font-black text-slate-700">
              Для якої екосистеми?
            </label>

            <div className="relative">
              <select
                value={aquariumId}
                onChange={(e) => setAquariumId(e.target.value)}
                className="
                  w-full appearance-none rounded-xl border border-slate-200
                  bg-white px-4 py-3 pr-10 text-left text-sm font-bold
                  text-slate-900 outline-none transition hover:border-[#635BFF]/40
                "
              >
                <option value="">Оберіть акваріум</option>

                {aquariums.map((aquarium) => (
                  <option key={aquarium.id} value={aquarium.id}>
                    {aquarium.name}
                  </option>
                ))}
              </select>

              <ChevronDown
                size={18}
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm font-black text-slate-700">
              Що на фото? &#40;Категорія&#41;
            </p>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {categories.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setCategory(item)}
                  className={`
                    rounded-xl border px-3 py-2
                    text-left text-sm font-bold transition
                    ${
                      category === item
                        ? "border-[#635BFF] bg-[#635BFF] text-white shadow-[0_10px_24px_rgba(99,91,255,0.25)]"
                        : "border-slate-200 bg-white text-slate-600 hover:border-[#635BFF]/40 hover:text-[#635BFF]"
                    }
                  `}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-black text-slate-700">
              Підпис &#40;Опціонально&#41;
            </label>

            <input
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Наприклад: Вигляд після прополки..."
              className="
                w-full rounded-xl border border-slate-200
                px-4 py-3 text-sm outline-none transition
                placeholder:text-slate-400
                focus:border-[#635BFF]
                focus:ring-4 focus:ring-[#635BFF]/10
              "
            />
          </div>

          {localError && (
            <p className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-red-500">
              {localError}
            </p>
          )}
        </div>

        <div
          className="
            flex flex-col-reverse gap-3 bg-slate-50
            px-5 py-4
            sm:flex-row sm:items-center sm:justify-end sm:gap-5 sm:px-6 sm:py-5
          "
        >
          <button
            type="button"
            onClick={onClose}
            className="
              rounded-xl px-4 py-3 text-sm font-black
              text-slate-600 transition hover:bg-white hover:text-slate-950
            "
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
                    boxShadow: "0 14px 28px rgba(99,91,255,0.32)",
                  }
            }
            whileTap={isLoading ? {} : { scale: 0.96 }}
            className={`
              w-full rounded-xl px-6 py-3 text-sm font-black text-white
              transition sm:w-auto
              ${
                isLoading
                  ? "cursor-not-allowed bg-[#635BFF]/60"
                  : "cursor-pointer bg-[#635BFF] hover:bg-[#5147f5]"
              }
            `}
          >
            {isLoading ? "Збереження..." : "Зберегти в галерею"}
          </motion.button>
        </div>
      </motion.div>
    </>
  );
}