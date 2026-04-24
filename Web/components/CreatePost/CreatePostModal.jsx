"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ArrowLeft, ChevronDown, ImagePlus } from "lucide-react";

export function CreatePostModal({ isOpen, onClose }) {
  const fileInputRef = useRef(null);

  const [selectedImage, setSelectedImage] = useState(null);
  const [caption, setCaption] = useState("");
  const [category, setCategory] = useState("");
  const [aquarium, setAquarium] = useState("");

  if (!isOpen) return null;

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setSelectedImage(imageUrl);
  };

  const handlePublish = () => {
    console.log({
      image: selectedImage,
      caption,
      category,
      aquarium,
    });

    onClose();
    setSelectedImage(null);
    setCaption("");
    setCategory("");
    setAquarium("");
  };

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/70" onClick={onClose} />

      {!selectedImage ? (
        <div className="fixed left-1/2 top-1/2 z-50 h-[620px] w-[620px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[18px] bg-white shadow-2xl">
          <div className="border-b border-gray-200 py-4 text-center">
            <h2 className="text-[22px] font-semibold text-gray-900">
              Створити новий пост
            </h2>
          </div>

          <div className="flex h-[540px] flex-col items-center justify-center">
            <ImagePlus size={82} strokeWidth={1.5} className="mb-6 text-gray-800" />

            <p className="mb-5 text-center text-[28px] leading-8 text-gray-800">
              Перетягніть сюди <br /> фотографії
            </p>

            <button
              type="button"
              onClick={() => fileInputRef.current.click()}
              className="rounded-xl cursor-pointer bg-[#5B4CF6] px-6 py-3 text-[18px] font-semibold text-white hover:opacity-90"
            >
              Обрати з пристроя
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>
      ) : (
        <div className="fixed left-1/2 top-1/2 z-50 h-[90vh] w-[90vw] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-lg bg-white shadow-2xl">
          <div className="flex h-[54px] items-center justify-between border-b border-gray-200 px-5">
            <button type="button" onClick={() => setSelectedImage(null)}>
              <ArrowLeft size={26} />
            </button>

            <h2 className="text-[18px] font-semibold text-gray-900">
              Створити новий пост
            </h2>

            <button
              type="button"
              onClick={handlePublish}
              className="text-[16px] cursor-pointer font-semibold text-[#4F46E5]"
            >
              Опублікувати
            </button>
          </div>

          <div className="flex h-[calc(90vh-54px)]">
            <div className="relative h-full flex-1 bg-black">
              <Image
                src={selectedImage}
                alt="selected post"
                fill
                className="object-cover"
              />
            </div>

            <div className="flex w-[520px] flex-col bg-white">
              <div className="flex gap-6 px-6 py-8">
                <div className="relative w-1/2">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="h-[56px] w-full appearance-none rounded-lg border border-gray-300 px-4 text-gray-700 outline-none"
                  >
                    <option value="">Оберіть категорію</option>
                    <option value="fish">Рибки</option>
                    <option value="aquarium">Акваріуми</option>
                    <option value="plants">Рослини</option>
                    <option value="equipment">Обладнання</option>
                  </select>
                  <ChevronDown
                    size={20}
                    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2"
                  />
                </div>

                <div className="relative w-1/2">
                  <select
                    value={aquarium}
                    onChange={(e) => setAquarium(e.target.value)}
                    className="h-[56px] w-full appearance-none rounded-lg border border-gray-300 px-4 text-gray-700 outline-none"
                  >
                    <option value="">Оберіть акваріум</option>
                    <option value="main">Основний акваріум</option>
                    <option value="nano">Nano aquarium</option>
                    <option value="reef">Reef aquarium</option>
                  </select>
                  <ChevronDown
                    size={20}
                    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 px-6">
                <div className="relative h-9 w-9 overflow-hidden rounded-full">
                  <Image
                    src="/images/Avatar.png"
                    alt="avatar"
                    fill
                    className="object-cover"
                  />
                </div>

                <p className="text-[16px] font-semibold text-gray-900">
                  nickname939
                </p>
              </div>

              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value.slice(0, 2000))}
                placeholder="Напишіть опис..."
                className="mt-4 h-full resize-none px-6 text-[17px] outline-none placeholder:text-gray-400"
              />

              <div className="px-6 py-4 text-right text-sm text-gray-500">
                {caption.length}/2000
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}