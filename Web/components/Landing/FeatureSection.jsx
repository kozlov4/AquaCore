"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export function FeatureSection({ feature, index }) {
  return (
    <section
      id={index === 2 ? "calculators" : index === 0 ? "features" : undefined}
      className={`grid items-center gap-12 md:grid-cols-2 ${
        feature.reverse ? "md:[&>*:first-child]:order-2" : ""
      }`}
    >
      <motion.div
        initial={{ opacity: 0, x: feature.reverse ? 40 : -40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-120px" }}
        transition={{ duration: 0.5 }}
        className="max-w-[380px]"
      >
        <h2 className="text-3xl font-light tracking-[0.1em] text-slate-950">
          {feature.title}
        </h2>

        <p className="mt-5 text-sm leading-7 text-slate-500">
          {feature.text}
        </p>

        <Link href="/dashboard">
          <motion.button
            whileHover={{
              y: -2,
              boxShadow: "0 14px 30px rgba(99,91,255,0.25)",
            }}
            whileTap={{ scale: 0.96 }}
            className="mt-7 rounded-lg bg-[#635BFF] px-5 py-2.5 text-xs font-black uppercase tracking-wide text-white transition hover:bg-[#5147f5]"
          >
            {feature.button}
          </motion.button>
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-120px" }}
        transition={{ duration: 0.55 }}
        whileHover={{ y: -6 }}
        className="relative"
      >
        <Image
          src={feature.image}
          alt={feature.title}
          width={760}
          height={460}
          className="h-auto w-full object-contain drop-shadow-[0_24px_45px_rgba(15,23,42,0.16)]"
        />
      </motion.div>
    </section>
  );
}