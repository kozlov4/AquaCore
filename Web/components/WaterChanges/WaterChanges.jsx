"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Check,
  ChevronDown,
  Droplets,
  Loader2,
  Settings,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { Sidebar } from "../Profile/Sidebar";
import {
  getAquariumNamesForWaterChanges,
  getAquariumForWaterChange,
  getWaterChangeDashboard,
  recordWaterChange,
  updateWaterChangeSchedule,
} from "../../services/waterChangesApi";

function getTodayInput() {
  return new Date().toISOString().slice(0, 10);
}

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return String(value);

  return date.toLocaleDateString("uk-UA", {
    day: "numeric",
    month: "long",
  });
}

function calculateDaysLeftFromDate(value) {
  if (!value) return null;

  const targetDate = new Date(value);

  if (Number.isNaN(targetDate.getTime())) return null;

  const today = new Date();

  today.setHours(0, 0, 0, 0);
  targetDate.setHours(0, 0, 0, 0);

  const diffMs = targetDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  return diffDays;
}

function getDaysWord(days) {
  const value = Math.abs(Number(days));

  if (value % 10 === 1 && value % 100 !== 11) {
    return "день";
  }

  if (
    [2, 3, 4].includes(value % 10) &&
    ![12, 13, 14].includes(value % 100)
  ) {
    return "дні";
  }

  return "днів";
}

function getCycleStatusText(daysLeft) {
  if (daysLeft === null || daysLeft === undefined) {
    return "Налаштуйте графік";
  }

  if (Number(daysLeft) < 0) {
    const overdueDays = Math.abs(Number(daysLeft));

    return `Підміна прострочена на ${overdueDays} ${getDaysWord(
      overdueDays,
    )}`;
  }

  if (Number(daysLeft) === 0) {
    return "Підміну потрібно виконати сьогодні";
  }

  return `Підміна через ${daysLeft} ${getDaysWord(daysLeft)}`;
}

function getSafePercentage(value) {
  const numberValue = Number(value);

  if (Number.isNaN(numberValue) || numberValue <= 0) {
    return 30;
  }

  return numberValue;
}

function calculateLiters(volume, percentage) {
  const aquariumVolume = Number(volume);
  const percent = getSafePercentage(percentage);

  if (
    volume === null ||
    volume === undefined ||
    volume === "" ||
    Number.isNaN(aquariumVolume) ||
    aquariumVolume <= 0
  ) {
    return 0;
  }

  return Math.round((aquariumVolume * percent) / 100);
}

function RecordWaterChangeModal({
  isOpen,
  aquarium,
  targetPercentage,
  isSaving,
  onClose,
  onSubmit,
}) {
  const [changeType, setChangeType] = useState("Планова підміна");
  const [percentage, setPercentage] = useState(
    getSafePercentage(targetPercentage),
  );
  const [changeDate, setChangeDate] = useState(getTodayInput());
  const [comment, setComment] = useState("");

  useEffect(() => {
    setPercentage(getSafePercentage(targetPercentage));
  }, [targetPercentage]);

  if (!isOpen) return null;

  const liters = calculateLiters(aquarium?.volume, percentage);

  const handleSubmit = () => {
    onSubmit({
      changeType,
      percentage,
      changeDate,
      comment,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4">
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.98 }}
        className="w-full max-w-[430px] overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <h2 className="text-[18px] font-black text-slate-950">
              Зафіксувати підміну
            </h2>

            <p className="mt-1 text-xs font-bold text-slate-400">
              {aquarium?.name || "Акваріум"}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="text-slate-400 hover:text-slate-700"
          >
            <X size={19} />
          </button>
        </div>

        <div className="space-y-5 px-6 py-5">
          <div>
            <label className="mb-2 block text-sm font-black text-slate-800">
              Тип підміни
            </label>

            <div className="relative">
              <select
                value={changeType}
                onChange={(event) => setChangeType(event.target.value)}
                disabled={isSaving}
                className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 pr-10 text-sm font-bold text-slate-700 outline-none focus:border-[#635BFF] focus:ring-4 focus:ring-[#635BFF]/10"
              >
                <option value="Планова підміна">Планова підміна</option>
                <option value="Екстрена підміна">Екстрена підміна</option>
              </select>

              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-black text-slate-800">
              Обʼєм підміни (%)
            </label>

            <div className="relative">
              <input
                type="number"
                min="1"
                max="90"
                value={percentage}
                onChange={(event) => setPercentage(event.target.value)}
                disabled={isSaving}
                className="h-11 w-full rounded-xl border border-slate-200 px-4 pr-9 text-sm font-bold text-slate-700 outline-none focus:border-[#635BFF] focus:ring-4 focus:ring-[#635BFF]/10"
              />

              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                %
              </span>
            </div>

            <div className="mt-3 rounded-xl bg-blue-50 px-4 py-3 text-xs font-semibold leading-5 text-blue-600">
              При загальному обʼємі{" "}
              <span className="font-black">{aquarium?.volume || "—"} л</span>,
              потрібно підготувати{" "}
              <span className="font-black">{liters} л</span> води.
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-black text-slate-800">
              Дата
            </label>

            <input
              type="date"
              value={changeDate}
              onChange={(event) => setChangeDate(event.target.value)}
              disabled={isSaving}
              className="h-11 w-full rounded-xl border border-slate-200 px-4 pr-9 text-sm font-bold text-slate-700 outline-none focus:border-[#635BFF] focus:ring-4 focus:ring-[#635BFF]/10"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-black text-slate-800">
              Виконані дії / коментар
            </label>

            <textarea
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              disabled={isSaving}
              placeholder="Напр., сифонка ґрунту, очищення скла, додано бактерії..."
              className="h-[110px] w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 outline-none placeholder:text-slate-400 focus:border-[#635BFF] focus:ring-4 focus:ring-[#635BFF]/10"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 px-6 pb-6">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="h-11 rounded-xl px-5 text-sm font-black text-slate-500 hover:bg-slate-50"
          >
            Скасувати
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSaving}
            className="flex h-11 items-center gap-2 rounded-xl bg-[#635BFF] px-5 text-sm font-black text-white shadow-[0_12px_24px_rgba(99,91,255,0.24)] hover:bg-[#5147f5] disabled:opacity-60"
          >
            {isSaving && <Loader2 size={16} className="animate-spin" />}
            Зберегти запис
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function ScheduleModal({
  isOpen,
  aquarium,
  intervalDays,
  percentage,
  isSaving,
  onClose,
  onSubmit,
}) {
  const [localInterval, setLocalInterval] = useState(intervalDays || 7);
  const [localPercentage, setLocalPercentage] = useState(
    getSafePercentage(percentage),
  );

  useEffect(() => {
    setLocalInterval(intervalDays || 7);
    setLocalPercentage(getSafePercentage(percentage));
  }, [intervalDays, percentage]);

  if (!isOpen) return null;

  const liters = calculateLiters(aquarium?.volume, localPercentage);

  const handleSubmit = () => {
    onSubmit({
      intervalDays: localInterval,
      percentage: localPercentage,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4">
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.98 }}
        className="w-full max-w-[360px] overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        <div className="flex items-start justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <h2 className="text-[16px] font-black uppercase text-slate-950">
              Параметри підміни
            </h2>

            <p className="mt-1 text-xs font-bold text-slate-400">
              {aquarium?.name || "Акваріум"}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="text-slate-400 hover:text-slate-700"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-5 px-5 py-5">
          <div>
            <p className="mb-2 text-sm font-black text-slate-800">
              Як часто міняти воду?
            </p>

            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-slate-500">
                Кожні
              </span>

              <input
                type="number"
                min="1"
                value={localInterval}
                onChange={(event) => setLocalInterval(event.target.value)}
                disabled={isSaving}
                className="h-10 w-20 rounded-xl border border-slate-200 px-3 text-center text-sm font-black outline-none focus:border-[#635BFF]"
              />

              <span className="text-sm font-semibold text-slate-500">днів</span>
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm font-black text-slate-800">
              Скільки води замінювати?
            </p>

            <div className="flex items-center gap-3">
              <input
                type="number"
                min="1"
                max="90"
                value={localPercentage}
                onChange={(event) => setLocalPercentage(event.target.value)}
                disabled={isSaving}
                className="h-10 w-20 rounded-xl border border-slate-200 px-3 text-center text-sm font-black outline-none focus:border-[#635BFF]"
              />

              <span className="text-sm font-semibold text-slate-500">%</span>
            </div>

            <div className="mt-4 rounded-xl bg-blue-50 px-4 py-3 text-xs font-semibold leading-5 text-blue-600">
              При загальному обʼємі{" "}
              <span className="font-black">{aquarium?.volume || "—"} л</span>,
              вам потрібно буде готувати{" "}
              <span className="font-black">{liters} л</span> води.
            </div>
          </div>
        </div>

        <div className="flex justify-end px-5 pb-5">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSaving}
            className="flex h-10 items-center gap-2 rounded-xl bg-[#635BFF] px-5 text-sm font-black text-white hover:bg-[#5147f5] disabled:opacity-60"
          >
            {isSaving && <Loader2 size={15} className="animate-spin" />}
            Зберегти
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function HistoryItem({ item }) {
  const isEmergency = item.changeType === "Екстрена підміна";

  return (
    <div className="flex items-center gap-4 border-b border-slate-100 px-5 py-4 last:border-b-0">
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-black ${
          isEmergency
            ? "bg-orange-50 text-orange-500"
            : "bg-blue-50 text-blue-600"
        }`}
      >
        {item.percentage}%
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="text-sm font-black text-slate-950">{item.changeType}</h3>

        {item.comment && (
          <p className="mt-1 truncate text-xs font-semibold text-slate-400">
            {item.comment}
          </p>
        )}
      </div>

      <div className="text-right">
        <p className="text-sm font-black text-slate-950">{item.dateLabel}</p>

        <p
          className={`mt-1 text-xs font-black ${
            isEmergency ? "text-orange-500" : "text-emerald-500"
          }`}
        >
          {isEmergency ? "Позапланово" : "Вчасно"}
        </p>
      </div>
    </div>
  );
}

export function WaterChanges() {
  const [aquariums, setAquariums] = useState([]);
  const [selectedAquariumId, setSelectedAquariumId] = useState("");
  const [dashboard, setDashboard] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isSavingRecord, setIsSavingRecord] = useState(false);
  const [isSavingSchedule, setIsSavingSchedule] = useState(false);

  const [isRecordOpen, setIsRecordOpen] = useState(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);

  const [error, setError] = useState("");

  const selectedAquarium = useMemo(() => {
    return aquariums.find(
      (item) => String(item.id) === String(selectedAquariumId),
    );
  }, [aquariums, selectedAquariumId]);

  const effectivePercentage = useMemo(() => {
    return getSafePercentage(dashboard?.targetPercentage);
  }, [dashboard]);

  const selectedAquariumVolume = useMemo(() => {
    const volume = Number(selectedAquarium?.volume);

    if (
      selectedAquarium?.volume === null ||
      selectedAquarium?.volume === undefined ||
      selectedAquarium?.volume === "" ||
      Number.isNaN(volume) ||
      volume <= 0
    ) {
      return null;
    }

    return volume;
  }, [selectedAquarium]);

  const waterLiters = useMemo(() => {
    return calculateLiters(selectedAquariumVolume, effectivePercentage);
  }, [selectedAquariumVolume, effectivePercentage]);

  const effectiveDaysLeft = useMemo(() => {
    if (
      dashboard?.daysLeft !== null &&
      dashboard?.daysLeft !== undefined &&
      dashboard?.daysLeft !== ""
    ) {
      const value = Number(dashboard.daysLeft);

      if (!Number.isNaN(value)) {
        return value;
      }
    }

    return calculateDaysLeftFromDate(dashboard?.nextChangeDate);
  }, [dashboard]);

  const cycleStatusText = useMemo(() => {
    return getCycleStatusText(effectiveDaysLeft);
  }, [effectiveDaysLeft]);

  const progress = useMemo(() => {
    const interval = Number(dashboard?.intervalDays || 0);

    if (
      !interval ||
      effectiveDaysLeft === null ||
      effectiveDaysLeft === undefined
    ) {
      return 0;
    }

    if (effectiveDaysLeft <= 0) {
      return 100;
    }

    const passed = Math.max(0, interval - Number(effectiveDaysLeft));

    return Math.min(100, Math.round((passed / interval) * 100));
  }, [dashboard, effectiveDaysLeft]);

  async function loadSelectedAquariumDetails(aquariumId) {
    if (!aquariumId) return;

    try {
      const fullAquarium = await getAquariumForWaterChange(aquariumId);

      setAquariums((prev) =>
        prev.map((item) =>
          String(item.id) === String(aquariumId)
            ? {
                ...item,
                ...fullAquarium,
                volume: fullAquarium.volume || item.volume || null,
              }
            : item,
        ),
      );
    } catch (error) {
      console.log("Не вдалося підтягнути повний акваріум:", error);
    }
  }

  async function loadDashboard(aquariumId = selectedAquariumId) {
    if (!aquariumId) return;

    try {
      setIsLoading(true);
      setError("");

      const data = await getWaterChangeDashboard(aquariumId);

      setDashboard(data);
    } catch (error) {
      setDashboard({
        intervalDays: 7,
        targetPercentage: 30,
        daysLeft: null,
        lastChangeDate: null,
        nextChangeDate: null,
        history: [],
      });

      setError(error.message || "Не вдалося завантажити графік підмін");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    async function loadAquariums() {
      try {
        setError("");

        const data = await getAquariumNamesForWaterChanges();

        setAquariums(data);

        if (data.length > 0) {
          setSelectedAquariumId(String(data[0].id));
        }
      } catch (error) {
        setError(error.message || "Не вдалося завантажити акваріуми");
      }
    }

    loadAquariums();
  }, []);

  useEffect(() => {
    if (selectedAquariumId) {
      loadSelectedAquariumDetails(selectedAquariumId);
      loadDashboard(selectedAquariumId);
    }
  }, [selectedAquariumId]);

  const handleRecordSubmit = async (payload) => {
    try {
      setIsSavingRecord(true);
      setError("");

      if (!payload.percentage || Number(payload.percentage) <= 0) {
        throw new Error("Вкажіть відсоток підміни");
      }

      if (!payload.changeDate) {
        throw new Error("Оберіть дату підміни");
      }

      await recordWaterChange(selectedAquariumId, payload);

      setIsRecordOpen(false);

      await loadDashboard(selectedAquariumId);
    } catch (error) {
      setError(error.message || "Не вдалося зафіксувати підміну");
    } finally {
      setIsSavingRecord(false);
    }
  };

  const handleScheduleSubmit = async (payload) => {
    try {
      setIsSavingSchedule(true);
      setError("");

      if (!payload.intervalDays || Number(payload.intervalDays) <= 0) {
        throw new Error("Вкажіть інтервал у днях");
      }

      if (!payload.percentage || Number(payload.percentage) <= 0) {
        throw new Error("Вкажіть відсоток підміни");
      }

      await updateWaterChangeSchedule(selectedAquariumId, payload);

      setDashboard((prev) => ({
        ...(prev || {}),
        intervalDays: Number(payload.intervalDays),
        targetPercentage: Number(payload.percentage),
      }));

      setIsScheduleOpen(false);

      await loadDashboard(selectedAquariumId);
    } catch (error) {
      setError(error.message || "Не вдалося оновити параметри підміни");
    } finally {
      setIsSavingSchedule(false);
    }
  };

  return (
    <main className="min-h-screen bg-white text-slate-950">
      <Sidebar />

      <section className="min-h-screen px-5 py-9 md:ml-[88px] md:px-10 lg:px-[54px]">
        <div className="mx-auto max-w-[920px]">
          <header className="mb-8 flex items-start justify-between gap-5">
            <div>
              <h1 className="text-[24px] font-black tracking-[-0.02em] text-slate-950">
                Графік підміни води
              </h1>

              <p className="mt-2 text-[13px] font-medium text-slate-400">
                Контролюйте частоту оновлення та обʼєми води
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <select
                  value={selectedAquariumId}
                  onChange={(event) =>
                    setSelectedAquariumId(event.target.value)
                  }
                  className="h-10 min-w-[210px] appearance-none rounded-xl border border-slate-200 bg-white px-4 pr-9 text-sm font-black text-slate-700 outline-none focus:border-[#635BFF]"
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
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
              </div>

              <button
                type="button"
                onClick={() => setIsScheduleOpen(true)}
                disabled={!selectedAquariumId}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-50"
              >
                <Settings size={17} />
              </button>
            </div>
          </header>

          {error && (
            <div className="mb-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-red-500">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="flex h-[320px] items-center justify-center rounded-3xl border border-slate-100 bg-slate-50">
              <div className="flex items-center gap-3 text-sm font-bold text-slate-400">
                <Loader2 size={20} className="animate-spin" />
                Завантаження графіка...
              </div>
            </div>
          ) : (
            <>
              <section className="mb-8 rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_16px_45px_rgba(15,23,42,0.04)]">
                <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-[1fr_230px]">
                  <div>
                    <p className="text-[12px] font-black uppercase tracking-[0.06em] text-[#635BFF]">
                      Статус циклу
                    </p>

                    <h2 className="mt-2 text-[28px] font-black tracking-[-0.03em] text-slate-950">
                      {cycleStatusText}
                    </h2>

                    <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-blue-400 to-[#635BFF]"
                        style={{ width: `${progress}%` }}
                      />
                    </div>

                    <div className="mt-3 flex justify-between text-xs font-bold text-slate-400">
                      <span>
                        Остання: {formatDate(dashboard?.lastChangeDate)}
                      </span>
                      <span>План: {formatDate(dashboard?.nextChangeDate)}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsRecordOpen(true)}
                    disabled={!selectedAquariumId}
                    className="flex h-14 items-center justify-center gap-2 rounded-xl bg-[#635BFF] px-6 text-sm font-black text-white shadow-[0_16px_32px_rgba(99,91,255,0.28)] hover:bg-[#5147f5] disabled:opacity-50"
                  >
                    <Check size={17} />
                    Зафіксувати підміну
                  </button>
                </div>
              </section>

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_245px]">
                <section>
                  <h2 className="mb-3 text-[12px] font-black uppercase tracking-[0.06em] text-slate-400">
                    Історія операцій
                  </h2>

                  <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_12px_34px_rgba(15,23,42,0.04)]">
                    {dashboard?.history?.length > 0 ? (
                      dashboard.history.map((item, index) => (
                        <HistoryItem
                          key={item.id || `${item.changeDate}-${index}`}
                          item={item}
                        />
                      ))
                    ) : (
                      <div className="p-8 text-center">
                        <Droplets
                          size={32}
                          className="mx-auto mb-3 text-slate-300"
                        />

                        <p className="text-sm font-black text-slate-700">
                          Історії підмін ще немає
                        </p>

                        <p className="mt-1 text-xs font-semibold text-slate-400">
                          Натисніть “Зафіксувати підміну”, щоб додати перший
                          запис.
                        </p>
                      </div>
                    )}
                  </div>
                </section>

                <aside className="rounded-2xl bg-gradient-to-br from-blue-500 to-[#635BFF] p-6 text-white shadow-[0_18px_40px_rgba(79,70,229,0.28)]">
                  <p className="text-[12px] font-black uppercase tracking-[0.06em] text-white/70">
                    Вода до підготовки
                  </p>

                  <div className="mt-4 flex items-end gap-2">
                    <span className="text-[34px] font-black leading-none">
                      {waterLiters}
                    </span>

                    <span className="pb-1 text-sm font-bold text-white/80">
                      літрів
                    </span>
                  </div>

                  <p className="mt-3 text-sm font-semibold leading-5 text-white/75">
                    {selectedAquariumVolume
                      ? `Це ${effectivePercentage}% від загального обʼєму акваріума — ${selectedAquariumVolume} л.`
                      : "Обʼєм акваріума ще завантажується або відсутній у даних."}
                  </p>

                  {!selectedAquariumVolume && (
                    <p className="mt-3 rounded-xl bg-white/15 px-3 py-2 text-xs font-bold text-white">
                      Перевірте, чи для вибраного акваріума на backend
                      повертається поле volume.
                    </p>
                  )}

                  <button
                    type="button"
                    onClick={() => setIsScheduleOpen(true)}
                    className="mt-5 h-10 w-full rounded-xl bg-white/15 text-sm font-black text-white transition hover:bg-white/20"
                  >
                    Змінити налаштування
                  </button>
                </aside>
              </div>
            </>
          )}
        </div>
      </section>

      <AnimatePresence>
        {isRecordOpen && (
          <RecordWaterChangeModal
            isOpen={isRecordOpen}
            aquarium={selectedAquarium}
            targetPercentage={effectivePercentage}
            isSaving={isSavingRecord}
            onClose={() => setIsRecordOpen(false)}
            onSubmit={handleRecordSubmit}
          />
        )}

        {isScheduleOpen && (
          <ScheduleModal
            isOpen={isScheduleOpen}
            aquarium={selectedAquarium}
            intervalDays={dashboard?.intervalDays || 7}
            percentage={effectivePercentage}
            isSaving={isSavingSchedule}
            onClose={() => setIsScheduleOpen(false)}
            onSubmit={handleScheduleSubmit}
          />
        )}
      </AnimatePresence>
    </main>
  );
}

export default WaterChanges;