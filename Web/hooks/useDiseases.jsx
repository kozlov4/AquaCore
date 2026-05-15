"use client";

import { useCallback, useEffect, useState } from "react";
import { getDiseaseById, getDiseases } from "../services/diseasesApi";

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
  const [activeTargetType, setActiveTargetType] = useState("");

  const [filteredDiseases, setFilteredDiseases] = useState([]);
  const [selectedDisease, setSelectedDisease] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [diseasesError, setDiseasesError] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(searchValue.trim());
    }, 350);

    return () => clearTimeout(timeout);
  }, [searchValue]);

  const loadDiseases = useCallback(async () => {
    try {
      setIsLoading(true);
      setDiseasesError("");

      const categoryTags = activeFilter === "Всі" ? [] : [activeFilter];

      const data = await getDiseases({
        targetType: activeTargetType,
        searchText: debouncedSearch,
        categoryTags,
      });

      setFilteredDiseases(data);
    } catch (error) {
      setFilteredDiseases([]);
      setDiseasesError(error.message || "Помилка завантаження хвороб");
    } finally {
      setIsLoading(false);
    }
  }, [activeFilter, activeTargetType, debouncedSearch]);

  useEffect(() => {
    loadDiseases();
  }, [loadDiseases]);

  const openDiseaseDetails = async (disease) => {
    try {
      setIsDetailLoading(true);
      setDiseasesError("");

      const details = await getDiseaseById(disease.id);

      setSelectedDisease(details);
    } catch (error) {
      setDiseasesError(error.message || "Помилка завантаження деталей хвороби");
    } finally {
      setIsDetailLoading(false);
    }
  };

  const closeDiseaseDetails = () => {
    setSelectedDisease(null);
  };

  return {
    searchValue,
    setSearchValue,

    debouncedSearch,

    activeFilter,
    setActiveFilter,

    activeTargetType,
    setActiveTargetType,

    selectedDisease,
    setSelectedDisease,

    filteredDiseases,

    isLoading,
    isDetailLoading,
    diseasesError,

    loadDiseases,
    openDiseaseDetails,
    closeDiseaseDetails,
  };
}