"use client";

import { useMemo, useState } from "react";
import {
  CalculatorModalLayout,
  CalculatorInput,
  CalculatorSelect,
  ResultPanel,
  ResultValue,
} from "./calculatorModalUi";

const ecosystemOptions = [
  {
    label: "Тільки риби / Невибагливі рослини",
    value: "low",
    multiplier: 20,
  },
  {
    label: "Середній травник",
    value: "medium",
    multiplier: 40,
  },
  {
    label: "Форсований травник з CO2",
    value: "high",
    multiplier: 60,
  },
];

export function LightCalculatorModal({ onClose }) {
  const [volume, setVolume] = useState(60);
  const [ecosystemType, setEcosystemType] = useState("medium");

  const result = useMemo(() => {
    const option =
      ecosystemOptions.find((item) => item.value === ecosystemType) ||
      ecosystemOptions[1];

    const lumens = volume * option.multiplier;
    const watts = lumens / 100;

    return {
      lumens: Math.round(lumens),
      watts: watts.toFixed(1),
      multiplier: option.multiplier,
      label: option.label,
    };
  }, [volume, ecosystemType]);

  return (
    <CalculatorModalLayout
      icon="💡"
      title="Потужність освітлення"
      subtitle="Розрахунок світлового потоку та LED-потужності"
      iconBg="bg-yellow-50"
      onClose={onClose}
    >
      <div className="grid grid-cols-1 gap-7 px-5 py-6 sm:px-7 lg:grid-cols-[1fr_250px]">
        <div className="space-y-5">
          <CalculatorInput label="Обʼєм акваріума" value={volume} onChange={setVolume} unit="л" />

          <CalculatorSelect
            label="Тип екосистеми"
            value={ecosystemType}
            onChange={setEcosystemType}
            options={ecosystemOptions}
          />

          <p className="rounded-2xl bg-slate-50 px-4 py-3 text-xs leading-5 text-slate-500">
            Для вибраного типу використовується {result.multiplier} лм/л. LED Watts = Lumens / 100.
          </p>
        </div>

        <ResultPanel color="bg-yellow-400" dark title="Рекомендовано">
          <p className="text-sm text-yellow-900/80">Світловий потік</p>
          <ResultValue value={result.lumens} unit="лм" dark />

          <p className="mt-2 text-xs leading-5 text-yellow-900/70">
            {result.label}
          </p>

          <div className="mt-6 border-t border-yellow-900/10 pt-5">
            <p className="text-sm text-yellow-900/80">LED-потужність</p>
            <ResultValue small value={`~${result.watts}`} unit="Вт" dark />
          </div>
        </ResultPanel>
      </div>
    </CalculatorModalLayout>
  );
}