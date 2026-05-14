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
        staggerChildren: 0.12,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await auth.handleSubmitAuth(isLogin);
  };

  return (
    <>
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="
          relative min-h-screen w-full overflow-x-hidden
          bg-gradient-to-br from-white via-[#FFF7FB] to-[#F2FAFF]
          flex flex-col lg:flex-row
        "
      >
        <div
          className="
            pointer-events-none absolute inset-x-0 top-0 h-[240px]
            bg-[url('/images/fish.png')] bg-cover bg-center opacity-20
            lg:hidden
          "
        />

        <motion.section
          initial={{ x: -60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="
            relative z-10 flex min-h-screen w-full flex-col
            px-5 py-4
            sm:px-8
            lg:w-1/2 lg:px-0 lg:py-0
          "
        >
          <AuthLogo />

          <motion.div
            variants={container}
            initial="hidden"
            animate="visible"
            className="
              flex flex-1 items-center justify-center
              py-6
              lg:items-start lg:justify-start lg:px-[20%] lg:py-[10%]
            "
          >
            <div
              className="
                w-full max-w-[430px]
                rounded-[28px] border border-white/70
                bg-white/80 px-5 py-7 shadow-2xl shadow-[#D688B7]/10
                backdrop-blur-xl
                sm:px-7 sm:py-8
                lg:max-w-none lg:rounded-none lg:border-0 lg:bg-transparent
                lg:px-0 lg:py-0 lg:shadow-none lg:backdrop-blur-0
              "
            >
              <AuthHeader isLogin={isLogin} item={item} />

              <motion.form
                variants={container}
                onSubmit={handleSubmit}
                className={`
                  w-full
                  ${
                    isLogin
                      ? "pt-7 sm:pt-8 lg:pt-[10%]"
                      : "pt-8 sm:pt-10 lg:pt-[15%]"
                  }
                `}
              >
                {!isLogin && (
                  <motion.div variants={item}>
                    <AuthInput
                      label="Імʼя"
                      placeholder="Введіть своє ім'я"
                      value={auth.name}
                      onChange={(e) => auth.setName(e.target.value)}
                    />
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
                    value={auth.password}
                    onChange={(e) => auth.setPassword(e.target.value)}
                  >
                    {isLogin && (
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.04, x: 2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={auth.openForgotModal}
                        className="
                          cursor-pointer text-xs font-semibold text-[#D688B7]
                          transition-colors duration-300 hover:text-[#b85f95]
                          sm:text-sm
                        "
                      >
                        Забули пароль
                      </motion.button>
                    )}
                  </AuthInput>
                </motion.div>

                {auth.authError && (
                  <motion.p
                    variants={item}
                    className="
                      mb-4 rounded-xl border border-red-100
                      bg-red-50 px-4 py-3
                      text-sm font-semibold text-red-500
                    "
                  >
                    {auth.authError}
                  </motion.p>
                )}

                <AuthCheckbox isLogin={isLogin} item={item} />

                <AuthSubmitButton
                  isLogin={isLogin}
                  isLoading={auth.isLoading}
                />

                <AuthDivider item={item} />

                <motion.div
                  variants={item}
                  className="flex flex-col items-center justify-center"
                >
                  <GoogleAuthButton />
                  <AuthRedirectText isLogin={isLogin} />
                </motion.div>
              </motion.form>
            </div>
          </motion.div>
        </motion.section>

        <motion.section
          initial={{ x: 80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="
            hidden min-h-screen w-1/2 bg-[url('/images/fish.png')]
            bg-cover bg-center transition-transform duration-700
            hover:scale-[1.02]
            lg:block
          "
        />
      </motion.main>

      <AuthModals {...auth} />
    </>
  );
}