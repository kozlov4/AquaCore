"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";

import { getAccessToken } from "../../services/apiClient";
import {
  changeMyPassword,
  confirmEmailChange,
  getMyProfile,
  requestEmailChange,
  updateMyProfile,
  uploadProfileImage,
} from "../../services/socialProfileApi";

const menuGroups = [
  {
    title: "Акваріуми",
    items: [
      {
        label: "Мої Акваріуми",
        href: "/aquariums",
        icon: "/images/Aqarium.svg",
      },
      {
        label: "Хронологія Акваріума",
        href: "/timeline",
        icon: "/images/Vectory.svg",
      },
      {
        label: "Особиста Галерея",
        href: "/gallery",
        icon: "/images/Gallery.svg",
      },
      {
        label: "Історія Обладнання",
        href: "/equipment",
        icon: "/images/Tools.svg",
      },
    ],
  },
  {
    title: "Моніторинг та аналітика",
    items: [
      {
        label: "Графіки Показників",
        href: "/analytics",
        icon: "/images/Statics.svg",
      },
      {
        label: "Журнал Акваріуміста",
        href: "/diary",
        icon: "/images/Notes.svg",
      },
    ],
  },
  {
    title: "Планування",
    items: [
      {
        label: "To-Do List",
        href: "/tasks",
        icon: "/images/tasking.svg",
      },
      {
        label: "Графік Підмін",
        href: "/water-change",
        icon: "/images/Kaplya.svg",
      },
    ],
  },
  {
    title: "Інструменти",
    items: [
      {
        label: "Банк Калькуляторів",
        href: "/calculators",
        icon: "/images/Calc.svg",
      },
      {
        label: "Перевірка Сумісності",
        href: "/compatibility",
        icon: "/images/Alarm.svg",
      },
    ],
  },
  {
    title: "Ресурси",
    items: [
      {
        label: "Довідник Видів",
        href: "/species",
        icon: "/images/Fish.svg",
      },
      {
        label: "База Знань",
        href: "/articles",
        icon: "/images/Book.svg",
      },
      {
        label: "Хвороби та Лікування",
        href: "/diseases",
        icon: "/images/Virus.svg",
      },
    ],
  },
  {
    title: "Підтримка",
    items: [
      {
        label: "Зворотний зв'язок",
        href: "/reviews",
        icon: "/images/Message.svg",
      },
    ],
  },
];

const mobileMainItems = [
  {
    label: "Панель",
    href: "/dashboard",
    icon: "/images/Menu.svg",
  },
  {
    label: "Акваріуми",
    href: "/aquariums",
    icon: "/images/Aqarium.svg",
  },
  {
    label: "Калькулятор",
    href: "/calculators",
    icon: "/images/Calc.svg",
  },
  {
    label: "Журнал",
    href: "/diary",
    icon: "/images/Notes.svg",
  },
  {
    label: "Профіль",
    href: "/profile",
    icon: "/images/User.svg",
  },
];

const pagesWithoutSidebarForGuests = ["/calculators", "/reviews"];
const DEFAULT_AVATAR = "/images/Avatar.png";

function SidebarIcon({ src, alt, size = 22 }) {
  return (
    <span
      className="relative shrink-0"
      style={{
        width: size,
        height: size,
      }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={`${size}px`}
        className="object-contain"
      />
    </span>
  );
}

function DotsIcon() {
  return (
    <span className="flex items-center gap-[3px]">
      <span className="h-[4px] w-[4px] rounded-full bg-[#505866]" />
      <span className="h-[4px] w-[4px] rounded-full bg-[#505866]" />
      <span className="h-[4px] w-[4px] rounded-full bg-[#505866]" />
    </span>
  );
}

function SidebarItem({ item }) {
  const router = useRouter();

  const isActive =
    router.pathname === item.href || router.pathname.startsWith(`${item.href}/`);

  return (
    <Link
      href={item.href}
      className={`group flex h-[32px] items-center gap-[12px] rounded-[8px] px-[6px] text-[12px] font-normal transition-all duration-200 ${
        isActive
          ? "bg-[#efa7d2] text-[#111827]"
          : "text-[#111827] hover:bg-[#f7e1ef]"
      }`}
    >
      <SidebarIcon src={item.icon} alt={item.label} size={21} />
      <span className="truncate">{item.label}</span>
    </Link>
  );
}

function isBrowser() {
  return typeof window !== "undefined";
}

function getCachedIdentity() {
  if (!isBrowser()) {
    return {
      name: "",
      email: "",
      nickname: "",
    };
  }

  return {
    name: localStorage.getItem("user_name") || "",
    email: localStorage.getItem("user_email") || "",
    nickname: localStorage.getItem("user_nickname") || "",
  };
}

function normalizeProfile(profile) {
  const cached = getCachedIdentity();

  return {
    name: profile?.name || cached.name || profile?.nickname || "Користувач",
    nickname: profile?.nickname || cached.nickname || "",
    email: profile?.email || cached.email || "",
    myself: profile?.myself || "",
    avatarUrl:
      profile?.avatar_url ||
      profile?.avatar?.image_url ||
      profile?.avatar?.url ||
      DEFAULT_AVATAR,
  };
}

function SidebarUserBlock() {
  const menuRef = useRef(null);

  const [profile, setProfile] = useState(() => normalizeProfile(null));
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [modal, setModal] = useState(null);
  const [emailStep, setEmailStep] = useState(1);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [profileForm, setProfileForm] = useState({
    name: "",
    nickname: "",
    myself: "",
    avatarFile: null,
    avatarPreview: DEFAULT_AVATAR,
  });

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    repeatNewPassword: "",
  });

  const [emailForm, setEmailForm] = useState({
    newEmail: "",
    code: ["", "", "", "", "", ""],
  });

  const initials = useMemo(() => {
    const source = profile.name || profile.nickname || "U";
    return source.trim().charAt(0).toUpperCase();
  }, [profile.name, profile.nickname]);

  async function loadProfile() {
    try {
      setLoading(true);

      const data = await getMyProfile();
      const normalized = normalizeProfile(data);

      setProfile(normalized);

      setProfileForm({
        name: normalized.name || "",
        nickname: normalized.nickname || "",
        myself: normalized.myself || "",
        avatarFile: null,
        avatarPreview: normalized.avatarUrl || DEFAULT_AVATAR,
      });

      if (isBrowser()) {
        if (normalized.name) localStorage.setItem("user_name", normalized.name);
        if (normalized.nickname) {
          localStorage.setItem("user_nickname", normalized.nickname);
        }
        if (normalized.email) {
          localStorage.setItem("user_email", normalized.email);
        }
      }
    } catch {
      const fallback = normalizeProfile(null);

      setProfile(fallback);

      setProfileForm({
        name: fallback.name || "",
        nickname: fallback.nickname || "",
        myself: fallback.myself || "",
        avatarFile: null,
        avatarPreview: fallback.avatarUrl || DEFAULT_AVATAR,
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProfile();
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function openProfileModal() {
    setMessage("");
    setModal("profile");
    setMenuOpen(false);

    setProfileForm({
      name: profile.name || "",
      nickname: profile.nickname || "",
      myself: profile.myself || "",
      avatarFile: null,
      avatarPreview: profile.avatarUrl || DEFAULT_AVATAR,
    });
  }

  function openPasswordModal() {
    setMessage("");
    setModal("password");
    setMenuOpen(false);

    setPasswordForm({
      oldPassword: "",
      newPassword: "",
      repeatNewPassword: "",
    });
  }

  function openEmailModal() {
    setMessage("");
    setEmailStep(1);
    setModal("email");
    setMenuOpen(false);

    setEmailForm({
      newEmail: "",
      code: ["", "", "", "", "", ""],
    });
  }

  function closeModal() {
    if (submitting) return;

    setModal(null);
    setEmailStep(1);
    setMessage("");
  }

  function handleAvatarChange(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    setProfileForm((prev) => ({
      ...prev,
      avatarFile: file,
      avatarPreview: URL.createObjectURL(file),
    }));
  }

  async function handleProfileSubmit(event) {
    event.preventDefault();

    try {
      setSubmitting(true);
      setMessage("");

      let avatarId = null;
      let avatarUrl = profile.avatarUrl;

      if (profileForm.avatarFile) {
        const uploadedImage = await uploadProfileImage(profileForm.avatarFile);

        avatarId = uploadedImage.imageId;
        avatarUrl = uploadedImage.imageUrl || avatarUrl;
      }

      const payload = {
        name: profileForm.name.trim() || null,
        nickname: profileForm.nickname.trim() || null,
        myself: profileForm.myself.trim() || null,
      };

      if (avatarId) {
        payload.avatar_id = avatarId;
      }

      const updated = await updateMyProfile(payload);

      const nextProfile = {
        ...profile,
        name: updated?.name || payload.name || profile.name,
        nickname: updated?.nickname || payload.nickname || profile.nickname,
        myself: updated?.myself || payload.myself || "",
        avatarUrl,
      };

      setProfile(nextProfile);

      if (isBrowser()) {
        localStorage.setItem("user_name", nextProfile.name || "");
        localStorage.setItem("user_nickname", nextProfile.nickname || "");
      }

      await loadProfile();
      setModal(null);
    } catch (error) {
      setMessage(error.message || "Не вдалося зберегти зміни");
    } finally {
      setSubmitting(false);
    }
  }

  async function handlePasswordSubmit(event) {
    event.preventDefault();

    if (passwordForm.newPassword !== passwordForm.repeatNewPassword) {
      setMessage("Новий пароль і повтор пароля не збігаються");
      return;
    }

    try {
      setSubmitting(true);
      setMessage("");

      await changeMyPassword(passwordForm);

      setModal(null);
    } catch (error) {
      setMessage(error.message || "Не вдалося змінити пароль");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleEmailRequestSubmit(event) {
    event.preventDefault();

    if (!emailForm.newEmail.trim()) {
      setMessage("Введіть новий email");
      return;
    }

    try {
      setSubmitting(true);
      setMessage("");

      await requestEmailChange(emailForm.newEmail.trim());

      setEmailStep(2);
    } catch (error) {
      setMessage(error.message || "Не вдалося відправити лист");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleEmailConfirmSubmit(event) {
    event.preventDefault();

    const code = emailForm.code.join("");

    if (code.length !== 6) {
      setMessage("Введіть 6-значний код з листа");
      return;
    }

    try {
      setSubmitting(true);
      setMessage("");

      await confirmEmailChange(code);

      if (isBrowser()) {
        localStorage.setItem("user_email", emailForm.newEmail.trim());
      }

      setProfile((prev) => ({
        ...prev,
        email: emailForm.newEmail.trim(),
      }));

      setEmailStep(3);
    } catch (error) {
      setMessage(error.message || "Не вдалося підтвердити email");
    } finally {
      setSubmitting(false);
    }
  }

  function handleCodeChange(index, value) {
    const cleanValue = value.replace(/\D/g, "").slice(0, 1);

    setEmailForm((prev) => {
      const nextCode = [...prev.code];
      nextCode[index] = cleanValue;

      return {
        ...prev,
        code: nextCode,
      };
    });

    if (cleanValue && index < 5) {
      document.getElementById(`email-code-${index + 1}`)?.focus();
    }
  }

  const inputClass =
    "w-full border border-[#d7d7d7] bg-white px-3 py-2.5 text-sm text-[#222] outline-none transition focus:border-[#5b4df0]";

  const labelClass =
    "grid grid-cols-[170px_1fr] items-center gap-3 text-left max-[700px]:grid-cols-1";

  const labelTitleClass =
    "text-right text-sm font-bold text-[#2b2b2b] max-[700px]:text-left";

  const helperClass =
    "col-start-2 -mt-2 text-xs text-[#9a9a9a] max-[700px]:col-start-1 max-[700px]:mt-0";

  const linkButtonClass =
    "border-0 bg-transparent font-bold text-[#5b4df0] transition hover:text-[#4338ca] disabled:cursor-not-allowed disabled:opacity-60";

  const primaryButtonClass =
    "rounded-[10px] bg-[#5b4df0] px-[18px] py-[11px] font-bold text-white transition hover:bg-[#493dd8] disabled:cursor-not-allowed disabled:opacity-65 max-[700px]:w-full";

  return (
    <>
      <div
        ref={menuRef}
        className="relative flex h-full w-full items-center justify-between gap-[8px]"
      >
        <div className="flex min-w-0 items-center gap-[11px]">
          <div className="flex h-[42px] w-[42px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#5b4df0] text-sm font-bold text-white">
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={profile.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <span>{initials}</span>
            )}
          </div>

          <div className="min-w-0">
            <p className="m-0 truncate text-[13px] font-semibold leading-[18px] text-[#111827]">
              {loading ? "Завантаження..." : profile.name}
            </p>

            <p className="m-0 truncate text-[12px] leading-[17px] text-[#7b8190]">
              {profile.email || profile.nickname || "email не знайдено"}
            </p>
          </div>
        </div>

        <button
          type="button"
          aria-label="User menu"
          onClick={() => setMenuOpen((prev) => !prev)}
          className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full text-[#4b5563] transition-colors hover:bg-white"
        >
          <DotsIcon />
        </button>

        {menuOpen && (
          <div className="absolute bottom-[calc(100%+10px)] right-0 z-[100] w-[210px] rounded-[14px] bg-white p-2 shadow-[0_16px_40px_rgba(0,0,0,0.2)]">
            <button
              type="button"
              onClick={openProfileModal}
              className="w-full rounded-[10px] px-3 py-2.5 text-left text-sm text-[#252525] transition hover:bg-[#f2f0ff] hover:text-[#5b4df0]"
            >
              Налаштування профілю
            </button>

            <button
              type="button"
              onClick={openPasswordModal}
              className="w-full rounded-[10px] px-3 py-2.5 text-left text-sm text-[#252525] transition hover:bg-[#f2f0ff] hover:text-[#5b4df0]"
            >
              Змінити пароль
            </button>

            <button
              type="button"
              onClick={openEmailModal}
              className="w-full rounded-[10px] px-3 py-2.5 text-left text-sm text-[#252525] transition hover:bg-[#f2f0ff] hover:text-[#5b4df0]"
            >
              Змінити email
            </button>
          </div>
        )}
      </div>

      {modal === "profile" && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#121212]/70">
          <form
            onSubmit={handleProfileSubmit}
            className="min-h-[280px] w-[min(820px,calc(100vw-32px))] bg-white px-[34px] py-7 text-[#2b2b2b] shadow-[0_22px_70px_rgba(0,0,0,0.28)] max-[700px]:px-[18px]"
          >
            <div className="mb-[22px] flex items-center gap-3.5 pl-[130px] max-[700px]:pl-0">
              <label className="flex h-[50px] w-[50px] cursor-pointer items-center justify-center overflow-hidden rounded-full bg-[#5b4df0] font-bold text-white">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />

                {profileForm.avatarPreview ? (
                  <img
                    src={profileForm.avatarPreview}
                    alt="profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span>{initials}</span>
                )}
              </label>

              <div>
                <strong className="text-sm text-[#2b2b2b]">
                  {profileForm.name || profile.name}
                </strong>

                <label className="mt-1 block cursor-pointer text-[13px] text-[#5b4df0]">
                  Змінити фото профілю
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <label className={`${labelClass} mb-[18px]`}>
              <span className={labelTitleClass}>Імʼя</span>
              <input
                value={profileForm.name}
                onChange={(event) =>
                  setProfileForm((prev) => ({
                    ...prev,
                    name: event.target.value,
                  }))
                }
                className={inputClass}
              />
              <small className={helperClass}>
                Як до вас звертатися у спільноті
              </small>
            </label>

           

            <label className={`${labelClass} mb-[18px]`}>
              <span className={labelTitleClass}>Про себе</span>
              <textarea
                maxLength={150}
                value={profileForm.myself}
                onChange={(event) =>
                  setProfileForm((prev) => ({
                    ...prev,
                    myself: event.target.value,
                  }))
                }
                className={`${inputClass} min-h-[72px] resize-none`}
              />
              <small className={helperClass}>
                {profileForm.myself.length} / 150
              </small>
            </label>

            {message && (
              <p className="my-3 text-center text-[13px] text-[#d92d20]">
                {message}
              </p>
            )}

            <div className="mt-9 flex items-center justify-between gap-4 max-[700px]:flex-col max-[700px]:items-stretch">
              <button
                type="button"
                onClick={closeModal}
                className={linkButtonClass}
              >
                Скасувати
              </button>

              <div className="flex items-center gap-[22px] max-[700px]:flex-col max-[700px]:items-stretch">
                <button
                  type="button"
                  onClick={openPasswordModal}
                  className={linkButtonClass}
                >
                  Змінити пароль
                </button>

                <button
                  type="button"
                  onClick={openEmailModal}
                  className={linkButtonClass}
                >
                  Змінити email
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className={primaryButtonClass}
                >
                  {submitting ? "Збереження..." : "Підтвердити"}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {modal === "password" && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#121212]/70">
          <form
            onSubmit={handlePasswordSubmit}
            className="min-h-[280px] w-[min(720px,calc(100vw-32px))] bg-white px-[34px] py-7 text-[#2b2b2b] shadow-[0_22px_70px_rgba(0,0,0,0.28)] max-[700px]:px-[18px]"
          >
            <label className={`${labelClass} mb-[18px]`}>
              <span className={labelTitleClass}>Старий пароль</span>
              <input
                type="password"
                value={passwordForm.oldPassword}
                onChange={(event) =>
                  setPasswordForm((prev) => ({
                    ...prev,
                    oldPassword: event.target.value,
                  }))
                }
                className={inputClass}
              />
            </label>

            <label className={`${labelClass} mb-[18px]`}>
              <span className={labelTitleClass}>Новий пароль</span>
              <input
                type="password"
                value={passwordForm.newPassword}
                onChange={(event) =>
                  setPasswordForm((prev) => ({
                    ...prev,
                    newPassword: event.target.value,
                  }))
                }
                className={inputClass}
              />
            </label>

            <label className={`${labelClass} mb-[18px]`}>
              <span className={labelTitleClass}>Повторіть новий пароль</span>
              <input
                type="password"
                value={passwordForm.repeatNewPassword}
                onChange={(event) =>
                  setPasswordForm((prev) => ({
                    ...prev,
                    repeatNewPassword: event.target.value,
                  }))
                }
                className={inputClass}
              />
            </label>

            {message && (
              <p className="my-3 text-center text-[13px] text-[#d92d20]">
                {message}
              </p>
            )}

            <div className="mt-9 flex items-center justify-between gap-4 max-[700px]:flex-col max-[700px]:items-stretch">
              <button
                type="button"
                onClick={closeModal}
                className={linkButtonClass}
              >
                Скасувати
              </button>

              <button
                type="submit"
                disabled={submitting}
                className={primaryButtonClass}
              >
                {submitting ? "Зміна..." : "Підтвердити"}
              </button>
            </div>
          </form>
        </div>
      )}

      {modal === "email" && emailStep === 1 && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#121212]/70">
          <form
            onSubmit={handleEmailRequestSubmit}
            className="min-h-[280px] w-[min(720px,calc(100vw-32px))] bg-white px-[34px] py-7 text-center text-[#2b2b2b] shadow-[0_22px_70px_rgba(0,0,0,0.28)] max-[700px]:px-[18px]"
          >
            <h2 className="text-xl font-bold">Зміна електронної пошти</h2>

            <p className="mb-[34px] mt-[18px] text-[13px] text-[#8f8f8f]">
              Введіть ваш новий email і ми відправимо код підтвердження.
            </p>

            <label className={`${labelClass} mb-[18px]`}>
              <span className={labelTitleClass}>Нова електронна пошта</span>
              <input
                type="email"
                value={emailForm.newEmail}
                onChange={(event) =>
                  setEmailForm((prev) => ({
                    ...prev,
                    newEmail: event.target.value,
                  }))
                }
                className={inputClass}
              />
            </label>

            {message && (
              <p className="my-3 text-center text-[13px] text-[#d92d20]">
                {message}
              </p>
            )}

            <div className="mt-9 flex items-center justify-between gap-4 max-[700px]:flex-col max-[700px]:items-stretch">
              <button
                type="button"
                onClick={closeModal}
                className={linkButtonClass}
              >
                Скасувати
              </button>

              <button
                type="submit"
                disabled={submitting}
                className={primaryButtonClass}
              >
                {submitting ? "Надсилання..." : "Надіслати"}
              </button>
            </div>
          </form>
        </div>
      )}

      {modal === "email" && emailStep === 2 && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#121212]/70">
          <form
            onSubmit={handleEmailConfirmSubmit}
            className="min-h-[280px] w-[min(720px,calc(100vw-32px))] bg-white px-[34px] py-7 text-center text-[#2b2b2b] shadow-[0_22px_70px_rgba(0,0,0,0.28)] max-[700px]:px-[18px]"
          >
            <h2 className="text-xl font-bold">Підтвердження нового Email</h2>

            <p className="mb-[34px] mt-[18px] text-[13px] text-[#8f8f8f]">
              Ми відправили 6-значний код на {emailForm.newEmail}
            </p>

            <div className="mt-[26px] flex items-center justify-center gap-[18px] max-[520px]:flex-col">
              <span className="text-sm font-bold">Код з листа</span>

              <div className="flex gap-1.5">
                {emailForm.code.map((digit, index) => (
                  <input
                    key={index}
                    id={`email-code-${index}`}
                    value={digit}
                    inputMode="numeric"
                    maxLength={1}
                    onChange={(event) =>
                      handleCodeChange(index, event.target.value)
                    }
                    className="h-[34px] w-[34px] border border-[#bcbcbc] text-center text-base outline-none transition focus:border-[#5b4df0]"
                  />
                ))}
              </div>
            </div>

            {message && (
              <p className="my-3 text-center text-[13px] text-[#d92d20]">
                {message}
              </p>
            )}

            <div className="mt-9 flex items-center justify-between gap-4 max-[700px]:flex-col max-[700px]:items-stretch">
              <button
                type="button"
                onClick={closeModal}
                className={linkButtonClass}
              >
                Скасувати
              </button>

              <button
                type="submit"
                disabled={submitting}
                className={primaryButtonClass}
              >
                {submitting ? "Перевірка..." : "Підтвердити"}
              </button>
            </div>
          </form>
        </div>
      )}

      {modal === "email" && emailStep === 3 && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#121212]/70">
          <div className="flex min-h-[210px] w-[min(720px,calc(100vw-32px))] flex-col items-center justify-center gap-[26px] bg-white px-[34px] py-7 text-center text-[#2b2b2b] shadow-[0_22px_70px_rgba(0,0,0,0.28)] max-[700px]:px-[18px]">
            <h2 className="text-2xl font-bold">Email успішно змінено 🎉</h2>

            <button
              type="button"
              onClick={closeModal}
              className={linkButtonClass}
            >
              Повернутись
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export function Sidebar() {
  const router = useRouter();

  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    function checkAuth() {
      const token = getAccessToken();

      setIsAuthorized(Boolean(token));
      setIsAuthChecked(true);
    }

    checkAuth();

    window.addEventListener("storage", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
    };
  }, [router.pathname]);

  if (!isAuthChecked) {
    return null;
  }

  if (!isAuthorized) {
    return null;
  }

  return (
    <>
      <aside className="fixed left-0 top-0 z-50 hidden h-screen w-[210px] flex-col bg-[#fbfbfc] text-[#111827] shadow-[8px_0_30px_rgba(15,23,42,0.04)] md:flex">
        <div className="flex min-h-0 flex-1 flex-col px-[24px] pt-[24px]">
          <Link
            href="/dashboard"
            className="mb-[42px] flex items-center gap-[13px]"
          >
            <Image
              src="/images/Logo.svg"
              alt="AquaCore"
              width={48}
              height={48}
              priority
              className="h-[42px] w-auto object-contain"
            />

            <span className="bg-gradient-to-r from-[#7665ff] via-[#b66fd5] to-[#f0a2ce] bg-clip-text text-[17px] font-extrabold uppercase tracking-[0.04em] text-transparent">
              Aqua Core
            </span>
          </Link>

          <nav className="sidebar-scroll min-h-0 flex-1 overflow-y-auto pr-[2px]">
            <div className="flex flex-col gap-[15px] pb-[18px]">
              {menuGroups.map((group) => (
                <section key={group.title}>
                  <h3 className="mb-[6px] px-[2px] text-[8px] font-semibold uppercase tracking-[0.09em] text-[#b7bbc4]">
                    {group.title}
                  </h3>

                  <div className="flex flex-col gap-[4px]">
                    {group.items.map((item) => (
                      <SidebarItem key={item.href} item={item} />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </nav>
        </div>

        <div className="h-[78px] shrink-0 bg-[#f1f4f8] px-[14px] py-[10px]">
          <SidebarUserBlock />
        </div>
      </aside>

      <nav className="fixed bottom-0 left-0 z-50 grid h-[70px] w-full grid-cols-5 border-t border-slate-200 bg-white shadow-[0_-10px_35px_rgba(15,23,42,0.08)] md:hidden">
        {mobileMainItems.map((item) => {
          const isActive =
            router.pathname === item.href ||
            router.pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 text-[10px] font-medium ${
                isActive ? "text-[#111827]" : "text-[#7b8190]"
              }`}
            >
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-xl ${
                  isActive ? "bg-[#efa7d2]" : "bg-transparent"
                }`}
              >
                <SidebarIcon src={item.icon} alt={item.label} size={19} />
              </span>

              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <style jsx global>{`
        .sidebar-scroll::-webkit-scrollbar {
          width: 4px;
        }

        .sidebar-scroll::-webkit-scrollbar-track {
          background: transparent;
        }

        .sidebar-scroll::-webkit-scrollbar-thumb {
          background: #e1e5ec;
          border-radius: 999px;
        }

        .sidebar-scroll::-webkit-scrollbar-thumb:hover {
          background: #cfd5df;
        }
      `}</style>
    </>
  );
}

export default Sidebar;