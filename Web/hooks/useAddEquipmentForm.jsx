"use client";

import { useState } from "react";

export function useAddEquipmentForm({ onClose, onSave }) {
  const [category, setCategory] = useState("Обігрів / Охолодження");
  const [model, setModel] = useState("");
  const [installedDate, setInstalledDate] = useState("2026-04-23");
  const [serviceInterval, setServiceInterval] = useState("Не потребує");

  const resetForm = () => {
    setCategory("Обігрів / Охолодження");
    setModel("");
    setInstalledDate("2026-04-23");
    setServiceInterval("Не потребує");
  };

  const handleClose = () => {
    resetForm();
    onClose?.();
  };

  const handleSave = () => {
    if (!model.trim()) {
      alert("Введіть модель пристрою");
      return;
    }

    onSave?.({
      category,
      model,
      installedDate,
      serviceInterval,
    });

    resetForm();
    onClose?.();
  };

  return {
    category,
    model,
    installedDate,
    serviceInterval,
    setCategory,
    setModel,
    setInstalledDate,
    setServiceInterval,
    handleClose,
    handleSave,
  };
}