"use client";

import { useEffect, useMemo, useState } from "react";
import { X, ChevronDown, Upload, Trash2 } from "lucide-react";
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
  const [aquariumId, setAquariumId] = useState("");
  const [title, setTitle] = useState(entry?.title || "");
  const [text, setText] = useState(entry?.observation || entry?.text || "");
  const [activeTag, setActiveTag] = useState(
    entry?.tag || "plants_fertilizers"
  );
  const [pinned, setPinned] = useState(Boolean(entry?.isPinned || entry?.pinned));
  const [file, setFile] = useState(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [localError, setLocalError] = useState("");

  useEffect(() => {
    if (entry?.aquariumId) {
      setAquariumId(String(entry.aquariumId));
      return;
    }

    if (entry?.aquarium && aquariums.length > 0) {
      const found = aquariums.find(
        (aquarium) => aquarium.name === entry.aquarium
      );

      if (found?.id) {
        setAquariumId(String(found.id));
        return;
      }
    }

    if (aquariums[0]?.id) {
      setAquariumId(String(aquariums[0].id));
    }
  }, [aquariums, entry]);

  const previewUrl = useMemo(() => {
    if (removeImage) return "";

    if (file) {
      return URL.createObjectURL(file);
    }

    return entry?.imageUrl || "";
  }, [file, entry, removeImage]);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];

    if (selectedFile) {
      setFile(selectedFile);
      setRemoveImage(false);
    }
  };

  const handleRemoveImage = () => {
    setFile(null);
    setRemoveImage(true);
  };

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
        removeImage,
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
          max-w-[640px] -translate-x-1/2 -translate-y-1/2
          overflow-hidden rounded-2xl bg-white
          shadow-[0_28px_85px_rgba(0,0,0,0.34)]
        "
      >
        <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <h2 className="text-xl font-black text-[#332985]">
              {isEdit ? "Редагування запису" : "Новий запис у щоденник"}
            </h2>

            {isEdit && (
              <p className="mt-1 text-xs font-bold text-[#635BFF]">
                ID: #{entry.id}
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
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-black uppercase text-slate-500">
                Дата
              </label>

              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="
                  w-full rounded-xl border border-slate-300
                  px-4 py-3 text-sm font-bold outline-none
                  transition focus:border-[#635BFF]
                  focus:ring-4 focus:ring-[#635BFF]/10
                "
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-black uppercase text-slate-500">
                Екосистема
              </label>

              <div className="relative">
                <select
                  value={aquariumId}
                  onChange={(e) => setAquariumId(e.target.value)}
                  className="
                    w-full appearance-none rounded-xl border border-slate-300
                    bg-white px-4 py-3 pr-10 text-sm font-bold outline-none
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
                  size={17}
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs font-black uppercase text-slate-500">
              Заголовок
            </label>

            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Напр. Дивна поведінка Анциструса"
              className="
                w-full rounded-xl border border-slate-300
                px-4 py-3 text-sm font-bold outline-none transition
                placeholder:text-slate-400
                focus:border-[#635BFF]
                focus:ring-4 focus:ring-[#635BFF]/10
              "
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-black uppercase text-slate-500">
              Спостереження
            </label>

            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Опишіть детально, що ви помітили або змінили..."
              className="
                h-[130px] w-full resize-none rounded-xl
                border border-slate-300 px-4 py-3
                text-sm font-semibold leading-6 outline-none transition
                placeholder:text-slate-400
                focus:border-[#635BFF]
                focus:ring-4 focus:ring-[#635BFF]/10
              "
            />
          </div>

          <div>
            <p className="mb-3 text-xs font-black uppercase text-slate-500">
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
                    text-xs font-black transition
                    ${
                      activeTag === tag.value
                        ? "border-[#635BFF] bg-[#635BFF]/10 text-[#635BFF] shadow-sm"
                        : "border-slate-200 text-slate-500 hover:border-[#635BFF]/40 hover:text-[#635BFF]"
                    }
                  `}
                >
                  {tag.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-3 text-xs font-black uppercase text-slate-500">
              Фото
            </p>

            <label
              className="
                relative flex h-[125px] w-full cursor-pointer flex-col items-center justify-center
                overflow-hidden rounded-2xl border-2 border-dashed
                border-slate-300 bg-slate-50 text-slate-500
                transition hover:border-[#635BFF] hover:bg-[#635BFF]/5
              "
            >
              {previewUrl ? (
                <>
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />

                  <div className="absolute inset-0 flex items-center justify-center bg-black/35">
                    <span className="rounded-full bg-white px-4 py-2 text-xs font-black text-slate-700 shadow-lg">
                      Замінити або видалити фото
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div className="mb-1 rounded-full bg-white p-2 shadow-sm">
                    <Upload size={18} />
                  </div>

                  <span className="text-xs font-bold">
                    Натисніть для завантаження
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
                onChange={handleFileChange}
              />
            </label>

            {previewUrl && (
              <button
                type="button"
                onClick={handleRemoveImage}
                className="mt-2 inline-flex items-center gap-2 rounded-xl bg-red-50 px-3 py-2 text-xs font-black text-red-500 transition hover:bg-red-100"
              >
                <Trash2 size={14} />
                Видалити фото
              </button>
            )}
          </div>

          {localError && (
            <p className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-red-500">
              {localError}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-4 border-t border-slate-100 bg-slate-50 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <label className="flex cursor-pointer items-center gap-2 text-sm font-bold text-slate-600">
            <input
              type="checkbox"
              checked={pinned}
              onChange={(e) => setPinned(e.target.checked)}
              className="h-4 w-4 accent-[#635BFF]"
            />
            📌 Закріпити зверху
          </label>

          <div className="flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="text-sm font-black text-slate-400 transition hover:text-slate-950"
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
                : "Зберегти запис"}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </>
  );
}