"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export function SpeciesFilterDropdown({
  title,
  value,
  onChange,
  options = [],
  accent = true,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedOption =
    options.find((option) => option.value === value) || options[0];

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (option) => {
    onChange(option.value);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="
          inline-flex h-[44px] min-w-[190px] items-center justify-between gap-4
          rounded-[10px] border border-[#e3e9f2] bg-white px-[16px]
          text-[14px] font-extrabold text-[#344054]
          shadow-[0_8px_22px_rgba(15,23,42,0.03)]
          transition-all duration-200
          hover:border-[#cfd7e6] hover:bg-[#fbfcff]
          focus:border-[#635bff] focus:outline-none focus:ring-4 focus:ring-[#635bff]/10
        "
      >
        <span className="flex min-w-0 items-center gap-2">
          {selectedOption?.icon && (
            <span className="text-[15px] leading-none">
              {selectedOption.icon}
            </span>
          )}

          <span className="truncate">{selectedOption?.label || title}</span>
        </span>

        <ChevronDown
          size={17}
          className={`shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-[#635bff]" : "text-[#98a2b3]"
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{
              opacity: 0,
              y: 8,
              scale: 0.97,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 8,
              scale: 0.97,
            }}
            transition={{
              duration: 0.16,
              ease: "easeOut",
            }}
            className="
              absolute left-0 top-[52px] z-50 w-[230px]
              overflow-hidden rounded-[14px] border border-[#e9edf5]
              bg-white shadow-[0_22px_55px_rgba(15,23,42,0.16)]
            "
          >
            <div className="flex items-center justify-between border-b border-[#eef0f4] px-4 py-3">
              <span
                className={`text-[12px] font-extrabold ${
                  accent ? "text-[#635bff]" : "text-[#344054]"
                }`}
              >
                {title}
              </span>

              <ChevronDown
                size={14}
                className={`rotate-180 ${
                  accent ? "text-[#635bff]" : "text-[#98a2b3]"
                }`}
              />
            </div>

            <div className="py-1">
              {options.map((option) => {
                const isActive = option.value === value;
                const isDanger = option.danger;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSelect(option)}
                    className={`
                      flex h-[44px] w-full items-center justify-between px-4
                      text-left text-[14px] font-semibold transition-all duration-150
                      ${
                        isActive
                          ? "bg-[#f4f6ff] text-[#344054]"
                          : "bg-white text-[#475467] hover:bg-[#f8fafc]"
                      }
                      ${isDanger ? "text-red-500" : ""}
                    `}
                  >
                    <span className="flex items-center gap-2">
                      {option.icon && (
                        <span className="text-[15px] leading-none">
                          {option.icon}
                        </span>
                      )}

                      <span>{option.label}</span>
                    </span>

                    {isActive && (
                      <Check
                        size={16}
                        strokeWidth={2.3}
                        className={isDanger ? "text-red-500" : "text-[#344054]"}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default SpeciesFilterDropdown;