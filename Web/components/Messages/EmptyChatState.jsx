"use client";

export function EmptyChatState() {
  return (
    <div className="flex h-[calc(100vh-66px)] flex-1 items-center justify-center bg-[#fafafa]">
      <div className="text-center">
        <h2 className="text-3xl font-semibold text-gray-900">
          Оберіть один із чатів
        </h2>
        <p className="mt-3 text-base text-gray-400">
          Щоб почати листування, відкрийте чат зліва.
        </p>
      </div>
    </div>
  );
}