"use client";

import Link from "next/link";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import {
  BarChart3,
  Layers3,
  Cloud,
  ArrowRight,
} from "lucide-react";

const features = [
  {
    title: "Аналітичний моніторинг",
    text: "Фіксуйте показники води (pH, аміак, нітрити) та відслідковуйте їх зміни на динамічних графіках. ",
    button: "Розпочати моніторинг...",
    image: "/images/landing/graphic.jpg",
    href: "/analytics",
    reverse: false,
  },
  {
    title: "Перевірка сумісності",
    text: "Доступ до великої бази риб та рослин. Алгоритм автоматично перевірить біологічну сумісність видів перед їх додаванням до акваріума.",
    button: "Перевірити своїх рибок...",
    image: "/images/landing/critic.jpg",
    href: "/compatibility",
    reverse: true,
  },
  {
    title: "Банк калькуляторів",
    text: "Вбудовані інструменти для швидкого розрахунку об'єму, маси ґрунту, дозування добрив та концентрації CO2",
    button: "Відкрити інструменти...",
    image: "/images/landing/calc.jpg",
    href: "/calculators",
    reverse: false,
  },
  {
    title: "Розумний планувальник",
    text: "Створюйте нагадування про рутинні задачі: підміну води, годування чи очищення фільтрів. Більше жодних пропущених процедур.",
    button: "Налаштувати графік...",
    image: "/images/landing/plan.jpg",
    href: "/tasks",
    reverse: true,
  },
  {
    title: "Спільнота та Блоги",
    text: "Зберігайте історію у приватній галереї, ведіть щоденник спостережень та публікуйте власні статті у відкритій Базі Знань.",
    button: "Обмінюйтеся емоціями...",
    image: "/images/landing/chats.jpg",
    href: "/feed",
    reverse: false,
  },
  {
    title: "Профілі акваріумів",
    text: "Створюйте віртуальні копії своїх резервуарів із детальною специфікацією габаритів та встановленого обладнання.",
    button: "Створити профіль...",
    image: "/images/landing/aqa.jpg",
    href: "/aquariums",
    reverse: true,
  },
];

const benefits = [
  {
    icon: BarChart3,
    title: "Аналітика & моніторинг",
    text: "Ведіть зручний облік параметрів води. Динамічні графіки та розумні підказки допоможуть підтримувати ідеальний біобаланс.",
  },
  {
    icon: Layers3,
    title: "Прісноводні екосистеми",
    text: "Створюйте профілі ваших акваріумів. Усе обладнання, розрахунки, мешканці та завдання зібрані у зручних картках.",
  },
  {
    icon: Cloud,
    title: "Доступ з будь-якого пристрою",
    text: "Адаптивна веб-платформа працює прямо в браузері. Ваші дані надійно зберігаються у хмарі та завжди під рукою.",
  },
];

const avatars = [
  { top: "18%", left: "13%", size: 48 },
  { top: "39%", left: "7%", size: 50 },
  { top: "63%", left: "16%", size: 57 },
  { top: "24%", left: "25%", size: 58 },
  { top: "72%", left: "29%", size: 58 },
  { top: "17%", right: "14%", size: 55 },
  { top: "38%", right: "7%", size: 56 },
  { top: "63%", right: "17%", size: 58 },
  { top: "29%", right: "27%", size: 54 },
];

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 26,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.75,
      ease: "easeOut",
    },
  },
};

const fadeSide = (direction = "left") => ({
  hidden: {
    opacity: 0,
    x: direction === "left" ? -35 : 35,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
});

function getAccessToken() {
  if (typeof window === "undefined") return null;

  return (
    localStorage.getItem("access_token") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("token")
  );
}

function ProtectedLandingButton({
  href,
  children,
  className,
  withArrow = false,
}) {
  const router = useRouter();

  const handleClick = () => {
    const token = getAccessToken();

    if (!token) {
      router.push("/registration");
      return;
    }

    router.push(href);
  };

  return (
    <button type="button" onClick={handleClick} className={className}>
      {children}
      {withArrow && <ArrowRight size={17} />}
    </button>
  );
}

function LandingHeader() {
  return (
    <header className="h-[76px] bg-[#fefefe] px-[30px] grid grid-cols-[180px_1fr_230px] items-center max-lg:h-auto max-lg:grid-cols-[120px_1fr] max-lg:gap-[18px] max-lg:px-5 max-lg:py-5 max-md:flex max-md:flex-col">
      <Link href="/" className="inline-flex w-fit items-center" aria-label="AquaCore">
        <img
          src="/images/Logo.svg"
          alt="AquaCore"
          className="block w-[58px] h-auto"
        />
      </Link>

      <nav className="flex items-center justify-center gap-[78px] text-md font-medium text-[#1e2230] max-lg:order-3 max-lg:col-span-2 max-lg:flex-wrap max-lg:gap-7 max-md:gap-[18px] max-md:text-xs">
        <a href="#about" className="transition-colors duration-300 hover:text-[#7957ff]">
          Чому саме <span className="text-[#7957ff]">AquaCore</span>
        </a>

        <a href="/reviews" className="transition-colors duration-300 hover:text-[#7957ff]">
          Відгуки
        </a>

        <Link
          href="/calculators"
          className="transition-colors duration-300 hover:text-[#7957ff]"
        >
          Калькулятори
        </Link>
      </nav>

      <div className="flex items-center justify-end gap-[34px] max-lg:gap-[18px] max-md:w-full max-md:justify-center">
        <Link
          href="/signIn"
          className="text-md text-[#141720] underline underline-offset-4"
        >
          Увійти
        </Link>

        <ProtectedLandingButton
          href="/aquariums"
          className="inline-flex h-[38px] min-w-[145px] items-center justify-center rounded-lg bg-gradient-to-r from-[#7957ff] to-[#af35ff] text-md font-semibold text-white shadow-[0_13px_30px_rgba(121,87,255,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(121,87,255,0.3)]"
        >
          Почати зараз
        </ProtectedLandingButton>
      </div>
    </header>
  );
}

function HeroSection() {
  return (
    <section className="min-h-[655px] bg-white px-5 pt-[78px] pb-[42px] flex flex-col items-center text-center max-md:min-h-0 max-md:pt-12">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
      >
        <h1 className="m-0 text-[#171b24] text-[clamp(38px,4.3vw,58px)] leading-[1.08] font-light tracking-[0.02em]">
          Створюй, контролюй, надихай!
        </h1>

        <p className="mx-auto mt-3 w-[min(620px,92vw)] text-xs leading-[1.45] font-normal text-[#9aa0ad]">
          Професійний помічник для керування вашими екосистемами.
          Ведіть облік параметрів, плануйте догляд, використовуйте розумні
          калькулятори та обмінюйтеся досвідом у спільноті однодумців.
        </p>
      </motion.div>

      <motion.div
        className="mt-[52px] w-[min(820px,92vw)] drop-shadow-[0_30px_45px_rgba(17,24,39,0.13)]"
        initial={{
          opacity: 0,
          y: 35,
          scale: 0.96,
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        transition={{
          duration: 0.9,
          ease: "easeOut",
          delay: 0.15,
        }}
      >
        <img
          src="/images/landing/devices.png"
          alt="AquaCore на різних пристроях"
          className="block w-full h-auto"
        />
      </motion.div>
    </section>
  );
}

function BenefitsSection() {
  return (
    <section id="about" className="bg-[#121b2b] px-5 pt-[70px] pb-[76px]">
      <div className="mx-auto grid w-[min(1080px,92vw)] grid-cols-3 gap-[120px] max-lg:gap-[42px] max-md:grid-cols-1 max-md:gap-[50px]">
        {benefits.map((item, index) => {
          const Icon = item.icon;

          return (
            <motion.article
              key={item.title}
              className="text-center text-white"
              initial="hidden"
              whileInView="visible"
              viewport={{
                once: true,
                amount: 0.35,
              }}
              variants={fadeUp}
              transition={{
                delay: index * 0.1,
              }}
            >
              <div className="mb-[18px] flex h-[70px] items-center justify-center text-[#f2f5fb]">
                <Icon size={52} strokeWidth={1.2} />
              </div>

              <h3 className="mb-[21px] text-[11px] font-semibold uppercase tracking-[0.22em] text-[#f3f6fb]">
                {item.title}
              </h3>

              <p className="m-0 text-left text-xs leading-[1.9] text-[#8791a3] max-md:text-center">
                {item.text}
              </p>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}

function FeatureSection({ feature }) {
  return (
    <section
      className={`mx-auto grid min-h-[545px] w-[min(1210px,92vw)] items-center gap-[54px] py-8 max-lg:min-h-0 max-lg:grid-cols-1 max-lg:gap-[22px] max-lg:py-[60px] max-md:w-[min(calc(100%-32px),560px)] max-md:py-12 ${
        feature.reverse
          ? "grid-cols-[1.18fr_0.82fr]"
          : "grid-cols-[0.82fr_1.18fr]"
      }`}
    >
      <motion.div
        className={`max-w-[385px] max-lg:mx-auto max-lg:max-w-full max-lg:text-center ${
          feature.reverse ? "order-2 pl-5 max-lg:order-none max-lg:pl-0" : ""
        }`}
        initial="hidden"
        whileInView="visible"
        viewport={{
          once: true,
          amount: 0.35,
        }}
        variants={fadeSide(feature.reverse ? "right" : "left")}
      >
        <h2 className="m-0 mb-3.5 text-[clamp(26px,2.2vw,34px)] font-light leading-[1.2] tracking-[0.03em] text-[#3a3d46]">
          {feature.title}
        </h2>

        <p className="mb-4 max-w-[365px] text-xs leading-[1.65] text-[#858c9b] max-lg:mx-auto">
          {feature.text}
        </p>

        <ProtectedLandingButton
          href={feature.href}
          className="inline-flex h-8 w-[238px] items-center justify-center rounded-[7px] bg-gradient-to-r from-[#7957ff] to-[#af35ff] text-[10px] font-semibold uppercase tracking-[0.04em] text-white shadow-[0_13px_30px_rgba(121,87,255,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(121,87,255,0.3)] max-md:w-[220px]"
        >
          {feature.button}
        </ProtectedLandingButton>
      </motion.div>

      <motion.div
        className={`${feature.reverse ? "order-1 max-lg:order-none" : ""}`}
        initial="hidden"
        whileInView="visible"
        viewport={{
          once: true,
          amount: 0.25,
        }}
        variants={fadeSide(feature.reverse ? "left" : "right")}
      >
        <img
          src={feature.image}
          alt={feature.title}
          className="block w-full h-auto drop-shadow-[0_22px_35px_rgba(17,24,39,0.13)]"
        />
      </motion.div>
    </section>
  );
}

function CommunitySection() {
  return (
    <section className="relative flex min-h-[372px] items-center justify-center bg-white px-5 py-11 text-center max-md:min-h-[430px]">
      {avatars.map((avatar, index) => (
        <motion.div
          key={index}
          className="absolute z-[1] overflow-hidden rounded-full bg-[#f1f4f9] shadow-[0_14px_30px_rgba(17,24,39,0.14)] max-md:opacity-45"
          style={{
            top: avatar.top,
            left: avatar.left,
            right: avatar.right,
            width: avatar.size,
            height: avatar.size,
          }}
          initial={{
            opacity: 0,
            scale: 0.8,
          }}
          whileInView={{
            opacity: 1,
            scale: 1,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            delay: index * 0.05,
            duration: 0.45,
          }}
        >
          <img
            src="/images/Avatar.png"
            alt="Учасник спільноти AquaCore"
            className="block h-full w-full object-cover"
          />
        </motion.div>
      ))}

      <motion.div
        className="relative z-[2] mx-auto w-[min(650px,92vw)]"
        initial="hidden"
        whileInView="visible"
        viewport={{
          once: true,
          amount: 0.45,
        }}
        variants={fadeUp}
      >
        <h2 className="m-0 text-[clamp(34px,4vw,50px)] font-medium leading-[1.08] tracking-[0.01em] text-[#171b24]">
          Готові приєднатися до спільноти?
        </h2>

        <p className="mx-auto mt-[22px] mb-6 w-[min(500px,92vw)] text-sm leading-[1.55] text-[#5d6371]">
          Сотні акваріумістів вже відмовилися від паперових щоденників.
          Реєструйтеся, щоб вести облік показників води, користуватися
          калькуляторами та ділитися досвідом.
        </p>

        <ProtectedLandingButton
          href="/aquariums"
          withArrow
          className="inline-flex h-11 min-w-[270px] items-center justify-center gap-2 rounded-[7px] bg-gradient-to-r from-[#7957ff] to-[#af35ff] text-xs font-semibold text-white shadow-[0_13px_30px_rgba(121,87,255,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(121,87,255,0.3)]"
        >
          Зареєструватися безкоштовно
        </ProtectedLandingButton>
      </motion.div>
    </section>
  );
}

function LandingFooter() {
  return (
    <footer className="bg-[#121b2b] text-[#758095]">
      <div className="flex h-24 items-center justify-center gap-8 text-[9px] uppercase tracking-[0.22em]">
        <a href="#" className="text-[#7d8798] transition-colors duration-300 hover:text-white">
          Instagram
        </a>

        <span className="h-[18px] w-px bg-white/15" />

        <a href="#" className="text-[#7d8798] transition-colors duration-300 hover:text-white">
          Twitter
        </a>
      </div>

      <div className="flex h-[50px] items-center justify-between bg-[#202020] px-[300px] text-[9px] uppercase tracking-[0.08em] max-lg:px-10 max-md:h-auto max-md:flex-col max-md:gap-2.5 max-md:px-5 max-md:py-[18px]">
        <p className="m-0">© 2026 AquaCore. Всі права захищені.</p>

        <a href="#top" className="text-[#7d8798] transition-colors duration-300 hover:text-white">
          До гори ↑
        </a>
      </div>
    </footer>
  );
}

export function Landing() {
  return (
    <main
      id="top"
      className="mx-auto min-h-screen w-[100%] overflow-hidden bg-white text-[#252932]"
    >
      <LandingHeader />
      <HeroSection />
      <BenefitsSection />

      <div id="species" className="bg-white">
        {features.map((feature) => (
          <FeatureSection key={feature.title} feature={feature} />
        ))}
      </div>

      <CommunitySection />
      <LandingFooter />
    </main>
  );
}