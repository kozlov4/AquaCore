"use client";

import { motion } from "framer-motion";

const benefits = [
  {
    icon: "📈",
    title: "Аналітика й контроль",
    text: "Ведіть параметри води, дивіться історію змін і швидко помічайте нестабільність.",
  },
  {
    icon: "🧠",
    title: "Екосистемний підхід",
    text: "Створюйте профілі акваріумів, додавайте жителів, обладнання, нотатки та фото.",
  },
  {
    icon: "☁️",
    title: "Доступ з будь-якого пристрою",
    text: "Керуйте акваріумом із компʼютера, планшета або телефону без втрати даних.",
  },
];

export function BenefitsSection() {
  return (
    <section id="why" className="bg-[#101724] px-6 py-16 text-white">
      <div className="mx-auto grid max-w-[980px] grid-cols-1 gap-10 md:grid-cols-3">
        {benefits.map((benefit, index) => (
          <motion.article
            key={benefit.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.08 }}
            className="text-center"
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-2xl">
              {benefit.icon}
            </div>

            <h3 className="mt-6 text-sm font-black uppercase tracking-[0.18em] text-white">
              {benefit.title}
            </h3>

            <p className="mt-4 text-sm leading-7 text-white/45">
              {benefit.text}
            </p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}