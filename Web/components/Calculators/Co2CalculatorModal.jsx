"use client";

import { useMemo, useState } from "react";
import {
  CalculatorModalLayout,
  CalculatorInput,
  ResultPanel,
  ResultValue,
} from "./calculatorModalUi";

function getCo2Status(co2) {
  if (co2 < 15) {
    return {
      label: "Low",
      description: "CO2 замало для активного росту рослин",
      className: "text-blue-700 bg-blue-50",
    };
  }

  if (co2 <= 30) {
    return {
      label: "Optimal",
      description: "Оптимальний рівень для більшості рослин",
      className: "text-emerald-700 bg-emerald-50",
    };
  }

  return {
    label: "High / Dangerous",
    description: "Зависокий рівень, може бути небезпечно для риб",
    className: "text-red-700 bg-red-50",
  };
}

export function Co2CalculatorModal({ onClose }) {
  const [ph, setPh] = useState(6.8);
  const [kh, setKh] = useState(5);

  const result = useMemo(() => {
    const co2 = 3 * kh * Math.pow(10, 7 - ph);
    const roundedCo2 = Math.round(co2);
    const status = getCo2Status(roundedCo2);

    return {
      co2: roundedCo2,
      status,
    };
  }, [ph, kh]);

  return (
    <CalculatorModalLayout
      icon="🧪"
      title="Концентрація CO2"
      subtitle="Розрахунок CO2 за pH та карбонатною жорсткістю"
      iconBg="bg-emerald-50"
      compact
      onClose={onClose}
    >
      <div className="grid grid-cols-1 gap-7 px-5 py-6 sm:px-6 lg:grid-cols-[1fr_210px]">
        <div className="space-y-5">
          <CalculatorInput label="Рівень кислотності pH" value={ph} onChange={setPh} unit="" step={0.1} />
          <CalculatorInput label="Карбонатна жорсткість kH" value={kh} onChange={setKh} unit="°dKH" step={0.5} />

          <p className="rounded-2xl bg-slate-50 px-4 py-3 text-xs leading-5 text-slate-500">
            Формула: CO2 = 3 × kH × 10^(7 - pH).
          </p>
        </div>

        <ResultPanel color="bg-cyan-600" title="Результат">
          <p className="text-sm text-white/80">Рівень CO2 у воді</p>
          <ResultValue value={result.co2} unit="мг/л" />

          <div className="mt-6 border-t border-white/20 pt-5">
            <p className="text-sm text-white/80">Статус</p>

            <span
              className={`mt-3 inline-flex rounded-md px-3 py-1 text-xs font-black ${result.status.className}`}
            >
              {result.status.label}
            </span>

            <p className="mt-3 text-xs leading-5 text-white/75">
              {result.status.description}
            </p>
          </div>
        </ResultPanel>
      </div>
    </CalculatorModalLayout>
  );
}