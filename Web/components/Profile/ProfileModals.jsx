"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2, ease: "easeOut" } },
  exit: { opacity: 0, transition: { duration: 0.18, ease: "easeIn" } },
};

const modalVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.28,
      ease: [0.22, 1, 0.36, 1],
      when: "beforeChildren",
      staggerChildren: 0.04,
    },
  },
  exit: {
    opacity: 0,
    y: 18,
    scale: 0.985,
    transition: { duration: 0.2, ease: "easeIn" },
  },
};

const contentVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.22, ease: "easeOut" },
  },
};

const primaryButtonMotion = {
  whileHover: {
    y: -1,
    boxShadow: "0px 10px 24px rgba(33,150,243,0.22)",
  },
  whileTap: { scale: 0.98 },
  transition: { type: "spring", stiffness: 320, damping: 22 },
};

const secondaryButtonMotion = {
  whileHover: { y: -1, backgroundColor: "rgba(249,250,251,1)" },
  whileTap: { scale: 0.985 },
  transition: { type: "spring", stiffness: 320, damping: 22 },
};

const textButtonMotion = {
  whileHover: { x: 2 },
  whileTap: { scale: 0.985 },
  transition: { type: "spring", stiffness: 320, damping: 24 },
};

export function ProfileModals({
  isUnfollowOpen,
  isReportOpen,
  isEditProfileOpen,
  isChangePasswordOpen,
  isChangeEmailOpen,

  reportText,
  setReportText,

  profileName,
  setProfileName,
  profileNickname,
  setProfileNickname,
  profileBio,
  setProfileBio,

  oldPassword,
  setOldPassword,
  newPassword,
  setNewPassword,
  repeatNewPassword,
  setRepeatNewPassword,

  newEmail,
  setNewEmail,

  handleCloseReport,
  handleCloseUnfollow,
  handleSendReport,
  handleConfirmUnfollow,
  handleCloseEditProfile,
  handleSaveProfile,
  handleOpenChangePassword,
  handleCloseChangePassword,
  handleSavePassword,
  handleOpenChangeEmail,
  handleCloseChangeEmail,
  handleSaveEmail,
  isChangeEmailSuccessOpen,
  handleCloseChangeEmailSuccess,
  handleBackToChangeEmail,
  isVerifyEmailOpen,
  emailCode,
  handleCodeChange,
  handleCodeKeyDown,
  handleVerifyEmail,
  isEmailChangedSuccessOpen,
  handleCloseEmailChangedSuccess,
  profileAvatar,
  handleChangeProfilePhoto,
}) {
  return (
    <>
      <AnimatePresence>
        {isUnfollowOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/40"
              onClick={handleCloseUnfollow}
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            />

            <motion.div
              className="fixed left-1/2 top-1/2 z-50 w-[440px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[30px] bg-white shadow-xl"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <motion.div
                variants={contentVariants}
                className="flex flex-col items-center px-6 py-6"
              >
                <div className="relative mb-6 h-[74px] w-[74px] overflow-hidden rounded-full">
                  <Image
                    src="/images/Avatar.png"
                    alt="avatar"
                    fill
                    className="object-cover"
                  />
                </div>

                <p className="text-center text-xl text-gray-800">
                  Відписатись від{" "}
                  <span className="font-medium">@denys_kukulenko</span>?
                </p>
              </motion.div>

              <div className="border-t border-gray-300">
                <motion.button
                  type="button"
                  className="w-full cursor-pointer py-4 text-xl font-medium text-[#FF6B81] hover:bg-gray-50"
                  onClick={handleConfirmUnfollow}
                  {...secondaryButtonMotion}
                >
                  Відписатися
                </motion.button>

                <motion.button
                  type="button"
                  className="w-full cursor-pointer border-t border-gray-300 py-4 text-xl text-gray-700 hover:bg-gray-50"
                  onClick={handleCloseUnfollow}
                  {...secondaryButtonMotion}
                >
                  Скасувати
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isReportOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/40"
              onClick={handleCloseReport}
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            />

            <motion.div
              className="fixed left-1/2 top-1/2 z-50 h-[520px] w-[660px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[30px] bg-white shadow-xl"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <motion.div
                variants={contentVariants}
                className="flex flex-col items-center px-6 py-6"
              >
                <div className="relative mb-5 h-[74px] w-[74px] overflow-hidden rounded-full">
                  <Image
                    src="/images/Avatar.png"
                    alt="avatar"
                    fill
                    className="object-cover"
                  />
                </div>

                <p className="text-center text-[24px] text-gray-800">
                  Користувач{" "}
                  <span className="font-medium">@denys_kukulenko</span>
                </p>
              </motion.div>

              <div className="border-t border-gray-300">
                <motion.textarea
                  value={reportText}
                  onChange={(e) => setReportText(e.target.value)}
                  placeholder="Напишіть відгук про користувача ..."
                  whileFocus={{
                    boxShadow: "0 0 0 4px rgba(33,150,243,0.08)",
                  }}
                  className="h-[255px] w-full resize-none px-6 py-5 text-[18px] text-gray-700 outline-none placeholder:text-gray-400"
                />
              </div>

              <motion.div
                variants={contentVariants}
                className="absolute bottom-4 left-0 flex w-full items-center justify-between px-4"
              >
                <motion.button
                  type="button"
                  onClick={handleCloseReport}
                  className="rounded-full cursor-pointer border border-gray-300 px-6 py-2 text-[18px] font-medium text-[#FF6B81] hover:bg-gray-50"
                  {...secondaryButtonMotion}
                >
                  Скасувати
                </motion.button>

                <motion.button
                  type="button"
                  onClick={handleSendReport}
                  className="rounded-full border cursor-pointer border-gray-300 px-6 py-2 text-[18px] font-medium text-gray-700 hover:bg-gray-50"
                  {...secondaryButtonMotion}
                >
                  Відправити
                </motion.button>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isEditProfileOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/40"
              onClick={handleCloseEditProfile}
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            />

            <motion.div
              className="fixed left-1/2 top-1/2 z-50 w-[720px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[28px] bg-white shadow-xl"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="px-8 py-6">
                <motion.div
                  variants={contentVariants}
                  className="mb-6 flex items-start gap-4 border-b border-gray-200 pb-5"
                >
                  <div className="relative h-[54px] w-[54px] overflow-hidden rounded-full">
                    <Image
                      src={profileAvatar}
                      alt="avatar"
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div>
                    <p className="text-[18px] font-medium text-gray-900">
                      UPVOX
                    </p>

                    <motion.label
                      className="inline-block cursor-pointer text-[18px] font-semibold text-[#2196F3]"
                      {...textButtonMotion}
                    >
                      Змінити фото профілю
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleChangeProfilePhoto}
                        className="hidden"
                      />
                    </motion.label>
                  </div>
                </motion.div>

                <motion.div variants={contentVariants} className="space-y-8">
                  <div className="flex items-start gap-6">
                    <label className="w-[90px] pt-3 text-[20px] font-semibold text-gray-900">
                      Ім&apos;я
                    </label>

                    <div className="flex-1">
                      <motion.input
                        type="text"
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        whileFocus={{
                          boxShadow: "0 0 0 4px rgba(33,150,243,0.08)",
                        }}
                        className="w-full rounded border border-gray-300 px-4 py-3 text-[18px] outline-none"
                      />
                      <p className="mt-2 text-[14px] text-gray-400">
                        Як до вас звертатися у спільноті
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-6">
                    <label className="w-[90px] pt-3 text-[20px] font-semibold text-gray-900">
                      Нікнейм
                    </label>

                    <div className="flex-1">
                      <motion.input
                        type="text"
                        value={profileNickname}
                        onChange={(e) => setProfileNickname(e.target.value)}
                        whileFocus={{
                          boxShadow: "0 0 0 4px rgba(33,150,243,0.08)",
                        }}
                        className="w-full rounded border border-gray-300 px-4 py-3 text-[18px] outline-none"
                      />
                      <p className="mt-2 text-[14px] text-gray-400">
                        Унікальне ім&apos;я вашого профілю
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-6">
                    <label className="w-[90px] pt-3 text-[20px] font-semibold text-gray-900">
                      Про себе
                    </label>

                    <div className="flex-1">
                      <motion.textarea
                        value={profileBio}
                        onChange={(e) =>
                          setProfileBio(e.target.value.slice(0, 150))
                        }
                        whileFocus={{
                          boxShadow: "0 0 0 4px rgba(33,150,243,0.08)",
                        }}
                        className="h-[110px] w-full resize-none rounded border border-gray-300 px-4 py-3 text-[18px] outline-none"
                      />
                      <p className="mt-2 text-[14px] text-gray-400">
                        {profileBio.length} / 150
                      </p>
                      <p className="mt-3 text-[14px] text-gray-400">
                        Розкажіть про свій досвід в акваріумістиці. Максимум 150
                        символів.
                      </p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  variants={contentVariants}
                  className="mt-10 flex items-center justify-between"
                >
                  <motion.button
                    type="button"
                    onClick={handleCloseEditProfile}
                    className="cursor-pointer text-[20px] font-medium text-[#2196F3]"
                    {...textButtonMotion}
                  >
                    Скасувати
                  </motion.button>

                  <div className="flex items-center gap-8">
                    <motion.button
                      type="button"
                      onClick={handleOpenChangePassword}
                      className="cursor-pointer text-[20px] font-medium text-[#2196F3]"
                      {...textButtonMotion}
                    >
                      Змінити пароль
                    </motion.button>

                    <motion.button
                      type="button"
                      onClick={handleOpenChangeEmail}
                      className="cursor-pointer text-[20px] font-medium text-[#2196F3]"
                      {...textButtonMotion}
                    >
                      Змінити email
                    </motion.button>

                    <motion.button
                      type="button"
                      onClick={handleSaveProfile}
                      className="cursor-pointer rounded-xl bg-[#2196F3] px-6 py-3 text-[18px] font-semibold text-white"
                      {...primaryButtonMotion}
                    >
                      Підтвердити
                    </motion.button>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isChangePasswordOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/40"
              onClick={handleCloseChangePassword}
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            />

            <motion.div
              className="fixed left-1/2 top-1/2 z-50 w-[720px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[28px] bg-white shadow-xl"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="px-8 py-8">
                <motion.div variants={contentVariants} className="space-y-6">
                  <div className="flex items-center gap-6">
                    <label className="w-[180px] text-[20px] font-semibold text-gray-900">
                      Старий пароль
                    </label>
                    <motion.input
                      type="password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      whileFocus={{
                        boxShadow: "0 0 0 4px rgba(33,150,243,0.08)",
                      }}
                      className="w-full rounded border border-gray-300 px-4 py-3 text-[18px] outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-6">
                    <label className="w-[180px] text-[20px] font-semibold text-gray-900">
                      Новий пароль
                    </label>
                    <motion.input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      whileFocus={{
                        boxShadow: "0 0 0 4px rgba(33,150,243,0.08)",
                      }}
                      className="w-full rounded border border-gray-300 px-4 py-3 text-[18px] outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-6">
                    <label className="w-[180px] text-[20px] font-semibold text-gray-900">
                      Повторіть новий пароль
                    </label>
                    <motion.input
                      type="password"
                      value={repeatNewPassword}
                      onChange={(e) => setRepeatNewPassword(e.target.value)}
                      whileFocus={{
                        boxShadow: "0 0 0 4px rgba(33,150,243,0.08)",
                      }}
                      className="w-full rounded border border-gray-300 px-4 py-3 text-[18px] outline-none"
                    />
                  </div>
                </motion.div>

                <motion.div
                  variants={contentVariants}
                  className="mt-16 flex items-center justify-between"
                >
                  <motion.button
                    type="button"
                    onClick={handleCloseChangePassword}
                    className="cursor-pointer text-[20px] font-medium text-[#2196F3]"
                    {...textButtonMotion}
                  >
                    Скасувати
                  </motion.button>

                  <motion.button
                    type="button"
                    onClick={handleSavePassword}
                    className="cursor-pointer rounded-xl bg-[#2196F3] px-6 py-3 text-[18px] font-semibold text-white"
                    {...primaryButtonMotion}
                  >
                    Підтвердити
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isChangeEmailOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/40"
              onClick={handleCloseChangeEmail}
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            />

            <motion.div
              className="fixed left-1/2 top-1/2 z-50 w-[760px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[28px] bg-white shadow-xl"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="px-8 py-8">
                <motion.h2
                  variants={contentVariants}
                  className="text-center text-[32px] font-bold text-gray-900"
                >
                  Зміна електронної пошти
                </motion.h2>

                <motion.p
                  variants={contentVariants}
                  className="mt-10 text-center text-[18px] text-gray-400"
                >
                  Введіть ваш новий email і ми відправимо код підтвердження.
                </motion.p>

                <motion.div
                  variants={contentVariants}
                  className="mt-16 flex items-center gap-6"
                >
                  <label className="w-[230px] text-[20px] font-semibold text-gray-900">
                    Нова електронна пошта
                  </label>

                  <motion.input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    whileFocus={{
                      boxShadow: "0 0 0 4px rgba(33,150,243,0.08)",
                    }}
                    className="w-full rounded border border-gray-300 px-4 py-3 text-[18px] outline-none"
                  />
                </motion.div>

                <motion.div
                  variants={contentVariants}
                  className="mt-20 flex items-center justify-between"
                >
                  <motion.button
                    type="button"
                    onClick={handleCloseChangeEmail}
                    className="cursor-pointer text-[20px] font-medium text-[#2196F3]"
                    {...textButtonMotion}
                  >
                    Скасувати
                  </motion.button>

                  <motion.button
                    type="button"
                    onClick={handleSaveEmail}
                    className="rounded-xl bg-[#2196F3] px-8 py-3 text-[18px] font-semibold text-white"
                    {...primaryButtonMotion}
                  >
                    Надіслати
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isChangeEmailSuccessOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/40"
              onClick={handleCloseChangeEmailSuccess}
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            />

            <motion.div
              className="fixed left-1/2 top-1/2 z-50 w-[500px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[28px] bg-white shadow-xl"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="px-8 py-10 text-center">
                <motion.h2
                  variants={contentVariants}
                  className="text-[32px] font-bold text-gray-900"
                >
                  Повідомлення надіслано
                </motion.h2>

                <motion.button
                  type="button"
                  onClick={handleBackToChangeEmail}
                  className="mt-12 text-[20px] font-medium text-[#2196F3]"
                  {...textButtonMotion}
                >
                  Змінити email
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isVerifyEmailOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/40"
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            />

            <motion.div
              className="fixed left-1/2 top-1/2 z-50 w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-[28px] bg-white shadow-xl"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="px-8 py-8">
                <motion.h2
                  variants={contentVariants}
                  className="text-center text-[28px] font-bold text-gray-900"
                >
                  Підтвердження нового Email
                </motion.h2>

                <motion.p
                  variants={contentVariants}
                  className="mt-6 text-center text-gray-400"
                >
                  Ми відправили 6-значний код на user@email.com
                </motion.p>

                <motion.div
                  variants={contentVariants}
                  className="mt-10 flex items-center justify-center gap-4"
                >
                  {emailCode.map((digit, index) => (
                    <motion.input
                      key={index}
                      id={`email-code-${index}`}
                      value={digit}
                      onChange={(e) => handleCodeChange(index, e.target.value)}
                      onKeyDown={(e) => handleCodeKeyDown(index, e)}
                      whileFocus={{
                        y: -2,
                        boxShadow: "0 0 0 4px rgba(33,150,243,0.08)",
                      }}
                      className="h-12 w-12 rounded border border-gray-300 text-center text-xl outline-none"
                    />
                  ))}
                </motion.div>

                <motion.div
                  variants={contentVariants}
                  className="mt-12 flex items-center justify-between"
                >
                  <motion.button
                    className="cursor-pointer text-[#2196F3]"
                    {...textButtonMotion}
                  >
                    Скасувати
                  </motion.button>

                  <motion.button
                    onClick={handleVerifyEmail}
                    className="cursor-pointer rounded-xl bg-[#2196F3] px-6 py-3 text-white"
                    {...primaryButtonMotion}
                  >
                    Підтвердити
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isEmailChangedSuccessOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/40"
              onClick={handleCloseEmailChangedSuccess}
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            />

            <motion.div
              className="fixed left-1/2 top-1/2 z-50 w-[760px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[28px] bg-white shadow-xl"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="px-8 py-12 text-center">
                <motion.h2
                  variants={contentVariants}
                  className="text-2xl font-bold text-gray-900"
                >
                  Email успішно змінено 🎉
                </motion.h2>

                <motion.button
                  type="button"
                  onClick={handleCloseEmailChangedSuccess}
                  className="mt-16 text-[30px] font-medium text-[#2196F3]"
                  {...textButtonMotion}
                >
                  Повернутись
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
