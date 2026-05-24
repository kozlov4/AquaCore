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

  const [selectedAquarium, setSelectedAquarium] = useState(null);
  const [editingAquarium, setEditingAquarium] = useState(null);
  const [deletingAquarium, setDeletingAquarium] = useState(null);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isWaterParamsOpen, setIsWaterParamsOpen] = useState(false);
  const [isTaskOpen, setIsTaskOpen] = useState(false);

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
      const data = await getAquariumNames();

      setAquariumNames(data);
    } catch {
      setAquariumNames([]);
    }
  }, []);

  useEffect(() => {
    loadAquariums();
    loadAquariumNames();
  }, [loadAquariums, loadAquariumNames]);

  const openCreateModal = () => {
    setEditingAquarium(null);
    setIsAddOpen(true);
  };

  const openEditModal = (aquarium) => {
    setEditingAquarium(aquarium);
    setIsSettingsOpen(false);
    setIsAddOpen(true);
  };

  const closeAddModal = () => {
    setIsAddOpen(false);
    setEditingAquarium(null);
  };

  const openSettingsModal = (aquarium) => {
    setSelectedAquarium(aquarium);
    setAquariumsError("");
    setIsSettingsOpen(true);
  };

  const closeSettingsModal = () => {
    setIsSettingsOpen(false);
  };

  const openWaterParamsModal = (aquarium) => {
    setSelectedAquarium(aquarium);
    setAquariumsError("");
    setIsWaterParamsOpen(true);
  };

  const closeWaterParamsModal = () => {
    setIsWaterParamsOpen(false);
  };

  const openTaskModal = (aquarium) => {
    setSelectedAquarium(aquarium);
    setAquariumsError("");
    setIsTaskOpen(true);
  };

  const closeTaskModal = () => {
    setIsTaskOpen(false);
  };

  const saveAquarium = async (payload) => {
    try {
      setIsSaving(true);
      setAquariumsError("");

      if (editingAquarium?.id) {
        await updateAquarium({
          id: editingAquarium.id,
          ...payload,
        });
      } else {
        await createAquarium(payload);
      }

      closeAddModal();

      await loadAquariums();
      await loadAquariumNames();
    } catch (error) {
      setAquariumsError(error.message || "Не вдалося зберегти акваріум");
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const saveSettingsAquarium = async (payload) => {
    try {
      setIsSaving(true);
      setAquariumsError("");

      await updateAquarium(payload);

      setIsSettingsOpen(false);

      await loadAquariums();
      await loadAquariumNames();
    } catch (error) {
      setAquariumsError(error.message || "Не вдалося оновити акваріум");
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const askDeleteAquarium = (aquarium) => {
    setDeletingAquarium(aquarium);
    setIsSettingsOpen(false);
  };

  const cancelDeleteAquarium = () => {
    setDeletingAquarium(null);
  };

  const confirmDeleteAquarium = async () => {
    if (!deletingAquarium?.id) return;

    try {
      setIsSaving(true);
      setAquariumsError("");

      await deleteAquarium(deletingAquarium.id);

      setAquariums((prev) =>
        prev.filter((aquarium) => aquarium.id !== deletingAquarium.id)
      );

      setDeletingAquarium(null);
      setSelectedAquarium(null);

      await loadAquariums();
      await loadAquariumNames();
    } catch (error) {
      setAquariumsError(error.message || "Не вдалося видалити акваріум");
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const deleteSelectedAquarium = async (id) => {
    if (!id) {
      throw new Error("Не передано id акваріума");
    }

    try {
      setIsSaving(true);
      setAquariumsError("");

      await deleteAquarium(id);

      setAquariums((prev) =>
        prev.filter((aquarium) => aquarium.id !== id)
      );

      setIsSettingsOpen(false);
      setSelectedAquarium(null);
      setDeletingAquarium(null);

      await loadAquariums();
      await loadAquariumNames();
    } catch (error) {
      setAquariumsError(error.message || "Не вдалося видалити акваріум");
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const saveWaterParamsLocally = (params) => {
    if (!selectedAquarium?.id) return;

    setAquariums((prev) =>
      prev.map((aquarium) =>
        aquarium.id === selectedAquarium.id
          ? {
              ...aquarium,
              lastTest: "Останній тест: сьогодні",
              params: `pH ${params.ph} · GH ${params.gh} · KH ${params.kh}`,
            }
          : aquarium
      )
    );

    setIsWaterParamsOpen(false);
  };

  return {
    aquariums,
    aquariumNames,

    selectedAquarium,
    editingAquarium,
    deletingAquarium,

    isAddOpen,
    isSettingsOpen,
    isWaterParamsOpen,
    isTaskOpen,

    isLoading,
    isSaving,

    aquariumsError,

    loadAquariums,
    loadAquariumNames,

    openCreateModal,
    openEditModal,
    closeAddModal,

    openSettingsModal,
    closeSettingsModal,

    openWaterParamsModal,
    closeWaterParamsModal,

    openTaskModal,
    closeTaskModal,

    saveAquarium,
    saveSettingsAquarium,

    askDeleteAquarium,
    cancelDeleteAquarium,
    confirmDeleteAquarium,
    deleteSelectedAquarium,

    saveWaterParamsLocally,
  };
}