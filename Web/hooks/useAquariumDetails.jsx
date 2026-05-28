"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";

import {
  getAquariumById,
  getAquariumPopulation,
  addInhabitantToAquarium,
} from "../services/aquariumsApi";

import {
  getAquariumEquipment,
  addEquipmentToAquarium,
  serviceEquipment,
} from "../services/equipmentApi";

export function useAquariumDetails() {
  const router = useRouter();

  const aquariumId = useMemo(() => {
    const id = router.query?.id;

    if (Array.isArray(id)) return id[0];

    return id || "";
  }, [router.query?.id]);

  const [aquarium, setAquarium] = useState(null);
  const [isAquariumLoading, setIsAquariumLoading] = useState(false);
  const [aquariumError, setAquariumError] = useState("");

  const [activeTab, setActiveTab] = useState("Населення");

  const [isAddResidentOpen, setIsAddResidentOpen] = useState(false);
  const [isAddEquipmentOpen, setIsAddEquipmentOpen] = useState(false);

  const [population, setPopulation] = useState({
    totalSpecies: 0,
    totalIndividuals: 0,
    compatibilityStatus: "unknown",
    compatibilityText: "Населення ще не завантажено.",
    aggressiveResidents: [],
    inhabitants: [],
  });

  const [isPopulationLoading, setIsPopulationLoading] = useState(false);
  const [populationError, setPopulationError] = useState("");

  const [equipment, setEquipment] = useState([]);
  const [isEquipmentLoading, setIsEquipmentLoading] = useState(false);
  const [equipmentError, setEquipmentError] = useState("");

  const [servicingEquipmentId, setServicingEquipmentId] = useState(null);

  const loadAquarium = useCallback(async () => {
    if (!aquariumId) return;

    try {
      setIsAquariumLoading(true);
      setAquariumError("");

      const data = await getAquariumById(aquariumId);

      setAquarium(data);
    } catch (error) {
      setAquariumError(error.message || "Не вдалося завантажити акваріум");
    } finally {
      setIsAquariumLoading(false);
    }
  }, [aquariumId]);

  const loadPopulation = useCallback(async () => {
    if (!aquariumId) return;

    try {
      setIsPopulationLoading(true);
      setPopulationError("");

      const data = await getAquariumPopulation(aquariumId);

      setPopulation(data);
    } catch (error) {
      setPopulationError(error.message || "Не вдалося завантажити населення");
    } finally {
      setIsPopulationLoading(false);
    }
  }, [aquariumId]);

  const loadEquipment = useCallback(async () => {
    if (!aquariumId) return;

    try {
      setIsEquipmentLoading(true);
      setEquipmentError("");

      const data = await getAquariumEquipment(aquariumId);

      setEquipment(data);
    } catch (error) {
      setEquipmentError(error.message || "Не вдалося завантажити обладнання");
    } finally {
      setIsEquipmentLoading(false);
    }
  }, [aquariumId]);

  useEffect(() => {
    loadAquarium();
    loadPopulation();
    loadEquipment();
  }, [loadAquarium, loadPopulation, loadEquipment]);

  const handleAddResident = async (resident) => {
    await addInhabitantToAquarium({
      aquariumId,
      speciesId: resident.speciesId,
      quantity: resident.quantity,
      settlementDate: resident.settlementDate,
    });

    await loadPopulation();
  };

  const handleAddEquipment = async (device) => {
    await addEquipmentToAquarium(aquariumId, {
      category: device.category,
      name: device.name,
      installation_date: device.installationDate,
      specifications: device.specifications,
      maintenance_interval_days: device.maintenanceIntervalDays,
    });

    await loadEquipment();
  };

  const handleServiceEquipment = async (equipmentId) => {
    try {
      setServicingEquipmentId(equipmentId);
      setEquipmentError("");

      await serviceEquipment(equipmentId);
      await loadEquipment();
    } catch (error) {
      setEquipmentError(error.message || "Не вдалося обслужити обладнання");
    } finally {
      setServicingEquipmentId(null);
    }
  };

  return {
    aquarium,
    aquariumId,

    isAquariumLoading,
    aquariumError,
    reloadAquarium: loadAquarium,

    activeTab,
    setActiveTab,

    isAddResidentOpen,
    setIsAddResidentOpen,

    isAddEquipmentOpen,
    setIsAddEquipmentOpen,

    population,
    residents: population.inhabitants,

    isPopulationLoading,
    populationError,
    reloadPopulation: loadPopulation,

    equipment,
    isEquipmentLoading,
    equipmentError,
    reloadEquipment: loadEquipment,

    servicingEquipmentId,

    handleAddResident,
    handleAddEquipment,
    handleServiceEquipment,
  };
}