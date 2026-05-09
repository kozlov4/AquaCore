"use client";

import { useEffect, useMemo, useState } from "react";

const diseases = Array.from({ length: 12 }, (_, index) => ({
  id: index + 1,
  title: index % 3 === 0 ? "Туберкульоз риб" : "Манка / Іхтіофтіріоз",
  type: "fish",
  danger: index % 3 === 0 ? "high" : "medium",
  tags: ["білі_крапки", "скребіння", "дихання_біля_дна"],
  symptoms: ["схуднення", "виснаження", "викривлення", "інфекційна"],
  diagnostics: [
    "Поступове схуднення попри нормальне харчування",
    "Викривлення хребта",
    "Западання черевця",
    "Млявість, самотність",
  ],
  reason:
    "Мікобактерії — дуже стійкі. Передаються через канібалізм, заражену рибу, необроблений живий корм.",
  treatment: [
    "Підтвердіть підозру — зверніться до іхтіопатолога.",
    "Відсадити та ізолювати хвору рибу.",
    "Карантин нових риб мінімум 4 тижні.",
    "При роботі з акваріумом — надягайте рукавички.",
  ],
}));

export const diseaseFilters = [
  "Всі",
  "Дивна поведінка",
  "Плями на шкірі/лусці",
  "Проблеми з плавниками",
];

export function useDiseases() {
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("Всі");
  const [selectedDisease, setSelectedDisease] = useState(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(searchValue.trim().toLowerCase());
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchValue]);

  const filteredDiseases = useMemo(() => {
    return diseases.filter((disease) => {
      const titleMatch = disease.title.toLowerCase().includes(debouncedSearch);

      const tagsMatch = disease.tags.some((tag) =>
        tag.toLowerCase().includes(debouncedSearch)
      );

      const symptomsMatch = disease.symptoms.some((symptom) =>
        symptom.toLowerCase().includes(debouncedSearch)
      );

      const matchesSearch =
        debouncedSearch === "" || titleMatch || tagsMatch || symptomsMatch;

      const matchesFilter =
        activeFilter === "Всі" ||
        disease.tags
          .join(" ")
          .toLowerCase()
          .includes(activeFilter.toLowerCase()) ||
        disease.symptoms
          .join(" ")
          .toLowerCase()
          .includes(activeFilter.toLowerCase());

      return matchesSearch && matchesFilter;
    });
  }, [debouncedSearch, activeFilter]);

  return {
    searchValue,
    setSearchValue,
    debouncedSearch,
    activeFilter,
    setActiveFilter,
    selectedDisease,
    setSelectedDisease,
    filteredDiseases,
  };
}