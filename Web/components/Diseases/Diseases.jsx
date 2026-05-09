"use client";

import { motion } from "framer-motion";
import { Sidebar } from "../Profile/Sidebar";
import { DiseaseDetailsModal } from "./DiseaseDetailsModal";
import { useDiseases, diseaseFilters } from "../../hooks/useDiseases";
import { DiseasesHero } from "./DiseasesParts/DiseasesHero";
import { DiseasesCategories } from "./DiseasesParts/DiseasesCategories";
import { DiseasesFilters } from "./DiseasesParts/DiseasesFilters";
import { DiseasesGrid } from "./DiseasesParts/DiseasesGrid";
import { DiseasesEmptyState } from "./DiseasesParts/DiseasesEmptyState";

export function Diseases() {
  const diseases = useDiseases();

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#F8FAFF]">
      <div className="pointer-events-none absolute -left-32 top-10 h-96 w-96 rounded-full bg-[#5B4CF6]/10 blur-3xl" />
      <div className="pointer-events-none absolute right-[-120px] top-40 h-[420px] w-[420px] rounded-full bg-cyan-300/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-180px] left-1/3 h-[440px] w-[440px] rounded-full bg-pink-300/20 blur-3xl" />

      <Sidebar />

      <div className="relative z-10 ml-[88px]">
        <motion.main
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="px-12 py-10"
        >
          <div className="mx-auto max-w-[1180px]">
            <DiseasesHero
              searchValue={diseases.searchValue}
              setSearchValue={diseases.setSearchValue}
            />

            <DiseasesCategories />

            <DiseasesFilters
              filters={diseaseFilters}
              activeFilter={diseases.activeFilter}
              setActiveFilter={diseases.setActiveFilter}
            />

            {diseases.filteredDiseases.length > 0 ? (
              <DiseasesGrid
                diseases={diseases.filteredDiseases}
                searchValue={diseases.debouncedSearch}
                onOpen={diseases.setSelectedDisease}
              />
            ) : (
              <DiseasesEmptyState />
            )}
          </div>
        </motion.main>
      </div>

      <DiseaseDetailsModal
        disease={diseases.selectedDisease}
        onClose={() => diseases.setSelectedDisease(null)}
      />
    </div>
  );
}