"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Upload, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function AddAquariumModal({ isOpen, onClose, onSave }) {
  const fileInputRef = useRef(null);

  const [cover, setCover] = useState("");
  const [name, setName] = useState("");
  const [volume, setVolume] = useState("100");
  const [startDate, setStartDate] = useState("");
  const [waterType, setWaterType] = useState("Прісноводний");

  const resetForm = () => {
    setCover("");
    setName("");
    setVolume("100");
    setStartDate("");
    setWaterType("Прісноводний");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setCover(URL.createObjectURL(file));
  };

  const handleSave = () => {
    if (!name.trim() || !volume || !startDate) {
      alert("Заповніть обовʼязкові поля");
      return;
    }

    onSave?.({
      name,
      volume: `${volume} л`,
      environment: waterType,
      startDate,
      image: cover || "/images/fish-card.jpg",
    });

    resetForm();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/55 backdrop-blur-[3px]"
            onClick={handleClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 28 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed left-1/2 top-1/2 z-50 w-[560px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[24px] bg-white shadow-[0_30px_90px_rgba(15,23,42,0.32)]"
          >
            <div className="flex items-center justify-between border-b border-gray-200 px-7 py-5">
              <h2 className="text-2xl font-bold text-gray-900">
                Нова екосистема
              </h2>

              <button
                type="button"
                onClick={handleClose}
                className="rounded-lg p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-800"
              >
                <X size={22} />
              </button>
            </div>

            <div className="space-y-6 px-7 py-6">
              <div>
                <p className="mb-2 text-base font-semibold text-gray-700">
                  Обкладинка &#40;необов&apos;язково&#41;
                </p>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="relative flex h-[175px] w-full flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 transition hover:border-[#5B4CF6] hover:bg-[#5B4CF6]/5"
                >
                  {cover ? (
                    <Image
                      src={cover}
                      alt="cover"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <>
                      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
                        <Upload size={22} className="text-[#5B4CF6]" />
                      </div>

                      <p className="text-base font-semibold text-[#5B4CF6]">
                        Натисніть для завантаження
                      </p>
                      <p className="mt-1 text-sm text-gray-400">
                        або перетягніть фото сюди &#40;PNG, JPG&#41;
                      </p>
                    </>
                  )}
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              <div>
                <label className="mb-2 block text-base font-semibold text-gray-700">
                  Назва акваріума <span className="text-red-500">*</span>
                </label>

                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Наприклад: Головний Травник"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base outline-none transition placeholder:text-gray-400 focus:border-[#5B4CF6] focus:ring-4 focus:ring-[#5B4CF6]/10"
                />
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="mb-2 block text-base font-semibold text-gray-700">
                    Об&apos;єм &#40;Літри&#41;{" "}
                    <span className="text-red-500">*</span>
                  </label>

                  <div className="relative">
                    <input
                      type="number"
                      value={volume}
                      onChange={(e) => setVolume(e.target.value)}
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 pr-10 text-base outline-none transition focus:border-[#5B4CF6] focus:ring-4 focus:ring-[#5B4CF6]/10"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                      л
                    </span>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-base font-semibold text-gray-700">
                    Дата запуску <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base outline-none transition focus:border-[#5B4CF6] focus:ring-4 focus:ring-[#5B4CF6]/10"
                  />
                </div>
              </div>

              <div>
                <p className="mb-3 text-base font-semibold text-gray-700">
                  Тип водойми <span className="text-red-500">*</span>
                </p>

                <div className="grid grid-cols-2 gap-4">
                  {["Прісноводний", "Морський"].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setWaterType(type)}
                      className={`rounded-xl border px-4 py-3 text-base font-semibold transition ${
                        waterType === type
                          ? "border-[#5B4CF6] bg-[#5B4CF6]/5 text-[#5B4CF6]"
                          : "border-gray-200 bg-white text-gray-600 hover:border-[#5B4CF6]/40"
                      }`}
                    >
                      {type === "Прісноводний" ? "🌿" : "🌊"} {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-4 bg-gray-50 px-7 py-5">
              <button
                type="button"
                onClick={handleClose}
                className="rounded-xl border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-100"
              >
                Скасувати
              </button>

              <motion.button
                type="button"
                onClick={handleSave}
                whileHover={{
                  y: -2,
                  boxShadow: "0 14px 30px rgba(91,76,246,.28)",
                }}
                whileTap={{ scale: 0.97 }}
                className="rounded-xl bg-gradient-to-r from-[#5B4CF6] to-[#9333EA] px-6 py-3 font-semibold text-white transition"
              >
                Створити акваріум
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}