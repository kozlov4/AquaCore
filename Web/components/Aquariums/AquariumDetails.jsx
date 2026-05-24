"use client";

import { ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";

import { Sidebar } from "../Profile/Sidebar";
import { AddResidentModal } from "./AddResidentModal";
import { AddEquipmentModal } from "./AddEquipmentModal";
import { useAquariumDetails } from "../../hooks/useAquariumDetails";

import { AquariumHero } from "./AquariumDetailsParts/AquariumHero";
import { AquariumTabs } from "./AquariumDetailsParts/AquariumTabs";
import { PopulationTab } from "./AquariumDetailsParts/PopulationTab";
import { EquipmentTab } from "./AquariumDetailsParts/EquipmentTab";

const tabs = ["Населення", "Обладнання"];

export function AquariumDetails() {
  const router = useRouter();
  const aquarium = useAquariumDetails();

  const activeTab = tabs.includes(aquarium.activeTab)
    ? aquarium.activeTab
    : "Населення";

  return (
    <main className="min-h-screen bg-[#f6f7fb] text-[#111827]">
      <Sidebar />

      <section className="min-h-screen px-4 py-6 md:ml-[280px] md:px-8 lg:px-10">
        <motion.button
          type="button"
          onClick={() => router.back()}
          whileHover={{ x: -4 }}
          whileTap={{ scale: 0.96 }}
          className="mb-5 flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-black"
        >
          <ArrowLeft size={18} />
          Назад до акваріумів
        </motion.button>

        <AquariumHero />

        <div className="mt-6 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-[0_12px_35px_rgba(15,23,42,0.05)]">
          <AquariumTabs
            tabs={tabs}
            activeTab={activeTab}
            setActiveTab={aquarium.setActiveTab}
          />

          <div className="p-5 md:p-6">
            <AnimatePresence mode="wait">
              {activeTab === "Населення" && (
                <motion.div
                  key="population"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.25 }}
                >
                  <PopulationTab
                    residents={aquarium.residents}
                    onAddResident={() => aquarium.setIsAddResidentOpen(true)}
                  />
                </motion.div>
              )}

              {activeTab === "Обладнання" && (
                <motion.div
                  key="equipment"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.25 }}
                >
                  <EquipmentTab
                    equipment={aquarium.equipment}
                    onAddEquipment={() => aquarium.setIsAddEquipmentOpen(true)}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      <AddResidentModal
        isOpen={aquarium.isAddResidentOpen}
        onClose={() => aquarium.setIsAddResidentOpen(false)}
        onSave={aquarium.handleAddResident}
      />

      <AddEquipmentModal
        isOpen={aquarium.isAddEquipmentOpen}
        onClose={() => aquarium.setIsAddEquipmentOpen(false)}
        onSave={aquarium.handleAddEquipment}
      />
    </main>
  );
}

export default AquariumDetails;