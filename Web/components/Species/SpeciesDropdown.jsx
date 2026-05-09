"use client";

import { useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function SpeciesDropdown({ label, value, options, onChange }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm font-bold text-slate-700 transition hover:border-[#635BFF]/40 hover:bg-white"
      >
        <span>{value}</span>

        <ChevronDown
          size={17}
          className={`transition ${isOpen ? "rotate-180 text-[#635BFF]" : ""}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 12, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            className="absolute left-0 top-full z-30 w-full overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.16)]"
          >
            <div className="border-b border-slate-100 px-4 py-3 text-sm font-black text-[#635BFF]">
              {label}
            </div>

            {options.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
                className={`flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium transition ${
                  value === option
                    ? "bg-[#635BFF]/8 text-slate-950"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <span>{option}</span>
                {value === option && <Check size={16} className="text-[#635BFF]" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}