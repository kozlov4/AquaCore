"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";

import {
  addEquipment,
  getEquipment,
  serviceEquipment,
} from "../services/equipmentApi";

export function useAquariumDetails() {
  const router = useRouter();
  const aquariumId = router.query.id;

  const [activeTab, setActiveTab] = useState("Населення");

  const [isAddResidentOpen, setIsAddResidentOpen] = useState(false);
  const [isAddEquipmentOpen, setIsAddEquipmentOpen] = useState(false);

  const [residents, setResidents] = useState([]);
  const [equipment, setEquipment] = useState([]);

  const [isEquipmentLoading, setIsEquipmentLoading] = useState(false);
  const [isEquipmentSaving, setIsEquipmentSaving] = useState(false);
  const [isServiceLoading, setIsServiceLoading] = useState(false);

  const [equipmentError, setEquipmentError] = useState("");

  const loadEquipment = useCallback(async () => {
    if (!aquariumId) return;

    try {
      setIsEquipmentLoading(true);
      setEquipmentError("");

      const data = await getEquipment(aquariumId);

      setEquipment(data);
    } catch (error) {
      setEquipment([]);
      setEquipmentError(error.message || "Не вдалося завантажити обладнання");
    } finally {
      setIsEquipmentLoading(false);
    }
  }, [aquariumId]);

  useEffect(() => {
    loadEquipment();
  }, [loadEquipment]);

  const handleAddResident = (resident) => {
    setResidents((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: resident?.species?.name || "Новий житель",
        latin: resident?.species?.latin || "",
        count: `${resident?.count || 1} шт`,
        icon: resident?.species?.icon || "🐟",
      },
    ]);
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

  return {
    aquariumId,

    activeTab,
    setActiveTab,

    isAddResidentOpen,
    setIsAddResidentOpen,

    isAddEquipmentOpen,
    setIsAddEquipmentOpen,

    residents,
    equipment,

    isEquipmentLoading,
    isEquipmentSaving,
    isServiceLoading,

    equipmentError,

    loadEquipment,

    handleAddResident,
    handleAddEquipment,
    handleServiceEquipment,
  };
}

export default useAquariumDetails;