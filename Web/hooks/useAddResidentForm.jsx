"use client";

import { useMemo, useState } from "react";

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

export function getCompatibilityInfo(type) {
  if (type === "full") {
    return {
      title: "Повна сумісність",
      type: "full",
      text: "Ідеальний вибір. Ці риби мають схожі вимоги до параметрів води та мирний характер.",
      needsConfirm: false,
    };
  }

  return {
    title: "Критична несумісність",
    type: "critical",
    text: "Хижак: Астронотус може з’їсти поточних жителів. Об’єм: для цієї риби потрібен акваріум від 250 л.",
    needsConfirm: true,
    checkboxText:
      "Я розумію ризики. Додати цей вид в акваріум незважаючи на попередження системи.",
  };
}

export function useAddResidentForm({ onClose, onSave }) {
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

  const compatibility = selectedSpecies
    ? getCompatibilityInfo(selectedSpecies.compatibility)
    : null;

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
    onClose?.();
  };

  const handleSelectSpecies = (item) => {
    setSelectedSpecies(item);
    setConfirmedRisk(false);
    setStep("form");
  };

  const handleBackToSearch = () => {
    setStep("search");
    setSelectedSpecies(null);
    setConfirmedRisk(false);
  };

  const handleSave = () => {
    if (!selectedSpecies) return;

    if (compatibility?.needsConfirm && !confirmedRisk) {
      alert("Потрібно підтвердити ризики.");
      return;
    }

    onSave?.({
      species: selectedSpecies,
      count,
      date,
      compatibility: selectedSpecies.compatibility,
    });

    handleClose();
  };

  return {
    step,
    query,
    selectedSpecies,
    count,
    date,
    confirmedRisk,
    filteredSpecies,
    compatibility,
    setQuery,
    setCount,
    setDate,
    setConfirmedRisk,
    handleClose,
    handleSelectSpecies,
    handleBackToSearch,
    handleSave,
  };
}