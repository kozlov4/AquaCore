"use client";

import Link from "next/link";

export function AuthRedirectText({ isLogin }) {
  return (
    <div
      className="
        mt-6 flex flex-wrap items-center justify-center gap-1
        text-center text-sm text-gray-500
      "
    >
      <span>
        {isLogin ? "Немає облікового запису?" : "У вас є обліковий запис?"}
      </span>

      <Link
        href={isLogin ? "/registration" : "/signIn"}
        className="
          font-semibold text-[#D688B7]
          transition-all duration-300 hover:text-[#b85f95] hover:underline
        "
      >
        {isLogin ? "Реєстрація" : "Увійти"}
      </Link>
    </div>
  );
}