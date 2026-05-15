"use client";

import { motion } from "framer-motion";

export function AquariumTabs({ tabs, activeTab, setActiveTab }) {
  return (
    <nav className="mt-6 flex border-b border-gray-200">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`relative rounded-t-xl px-5 py-4 text-sm font-semibold transition-all duration-300 ${
            activeTab === tab
              ? "bg-[#5B4CF6]/5 text-[#5B4CF6]"
              : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
          }`}
        >
          {tab}

          {activeTab === tab && (
            <motion.div
              layoutId="aquarium-tab"
              className="absolute bottom-0 left-0 h-[3px] w-full rounded-full bg-[#5B4CF6]"
            />
          )}
        </button>
      ))}
    </nav>
  );
}