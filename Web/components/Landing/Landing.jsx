"use client";

import { LandingHeader } from "./LandingHeader";
import { HeroSection } from "./HeroSection";
import { BenefitsSection } from "./BenefitsSection";
import { FeatureSection } from "./FeatureSection";
import { CommunitySection } from "./CommunitySection";
import { LandingFooter } from "./LandingFooter";

const features = [
  {
    title: "Аналітичний моніторинг",
    text: "Зберігайте показники води та бачте динаміку змін у зручних графіках.",
    button: "Переглянути моніторинг",
    image: "/images/landing/analytics.png",
    reverse: false,
  },
  {
    title: "Перевірка сумісності",
    text: "Перевіряйте, чи можуть різні види жити разом, ще до покупки нових жителів.",
    button: "Запустити аналіз",
    image: "/images/landing/compatibility.png",
    reverse: true,
  },
  {
    title: "Банк калькуляторів",
    text: "Розраховуйте обʼєм, вагу, ґрунт, освітлення, CO2 та інші важливі параметри.",
    button: "Відкрити інструменти",
    image: "/images/landing/calculators.png",
    reverse: false,
  },
  {
    title: "Розумний планувальник",
    text: "Створюйте нагадування про підміни води, годування, тести та обслуговування.",
    button: "Почати планування",
    image: "/images/landing/tasks.png",
    reverse: true,
  },
  {
    title: "Спільнота та Блог",
    text: "Діліться досвідом, ставте питання й отримуйте поради від інших акваріумістів.",
    button: "Перейти до спільноти",
    image: "/images/landing/community.png",
    reverse: false,
  },
  {
    title: "Профілі акваріумів",
    text: "Створюйте окремі профілі для кожної екосистеми та ведіть повну історію догляду.",
    button: "Створити профіль",
    image: "/images/landing/profile.png",
    reverse: true,
  },
];

export function Landing() {
  return (
    <div className="min-h-screen bg-white text-slate-950">
      <LandingHeader />
      <HeroSection />
      <BenefitsSection />

      <main className="mx-auto max-w-[1180px] px-6 py-24">
        <div className="space-y-28">
          {features.map((feature, index) => (
            <FeatureSection key={feature.title} feature={feature} index={index} />
          ))}
        </div>
      </main>

      <CommunitySection />
      <LandingFooter />
    </div>
  );
}