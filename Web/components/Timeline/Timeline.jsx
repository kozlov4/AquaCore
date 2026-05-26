"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Calendar,
  ChevronDown,
  Filter,
  Loader2,
  RotateCcw,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { Sidebar } from "../Profile/Sidebar";
import {
  getAquariumNamesForTimeline,
  getAquariumTimeline,
} from "../../services/timelineApi";

const eventTypes = [
  {
    key: "all",
    label: "Усі події",
    icon: "🌐",
    apiValue: "",
  },
  {
    key: "water",
    label: "Параметри води",
    icon: "💧",
    apiValue: "Параметри води",
  },
  {
    key: "population",
    label: "Населення",
    icon: "🐟",
    apiValue: "Населення",
  },
  {
    key: "equipment",
    label: "Обладнання",
    icon: "⚙️",
    apiValue: "Обладнання",
  },
  {
    key: "maintenance",
    label: "Обслуговування",
    icon: "✅",
    apiValue: "Обслуговування",
  },
  {
    key: "alerts",
    label: "Алерти",
    icon: "🚨",
    apiValue: "Алерти",
  },
  {
    key: "system",
    label: "Системні",
    icon: "⭐",
    apiValue: "Системні",
  },
];

const periods = [
  {
    value: "7d",
    label: "Останні 7 днів",
  },
  {
    value: "month",
    label: "Останній місяць",
  },
  {
    value: "year",
    label: "Останній рік",
  },
  {
    value: "",
    label: "Весь час",
  },
];

const colorMap = {
  blue: {
    dot: "bg-blue-500",
    border: "border-slate-100",
    bg: "bg-white",
    text: "text-slate-950",
  },
  violet: {
    dot: "bg-[#635BFF]",
    border: "border-slate-100",
    bg: "bg-white",
    text: "text-slate-950",
  },
  red: {
    dot: "bg-red-500",
    border: "border-red-100",
    bg: "bg-red-50/30",
    text: "text-red-600",
  },
  gray: {
    dot: "bg-slate-400",
    border: "border-slate-100",
    bg: "bg-white",
    text: "text-slate-950",
  },
  green: {
    dot: "bg-emerald-500",
    border: "border-emerald-100",
    bg: "bg-emerald-50/30",
    text: "text-emerald-700",
  },
  yellow: {
    dot: "bg-yellow-400",
    border: "border-yellow-200",
    bg: "bg-yellow-50",
    text: "text-yellow-700",
  },
};

function TimelineEventCard({ event, index }) {
  const style = colorMap[event.color] || colorMap.gray;

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="relative grid grid-cols-[34px_1fr] gap-4"
    >
      <div className="relative flex justify-center">
        <span
          className={`z-10 mt-5 flex h-7 w-7 items-center justify-center rounded-full text-[13px] text-white shadow-sm ${style.dot}`}
        >
          {event.icon}
        </span>

        <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-slate-200" />
      </div>

      <div
        className={`mb-5 rounded-xl border px-5 py-4 shadow-[0_10px_28px_rgba(15,23,42,0.035)] ${style.border} ${style.bg}`}
      >
        <div className="mb-2 flex items-start justify-between gap-4">
          <h3 className={`text-[15px] font-black ${style.text}`}>
            {event.title}
          </h3>

          <span className="shrink-0 rounded-md bg-slate-50 px-2 py-1 text-[11px] font-bold text-slate-400">
            {event.date}
          </span>
        </div>

        {event.text && (
          <p className="whitespace-pre-line text-[13px] font-medium leading-6 text-slate-500">
            {event.text}
          </p>
        )}

        {event.data?.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {event.data.map((item) => (
              <span
                key={item}
                className="rounded-md bg-slate-50 px-2 py-1 text-[11px] font-black text-slate-600"
              >
                {item}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.article>
  );
}

function TimelineFiltersModal({
  isOpen,
  onClose,
  aquariums,
  draftFilters,
  setDraftFilters,
  onApply,
  onReset,
}) {
  if (!isOpen) return null;

  const toggleType = (apiValue) => {
    if (!apiValue) {
      setDraftFilters((prev) => ({
        ...prev,
        types: [],
      }));

      return;
    }

    setDraftFilters((prev) => {
      const exists = prev.types.includes(apiValue);

      return {
        ...prev,
        types: exists
          ? prev.types.filter((type) => type !== apiValue)
          : [...prev.types, apiValue],
      };
    });
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.98 }}
          className="w-full max-w-5xl rounded-3xl bg-white p-7 shadow-2xl"
        >
          <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <Filter size={22} className="text-[#635BFF]" />

              <h2 className="text-[22px] font-black text-slate-900">
                Параметри відображення
              </h2>
            </div>

            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={onReset}
                className="text-[14px] font-black text-[#635BFF] transition hover:text-[#4d45e8]"
              >
                Скинути всі
              </button>

              <button
                type="button"
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition hover:bg-slate-200"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
            <div>
              <label className="mb-2 block text-[13px] font-black uppercase tracking-[0.04em] text-slate-400">
                Екосистема
              </label>

              <div className="relative">
                <select
                  value={draftFilters.aquariumId}
                  onChange={(event) =>
                    setDraftFilters((prev) => ({
                      ...prev,
                      aquariumId: event.target.value,
                    }))
                  }
                  className="h-12 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 pr-10 text-[15px] font-bold text-slate-800 outline-none transition focus:border-[#635BFF]"
                >
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

            <div>
              <label className="mb-2 block text-[13px] font-black uppercase tracking-[0.04em] text-slate-400">
                Період часу
              </label>

              <div className="relative">
                <select
                  value={draftFilters.period}
                  onChange={(event) =>
                    setDraftFilters((prev) => ({
                      ...prev,
                      period: event.target.value,
                      dateFrom: "",
                      dateTo: "",
                    }))
                  }
                  className="h-12 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 pr-10 text-[15px] font-bold text-slate-800 outline-none transition focus:border-[#635BFF]"
                >
                  {periods.map((period) => (
                    <option key={period.label} value={period.value}>
                      {period.label}
                    </option>
                  ))}
                </select>

                <ChevronDown
                  size={17}
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-[13px] font-black uppercase tracking-[0.04em] text-slate-400">
                З дати
              </label>

              <div className="relative">
                <input
                  type="date"
                  value={draftFilters.dateFrom}
                  onChange={(event) =>
                    setDraftFilters((prev) => ({
                      ...prev,
                      dateFrom: event.target.value,
                      period: "",
                    }))
                  }
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-[15px] font-bold text-slate-800 outline-none transition focus:border-[#635BFF]"
                />

                <Calendar
                  size={17}
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-[13px] font-black uppercase tracking-[0.04em] text-slate-400">
                По дату
              </label>

              <div className="relative">
                <input
                  type="date"
                  value={draftFilters.dateTo}
                  onChange={(event) =>
                    setDraftFilters((prev) => ({
                      ...prev,
                      dateTo: event.target.value,
                      period: "",
                    }))
                  }
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-[15px] font-bold text-slate-800 outline-none transition focus:border-[#635BFF]"
                />

                <Calendar
                  size={17}
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
              </div>
            </div>
          </div>

          <div className="mt-6">
            <label className="mb-3 block text-[13px] font-black uppercase tracking-[0.04em] text-slate-400">
              Тип події
            </label>

            <div className="flex flex-wrap gap-3">
              {eventTypes.map((type) => {
                const active =
                  type.key === "all"
                    ? draftFilters.types.length === 0
                    : draftFilters.types.includes(type.apiValue);

                return (
                  <button
                    key={type.key}
                    type="button"
                    onClick={() => toggleType(type.apiValue)}
                    className={`
                      flex h-12 items-center gap-2 rounded-xl border px-4 text-[15px] font-black transition
                      ${
                        active
                          ? type.key === "alerts"
                            ? "border-red-100 bg-red-50 text-red-500"
                            : "border-[#635BFF] bg-[#635BFF] text-white shadow-[0_12px_25px_rgba(99,91,255,0.22)]"
                          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                      }
                    `}
                  >
                    <span>{type.icon}</span>
                    {type.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-7 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="h-11 rounded-xl border border-slate-200 px-5 text-sm font-black text-slate-600 transition hover:bg-slate-50"
            >
              Скасувати
            </button>

            <button
              type="button"
              onClick={onApply}
              className="h-11 rounded-xl bg-[#635BFF] px-5 text-sm font-black text-white shadow-[0_12px_25px_rgba(99,91,255,0.22)] transition hover:bg-[#544cf0]"
            >
              Застосувати
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function TopFilters({
  aquariums,
  filters,
  setFilters,
  activeType,
  setActiveType,
}) {
  const selectedAquarium = aquariums.find(
    (aquarium) => String(aquarium.id) === String(filters.aquariumId)
  );

  const handleTopType = (type) => {
    setActiveType(type.label);

    setFilters((prev) => ({
      ...prev,
      types: type.apiValue ? [type.apiValue] : [],
    }));
  };

  return (
    <div className="mb-6 rounded-[18px] border border-slate-100 bg-white p-4 shadow-[0_12px_34px_rgba(15,23,42,0.04)]">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[220px]">
          <select
            value={filters.aquariumId}
            onChange={(event) =>
              setFilters((prev) => ({
                ...prev,
                aquariumId: event.target.value,
              }))
            }
            className="h-10 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 pr-9 text-[13px] font-black text-slate-700 outline-none transition focus:border-[#635BFF]"
          >
            {aquariums.map((aquarium) => (
              <option key={aquarium.id} value={aquarium.id}>
                {aquarium.name}
              </option>
            ))}
          </select>

          <ChevronDown
            size={15}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {eventTypes.slice(0, 5).map((type) => {
            const active = activeType === type.label;

            return (
              <button
                key={type.key}
                type="button"
                onClick={() => handleTopType(type)}
                className={`
                  rounded-xl px-4 py-2.5 text-sm font-black transition
                  ${
                    active
                      ? "bg-[#635BFF] text-white shadow-[0_12px_25px_rgba(99,91,255,0.28)]"
                      : type.key === "alerts"
                      ? "bg-red-50 text-red-500 hover:bg-red-100"
                      : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                  }
                `}
              >
                {type.label}
              </button>
            );
          })}
        </div>

        <p className="ml-auto text-[12px] font-bold text-slate-400">
          {selectedAquarium ? `Акваріум: ${selectedAquarium.name}` : ""}
        </p>
      </div>
    </div>
  );
}

export function Timeline() {
  const defaultFilters = {
    aquariumId: "",
    period: "month",
    dateFrom: "",
    dateTo: "",
    types: [],
  };

  const [aquariums, setAquariums] = useState([]);
  const [events, setEvents] = useState([]);
  const [filters, setFilters] = useState(defaultFilters);
  const [draftFilters, setDraftFilters] = useState(defaultFilters);
  const [activeType, setActiveType] = useState("Усі події");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isLoadingAquariums, setIsLoadingAquariums] = useState(false);
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);
  const [error, setError] = useState("");

  const alertCount = useMemo(() => {
    return events.filter((event) => event.type === "Алерти").length;
  }, [events]);

  useEffect(() => {
    async function loadAquariums() {
      try {
        setIsLoadingAquariums(true);
        setError("");

        const data = await getAquariumNamesForTimeline();

        setAquariums(data);

        if (data.length > 0) {
          const firstId = String(data[0].id);

          setFilters((prev) => ({
            ...prev,
            aquariumId: firstId,
          }));

          setDraftFilters((prev) => ({
            ...prev,
            aquariumId: firstId,
          }));
        }
      } catch (error) {
        setError(error.message || "Не вдалося завантажити акваріуми");
      } finally {
        setIsLoadingAquariums(false);
      }
    }

    loadAquariums();
  }, []);

  useEffect(() => {
    async function loadTimeline() {
      if (!filters.aquariumId) return;

      try {
        setIsLoadingEvents(true);
        setError("");

        const data = await getAquariumTimeline({
          aquariumId: filters.aquariumId,
          types: filters.types,
          dateFrom: filters.dateFrom,
          dateTo: filters.dateTo,
          period: filters.period,
        });

        setEvents(data);
      } catch (error) {
        setEvents([]);
        setError(error.message || "Не вдалося завантажити хронологію");
      } finally {
        setIsLoadingEvents(false);
      }
    }

    loadTimeline();
  }, [filters]);

  const openFilters = () => {
    setDraftFilters(filters);
    setIsFiltersOpen(true);
  };

  const applyFilters = () => {
    setFilters(draftFilters);

    if (draftFilters.types.length === 0) {
      setActiveType("Усі події");
    } else if (draftFilters.types.length === 1) {
      const selected = eventTypes.find(
        (type) => type.apiValue === draftFilters.types[0]
      );

      setActiveType(selected?.label || "Усі події");
    } else {
      setActiveType("Кілька типів");
    }

    setIsFiltersOpen(false);
  };

  const resetFilters = () => {
    const reset = {
      ...defaultFilters,
      aquariumId: filters.aquariumId || aquariums[0]?.id || "",
    };

    setDraftFilters(reset);
    setFilters(reset);
    setActiveType("Усі події");
  };

  return (
    <main className="min-h-screen bg-white text-slate-950">
      <Sidebar />

      <section className="min-h-screen px-5 py-9 md:ml-[88px] md:px-10 lg:px-[54px]">
        <div className="mx-auto max-w-[1030px]">
          <header className="mb-7 flex items-start justify-between gap-5">
            <div>
              <h1 className="text-[22px] font-black tracking-[-0.02em] text-slate-950">
                Хронологія екосистеми
              </h1>

              <p className="mt-2 text-[13px] font-medium text-slate-400">
                Автоматичний журнал системних подій та змін
              </p>
            </div>

            <motion.button
              type="button"
              onClick={openFilters}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.96 }}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition hover:border-[#635BFF]/40 hover:text-[#635BFF]"
            >
              <Filter size={16} />
              Фільтри
            </motion.button>
          </header>

          {error && (
            <div className="mb-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-red-500">
              {error}
            </div>
          )}

          {isLoadingAquariums ? (
            <div className="mb-6 flex h-16 items-center justify-center rounded-[18px] border border-slate-100 bg-slate-50 text-sm font-bold text-slate-400">
              <Loader2 size={18} className="mr-2 animate-spin" />
              Завантаження акваріумів...
            </div>
          ) : (
            <TopFilters
              aquariums={aquariums}
              filters={filters}
              setFilters={setFilters}
              activeType={activeType}
              setActiveType={setActiveType}
            />
          )}

          {isLoadingEvents ? (
            <div className="flex h-[360px] items-center justify-center rounded-[18px] border border-slate-100 bg-slate-50">
              <div className="flex items-center gap-3 text-sm font-bold text-slate-400">
                <Loader2 size={20} className="animate-spin" />
                Завантаження хронології...
              </div>
            </div>
          ) : events.length > 0 ? (
            <div>
              {events.map((event, index) => (
                <TimelineEventCard
                  key={event.id || `${event.createdAt}-${index}`}
                  event={event}
                  index={index}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-[18px] border border-dashed border-slate-200 bg-slate-50 p-10 text-center">
              <RotateCcw size={34} className="mx-auto mb-3 text-slate-400" />

              <p className="text-[16px] font-black text-slate-900">
                Подій за вибраними фільтрами немає
              </p>

              <p className="mt-2 text-[13px] font-medium text-slate-400">
                Спробуйте змінити період, тип події або обрати інший акваріум.
              </p>
            </div>
          )}
        </div>
      </section>

      <TimelineFiltersModal
        isOpen={isFiltersOpen}
        onClose={() => setIsFiltersOpen(false)}
        aquariums={aquariums}
        draftFilters={draftFilters}
        setDraftFilters={setDraftFilters}
        onApply={applyFilters}
        onReset={resetFilters}
        alertCount={alertCount}
      />
    </main>
  );
}

export default Timeline;