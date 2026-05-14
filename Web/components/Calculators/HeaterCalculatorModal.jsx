"use client";

import { useState } from "react";
import {
  CalculatorModalLayout,
  CalculatorInput,
  ResultPanel,
  ResultValue,
} from "./calculatorModalUi";

export function HeaterCalculatorModal({ onClose }) {
  const [volume, setVolume] = useState(100);
  const [roomTemp, setRoomTemp] = useState(18);
  const [targetTemp, setTargetTemp] = useState(25);

  const delta = Math.max(targetTemp - roomTemp, 0);
  const watts = Math.round(volume * delta * 0.15);

  return (
    <CalculatorModalLayout
      icon="🌡️"
      title="Потужність обігрівача"
      subtitle="Компенсація різниці температур"
      iconBg="bg-rose-50"
      onClose={onClose}
    >
      <div
        className="
          grid grid-cols-1 gap-5 px-4 py-5
          sm:px-7 sm:py-7
          lg:grid-cols-[1fr_220px] lg:gap-7
        "
      >
        <div className="space-y-5">
          <CalculatorInput
            label="Обʼєм води"
            value={volume}
            onChange={setVolume}
            unit="л"
          />

          <CalculatorInput
            label="Мінімальна темп. у кімнаті"
            value={roomTemp}
            onChange={setRoomTemp}
            unit="°C"
          />

          <CalculatorInput
            label="Бажана темп. в акваріумі"
            value={targetTemp}
            onChange={setTargetTemp}
            unit="°C"
          />
        </div>

        <ResultPanel color="bg-rose-500" title="Вам потрібен обігрівач">
          <p className="text-sm text-white/80">Рекомендована потужність</p>
          <ResultValue value={watts} unit="Ватт" />

          <div className="mt-6 border-t border-white/20 pt-5">
            <p className="text-sm text-white/80">Різниця температур</p>
            <ResultValue small value={delta} unit="°C" />
          </div>
        </ResultPanel>
      </div>
    </CalculatorModalLayout>
  );
}