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
import { OverviewTab } from "./AquariumDetailsParts/OverviewTab";
import { WaterParamsTab } from "./AquariumDetailsParts/WaterParamsTab";
import { PopulationTab } from "./AquariumDetailsParts/PopulationTab";
import { EquipmentTab } from "./AquariumDetailsParts/EquipmentTab";

const tabs = ["Огляд", "Параметри води", "Населення", "Обладнання"];

export function AquariumDetails() {
  const router = useRouter();
  const aquarium = useAquariumDetails();

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#FAFCFF] to-[#F4F7FF]">
      <Sidebar />

      <main className="ml-[88px] px-12 py-8">
        <motion.div
          initial={{ opacity: 0, y: 34 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="mx-auto max-w-[980px]"
        >
          <motion.button
            onClick={() => router.back()}
            whileHover={{ x: -4 }}
            whileTap={{ scale: 0.96 }}
            className="mb-5 flex items-center text-gray-500 transition hover:text-black"
          >
            <ArrowLeft size={22} />
          </motion.button>

          <AquariumHero />

          <AquariumTabs
            tabs={tabs}
            activeTab={aquarium.activeTab}
            setActiveTab={aquarium.setActiveTab}
          />

          <div className="mt-8">
            <AnimatePresence mode="wait">
              {aquarium.activeTab === "Огляд" && <OverviewTab key="overview" />}

              {aquarium.activeTab === "Параметри води" && (
                <WaterParamsTab key="water" />
              )}

              {aquarium.activeTab === "Населення" && (
                <PopulationTab
                  key="population"
                  residents={aquarium.residents}
                  onAddResident={() => aquarium.setIsAddResidentOpen(true)}
                />
              )}

              {aquarium.activeTab === "Обладнання" && (
                <EquipmentTab
                  key="equipment"
                  equipment={aquarium.equipment}
                  onAddEquipment={() => aquarium.setIsAddEquipmentOpen(true)}
                />
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </main>

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
    </div>
  );
}