"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { googleCallbackLogin, saveAuthTokens } from "../../services/authApi";

function readTokensFromQuery(query) {
  const accessToken =
    query.access_token || query.accessToken || query.token || query.access;

  if (!accessToken) return null;

  return {
    access_token: String(accessToken),
    refresh_token: query.refresh_token
      ? String(query.refresh_token)
      : query.refreshToken
        ? String(query.refreshToken)
        : "",
    token_type: query.token_type
      ? String(query.token_type)
      : query.tokenType
        ? String(query.tokenType)
        : "Bearer",
  };
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

        const tokensFromQuery = readTokensFromQuery(router.query);

        if (tokensFromQuery) {
          saveAuthTokens(tokensFromQuery);
          router.replace("/aquariums");
          return;
        }

        if (!code) {
          setError("Google code або access_token відсутній");
          return;
        }

        await googleCallbackLogin(code);

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

            <p className="mt-3 break-words text-sm text-[#dc2626]">{error}</p>

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