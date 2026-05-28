"use client";

import { useCallback, useEffect, useState } from "react";

import {
  createAquarium,
  deleteAquarium,
  getAquariumNames,
  getMyAquariums,
  updateAquarium,
} from "../services/aquariumsApi";

import { createWaterTest } from "../services/testsApi";

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
    setAquariumsError("");
    setIsAddOpen(true);
  };

  const openEditModal = (aquarium) => {
    setEditingAquarium(aquarium);
    setSelectedAquarium(aquarium);
    setAquariumsError("");
    setIsSettingsOpen(false);
    setIsAddOpen(true);
  };

  const closeAddModal = () => {
    setIsAddOpen(false);
    setEditingAquarium(null);
  };

  const openSettingsModal = (aquarium) => {
    /*
      Тепер кнопка налаштувань відкриває саме модалку редагування,
      бо AddAquariumModal уже підтримує завантаження нового фото.
    */
    openEditModal(aquarium);
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

      if (editingAquarium?.id || payload?.id) {
        await updateAquarium({
          id: editingAquarium?.id || payload.id,
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
      closeAddModal();

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
    setIsAddOpen(false);
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

      setAquariums((prev) => prev.filter((aquarium) => aquarium.id !== id));

      setIsSettingsOpen(false);
      setIsAddOpen(false);
      setSelectedAquarium(null);
      setEditingAquarium(null);
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

  const saveWaterParams = async (params) => {
    try {
      if (!selectedAquarium?.id) {
        throw new Error("Не обрано акваріум для тесту");
      }

      setIsSaving(true);
      setAquariumsError("");

      await createWaterTest(selectedAquarium.id, params);

      setAquariums((prev) =>
        prev.map((aquarium) =>
          aquarium.id === selectedAquarium.id
            ? {
                ...aquarium,
                lastTest: {
                  days_ago: 0,
                  ph: params.ph,
                  gh: params.gh,
                  kh: params.kh,
                  nh3: params.nh3,
                  no2: params.no2,
                  no3: params.no3,
                },
                last_test: {
                  days_ago: 0,
                  ph: params.ph,
                  gh: params.gh,
                  kh: params.kh,
                  nh3: params.nh3,
                  no2: params.no2,
                  no3: params.no3,
                },
                lastTestText: "сьогодні",
                params: [
                  `pH ${params.ph || "—"}`,
                  `GH ${params.gh || "—"}`,
                  `KH ${params.kh || "—"}`,
                  `NH3 ${params.nh3 || "—"}`,
                  `NO2 ${params.no2 || "—"}`,
                  `NO3 ${params.no3 || "—"}`,
                ].join(" · "),
              }
            : aquarium
        )
      );

      setIsWaterParamsOpen(false);

      await loadAquariums();
    } catch (error) {
      setAquariumsError(error.message || "Не вдалося створити тест води");
      throw error;
    } finally {
      setIsSaving(false);
    }
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

    saveWaterParams,
    saveWaterParamsLocally: saveWaterParams,
  };
}

export default useAquariumsApi;