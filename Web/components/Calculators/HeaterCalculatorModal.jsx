"use client";

import { useMemo, useState } from "react";
import {
  CalculatorModalLayout,
  CalculatorInput,
  ResultPanel,
  ResultValue,
} from "./calculatorModalUi";

const standardHeaters = [50, 100, 150, 200, 300];

function roundToStandardHeater(value) {
  const found = standardHeaters.find((heater) => heater >= value);
  return found || 300;
}

export function HeaterCalculatorModal({ onClose }) {
  const [volume, setVolume] = useState(100);
  const [roomTemp, setRoomTemp] = useState(20);
  const [targetTemp, setTargetTemp] = useState(25);

  const result = useMemo(() => {
    const delta = Math.max(targetTemp - roomTemp, 0);
    const rawPower = volume * (delta > 5 ? 1.5 : 1);
    const recommendedPower = roundToStandardHeater(rawPower);

    return {
      delta,
      rawPower: Math.round(rawPower),
      recommendedPower,
    };
  }, [volume, roomTemp, targetTemp]);

  return (
    <CalculatorModalLayout
      icon="🌡️"
      title="Потужність обігрівача"
      subtitle="Рекомендована потужність за обʼємом і різницею температур"
      iconBg="bg-rose-50"
      onClose={onClose}
    >
      <div className="grid grid-cols-1 gap-7 px-5 py-6 sm:px-7 lg:grid-cols-[1fr_220px]">
        <div className="space-y-5">
          <CalculatorInput label="Обʼєм акваріума" value={volume} onChange={setVolume} unit="л" />
          <CalculatorInput label="Температура в кімнаті" value={roomTemp} onChange={setRoomTemp} unit="°C" />
          <CalculatorInput label="Бажана температура води" value={targetTemp} onChange={setTargetTemp} unit="°C" />

          <p className="rounded-2xl bg-slate-50 px-4 py-3 text-xs leading-5 text-slate-500">
            Якщо ΔT більше 5°C: V × 1.5. Інакше: V × 1. Результат округлюється до стандартного нагрівача.
          </p>
        </div>

        <ResultPanel color="bg-rose-500" title="Рекомендовано">
          <p className="text-sm text-white/80">Стандартний обігрівач</p>
          <ResultValue value={result.recommendedPower} unit="Вт" />

          <div className="mt-6 border-t border-white/20 pt-5">
            <p className="text-sm text-white/80">Розрахункова потужність</p>
            <ResultValue small value={result.rawPower} unit="Вт" />
          </div>

          <div className="mt-6 border-t border-white/20 pt-5">
            <p className="text-sm text-white/80">Різниця температур</p>
            <ResultValue small value={result.delta} unit="°C" />
          </div>
        </ResultPanel>
      </div>
    </CalculatorModalLayout>
  );
}