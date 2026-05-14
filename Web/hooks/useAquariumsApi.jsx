"use client";

import { useCallback, useEffect, useState } from "react";
import {
  createAquarium,
  deleteAquarium,
  getAquariumNames,
  getMyAquariums,
  updateAquarium,
} from "../services/aquariumsApi";

export function useAquariumsApi() {
  const [aquariums, setAquariums] = useState([]);
  const [aquariumNames, setAquariumNames] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [aquariumsError, setAquariumsError] = useState("");

  const loadAquariums = useCallback(async () => {
    try {
      setIsLoading(true);
      setAquariumsError("");

      const data = await getMyAquariums();

      setAquariums(data);
    } catch (error) {
      setAquariums([]);
      setAquariumsError(error.message || "Помилка завантаження акваріумів");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadAquariumNames = useCallback(async () => {
    try {
      setAquariumsError("");

      const data = await getAquariumNames();

      setAquariumNames(data);
    } catch (error) {
      setAquariumNames([]);
      setAquariumsError(error.message || "Помилка завантаження назв акваріумів");
    }
  }, []);

  useEffect(() => {
    loadAquariums();
    loadAquariumNames();
  }, [loadAquariums, loadAquariumNames]);

  const handleCreateAquarium = async ({
    name,
    volume,
    type,
    createdAt,
    imageId,
  }) => {
    try {
      setIsSaving(true);
      setAquariumsError("");

      await createAquarium({
        name,
        volume,
        type,
        createdAt,
        imageId,
      });

      await loadAquariums();
      await loadAquariumNames();
    } catch (error) {
      setAquariumsError(error.message || "Не вдалося створити акваріум");
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateAquarium = async ({
    id,
    name,
    volume,
    type,
    createdAt,
    imageId,
  }) => {
    try {
      setIsSaving(true);
      setAquariumsError("");

      await updateAquarium({
        id,
        name,
        volume,
        type,
        createdAt,
        imageId,
      });

      await loadAquariums();
      await loadAquariumNames();
    } catch (error) {
      setAquariumsError(error.message || "Не вдалося оновити акваріум");
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAquarium = async (id) => {
    try {
      setIsSaving(true);
      setAquariumsError("");

      await deleteAquarium(id);

      await loadAquariums();
      await loadAquariumNames();
    } catch (error) {
      setAquariumsError(error.message || "Не вдалося видалити акваріум");
    } finally {
      setIsSaving(false);
    }
  };

  return {
    aquariums,
    aquariumNames,

    isLoading,
    isSaving,
    aquariumsError,

    loadAquariums,
    loadAquariumNames,

    handleCreateAquarium,
    handleUpdateAquarium,
    handleDeleteAquarium,
  };
}