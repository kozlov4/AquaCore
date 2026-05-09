"use client";

import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAddResidentForm } from "../../hooks/useAddResidentForm";
import { ResidentSearchStep } from "./AddResident/ResidentSearchStep";
import { ResidentFormStep } from "./AddResident/ResidentFormStep";

export function AddResidentModal({ isOpen, onClose, onSave }) {
  const form = useAddResidentForm({ onClose, onSave });

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
            className="fixed left-1/2 top-1/2 z-50 w-[640px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[22px] bg-white shadow-[0_25px_80px_rgba(15,23,42,0.28)]"
          >
            <div className="flex items-center justify-between border-b border-gray-200 px-7 py-5">
              <h2 className="text-2xl font-bold text-gray-900">
                Додати жителів
              </h2>

              <button
                type="button"
                onClick={form.handleClose}
                className="rounded-lg p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-800"
              >
                <X size={22} />
              </button>
            </div>

            {form.step === "search" && (
              <ResidentSearchStep
                query={form.query}
                setQuery={form.setQuery}
                filteredSpecies={form.filteredSpecies}
                onSelect={form.handleSelectSpecies}
              />
            )}

            {form.step === "form" && form.selectedSpecies && (
              <ResidentFormStep
                selectedSpecies={form.selectedSpecies}
                compatibility={form.compatibility}
                confirmedRisk={form.confirmedRisk}
                setConfirmedRisk={form.setConfirmedRisk}
                count={form.count}
                setCount={form.setCount}
                date={form.date}
                setDate={form.setDate}
                onBackToSearch={form.handleBackToSearch}
                onClose={form.handleClose}
                onSave={form.handleSave}
              />
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}