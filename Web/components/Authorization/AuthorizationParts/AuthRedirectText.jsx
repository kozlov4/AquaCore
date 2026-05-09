"use client";

import Link from "next/link";

export function AuthRedirectText({ isLogin }) {
  return (
    <div className="mt-6 text-sm text-gray-500 flex items-center gap-1">
      <span>
        {isLogin ? "Немає облікового запису?" : "У вас є обліковий запис?"}
      </span>

      <Link
        href={isLogin ? "/registration" : "/signIn"}
        className="text-[#D688B7] font-semibold transition-all duration-300 hover:text-[#b85f95] hover:underline"
      >
        {isLogin ? "Реєстрація" : "Увійти"}
      </Link>
    </div>
  );
}