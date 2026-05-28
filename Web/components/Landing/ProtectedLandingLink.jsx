"use client";

import { useRouter } from "next/router";
import { motion } from "framer-motion";

function getAccessToken() {
  if (typeof window === "undefined") return null;

  return (
    localStorage.getItem("access_token") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("token")
  );
}

export function ProtectedLandingLink({
  href = "/aquariums",
  children,
  className = "",
  motionProps = {},
}) {
  const router = useRouter();

  const handleClick = (event) => {
    event.preventDefault();

    const token = getAccessToken();

    if (!token) {
      router.push("/registration");
      return;
    }

    router.push(href);
  };

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      className={className}
      {...motionProps}
    >
      {children}
    </motion.button>
  );
}