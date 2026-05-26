"use client";

import { motion } from "framer-motion";
import { Sidebar } from "../Profile/Sidebar";
import { DiseaseDetailsModal } from "./DiseaseDetailsModal";
import { useDiseases } from "../../hooks/useDiseases";
import { DiseasesHero } from "./DiseasesParts/DiseasesHero";
import { DiseasesCategories } from "./DiseasesParts/DiseasesCategories";
import { DiseasesFilters } from "./DiseasesParts/DiseasesFilters";
import { DiseasesGrid } from "./DiseasesParts/DiseasesGrid";
import { DiseasesEmptyState } from "./DiseasesParts/DiseasesEmptyState";

export function Diseases() {
  const diseases = useDiseases();

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#F8FAFF]">
      <div className="pointer-events-none absolute -left-32 top-10 h-72 w-72 rounded-full bg-[#5B4CF6]/10 blur-3xl sm:h-96 sm:w-96" />
      <div className="pointer-events-none absolute right-[-160px] top-40 h-[300px] w-[300px] rounded-full bg-cyan-300/20 blur-3xl sm:h-[420px] sm:w-[420px]" />
      <div className="pointer-events-none absolute bottom-[-180px] left-1/3 h-[320px] w-[320px] rounded-full bg-pink-300/20 blur-3xl sm:h-[440px] sm:w-[440px]" />

      <Sidebar />

      <div className="relative z-10 lg:ml-[88px]">
        <motion.main
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="
            px-4 pb-28 pt-6
            sm:px-6 sm:pb-32 sm:pt-8
            lg:px-12 lg:py-10
          "
        >
          <div className="mx-auto max-w-[1180px]">
            <DiseasesHero
              searchValue={diseases.searchValue}
              setSearchValue={diseases.setSearchValue}
            />

            <DiseasesCategories
              activeTargetType={diseases.activeTargetType}
              setActiveTargetType={diseases.setActiveTargetType}
            />

            <DiseasesFilters
  filters={diseases.diseaseTags}
  activeFilter={diseases.activeFilter}
  setActiveFilter={diseases.setActiveFilter}
/>

{diseases.isTagsLoading && (
  <p className="mt-4 rounded-2xl border border-white/80 bg-white/80 px-5 py-3 text-sm font-bold text-slate-500 shadow-sm backdrop-blur">
    Завантаження фільтрів...
  </p>
)}

{diseases.tagsError && (
  <p className="mt-4 rounded-2xl border border-amber-100 bg-amber-50 px-5 py-3 text-sm font-bold text-amber-600 shadow-sm">
    {diseases.tagsError}
  </p>
)}

            {diseases.isLoading && (
              <p className="mt-8 rounded-2xl border border-white/80 bg-white/80 px-5 py-4 text-sm font-bold text-slate-500 shadow-sm backdrop-blur">
                Завантаження хвороб...
              </p>
            )}

            {diseases.isDetailLoading && (
              <p className="mt-4 rounded-2xl border border-[#5B4CF6]/10 bg-[#5B4CF6]/10 px-5 py-4 text-sm font-bold text-[#5B4CF6] shadow-sm backdrop-blur">
                Завантаження деталей хвороби...
              </p>
            )}

            {diseases.diseasesError && (
              <p className="mt-8 rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm font-bold text-red-500 shadow-sm">
                {diseases.diseasesError}
              </p>
            )}

            {!diseases.isLoading && diseases.filteredDiseases.length > 0 ? (
              <DiseasesGrid
                diseases={diseases.filteredDiseases}
                searchValue={diseases.debouncedSearch}
                onOpen={diseases.openDiseaseDetails}
              />
            ) : null}

            {!diseases.isLoading &&
              !diseases.diseasesError &&
              diseases.filteredDiseases.length === 0 && <DiseasesEmptyState />}
          </div>
        </motion.main>
      </div>

      <DiseaseDetailsModal
        disease={diseases.selectedDisease}
        onClose={diseases.closeDiseaseDetails}
      />
    </div>
  );
}