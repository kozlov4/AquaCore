"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";

import {
  addEquipment,
  getEquipment,
  serviceEquipment,
} from "../services/equipmentApi";

import { addSpeciesToAquarium } from "../services/speciesApi";

export function useAquariumDetails() {
  const router = useRouter();
  const aquariumId = router.query.id;

  const [activeTab, setActiveTab] = useState("Населення");

  const [isAddResidentOpen, setIsAddResidentOpen] = useState(false);
  const [isAddEquipmentOpen, setIsAddEquipmentOpen] = useState(false);

  const [residents, setResidents] = useState([]);
  const [equipment, setEquipment] = useState([]);

  const [isResidentSaving, setIsResidentSaving] = useState(false);
  const [residentError, setResidentError] = useState("");

  const [isEquipmentLoading, setIsEquipmentLoading] = useState(false);
  const [isEquipmentSaving, setIsEquipmentSaving] = useState(false);
  const [isServiceLoading, setIsServiceLoading] = useState(false);

  const [equipmentError, setEquipmentError] = useState("");

  const loadEquipment = useCallback(async () => {
    if (!router.isReady || !aquariumId) return;

    try {
      setIsEquipmentLoading(true);
      setEquipmentError("");

      const data = await getEquipment(aquariumId);

      setEquipment(Array.isArray(data) ? data : []);
    } catch (error) {
      setEquipment([]);
      setEquipmentError(error.message || "Не вдалося завантажити обладнання");
    } finally {
      setIsEquipmentLoading(false);
    }
  }, [router.isReady, aquariumId]);

  useEffect(() => {
    if (router.isReady && aquariumId) {
      loadEquipment();
    }
  }, [router.isReady, aquariumId, loadEquipment]);

  const handleAddResident = async (resident) => {
    if (!aquariumId) {
      throw new Error("Не передано id акваріума");
    }

    const species = resident?.species;

    if (!species?.id) {
      throw new Error("Не обрано вид для заселення");
    }

    const count = Number(resident?.count || resident?.quantity || 1);
    const date = resident?.date || resident?.settlement_date;
    const ignoreWarnings = Boolean(
      resident?.ignoreWarnings || resident?.ignore_warnings
    );

    if (!count || count <= 0) {
      throw new Error("Кількість має бути більшою за 0");
    }

    if (!date) {
      throw new Error("Оберіть дату заселення");
    }

    try {
      setIsResidentSaving(true);
      setResidentError("");

      const createdResident = await addSpeciesToAquarium({
        aquariumId,
        speciesId: species.id,
        quantity: count,
        settlementDate: date,
        ignoreWarnings,
      });

      setResidents((prev) => [
        ...prev,
        {
          id: createdResident?.id || Date.now(),
          name: species.name || "Новий житель",
          latin: species.latin || species.scientific_name || "",
          count: `≈ ${count} шт`,
          icon: species.icon || species.emoji || "🐟",
          speciesId: species.id,
          settlementDate: date,
        },
      ]);

      setIsAddResidentOpen(false);
    } catch (error) {
      setResidentError(error.message || "Не вдалося додати жителя");
      throw error;
    } finally {
      setIsResidentSaving(false);
    }
  };

  const handleAddEquipment = async (device) => {
    if (!aquariumId) {
      throw new Error("Не передано id акваріума");
    }

    try {
      setIsEquipmentSaving(true);
      setEquipmentError("");

      await addEquipment(aquariumId, device);

      setIsAddEquipmentOpen(false);

      await loadEquipment();
    } catch (error) {
      setEquipmentError(error.message || "Не вдалося додати обладнання");
      throw error;
    } finally {
      setIsEquipmentSaving(false);
    }
  };

  const handleServiceEquipment = async (device) => {
    const equipmentId = device?.id;

    if (!equipmentId) {
      throw new Error("Не передано id обладнання");
    }

    try {
      setIsServiceLoading(true);
      setEquipmentError("");

      await serviceEquipment(equipmentId);

      await loadEquipment();
    } catch (error) {
      setEquipmentError(error.message || "Не вдалося обслужити обладнання");
      throw error;
    } finally {
      setIsServiceLoading(false);
    }
  };

  const openAddResidentModal = () => {
    setResidentError("");
    setIsAddResidentOpen(true);
  };

  const closeAddResidentModal = () => {
    if (isResidentSaving) return;

    setResidentError("");
    setIsAddResidentOpen(false);
  };

  const openAddEquipmentModal = () => {
    setEquipmentError("");
    setIsAddEquipmentOpen(true);
  };

  const closeAddEquipmentModal = () => {
    if (isEquipmentSaving) return;

    setEquipmentError("");
    setIsAddEquipmentOpen(false);
  };

  return {
    aquariumId,

    activeTab,
    setActiveTab,

    isAddResidentOpen,
    setIsAddResidentOpen,
    openAddResidentModal,
    closeAddResidentModal,

    isAddEquipmentOpen,
    setIsAddEquipmentOpen,
    openAddEquipmentModal,
    closeAddEquipmentModal,

    residents,
    setResidents,

    equipment,
    setEquipment,

    isResidentSaving,
    residentError,
    setResidentError,

    isEquipmentLoading,
    isEquipmentSaving,
    isServiceLoading,

    equipmentError,
    setEquipmentError,

    loadEquipment,

    handleAddResident,
    handleAddEquipment,
    handleServiceEquipment,
  };
}

export default useAquariumDetails;