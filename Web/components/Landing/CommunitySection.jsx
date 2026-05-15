"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const avatars = [
  { src: "/images/Avatar.png", className: "left-[6%] top-[18%]" },
  { src: "/images/Avatar.png", className: "left-[18%] top-[58%]" },
  { src: "/images/Avatar.png", className: "left-[28%] top-[10%]" },
  { src: "/images/Avatar.png", className: "right-[7%] top-[16%]" },
  { src: "/images/Avatar.png", className: "right-[18%] top-[62%]" },
  { src: "/images/Avatar.png", className: "right-[28%] top-[8%]" },
];

export function CommunitySection() {
  return (
    <section className="relative overflow-hidden px-6 py-28">
      <div className="mx-auto max-w-[980px] text-center">
        {avatars.map((avatar, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.7 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.06 }}
            className={`absolute hidden h-16 w-16 overflow-hidden rounded-full shadow-xl md:block ${avatar.className}`}
          >
            <Image
              src={avatar.src}
              alt="community member"
              fill
              className="object-cover"
            />
          </motion.div>
        ))}

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl font-light tracking-[0.08em] text-slate-950"
        >
          Готові приєднатися до спільноти?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.08 }}
          className="mx-auto mt-5 max-w-[620px] text-sm leading-7 text-slate-500"
        >
          Сотні акваріумістів уже відстежують догляд, діляться досвідом,
          планують підміни та створюють здорові екосистеми разом з AquaCore.
        </motion.p>

        <Link href="/registration">
          <motion.button
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{
              y: -3,
              boxShadow: "0 18px 40px rgba(99,91,255,0.28)",
            }}
            whileTap={{ scale: 0.96 }}
            className="mt-8 rounded-xl bg-[#635BFF] px-8 py-3 text-sm font-black text-white transition hover:bg-[#5147f5]"
          >
            Зареєструватися безкоштовно →
          </motion.button>
        </Link>
      </div>
    </section>
  );
}