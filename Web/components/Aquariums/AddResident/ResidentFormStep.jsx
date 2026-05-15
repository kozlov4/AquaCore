"use client";

import { ResidentSelectedSpecies } from "./ResidentSelectedSpecies";
import { ResidentCompatibilityAlert } from "./ResidentCompatibilityAlert";
import { ResidentTextField } from "./ResidentTextField";
import { ResidentModalActions } from "./ResidentModalActions";

export function ResidentFormStep({
  selectedSpecies,
  compatibility,
  confirmedRisk,
  setConfirmedRisk,
  count,
  setCount,
  date,
  setDate,
  onBackToSearch,
  onClose,
  onSave,
}) {
  const isCritical = selectedSpecies.compatibility === "critical";

  return (
    <>
      <div className="space-y-6 px-7 py-6">
        <ResidentSelectedSpecies
          selectedSpecies={selectedSpecies}
          onChange={onBackToSearch}
        />

        {compatibility && (
          <ResidentCompatibilityAlert
            compatibility={compatibility}
            confirmedRisk={confirmedRisk}
            setConfirmedRisk={setConfirmedRisk}
          />
        )}

        <div className="grid grid-cols-2 gap-5">
          <ResidentTextField
            label="Кількість &#40;шт.&#41;"
            type="number"
            value={count}
            onChange={setCount}
          />

          <ResidentTextField
            label="Дата заселення"
            type="date"
            value={date}
            onChange={setDate}
          />
        </div>
      </div>

      <ResidentModalActions
        onClose={onClose}
        onSave={onSave}
        isCritical={isCritical}
      />
    </>
  );
}