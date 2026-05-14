"use client";

import { useEffect, useMemo, useState } from "react";
import { X, ChevronDown, Upload } from "lucide-react";
import { motion } from "framer-motion";
import { diaryTags, toInputDate } from "../../services/diaryApi";

export function AddDiaryEntryModal({
  aquariums = [],
  entry = null,
  onClose,
  onSave,
  isLoading = false,
}) {
  const isEdit = Boolean(entry?.id);

  const [date, setDate] = useState(toInputDate(entry?.createdAt));
  const [aquariumId, setAquariumId] = useState(aquariums[0]?.id || "");
  const [title, setTitle] = useState(entry?.title || "");
  const [text, setText] = useState(entry?.observation || entry?.text || "");
  const [activeTag, setActiveTag] = useState(
    entry?.tag || "plants_fertilizers"
  );
  const [pinned, setPinned] = useState(Boolean(entry?.isPinned || entry?.pinned));
  const [file, setFile] = useState(null);
  const [localError, setLocalError] = useState("");

  useEffect(() => {
    if (entry?.aquariumId) {
      setAquariumId(entry.aquariumId);
    } else if (aquariums[0]?.id && !aquariumId) {
      setAquariumId(aquariums[0].id);
    }
  }, [aquariums, entry, aquariumId]);

  const previewUrl = useMemo(() => {
    if (!file) return entry?.imageUrl || "";
    return URL.createObjectURL(file);
  }, [file, entry]);

  const handleSave = async () => {
    try {
      setLocalError("");

      if (!date) {
        setLocalError("Оберіть дату");
        return;
      }

      if (!aquariumId) {
        setLocalError("Оберіть екосистему");
        return;
      }

      if (!title.trim()) {
        setLocalError("Введіть заголовок");
        return;
      }

      if (!text.trim()) {
        setLocalError("Введіть спостереження");
        return;
      }

      await onSave?.({
        date,
        aquariumId,
        title: title.trim(),
        observation: text.trim(),
        tag: activeTag,
        file,
        isPinned: pinned,
      });
    } catch (error) {
      setLocalError(error.message || "Не вдалося зберегти запис");
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
          max-w-[520px] -translate-x-1/2 -translate-y-1/2
          overflow-hidden rounded-2xl bg-white
          shadow-[0_28px_85px_rgba(0,0,0,0.34)]
        "
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h2 className="text-lg font-black text-slate-950">
            {isEdit ? "Редагувати запис" : "Новий запис у щоденник"}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <X size={20} />
          </button>
        </div>

        <div className="max-h-[calc(92vh-140px)] space-y-4 overflow-y-auto px-5 py-5">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-black text-slate-700">
                Дата
              </label>

              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="
                  w-full rounded-xl border border-slate-300
                  px-3 py-2.5 text-sm font-bold outline-none
                  transition focus:border-[#635BFF]
                  focus:ring-4 focus:ring-[#635BFF]/10
                "
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-black text-slate-700">
                Екосистема
              </label>

              <div className="relative">
                <select
                  value={aquariumId}
                  onChange={(e) => setAquariumId(e.target.value)}
                  className="
                    w-full appearance-none rounded-xl border border-slate-300
                    bg-white px-3 py-2.5 pr-9 text-sm font-bold outline-none
                    transition focus:border-[#635BFF]
                    focus:ring-4 focus:ring-[#635BFF]/10
                  "
                >
                  <option value="">Оберіть екосистему</option>

                  {aquariums.map((aquarium) => (
                    <option key={aquarium.id} value={aquarium.id}>
                      {aquarium.name}
                    </option>
                  ))}
                </select>

                <ChevronDown
                  size={16}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs font-black text-slate-700">
              Заголовок
            </label>

            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Напр. Змінив режим освітлення"
              className="
                w-full rounded-xl border border-slate-300
                px-3 py-2.5 text-sm outline-none transition
                placeholder:text-slate-400
                focus:border-[#635BFF]
                focus:ring-4 focus:ring-[#635BFF]/10
              "
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-black text-slate-700">
              Спостереження
            </label>

            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Опишіть детально, що ви помітили або змінили..."
              className="
                h-[105px] w-full resize-none rounded-xl
                border border-slate-300 px-3 py-2.5
                text-sm outline-none transition
                placeholder:text-slate-400
                focus:border-[#635BFF]
                focus:ring-4 focus:ring-[#635BFF]/10
              "
            />
          </div>

          <div>
            <p className="mb-2 text-xs font-black text-slate-700">
              Категорія
            </p>

            <div className="flex flex-wrap gap-2">
              {diaryTags.map((tag) => (
                <button
                  key={tag.value}
                  type="button"
                  onClick={() => setActiveTag(tag.value)}
                  className={`
                    rounded-xl border px-3 py-2
                    text-xs font-bold transition
                    ${
                      activeTag === tag.value
                        ? "border-[#635BFF] bg-[#635BFF]/10 text-[#635BFF]"
                        : "border-slate-200 text-slate-600 hover:border-[#635BFF]/40"
                    }
                  `}
                >
                  {tag.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-black text-slate-700">
              Фото
            </p>

            <label
              className="
                flex h-[120px] w-full cursor-pointer flex-col items-center justify-center
                overflow-hidden rounded-2xl border-2 border-dashed
                border-slate-300 bg-slate-50 text-slate-500
                transition hover:border-[#635BFF] hover:bg-[#635BFF]/5
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
                  <div className="mb-1 rounded-full bg-white p-2 shadow-sm">
                    <Upload size={18} />
                  </div>

                  <span className="text-xs font-bold">
                    Завантажити фото
                  </span>

                  <span className="mt-0.5 text-[10px] text-slate-400">
                    PNG, JPG
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
          </div>

          {localError && (
            <p className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-red-500">
              {localError}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between bg-slate-50 px-5 py-4">
          <label className="flex cursor-pointer items-center gap-2 text-xs font-bold text-slate-600">
            <input
              type="checkbox"
              checked={pinned}
              onChange={(e) => setPinned(e.target.checked)}
              className="h-4 w-4 accent-[#635BFF]"
            />
            📌 Закріпити зверху
          </label>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onClose}
              className="text-sm font-black text-slate-600 transition hover:text-slate-950"
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
                rounded-xl px-5 py-2.5 text-sm font-black text-white
                transition
                ${
                  isLoading
                    ? "cursor-not-allowed bg-[#635BFF]/60"
                    : "cursor-pointer bg-[#635BFF] hover:bg-[#5147f5]"
                }
              `}
            >
              {isLoading ? "Збереження..." : "Зберегти запис"}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </>
  );
}