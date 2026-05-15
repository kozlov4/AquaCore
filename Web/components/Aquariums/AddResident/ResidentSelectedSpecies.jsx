"use client";

export function ResidentSelectedSpecies({ selectedSpecies, onChange }) {
  return (
    <div>
      <p className="mb-2 text-base font-bold text-gray-700">Обраний вид</p>

      <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
            {selectedSpecies.icon}
          </div>

          <div>
            <p className="text-lg font-bold text-gray-900">
              {selectedSpecies.name}
            </p>
            <p className="text-sm text-gray-500">{selectedSpecies.latin}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onChange}
          className="text-sm font-semibold text-gray-400 hover:text-[#5B4CF6]"
        >
          Змінити
        </button>
      </div>
    </div>
  );
}