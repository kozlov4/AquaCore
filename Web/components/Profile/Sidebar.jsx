"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Menu,
} from "lucide-react";

const navItems = [
  { label: "Дім", href: "/", icon: "/images/Menu.svg" },
  { label: "Пошук", href: "/search", icon: "/images/Aqarium.svg" },
  { label: "Дослідити", href: "/explore", icon: "/images/Vectory.svg" },
  { label: "Повідомлення", href: "/messages", icon: "/images/Gallery.svg" },
  { label: "Сповіщення", href: "/notifications", icon: "/images/Tools.svg" },
  { label: "Створити пост", href: "/create", icon: "/images/Statics.svg" },
  { label: "Reels", href: "/reels", icon: "/images/Notes.svg" },
  { label: "Профіль", href: "/profile", icon: "/images/Kaplya.svg" },
  { label: "Калькулятор", href: "/#", icon: "/images/Calc.svg" },
  { label: "Тревога", href: "/#", icon: "/images/Alarm.svg" },
  { label: "Риба", href: "/#", icon: "/images/Fish.svg" },
  { label: "Книга", href: "/#", icon: "/images/Book.svg" },
  { label: "Вірус", href: "/#", icon: "/images/Virus.svg" },
  { label: "Ком'юніті", href: "/#", icon: "/images/Community.svg" },
  { label: "Повідомлення", href: "/#", icon: "/images/Message.svg" },
  { label: "Користувач", href: "/profile", icon: "/images/User.svg" },
];

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-[88px] flex-col border-r border-gray-200 bg-white px-3 py-5">
      
      {/* LOGO */}
      <div className="mb-6 flex justify-center">
        <div className="relative h-8 w-8">
          <Image
            src="/images/mini-logo.svg"
            alt="logo"
            fill
            className="object-contain"
          />
        </div>
      </div>

      {/* 🔥 SCROLLABLE NAV */}
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto pr-1">
        {navItems.map(({ label, href, icon }) => {
          const Icon = icon;

          return (
            <Link
              key={label + href}
              href={href}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-gray-700 transition hover:bg-gray-100 hover:text-black"
              title={label}
            >
              {typeof icon === "string" ? (
                <Image
                  src={icon}
                  alt={label}
                  width={20}
                  height={20}
                  className="object-contain"
                />
              ) : (
                <Icon size={20} strokeWidth={2} />
              )}
            </Link>
          );
        })}
      </nav>

      {/* BOTTOM MENU */}
      <div className="mt-4 flex justify-center">
        <button className="flex h-11 w-11 items-center justify-center rounded-xl text-gray-700 transition hover:bg-gray-100 hover:text-black">
          <Menu size={20} strokeWidth={2} />
        </button>
      </div>
    </aside>
  );
}