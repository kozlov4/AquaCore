"use client";

export function LandingFooter() {
  return (
    <footer className="bg-[#101724]">
      <div className="mx-auto flex w-[100%] items-center justify-center gap-10 px-6 py-10 text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
        <a className="transition hover:text-white" href="#">
          AquaCore
        </a>
        <a className="transition hover:text-white" href="#">
          Privacy
        </a>
        <a className="transition hover:text-white" href="#">
          Terms
        </a>
      </div>

      <div className="border-t border-white/5 py-5 text-center text-xs text-white/25">
        © 2026 AquaCore. Всі права захищені.
      </div>
    </footer>
  );
}