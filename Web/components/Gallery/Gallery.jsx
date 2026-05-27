"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Camera,
  Check,
  ChevronDown,
  Loader2,
  Pencil,
  Plus,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { Sidebar } from "../Profile/Sidebar";
import {
  createGalleryPhoto,
  deleteGalleryPhoto,
  getAquariumNamesForGallery,
  getGalleryPhoto,
  getGalleryPhotos,
  updateGalleryPhoto,
  uploadGalleryImage,
} from "../../services/galleryApi";

const categories = [
  "Всі фотографії",
  "Рослини",
  "Жителі",
  "Загальний план",
  "Інше",
];

function getCategoryValue(value) {
  return value === "Всі фотографії" ? "all" : value;
}

function getCategoryIcon(category) {
  const value = String(category || "").toLowerCase();

  if (value.includes("всі")) return "🖼️";
  if (value.includes("рослин")) return "🌿";
  if (value.includes("жител")) return "🐠";
  if (value.includes("загальний")) return "🌊";
  if (value.includes("інше")) return "✨";

  return "🖼️";
}

function getAquariumIcon(value) {
  if (!value || value === "all") return "🌐";
  return "🐟";
}

function PrettyDropdown({
  label,
  value,
  options,
  onChange,
  placeholder,
  getIcon,
  disabled = false,
}) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption =
    options.find((option) => String(option.value) === String(value)) ||
    options[0];

  const selectedLabel = selectedOption?.label || placeholder;
  const selectedIcon = selectedOption ? getIcon?.(selectedOption) || "✨" : "✨";

  return (
    <div className="relative w-full min-w-[220px]">
      {label && (
        <p className="mb-2 text-[11px] font-black uppercase tracking-[0.12em] text-slate-400">
          {label}
        </p>
      )}

      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        className={`
          group flex h-12 w-full items-center justify-between gap-3
          rounded-2xl border border-slate-200 bg-white px-4
          text-left shadow-[0_10px_30px_rgba(15,23,42,0.04)]
          transition
          hover:border-[#635BFF]/50 hover:shadow-[0_16px_38px_rgba(99,91,255,0.12)]
          focus:border-[#635BFF] focus:outline-none focus:ring-4 focus:ring-[#635BFF]/10
          ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}
        `}
      >
        <span className="flex min-w-0 items-center gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#635BFF]/10 text-base">
            {selectedIcon}
          </span>

          <span className="min-w-0 truncate text-sm font-black text-slate-800">
            {selectedLabel || placeholder}
          </span>
        </span>

        <ChevronDown
          size={18}
          className={`shrink-0 text-slate-400 transition duration-200 group-hover:text-[#635BFF] ${
            isOpen ? "rotate-180 text-[#635BFF]" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <button
              type="button"
              aria-label="Закрити меню"
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-30 cursor-default"
            />

            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.16 }}
              className="
                absolute left-0 top-[calc(100%+10px)] z-40
                w-full overflow-hidden rounded-2xl border border-slate-100
                bg-white p-2 shadow-[0_24px_70px_rgba(15,23,42,0.16)]
              "
            >
              <div className="max-h-[260px] overflow-y-auto pr-1">
                {options.map((option) => {
                  const active = String(option.value) === String(value);
                  const optionIcon = getIcon?.(option) || "✨";

                  return (
                    <button
                      key={String(option.value)}
                      type="button"
                      onClick={() => {
                        onChange(option.value);
                        setIsOpen(false);
                      }}
                      className={`
                        flex w-full items-center justify-between gap-3 rounded-xl px-3 py-3
                        text-left transition
                        ${
                          active
                            ? "bg-[#635BFF] text-white shadow-[0_10px_24px_rgba(99,91,255,0.22)]"
                            : "text-slate-700 hover:bg-[#f8f7ff] hover:text-[#635BFF]"
                        }
                      `}
                    >
                      <span className="flex min-w-0 items-center gap-3">
                        <span
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-base ${
                            active ? "bg-white/20" : "bg-slate-100"
                          }`}
                        >
                          {optionIcon}
                        </span>

                        <span className="min-w-0 truncate text-sm font-black">
                          {option.label}
                        </span>
                      </span>

                      {active && <Check size={17} className="shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function GalleryCard({ photo, index, onOpen }) {
  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      onClick={() => onOpen(photo)}
      className="group relative h-[210px] overflow-hidden rounded-[18px] bg-slate-100 text-left shadow-[0_12px_34px_rgba(15,23,42,0.05)] transition hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(15,23,42,0.10)]"
    >
      {photo.imageUrl ? (
        <img
          src={photo.imageUrl}
          alt={photo.signature || "Фото галереї"}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#a78bfa] to-[#60a5fa] text-4xl">
          🐟
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/65 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />

      <div className="absolute bottom-0 left-0 right-0 translate-y-3 p-4 opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100">
        <p className="text-sm font-black text-white">
          {photo.signature || "Без опису"}
        </p>

        <p className="mt-1 text-xs font-bold text-white/70">
          {photo.aquariumName}
        </p>
      </div>
    </motion.button>
  );
}

function UploadPhotoModal({
  isOpen,
  aquariums,
  isSaving,
  onClose,
  onSubmit,
}) {
  const allowedCategories = ["Загальний план", "Жителі", "Рослини", "Інше"];

  const [file, setFile] = useState(null);
  const [aquariumId, setAquariumId] = useState(aquariums[0]?.id || "");
  const [category, setCategory] = useState("Загальний план");
  const [signature, setSignature] = useState("");
  const [preview, setPreview] = useState("");

  useEffect(() => {
    if (!aquariumId && aquariums[0]?.id) {
      setAquariumId(aquariums[0].id);
    }
  }, [aquariums, aquariumId]);

  useEffect(() => {
    if (!file) {
      setPreview("");
      return;
    }

    const url = URL.createObjectURL(file);
    setPreview(url);

    return () => URL.revokeObjectURL(url);
  }, [file]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    onSubmit({
      file,
      aquariumId,
      category,
      signature,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4">
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.98 }}
        className="w-full max-w-[420px] overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h2 className="text-[17px] font-black text-slate-950">
            Завантажити фотографію
          </h2>

          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4 px-5 py-5">
          <label className="block">
            <input
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              className="hidden"
              onChange={(event) => setFile(event.target.files?.[0] || null)}
              disabled={isSaving}
            />

            <div className="flex h-[145px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-[#b9c7ff] bg-[#fbfcff] text-center transition hover:border-[#635BFF] hover:bg-[#f7f5ff]">
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <>
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#635BFF] shadow-sm">
                    <Upload size={20} />
                  </div>

                  <p className="text-[13px] font-black text-slate-700">
                    Натисніть для вибору файлу
                  </p>

                  <p className="mt-1 max-w-[230px] text-[11px] font-semibold leading-4 text-slate-400">
                    або перетягніть фотографію сюди, до 10 МБ
                  </p>
                </>
              )}
            </div>
          </label>

          <div>
            <label className="mb-2 block text-[13px] font-black text-slate-700">
              Для якої екосистеми?
            </label>

            <div className="relative">
              <select
                value={aquariumId}
                onChange={(event) => setAquariumId(event.target.value)}
                disabled={isSaving}
                className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 pr-10 text-[13px] font-bold text-slate-700 outline-none transition focus:border-[#635BFF] focus:ring-4 focus:ring-[#635BFF]/10"
              >
                {aquariums.length === 0 ? (
                  <option value="">Акваріуми відсутні</option>
                ) : (
                  aquariums.map((aquarium) => (
                    <option key={aquarium.id} value={aquarium.id}>
                      {aquarium.name}
                    </option>
                  ))
                )}
              </select>

              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
            </div>
          </div>

          <div>
            <p className="mb-2 text-[13px] font-black text-slate-700">
              Що на фото? (Категорія)
            </p>

            <div className="flex flex-wrap gap-2">
              {allowedCategories.map((item) => {
                const active = category === item;

                const icon =
                  item === "Загальний план"
                    ? "🖼️"
                    : item === "Жителі"
                    ? "🐟"
                    : item === "Рослини"
                    ? "🌿"
                    : "⚙️";

                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setCategory(item)}
                    disabled={isSaving}
                    className={`
                      rounded-lg border px-3 py-2 text-[12px] font-black transition
                      ${
                        active
                          ? "border-[#635BFF] bg-[#635BFF] text-white shadow-[0_8px_18px_rgba(99,91,255,0.22)]"
                          : "border-slate-200 bg-white text-slate-600 hover:border-[#635BFF]/40 hover:bg-[#f8f7ff]"
                      }
                    `}
                  >
                    {icon} {item}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-[13px] font-black text-slate-700">
              Підпис (Опціонально)
            </label>

            <input
              value={signature}
              onChange={(event) => setSignature(event.target.value)}
              disabled={isSaving}
              placeholder="Наприклад: Вигляд після прополки..."
              className="h-11 w-full rounded-xl border border-slate-200 px-4 text-[13px] font-semibold text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#635BFF] focus:ring-4 focus:ring-[#635BFF]/10"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-5 pb-5">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="h-11 rounded-xl px-5 text-[13px] font-black text-slate-500 transition hover:bg-slate-50 hover:text-slate-800"
          >
            Скасувати
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSaving}
            className="flex h-11 items-center gap-2 rounded-xl bg-[#635BFF] px-5 text-[13px] font-black text-white shadow-[0_12px_24px_rgba(99,91,255,0.24)] transition hover:bg-[#5147f5] disabled:opacity-60"
          >
            {isSaving && <Loader2 size={16} className="animate-spin" />}
            Зберегти в галерею
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function PhotoViewerModal({
  photo,
  isSaving,
  isDeleting,
  onClose,
  onEdit,
  onDelete,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [signature, setSignature] = useState(photo?.signature || "");

  useEffect(() => {
    setSignature(photo?.signature || "");
    setIsEditing(false);
  }, [photo]);

  if (!photo) return null;

  const handleSave = () => {
    onEdit(signature);
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.98 }}
        className="relative flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl bg-slate-950 shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div>
            <p className="text-sm font-black text-white">
              {photo.aquariumName}
            </p>
            <p className="mt-1 text-xs font-semibold text-white/50">
              Особиста галерея
            </p>
          </div>

          <div className="flex items-center gap-3 text-white/70">
            <button
              type="button"
              onClick={() => setIsEditing((prev) => !prev)}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 transition hover:bg-white/15 hover:text-white"
            >
              <Pencil size={18} />
            </button>

            <button
              type="button"
              onClick={onDelete}
              disabled={isDeleting}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 transition hover:bg-red-500 hover:text-white disabled:opacity-60"
            >
              {isDeleting ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Trash2 size={18} />
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 transition hover:bg-white/15 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="flex min-h-0 flex-1 items-center justify-center bg-black">
          {photo.imageUrl ? (
            <img
              src={photo.imageUrl}
              alt={photo.signature || "Фото"}
              className="max-h-[66vh] w-full object-contain"
            />
          ) : (
            <div className="flex h-[420px] w-full items-center justify-center text-5xl">
              🐟
            </div>
          )}
        </div>

        <div className="border-t border-white/10 px-5 py-4">
          {isEditing ? (
            <div className="flex flex-col gap-3 md:flex-row">
              <input
                value={signature}
                onChange={(event) => setSignature(event.target.value)}
                disabled={isSaving}
                className="h-11 flex-1 rounded-xl border border-white/10 bg-white/10 px-4 text-sm font-semibold text-white outline-none placeholder:text-white/40 focus:border-[#635BFF]"
                placeholder="Опис фото"
              />

              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="h-11 rounded-xl bg-[#635BFF] px-5 text-sm font-black text-white disabled:opacity-60"
              >
                {isSaving ? "Збереження..." : "Зберегти"}
              </button>
            </div>
          ) : (
            <p className="whitespace-pre-line text-sm font-semibold leading-6 text-white/80">
              {photo.signature || "Опис відсутній."}
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}

function DeletePhotoModal({ photo, isDeleting, onCancel, onConfirm }) {
  if (!photo) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/45 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="w-full max-w-[390px] rounded-3xl bg-white p-6 text-center shadow-2xl"
      >
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
          <Trash2 size={30} />
        </div>

        <h2 className="text-xl font-black text-slate-950">
          Видалити фото?
        </h2>

        <p className="mt-3 text-sm font-medium leading-6 text-slate-500">
          Фото буде назавжди видалено з галереї. Цю дію неможливо скасувати.
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
            {isDeleting ? "Видалення..." : "Видалити"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export function Gallery() {
  const [aquariums, setAquariums] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [selectedAquariumName, setSelectedAquariumName] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");

  const [isLoading, setIsLoading] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  const loadPhotos = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");

      const data = await getGalleryPhotos({
        aquariumName: selectedAquariumName,
        category: selectedCategory,
        sortOrder,
      });

      setPhotos(data);
    } catch (error) {
      setPhotos([]);
      setError(error.message || "Не вдалося завантажити галерею");
    } finally {
      setIsLoading(false);
    }
  }, [selectedAquariumName, selectedCategory, sortOrder]);

  useEffect(() => {
    async function loadAquariums() {
      try {
        setError("");

        const data = await getAquariumNamesForGallery();

        setAquariums(data);
      } catch (error) {
        setError(error.message || "Не вдалося завантажити акваріуми");
      }
    }

    loadAquariums();
  }, []);

  useEffect(() => {
    loadPhotos();
  }, [loadPhotos]);

  const handleOpenPhoto = async (photo) => {
    try {
      if (!photo?.id) {
        throw new Error("Gallery photo id is required");
      }

      setError("");

      const fullPhoto = await getGalleryPhoto(photo.id);

      setSelectedPhoto({
        ...photo,
        ...fullPhoto,
        id: photo.id,
      });
    } catch (error) {
      setError(error.message || "Не вдалося відкрити фото");
    }
  };

  const handleUpload = async ({ file, aquariumId, category, signature }) => {
    try {
      if (!file) {
        throw new Error("Оберіть фото");
      }

      if (!aquariumId) {
        throw new Error("Оберіть акваріум");
      }

      setIsSaving(true);
      setError("");

      const imageId = await uploadGalleryImage(file);

      await createGalleryPhoto({
        image_id: imageId,
        aquarium_id: aquariumId,
        category,
        signature,
        created_at: new Date().toISOString(),
      });

      setIsUploadOpen(false);
      await loadPhotos();
    } catch (error) {
      setError(error.message || "Не вдалося завантажити фото");
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateSignature = async (signature) => {
    try {
      if (!selectedPhoto?.id) {
        throw new Error("Gallery photo id is required");
      }

      setIsSaving(true);
      setError("");

      const updated = await updateGalleryPhoto(selectedPhoto.id, {
        signature,
      });

      setSelectedPhoto((prev) => ({
        ...prev,
        ...updated,
        id: prev.id,
        signature,
      }));

      setPhotos((prev) =>
        prev.map((photo) =>
          photo.id === selectedPhoto.id
            ? {
                ...photo,
                signature,
              }
            : photo
        )
      );
    } catch (error) {
      setError(error.message || "Не вдалося оновити фото");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteConfirmed = async () => {
    try {
      if (!deleteTarget?.id) {
        throw new Error("Gallery photo id is required");
      }

      setIsDeleting(true);
      setError("");

      await deleteGalleryPhoto(deleteTarget.id);

      setPhotos((prev) => prev.filter((photo) => photo.id !== deleteTarget.id));

      setDeleteTarget(null);
      setSelectedPhoto(null);

      await loadPhotos();
    } catch (error) {
      setError(error.message || "Не вдалося видалити фото");
    } finally {
      setIsDeleting(false);
    }
  };

  const aquariumOptions = [
    {
      value: "all",
      label: "Усі екосистеми",
    },
    ...aquariums.map((aquarium) => ({
      value: aquarium.name,
      label: aquarium.name,
      aquarium,
    })),
  ];

  const categoryOptions = [
    {
      value: "all",
      label: "Всі фотографії",
    },
    ...categories
      .filter((item) => item !== "Всі фотографії")
      .map((category) => ({
        value: getCategoryValue(category),
        label: category,
      })),
  ];

  return (
    <main className="min-h-screen bg-white text-slate-950">
      <Sidebar />

      <section className="min-h-screen px-5 py-9 md:ml-[88px] md:px-10 lg:px-[54px]">
        <div className="mx-auto max-w-[1080px]">
          <header className="mb-8 flex items-start justify-between gap-5">
            <div>
              <h1 className="text-[24px] font-black tracking-[-0.02em] text-slate-950">
                Особиста Галерея
              </h1>

              <p className="mt-2 text-[13px] font-medium text-slate-400">
                Візуальна історія еволюції вашої екосистеми
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsUploadOpen(true)}
              className="flex h-11 items-center gap-2 rounded-xl bg-[#635BFF] px-5 text-sm font-black text-white transition hover:bg-[#5147f5]"
            >
              <Plus size={18} />
              Завантажити фото
            </button>
          </header>

          {error && (
            <div className="mb-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-red-500">
              {error}
            </div>
          )}

          <div className="mb-7 rounded-[24px] border border-slate-100 bg-white p-4 shadow-[0_16px_45px_rgba(15,23,42,0.05)]">
            <div className="grid gap-4 lg:grid-cols-[1fr_1fr_auto] lg:items-end">
              <PrettyDropdown
                label="Екосистема"
                value={selectedAquariumName}
                placeholder="Усі екосистеми"
                options={aquariumOptions}
                onChange={setSelectedAquariumName}
                getIcon={(option) => getAquariumIcon(option.value)}
              />

              <PrettyDropdown
                label="Категорія фото"
                value={selectedCategory}
                placeholder="Всі фотографії"
                options={categoryOptions}
                onChange={setSelectedCategory}
                getIcon={(option) => getCategoryIcon(option.label)}
              />

              <div>
                <p className="mb-2 text-[11px] font-black uppercase tracking-[0.12em] text-slate-400">
                  Сортування
                </p>

                <div className="flex h-12 rounded-2xl bg-slate-100 p-1">
                  <button
                    type="button"
                    onClick={() => setSortOrder("newest")}
                    className={`rounded-xl px-4 text-xs font-black transition ${
                      sortOrder === "newest"
                        ? "bg-white text-slate-950 shadow-sm"
                        : "text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    Найновіші
                  </button>

                  <button
                    type="button"
                    onClick={() => setSortOrder("oldest")}
                    className={`rounded-xl px-4 text-xs font-black transition ${
                      sortOrder === "oldest"
                        ? "bg-white text-slate-950 shadow-sm"
                        : "text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    Найстаріші
                  </button>
                </div>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="flex h-[300px] items-center justify-center rounded-[18px] border border-slate-100 bg-slate-50">
              <div className="flex items-center gap-3 text-sm font-bold text-slate-400">
                <Loader2 size={20} className="animate-spin" />
                Завантаження галереї...
              </div>
            </div>
          ) : photos.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {photos.map((photo, index) => (
                <GalleryCard
                  key={photo.id || `${photo.imageUrl}-${index}`}
                  photo={photo}
                  index={index}
                  onOpen={handleOpenPhoto}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-[18px] border border-dashed border-slate-200 bg-slate-50 p-10 text-center">
              <Camera size={34} className="mx-auto mb-3 text-slate-400" />

              <p className="text-[16px] font-black text-slate-900">
                Фото поки немає
              </p>

              <p className="mt-2 text-sm font-semibold text-slate-400">
                Завантажте перше фото або змініть фільтри.
              </p>
            </div>
          )}
        </div>
      </section>

      <AnimatePresence>
        {isUploadOpen && (
          <UploadPhotoModal
            isOpen={isUploadOpen}
            aquariums={aquariums}
            isSaving={isSaving}
            onClose={() => setIsUploadOpen(false)}
            onSubmit={handleUpload}
          />
        )}

        {selectedPhoto && (
          <PhotoViewerModal
            photo={selectedPhoto}
            isSaving={isSaving}
            isDeleting={isDeleting}
            onClose={() => setSelectedPhoto(null)}
            onEdit={handleUpdateSignature}
            onDelete={() => setDeleteTarget(selectedPhoto)}
          />
        )}

        {deleteTarget && (
          <DeletePhotoModal
            photo={deleteTarget}
            isDeleting={isDeleting}
            onCancel={() => setDeleteTarget(null)}
            onConfirm={handleDeleteConfirmed}
          />
        )}
      </AnimatePresence>
    </main>
  );
}

export default Gallery;