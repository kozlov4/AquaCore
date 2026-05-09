"use client";

import { motion } from "framer-motion";

const inputClass =
  "w-full mb-[5%] px-4 py-3 rounded-[14px] border border-gray-200 bg-white/80 text-black outline-none shadow-sm transition-all duration-300 placeholder:text-gray-400 hover:border-[#D688B7]/70 hover:shadow-md focus:border-[#D688B7] focus:ring-4 focus:ring-[#D688B7]/20 focus:bg-white";

export function AuthInput({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  children,
}) {
  return (
    <div>
      <div className="flex justify-between items-center">
        <label className="text-black font-medium text-lg">{label}</label>
        {children}
      </div>

      <motion.input
        whileFocus={{ scale: 1.02 }}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={inputClass}
      />
    </div>
  );
}