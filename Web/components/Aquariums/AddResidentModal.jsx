"use client";

import { useEffect, useMemo, useState } from "react";
import { X, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getSpeciesList } from "../../services/speciesApi";
import { checkAquariumCompatibility } from "../../services/aquariumsApi";

function todayInputDate() {
  return new Date().toISOString().slice(0, 10);
}

function getCompatibilityView(compatibility) {
  const status = String(compatibility?.status || "").toLowerCase();

  if (
    status.includes("critical") ||
    status.includes("danger") ||
    status.includes("bad") ||
    status.includes("несум")
  ) {
    return {
      type: "critical",
      title: compatibility?.status_title || "Критична несумісність",
      className: "border-red-100 bg-red-50 text-red-700",
      needsConfirm: true,
    };
  }

  if (
    status.includes("warning") ||
    status.includes("risk") ||
    status.includes("medium") ||
    status.includes("уваг") ||
    status.includes("ризик")
  ) {
    return {
      type: "warning",
      title: compatibility?.status_title || "Є попередження",
      className: "border-amber-100 bg-amber-50 text-amber-700",
      needsConfirm: true,
    };
  }

  return {
    type: "success",
    title: compatibility?.status_title || "Повна сумісність",
    className: "border-emerald-100 bg-emerald-50 text-emerald-700",
    needsConfirm: false,
  };
}

export function AddResidentModal({ isOpen, onClose, onSave, aquariumId }) {
  const [step, setStep] = useState("search");
  const [query, setQuery] = useState("");
  const [species, setSpecies] = useState([]);
  const [selectedSpecies, setSelectedSpecies] = useState(null);

  const [quantity, setQuantity] = useState("10");
  const [settlementDate, setSettlementDate] = useState(todayInputDate());

  const [compatibility, setCompatibility] = useState(null);
  const [confirmedRisk, setConfirmedRisk] = useState(false);

  const [isSpeciesLoading, setIsSpeciesLoading] = useState(false);
  const [isCheckingCompatibility, setIsCheckingCompatibility] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [error, setError] = useState("");

  const compatibilityView = useMemo(
    () => getCompatibilityView(compatibility),
    [compatibility]
  );

  const filteredSpecies = useMemo(() => {
    const value = query.trim().toLowerCase();

    if (!value) return species;

    return species.filter((item) => {
      return (
        item.name?.toLowerCase().includes(value) ||
        item.latin?.toLowerCase().includes(value)
      );
    });
  }, [query, species]);

  useEffect(() => {
    if (!isOpen) return;

    async function loadSpecies() {
      try {
        setIsSpeciesLoading(true);
        setError("");

        const data = await getSpeciesList();

        setSpecies(Array.isArray(data) ? data : []);
      } catch (loadError) {
        setError(loadError.message || "Не вдалося завантажити список видів");
      } finally {
        setIsSpeciesLoading(false);
      }
    }

    loadSpecies();
  }, [isOpen]);

  const reset = () => {
    setStep("search");
    setQuery("");
    setSelectedSpecies(null);
    setQuantity("10");
    setSettlementDate(todayInputDate());
    setCompatibility(null);
    setConfirmedRisk(false);
    setError("");
    setIsSaving(false);
    setIsCheckingCompatibility(false);
  };

  const handleClose = () => {
    if (isSaving) return;

    reset();
    onClose?.();
  };

  const handleSelectSpecies = async (item) => {
    try {
      setSelectedSpecies(item);
      setCompatibility(null);
      setConfirmedRisk(false);
      setStep("form");
      setError("");

      if (!aquariumId) {
        throw new Error("Не знайдено id акваріума в URL");
      }

      setIsCheckingCompatibility(true);

      const result = await checkAquariumCompatibility(aquariumId, item.id);

      setCompatibility(result);
    } catch (checkError) {
      setError(
        checkError.message || "Не вдалося перевірити сумісність цього виду"
      );
    } finally {
      setIsCheckingCompatibility(false);
    }
  };

  const handleBackToSearch = () => {
    setStep("search");
    setSelectedSpecies(null);
    setCompatibility(null);
    setConfirmedRisk(false);
    setError("");
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError("");

      if (!selectedSpecies?.id) {
        throw new Error("Оберіть вид");
      }

      if (!quantity || Number(quantity) <= 0) {
        throw new Error("Кількість має бути більшою за 0");
      }

      if (!settlementDate) {
        throw new Error("Оберіть дату заселення");
      }

      if (compatibilityView.needsConfirm && !confirmedRisk) {
        throw new Error("Потрібно підтвердити ризики перед заселенням");
      }

      await onSave?.({
        speciesId: selectedSpecies.id,
        quantity: Number(quantity),
        settlementDate,
        species: selectedSpecies,
        compatibility,
      });

      handleClose();
    } catch (saveError) {
      setError(saveError.message || "Не вдалося заселити рибу");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/45 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          <motion.div
            className="fixed left-1/2 top-1/2 z-50 w-[92vw] max-w-[470px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[22px] bg-white shadow-2xl"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <h2 className="text-base font-black text-gray-900">
                Додати жителів
              </h2>

              <button
                type="button"
                onClick={handleClose}
                disabled={isSaving}
                className="rounded-lg p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5">
              {error && (
                <div className="mb-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-red-600">
                  {error}
                </div>
              )}

              {step === "search" && (
                <>
                  <label className="mb-2 block text-xs font-black text-gray-700">
                    Знайти вид
                  </label>

                  <div className="mb-4 flex h-11 items-center gap-2 rounded-xl border border-[#5B4CF6] px-3">
                    <Search size={16} className="text-[#5B4CF6]" />

                    <input
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder="Введіть назву виду..."
                      className="w-full text-sm font-semibold text-gray-900 outline-none placeholder:text-gray-400"
                      autoFocus
                    />
                  </div>

                  <div className="max-h-[280px] overflow-y-auto rounded-xl border border-gray-100 shadow-sm">
                    {isSpeciesLoading ? (
                      <div className="px-5 py-5 text-center text-sm font-bold text-gray-500">
                        Завантаження видів...
                      </div>
                    ) : filteredSpecies.length === 0 ? (
                      <div className="px-5 py-5 text-center text-sm font-bold text-gray-500">
                        Нічого не знайдено
                      </div>
                    ) : (
                      filteredSpecies.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleSelectSpecies(item)}
                          className="flex w-full items-center gap-4 border-b border-gray-100 px-5 py-4 text-left transition last:border-b-0 hover:bg-gray-50"
                        >
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eef2ff] text-xl">
                            {item.icon || "🐠"}
                          </div>

                          <div>
                            <p className="text-sm font-black text-gray-900">
                              {item.name}
                            </p>

                            <p className="text-xs font-semibold text-gray-500">
                              {item.latin || item.category || "Вид"}
                            </p>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </>
              )}

              {step === "form" && selectedSpecies && (
                <>
                  <label className="mb-2 block text-xs font-black text-gray-700">
                    Вид
                  </label>

                  <div className="mb-4 flex items-center justify-between rounded-xl border border-[#c7d2fe] bg-[#eef2ff] px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{selectedSpecies.icon || "🐠"}</span>

                      <div>
                        <p className="text-sm font-black text-gray-900">
                          {selectedSpecies.name}
                        </p>

                        <p className="text-xs font-semibold text-gray-500">
                          {selectedSpecies.latin}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleBackToSearch}
                      disabled={isSaving}
                      className="rounded-lg p-1 text-gray-400 hover:bg-white hover:text-gray-700 disabled:opacity-50"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  {isCheckingCompatibility ? (
                    <div className="mb-4 rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm font-bold text-blue-700">
                      Перевіряю сумісність...
                    </div>
                  ) : compatibility ? (
                    <div
                      className={`mb-4 rounded-xl border p-4 ${compatibilityView.className}`}
                    >
                      <p className="text-sm font-black">
                        {compatibilityView.title}
                      </p>

                      {Array.isArray(compatibility.issues) &&
                        compatibility.issues.length > 0 && (
                          <div className="mt-2 space-y-2">
                            {compatibility.issues.map((issue, index) => (
                              <div key={`${issue.title}-${index}`}>
                                <p className="text-xs font-black">
                                  {issue.title}
                                </p>

                                <p className="text-xs font-semibold opacity-90">
                                  {issue.description}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}

                      {compatibilityView.needsConfirm && (
                        <label className="mt-3 flex cursor-pointer items-start gap-2 text-xs font-bold">
                          <input
                            type="checkbox"
                            checked={confirmedRisk}
                            onChange={(event) =>
                              setConfirmedRisk(event.target.checked)
                            }
                            className="mt-0.5"
                          />
                          <span>
                            Я розумію попередження системи та хочу заселити цей
                            вид.
                          </span>
                        </label>
                      )}
                    </div>
                  ) : null}

                  <div className="mb-5 grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-2 block text-xs font-black text-gray-700">
                        Кількість (шт.)
                      </label>

                      <input
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(event) => setQuantity(event.target.value)}
                        disabled={isSaving}
                        className="h-11 w-full rounded-xl border border-gray-200 px-4 text-sm font-bold outline-none transition focus:border-[#5B4CF6] focus:ring-4 focus:ring-[#5B4CF6]/10 disabled:bg-gray-100"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-black text-gray-700">
                        Дата заселення
                      </label>

                      <input
                        type="date"
                        value={settlementDate}
                        onChange={(event) =>
                          setSettlementDate(event.target.value)
                        }
                        disabled={isSaving}
                        className="h-11 w-full rounded-xl border border-gray-200 px-4 text-sm font-bold outline-none transition focus:border-[#5B4CF6] focus:ring-4 focus:ring-[#5B4CF6]/10 disabled:bg-gray-100"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={handleClose}
                      disabled={isSaving}
                      className="h-10 rounded-xl px-4 text-sm font-black text-gray-500 transition hover:bg-gray-100 disabled:opacity-50"
                    >
                      Скасувати
                    </button>

                    <button
                      type="button"
                      onClick={handleSave}
                      disabled={isSaving || isCheckingCompatibility}
                      className="h-10 rounded-xl bg-[#5B4CF6] px-5 text-sm font-black text-white shadow-lg shadow-[#5B4CF6]/20 transition hover:bg-[#4f43df] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isSaving ? "Заселення..." : "Заселити в акваріум"}
                    </button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default AddResidentModal;