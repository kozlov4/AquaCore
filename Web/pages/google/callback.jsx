"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Loader2 } from "lucide-react";
import { googleCallbackLogin } from "../../services/authApi";

export default function GoogleCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  useEffect(() => {
    async function finishGoogleLogin() {
      try {
        if (!router.isReady) return;

        const { code, error: googleError } = router.query;

        if (googleError) {
          setError(String(googleError));
          return;
        }

        if (!code) {
          setError("Google code відсутній");
          return;
        }

        await googleCallbackLogin(code);

        router.replace("/dashboard");
      } catch (error) {
        setError(error.message || "Помилка Google авторизації");
      }
    }

    finishGoogleLogin();
  }, [router.isReady, router.query, router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f8fafc] px-4">
      <section className="w-full max-w-[430px] rounded-3xl border border-slate-100 bg-white p-8 text-center shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
        {!error ? (
          <>
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f3f0ff] text-[#635BFF]">
              <Loader2 size={30} className="animate-spin" />
            </div>

            <h1 className="text-[24px] font-black text-slate-950">
              Авторизація через Google
            </h1>

            <p className="mt-3 text-sm font-semibold leading-6 text-slate-500">
              Зачекайте, ми завершуємо вхід у ваш акаунт AquaCore...
            </p>
          </>
        ) : (
          <>
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
              !
            </div>

            <h1 className="text-[24px] font-black text-slate-950">
              Помилка входу
            </h1>

            <p className="mt-3 text-sm font-semibold leading-6 text-red-500">
              {error}
            </p>

            <button
              type="button"
              onClick={() => router.push("/signIn")}
              className="mt-6 h-11 rounded-xl bg-[#635BFF] px-6 text-sm font-black text-white transition hover:bg-[#5147f5]"
            >
              Повернутись до входу
            </button>
          </>
        )}
      </section>
    </main>
  );
}