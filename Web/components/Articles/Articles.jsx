"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  BookOpen,
  ChevronLeft,
  Edit3,
  ImagePlus,
  Loader2,
  MoreVertical,
  Plus,
  Search,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { Sidebar } from "../Profile/Sidebar";
import {
  createArticle,
  createDraftArticle,
  deleteArticle,
  getArticle,
  getArticleCategories,
  getArticlesByTab,
  getDraftArticles,
  updateArticle,
} from "../../services/articlesApi";

function categoryIcon(category) {
  const name =
    typeof category === "object" && category !== null
      ? category.name || category.title || ""
      : category;

  const value = String(name || "").toLowerCase();

  if (value.includes("вод")) return "💧";
  if (value.includes("аква") || value.includes("рослин")) return "🌿";
  if (value.includes("хвор")) return "🩺";
  if (value.includes("облад")) return "⚙️";
  if (value.includes("без")) return "🐟";

  return "📘";
}

function ArticleCard({ article, index, onOpen, onEdit, onDelete, showActions }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="group relative overflow-hidden rounded-[18px] border border-slate-100 bg-white shadow-[0_12px_34px_rgba(15,23,42,0.04)] transition hover:-translate-y-1 hover:shadow-[0_20px_46px_rgba(15,23,42,0.08)]"
    >
      <button
        type="button"
        onClick={() => onOpen(article)}
        className="w-full text-left"
      >
        <div className="flex h-[150px] items-center justify-center bg-gradient-to-br from-[#dff8eb] to-[#eef2ff] text-5xl">
          {article.coverImageUrl ? (
            <img
              src={article.coverImageUrl}
              alt={article.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <span>{categoryIcon(article.category)}</span>
          )}
        </div>

        <div className="p-5">
          <p className="mb-3 text-[12px] font-black text-[#635BFF]">
            {article.category}
          </p>

          <h3 className="line-clamp-2 text-[18px] font-black leading-snug text-slate-950">
            {article.title}
          </h3>

          <p className="mt-3 line-clamp-3 text-sm font-medium leading-6 text-slate-500">
            {article.excerpt}
          </p>

          <div className="mt-5 flex items-center justify-between text-xs font-bold text-slate-400">
            <span>{article.authorName}</span>
            <span>{article.views} хв читання</span>
          </div>
        </div>
      </button>

      {article.isDraft && (
        <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-[11px] font-black uppercase text-slate-600 shadow-sm">
          Чернетка
        </span>
      )}

      {article.isOfficial && !article.isDraft && (
        <span className="absolute left-4 top-4 rounded-full bg-[#635BFF] px-3 py-1 text-[11px] font-black uppercase text-white shadow-sm">
          Офіційний гайд
        </span>
      )}

      {showActions && (
        <div className="absolute right-4 top-[130px]">
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-400 shadow-md transition hover:text-slate-800"
          >
            <MoreVertical size={18} />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-11 z-30 w-48 overflow-hidden rounded-xl border border-slate-100 bg-white shadow-xl">
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onEdit(article);
                }}
                className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-bold text-slate-700 hover:bg-slate-50"
              >
                <Edit3 size={15} />
                Редагувати
              </button>

              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onDelete(article);
                }}
                className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-bold text-red-500 hover:bg-red-50"
              >
                <Trash2 size={15} />
                Видалити статтю
              </button>
            </div>
          )}
        </div>
      )}
    </motion.article>
  );
}

function ArticleReaderModal({ article, onClose, onEdit, onDelete, showActions }) {
  if (!article) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 px-4 py-8">
      <motion.article
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.98 }}
        className="mx-auto max-w-[760px] overflow-hidden rounded-3xl bg-white shadow-2xl"
      >
        <div className="relative flex h-[230px] items-center justify-center bg-emerald-700 text-6xl text-white">
          {article.coverImageUrl ? (
            <img
              src={article.coverImageUrl}
              alt={article.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <span>{categoryIcon(article.category)}</span>
          )}

          <button
            type="button"
            onClick={onClose}
            className="absolute left-5 top-5 flex h-9 items-center gap-2 rounded-xl bg-black/25 px-3 text-sm font-black text-white backdrop-blur hover:bg-black/35"
          >
            <ChevronLeft size={16} />
            До списку
          </button>

          {showActions && (
            <div className="absolute right-5 top-5 flex gap-2">
              <button
                type="button"
                onClick={() => onEdit(article)}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-black/25 text-white backdrop-blur hover:bg-black/35"
              >
                <Edit3 size={16} />
              </button>

              <button
                type="button"
                onClick={() => onDelete(article)}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-500 text-white hover:bg-red-600"
              >
                <Trash2 size={16} />
              </button>
            </div>
          )}
        </div>

        <div className="px-8 py-8">
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <span className="rounded-md bg-emerald-50 px-3 py-1 text-[11px] font-black uppercase text-emerald-600">
              {article.category}
            </span>

            <span className="text-xs font-bold text-slate-400">
              {article.dateLabel}
            </span>

            <span className="text-xs font-bold text-slate-400">
              • {article.views} хв читання
            </span>
          </div>

          <h1 className="text-[32px] font-black leading-tight tracking-[-0.03em] text-slate-950">
            {article.title}
          </h1>

          <p className="mt-4 text-sm font-black text-slate-700">
            {article.authorName}
          </p>

          <div className="mt-8 whitespace-pre-line border-t border-slate-100 pt-8 text-[16px] font-medium leading-8 text-slate-600">
            {article.content || article.excerpt || "Текст статті відсутній."}
          </div>
        </div>
      </motion.article>
    </div>
  );
}

function ArticleEditorModal({
  isOpen,
  categories,
  initialData,
  isSaving,
  onClose,
  onPublish,
  onSaveDraft,
}) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [subtitle, setSubtitle] = useState(
    initialData?.subtitle || initialData?.excerpt || ""
  );
  const [category, setCategory] = useState(
    initialData?.categoryId || categories[0]?.id || ""
  );
  const [content, setContent] = useState(initialData?.content || "");

  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState(
    initialData?.coverImageUrl || ""
  );
  const [localError, setLocalError] = useState("");

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setSubtitle(initialData.subtitle || initialData.excerpt || "");
      setCategory(initialData.categoryId || categories[0]?.id || "");
      setContent(initialData.content || "");
      setCoverFile(null);
      setCoverPreview(initialData.coverImageUrl || "");
      setLocalError("");
    } else {
      setTitle("");
      setSubtitle("");
      setContent("");
      setCategory(categories[0]?.id || "");
      setCoverFile(null);
      setCoverPreview("");
      setLocalError("");
    }
  }, [initialData, categories]);

  useEffect(() => {
    if (!coverFile) return;

    const objectUrl = URL.createObjectURL(coverFile);
    setCoverPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [coverFile]);

  if (!isOpen) return null;

  const validateCover = (file) => {
    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      throw new Error("Обкладинка має бути у форматі PNG, JPG, JPEG або WEBP");
    }

    const maxSizeBytes = 10 * 1024 * 1024;

    if (file.size > maxSizeBytes) {
      throw new Error("Файл обкладинки має бути не більше 10 МБ");
    }
  };

  const handleCoverChange = (event) => {
    try {
      setLocalError("");

      const file = event.target.files?.[0];

      if (!file) return;

      validateCover(file);
      setCoverFile(file);
    } catch (error) {
      setCoverFile(null);
      setLocalError(error.message || "Не вдалося вибрати обкладинку");
    } finally {
      event.target.value = "";
    }
  };

  const removeCover = () => {
    setCoverFile(null);
    setCoverPreview("");
  };

  const payload = {
    title,
    subtitle,
    excerpt: subtitle,
    categoryId: category,
    content,
    existingImageId: initialData?.imageId || null,
    coverFile,
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/65 px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.98 }}
        className="mx-auto max-w-[860px] overflow-hidden rounded-3xl bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <button
            type="button"
            onClick={() => onSaveDraft(payload)}
            disabled={isSaving}
            className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-black text-slate-600 hover:bg-slate-50 disabled:opacity-60"
          >
            <ChevronLeft size={16} />
            Зберегти чернетку
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="h-10 rounded-xl px-4 text-sm font-black text-slate-500 hover:bg-slate-50 disabled:opacity-60"
            >
              Скасувати
            </button>

            <button
              type="button"
              onClick={() => onPublish(payload)}
              disabled={isSaving}
              className="flex h-10 items-center gap-2 rounded-xl bg-[#635BFF] px-5 text-sm font-black text-white hover:bg-[#5147f5] disabled:opacity-60"
            >
              {isSaving && <Loader2 size={16} className="animate-spin" />}
              Опублікувати
            </button>
          </div>
        </div>

        <div className="p-7">
          <label className="relative mb-5 flex h-[190px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 text-slate-400 transition hover:border-[#635BFF] hover:bg-[#f8f7ff]">
            {coverPreview ? (
              <>
                <img
                  src={coverPreview}
                  alt="Обкладинка статті"
                  className="h-full w-full object-cover"
                />

                <div className="absolute inset-0 flex items-center justify-center bg-black/35 opacity-0 transition hover:opacity-100">
                  <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-black text-slate-700 shadow-lg">
                    <ImagePlus size={15} />
                    Замінити обкладинку
                  </span>
                </div>
              </>
            ) : (
              <>
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#635BFF] shadow-sm">
                  <Upload size={22} />
                </div>

                <p className="text-sm font-black text-slate-700">
                  Додати головну обкладинку
                </p>

                <p className="mt-1 text-xs font-semibold text-slate-400">
                  PNG, JPG, JPEG або WEBP до 10 МБ
                </p>
              </>
            )}

            <input
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              className="hidden"
              onChange={handleCoverChange}
              disabled={isSaving}
            />
          </label>

          {coverPreview && (
            <button
              type="button"
              onClick={removeCover}
              disabled={isSaving}
              className="mb-5 inline-flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2 text-xs font-black text-red-500 transition hover:bg-red-100 disabled:opacity-60"
            >
              <Trash2 size={14} />
              Видалити обкладинку
            </button>
          )}

          <div className="mb-5">
            <p className="mb-3 text-[12px] font-black uppercase text-slate-400">
              Оберіть рубрику
            </p>

            <div className="flex flex-wrap gap-2">
              {categories.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setCategory(item.id)}
                  disabled={isSaving}
                  className={`rounded-full border px-4 py-2 text-xs font-black transition ${
                    String(category) === String(item.id)
                      ? "border-[#635BFF] bg-[#635BFF] text-white"
                      : "border-slate-200 text-slate-600 hover:border-[#635BFF]/40"
                  }`}
                >
                  {categoryIcon(item.name)} {item.name}
                </button>
              ))}
            </div>
          </div>

          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            disabled={isSaving}
            placeholder="Заголовок статті..."
            className="mb-4 w-full border-none text-[42px] font-black leading-tight tracking-[-0.05em] text-slate-950 outline-none placeholder:text-slate-300"
          />

          <input
            value={subtitle}
            onChange={(event) => setSubtitle(event.target.value)}
            disabled={isSaving}
            placeholder="Короткий опис..."
            className="mb-5 w-full border-none text-[20px] font-bold text-slate-400 outline-none placeholder:text-slate-300"
          />

          <div className="mb-3 flex gap-2 rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-500">
            <button
              type="button"
              className="rounded-lg px-3 py-2 text-sm font-black hover:bg-white"
            >
              B
            </button>

            <button
              type="button"
              className="rounded-lg px-3 py-2 text-sm font-black italic hover:bg-white"
            >
              I
            </button>

            <button
              type="button"
              className="rounded-lg px-3 py-2 text-sm font-black hover:bg-white"
            >
              H
            </button>
          </div>

          <textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            disabled={isSaving}
            placeholder="Почніть писати свою статтю тут..."
            className="min-h-[380px] w-full resize-none rounded-2xl border border-slate-200 px-5 py-4 text-[16px] font-medium leading-8 text-slate-700 outline-none focus:border-[#635BFF] focus:ring-4 focus:ring-[#635BFF]/10"
          />

          {localError && (
            <div className="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-red-500">
              {localError}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

function DraftsModal({ isOpen, drafts, isLoading, onClose, onCreate, onEdit }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 px-4">
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="w-full max-w-[420px] overflow-hidden rounded-3xl bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <h2 className="text-lg font-black text-slate-950">
              Написання статті
            </h2>

            <p className="text-xs font-semibold text-slate-400">
              Оберіть дію або продовжіть чернетку
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700"
          >
            <X size={19} />
          </button>
        </div>

        <div className="p-5">
          <button
            type="button"
            onClick={onCreate}
            className="mb-5 flex h-16 w-full items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-[#635BFF]/30 bg-[#f8f7ff] text-sm font-black text-[#635BFF] hover:border-[#635BFF]"
          >
            <Plus size={19} />
            Створити нову статтю
          </button>

          <p className="mb-3 text-center text-[11px] font-black uppercase text-slate-300">
            Або ваші чернетки
          </p>

          {isLoading ? (
            <div className="flex h-32 items-center justify-center text-sm font-bold text-slate-400">
              <Loader2 size={20} className="mr-2 animate-spin" />
              Завантаження...
            </div>
          ) : drafts.length > 0 ? (
            <div className="space-y-3">
              {drafts.map((draft) => (
                <button
                  key={draft.id}
                  type="button"
                  onClick={() => onEdit(draft)}
                  className="w-full rounded-2xl border border-slate-100 p-4 text-left hover:bg-slate-50"
                >
                  <p className="text-xs font-black text-[#635BFF]">
                    {draft.category}
                  </p>

                  <h3 className="mt-1 text-sm font-black text-slate-950">
                    {draft.title}
                  </h3>

                  <p className="mt-2 text-xs font-semibold text-slate-400">
                    Продовжити редагування
                  </p>
                </button>
              ))}
            </div>
          ) : (
            <p className="rounded-2xl border border-dashed border-slate-200 p-6 text-center text-sm font-bold text-slate-400">
              Чернеток поки немає
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}

function DeleteArticleModal({ article, isDeleting, onCancel, onConfirm }) {
  if (!article) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="w-full max-w-[480px] overflow-hidden rounded-3xl bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-red-100 bg-red-50 px-6 py-5">
          <div className="flex items-center gap-3">
            <AlertTriangle size={24} className="text-red-500" />

            <h2 className="text-xl font-black text-red-700">
              Видалення статті
            </h2>
          </div>

          <button
            type="button"
            onClick={onCancel}
            className="text-red-400 hover:text-red-600"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-6 py-6">
          <p className="text-sm font-medium leading-6 text-slate-600">
            Ви впевнені, що хочете видалити статтю{" "}
            <span className="font-black text-slate-950">
              «{article.title}»
            </span>
            ?
          </p>

          <div className="mt-5 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-semibold leading-6 text-red-600">
            Цю дію неможливо скасувати. Усі лайки, коментарі та збереження від
            інших користувачів будуть втрачені назавжди.
          </div>
        </div>

        <div className="flex justify-end gap-3 bg-slate-50 px-6 py-5">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="h-11 rounded-xl px-5 text-sm font-black text-slate-600 hover:bg-white"
          >
            Скасувати
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex h-11 items-center gap-2 rounded-xl bg-red-500 px-5 text-sm font-black text-white hover:bg-red-600 disabled:opacity-60"
          >
            {isDeleting ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Trash2 size={16} />
            )}
            Видалити назавжди
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export function Articles() {
  const [articles, setArticles] = useState([]);
  const [drafts, setDrafts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [activeTab, setActiveTab] = useState("all");

  const [selectedArticle, setSelectedArticle] = useState(null);
  const [editingArticle, setEditingArticle] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isDraftsOpen, setIsDraftsOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isDraftsLoading, setIsDraftsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  const isDraftsTab = activeTab === "drafts";

  const loadArticles = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");

      const data = await getArticlesByTab({
        tab: activeTab,
        search,
        category: selectedCategory,
      });

      if (isDraftsTab) {
        setDrafts(data);
        setArticles([]);
      } else {
        setArticles(data);
      }
    } catch (error) {
      if (isDraftsTab) {
        setDrafts([]);
      } else {
        setArticles([]);
      }

      setError(error.message || "Не вдалося завантажити статті");
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, search, selectedCategory, isDraftsTab]);

  const loadDrafts = useCallback(async () => {
    try {
      setIsDraftsLoading(true);
      setError("");

      const data = await getDraftArticles();

      setDrafts(data);
    } catch (error) {
      setDrafts([]);
      setError(error.message || "Не вдалося завантажити чернетки");
    } finally {
      setIsDraftsLoading(false);
    }
  }, []);

  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await getArticleCategories();

        setCategories(data);
      } catch (error) {
        setError(error.message || "Не вдалося завантажити категорії");
      }
    }

    loadCategories();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(loadArticles, 250);

    return () => clearTimeout(timeout);
  }, [loadArticles]);

  const visibleArticles = useMemo(() => {
    if (isDraftsTab) return drafts;

    return articles;
  }, [articles, drafts, isDraftsTab]);

  const openArticle = async (article) => {
    try {
      if (!article?.id) {
        throw new Error("Article id is required");
      }

      setError("");

      const fullArticle = await getArticle(article.id);

      setSelectedArticle({
        ...article,
        ...fullArticle,
        id: article.id,
      });
    } catch (error) {
      setError(error.message || "Не вдалося відкрити статтю");
    }
  };

  const openDrafts = async () => {
    setIsDraftsOpen(true);
    await loadDrafts();
  };

  const openCreate = () => {
    setEditingArticle(null);
    setIsEditorOpen(true);
    setIsDraftsOpen(false);
  };

  const openEdit = async (article) => {
    try {
      setError("");

      const fullArticle = article.content
        ? article
        : await getArticle(article.id);

      setEditingArticle({
        ...article,
        ...fullArticle,
        id: article.id,
      });

      setIsEditorOpen(true);
      setIsDraftsOpen(false);
    } catch (error) {
      setError(error.message || "Не вдалося відкрити редагування");
    }
  };

  const validateArticlePayload = (payload) => {
    if (!payload.title.trim()) {
      throw new Error("Введіть заголовок статті");
    }

    if (!payload.content.trim()) {
      throw new Error("Введіть текст статті");
    }

    if (!payload.categoryId) {
      throw new Error("Оберіть рубрику");
    }

    if (!payload.coverFile && !payload.existingImageId) {
      throw new Error("Додайте обкладинку статті");
    }
  };

 const handlePublish = async (payload) => {
  try {
    validateArticlePayload(payload);

    setIsSaving(true);
    setError("");

    let savedArticle = null;

    if (editingArticle?.id) {
      savedArticle = await updateArticle(editingArticle.id, payload);
    } else {
      savedArticle = await createArticle(payload);
    }

    const normalizedSavedArticle = {
      ...savedArticle,
      isDraft: false,
      isMine: true,
    };

    setIsEditorOpen(false);
    setEditingArticle(null);
    setSelectedArticle(null);

    setActiveTab("mine");

    setArticles((prev) => {
      const withoutDuplicate = prev.filter(
        (article) => String(article.id) !== String(normalizedSavedArticle.id)
      );

      return [normalizedSavedArticle, ...withoutDuplicate];
    });

    setDrafts((prev) =>
      prev.filter(
        (draft) => String(draft.id) !== String(normalizedSavedArticle.id)
      )
    );

    setTimeout(async () => {
      try {
        const freshArticles = await getArticlesByTab({
          tab: "mine",
          search,
          category: selectedCategory,
        });

        setArticles(freshArticles);
      } catch {
        // Якщо backend ще не встиг віддати нову статтю у списку,
        // залишаємо локально додану статтю, щоб вона не зникала з UI.
      }
    }, 700);
  } catch (error) {
    setError(error.message || "Не вдалося опублікувати статтю");
  } finally {
    setIsSaving(false);
  }
};

  const handleSaveDraft = async (payload) => {
    try {
      if (!payload.title.trim()) {
        throw new Error("Введіть хоча б заголовок для чернетки");
      }

      if (!payload.categoryId) {
        throw new Error("Оберіть рубрику");
      }

      setIsSaving(true);
      setError("");

      if (editingArticle?.id) {
        await updateArticle(editingArticle.id, payload);
      } else {
        await createDraftArticle(payload);
      }

      setIsEditorOpen(false);
      setEditingArticle(null);

      await loadDrafts();
      await loadArticles();
    } catch (error) {
      setError(error.message || "Не вдалося зберегти чернетку");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteConfirmed = async () => {
    try {
      if (!deleteTarget?.id) {
        throw new Error("Article id is required");
      }

      setIsDeleting(true);
      setError("");

      await deleteArticle(deleteTarget.id);

      setDeleteTarget(null);
      setSelectedArticle(null);

      await loadArticles();
      await loadDrafts();
    } catch (error) {
      setError(error.message || "Не вдалося видалити статтю");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <main className="min-h-screen bg-white text-slate-950">
      <Sidebar />

      <section className="min-h-screen px-5 py-9 md:ml-[88px] md:px-10 lg:px-[54px]">
        <div className="mx-auto max-w-[1080px]">
          <header className="mb-7 flex items-start justify-between gap-5">
            <div>
              <h1 className="text-[24px] font-black tracking-[-0.02em]">
                База знань
              </h1>

              <p className="mt-2 text-[13px] font-medium text-slate-400">
                Офіційні посібники та досвід спільноти акваріумістів
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={openDrafts}
                className="h-11 rounded-xl border border-slate-200 px-5 text-sm font-black text-slate-600 hover:bg-slate-50"
              >
                Дописати статтю
              </button>

              <button
                type="button"
                onClick={openCreate}
                className="flex h-11 items-center gap-2 rounded-xl bg-[#635BFF] px-5 text-sm font-black text-white hover:bg-[#5147f5]"
              >
                <Plus size={17} />
                Написати статтю
              </button>
            </div>
          </header>

          {error && (
            <div className="mb-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-red-500">
              {error}
            </div>
          )}

          <div className="mb-5 rounded-[18px] border border-slate-100 bg-white p-4 shadow-[0_12px_34px_rgba(15,23,42,0.04)]">
            <div className="grid gap-3 md:grid-cols-[1fr_auto]">
              <div className="relative">
                <Search
                  size={17}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Пошук статей, посібників або авторів..."
                  className="h-11 w-full rounded-xl border border-slate-200 pl-11 pr-4 text-sm font-semibold outline-none focus:border-[#635BFF]"
                />
              </div>

              <div className="flex rounded-xl bg-slate-100 p-1">
                {[
                  ["all", "Всі статті"],
                  ["official", "Офіційні"],
                  ["community", "Спільнота"],
                  ["mine", "Мої статті"],
                  ["drafts", "Чернетки"],
                ].map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setActiveTab(key)}
                    className={`h-9 rounded-lg px-4 text-xs font-black transition ${
                      activeTab === key
                        ? "bg-white text-slate-950 shadow-sm"
                        : "text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mb-7 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setSelectedCategory("all")}
              className={`rounded-full border px-4 py-2 text-xs font-black transition ${
                selectedCategory === "all"
                  ? "border-[#635BFF] bg-[#635BFF] text-white"
                  : "border-slate-200 text-slate-600 hover:border-[#635BFF]/40"
              }`}
            >
              Всі рубрики
            </button>

            {categories.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedCategory(item.id)}
                className={`rounded-full border px-4 py-2 text-xs font-black transition ${
                  String(selectedCategory) === String(item.id)
                    ? "border-[#635BFF] bg-[#635BFF] text-white"
                    : "border-slate-200 text-slate-600 hover:border-[#635BFF]/40"
                }`}
              >
                {categoryIcon(item.name)} {item.name}
              </button>
            ))}
          </div>

          {isLoading || (isDraftsTab && isDraftsLoading) ? (
            <div className="flex h-[320px] items-center justify-center rounded-2xl border border-slate-100 bg-slate-50">
              <Loader2 size={22} className="mr-3 animate-spin text-slate-400" />
              <span className="text-sm font-bold text-slate-400">
                Завантаження статей...
              </span>
            </div>
          ) : visibleArticles.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {visibleArticles.map((article, index) => (
                <ArticleCard
                  key={article.id || `${article.title}-${index}`}
                  article={article}
                  index={index}
                  onOpen={openArticle}
                  onEdit={openEdit}
                  onDelete={setDeleteTarget}
                  showActions={
                    activeTab === "mine" ||
                    activeTab === "drafts" ||
                    article.isMine ||
                    article.isDraft
                  }
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center">
              <BookOpen size={34} className="mx-auto mb-3 text-slate-400" />

              <p className="text-[16px] font-black text-slate-900">
                Статей не знайдено
              </p>

              <p className="mt-2 text-sm font-semibold text-slate-400">
                Спробуйте змінити пошук, рубрику або створіть нову статтю.
              </p>
            </div>
          )}
        </div>
      </section>

      <AnimatePresence>
        {selectedArticle && (
          <ArticleReaderModal
            article={selectedArticle}
            onClose={() => setSelectedArticle(null)}
            onEdit={openEdit}
            onDelete={setDeleteTarget}
            showActions={selectedArticle.isMine || selectedArticle.isDraft}
          />
        )}

        {isEditorOpen && (
          <ArticleEditorModal
            isOpen={isEditorOpen}
            categories={categories}
            initialData={editingArticle}
            isSaving={isSaving}
            onClose={() => {
              setIsEditorOpen(false);
              setEditingArticle(null);
            }}
            onPublish={handlePublish}
            onSaveDraft={handleSaveDraft}
          />
        )}

        {isDraftsOpen && (
          <DraftsModal
            isOpen={isDraftsOpen}
            drafts={drafts}
            isLoading={isDraftsLoading}
            onClose={() => setIsDraftsOpen(false)}
            onCreate={openCreate}
            onEdit={openEdit}
          />
        )}

        {deleteTarget && (
          <DeleteArticleModal
            article={deleteTarget}
            isDeleting={isDeleting}
            onCancel={() => setDeleteTarget(null)}
            onConfirm={handleDeleteConfirmed}
          />
        )}
      </AnimatePresence>
    </main>
  );
}

export default Articles;