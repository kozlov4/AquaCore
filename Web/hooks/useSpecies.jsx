"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getAquariumNames } from "../services/aquariumsApi";
import {
  addSpeciesToAquarium,
  getSpeciesById,
  getSpeciesList,
} from "../services/speciesApi";

export function useSpecies() {
  const [species, setSpecies] = useState([]);
  const [aquariums, setAquariums] = useState([]);

  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [category, setCategory] = useState("all");
  const [waterType, setWaterType] = useState("all");
  const [character, setCharacter] = useState("all");

  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [speciesError, setSpeciesError] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(searchValue.trim());
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchValue]);

  const loadSpecies = useCallback(async () => {
    try {
      setIsLoading(true);
      setSpeciesError("");

      const data = await getSpeciesList({
        search: debouncedSearch,
        category,
        waterType,
        character,
      });

      setSpecies(Array.isArray(data) ? data : []);
    } catch (error) {
      setSpecies([]);
      setSpeciesError(error.message || "Не вдалося завантажити види");
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, category, waterType, character]);

  const loadAquariums = useCallback(async () => {
    try {
      const data = await getAquariumNames();
      setAquariums(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load aquariums for species list:", error);
      setAquariums([]);
    }
  }, []);

  useEffect(() => {
    loadSpecies();
  }, [loadSpecies]);

  useEffect(() => {
    loadAquariums();
  }, [loadAquariums]);

  const filteredSpecies = useMemo(() => {
    return species;
  }, [species]);

  return {
    species,
    filteredSpecies,
    aquariums,

    searchValue,
    setSearchValue,

    category,
    setCategory,

    waterType,
    setWaterType,

    character,
    setCharacter,

    isFiltersOpen,
    setIsFiltersOpen,

    isLoading,
    speciesError,

    loadSpecies,
    loadAquariums,
  };
}

export function useSpeciesDetails(id) {
  const [species, setSpecies] = useState(null);
  const [aquariums, setAquariums] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [speciesError, setSpeciesError] = useState("");

  const loadDetails = useCallback(async () => {
    if (!id) return;

    try {
      setIsLoading(true);
      setSpeciesError("");

      const data = await getSpeciesById(id);
      setSpecies(data);
    } catch (error) {
      setSpeciesError(error.message || "Не вдалося завантажити вид");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  const loadAquariums = useCallback(async () => {
    try {
      const data = await getAquariumNames();

      console.log("Aquariums for species modal:", data);

      setAquariums(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load aquariums for species:", error);
      setAquariums([]);
      setSpeciesError(error.message || "Не вдалося завантажити акваріуми");
    }
  }, []);

  useEffect(() => {
    loadDetails();
    loadAquariums();
  }, [loadDetails, loadAquariums]);

 const handleAddToAquarium = async ({
  aquariumId,
  quantity,
  settledAt,
  settlementDate,
  ignoreWarnings = false,
}) => {
  try {
    setIsSaving(true);
    setSpeciesError("");

    if (!species?.id) {
      throw new Error("Вид не завантажений");
    }

    const finalSettlementDate =
      settlementDate ||
      settledAt?.slice?.(0, 10) ||
      new Date().toISOString().slice(0, 10);

    const result = await addSpeciesToAquarium({
      speciesId: species.id,
      aquariumId,
      quantity,
      settlementDate: finalSettlementDate,
      ignoreWarnings,
    });

    if (result?.success === false && result?.warnings?.length > 0) {
      throw new Error(result.warnings.join("\n"));
    }

    setIsModalOpen(false);
    return result;
  } catch (error) {
    setSpeciesError(error.message || "Не вдалося додати вид в акваріум");
    throw error;
  } finally {
    setIsSaving(false);
  }
};

  return {
    species,
    aquariums,

    isModalOpen,
    setIsModalOpen,

    isLoading,
    isSaving,
    speciesError,

    loadDetails,
    loadAquariums,
    handleAddToAquarium,
  };
}