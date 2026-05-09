"use client";

import Image from "next/image";
import { Upload } from "lucide-react";

export function AquariumCoverUpload({ cover, fileInputRef, onFileChange }) {
  return (
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
          <Image src={cover} alt="cover" fill className="object-cover" />
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
        onChange={onFileChange}
        className="hidden"
      />
    </div>
  );
}