"use client";

import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
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
    <div className="min-h-screen bg-[#f5f7fb]">
      <Sidebar />

      <main className="px-4 py-6 pb-24 md:ml-[210px] md:px-8 md:py-8">
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

        {aquarium.aquariumError && (
          <div className="mb-5 rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm font-semibold text-red-600">
            {aquarium.aquariumError}
          </div>
        )}

        <AquariumHero
          aquarium={aquarium.aquarium}
          isLoading={aquarium.isAquariumLoading}
        />

        <AquariumTabs
          tabs={tabs}
          activeTab={activeTab}
          setActiveTab={aquarium.setActiveTab}
        />

        <div className="mt-6">
          {activeTab === "Населення" && (
            <PopulationTab
              population={aquarium.population}
              residents={aquarium.residents}
              isLoading={aquarium.isPopulationLoading}
              error={aquarium.populationError}
              onReload={aquarium.reloadPopulation}
              onAddResident={() => aquarium.setIsAddResidentOpen(true)}
            />
          )}

          {activeTab === "Обладнання" && (
            <EquipmentTab
              equipment={aquarium.equipment}
              isLoading={aquarium.isEquipmentLoading}
              error={aquarium.equipmentError}
              onReload={aquarium.reloadEquipment}
              onAddEquipment={() => aquarium.setIsAddEquipmentOpen(true)}
              onServiceEquipment={aquarium.handleServiceEquipment}
              servicingEquipmentId={aquarium.servicingEquipmentId}
            />
          )}
        </div>

        <AddResidentModal
          isOpen={aquarium.isAddResidentOpen}
          aquariumId={aquarium.aquariumId}
          onClose={() => aquarium.setIsAddResidentOpen(false)}
          onSave={aquarium.handleAddResident}
        />

        <AddEquipmentModal
          isOpen={aquarium.isAddEquipmentOpen}
          onClose={() => aquarium.setIsAddEquipmentOpen(false)}
          onSave={aquarium.handleAddEquipment}
        />
      </main>
    </div>
  );
}

export default AquariumDetails;