"use client";

import { useEffect, useMemo, useState } from "react";
import { X, ChevronDown, CheckCircle2, Info, AlertTriangle, ShieldAlert } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import {
  addSpeciesToAquarium,
  checkSpeciesCompatibility,
  getAquariumNames,
} from "../../services/speciesApi";

function todayInputDate() {
  return new Date().toISOString().slice(0, 10);
}

function getAquariumId(item) {
  return item?.id || item?.aquarium_id || item?.aquariumId;
}

function getAquariumName(item) {
  return item?.name || item?.title || "Акваріум";
}

function getAquariumVolume(item) {
  return item?.volume || item?.liters || item?.capacity_liters || item?.capacity;
}

function getSpeciesIcon(species) {
  if (species?.icon) return species.icon;

  const category = String(species?.category || "").toLowerCase();

  if (category.includes("рослин")) return "🌿";
  if (category.includes("безхреб")) return "🦐";

  return "🐟";
}

function getCompatibilityClasses(type) {
  if (type === "critical") {
    return {
      box: "border-red-200 bg-red-50 text-red-700",
      button: "bg-red-500 hover:bg-red-600",
      icon: ShieldAlert,
      checkbox:
        "Я розумію ризики. Додати цей вид в акваріум незважаючи на попередження системи.",
    };
  }

  if (type === "aggression") {
    return {
      box: "border-yellow-200 bg-yellow-50 text-yellow-700",
      button: "bg-yellow-500 hover:bg-yellow-600",
      icon: AlertTriangle,
      checkbox: "Я розумію ризики. Додати цей вид під мою відповідальність.",
    };
  }

  if (type === "partial") {
    return {
      box: "border-blue-200 bg-blue-50 text-blue-700",
      button: "bg-blue-500 hover:bg-blue-600",
      icon: Info,
      checkbox: "Я врахував ці рекомендації. Додати вид.",
    };
  }

  return {
    box: "border-green-200 bg-green-50 text-green-700",
    button: "bg-[#5b4cf6] hover:bg-[#4d3fe0]",
    icon: CheckCircle2,
    checkbox: "",
  };
}

function CompatibilityBox({ compatibility, confirmed, setConfirmed, isLoading }) {
  if (isLoading) {
    return (
      <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-[12px] font-bold text-blue-600">
        Перевіряємо сумісність виду з обраним акваріумом...
      </div>
    );
  }

  if (!compatibility) {
    return (
      <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-[12px] font-bold text-slate-500">
        Система автоматично перевірить сумісність після вибору акваріума.
      </div>
    );
  }

  const styles = getCompatibilityClasses(compatibility.type);
  const Icon = styles.icon;

  return (
    <div className={`rounded-xl border px-4 py-4 text-[12px] font-semibold ${styles.box}`}>
      <div className="mb-2 flex items-center gap-2 text-[14px] font-extrabold">
        <Icon size={17} />
        <span>{compatibility.title}</span>
      </div>

      <ul className="ml-1 space-y-1">
        {(compatibility.points || []).map((point) => (
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
          <span>{styles.checkbox}</span>
        </label>
      )}
    </div>
  );
}

export function AddSpeciesToAquariumModal({
  isOpen,
  onClose,
  species,
}) {
  const [aquariums, setAquariums] = useState([]);
  const [selectedAquariumId, setSelectedAquariumId] = useState("");
  const [quantity, setQuantity] = useState("10");
  const [settlementDate, setSettlementDate] = useState(todayInputDate());

  const [compatibility, setCompatibility] = useState(null);
  const [confirmedRisk, setConfirmedRisk] = useState(false);

  const [isAquariumsLoading, setIsAquariumsLoading] = useState(false);
  const [isCompatibilityLoading, setIsCompatibilityLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const selectedAquarium = useMemo(() => {
    return aquariums.find(
      (item) => String(getAquariumId(item)) === String(selectedAquariumId)
    );
  }, [aquariums, selectedAquariumId]);

  const buttonClass = getCompatibilityClasses(compatibility?.type).button;

  useEffect(() => {
    if (!isOpen) return;

    setSelectedAquariumId("");
    setQuantity("10");
    setSettlementDate(todayInputDate());
    setCompatibility(null);
    setConfirmedRisk(false);
    setErrorMessage("");
    setSuccessMessage("");

    async function loadAquariums() {
      try {
        setIsAquariumsLoading(true);

        const data = await getAquariumNames();

        setAquariums(Array.isArray(data) ? data : []);

        if (Array.isArray(data) && data.length > 0) {
          const firstId = getAquariumId(data[0]);

          if (firstId) {
            setSelectedAquariumId(String(firstId));
          }
        }
      } catch (error) {
        setAquariums([]);
        setErrorMessage(error.message || "Не вдалося завантажити акваріуми");
      } finally {
        setIsAquariumsLoading(false);
      }
    }

    loadAquariums();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !selectedAquariumId || !species?.id) return;

    async function checkCompatibility() {
      try {
        setIsCompatibilityLoading(true);
        setCompatibility(null);
        setConfirmedRisk(false);
        setErrorMessage("");

        const result = await checkSpeciesCompatibility({
          aquariumId: selectedAquariumId,
          speciesId: species.id,
        });

        setCompatibility(result);
      } catch (error) {
        setCompatibility({
          type: "partial",
          title: "Часткова сумісність",
          icon: "ℹ️",
          needsConfirm: true,
          points: [
            error.message || "Не вдалося перевірити сумісність автоматично.",
            "Перевірте умови утримання вручну перед заселенням.",
          ],
        });
      } finally {
        setIsCompatibilityLoading(false);
      }
    }

    checkCompatibility();
  }, [isOpen, selectedAquariumId, species?.id]);

  const handleClose = () => {
    if (isSaving) return;

    onClose?.();
  };

  const handleSubmit = async () => {
    try {
      setIsSaving(true);
      setErrorMessage("");
      setSuccessMessage("");

      if (!selectedAquariumId) {
        throw new Error("Оберіть акваріум");
      }

      if (!species?.id) {
        throw new Error("Не передано id виду");
      }

      if (!Number(quantity) || Number(quantity) <= 0) {
        throw new Error("Кількість має бути більшою за 0");
      }

      if (!settlementDate) {
        throw new Error("Оберіть дату заселення");
      }

      if (compatibility?.needsConfirm && !confirmedRisk) {
        throw new Error("Потрібно підтвердити ризики перед заселенням");
      }

      await addSpeciesToAquarium({
        aquariumId: selectedAquariumId,
        speciesId: species.id,
        quantity: Number(quantity),
        settlementDate,
        ignoreWarnings: compatibility?.needsConfirm ? confirmedRisk : false,
      });

      setSuccessMessage("Вид успішно заселено в акваріум");

      setTimeout(() => {
        onClose?.();
      }, 650);
    } catch (error) {
      setErrorMessage(error.message || "Не вдалося заселити вид в акваріум");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && species && (
        <>
          <motion.div
            className="fixed inset-0 z-[90] bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          <motion.div
            className="fixed inset-0 z-[100] flex items-start justify-center px-4 py-8"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            <div
              className="w-full max-w-[430px] overflow-hidden rounded-[18px] bg-white shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-[#eef0f4] px-6 py-5">
                <h2 className="text-[18px] font-extrabold text-[#111827]">
                  Заселення жителів
                </h2>

                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isSaving}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-[#9ca3af] transition hover:bg-slate-100 hover:text-[#111827] disabled:opacity-60"
                >
                  <X size={19} />
                </button>
              </div>

              <div className="space-y-5 px-6 py-5">
                {errorMessage && (
                  <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-[12px] font-bold text-red-500">
                    {errorMessage}
                  </div>
                )}

                {successMessage && (
                  <div className="rounded-xl border border-green-100 bg-green-50 px-4 py-3 text-[12px] font-bold text-green-600">
                    {successMessage}
                  </div>
                )}

                <div>
                  <label className="mb-2 block text-[13px] font-extrabold text-[#475467]">
                    Для якої екосистеми?
                  </label>

                  <div className="relative">
                    <select
                      value={selectedAquariumId}
                      onChange={(event) => setSelectedAquariumId(event.target.value)}
                      disabled={isAquariumsLoading || isSaving}
                      className="h-12 w-full appearance-none rounded-xl border border-[#d6dbe4] bg-white px-4 pr-10 text-[14px] font-bold text-[#111827] outline-none transition focus:border-[#635bff] focus:ring-4 focus:ring-[#635bff]/10 disabled:bg-slate-100"
                    >
                      <option value="">
                        {isAquariumsLoading
                          ? "Завантаження..."
                          : "Оберіть екосистему..."}
                      </option>

                      {aquariums.map((aquarium) => {
                        const id = getAquariumId(aquarium);
                        const volume = getAquariumVolume(aquarium);

                        return (
                          <option key={id} value={id}>
                            {getAquariumName(aquarium)}
                            {volume ? ` (${volume} л)` : ""}
                          </option>
                        );
                      })}
                    </select>

                    <ChevronDown
                      size={18}
                      className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#667085]"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-[13px] font-extrabold text-[#475467]">
                    Обраний вид
                  </label>

                  <div className="flex items-center gap-3 rounded-xl border border-[#e3e9f2] bg-[#f8fafc] px-4 py-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[20px] shadow-sm">
                      {getSpeciesIcon(species)}
                    </span>

                    <div className="min-w-0">
                      <p className="truncate text-[14px] font-extrabold text-[#111827]">
                        {species.name}
                      </p>
                      <p className="truncate text-[12px] font-medium italic text-[#98a2b3]">
                        {species.latin}
                      </p>
                    </div>
                  </div>
                </div>

                <CompatibilityBox
                  compatibility={compatibility}
                  confirmed={confirmedRisk}
                  setConfirmed={setConfirmedRisk}
                  isLoading={isCompatibilityLoading}
                />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-2 block text-[13px] font-extrabold text-[#475467]">
                      Кількість (шт.)
                    </label>

                    <input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(event) => setQuantity(event.target.value)}
                      disabled={isSaving}
                      className="h-11 w-full rounded-xl border border-[#d6dbe4] px-4 text-[14px] font-bold text-[#111827] outline-none transition focus:border-[#635bff] focus:ring-4 focus:ring-[#635bff]/10 disabled:bg-slate-100"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-[13px] font-extrabold text-[#475467]">
                      Дата заселення
                    </label>

                    <input
                      type="date"
                      value={settlementDate}
                      onChange={(event) => setSettlementDate(event.target.value)}
                      disabled={isSaving}
                      className="h-11 w-full rounded-xl border border-[#d6dbe4] px-4 text-[14px] font-bold text-[#111827] outline-none transition focus:border-[#635bff] focus:ring-4 focus:ring-[#635bff]/10 disabled:bg-slate-100"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-[#eef0f4] bg-[#f8fafc] px-6 py-5">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isSaving}
                  className="rounded-xl px-5 py-3 text-sm font-extrabold text-[#64748b] transition hover:bg-white disabled:opacity-60"
                >
                  Скасувати
                </button>

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={
                    isSaving ||
                    isCompatibilityLoading ||
                    !selectedAquariumId ||
                    (compatibility?.needsConfirm && !confirmedRisk)
                  }
                  className={`rounded-xl px-5 py-3 text-sm font-extrabold text-white shadow-[0_12px_28px_rgba(91,76,246,0.24)] transition disabled:cursor-not-allowed disabled:opacity-60 ${buttonClass}`}
                >
                  {isSaving ? "Заселення..." : "Заселити в акваріум"}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default AddSpeciesToAquariumModal;