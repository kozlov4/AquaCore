"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";

export function LandingHeader() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -18 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-50 border-b border-slate-100 bg-white/85 backdrop-blur-xl"
    >
      <div className="mx-auto flex h-20 max-w-[1180px] items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative h-20 w-20 overflow-hidden rounded-xl">
            <Image
              src="/images/logo.svg"
              alt="AquaCore logo"
              fill
              className="object-contain"
              priority
            />
          </div>

          <div className="leading-tight">
            <p className="text-sm font-black uppercase text-[#635BFF]">Aqua</p>
            <p className="text-sm font-black uppercase text-slate-950">Core</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-10 text-sm font-semibold text-slate-600 md:flex">
          <a href="#why" className="transition hover:text-[#635BFF]">
            Чому саме AquaCore
          </a>
          <a href="#features" className="transition hover:text-[#635BFF]">
            Вигоди
          </a>
          <a href="#calculators" className="transition hover:text-[#635BFF]">
            Калькулятори
          </a>
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href="/signIn"
            className="text-sm font-bold text-slate-800 transition hover:text-[#635BFF]"
          >
            Увійти
          </Link>

          <Link href="/registration">
            <motion.button
              whileHover={{
                y: -2,
                boxShadow: "0 14px 30px rgba(99,91,255,0.3)",
              }}
              whileTap={{ scale: 0.96 }}
              className="rounded-xl bg-[#635BFF] px-5 py-2.5 text-sm font-black text-white transition hover:bg-[#5147f5]"
            >
              Почати зараз
            </motion.button>
          </Link>
        </div>
      </div>
    </motion.header>
  );
}
