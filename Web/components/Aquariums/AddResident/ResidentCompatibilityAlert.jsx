"use client";

import { AlertTriangle, CheckCircle } from "lucide-react";

export function ResidentCompatibilityAlert({
  compatibility,
  confirmedRisk,
  setConfirmedRisk,
}) {
  const isCritical = compatibility.type === "critical";

  return (
    <div
      className={`rounded-2xl border p-5 ${
        isCritical
          ? "border-red-200 bg-red-50 text-red-700"
          : "border-green-200 bg-green-50 text-green-700"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="mt-1">
          {isCritical ? <AlertTriangle size={18} /> : <CheckCircle size={18} />}
        </div>

        <div>
          <p className="text-lg font-bold">{compatibility.title}</p>
          <p className="mt-2 text-sm leading-6">{compatibility.text}</p>
        </div>
      </div>

      {compatibility.needsConfirm && (
        <label className="mt-5 flex cursor-pointer items-start gap-3 border-t border-current/20 pt-4 text-sm">
          <input
            type="checkbox"
            checked={confirmedRisk}
            onChange={(e) => setConfirmedRisk(e.target.checked)}
            className="mt-1 h-4 w-4 accent-[#5B4CF6]"
          />
          <span>{compatibility.checkboxText}</span>
        </label>
      )}
    </div>
  );
}