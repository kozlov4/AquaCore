"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";

function saveAuthTokens(data) {
  const accessToken =
    data?.access_token || data?.accessToken || data?.token || data?.access;

  const refreshToken =
    data?.refresh_token || data?.refreshToken || data?.refresh;

  const tokenType = data?.token_type || data?.tokenType || "Bearer";

  if (!accessToken) {
    throw new Error("Backend не повернув access_token");
  }

  localStorage.setItem("access_token", accessToken);
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("token", accessToken);
  localStorage.setItem("token_type", tokenType);

  if (refreshToken) {
    localStorage.setItem("refresh_token", refreshToken);
    localStorage.setItem("refreshToken", refreshToken);
  }

  if (data?.email) {
    localStorage.setItem("user_email", data.email);
  }

  if (data?.name) {
    localStorage.setItem("user_name", data.name);
  }

  if (data?.nickname) {
    localStorage.setItem("user_nickname", data.nickname);
  }
}

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

        const response = await fetch(
          `/api/google/callback?code=${encodeURIComponent(String(code))}`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
            },
          }
        );

        const data = await response.json().catch(() => null);

        if (!response.ok) {
          throw new Error(
            data?.message ||
              data?.detail?.[0]?.msg ||
              data?.detail ||
              "Не вдалося завершити Google авторизацію"
          );
        }

        saveAuthTokens(data);

        router.replace("/aquariums");
      } catch (error) {
        setError(error.message || "Помилка Google авторизації");
      }
    }

    finishGoogleLogin();
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
              Зачекайте, виконується вхід у ваш акаунт...
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