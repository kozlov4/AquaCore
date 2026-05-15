"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { googleCallbackLogin } from "../../services/authApi";

export default function GoogleCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  useEffect(() => {
    const finishGoogleLogin = async () => {
      try {
        if (!router.isReady) return;

        const { code } = router.query;

        if (!code) {
          setError("Google code відсутній");
          return;
        }

        await googleCallbackLogin(code);

        router.push("/dashboard");
      } catch (error) {
        setError(error.message || "Помилка Google авторизації");
      }
    };

    finishGoogleLogin();
  }, [router.isReady, router.query, router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F8FAFF] px-4">
      <div className="w-full max-w-[420px] rounded-3xl bg-white p-8 text-center shadow-xl">
        {!error ? (
          <>
            <h1 className="text-2xl font-black text-slate-950">
              Авторизація через Google
            </h1>

            <p className="mt-3 text-sm text-slate-500">
              Зачекайте, ми завершуємо вхід...
            </p>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-black text-red-500">
              Помилка входу
            </h1>

            <p className="mt-3 text-sm text-slate-500">{error}</p>

            <button
              type="button"
              onClick={() => router.push("/signIn")}
              className="mt-6 rounded-xl bg-[#635BFF] px-6 py-3 text-sm font-black text-white"
            >
              Повернутись до входу
            </button>
          </>
        )}
      </div>
    </main>
  );
}