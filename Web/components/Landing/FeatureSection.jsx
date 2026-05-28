"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { ProtectedLandingLink } from "./ProtectedLandingLink";

export function FeatureSection({ feature, index }) {
  const isReverse = feature.reverse;

  return (
    <section
      className={`mx-auto grid max-w-[1180px] items-center gap-10 px-5 py-16 md:grid-cols-2 md:px-8 lg:px-0 ${
        isReverse ? "md:[&>*:first-child]:order-2" : ""
      }`}
    >
      <motion.div
        initial={{ opacity: 0, x: isReverse ? 35 : -35 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.75, ease: "easeOut" }}
        className="relative overflow-hidden rounded-[34px] bg-slate-100 shadow-[0_30px_90px_rgba(15,23,42,0.12)]"
      >
        <Image
          src={feature.image}
          alt={feature.title}
          width={720}
          height={520}
          className="h-[320px] w-full object-cover md:h-[420px]"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: isReverse ? -35 : 35 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.75, ease: "easeOut" }}
        className="max-w-[520px]"
      >
        <h2 className="text-[34px] font-black leading-tight tracking-[-0.04em] text-slate-950 md:text-[46px]">
          {feature.title}
        </h2>

        <p className="mt-5 whitespace-pre-line text-[16px] font-medium leading-8 text-slate-500">
          {feature.text}
        </p>

        <ProtectedLandingLink
          href={feature.href}
          className="mt-8 inline-flex h-12 items-center gap-2 rounded-2xl bg-[#635BFF] px-6 text-sm font-black text-white shadow-[0_18px_40px_rgba(99,91,255,0.28)] transition hover:bg-[#5147f5]"
          motionProps={{
            whileHover: { scale: 1.03, y: -2 },
            whileTap: { scale: 0.97 },
          }}
        >
          {feature.button}
          <ArrowRight size={17} />
        </ProtectedLandingLink>
      </motion.div>
    </section>
  );
}