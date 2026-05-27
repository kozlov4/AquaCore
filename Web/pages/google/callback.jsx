"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";

function saveGoogleTokensFromQuery(query) {
  const accessToken =
    query.access_token || query.accessToken || query.token || query.access;

  const refreshToken =
    query.refresh_token || query.refreshToken || query.refresh;

  const tokenType = query.token_type || query.tokenType || "Bearer";

  if (!accessToken) {
    throw new Error("Access token відсутній");
  }

  localStorage.setItem("access_token", String(accessToken));
  localStorage.setItem("accessToken", String(accessToken));
  localStorage.setItem("token", String(accessToken));
  localStorage.setItem("token_type", String(tokenType));

  if (refreshToken) {
    localStorage.setItem("refresh_token", String(refreshToken));
    localStorage.setItem("refreshToken", String(refreshToken));
  }

  if (query.email) {
    localStorage.setItem("user_email", String(query.email));
  }

  if (query.name) {
    localStorage.setItem("user_name", String(query.name));
  }

  if (query.nickname) {
    localStorage.setItem("user_nickname", String(query.nickname));
  }
}

export default function GoogleCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  useEffect(() => {
    if (!router.isReady) return;

    try {
      const { error: googleError } = router.query;

      if (googleError) {
        setError(String(googleError));
        return;
      }

      saveGoogleTokensFromQuery(router.query);

      router.replace("/dashboard");
    } catch (error) {
      setError(error.message || "Помилка Google авторизації");
    }
  }, [router.isReady, router.query, router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f8f9ff] px-4">
      <section className="w-full max-w-[460px] rounded-[28px] bg-white px-8 py-10 text-center shadow-[0_24px_80px_rgba(15,23,42,0.12)]">
        {!error ? (
          <>
            <div className="mx-auto mb-5 h-12 w-12 animate-spin rounded-full border-4 border-[#e5e7eb] border-t-[#635BFF]" />

            <h1 className="text-2xl font-black text-[#111827]">
              Авторизація через Google
            </h1>

            <p className="mt-3 text-sm text-[#6b7280]">
              Зачекайте, ми завершуємо вхід у ваш акаунт...
            </p>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-black text-[#111827]">
              Помилка входу
            </h1>

            <p className="mt-3 text-sm text-[#dc2626]">{error}</p>

            <button
              type="button"
              onClick={() => router.push("/signIn")}
              className="mt-6 rounded-xl bg-[#635BFF] px-6 py-3 text-sm font-black text-white transition hover:bg-[#5148e8]"
            >
              Повернутись до входу
            </button>
          </>
        )}
      </section>
    </main>
  );
}