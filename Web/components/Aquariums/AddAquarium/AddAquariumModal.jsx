"use client";

import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAddAquariumForm } from "../../hooks/useAddAquariumForm";
import { AquariumCoverUpload } from "./AddAquarium/AquariumCoverUpload";
import { AquariumTextField } from "./AddAquarium/AquariumTextField";
import { AquariumWaterTypeSelector } from "./AddAquarium/AquariumWaterTypeSelector";
import { AquariumModalActions } from "./AddAquarium/AquariumModalActions";

export function AddAquariumModal({ isOpen, onClose, onSave }) {
  const form = useAddAquariumForm({ onClose, onSave });

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/55 backdrop-blur-[3px]"
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
            className="fixed left-1/2 top-1/2 z-50 w-[560px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[24px] bg-white shadow-[0_30px_90px_rgba(15,23,42,0.32)]"
          >
            <div className="flex items-center justify-between border-b border-gray-200 px-7 py-5">
              <h2 className="text-2xl font-bold text-gray-900">
                Нова екосистема
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
              <AquariumCoverUpload
                cover={form.cover}
                fileInputRef={form.fileInputRef}
                onFileChange={form.handleFileChange}
              />

              <AquariumTextField
                label="Назва акваріума"
                value={form.name}
                onChange={form.setName}
                placeholder="Наприклад: Головний Травник"
                required
              />

              <div className="grid grid-cols-2 gap-5">
                <AquariumTextField
                  label="Обʼєм &#40;Літри&#41;"
                  type="number"
                  value={form.volume}
                  onChange={form.setVolume}
                  suffix="л"
                  required
                />

                <AquariumTextField
                  label="Дата запуску"
                  type="date"
                  value={form.startDate}
                  onChange={form.setStartDate}
                  required
                />
              </div>

              <AquariumWaterTypeSelector
                waterType={form.waterType}
                setWaterType={form.setWaterType}
              />
            </div>

            <AquariumModalActions
              onClose={form.handleClose}
              onSave={form.handleSave}
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}