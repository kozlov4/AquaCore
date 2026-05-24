"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import {
  getDiseaseById,
  getDiseases,
  getDiseaseTags,
} from "../services/diseasesApi";

export const diseaseTargetTypes = [
  {
    label: "Усі",
    value: "",
  },
  {
    label: "Риби",
    value: "fish",
  },
  {
    label: "Рослини",
    value: "plant",
  },
  {
    label: "Безхребетні",
    value: "invertebrate",
  },
];

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

  const [diseaseTags, setDiseaseTags] = useState(["Всі"]);
  const [filteredDiseases, setFilteredDiseases] = useState([]);

  const [selectedDisease, setSelectedDisease] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isTagsLoading, setIsTagsLoading] = useState(false);
  const [isDetailLoading, setIsDetailLoading] = useState(false);

  const [diseasesError, setDiseasesError] = useState("");
  const [tagsError, setTagsError] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(searchValue.trim());
    }, 350);

    return () => clearTimeout(timeout);
  }, [searchValue]);

  const loadDiseaseTags = useCallback(async () => {
    try {
      setIsTagsLoading(true);
      setTagsError("");

      const tags = await getDiseaseTags();

      setDiseaseTags(["Всі", ...tags.filter(Boolean)]);
    } catch (error) {
      setDiseaseTags(["Всі", ...diseaseFilters.filter((item) => item !== "Всі")]);
      setTagsError(error.message || "Помилка завантаження тегів хвороб");
    } finally {
      setIsTagsLoading(false);
    }
  }, []);

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
    loadDiseaseTags();
  }, [loadDiseaseTags]);

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

  const resetFilters = () => {
    setSearchValue("");
    setDebouncedSearch("");
    setActiveFilter("Всі");
    setActiveTargetType("");
  };

  const hasActiveFilters = useMemo(() => {
    return Boolean(searchValue.trim() || activeFilter !== "Всі" || activeTargetType);
  }, [searchValue, activeFilter, activeTargetType]);

  return {
    searchValue,
    setSearchValue,

    debouncedSearch,

    activeFilter,
    setActiveFilter,

    activeTargetType,
    setActiveTargetType,

    diseaseTags,

    selectedDisease,
    setSelectedDisease,

    filteredDiseases,

    isLoading,
    isTagsLoading,
    isDetailLoading,

    diseasesError,
    tagsError,

    hasActiveFilters,
    resetFilters,

    loadDiseases,
    loadDiseaseTags,

    openDiseaseDetails,
    closeDiseaseDetails,
  };
}