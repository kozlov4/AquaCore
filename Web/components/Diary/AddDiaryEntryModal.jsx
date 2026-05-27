"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ImagePlus, Trash2, Upload, X } from "lucide-react";
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
  const [previewUrl, setPreviewUrl] = useState(entry?.imageUrl || "");
  const [removeImage, setRemoveImage] = useState(false);

  const [localError, setLocalError] = useState("");

  useEffect(() => {
    setDate(toInputDate(entry?.createdAt));
    setTitle(entry?.title || "");
    setText(entry?.observation || entry?.text || "");
    setActiveTag(entry?.tag || "plants_fertilizers");
    setPinned(Boolean(entry?.isPinned || entry?.pinned));
    setFile(null);
    setPreviewUrl(entry?.imageUrl || "");
    setRemoveImage(false);
    setLocalError("");
  }, [entry]);

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

  useEffect(() => {
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  const validateFile = (selectedFile) => {
    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/webp",
    ];

    if (!allowedTypes.includes(selectedFile.type)) {
      throw new Error("Можна завантажувати тільки PNG, JPG, JPEG або WEBP");
    }

    const maxSizeMb = 10;
    const maxSizeBytes = maxSizeMb * 1024 * 1024;

    if (selectedFile.size > maxSizeBytes) {
      throw new Error(`Фото має бути не більше ${maxSizeMb} МБ`);
    }
  };

  const handleFileChange = (event) => {
    try {
      setLocalError("");

      const selectedFile = event.target.files?.[0];

      if (!selectedFile) return;

      validateFile(selectedFile);

      setFile(selectedFile);
      setRemoveImage(false);
    } catch (error) {
      setFile(null);
      setLocalError(error.message || "Не вдалося вибрати фото");
    } finally {
      event.target.value = "";
    }
  };

  const handleRemoveImage = () => {
    setFile(null);
    setPreviewUrl("");
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
      <div
        className="fixed inset-0 z-40 bg-slate-950/45 backdrop-blur-sm"
        onClick={isLoading ? undefined : onClose}
      />

      <motion.div
        initial={{ opacity: 0, y: 28, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 28, scale: 0.96 }}
        transition={{ duration: 0.2 }}
        className="
          fixed left-1/2 top-1/2 z-50
          max-h-[92vh] w-[94vw] max-w-[720px]
          -translate-x-1/2 -translate-y-1/2
          overflow-hidden rounded-[28px] bg-white shadow-2xl
        "
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <h2 className="text-xl font-black text-slate-950">
              {isEdit ? "Редагування запису" : "Новий запис у щоденник"}
            </h2>

            {isEdit && (
              <p className="mt-1 text-xs font-bold text-slate-400">
                ID: #{entry.id}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="flex h-10 w-10 items-center justify-center rounded-2xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        <div className="max-h-[calc(92vh-152px)] overflow-y-auto px-6 py-6">
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-black uppercase tracking-[0.12em] text-slate-500">
                Дата
              </label>

              <input
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
                disabled={isLoading}
                className="
                  w-full rounded-xl border border-slate-300 px-4 py-3
                  text-sm font-bold outline-none transition
                  focus:border-[#635BFF] focus:ring-4 focus:ring-[#635BFF]/10
                  disabled:bg-slate-100
                "
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-black uppercase tracking-[0.12em] text-slate-500">
                Екосистема
              </label>

              <div className="relative">
                <select
                  value={aquariumId}
                  onChange={(event) => setAquariumId(event.target.value)}
                  disabled={isLoading}
                  className="
                    w-full appearance-none rounded-xl border border-slate-300 bg-white
                    px-4 py-3 pr-10 text-sm font-bold outline-none transition
                    focus:border-[#635BFF] focus:ring-4 focus:ring-[#635BFF]/10
                    disabled:bg-slate-100
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

            <div className="md:col-span-2">
              <label className="mb-2 block text-xs font-black uppercase tracking-[0.12em] text-slate-500">
                Заголовок
              </label>

              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                disabled={isLoading}
                placeholder="Напр. Дивна поведінка Анциструса"
                className="
                  w-full rounded-xl border border-slate-300 px-4 py-3
                  text-sm font-bold outline-none transition placeholder:text-slate-400
                  focus:border-[#635BFF] focus:ring-4 focus:ring-[#635BFF]/10
                  disabled:bg-slate-100
                "
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-xs font-black uppercase tracking-[0.12em] text-slate-500">
                Спостереження
              </label>

              <textarea
                value={text}
                onChange={(event) => setText(event.target.value)}
                disabled={isLoading}
                placeholder="Опишіть детально, що ви помітили або змінили..."
                className="
                  h-[130px] w-full resize-none rounded-xl border border-slate-300
                  px-4 py-3 text-sm font-semibold leading-6 outline-none transition
                  placeholder:text-slate-400
                  focus:border-[#635BFF] focus:ring-4 focus:ring-[#635BFF]/10
                  disabled:bg-slate-100
                "
              />
            </div>

            <div className="md:col-span-2">
              <p className="mb-3 text-xs font-black uppercase tracking-[0.12em] text-slate-500">
                Категорія
              </p>

              <div className="flex flex-wrap gap-2">
                {diaryTags.map((tag) => (
                  <button
                    key={tag.value}
                    type="button"
                    onClick={() => setActiveTag(tag.value)}
                    disabled={isLoading}
                    className={`
                      rounded-xl border px-3 py-2 text-xs font-black transition
                      ${
                        activeTag === tag.value
                          ? "border-[#635BFF] bg-[#635BFF]/10 text-[#635BFF] shadow-sm"
                          : "border-slate-200 text-slate-500 hover:border-[#635BFF]/40 hover:text-[#635BFF]"
                      }
                      disabled:opacity-60
                    `}
                  >
                    {tag.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="md:col-span-2">
              <p className="mb-3 text-xs font-black uppercase tracking-[0.12em] text-slate-500">
                Фото до запису
              </p>

              <label
                className="
                  relative flex min-h-[180px] w-full cursor-pointer flex-col
                  items-center justify-center overflow-hidden rounded-3xl
                  border-2 border-dashed border-slate-300 bg-slate-50
                  text-slate-500 transition
                  hover:border-[#635BFF] hover:bg-[#635BFF]/5
                "
              >
                {previewUrl ? (
                  <>
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="h-full min-h-[180px] w-full object-cover"
                    />

                    <div className="absolute inset-0 flex items-center justify-center bg-black/35 opacity-0 transition hover:opacity-100">
                      <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-black text-slate-700 shadow-lg">
                        <ImagePlus size={15} />
                        Натисніть, щоб замінити фото
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#635BFF] shadow-sm">
                      <Upload size={24} />
                    </div>

                    <span className="text-sm font-black text-slate-700">
                      Натисніть для завантаження фото
                    </span>

                    <span className="mt-1 text-xs font-semibold text-slate-400">
                      PNG, JPG, JPEG або WEBP до 10 МБ
                    </span>
                  </>
                )}

                <input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  className="hidden"
                  onChange={handleFileChange}
                  disabled={isLoading}
                />
              </label>

              {previewUrl && (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  disabled={isLoading}
                  className="mt-3 inline-flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2 text-xs font-black text-red-500 transition hover:bg-red-100 disabled:opacity-60"
                >
                  <Trash2 size={14} />
                  Видалити фото
                </button>
              )}
            </div>

            {localError && (
              <p className="md:col-span-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-red-500">
                {localError}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-slate-100 bg-slate-50 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <label className="flex cursor-pointer items-center gap-2 text-sm font-bold text-slate-600">
            <input
              type="checkbox"
              checked={pinned}
              onChange={(event) => setPinned(event.target.checked)}
              disabled={isLoading}
              className="h-4 w-4 accent-[#635BFF]"
            />
            Закріпити зверху
          </label>

          <div className="flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="text-sm font-black text-slate-400 transition hover:text-slate-950 disabled:opacity-50"
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
                rounded-xl px-6 py-3 text-sm font-black text-white transition
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

export default AddDiaryEntryModal;