"use client";

import { useEffect, useMemo, useState } from "react";
import {
  X,
  Search,
  AlertTriangle,
  CheckCircle2,
  Info,
  ShieldAlert,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { getSpeciesList } from "../../services/speciesApi";

function todayInputDate() {
  return new Date().toISOString().slice(0, 10);
}

function getSpeciesIcon(species) {
  if (species?.icon) return species.icon;

  const category = String(species?.category || "").toLowerCase();

  if (category.includes("рослин")) return "🌿";
  if (category.includes("крев") || category.includes("безхреб")) return "🦐";

  return "🐟";
}

function normalizeText(value) {
  return String(value || "").trim().toLowerCase();
}

function getCompatibilityInfo(species) {
  const character = normalizeText(species?.character);
  const category = normalizeText(species?.category);
  const name = normalizeText(species?.name);
  const minVolume = Number(species?.minVolume || species?.min_volume || 0);

  if (
    character.includes("хиж") ||
    name.includes("астронотус") ||
    minVolume >= 200
  ) {
    return {
      type: "critical",
      title: "Критична несумісність",
      icon: "🚨",
      needsConfirm: true,
      boxClass: "border-red-200 bg-red-50 text-red-700",
      buttonClass: "bg-red-500 hover:bg-red-600",
      points: [
        "Хижак: цей вид може зʼїсти поточних жителів акваріума.",
        "Обʼєм: для цього виду може бути потрібен значно більший акваріум.",
      ],
      checkboxText:
        "Я розумію ризики. Додати цей вид в акваріум незважаючи на попередження системи.",
    };
  }

  if (character.includes("територ")) {
    return {
      type: "warning",
      title: "Можлива агресія",
      icon: "⚠️",
      needsConfirm: true,
      boxClass: "border-yellow-200 bg-yellow-50 text-yellow-700",
      buttonClass: "bg-yellow-500 hover:bg-yellow-600",
      points: [
        "Територіальність: вид активно захищає свою територію.",
        "Поведінка: можливі конфлікти з дрібними або повільними сусідами.",
      ],
      checkboxText:
        "Я розумію ризики. Додати цей вид під мою відповідальність.",
    };
  }

  if (category.includes("рослин")) {
    return {
      type: "partial",
      title: "Часткова сумісність",
      icon: "ℹ️",
      needsConfirm: true,
      boxClass: "border-blue-200 bg-blue-50 text-blue-700",
      buttonClass: "bg-blue-500 hover:bg-blue-600",
      points: [
        "Умови: рослина потребує відповідного освітлення та стабільних параметрів.",
        "CO₂ та добрива: для активного росту можуть знадобитися додаткові умови.",
      ],
      checkboxText: "Я врахував ці рекомендації. Додати вид.",
    };
  }

  return {
    type: "full",
    title: "Повна сумісність",
    icon: "✅",
    needsConfirm: false,
    boxClass: "border-green-200 bg-green-50 text-green-700",
    buttonClass: "bg-[#5b4cf6] hover:bg-[#4d3fe0]",
    points: [
      "Ідеальний вибір. Цей вид має схожі вимоги до параметрів води та мирний характер.",
      "Конфлікти виключені або малоймовірні.",
    ],
    checkboxText: "",
  };
}

function CompatibilityBox({ compatibility, confirmed, setConfirmed }) {
  const Icon =
    compatibility.type === "full"
      ? CheckCircle2
      : compatibility.type === "partial"
        ? Info
        : compatibility.type === "warning"
          ? AlertTriangle
          : ShieldAlert;

  return (
    <div
      className={`rounded-xl border px-4 py-4 text-[12px] font-semibold ${compatibility.boxClass}`}
    >
      <div className="mb-2 flex items-center gap-2 text-[14px] font-extrabold">
        <Icon size={17} />
        <span>{compatibility.title}</span>
      </div>

      <ul className="ml-1 space-y-1">
        {compatibility.points.map((point) => (
          <li key={point}>• {point}</li>
        ))}
      </ul>

      {compatibility.needsConfirm && (
        <label className="mt-4 flex cursor-pointer items-start gap-2 border-t border-current/20 pt-3 text-[11px] font-semibold">
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(event) => setConfirmed(event.target.checked)}
            className="mt-[2px]"
          />
          <span>{compatibility.checkboxText}</span>
        </label>
      )}
    </div>
  );
}

export function AddResidentModal({
  isOpen,
  onClose,
  onSave,
  isSaving = false,
}) {
  const [step, setStep] = useState("search");
  const [query, setQuery] = useState("");
  const [species, setSpecies] = useState([]);
  const [selectedSpecies, setSelectedSpecies] = useState(null);
  const [count, setCount] = useState("10");
  const [date, setDate] = useState(todayInputDate());
  const [confirmedRisk, setConfirmedRisk] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSpeciesLoading, setIsSpeciesLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const saving = isSaving || isSubmitting;

  const compatibility = useMemo(() => {
    if (!selectedSpecies) return null;

    return getCompatibilityInfo(selectedSpecies);
  }, [selectedSpecies]);

  useEffect(() => {
    if (!isOpen) return;

    setStep("search");
    setQuery("");
    setSelectedSpecies(null);
    setCount("10");
    setDate(todayInputDate());
    setConfirmedRisk(false);
    setErrorMessage("");
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const timeout = setTimeout(async () => {
      try {
        setIsSpeciesLoading(true);

        const data = await getSpeciesList({
          search: query,
        });

        setSpecies(Array.isArray(data) ? data : []);
      } catch {
        setSpecies([]);
      } finally {
        setIsSpeciesLoading(false);
      }
    }, 250);

    return () => clearTimeout(timeout);
  }, [isOpen, query]);

  const filteredSpecies = useMemo(() => {
    const value = query.trim().toLowerCase();

    if (!value) return species;

    return species.filter((item) => {
      return (
        item.name?.toLowerCase().includes(value) ||
        item.latin?.toLowerCase().includes(value)
      );
    });
  }, [species, query]);

  const handleClose = () => {
    if (saving) return;

    onClose?.();
  };

  const handleSelectSpecies = (item) => {
    setSelectedSpecies(item);
    setConfirmedRisk(false);
    setErrorMessage("");
    setStep("form");
  };

  const handleSave = async () => {
    try {
      setIsSubmitting(true);
      setErrorMessage("");

      if (!selectedSpecies?.id) {
        throw new Error("Оберіть вид для заселення");
      }

      if (!Number(count) || Number(count) <= 0) {
        throw new Error("Кількість має бути більшою за 0");
      }

      if (!date) {
        throw new Error("Оберіть дату заселення");
      }

      if (compatibility?.needsConfirm && !confirmedRisk) {
        throw new Error("Потрібно підтвердити ризики перед заселенням");
      }

      await onSave?.({
        species: selectedSpecies,
        count: Number(count),
        date,
        compatibility: compatibility?.type || "full",
        ignoreWarnings: compatibility?.needsConfirm ? confirmedRisk : false,
      });

      onClose?.();
    } catch (error) {
      setErrorMessage(error.message || "Не вдалося додати жителя");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[80] bg-black/45 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          <motion.div
            className="fixed inset-0 z-[90] flex items-start justify-center px-4 py-10"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            <div
              className="w-full max-w-[420px] overflow-hidden rounded-[16px] bg-white shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-[#eef0f4] px-5 py-4">
                <h2 className="text-[15px] font-extrabold text-[#111827]">
                  Додати жителів
                </h2>

                <button
                  type="button"
                  onClick={handleClose}
                  disabled={saving}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-[#9ca3af] transition hover:bg-slate-100 hover:text-[#111827] disabled:opacity-60"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="min-h-[260px] px-5 py-5">
                {errorMessage && (
                  <div className="mb-4 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-[12px] font-bold text-red-500">
                    {errorMessage}
                  </div>
                )}

                {step === "search" && (
                  <>
                    <label className="mb-2 block text-[11px] font-bold text-[#475467]">
                      Знайти вид
                    </label>

                    <div className="mb-3 flex h-9 items-center gap-2 rounded-[6px] border border-[#5b4cf6] px-3">
                      <Search size={14} className="text-[#64748b]" />

                      <input
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="Астроно"
                        className="h-full flex-1 bg-transparent text-[12px] font-semibold text-[#111827] outline-none placeholder:text-[#98a2b3]"
                        autoFocus
                      />
                    </div>

                    <div className="max-h-[210px] overflow-y-auto rounded-[8px] border border-[#eef0f4] bg-white shadow-[0_12px_30px_rgba(15,23,42,0.08)]">
                      {isSpeciesLoading && (
                        <div className="px-4 py-3 text-[12px] font-bold text-[#64748b]">
                          Пошук видів...
                        </div>
                      )}

                      {!isSpeciesLoading &&
                        filteredSpecies.map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => handleSelectSpecies(item)}
                            className="flex w-full items-center gap-3 border-b border-[#f1f3f7] px-3 py-3 text-left transition last:border-b-0 hover:bg-[#f8fafc]"
                          >
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#eef5ff] text-[17px]">
                              {getSpeciesIcon(item)}
                            </span>

                            <span className="min-w-0">
                              <span className="block truncate text-[12px] font-extrabold text-[#111827]">
                                {item.name}
                              </span>
                              <span className="block truncate text-[10px] font-medium text-[#98a2b3]">
                                {item.latin}
                              </span>
                            </span>
                          </button>
                        ))}

                      {!isSpeciesLoading && filteredSpecies.length === 0 && (
                        <div className="px-4 py-4 text-[12px] font-bold text-[#98a2b3]">
                          Нічого не знайдено
                        </div>
                      )}
                    </div>
                  </>
                )}

                {step === "form" && selectedSpecies && compatibility && (
                  <>
                    <label className="mb-2 block text-[11px] font-bold text-[#475467]">
                      Вид
                    </label>

                    <div className="mb-4 flex items-center justify-between rounded-[7px] border border-[#dfe3ec] px-3 py-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#eef5ff] text-[17px]">
                          {getSpeciesIcon(selectedSpecies)}
                        </span>

                        <div className="min-w-0">
                          <p className="truncate text-[12px] font-extrabold text-[#111827]">
                            {selectedSpecies.name}
                          </p>
                          <p className="truncate text-[10px] font-medium text-[#98a2b3]">
                            {selectedSpecies.latin}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setStep("search")}
                        disabled={saving}
                        className="text-[11px] font-bold text-[#64748b] hover:text-[#5b4cf6]"
                      >
                        Змінити
                      </button>
                    </div>

                    <CompatibilityBox
                      compatibility={compatibility}
                      confirmed={confirmedRisk}
                      setConfirmed={setConfirmedRisk}
                    />

                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div>
                        <label className="mb-2 block text-[11px] font-bold text-[#475467]">
                          Кількість (шт.)
                        </label>

                        <input
                          type="number"
                          min="1"
                          value={count}
                          onChange={(event) => setCount(event.target.value)}
                          disabled={saving}
                          className="h-10 w-full rounded-[7px] border border-[#d6dbe4] px-3 text-[12px] font-semibold outline-none focus:border-[#5b4cf6] focus:ring-4 focus:ring-[#5b4cf6]/10 disabled:bg-slate-100"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-[11px] font-bold text-[#475467]">
                          Дата заселення
                        </label>

                        <input
                          type="date"
                          value={date}
                          onChange={(event) => setDate(event.target.value)}
                          disabled={saving}
                          className="h-10 w-full rounded-[7px] border border-[#d6dbe4] px-3 text-[12px] font-semibold outline-none focus:border-[#5b4cf6] focus:ring-4 focus:ring-[#5b4cf6]/10 disabled:bg-slate-100"
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>

              {step === "form" && (
                <div className="flex justify-end gap-3 border-t border-[#eef0f4] bg-[#f8fafc] px-5 py-4">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={saving}
                    className="rounded-[8px] px-4 py-2 text-[12px] font-extrabold text-[#64748b] hover:bg-white disabled:opacity-60"
                  >
                    Скасувати
                  </button>

                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={
                      saving ||
                      (compatibility?.needsConfirm && !confirmedRisk)
                    }
                    className={`rounded-[8px] px-4 py-2 text-[12px] font-extrabold text-white shadow-[0_10px_24px_rgba(91,76,246,0.24)] transition disabled:cursor-not-allowed disabled:opacity-60 ${
                      compatibility?.buttonClass || "bg-[#5b4cf6]"
                    }`}
                  >
                    {saving ? "Заселення..." : "Заселити в акваріум"}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default AddResidentModal;