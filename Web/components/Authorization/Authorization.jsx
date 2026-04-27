"use client";

import Image from "next/image";
import { Gooogle } from "../../layouts/icons/google";
import { motion } from "framer-motion";
import { AuthModals } from "./AuthModals";
import { useAuthModals } from "../../hooks/useAuthModals";

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
      transition: { duration: 0.4 },
    },
  };

  return (
    <>
      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-screen h-full flex"
      >
        <motion.div
          initial={{ x: -80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="w-1/2 h-[90%]"
        >
          <motion.div
            id="logo"
            className="w-full h-[10%] mt-3 pl-3"
            whileHover={{ scale: 1.05 }}
          >
            <Image
              src="/images/Logo.svg"
              alt="fish"
              width={0}
              height={0}
              className="w-20 h-auto"
            />
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            animate="visible"
            className="w-full h-[90%] px-[20%] py-[10%]"
          >
            <motion.h1
              variants={item}
              className="text-black font-medium text-3xl"
            >
              {isLogin ? "З поверненням!" : "Почніть зараз"}
            </motion.h1>

            <motion.h3
              variants={item}
              className={`text-black text-base ${isLogin ? "block" : "hidden"}`}
            >
              Введіть свої облікові дані, щоб увійти
            </motion.h3>

            <motion.form
              variants={container}
              className={`w-full h-full ${isLogin ? "pt-[10%]" : "pt-[15%]"}`}
            >
              {!isLogin && (
                <motion.div variants={item}>
                  <label className="text-black font-medium text-lg">Ім'я</label>
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    type="text"
                    placeholder="Введіть своє ім'я"
                    className="w-full mb-[5%] p-2 rounded-[10px] border"
                  />
                </motion.div>
              )}

              <motion.div variants={item}>
                <label className="text-black font-medium text-lg">Email</label>
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  type="text"
                  placeholder="Введіть email"
                  value={auth.email}
                  onChange={(e) => auth.setEmail(e.target.value)}
                  className="w-full mb-[5%] p-2 rounded-[10px] border"
                />
              </motion.div>

              <motion.div variants={item}>
                <div className="flex justify-between">
                  <label className="text-black font-medium text-lg">
                    Пароль
                  </label>

                  {isLogin && (
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      onClick={auth.openForgotModal}
                      className="text-xs text-blue-600 cursor-pointer"
                    >
                      Забули пароль
                    </motion.button>
                  )}
                </div>

                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  type="password"
                  placeholder="Пароль"
                  className="w-full mb-[5%] p-2 rounded-[10px] border"
                />
              </motion.div>

              <motion.div variants={item} className="flex gap-2 items-center">
                <motion.input
                  whileTap={{ scale: 0.9 }}
                  type="checkbox"
                  className="w-5 h-5"
                />
                <span className="text-xs underline">
                  {isLogin
                    ? "Запам'ятати на 30 днів"
                    : "Я погоджуюся з умовами"}
                </span>
              </motion.div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full mt-[5%] py-2 rounded-[10px] cursor-pointer bg-[#D688B7] text-white font-bold"
              >
                {isLogin ? "Увійти" : "Реєстрація"}
              </motion.button>

              <motion.div
                variants={item}
                className="flex items-center my-[10%]"
              >
                <div className="flex-1 h-[1px] bg-gray-200" />
                <span className="px-2 text-xs">Або</span>
                <div className="flex-1 h-[1px] bg-gray-200" />
              </motion.div>

              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full flex justify-center gap-2 p-2 border rounded-[10px] cursor-pointer"
              >
                <Gooogle />
                Google
              </motion.button>
            </motion.form>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ x: 80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="w-1/2 h-100% bg-[url('/images/fish.png')] bg-cover bg-center"
        />
      </motion.header>

      <AuthModals {...auth} />
    </>
  );
}