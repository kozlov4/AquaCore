"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  Droplets,
  Loader2,
  Plus,
  Search,
  ShieldAlert,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { Sidebar } from "../Profile/Sidebar";
import {
  analyzeCompatibility,
  getSpeciesForCompatibility,
} from "../../services/compatibilityApi";

function getStatusView(status) {
  const normalized = String(status || "").toLowerCase();

  if (
    normalized.includes("full") ||
    normalized.includes("good") ||
    normalized.includes("safe") ||
    normalized.includes("суміс")
  ) {
    return {
      icon: Sparkles,
      title: "Повна сумісність",
      color: "green",
      header: "bg-emerald-50",
      text: "text-emerald-700",
      border: "border-emerald-100",
      dot: "bg-emerald-500",
    };
  }

  if (
    normalized.includes("partial") ||
    normalized.includes("warning") ||
    normalized.includes("caution") ||
    normalized.includes("attention") ||
    normalized.includes("уваг") ||
    normalized.includes("част")
  ) {
    return {
      icon: AlertTriangle,
      title: "Часткова сумісність",
      color: "yellow",
      header: "bg-yellow-50",
      text: "text-yellow-700",
      border: "border-yellow-100",
      dot: "bg-yellow-500",
    };
  }

  if (
    normalized.includes("aggression") ||
    normalized.includes("risk") ||
    normalized.includes("можлива") ||
    normalized.includes("агрес")
  ) {
    return {
      icon: ShieldAlert,
      title: "Можлива агресія",
      color: "orange",
      header: "bg-orange-50",
      text: "text-orange-700",
      border: "border-orange-100",
      dot: "bg-orange-500",
    };
  }

  if (
    normalized.includes("critical") ||
    normalized.includes("bad") ||
    normalized.includes("not") ||
    normalized.includes("несум") ||
    normalized.includes("крит")
  ) {
    return {
      icon: ShieldAlert,
      title: "Критична несумісність",
      color: "red",
      header: "bg-red-50",
      text: "text-red-700",
      border: "border-red-100",
      dot: "bg-red-500",
    };
  }

  return {
    icon: ShieldAlert,
    title: "Результат аналізу",
    color: "gray",
    header: "bg-slate-50",
    text: "text-slate-700",
    border: "border-slate-100",
    dot: "bg-slate-400",
  };
}

function SpeciesPickerModal({
  isOpen,
  onClose,
  species,
  search,
  setSearch,
  onAdd,
  isLoading,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4">
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.98 }}
        className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl"
      >
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-950">
              Додати вид до збірки
            </h2>
            <p className="mt-1 text-sm font-semibold text-slate-400">
              Оберіть рибу, рослину або безхребетного для аналізу.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition hover:bg-slate-200"
          >
            <X size={18} />
          </button>
        </div>

        <div className="relative mb-4">
          <Search
            size={17}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Пошук виду..."
            className="h-12 w-full rounded-xl border border-slate-200 pl-11 pr-4 text-sm font-semibold outline-none transition focus:border-[#635BFF] focus:ring-4 focus:ring-[#635BFF]/10"
          />
        </div>

        <div className="max-h-[430px] space-y-3 overflow-y-auto pr-1">
          {isLoading ? (
            <div className="flex h-40 items-center justify-center text-sm font-bold text-slate-400">
              <Loader2 size={20} className="mr-2 animate-spin" />
              Завантаження видів...
            </div>
          ) : species.length > 0 ? (
            species.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onAdd(item)}
                className="flex w-full items-center gap-4 rounded-2xl border border-slate-100 bg-white p-3 text-left transition hover:border-[#635BFF]/40 hover:bg-[#f8f7ff]"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-100">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-xl">🐟</span>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="font-black text-slate-900">{item.name}</h3>
                  <p className="mt-1 text-xs font-semibold text-slate-400">
                    {item.scientificName || item.category || "Вид"}
                  </p>
                </div>

                <span className="rounded-xl bg-[#635BFF] px-3 py-2 text-xs font-black text-white">
                  Додати
                </span>
              </button>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center">
              <p className="text-sm font-black text-slate-700">
                Видів не знайдено
              </p>
              <p className="mt-1 text-xs font-semibold text-slate-400">
                Спробуйте змінити пошуковий запит.
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

function SelectedSpeciesCard({ item, onQuantityChange, onRemove }) {
  return (
    <article className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_10px_28px_rgba(15,23,42,0.035)]">
      <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-blue-50">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-xl">🐟</span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="text-sm font-black text-slate-950">{item.name}</h3>
        <p className="mt-1 text-xs font-semibold text-slate-400">
          {item.scientificName || item.category || "Вид"}
        </p>

        <div className="mt-2 flex gap-2 text-[10px] font-black uppercase">
          {item.minVolume && (
            <span className="rounded bg-red-50 px-2 py-1 text-red-500">
              від {item.minVolume} л
            </span>
          )}
          {item.temperature && (
            <span className="rounded bg-green-50 px-2 py-1 text-green-600">
              {item.temperature}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center rounded-xl bg-slate-50 p-1">
        <button
          type="button"
          onClick={() => onQuantityChange(item.localId, item.quantity - 1)}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-white"
        >
          -
        </button>

        <span className="w-8 text-center text-sm font-black text-slate-900">
          {item.quantity}
        </span>

        <button
          type="button"
          onClick={() => onQuantityChange(item.localId, item.quantity + 1)}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-white"
        >
          +
        </button>
      </div>

      <button
        type="button"
        onClick={() => onRemove(item.localId)}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-300 transition hover:bg-red-50 hover:text-red-500"
      >
        <X size={16} />
      </button>
    </article>
  );
}

function ResultCard({ result, isLoading }) {
  if (isLoading) {
    return (
      <section className="rounded-3xl border border-slate-100 bg-white p-8 shadow-[0_20px_55px_rgba(15,23,42,0.08)]">
        <div className="flex h-64 items-center justify-center text-sm font-bold text-slate-400">
          <Loader2 size={22} className="mr-3 animate-spin" />
          Виконуємо аналіз сумісності...
        </div>
      </section>
    );
  }

  if (!result) {
    return (
      <section className="rounded-3xl border border-slate-100 bg-white p-8 shadow-[0_20px_55px_rgba(15,23,42,0.08)]">
        <div className="flex h-64 flex-col items-center justify-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f4f2ff] text-[#635BFF]">
            <Droplets size={30} />
          </div>
          <h3 className="text-lg font-black text-slate-900">
            Додайте види до збірки
          </h3>
          <p className="mt-2 max-w-sm text-sm font-semibold text-slate-400">
            Після додавання риб або інших мешканців система автоматично
            перевірить їхню сумісність.
          </p>
        </div>
      </section>
    );
  }

  const statusView = getStatusView(result.status || result.statusTitle);
  const Icon = statusView.icon;
  const requirements = result.requirements || {};

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-[0_20px_55px_rgba(15,23,42,0.08)]">
      <div className={`p-6 ${statusView.header}`}>
        <div className="flex items-start gap-4">
          <div className={`rounded-2xl bg-white p-3 ${statusView.text}`}>
            <Icon size={26} />
          </div>

          <div>
            <h2 className={`text-lg font-black ${statusView.text}`}>
              {result.statusTitle || statusView.title}
            </h2>

            <p className={`mt-1 text-sm font-semibold ${statusView.text}`}>
              {result.statusDescription}
            </p>
          </div>
        </div>
      </div>

      <div className="border-b border-slate-100 p-6">
        <p className="mb-4 text-[11px] font-black uppercase tracking-[0.06em] text-slate-400">
          Виявлені конфлікти
        </p>

        {result.conflicts?.length > 0 ? (
          <div className="space-y-4">
            {result.conflicts.map((conflict, index) => (
              <div
                key={`${conflict.title}-${index}`}
                className="flex items-start gap-3"
              >
                <AlertTriangle
                  size={16}
                  className="mt-1 shrink-0 text-red-500"
                />

                <div>
                  <h3 className="text-sm font-black text-slate-900">
                    {conflict.title}
                  </h3>
                  <p className="mt-1 text-sm font-medium leading-5 text-slate-500">
                    {conflict.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-600">
            ✅ Значних конфліктів не знайдено.
          </div>
        )}
      </div>

      <div className="p-6">
        <p className="mb-4 text-[11px] font-black uppercase tracking-[0.06em] text-slate-400">
          Вимоги до екосистеми
        </p>

        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
            <span className="flex items-center gap-2 text-sm font-bold text-slate-500">
              💧 Мін. об’єм:
            </span>
            <span className="text-sm font-black text-slate-900">
              {requirements.minVolume ? `від ${requirements.minVolume} л` : "—"}
            </span>
          </div>

          <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
            <span className="flex items-center gap-2 text-sm font-bold text-slate-500">
              🌡 Спільна температура:
            </span>
            <span className="rounded-md bg-emerald-50 px-2 py-1 text-sm font-black text-emerald-600">
              {requirements.temperature || "—"}
            </span>
          </div>

          <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
            <span className="flex items-center gap-2 text-sm font-bold text-slate-500">
              🧪 Спільний pH:
            </span>
            <span className="rounded-md bg-emerald-50 px-2 py-1 text-sm font-black text-emerald-600">
              {requirements.ph || "—"}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Compatibility() {
  const [selectedItems, setSelectedItems] = useState([]);
  const [species, setSpecies] = useState([]);
  const [speciesSearch, setSpeciesSearch] = useState("");
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const [result, setResult] = useState(null);
  const [isLoadingSpecies, setIsLoadingSpecies] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState("");

  const totalQuantity = useMemo(() => {
    return selectedItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [selectedItems]);

  useEffect(() => {
    async function loadSpecies() {
      try {
        setIsLoadingSpecies(true);
        setError("");

        const data = await getSpeciesForCompatibility(speciesSearch);

        setSpecies(data);
      } catch (error) {
        setSpecies([]);
        setError(error.message || "Не вдалося завантажити види");
      } finally {
        setIsLoadingSpecies(false);
      }
    }

    const timeout = setTimeout(loadSpecies, 250);

    return () => clearTimeout(timeout);
  }, [speciesSearch]);

  useEffect(() => {
    async function runAnalyze() {
      try {
        if (selectedItems.length === 0) {
          setResult(null);
          return;
        }

        setIsAnalyzing(true);
        setError("");

        const data = await analyzeCompatibility(selectedItems);

        setResult(data);
      } catch (error) {
        setResult(null);
        setError(error.message || "Не вдалося виконати аналіз сумісності");
      } finally {
        setIsAnalyzing(false);
      }
    }

    const timeout = setTimeout(runAnalyze, 300);

    return () => clearTimeout(timeout);
  }, [selectedItems]);

  const handleAddSpecies = (item) => {
    setSelectedItems((prev) => {
      const existing = prev.find((entry) => entry.speciesId === item.id);

      if (existing) {
        return prev.map((entry) =>
          entry.speciesId === item.id
            ? { ...entry, quantity: entry.quantity + 1 }
            : entry
        );
      }

      return [
        ...prev,
        {
          ...item,
          localId: `${item.id}-${Date.now()}`,
          speciesId: item.id,
          quantity: 1,
        },
      ];
    });

    setIsPickerOpen(false);
  };

  const handleQuantityChange = (localId, nextQuantity) => {
    setSelectedItems((prev) =>
      prev.map((item) =>
        item.localId === localId
          ? { ...item, quantity: Math.max(1, Number(nextQuantity) || 1) }
          : item
      )
    );
  };

  const handleRemove = (localId) => {
    setSelectedItems((prev) => prev.filter((item) => item.localId !== localId));
  };

  const handleClear = () => {
    setSelectedItems([]);
    setResult(null);
    setError("");
  };

  return (
    <main className="min-h-screen bg-white text-slate-950">
      <Sidebar />

      <section className="min-h-screen px-5 py-9 md:ml-[88px] md:px-10 lg:px-[54px]">
        <div className="mx-auto max-w-[1050px]">
          <header className="mb-8 flex items-start justify-between gap-5">
            <div>
              <h1 className="text-[24px] font-black tracking-[-0.02em] text-slate-950">
                Лабораторія сумісності
              </h1>

              <p className="mt-2 text-[13px] font-medium text-slate-400">
                Зберіть віртуальний акваріум та перевірте, чи уживуться види разом
              </p>
            </div>

            <button
              type="button"
              onClick={handleClear}
              disabled={selectedItems.length === 0}
              className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Trash2 size={15} />
              Очистити все
            </button>
          </header>

          {error && (
            <div className="mb-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-red-500">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px]">
            <section>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-[12px] font-black uppercase tracking-[0.08em] text-slate-400">
                  Ваша збірка ({selectedItems.length} види, {totalQuantity} шт.)
                </h2>
              </div>

              <div className="space-y-4">
                {selectedItems.map((item) => (
                  <SelectedSpeciesCard
                    key={item.localId}
                    item={item}
                    onQuantityChange={handleQuantityChange}
                    onRemove={handleRemove}
                  />
                ))}

                <button
                  type="button"
                  onClick={() => setIsPickerOpen(true)}
                  className="flex h-24 w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 text-sm font-black text-slate-500 transition hover:border-[#635BFF] hover:bg-[#f8f7ff] hover:text-[#635BFF]"
                >
                  <Plus size={22} />
                  <span className="mt-2">Додати вид до збірки</span>
                </button>
              </div>
            </section>

            <section>
              <h2 className="mb-4 text-[12px] font-black uppercase tracking-[0.08em] text-slate-400">
                Результат аналізу
              </h2>

              <ResultCard result={result} isLoading={isAnalyzing} />
            </section>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {isPickerOpen && (
          <SpeciesPickerModal
            isOpen={isPickerOpen}
            onClose={() => setIsPickerOpen(false)}
            species={species}
            search={speciesSearch}
            setSearch={setSpeciesSearch}
            onAdd={handleAddSpecies}
            isLoading={isLoadingSpecies}
          />
        )}
      </AnimatePresence>
    </main>
  );
}

export default Compatibility;