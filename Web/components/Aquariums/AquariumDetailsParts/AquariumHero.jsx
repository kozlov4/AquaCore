"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export function AquariumHero() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ scale: 1.005 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="relative h-[220px] overflow-hidden rounded-3xl shadow-[0_22px_70px_rgba(15,23,42,0.18)]"
    >
      <Image
        src="/images/fish-card.jpg"
        alt="aquarium"
        fill
        className="object-cover transition duration-700 hover:scale-105"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />

      <div className="absolute right-5 top-5 rounded-full bg-white/20 px-4 py-2 text-sm font-medium text-white backdrop-blur-md">
        <span className="mr-2 inline-block h-2 w-2 rounded-full bg-green-400 shadow-[0_0_12px_rgba(74,222,128,0.8)]" />
        Стан: Відмінний
      </div>

      <div className="absolute bottom-6 left-6 text-white">
        <h1 className="text-3xl font-bold">Головний Травник</h1>
        <p className="mt-2 text-sm text-white/80">
          Прісноводний • 60 л • Запущений: 12.10.2023
        </p>
      </div>
    </motion.section>
  );
}