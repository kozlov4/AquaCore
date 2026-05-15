"use client";

import { useRef, useState } from "react";

export function useAddAquariumForm({ onClose, onSave }) {
  const fileInputRef = useRef(null);

  const [cover, setCover] = useState("");
  const [name, setName] = useState("");
  const [volume, setVolume] = useState("100");
  const [startDate, setStartDate] = useState("");
  const [waterType, setWaterType] = useState("Прісноводний");

  const resetForm = () => {
    setCover("");
    setName("");
    setVolume("100");
    setStartDate("");
    setWaterType("Прісноводний");
  };

  const handleClose = () => {
    resetForm();
    onClose?.();
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setCover(URL.createObjectURL(file));
  };

  const handleSave = () => {
    if (!name.trim() || !volume || !startDate) {
      alert("Заповніть обовʼязкові поля");
      return;
    }

    onSave?.({
      name,
      volume: `${volume} л`,
      environment: waterType,
      startDate,
      image: cover || "/images/fish-card.jpg",
    });

    resetForm();
    onClose?.();
  };

  return {
    fileInputRef,
    cover,
    name,
    volume,
    startDate,
    waterType,
    setName,
    setVolume,
    setStartDate,
    setWaterType,
    handleClose,
    handleFileChange,
    handleSave,
  };
}