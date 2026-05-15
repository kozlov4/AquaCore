"use client";

import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAddEquipmentForm } from "../../hooks/useAddEquipmentForm";
import { EquipmentSelectField } from "./AddEquipment/EquipmentSelectField";
import { EquipmentTextField } from "./AddEquipment/EquipmentTextField";
import { EquipmentModalActions } from "./AddEquipment/EquipmentModalActions";

const categoryOptions = [
  "Обігрів / Охолодження",
  "Фільтрація",
  "Освітлення",
  "CO₂ система",
  "Аерація",
  "Інше",
];

const serviceOptions = [
  "Не потребує",
  "Раз на тиждень",
  "Раз на місяць",
  "Раз на 3 місяці",
  "Раз на 6 місяців",
];

export function AddEquipmentModal({ isOpen, onClose, onSave }) {
  const form = useAddEquipmentForm({ onClose, onSave });

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/55 backdrop-blur-[2px]"
            onClick={form.handleClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 28 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed left-1/2 top-1/2 z-50 w-[560px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[22px] bg-white shadow-[0_25px_80px_rgba(15,23,42,0.28)]"
          >
            <div className="flex items-center justify-between border-b border-gray-200 px-7 py-5">
              <h2 className="text-2xl font-bold text-gray-900">
                Встановлення обладнання
              </h2>

              <button
                type="button"
                onClick={form.handleClose}
                className="rounded-lg p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-800"
              >
                <X size={22} />
              </button>
            </div>

            <div className="space-y-6 px-7 py-6">
              <EquipmentSelectField
                label="Категорія"
                value={form.category}
                onChange={form.setCategory}
                options={categoryOptions}
              />

              <EquipmentTextField
                label="Модель пристрою"
                value={form.model}
                onChange={form.setModel}
                placeholder="Напр: Aquael Ultra Heater 100W"
              />

              <div className="grid grid-cols-2 gap-5">
                <EquipmentTextField
                  label="Встановлено"
                  type="date"
                  value={form.installedDate}
                  onChange={form.setInstalledDate}
                />

                <EquipmentSelectField
                  label="Обслуговування"
                  value={form.serviceInterval}
                  onChange={form.setServiceInterval}
                  options={serviceOptions}
                />
              </div>

              <p className="text-sm leading-6 text-gray-400">
                Система автоматично нагадуватиме про необхідність чистки або
                заміни деталей на основі вибраного інтервалу.
              </p>
            </div>

            <EquipmentModalActions
              onClose={form.handleClose}
              onSave={form.handleSave}
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}