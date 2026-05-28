"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Check,
  ChevronDown,
  Clock,
  History,
  Loader2,
  MoreVertical,
  Pencil,
  Plus,
  Trash2,
  Wrench,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { Sidebar } from "../Profile/Sidebar";
import {
  addEquipmentLog,
  createEquipment,
  deleteEquipment,
  getAquariumNamesForEquipment,
  getEquipmentAlertStatus,
  getEquipmentList,
  quickServiceEquipment,
  updateEquipment,
} from "../../services/equipmentApi";

const categories = ["all", "Фільтрація", "Освітлення", "Обігрів", "Інше"];

function getTodayInput() {
  return new Date().toISOString().slice(0, 10);
}

function categoryIcon(category) {
  if (category === "Фільтрація") return "🌀";
  if (category === "Освітлення") return "💡";
  if (category === "Обігрів") return "🌡️";
  return "⚙️";
}

function isNeedsAttention(item) {
  if (
    item.daysUntilMaintenance === null ||
    item.daysUntilMaintenance === undefined
  ) {
    return false;
  }

  return Number(item.daysUntilMaintenance) <= 0;
}

function clampProgress(value) {
  if (Number.isNaN(value)) return 0;

  return Math.min(100, Math.max(0, value));
}

function getMaintenanceInterval(item) {
  const interval =
    item.maintenanceIntervalDays ??
    item.maintenance_interval_days ??
    item.raw?.maintenance_interval_days ??
    item.raw?.maintenanceIntervalDays ??
    null;

  const numericInterval = Number(interval);

  if (!numericInterval || Number.isNaN(numericInterval) || numericInterval <= 0) {
    return null;
  }

  return numericInterval;
}

function getDaysLeft(item) {
  const days =
    item.daysUntilMaintenance ??
    item.days_until_maintenance ??
    item.raw?.days_until_maintenance ??
    item.raw?.daysUntilMaintenance ??
    null;

  if (days === null || days === undefined || days === "") {
    return null;
  }

  const numericDays = Number(days);

  if (Number.isNaN(numericDays)) {
    return null;
  }

  return numericDays;
}

function getMaintenanceProgress(item) {
  const interval = getMaintenanceInterval(item);
  const daysLeft = getDaysLeft(item);

  if (interval === null || daysLeft === null) {
    return {
      percent: 0,
      label: "Графік не задано",
      description: "Вкажіть інтервал обслуговування",
      colorClass: "bg-slate-300",
      textClass: "text-slate-400",
    };
  }

  if (daysLeft <= 0) {
    return {
      percent: 0,
      label: "Потрібно зараз",
      description: `Інтервал: кожні ${interval} дн.`,
      colorClass: "bg-red-500",
      textClass: "text-red-500",
    };
  }

  const remainingPercent = clampProgress((daysLeft / interval) * 100);

  if (daysLeft <= 3) {
    return {
      percent: remainingPercent,
      label: `Залишилось ${daysLeft} дн.`,
      description: `Інтервал: кожні ${interval} дн.`,
      colorClass: "bg-red-500",
      textClass: "text-red-500",
    };
  }

  if (remainingPercent <= 35) {
    return {
      percent: remainingPercent,
      label: `Залишилось ${daysLeft} дн.`,
      description: `Інтервал: кожні ${interval} дн.`,
      colorClass: "bg-orange-400",
      textClass: "text-orange-500",
    };
  }

  if (remainingPercent <= 70) {
    return {
      percent: remainingPercent,
      label: `Залишилось ${daysLeft} дн.`,
      description: `Інтервал: кожні ${interval} дн.`,
      colorClass: "bg-yellow-400",
      textClass: "text-yellow-600",
    };
  }

  return {
    percent: remainingPercent,
    label: `Залишилось ${daysLeft} дн.`,
    description: `Інтервал: кожні ${interval} дн.`,
    colorClass: "bg-emerald-500",
    textClass: "text-emerald-600",
  };
}

function EquipmentCard({
  item,
  onService,
  onHistory,
  onEdit,
  onProblem,
  onDelete,
  isBusy,
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const attention = isNeedsAttention(item);
  const progress = getMaintenanceProgress(item);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 18, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.97 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      className="relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.06)]"
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-xl ${
              attention
                ? "bg-red-50 text-red-500"
                : "bg-[#f4f2ff] text-[#635BFF]"
            }`}
          >
            {categoryIcon(item.category)}
          </div>

          <div>
            <p className="text-xs font-black uppercase tracking-[0.08em] text-slate-400">
              {item.category}
            </p>

            <h3 className="mt-1 text-[17px] font-black leading-tight text-slate-950">
              {item.name}
            </h3>
          </div>
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-700"
          >
            <MoreVertical size={18} />
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 top-10 z-20 w-[190px] overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xl">
              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  onEdit(item);
                }}
                className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-bold text-slate-700 hover:bg-slate-50"
              >
                <Pencil size={15} />
                Редагувати
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  onProblem(item);
                }}
                className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-bold text-orange-600 hover:bg-orange-50"
              >
                <AlertTriangle size={15} />
                Додати поломку
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  onDelete(item);
                }}
                className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-bold text-red-500 hover:bg-red-50"
              >
                <Trash2 size={15} />
                Видалити пристрій
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-semibold text-slate-500">
          Встановлено:{" "}
          <span className="font-black text-slate-700">
            {item.installationDateLabel}
          </span>
        </p>

        {item.specifications && (
          <p className="text-sm font-semibold leading-5 text-slate-500">
            Характеристики:{" "}
            <span className="font-black text-slate-700">
              {item.specifications}
            </span>
          </p>
        )}

        <div className="rounded-2xl bg-slate-50 p-4">
          <div className="mb-2 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.08em] text-slate-400">
                Обслуговування
              </p>

              <p className={`mt-1 text-sm font-black ${progress.textClass}`}>
                {progress.label}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-400 shadow-sm">
              <Clock size={18} />
            </div>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-slate-200">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress.percent}%` }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              className={`h-full rounded-full ${progress.colorClass}`}
            />
          </div>

          <div className="mt-2 flex items-center justify-between text-[11px] font-bold text-slate-400">
            <span>{progress.description}</span>
            <span>{Math.round(progress.percent)}%</span>
          </div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => onService(item)}
          disabled={isBusy}
          className="h-10 rounded-xl bg-[#635BFF] text-sm font-black text-white hover:bg-[#5147f5] disabled:opacity-60"
        >
          {isBusy ? "..." : "Обслужити"}
        </button>

        <button
          type="button"
          onClick={() => onHistory(item)}
          className="h-10 rounded-xl border border-slate-200 text-sm font-black text-slate-600 hover:bg-slate-50"
        >
          Історія
        </button>
      </div>
    </motion.article>
  );
}

function EquipmentFormModal({
  title,
  aquariums,
  initialData,
  selectedAquariumId,
  isSaving,
  onClose,
  onSubmit,
}) {
  const [aquariumId, setAquariumId] = useState(
    initialData?.aquariumId || selectedAquariumId || aquariums[0]?.id || ""
  );
  const [category, setCategory] = useState(initialData?.category || "Фільтрація");
  const [name, setName] = useState(initialData?.name || "");
  const [specifications, setSpecifications] = useState(initialData?.specifications || "");
  const [installationDate, setInstallationDate] = useState(
    initialData?.installationDate || getTodayInput()
  );
  const [maintenanceIntervalDays, setMaintenanceIntervalDays] = useState(
    initialData?.maintenanceIntervalDays || 14
  );

  const handleSubmit = () => {
    onSubmit({
      aquariumId,
      category,
      name,
      specifications,
      installationDate,
      maintenanceIntervalDays,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4">
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.98 }}
        className="w-full max-w-[520px] overflow-hidden rounded-3xl bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <h2 className="text-xl font-black text-slate-950">{title}</h2>

          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="text-slate-400 hover:text-slate-700"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4 px-6 py-5">
          {!initialData && (
            <div>
              <label className="mb-2 block text-[12px] font-black uppercase text-slate-400">
                Для якої екосистеми?
              </label>

              <div className="relative">
                <select
                  value={aquariumId}
                  onChange={(event) => setAquariumId(event.target.value)}
                  disabled={isSaving}
                  className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 pr-9 text-sm font-bold outline-none focus:border-[#635BFF]"
                >
                  {aquariums.map((aquarium) => (
                    <option key={aquarium.id} value={aquarium.id}>
                      {aquarium.name}
                    </option>
                  ))}
                </select>

                <ChevronDown
                  size={16}
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
              </div>
            </div>
          )}

          <div>
            <p className="mb-2 text-[12px] font-black uppercase text-slate-400">
              Категорія
            </p>

            <div className="flex flex-wrap gap-2">
              {categories
                .filter((item) => item !== "all")
                .map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setCategory(item)}
                    disabled={isSaving}
                    className={`rounded-xl border px-3 py-2 text-xs font-black transition ${
                      category === item
                        ? "border-[#635BFF] bg-[#635BFF] text-white"
                        : "border-slate-200 text-slate-600 hover:border-[#635BFF]/40"
                    }`}
                  >
                    {item}
                  </button>
                ))}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-[12px] font-black uppercase text-slate-400">
              Бренд та модель
            </label>

            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              disabled={isSaving}
              placeholder="Напр. Aquael Fan 1 Plus"
              className="h-11 w-full rounded-xl border border-slate-200 px-4 text-sm font-semibold outline-none focus:border-[#635BFF]"
            />
          </div>

          <div>
            <label className="mb-2 block text-[12px] font-black uppercase text-[#635BFF]">
              Характеристики
            </label>

            <input
              value={specifications}
              onChange={(event) => setSpecifications(event.target.value)}
              disabled={isSaving}
              placeholder={
                category === "Фільтрація"
                  ? "Напр., 800 л/год"
                  : category === "Освітлення"
                  ? "Напр., 8 годин, 70%"
                  : category === "Обігрів"
                  ? "Напр., 100 Вт"
                  : "Будь-які деталі..."
              }
              className="h-11 w-full rounded-xl border border-slate-200 px-4 text-sm font-semibold outline-none focus:border-[#635BFF]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-2 block text-[12px] font-black uppercase text-slate-400">
                Дата установки
              </label>

              <input
                type="date"
                value={installationDate}
                onChange={(event) => setInstallationDate(event.target.value)}
                disabled={isSaving}
                className="h-11 w-full rounded-xl border border-slate-200 px-4 text-sm font-bold outline-none focus:border-[#635BFF]"
              />
            </div>

            <div>
              <label className="mb-2 block text-[12px] font-black uppercase text-slate-400">
                Обслуговування
              </label>

              <div className="relative">
                <select
                  value={maintenanceIntervalDays}
                  onChange={(event) =>
                    setMaintenanceIntervalDays(event.target.value)
                  }
                  disabled={isSaving}
                  className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 pr-9 text-sm font-bold outline-none focus:border-[#635BFF]"
                >
                  <option value="7">Кожні 7 днів</option>
                  <option value="14">Кожні 14 днів</option>
                  <option value="30">Кожні 30 днів</option>
                  <option value="60">Кожні 60 днів</option>
                </select>

                <ChevronDown
                  size={16}
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
              </div>
            </div>
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
            className="flex h-11 items-center gap-2 rounded-xl bg-[#635BFF] px-5 text-sm font-black text-white hover:bg-[#5147f5] disabled:opacity-60"
          >
            {isSaving && <Loader2 size={16} className="animate-spin" />}
            {initialData ? "Зберегти зміни" : "Додати пристрій"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function LogModal({ equipment, isSaving, onClose, onSubmit }) {
  const [logType, setLogType] = useState("Поломка");
  const [logDate, setLogDate] = useState(getTodayInput());
  const [description, setDescription] = useState("");
  const [isResolved, setIsResolved] = useState(false);

  const handleSubmit = () => {
    onSubmit({
      logType,
      logDate,
      description,
      isResolved,
    });
  };

  if (!equipment) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4">
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="w-full max-w-[460px] overflow-hidden rounded-3xl bg-white shadow-2xl"
      >
        <div className="flex items-start justify-between border-b border-red-100 bg-red-50 px-6 py-5">
          <div>
            <h2 className="text-xl font-black text-red-700">
              Зафіксувати проблему
            </h2>

            <p className="mt-1 text-sm font-bold text-red-500">
              {equipment.name}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="text-red-400 hover:text-red-600"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4 px-6 py-5">
          <div>
            <label className="mb-2 block text-sm font-black text-slate-700">
              Що сталося?
            </label>

            <input
              value={logType}
              onChange={(event) => setLogType(event.target.value)}
              disabled={isSaving}
              placeholder="Поломка / Планове обслуговування"
              className="h-11 w-full rounded-xl border border-slate-200 px-4 text-sm font-semibold outline-none focus:border-red-400"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-black text-slate-700">
              Дата фіксації
            </label>

            <input
              type="date"
              value={logDate}
              onChange={(event) => setLogDate(event.target.value)}
              disabled={isSaving}
              className="h-11 w-full rounded-xl border border-slate-200 px-4 text-sm font-semibold outline-none focus:border-red-400"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-black text-slate-700">
              Деталі
            </label>

            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              disabled={isSaving}
              placeholder="Опишіть проблему або що саме було замінено..."
              className="h-[110px] w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold outline-none focus:border-red-400"
            />
          </div>

          <label className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-600">
            <input
              type="checkbox"
              checked={isResolved}
              onChange={(event) => setIsResolved(event.target.checked)}
              className="h-4 w-4 accent-red-500"
            />
            Ремонт проведено / проблема вирішена
          </label>
        </div>

        <div className="flex justify-end gap-3 bg-slate-50 px-6 py-5">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="h-11 rounded-xl px-5 text-sm font-black text-slate-500 hover:bg-white"
          >
            Скасувати
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSaving}
            className="flex h-11 items-center gap-2 rounded-xl bg-red-500 px-5 text-sm font-black text-white hover:bg-red-600 disabled:opacity-60"
          >
            {isSaving && <Loader2 size={16} className="animate-spin" />}
            Зберегти запис
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function HistoryModal({ equipment, onClose }) {
  if (!equipment) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4">
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="w-full max-w-[520px] overflow-hidden rounded-3xl bg-white shadow-2xl"
      >
        <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <h2 className="text-xl font-black text-slate-950">
              Історія обслуговування
            </h2>

            <p className="mt-1 text-sm font-bold text-slate-400">
              {equipment.name}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700"
          >
            <X size={20} />
          </button>
        </div>

        <div className="max-h-[430px] overflow-y-auto">
          {equipment.logs.length > 0 ? (
            equipment.logs.map((log) => (
              <div
                key={log.id}
                className="flex gap-4 border-b border-slate-100 px-6 py-4 last:border-b-0"
              >
                <div
                  className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                    log.isResolved
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-yellow-50 text-yellow-600"
                  }`}
                >
                  {log.isResolved ? <Check size={16} /> : <Wrench size={16} />}
                </div>

                <div>
                  <h3 className="text-sm font-black text-slate-950">
                    {log.logType}
                  </h3>

                  {log.description && (
                    <p className="mt-1 text-sm font-semibold leading-5 text-slate-400">
                      {log.description}
                    </p>
                  )}

                  <p className="mt-2 text-xs font-bold text-slate-400">
                    {log.dateLabel}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-sm font-bold text-slate-400">
              Історії поки немає
            </div>
          )}
        </div>

        <div className="p-5">
          <button
            type="button"
            onClick={onClose}
            className="h-11 w-full rounded-xl border border-slate-200 text-sm font-black text-slate-600 hover:bg-slate-50"
          >
            Закрити
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function DeleteModal({ equipment, isSaving, onCancel, onConfirm }) {
  if (!equipment) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/45 px-4">
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="w-full max-w-[390px] rounded-3xl bg-white p-6 text-center shadow-2xl"
      >
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
          <Trash2 size={30} />
        </div>

        <h2 className="text-xl font-black text-slate-950">
          Видалити пристрій?
        </h2>

        <p className="mt-3 text-sm font-semibold leading-6 text-slate-500">
          Ви збираєтесь видалити{" "}
          <span className="font-black text-slate-950">"{equipment.name}"</span>.
          Цю дію неможливо буде скасувати.
        </p>

        <div className="mt-7 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSaving}
            className="h-12 rounded-xl border border-slate-200 text-sm font-black text-slate-700 hover:bg-slate-50"
          >
            Скасувати
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isSaving}
            className="h-12 rounded-xl bg-red-500 text-sm font-black text-white hover:bg-red-600 disabled:opacity-60"
          >
            {isSaving ? "Видалення..." : "Видалити"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export function Equipment() {
  const [aquariums, setAquariums] = useState([]);
  const [selectedAquariumId, setSelectedAquariumId] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [equipment, setEquipment] = useState([]);
  const [alertStatus, setAlertStatus] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState(null);
  const [historyEquipment, setHistoryEquipment] = useState(null);
  const [problemEquipment, setProblemEquipment] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [error, setError] = useState("");

  const selectedAquarium = useMemo(() => {
    return aquariums.find(
      (aquarium) => String(aquarium.id) === String(selectedAquariumId)
    );
  }, [aquariums, selectedAquariumId]);

  async function loadEquipment(aquariumId = selectedAquariumId) {
    if (!aquariumId) return;

    try {
      setIsLoading(true);
      setError("");

      const [items, alert] = await Promise.all([
        getEquipmentList(aquariumId, selectedCategory),
        getEquipmentAlertStatus(aquariumId),
      ]);

      setEquipment(items);
      setAlertStatus(alert);
    } catch (error) {
      setEquipment([]);
      setAlertStatus(null);
      setError(error.message || "Не вдалося завантажити обладнання");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    async function loadAquariums() {
      try {
        const data = await getAquariumNamesForEquipment();

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
      loadEquipment(selectedAquariumId);
    }
  }, [selectedAquariumId, selectedCategory]);

  const handleCreate = async (payload) => {
    try {
      if (!payload.name.trim()) {
        throw new Error("Введіть назву обладнання");
      }

      setIsSaving(true);
      setError("");

      await createEquipment(payload.aquariumId, payload);

      setIsAddOpen(false);

      if (String(payload.aquariumId) !== String(selectedAquariumId)) {
        setSelectedAquariumId(String(payload.aquariumId));
      } else {
        await loadEquipment(selectedAquariumId);
      }
    } catch (error) {
      setError(error.message || "Не вдалося додати обладнання");
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdate = async (payload) => {
    try {
      if (!editingEquipment?.id) {
        throw new Error("Equipment id is required");
      }

      if (!payload.name.trim()) {
        throw new Error("Введіть назву обладнання");
      }

      setIsSaving(true);
      setError("");

      await updateEquipment(editingEquipment.id, payload);

      setEditingEquipment(null);
      await loadEquipment(selectedAquariumId);
    } catch (error) {
      setError(error.message || "Не вдалося оновити обладнання");
    } finally {
      setIsSaving(false);
    }
  };

  const handleService = async (item) => {
    try {
      setBusyId(item.id);
      setError("");

      await quickServiceEquipment(item.id);

      await loadEquipment(selectedAquariumId);
    } catch (error) {
      setError(error.message || "Не вдалося обслужити обладнання");
    } finally {
      setBusyId(null);
    }
  };

  const handleAddLog = async (payload) => {
    try {
      if (!problemEquipment?.id) {
        throw new Error("Equipment id is required");
      }

      setIsSaving(true);
      setError("");

      await addEquipmentLog(problemEquipment.id, payload);

      setProblemEquipment(null);
      await loadEquipment(selectedAquariumId);
    } catch (error) {
      setError(error.message || "Не вдалося зафіксувати проблему");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      if (!deleteTarget?.id) {
        throw new Error("Equipment id is required");
      }

      setIsSaving(true);
      setError("");

      await deleteEquipment(deleteTarget.id);

      setDeleteTarget(null);
      await loadEquipment(selectedAquariumId);
    } catch (error) {
      setError(error.message || "Не вдалося видалити обладнання");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-white text-slate-950">
      <Sidebar />

      <section className="min-h-screen px-5 py-9 md:ml-[88px] md:px-10 lg:px-[54px]">
        <div className="mx-auto max-w-[1050px]">
          <header className="mb-8 flex items-start justify-between gap-5">
            <div>
              <h1 className="text-[24px] font-black tracking-[-0.02em]">
                Обладнання та інвентар
              </h1>

              <p className="mt-2 text-[13px] font-medium text-slate-400">
                Контролюйте стан техніки та графіки її обслуговування
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsAddOpen(true)}
              className="flex h-11 items-center gap-2 rounded-xl bg-[#635BFF] px-5 text-sm font-black text-white hover:bg-[#5147f5]"
            >
              <Plus size={17} />
              Додати пристрій
            </button>
          </header>

          <div className="mb-5 flex flex-wrap items-center gap-3">
            <div className="relative">
              <select
                value={selectedAquariumId}
                onChange={(event) => setSelectedAquariumId(event.target.value)}
                className="h-10 min-w-[220px] appearance-none rounded-xl border border-slate-200 bg-white px-4 pr-9 text-sm font-black outline-none focus:border-[#635BFF]"
              >
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

            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(event) => setSelectedCategory(event.target.value)}
                className="h-10 min-w-[200px] appearance-none rounded-xl border border-slate-200 bg-white px-4 pr-9 text-sm font-black outline-none focus:border-[#635BFF]"
              >
                <option value="all">Усе обладнання</option>
                <option value="Фільтрація">Фільтрація</option>
                <option value="Освітлення">Освітлення</option>
                <option value="Обігрів">Обігрів</option>
                <option value="Інше">Інше</option>
              </select>

              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
            </div>
          </div>

          {alertStatus?.needsAttentionCount > 0 && (
            <div className="mb-5 flex items-center justify-between rounded-2xl border border-yellow-200 bg-yellow-50 px-5 py-4">
              <div className="flex items-start gap-3">
                <AlertTriangle size={22} className="mt-1 text-yellow-600" />

                <div>
                  <h3 className="text-sm font-black text-yellow-800">
                    Потребує уваги ({alertStatus.needsAttentionCount})
                  </h3>

                  <p className="mt-1 text-sm font-semibold text-yellow-700">
                    {alertStatus.message || "Є обладнання, яке потребує обслуговування."}
                  </p>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-red-500">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="flex h-[300px] items-center justify-center rounded-2xl border border-slate-100 bg-slate-50">
              <Loader2 size={22} className="mr-3 animate-spin text-slate-400" />
              <span className="text-sm font-bold text-slate-400">
                Завантаження обладнання...
              </span>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {equipment.map((item) => (
                <EquipmentCard
                  key={item.id}
                  item={item}
                  isBusy={busyId === item.id}
                  onService={handleService}
                  onHistory={setHistoryEquipment}
                  onEdit={setEditingEquipment}
                  onProblem={setProblemEquipment}
                  onDelete={setDeleteTarget}
                />
              ))}

              <button
                type="button"
                onClick={() => setIsAddOpen(true)}
                className="flex min-h-[220px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 text-sm font-black text-[#635BFF] hover:border-[#635BFF] hover:bg-[#f8f7ff]"
              >
                <Plus size={24} />
                <span className="mt-2">Додати обладнання</span>
                <span className="mt-1 text-xs font-semibold text-slate-400">
                  Фільтр, світло, CO2 або обігрівач
                </span>
              </button>
            </div>
          )}
        </div>
      </section>

      <AnimatePresence>
        {isAddOpen && (
          <EquipmentFormModal
            title="Нове обладнання"
            aquariums={aquariums}
            selectedAquariumId={selectedAquariumId}
            isSaving={isSaving}
            onClose={() => setIsAddOpen(false)}
            onSubmit={handleCreate}
          />
        )}

        {editingEquipment && (
          <EquipmentFormModal
            title="Редагувати обладнання"
            aquariums={aquariums}
            selectedAquariumId={selectedAquariumId}
            initialData={editingEquipment}
            isSaving={isSaving}
            onClose={() => setEditingEquipment(null)}
            onSubmit={handleUpdate}
          />
        )}

        {problemEquipment && (
          <LogModal
            equipment={problemEquipment}
            isSaving={isSaving}
            onClose={() => setProblemEquipment(null)}
            onSubmit={handleAddLog}
          />
        )}

        {historyEquipment && (
          <HistoryModal
            equipment={historyEquipment}
            onClose={() => setHistoryEquipment(null)}
          />
        )}

        {deleteTarget && (
          <DeleteModal
            equipment={deleteTarget}
            isSaving={isSaving}
            onCancel={() => setDeleteTarget(null)}
            onConfirm={handleDelete}
          />
        )}
      </AnimatePresence>
    </main>
  );
}

export default Equipment;