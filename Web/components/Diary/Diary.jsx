"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ChevronDown,
  Image as ImageIcon,
  Loader2,
  Pencil,
  Plus,
  Search,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { Sidebar } from "../Profile/Sidebar";
import {
  createDiaryEntry,
  deleteDiaryEntry,
  getAquariumNamesForDiary,
  getDiaryEntries,
  getDiaryEntry,
  updateDiaryEntry,
} from "../../services/diaryApi";

const tagFilters = [
  {
    key: "all",
    label: "Всі записи",
    apiValue: "all",
    badge: "Всі записи",
  },
  {
    key: "plants",
    label: "🌿 Рослини та Добрива",
    apiValue: "plants_fertilizers",
    badge: "🌿 Рослини",
  },
  {
    key: "diseases",
    label: "🩺 Хвороби / Проблеми",
    apiValue: "diseases_health_issues",
    badge: "🩺 Хвороба",
  },
  {
    key: "behavior",
    label: "🐟 Поведінка / Нерест",
    apiValue: "behavior_spawning",
    badge: "🐟 Поведінка",
  },
  {
    key: "equipment",
    label: "⚙️ Обладнання",
    apiValue: "equipment",
    badge: "⚙️ Обладнання",
  },
];

const editTags = [
  {
    key: "plants",
    label: "🌿 Рослини",
  },
  {
    key: "diseases",
    label: "🩺 Хвороба",
  },
  {
    key: "behavior",
    label: "🐟 Поведінка",
  },
  {
    key: "equipment",
    label: "⚙️ Обладнання",
  },
];

const tagClasses = {
  green: "bg-green-50 text-green-600",
  red: "bg-red-50 text-red-500",
  yellow: "bg-yellow-50 text-yellow-700",
  gray: "bg-slate-100 text-slate-600",
};

function getTodayInput() {
  return new Date().toISOString().slice(0, 10);
}

function DiaryCard({ entry, index, onOpen }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      onClick={() => onOpen(entry)}
      className={`
        cursor-pointer overflow-hidden rounded-[18px] border bg-white shadow-[0_12px_34px_rgba(15,23,42,0.04)]
        transition hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(15,23,42,0.08)]
        ${entry.isPinned ? "border-[#dfe3ff] bg-[#f7f8ff]" : "border-[#edf0f5]"}
      `}
    >
      {entry.imageUrl ? (
        <img
          src={entry.imageUrl}
          alt={entry.title}
          className="h-[130px] w-full object-cover"
        />
      ) : entry.imageId ? (
        <div className="flex h-[130px] items-center justify-center bg-[#2d2a78] text-white">
          <ImageIcon size={24} />
        </div>
      ) : null}

      <div className="p-5">
        <p className="mb-3 text-[12px] font-bold text-[#98a2b3]">
          {entry.isPinned && (
            <span className="text-[#635BFF]">📌 Закріплено • </span>
          )}
          {entry.date}
          {entry.aquariumName && (
            <>
              {" "}
              • <span className="text-[#635BFF]">{entry.aquariumName}</span>
            </>
          )}
        </p>

        <h3 className="mb-3 text-[18px] font-black leading-snug text-[#111827]">
          {entry.title}
        </h3>

        <p className="line-clamp-4 whitespace-pre-line text-[14px] font-medium leading-6 text-[#475467]">
          {entry.text}
        </p>

        <span
          className={`mt-4 inline-flex rounded-md px-2 py-1 text-[11px] font-black uppercase ${
            tagClasses[entry.tagColor] || tagClasses.gray
          }`}
        >
          {entry.tagBadge}
        </span>
      </div>
    </motion.article>
  );
}

function DiaryFormModal({
  title,
  aquariums,
  initialData,
  isSaving,
  onClose,
  onSubmit,
}) {
  const [date, setDate] = useState(initialData?.dateInput || getTodayInput());

  const [aquariumId, setAquariumId] = useState(
    initialData?.aquariumId || aquariums[0]?.id || ""
  );

  const [entryTitle, setEntryTitle] = useState(initialData?.title || "");
  const [observation, setObservation] = useState(initialData?.text || "");
  const [tagKey, setTagKey] = useState(initialData?.tagKey || "plants");
  const [isPinned, setIsPinned] = useState(Boolean(initialData?.isPinned));

  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(initialData?.imageUrl || "");
  const [removeImage, setRemoveImage] = useState(false);
  const [localError, setLocalError] = useState("");

  useEffect(() => {
    setDate(initialData?.dateInput || getTodayInput());
    setAquariumId(initialData?.aquariumId || aquariums[0]?.id || "");
    setEntryTitle(initialData?.title || "");
    setObservation(initialData?.text || "");
    setTagKey(initialData?.tagKey || "plants");
    setIsPinned(Boolean(initialData?.isPinned));

    setFile(null);
    setPreviewUrl(initialData?.imageUrl || "");
    setRemoveImage(false);
    setLocalError("");
  }, [initialData, aquariums]);

  useEffect(() => {
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  const validateImage = (selectedFile) => {
    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/webp",
    ];

    if (!allowedTypes.includes(selectedFile.type)) {
      throw new Error("Можна завантажувати тільки PNG, JPG, JPEG або WEBP");
    }

    const maxSizeBytes = 10 * 1024 * 1024;

    if (selectedFile.size > maxSizeBytes) {
      throw new Error("Фото має бути не більше 10 МБ");
    }
  };

  const handleFileChange = (event) => {
    try {
      setLocalError("");

      const selectedFile = event.target.files?.[0];

      if (!selectedFile) return;

      validateImage(selectedFile);

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

  const handleSubmit = () => {
    setLocalError("");

    if (!date) {
      setLocalError("Оберіть дату");
      return;
    }

    if (!aquariumId) {
      setLocalError("Оберіть одну з екосистем");
      return;
    }

    if (!entryTitle.trim()) {
      setLocalError("Введіть короткий заголовок");
      return;
    }

    if (!observation.trim()) {
      setLocalError("Опишіть спостереження");
      return;
    }

    onSubmit({
      date,
      aquariumId,
      title: entryTitle.trim(),
      observation: observation.trim(),
      tagKey,
      isPinned,
      imageId: initialData?.imageId || null,
      file,
      removeImage,
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/45 px-4 py-5 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, y: 22, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 22, scale: 0.98 }}
        className="mx-auto w-full max-w-[560px] overflow-hidden rounded-[22px] bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h2 className="text-[18px] font-black text-[#111827]">{title}</h2>

          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-[#98a2b3] transition hover:bg-slate-100 hover:text-[#111827] disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        <div className="max-h-[calc(100vh-150px)] overflow-y-auto px-5 py-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-[12px] font-black text-[#475467]">
                Дата
              </label>

              <input
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
                disabled={isSaving}
                className="h-11 w-full rounded-xl border border-slate-300 px-3 text-sm font-black outline-none transition focus:border-[#635BFF] focus:ring-4 focus:ring-[#635BFF]/10 disabled:bg-slate-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-[12px] font-black text-[#475467]">
                Екосистема
              </label>

              <div className="relative">
                <select
                  value={aquariumId}
                  onChange={(event) => setAquariumId(event.target.value)}
                  disabled={isSaving}
                  className="h-11 w-full appearance-none rounded-xl border border-slate-300 bg-white px-3 pr-9 text-sm font-black outline-none transition focus:border-[#635BFF] focus:ring-4 focus:ring-[#635BFF]/10 disabled:bg-slate-100"
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
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#98a2b3]"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-[12px] font-black text-[#475467]">
                Короткий заголовок
              </label>

              <input
                value={entryTitle}
                onChange={(event) => setEntryTitle(event.target.value)}
                disabled={isSaving}
                placeholder="Напр. Змінив режим освітлення"
                className="h-11 w-full rounded-xl border border-slate-300 px-3 text-sm font-semibold outline-none transition placeholder:text-slate-400 focus:border-[#635BFF] focus:ring-4 focus:ring-[#635BFF]/10 disabled:bg-slate-100"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-[12px] font-black text-[#475467]">
                Спостереження
              </label>

              <textarea
                value={observation}
                onChange={(event) => setObservation(event.target.value)}
                disabled={isSaving}
                placeholder="Опишіть детально, що ви помітили або змінили..."
                className="h-[105px] w-full resize-none rounded-xl border border-slate-300 px-3 py-3 text-sm font-semibold leading-6 outline-none transition placeholder:text-slate-400 focus:border-[#635BFF] focus:ring-4 focus:ring-[#635BFF]/10 disabled:bg-slate-100"
              />
            </div>

            <div className="md:col-span-2">
              <p className="mb-2 text-[12px] font-black text-[#475467]">
                Категорія
              </p>

              <div className="flex flex-wrap gap-2">
                {editTags.map((tag) => (
                  <button
                    key={tag.key}
                    type="button"
                    onClick={() => setTagKey(tag.key)}
                    disabled={isSaving}
                    className={`rounded-xl border px-3 py-2 text-xs font-black transition disabled:opacity-60 ${
                      tagKey === tag.key
                        ? "border-[#635BFF] bg-[#635BFF]/10 text-[#635BFF]"
                        : "border-slate-200 text-slate-500 hover:border-[#635BFF]/40 hover:text-[#635BFF]"
                    }`}
                  >
                    {tag.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="md:col-span-2">
              <p className="mb-2 text-[12px] font-black text-[#475467]">
                Прикріпити фото
              </p>

              <label className="relative flex min-h-[115px] w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 text-slate-500 transition hover:border-[#635BFF] hover:bg-[#635BFF]/5">
                {previewUrl ? (
                  <>
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="h-full min-h-[115px] w-full object-cover"
                    />

                    <div className="absolute inset-0 flex items-center justify-center bg-black/35 opacity-0 transition hover:opacity-100">
                      <span className="rounded-full bg-white px-4 py-2 text-xs font-black text-slate-700 shadow-lg">
                        Натисніть, щоб замінити фото
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#635BFF] shadow-sm">
                      <Upload size={19} />
                    </div>

                    <span className="text-xs font-black text-slate-700">
                      Натисніть для завантаження фото
                    </span>

                    <span className="mt-1 text-[11px] font-semibold text-slate-400">
                      PNG, JPG, JPEG або WEBP до 10 МБ
                    </span>
                  </>
                )}

                <input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  className="hidden"
                  onChange={handleFileChange}
                  disabled={isSaving}
                />
              </label>

              {previewUrl && (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  disabled={isSaving}
                  className="mt-2 inline-flex items-center gap-2 rounded-xl bg-red-50 px-3 py-2 text-xs font-black text-red-500 transition hover:bg-red-100 disabled:opacity-60"
                >
                  <Trash2 size={14} />
                  Видалити фото
                </button>
              )}
            </div>

            {localError && (
              <div className="md:col-span-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-red-500">
                {localError}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <label className="flex cursor-pointer items-center gap-2 text-xs font-bold text-slate-600">
            <input
              type="checkbox"
              checked={isPinned}
              onChange={(event) => setIsPinned(event.target.checked)}
              disabled={isSaving}
              className="h-4 w-4 accent-[#635BFF]"
            />
            📌 Закріпити зверху
          </label>

          <div className="flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="text-sm font-black text-slate-500 transition hover:text-slate-950 disabled:opacity-50"
            >
              Скасувати
            </button>

            <motion.button
              type="button"
              onClick={handleSubmit}
              disabled={isSaving}
              whileHover={
                isSaving
                  ? {}
                  : {
                      y: -2,
                      boxShadow: "0 12px 24px rgba(99,91,255,0.28)",
                    }
              }
              whileTap={isSaving ? {} : { scale: 0.96 }}
              className={`rounded-xl px-5 py-2.5 text-sm font-black text-white transition ${
                isSaving
                  ? "cursor-not-allowed bg-[#635BFF]/60"
                  : "cursor-pointer bg-[#635BFF] hover:bg-[#5147f5]"
              }`}
            >
              {isSaving ? "Збереження..." : "Зберегти запис"}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function DiaryDetailsModal({
  entry,
  onClose,
  onEdit,
  onDelete,
  isDeleting,
}) {
  if (!entry) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/45 px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.98 }}
        className="w-full max-w-[760px] overflow-hidden rounded-[28px] bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-8 py-5">
          <div className="flex items-center gap-4">
            <span
              className={`rounded-md px-3 py-1 text-[12px] font-black uppercase ${
                tagClasses[entry.tagColor] || tagClasses.gray
              }`}
            >
              {entry.tagLabel}
            </span>

            <span className="text-sm font-bold text-[#98a2b3]">
              {entry.date}
            </span>
          </div>

          <div className="flex items-center gap-4 text-[#98a2b3]">
            <button
              type="button"
              onClick={onEdit}
              className="hover:text-[#635BFF]"
            >
              <Pencil size={20} />
            </button>

            <button
              type="button"
              onClick={onDelete}
              disabled={isDeleting}
              className="hover:text-red-500 disabled:opacity-60"
            >
              {isDeleting ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <Trash2 size={20} />
              )}
            </button>

            <span className="h-6 w-px bg-slate-200" />

            <button
              type="button"
              onClick={onClose}
              className="hover:text-[#111827]"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="px-8 py-8">
          <h2 className="text-[30px] font-black leading-tight text-[#111827]">
            {entry.title}
          </h2>

          <p className="mt-2 text-[16px] font-bold text-[#635BFF]">
            Екосистема: {entry.aquariumName}
          </p>

          {entry.imageUrl && (
            <img
              src={entry.imageUrl}
              alt={entry.title}
              className="mt-5 max-h-[300px] w-full rounded-2xl object-cover"
            />
          )}

          <p className="mt-7 whitespace-pre-line text-[17px] font-medium leading-8 text-[#475467]">
            {entry.text}
          </p>
        </div>
      </motion.div>
    </div>
  );
}

function DeleteConfirmModal({ entry, isDeleting, onCancel, onConfirm }) {
  if (!entry) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/45 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="w-full max-w-[430px] rounded-[28px] bg-white p-6 text-center shadow-2xl"
      >
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
          <Trash2 size={30} />
        </div>

        <h2 className="text-[22px] font-black text-[#111827]">
          Видалити цей запис?
        </h2>

        <p className="mt-3 text-sm font-medium leading-6 text-[#667085]">
          Ви збираєтесь видалити запис{" "}
          <span className="font-black text-[#111827]">"{entry.title}"</span>.
          Цю дію неможливо буде скасувати.
        </p>

        <div className="mt-7 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="h-12 rounded-xl border border-slate-200 text-sm font-black text-slate-700 hover:bg-slate-50"
          >
            Скасувати
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="h-12 rounded-xl bg-red-500 text-sm font-black text-white hover:bg-red-600 disabled:opacity-60"
          >
            {isDeleting ? "Видалення..." : "Так, видалити"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export function Diary() {
  const [entries, setEntries] = useState([]);
  const [aquariums, setAquariums] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedAquariumId, setSelectedAquariumId] = useState("all");
  const [selectedTag, setSelectedTag] = useState("all");

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [editingEntry, setEditingEntry] = useState(null);
  const [deleteEntryTarget, setDeleteEntryTarget] = useState(null);

  const loadEntries = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");

      const data = await getDiaryEntries({
        aquariumId: selectedAquariumId,
        tag: selectedTag,
        search,
      });

      setEntries(data);
    } catch (error) {
      setEntries([]);
      setError(error.message || "Не вдалося завантажити записи");
    } finally {
      setIsLoading(false);
    }
  }, [selectedAquariumId, selectedTag, search]);

  useEffect(() => {
    async function loadAquariums() {
      try {
        setError("");

        const data = await getAquariumNamesForDiary();

        setAquariums(data);
      } catch (error) {
        setError(error.message || "Не вдалося завантажити акваріуми");
      }
    }

    loadAquariums();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(loadEntries, 250);

    return () => clearTimeout(timeout);
  }, [loadEntries]);

  const sortedEntries = useMemo(() => {
    return [...entries].sort((first, second) => {
      if (first.isPinned && !second.isPinned) return -1;
      if (!first.isPinned && second.isPinned) return 1;

      return new Date(second.createdAt) - new Date(first.createdAt);
    });
  }, [entries]);

  const handleCreate = async (payload) => {
    try {
      if (!payload.title.trim()) {
        throw new Error("Введіть короткий заголовок");
      }

      if (!payload.observation.trim()) {
        throw new Error("Введіть текст спостереження");
      }

      if (!payload.aquariumId) {
        throw new Error("Оберіть акваріум");
      }

      setIsSaving(true);
      setError("");

      await createDiaryEntry(payload);

      setIsCreateOpen(false);

      await loadEntries();
    } catch (error) {
      setError(error.message || "Не вдалося створити запис");
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenEntry = async (entry) => {
    try {
      setError("");

      if (!entry?.id) {
        await loadEntries();

        throw new Error(
          "У цього запису немає id. Список було оновлено, спробуйте відкрити запис ще раз."
        );
      }

      const fullEntry = await getDiaryEntry(entry.id);

      setSelectedEntry({
        ...entry,
        ...fullEntry,
        id: entry.id,
      });
    } catch (error) {
      setError(error.message || "Не вдалося відкрити запис");
    }
  };

  const handleUpdate = async (payload) => {
    try {
      if (!editingEntry?.id) {
        throw new Error("Diary entry id is required");
      }

      if (!payload.title.trim()) {
        throw new Error("Введіть короткий заголовок");
      }

      if (!payload.observation.trim()) {
        throw new Error("Введіть текст спостереження");
      }

      setIsSaving(true);
      setError("");

      const updated = await updateDiaryEntry(editingEntry.id, payload);

      setEntries((prev) =>
        prev.map((entry) => (entry.id === editingEntry.id ? updated : entry))
      );

      setSelectedEntry(updated);
      setEditingEntry(null);

      await loadEntries();
    } catch (error) {
      setError(error.message || "Не вдалося оновити запис");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteConfirmed = async () => {
    try {
      if (!deleteEntryTarget?.id) {
        throw new Error("Diary entry id is required");
      }

      setIsDeleting(true);
      setError("");

      await deleteDiaryEntry(deleteEntryTarget.id);

      setEntries((prev) =>
        prev.filter((entry) => entry.id !== deleteEntryTarget.id)
      );

      setDeleteEntryTarget(null);
      setSelectedEntry(null);
      setEditingEntry(null);

      await loadEntries();
    } catch (error) {
      setError(error.message || "Не вдалося видалити запис");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <main className="min-h-screen bg-white text-[#111827]">
      <Sidebar />

      <section className="min-h-screen px-5 py-9 md:ml-[88px] md:px-10 lg:px-[54px]">
        <div className="mx-auto max-w-[1100px]">
          <header className="mb-7 flex items-start justify-between gap-5">
            <div>
              <h1 className="text-[24px] font-black tracking-[-0.02em] text-[#111827]">
                Щоденник спостережень
              </h1>

              <p className="mt-2 text-[13px] font-medium text-[#98a2b3]">
                Зберігайте важливі моменти та аналізуйте поведінку екосистеми
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsCreateOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-[#635BFF] px-6 py-3 text-sm font-black text-white transition hover:bg-[#5147f5]"
            >
              <Plus size={17} />
              Новий запис
            </button>
          </header>

          {error && (
            <div className="mb-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-red-500">
              {error}
            </div>
          )}

          <div className="mb-5 rounded-[18px] border border-[#edf0f5] bg-white p-4 shadow-[0_12px_34px_rgba(15,23,42,0.04)]">
            <div className="grid gap-3 md:grid-cols-[1fr_240px]">
              <div className="relative">
                <Search
                  size={17}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#98a2b3]"
                />

                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Пошук по нотатках..."
                  className="h-12 w-full rounded-xl border border-[#e3e9f2] pl-11 pr-4 text-sm font-semibold outline-none transition placeholder:text-[#98a2b3] focus:border-[#635BFF] focus:ring-4 focus:ring-[#635BFF]/10"
                />
              </div>

              <div className="relative">
                <select
                  value={selectedAquariumId}
                  onChange={(event) => setSelectedAquariumId(event.target.value)}
                  className="h-12 w-full appearance-none rounded-xl border border-[#e3e9f2] bg-white px-4 pr-9 text-sm font-black text-[#475467] outline-none transition focus:border-[#635BFF] focus:ring-4 focus:ring-[#635BFF]/10"
                >
                  <option value="all">Усі екосистеми</option>

                  {aquariums.map((aquarium) => (
                    <option key={aquarium.id} value={aquarium.id}>
                      {aquarium.name}
                    </option>
                  ))}
                </select>

                <ChevronDown
                  size={16}
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#98a2b3]"
                />
              </div>
            </div>
          </div>

          <div className="mb-8 flex flex-wrap gap-2">
            {tagFilters.map((filter) => {
              const active = selectedTag === filter.apiValue;

              return (
                <button
                  key={filter.key}
                  type="button"
                  onClick={() => setSelectedTag(filter.apiValue)}
                  className={`rounded-full border px-4 py-2 text-xs font-black transition ${
                    active
                      ? "border-[#635BFF] bg-[#635BFF] text-white"
                      : "border-[#edf0f5] bg-white text-[#475467] hover:border-[#635BFF]/40"
                  }`}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>

          {isLoading ? (
            <div className="flex h-[300px] items-center justify-center rounded-[18px] border border-[#edf0f5] bg-[#fbfcfe]">
              <div className="flex items-center gap-3 text-sm font-bold text-[#98a2b3]">
                <Loader2 size={20} className="animate-spin" />
                Завантаження записів...
              </div>
            </div>
          ) : sortedEntries.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {sortedEntries.map((entry, index) => (
                <DiaryCard
                  key={
                    entry.id ||
                    `${entry.createdAt || "entry"}-${entry.title || "note"}-${index}`
                  }
                  entry={entry}
                  index={index}
                  onOpen={handleOpenEntry}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-[18px] border border-dashed border-[#d9dee8] bg-[#fbfcfe] p-10 text-center">
              <p className="text-[16px] font-black text-[#111827]">
                Записів поки немає
              </p>

              <p className="mt-2 text-[13px] font-medium text-[#98a2b3]">
                Створіть новий запис або змініть фільтри пошуку.
              </p>
            </div>
          )}
        </div>
      </section>

      <AnimatePresence>
        {isCreateOpen && (
          <DiaryFormModal
            title="Новий запис у щоденник"
            aquariums={aquariums}
            isSaving={isSaving}
            onClose={() => setIsCreateOpen(false)}
            onSubmit={handleCreate}
          />
        )}

        {selectedEntry && !editingEntry && (
          <DiaryDetailsModal
            entry={selectedEntry}
            isDeleting={isDeleting}
            onClose={() => setSelectedEntry(null)}
            onEdit={() => setEditingEntry(selectedEntry)}
            onDelete={() => setDeleteEntryTarget(selectedEntry)}
          />
        )}

        {editingEntry && (
          <DiaryFormModal
            title="Редагування запису"
            aquariums={aquariums}
            initialData={editingEntry}
            isSaving={isSaving}
            onClose={() => setEditingEntry(null)}
            onSubmit={handleUpdate}
          />
        )}

        {deleteEntryTarget && (
          <DeleteConfirmModal
            entry={deleteEntryTarget}
            isDeleting={isDeleting}
            onCancel={() => setDeleteEntryTarget(null)}
            onConfirm={handleDeleteConfirmed}
          />
        )}
      </AnimatePresence>
    </main>
  );
}

export default Diary;