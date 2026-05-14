"use client";

import { motion } from "framer-motion";

const inputClass = `
  mt-2 mb-5 w-full
  rounded-[14px] border border-gray-200
  bg-white/90 px-4 py-3.5
  text-base text-black outline-none
  shadow-sm transition-all duration-300
  placeholder:text-gray-400
  hover:border-[#D688B7]/70 hover:shadow-md
  focus:border-[#D688B7] focus:bg-white
  focus:ring-4 focus:ring-[#D688B7]/20
  sm:py-4
  lg:mb-[5%] lg:py-3
`;

export function AuthInput({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  children,
}) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between gap-3">
        <label className="text-base font-medium text-black sm:text-lg">
          {label}
        </label>

        {children}
      </div>

      <motion.input
        whileFocus={{ scale: 1.01 }}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={inputClass}
      />
    </div>
  );
}