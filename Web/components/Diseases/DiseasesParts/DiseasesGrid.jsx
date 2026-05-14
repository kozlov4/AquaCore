"use client";

import { motion } from "framer-motion";
import { DiseaseCard } from "../DiseaseCard";

export function DiseasesGrid({ diseases, searchValue, onOpen }) {
  return (
    <motion.section
      layout
      className="
        mt-8 grid grid-cols-1 gap-5
        sm:grid-cols-2 sm:gap-6
        xl:mt-11 xl:grid-cols-4 xl:gap-7
      "
    >
      {diseases.map((disease, index) => (
        <motion.div
          key={disease.id}
          layout
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            delay: index * 0.04,
            duration: 0.35,
            ease: "easeOut",
          }}
        >
          <DiseaseCard
            disease={disease}
            searchValue={searchValue}
            onOpen={onOpen}
          />
        </motion.div>
      ))}
    </motion.section>
  );
}