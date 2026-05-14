"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { Menu } from "lucide-react";

const navItems = [
  { label: "Дашборд", href: "/dashboard", icon: "/images/Menu.svg" },
  { label: "Акваріуми", href: "/aquariums", icon: "/images/Aqarium.svg" },
  { label: "Таймлайн", href: "/timeline", icon: "/images/Vectory.svg" },
  { label: "Галерея", href: "/gallery", icon: "/images/Gallery.svg" },
  { label: "Інвентар", href: "/equipment", icon: "/images/Tools.svg" },
  { label: "Аналітика", href: "/analytics", icon: "/images/Statics.svg" },
  { label: "Щоденник", href: "/diary", icon: "/images/Notes.svg" },
  { label: "Список завдань", href: "/tasks", icon: "/images/tasking.svg" },
  { label: "Вода", href: "/water-change", icon: "/images/Kaplya.svg" },
  { label: "Калькулятор", href: "/calculators", icon: "/images/Calc.svg" },
  { label: "Сумісність", href: "/compatibility", icon: "/images/Alarm.svg" },
  { label: "Види", href: "/species", icon: "/images/Fish.svg" },
  { label: "Книга", href: "/#", icon: "/images/Book.svg" },
  { label: "Вірус", href: "/diseases", icon: "/images/Virus.svg" },
  { label: "Ком'юніті", href: "/#", icon: "/images/Community.svg" },
  { label: "Відгуки", href: "/reviews", icon: "/images/Message.svg" },
  { label: "Користувач", href: "/profile", icon: "/images/User.svg" },
];

const mobileMainItems = [
  "/dashboard",
  "/aquariums",
  "/calculators",
  "/diary",
  "/profile",
];

export function Sidebar() {
  const router = useRouter();

  const isActiveLink = (href) => {
    if (href === "/#") return false;

    return router.pathname === href || router.pathname.startsWith(href + "/");
  };

  const desktopItems = navItems;
  const mobileItems = navItems.filter((item) =>
    mobileMainItems.includes(item.href)
  );

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <aside
        className="
          fixed left-0 top-0 z-40
          hidden h-screen w-[88px] flex-col
          border-r border-slate-200 bg-white/95
          px-3 py-5 backdrop-blur-xl
          lg:flex
        "
      >
        {/* LOGO */}
        <div className="mb-6 flex justify-center">
          <Link
            href="/dashboard"
            className="relative h-9 w-9 transition duration-300 hover:scale-110"
          >
            <Image
              src="/images/mini-logo.svg"
              alt="logo"
              fill
              className="object-contain"
            />
          </Link>
        </div>

        {/* NAVIGATION */}
        <nav className="flex flex-1 flex-col items-center gap-2 overflow-y-auto pr-1">
          {desktopItems.map(({ label, href, icon }) => {
            const isActive = isActiveLink(href);

            return (
              <Link
                key={label + href}
                href={href}
                title={label}
                className={`
                  group relative flex h-11 w-11 shrink-0
                  items-center justify-center rounded-2xl
                  transition-all duration-300
                  ${
                    isActive
                      ? "bg-gradient-to-br from-[#635BFF] to-[#7C72FF] shadow-[0_10px_30px_rgba(99,91,255,0.35)]"
                      : "hover:bg-slate-100"
                  }
                `}
              >
                {isActive && (
                  <div className="absolute inset-0 rounded-2xl bg-[#635BFF]/20 blur-xl" />
                )}

                <div className="relative z-10 transition duration-300 group-hover:scale-110">
                  <Image
                    src={icon}
                    alt={label}
                    width={20}
                    height={20}
                    className={`
                      object-contain transition duration-300
                      ${
                        isActive
                          ? "brightness-0 invert"
                          : "opacity-70 group-hover:opacity-100"
                      }
                    `}
                  />
                </div>

                <div
                  className="
                    pointer-events-none absolute left-14 hidden
                    whitespace-nowrap rounded-xl bg-slate-950
                    px-3 py-2 text-xs font-semibold text-white
                    shadow-2xl group-hover:block
                  "
                >
                  {label}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* BOTTOM BUTTON */}
        <div className="mt-4 flex justify-center">
          <button
            type="button"
            className="
              group flex h-11 w-11 items-center justify-center
              rounded-2xl text-slate-500
              transition-all duration-300
              hover:bg-slate-100 hover:text-slate-950
            "
          >
            <Menu
              size={20}
              strokeWidth={2}
              className="transition duration-300 group-hover:rotate-90"
            />
          </button>
        </div>
      </aside>

      {/* MOBILE BOTTOM NAVIGATION */}
      <nav
        className="
          fixed bottom-0 left-0 right-0 z-50
          flex items-center justify-around
          border-t border-slate-200 bg-white/95
          px-3 pb-[calc(env(safe-area-inset-bottom)+10px)] pt-3
          shadow-[0_-12px_35px_rgba(15,23,42,0.10)]
          backdrop-blur-xl
          lg:hidden
        "
      >
        {mobileItems.map(({ label, href, icon }) => {
          const isActive = isActiveLink(href);

          return (
            <Link
              key={label + href}
              href={href}
              className="
                flex min-w-[58px] flex-col items-center justify-center gap-1
              "
            >
              <div
                className={`
                  relative flex h-11 w-11 items-center justify-center
                  rounded-2xl transition-all duration-300
                  ${
                    isActive
                      ? "bg-gradient-to-br from-[#635BFF] to-[#7C72FF] shadow-[0_10px_24px_rgba(99,91,255,0.28)]"
                      : "bg-transparent"
                  }
                `}
              >
                {isActive && (
                  <div className="absolute inset-0 rounded-2xl bg-[#635BFF]/20 blur-lg" />
                )}

                <Image
                  src={icon}
                  alt={label}
                  width={20}
                  height={20}
                  className={`
                    relative z-10 object-contain transition duration-300
                    ${isActive ? "brightness-0 invert" : "opacity-70"}
                  `}
                />
              </div>

              <span
                className={`
                  max-w-[64px] truncate text-[10px] font-bold
                  ${
                    isActive
                      ? "text-[#635BFF]"
                      : "text-slate-400"
                  }
                `}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}