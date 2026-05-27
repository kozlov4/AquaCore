"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";

const menuGroups = [
  {
    title: "Акваріуми",
    items: [
      {
        label: "Мої Акваріуми",
        href: "/aquariums",
        icon: "/images/Aqarium.svg",
      },
      {
        label: "Хронологія Акваріума",
        href: "/timeline",
        icon: "/images/Vectory.svg",
      },
      {
        label: "Особиста Галерея",
        href: "/gallery",
        icon: "/images/Gallery.svg",
      },
      {
        label: "Історія Обладнання",
        href: "/equipment",
        icon: "/images/Tools.svg",
      },
    ],
  },
  {
    title: "Моніторинг та аналітика",
    items: [
      {
        label: "Графіки Показників",
        href: "/analytics",
        icon: "/images/Statics.svg",
      },
      {
        label: "Журнал Акваріуміста",
        href: "/diary",
        icon: "/images/Notes.svg",
      },
    ],
  },
  {
    title: "Планування",
    items: [
      {
        label: "To-Do List",
        href: "/tasks",
        icon: "/images/tasking.svg",
      },
      {
        label: "Графік Підмін",
        href: "/water-change",
        icon: "/images/Kaplya.svg",
      },
    ],
  },
  {
    title: "Інструменти",
    items: [
      {
        label: "Банк Калькуляторів",
        href: "/calculators",
        icon: "/images/Calc.svg",
      },
      {
        label: "Перевірка Сумісності",
        href: "/compatibility",
        icon: "/images/Alarm.svg",
      },
    ],
  },
  {
    title: "Ресурси",
    items: [
      {
        label: "Довідник Видів",
        href: "/species",
        icon: "/images/Fish.svg",
      },
      {
        label: "База Знань",
        href: "/articles",
        icon: "/images/Book.svg",
      },
      {
        label: "Хвороби та Лікування",
        href: "/diseases",
        icon: "/images/Virus.svg",
      },
    ],
  },
  {
    title: "Соціальна мережа",
    items: [
      {
        label: "Спільнота",
        href: "/feed",
        icon: "/images/Community.svg",
      },
    ],
  },
  {
    title: "Підтримка",
    items: [
      {
        label: "Зворотний зв'язок",
        href: "/reviews",
        icon: "/images/Message.svg",
      },
    ],
  },
];

const mobileMainItems = [
  {
    label: "Панель",
    href: "/dashboard",
    icon: "/images/Menu.svg",
  },
  {
    label: "Акваріуми",
    href: "/aquariums",
    icon: "/images/Aqarium.svg",
  },
  {
    label: "Калькулятор",
    href: "/calculators",
    icon: "/images/Calc.svg",
  },
  {
    label: "Журнал",
    href: "/diary",
    icon: "/images/Notes.svg",
  },
  {
    label: "Профіль",
    href: "/profile",
    icon: "/images/User.svg",
  },
];

function SidebarIcon({ src, alt, size = 22 }) {
  return (
    <span
      className="relative shrink-0"
      style={{
        width: size,
        height: size,
      }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={`${size}px`}
        className="object-contain"
      />
    </span>
  );
}

function DotsIcon() {
  return (
    <span className="flex items-center gap-[3px]">
      <span className="h-[4px] w-[4px] rounded-full bg-[#505866]" />
      <span className="h-[4px] w-[4px] rounded-full bg-[#505866]" />
      <span className="h-[4px] w-[4px] rounded-full bg-[#505866]" />
    </span>
  );
}

function SidebarItem({ item }) {
  const router = useRouter();

  const isActive =
    router.pathname === item.href || router.pathname.startsWith(`${item.href}/`);

  return (
    <Link
      href={item.href}
      className={`group flex h-[32px] items-center gap-[12px] rounded-[8px] px-[6px] text-[12px] font-normal transition-all duration-200 ${
        isActive
          ? "bg-[#efa7d2] text-[#111827]"
          : "text-[#111827] hover:bg-[#f7e1ef]"
      }`}
    >
      <SidebarIcon src={item.icon} alt={item.label} size={21} />
      <span className="truncate">{item.label}</span>
    </Link>
  );
}

export function Sidebar() {
  const router = useRouter();

  const isDashboardActive =
    router.pathname === "/dashboard" ||
    router.pathname.startsWith("/dashboard/");

  return (
    <>
      <aside className="fixed left-0 top-0 z-50 hidden h-screen w-[210px] flex-col bg-[#fbfbfc] text-[#111827] shadow-[8px_0_30px_rgba(15,23,42,0.04)] md:flex">
        <div className="flex min-h-0 flex-1 flex-col px-[24px] pt-[24px]">
          <Link
            href="/dashboard"
            className="mb-[42px] flex items-center gap-[13px]"
          >
            <Image
              src="/images/Logo.svg"
              alt="AquaCore"
              width={48}
              height={48}
              priority
              className="h-[42px] w-auto object-contain"
            />

            <span className="bg-gradient-to-r from-[#7665ff] via-[#b66fd5] to-[#f0a2ce] bg-clip-text text-[17px] font-extrabold uppercase tracking-[0.04em] text-transparent">
              Aqua Core
            </span>
          </Link>

          <Link
            href="/dashboard"
            className={`mb-[21px] flex h-[43px] items-center gap-[13px] rounded-[9px] px-[10px] text-[13px] font-medium text-[#111827] transition-all duration-200 ${
              isDashboardActive
                ? "bg-[#efa7d2]"
                : "bg-[#efa7d2] hover:bg-[#e99ccc]"
            }`}
          >
            <SidebarIcon
              src="/images/Menu.svg"
              alt="Панель управління"
              size={27}
            />
            <span>Панель управління</span>
          </Link>

          <nav className="sidebar-scroll min-h-0 flex-1 overflow-y-auto pr-[2px]">
            <div className="flex flex-col gap-[15px] pb-[18px]">
              {menuGroups.map((group) => (
                <section key={group.title}>
                  <h3 className="mb-[6px] px-[2px] text-[8px] font-semibold uppercase tracking-[0.09em] text-[#b7bbc4]">
                    {group.title}
                  </h3>

                  <div className="flex flex-col gap-[4px]">
                    {group.items.map((item) => (
                      <SidebarItem key={item.href} item={item} />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </nav>
        </div>

        <div className="flex h-[78px] shrink-0 items-center justify-between bg-[#f1f4f8] px-[24px]">
          <div className="flex min-w-0 items-center gap-[11px]">
            <Image
              src="/images/Avatar.png"
              alt="Jane"
              width={42}
              height={42}
              className="h-[42px] w-[42px] shrink-0 rounded-full object-cover"
            />

            <div className="min-w-0">
              <p className="m-0 truncate text-[13px] font-semibold leading-[18px] text-[#111827]">
                Jane
              </p>

              <p className="m-0 truncate text-[12px] leading-[17px] text-[#7b8190]">
                jane@example.com
              </p>
            </div>
          </div>

          <button
            type="button"
            aria-label="User menu"
            className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full text-[#4b5563] transition-colors hover:bg-white"
          >
            <DotsIcon />
          </button>
        </div>
      </aside>

      <nav className="fixed bottom-0 left-0 z-50 grid h-[70px] w-full grid-cols-5 border-t border-slate-200 bg-white shadow-[0_-10px_35px_rgba(15,23,42,0.08)] md:hidden">
        {mobileMainItems.map((item) => {
          const isActive =
            router.pathname === item.href ||
            router.pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 text-[10px] font-medium ${
                isActive ? "text-[#111827]" : "text-[#7b8190]"
              }`}
            >
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-xl ${
                  isActive ? "bg-[#efa7d2]" : "bg-transparent"
                }`}
              >
                <SidebarIcon src={item.icon} alt={item.label} size={19} />
              </span>

              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <style jsx global>{`
        .sidebar-scroll::-webkit-scrollbar {
          width: 4px;
        }

        .sidebar-scroll::-webkit-scrollbar-track {
          background: transparent;
        }

        .sidebar-scroll::-webkit-scrollbar-thumb {
          background: #e1e5ec;
          border-radius: 999px;
        }

        .sidebar-scroll::-webkit-scrollbar-thumb:hover {
          background: #cfd5df;
        }
      `}</style>
    </>
  );
}

export default Sidebar;