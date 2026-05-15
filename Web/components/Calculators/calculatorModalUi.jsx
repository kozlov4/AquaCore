"use client";

import { X } from "lucide-react";
import { motion } from "framer-motion";

export function CalculatorModalLayout({
  icon,
  title,
  subtitle,
  iconBg = "bg-slate-100",
  children,
  compact = false,
  onClose,
}) {
  return (
    <>
      <motion.div
        className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 16 }}
        transition={{ duration: 0.24, ease: "easeOut" }}
        className={`
          fixed left-1/2 top-1/2 z-50
          max-h-[92vh] w-[calc(100%-28px)]
          -translate-x-1/2 -translate-y-1/2
          overflow-hidden rounded-[24px] bg-white
          shadow-[0_28px_85px_rgba(0,0,0,0.34)]
          ${compact ? "max-w-[540px]" : "max-w-[680px]"}
        `}
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 bg-slate-50/70 px-5 py-5 sm:px-6">
          <div className="flex min-w-0 items-center gap-4">
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-2xl ${iconBg}`}
            >
              {icon}
            </div>

            <div className="min-w-0">
              <h2 className="text-lg font-black text-slate-950 sm:text-xl">
                {title}
              </h2>
              <p className="mt-1 text-sm leading-5 text-slate-500">
                {subtitle}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-full p-2 text-slate-400 transition hover:bg-white hover:text-slate-900"
          >
            <X size={22} />
          </button>
        </div>

        <div className="max-h-[calc(92vh-92px)] overflow-y-auto">
          {children}
        </div>
      </motion.div>
    </>
  );
}

export function CalculatorInput({ label, value, onChange, unit = "см", min = 0, step = 1 }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-black text-slate-700">
        {label}
      </label>

      <div className="flex items-center gap-3">
        <input
          type="number"
          min={min}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="
            w-full rounded-xl border border-slate-300
            px-4 py-3 text-base font-black text-slate-950
            outline-none transition
            focus:border-[#635BFF] focus:ring-4 focus:ring-[#635BFF]/10
          "
        />

        {unit && (
          <span className="w-[44px] text-sm font-black text-slate-500">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}

export function CalculatorSelect({ label, value, onChange, options }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-black text-slate-700">
        {label}
      </label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="
          w-full rounded-xl border border-slate-300
          bg-white px-4 py-3 text-base font-bold text-slate-950
          outline-none transition
          focus:border-[#635BFF] focus:ring-4 focus:ring-[#635BFF]/10
        "
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function ResultPanel({ color, title, children, dark = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.12 }}
      className={`relative overflow-hidden rounded-3xl ${color} p-6 shadow-[0_22px_55px_rgba(15,23,42,0.18)] ${
        dark ? "text-yellow-950" : "text-white"
      }`}
    >
      <div className="absolute -bottom-10 -right-8 h-32 w-32 rotate-45 rounded-3xl bg-white/10" />

      <p
        className={`text-xs font-black uppercase tracking-[0.14em] ${
          dark ? "text-yellow-950/70" : "text-white/70"
        }`}
      >
        {title}
      </p>

      <div className="relative z-10 mt-6">{children}</div>
    </motion.div>
  );
}

export function ResultValue({ value, unit, small = false, dark = false }) {
  return (
    <div className="mt-2 flex flex-wrap items-end gap-2">
      <span
        className={`${small ? "text-2xl" : "text-4xl sm:text-5xl"} font-black leading-none ${
          dark ? "text-yellow-950" : "text-white"
        }`}
      >
        {value}
      </span>

      <span
        className={`mb-1 font-bold ${small ? "text-base" : "text-lg"} ${
          dark ? "text-yellow-950/80" : "text-white/80"
        }`}
      >
        {unit}
      </span>
    </div>
  );
}