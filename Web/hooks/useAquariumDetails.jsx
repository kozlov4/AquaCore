"use client";

import { useState } from "react";

export function useAquariumDetails() {
  const [activeTab, setActiveTab] = useState("Огляд");
  const [isAddResidentOpen, setIsAddResidentOpen] = useState(false);
  const [isAddEquipmentOpen, setIsAddEquipmentOpen] = useState(false);

  const [residents, setResidents] = useState([
    {
      name: "Неон звичайний",
      latin: "Paracheirodon innesi",
      count: "30 шт",
      icon: "🐟",
    },
    {
      name: "Креветка Амано",
      latin: "Caridina multidentata",
      count: "15 шт",
      icon: "🦐",
    },
  ]);

  const [equipment, setEquipment] = useState([
    {
      icon: "⚙️",
      name: "Зовнішній фільтр Tetra EX 800 Plus",
      desc: "Потужність: 800 л/год • очищення раз на 3 міс.",
      date: "12 Жов 2025",
    },
    {
      icon: "💡",
      name: "Світильник Chihiros WRGB II",
      desc: "Графік: 8 год/день • інтенсивність 70%",
      date: "01 Січ 2026",
    },
  ]);

  const handleAddResident = (resident) => {
    setResidents((prev) => [
      ...prev,
      {
        name: resident.species.name,
        latin: resident.species.latin,
        count: `${resident.count} шт`,
        icon: resident.species.icon,
      },
    ]);
  };

  const handleAddEquipment = (device) => {
    setEquipment((prev) => [
      ...prev,
      {
        icon: "⚙️",
        name: device.model,
        desc: `${device.category} • обслуговування: ${device.serviceInterval}`,
        date: device.installedDate,
      },
    ]);
  };

  return {
    activeTab,
    setActiveTab,
    isAddResidentOpen,
    setIsAddResidentOpen,
    isAddEquipmentOpen,
    setIsAddEquipmentOpen,
    residents,
    equipment,
    handleAddResident,
    handleAddEquipment,
  };
}