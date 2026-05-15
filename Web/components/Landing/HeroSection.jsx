"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden px-6 pb-20 pt-16">
      <div className="pointer-events-none absolute left-1/2 top-20 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-[#635BFF]/10 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        className="relative z-10 mx-auto max-w-[980px] text-center"
      >
        <h1 className="text-5xl font-light tracking-[0.08em] text-slate-950 md:text-6xl">
          Створюй, контролюй, надихай!
        </h1>

        <p className="mx-auto mt-5 max-w-[720px] text-sm leading-7 text-slate-500">
          AquaCore — це сучасна платформа для ведення акваріумів: контроль
          параметрів, планування догляду, аналітика, калькулятори та спільнота
          в одному місці.
        </p>

        <Link href="/dashboard">
          <motion.button
            whileHover={{
              y: -3,
              boxShadow: "0 18px 40px rgba(99,91,255,0.28)",
            }}
            whileTap={{ scale: 0.96 }}
            className="mt-8 rounded-xl bg-[#635BFF] px-7 py-3 text-sm font-black text-white transition hover:bg-[#5147f5]"
          >
            Перейти до платформи
          </motion.button>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 35, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.65 }}
          className="relative mx-auto mt-14 max-w-[760px]"
        >
          <Image
            src="/images/landing/devices.png"
            alt="AquaCore devices"
            width={1100}
            height={650}
            className="h-auto w-full object-contain drop-shadow-[0_25px_50px_rgba(15,23,42,0.16)]"
            priority
          />
        </motion.div>
      </motion.div>
    </section>
  );
}