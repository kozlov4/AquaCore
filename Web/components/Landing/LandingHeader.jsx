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
      <div className="mx-auto flex h-20 max-w-[1180px] items-center justify-between ">
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
        </Link>

        <nav className="hidden items-center gap-20 text-md font-semibold text-slate-600 md:flex">
          <a href="#why" className="transition hover:text-[#635BFF]">
            Чому саме 
            <span className="text-fuchsia-800"> AquaCore</span>
          </a>
          <a href="#features" className="transition hover:text-[#635BFF]">
            Відгуки
          </a>
          <a href="#calculators" className="transition hover:text-[#635BFF]">
            Калькулятори
          </a>
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href="/signIn"
            className="text-md font-bold text-slate-800 transition hover:text-[#635BFF]"
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
              className="rounded-xl bg-[#635BFF] px-5 py-2.5 text-md font-black text-white transition hover:bg-[#5147f5]"
            >
              Почати зараз
            </motion.button>
          </Link>
        </div>
      </div>
    </motion.header>
  );
}
