"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { ProtectedLandingLink } from "./ProtectedLandingLink";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden px-5 pb-20 pt-12 md:px-8 md:pb-28 md:pt-16 lg:px-0">
      <div className="mx-auto grid max-w-[1180px] items-center gap-12 md:grid-cols-[1fr_520px]">
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: "easeOut" }}
        >
          <h1 className="max-w-[720px] text-[46px] font-black leading-[0.95] tracking-[-0.06em] text-slate-950 md:text-[74px]">
            Створюй, контролюй, надихай!
          </h1>

          <p className="mt-7 max-w-[620px] text-[17px] font-medium leading-8 text-slate-500">
            AquaCore — це сучасна платформа для ведення акваріумів: контроль
            параметрів, планування догляду, аналітика, калькулятори та спільнота
            в одному місці.
          </p>

          <ProtectedLandingLink
            href="/aquariums"
            className="mt-9 inline-flex h-14 items-center gap-3 rounded-2xl bg-[#635BFF] px-7 text-sm font-black text-white shadow-[0_20px_45px_rgba(99,91,255,0.32)] transition hover:bg-[#5147f5]"
            motionProps={{
              whileHover: { scale: 1.03, y: -2 },
              whileTap: { scale: 0.97 },
            }}
          >
            Перейти до платформи
            <ArrowRight size={18} />
          </ProtectedLandingLink>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.85, ease: "easeOut" }}
          className="relative"
        >
          <div className="absolute -inset-8 rounded-full bg-[#635BFF]/10 blur-3xl" />

          <Image
            src="/images/landing/devices.png"
            alt="AquaCore devices"
            width={620}
            height={520}
            priority
            className="relative z-10 w-full object-contain"
          />
        </motion.div>
      </div>
    </section>
  );
}