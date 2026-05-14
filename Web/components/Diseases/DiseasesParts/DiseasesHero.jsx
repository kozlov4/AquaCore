"use client";

import { Search } from "lucide-react";
import { motion } from "framer-motion";

export function DiseasesHero({ searchValue, setSearchValue }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.45 }}
      className="
        relative overflow-hidden rounded-[28px]
        border border-white/80 bg-white/70
        px-4 py-8 text-center
        shadow-[0_24px_70px_rgba(15,23,42,0.08)]
        backdrop-blur-2xl
        sm:rounded-[34px] sm:px-8 sm:py-10
        lg:rounded-[36px]
      "
    >
      <div className="absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-[#5B4CF6]/40 to-transparent" />

      <p
        className="
          mb-3 inline-flex rounded-full border border-[#5B4CF6]/15
          bg-[#5B4CF6]/10 px-3 py-2
          text-xs font-black text-[#5B4CF6]
          sm:px-4 sm:text-sm
        "
      >
        Акваріумна база знань
      </p>

      <h1
        className="
          text-3xl font-black tracking-tight text-slate-950
          sm:text-4xl
          lg:text-5xl
        "
      >
        Енциклопедія хвороб
      </h1>

      <p
        className="
          mx-auto mt-4 max-w-[560px]
          text-sm leading-6 text-slate-500
        "
      >
        Знайди хворобу за симптомом, назвою або ознаками поведінки риби.
      </p>

      <motion.div
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18, duration: 0.45 }}
        className="
          mx-auto mt-7 flex max-w-[590px] items-center gap-3
          rounded-2xl border border-slate-200/80
          bg-white/90 px-3 py-3
          shadow-[0_20px_50px_rgba(15,23,42,0.08)]
          backdrop-blur-xl transition-all duration-300
          focus-within:border-[#5B4CF6]/60
          focus-within:ring-4 focus-within:ring-[#5B4CF6]/10
          hover:shadow-[0_24px_65px_rgba(91,76,246,0.12)]
          sm:mt-8 sm:rounded-3xl sm:px-5 sm:py-4
        "
      >
        <div
          className="
            flex h-9 w-9 shrink-0 items-center justify-center
            rounded-2xl bg-[#5B4CF6]/10 text-[#5B4CF6]
            sm:h-10 sm:w-10
          "
        >
          <Search size={19} />
        </div>

        <input
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Введіть симптом або назву хвороби..."
          className="
            w-full bg-transparent text-sm font-medium
            text-slate-800 outline-none placeholder:text-slate-400
          "
        />
      </motion.div>
    </motion.div>
  );
}