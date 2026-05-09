"use client";

import { motion } from "framer-motion";
import { AuthModals } from "./AuthModals";
import { useAuthModals } from "../../hooks/useAuthModals";

import { AuthLogo } from "./AuthorizationParts/AuthLogo";
import { AuthHeader } from "./AuthorizationParts/AuthHeader";
import { AuthInput } from "./AuthorizationParts/AuthInput";
import { AuthCheckbox } from "./AuthorizationParts/AuthCheckbox";
import { AuthSubmitButton } from "./AuthorizationParts/AuthSubmitButton";
import { AuthDivider } from "./AuthorizationParts/AuthDivider";
import { GoogleAuthButton } from "./AuthorizationParts/GoogleAuthButton";
import { AuthRedirectText } from "./AuthorizationParts/AuthRedirectText";

export function Authorization({ type }) {
  const isLogin = type === "login";
  const auth = useAuthModals();

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  return (
    <>
      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-screen h-full flex bg-gradient-to-br from-white via-[#FFF7FB] to-[#F2FAFF]"
      >
        <motion.div
          initial={{ x: -80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-1/2 h-[90%]"
        >
          <AuthLogo />

          <motion.div
            variants={container}
            initial="hidden"
            animate="visible"
            className="w-full h-[90%] px-[20%] py-[10%]"
          >
            <AuthHeader isLogin={isLogin} item={item} />

            <motion.form
              variants={container}
              className={`w-full h-full ${
                isLogin ? "pt-[10%]" : "pt-[15%]"
              }`}
            >
              {!isLogin && (
                <motion.div variants={item}>
                  <AuthInput label="Імʼя" placeholder="Введіть своє ім'я" />
                </motion.div>
              )}

              <motion.div variants={item}>
                <AuthInput
                  label="Email"
                  type="email"
                  placeholder="Введіть email"
                  value={auth.email}
                  onChange={(e) => auth.setEmail(e.target.value)}
                />
              </motion.div>

              <motion.div variants={item}>
                <AuthInput
                  label="Пароль"
                  type="password"
                  placeholder="Пароль"
                >
                  {isLogin && (
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.05, x: 2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={auth.openForgotModal}
                      className="text-xs text-[#D688B7] font-semibold cursor-pointer transition-colors duration-300 hover:text-[#b85f95]"
                    >
                      Забули пароль
                    </motion.button>
                  )}
                </AuthInput>
              </motion.div>

              <AuthCheckbox isLogin={isLogin} item={item} />

              <AuthSubmitButton isLogin={isLogin} />

              <AuthDivider item={item} />

              <motion.div
                variants={item}
                className="flex flex-col items-center justify-center"
              >
                <GoogleAuthButton />
                <AuthRedirectText isLogin={isLogin} />
              </motion.div>
            </motion.form>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ x: 80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-1/2 h-100% bg-[url('/images/fish.png')] bg-cover bg-center transition-transform duration-700 hover:scale-[1.02]"
        />
      </motion.header>

      <AuthModals {...auth} />
    </>
  );
}