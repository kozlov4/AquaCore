"use client";

import { Search } from "lucide-react";

export function ResidentSearchStep({ query, setQuery, filteredSpecies, onSelect }) {
  return (
    <div className="min-h-[470px] px-7 py-7">
      <label className="mb-3 block text-lg font-bold text-gray-700">
        Знайти вид
      </label>

      <div className="flex items-center gap-3 rounded-xl border-2 border-[#5B4CF6] px-4 py-3 shadow-[0_0_0_4px_rgba(91,76,246,0.08)]">
        <Search size={22} className="text-gray-500" />

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Введіть назву виду..."
          className="w-full text-xl font-semibold text-gray-900 outline-none placeholder:text-gray-400"
          autoFocus
        />
      </div>

      <div className="mt-3 overflow-hidden rounded-xl border border-gray-200 shadow-[0_12px_35px_rgba(15,23,42,0.08)]">
        {filteredSpecies.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(item)}
            className="flex w-full items-center gap-4 border-b border-gray-100 px-5 py-4 text-left transition last:border-b-0 hover:bg-gray-50"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-xl">
              {item.icon}
            </div>

            <div>
              <p className="text-xl font-bold text-gray-900">{item.name}</p>
              <p className="text-base text-gray-500">{item.latin}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}