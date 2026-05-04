"use client";

import { useMemo, useState } from "react";
import { Search, X, AlertTriangle, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const species = [
  {
    id: 1,
    name: "Неон звичайний",
    latin: "Paracheirodon innesi",
    icon: "🐟",
    compatibility: "full",
  },
  {
    id: 2,
    name: "Астронотус (Оскар)",
    latin: "Astronotus ocellatus",
    icon: "🐟",
    compatibility: "critical",
  },
  {
    id: 3,
    name: "Астронотус альбінос",
    latin: "Astronotus ocellatus var.",
    icon: "🐟",
    compatibility: "critical",
  },
  {
    id: 4,
    name: "Креветка Амано",
    latin: "Caridina multidentata",
    icon: "🦐",
    compatibility: "full",
  },
];

function getCompatibilityInfo(type) {
  if (type === "full") {
    return {
      title: "Повна сумісність",
      className: "border-green-200 bg-green-50 text-green-700",
      icon: <CheckCircle size={18} />,
      text: "Ідеальний вибір. Ці риби мають схожі вимоги до параметрів води та мирний характер.",
      needsConfirm: false,
    };
  }

  return {
    title: "Критична несумісність",
    className: "border-red-200 bg-red-50 text-red-700",
    icon: <AlertTriangle size={18} />,
    text: "Хижак: Астронотус може з’їсти поточних жителів. Об’єм: для цієї риби потрібен акваріум від 250 л.",
    needsConfirm: true,
    checkboxText:
      "Я розумію ризики. Додати цей вид в акваріум незважаючи на попередження системи.",
  };
}

export function AddResidentModal({ isOpen, onClose, onSave }) {
  const [step, setStep] = useState("search");
  const [query, setQuery] = useState("");
  const [selectedSpecies, setSelectedSpecies] = useState(null);
  const [count, setCount] = useState("10");
  const [date, setDate] = useState("2026-04-23");
  const [confirmedRisk, setConfirmedRisk] = useState(false);

  const filteredSpecies = useMemo(() => {
    const value = query.trim().toLowerCase();

    if (!value) return species;

    return species.filter(
      (item) =>
        item.name.toLowerCase().includes(value) ||
        item.latin.toLowerCase().includes(value)
    );
  }, [query]);

  const reset = () => {
    setStep("search");
    setQuery("");
    setSelectedSpecies(null);
    setCount("10");
    setDate("2026-04-23");
    setConfirmedRisk(false);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSelectSpecies = (item) => {
    setSelectedSpecies(item);
    setConfirmedRisk(false);
    setStep("form");
  };

  const handleSave = () => {
    if (!selectedSpecies) return;

    const compatibility = getCompatibilityInfo(selectedSpecies.compatibility);

    if (compatibility.needsConfirm && !confirmedRisk) {
      alert("Потрібно підтвердити ризики.");
      return;
    }

    onSave({
      species: selectedSpecies,
      count,
      date,
      compatibility: selectedSpecies.compatibility,
    });

    handleClose();
  };

  const compatibility = selectedSpecies
    ? getCompatibilityInfo(selectedSpecies.compatibility)
    : null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/55 backdrop-blur-[2px]"
            onClick={handleClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 28 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed left-1/2 top-1/2 z-50 w-[640px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[22px] bg-white shadow-[0_25px_80px_rgba(15,23,42,0.28)]"
          >
            <div className="flex items-center justify-between border-b border-gray-200 px-7 py-5">
              <h2 className="text-2xl font-bold text-gray-900">
                Додати жителів
              </h2>

              <button
                type="button"
                onClick={handleClose}
                className="rounded-lg p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-800"
              >
                <X size={22} />
              </button>
            </div>

            {step === "search" && (
              <div className="min-h-[470px] px-7 py-7">
                <label className="mb-3 block text-lg font-bold text-gray-700">
                  Знайти вид
                </label>

                <div className="flex items-center gap-3 rounded-xl border-2 border-[#5B4CF6] px-4 py-3 shadow-[0_0_0_4px_rgba(91,76,246,0.08)]">
                  <Search size={22} className="text-gray-500" />

                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Введіть назву виду..."
                    className="w-full text-xl font-semibold text-gray-900 outline-none placeholder:text-gray-400"
                    autoFocus
                  />
                </div>

                <div className="mt-3 overflow-hidden rounded-xl border border-gray-200 shadow-[0_12px_35px_rgba(15,23,42,0.08)]">
                  {filteredSpecies.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelectSpecies(item)}
                      className="flex w-full items-center gap-4 border-b border-gray-100 px-5 py-4 text-left transition last:border-b-0 hover:bg-gray-50"
                    >
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-xl">
                        {item.icon}
                      </div>

                      <div>
                        <p className="text-xl font-bold text-gray-900">
                          {item.name}
                        </p>
                        <p className="text-base text-gray-500">{item.latin}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === "form" && selectedSpecies && (
              <>
                <div className="space-y-6 px-7 py-6">
                  <div>
                    <p className="mb-2 text-base font-bold text-gray-700">
                      Обраний вид
                    </p>

                    <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                          {selectedSpecies.icon}
                        </div>

                        <div>
                          <p className="text-lg font-bold text-gray-900">
                            {selectedSpecies.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {selectedSpecies.latin}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setStep("search");
                          setSelectedSpecies(null);
                          setConfirmedRisk(false);
                        }}
                        className="text-sm font-semibold text-gray-400 hover:text-[#5B4CF6]"
                      >
                        Змінити
                      </button>
                    </div>
                  </div>

                  {compatibility && (
                    <div
                      className={`rounded-2xl border p-5 ${compatibility.className}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-1">{compatibility.icon}</div>

                        <div>
                          <p className="text-lg font-bold">
                            {compatibility.title}
                          </p>

                          <p className="mt-2 text-sm leading-6">
                            {compatibility.text}
                          </p>
                        </div>
                      </div>

                      {compatibility.needsConfirm && (
                        <label className="mt-5 flex cursor-pointer items-start gap-3 border-t border-current/20 pt-4 text-sm">
                          <input
                            type="checkbox"
                            checked={confirmedRisk}
                            onChange={(e) =>
                              setConfirmedRisk(e.target.checked)
                            }
                            className="mt-1 h-4 w-4 accent-[#5B4CF6]"
                          />
                          <span>{compatibility.checkboxText}</span>
                        </label>
                      )}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className="mb-2 block text-base font-bold text-gray-700">
                        Кількість &#40;шт.&#41;
                      </label>

                      <input
                        type="number"
                        value={count}
                        onChange={(e) => setCount(e.target.value)}
                        className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base outline-none transition focus:border-[#5B4CF6] focus:ring-4 focus:ring-[#5B4CF6]/10"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-base font-bold text-gray-700">
                        Дата заселення
                      </label>

                      <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base outline-none transition focus:border-[#5B4CF6] focus:ring-4 focus:ring-[#5B4CF6]/10"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-4 bg-gray-50 px-7 py-5">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="rounded-xl px-5 py-3 font-semibold text-gray-700 transition hover:bg-gray-100"
                  >
                    Скасувати
                  </button>

                  <motion.button
                    type="button"
                    onClick={handleSave}
                    whileHover={{
                      y: -2,
                      boxShadow:
                        selectedSpecies.compatibility === "critical"
                          ? "0 14px 30px rgba(239,68,68,.28)"
                          : "0 14px 30px rgba(91,76,246,.28)",
                    }}
                    whileTap={{ scale: 0.97 }}
                    className={`rounded-xl px-6 py-3 font-semibold text-white transition ${
                      selectedSpecies.compatibility === "critical"
                        ? "bg-red-400 hover:bg-red-500"
                        : "bg-[#5B4CF6] hover:bg-[#4d3feb]"
                    }`}
                  >
                    {selectedSpecies.compatibility === "critical"
                      ? "Заселити з ризиком"
                      : "Заселити в акваріум"}
                  </motion.button>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}