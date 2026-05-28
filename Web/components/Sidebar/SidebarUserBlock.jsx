import { useEffect, useMemo, useRef, useState } from "react";
import {
  changeMyPassword,
  confirmEmailChange,
  getMyProfile,
  requestEmailChange,
  updateMyProfile,
  uploadProfileImage,
} from "@/services/socialProfileApi";

const DEFAULT_AVATAR = "/images/user-placeholder.png";

function isBrowser() {
  return typeof window !== "undefined";
}

function parseJwtPayload(token) {
  try {
    const payload = token.split(".")[1];

    if (!payload) return null;

    const decodedPayload = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(decodedPayload)
        .split("")
        .map((char) => `%${`00${char.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join("")
    );

    return JSON.parse(json);
  } catch {
    return null;
  }
}

function getTokenPayload() {
  if (!isBrowser()) return null;

  const token =
    localStorage.getItem("access_token") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("token");

  return token ? parseJwtPayload(token) : null;
}

function getCachedIdentity() {
  if (!isBrowser()) {
    return {
      name: "",
      email: "",
    };
  }

  const payload = getTokenPayload();

  return {
    name:
      localStorage.getItem("user_name") ||
      localStorage.getItem("name") ||
      payload?.name ||
      payload?.username ||
      "",
    email:
      localStorage.getItem("user_email") ||
      localStorage.getItem("email") ||
      payload?.email ||
      payload?.sub ||
      "",
  };
}

function normalizeProfile(profile) {
  const cached = getCachedIdentity();

  return {
    name: profile?.name || cached.name || profile?.nickname || "Користувач",
    nickname: profile?.nickname || "",
    email: profile?.email || cached.email || "",
    myself: profile?.myself || "",
    avatarUrl:
      profile?.avatar_url ||
      profile?.avatar?.image_url ||
      profile?.avatar?.url ||
      DEFAULT_AVATAR,
  };
}

export default function SidebarUserBlock() {
  const menuRef = useRef(null);

  const [profile, setProfile] = useState(() => normalizeProfile(null));
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  const [modal, setModal] = useState(null);
  const [emailStep, setEmailStep] = useState(1);

  const [profileForm, setProfileForm] = useState({
    name: "",
    nickname: "",
    myself: "",
    avatarFile: null,
    avatarPreview: "",
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

  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

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

    setProfileForm((prev) => ({
      ...prev,
      name: profile.name || "",
      nickname: profile.nickname || "",
      myself: profile.myself || "",
      avatarFile: null,
      avatarPreview: profile.avatarUrl || DEFAULT_AVATAR,
    }));
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
    setMessage("");
    setEmailStep(1);
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

      if (isBrowser()) {
        localStorage.setItem("user_name", payload.name || "");
      }

      setProfile((prev) => ({
        ...prev,
        name: updated?.name || payload.name || prev.name,
        nickname: updated?.nickname || payload.nickname || prev.nickname,
        myself: updated?.myself || payload.myself || "",
        avatarUrl,
      }));

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
      const nextInput = document.getElementById(`email-code-${index + 1}`);
      nextInput?.focus();
    }
  }

  const inputClass =
    "w-full border border-[#d7d7d7] bg-white px-3 py-2.5 text-sm text-[#222] outline-none transition focus:border-[#5b4df0]";

  const labelClass =
    "grid grid-cols-[170px_1fr] items-center gap-3 text-left max-[700px]:grid-cols-1 max-[700px]:gap-2";

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
        className="relative flex w-full items-center justify-between gap-2.5 rounded-2xl bg-white/10 px-3 py-2.5"
      >
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="flex h-[38px] w-[38px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#5b4df0] font-bold text-white">
            {profile.avatarUrl && profile.avatarUrl !== DEFAULT_AVATAR ? (
              <img
                src={profile.avatarUrl}
                alt={profile.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <span>{initials}</span>
            )}
          </div>

          <div className="flex min-w-0 flex-col">
            <strong className="truncate text-sm text-white">
              {loading ? "Завантаження..." : profile.name}
            </strong>
            <span className="truncate text-xs text-white/60">
              {profile.email || profile.nickname || "email не знайдено"}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Відкрити меню профілю"
          className="border-0 bg-transparent text-[22px] leading-none text-white/80 transition hover:text-white"
        >
          ⋯
        </button>

        {menuOpen && (
          <div className="absolute bottom-[calc(100%+8px)] right-2.5 z-[100] w-[210px] rounded-[14px] bg-white p-2 shadow-[0_16px_40px_rgba(0,0,0,0.2)]">
            <button
              type="button"
              onClick={openProfileModal}
              className="w-full rounded-[10px] border-0 bg-transparent px-3 py-2.5 text-left text-sm text-[#252525] transition hover:bg-[#f2f0ff] hover:text-[#5b4df0]"
            >
              Налаштування профілю
            </button>

            <button
              type="button"
              onClick={openPasswordModal}
              className="w-full rounded-[10px] border-0 bg-transparent px-3 py-2.5 text-left text-sm text-[#252525] transition hover:bg-[#f2f0ff] hover:text-[#5b4df0]"
            >
              Змінити пароль
            </button>

            <button
              type="button"
              onClick={openEmailModal}
              className="w-full rounded-[10px] border-0 bg-transparent px-3 py-2.5 text-left text-sm text-[#252525] transition hover:bg-[#f2f0ff] hover:text-[#5b4df0]"
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
            className="min-h-[280px] w-[min(820px,calc(100vw-32px))] bg-white px-[34px] py-7 text-[#2b2b2b] shadow-[0_22px_70px_rgba(0,0,0,0.28)] max-[700px]:px-[18px] max-[700px]:py-6"
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
              <span className={labelTitleClass}>Нікнейм</span>

              <input
                value={profileForm.nickname}
                onChange={(event) =>
                  setProfileForm((prev) => ({
                    ...prev,
                    nickname: event.target.value,
                  }))
                }
                className={inputClass}
              />

              <small className={helperClass}>
                Унікальне імʼя вашого профілю
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
            className="min-h-[280px] w-[min(720px,calc(100vw-32px))] bg-white px-[34px] py-7 text-[#2b2b2b] shadow-[0_22px_70px_rgba(0,0,0,0.28)] max-[700px]:px-[18px] max-[700px]:py-6"
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
            className="min-h-[280px] w-[min(720px,calc(100vw-32px))] bg-white px-[34px] py-7 text-center text-[#2b2b2b] shadow-[0_22px_70px_rgba(0,0,0,0.28)] max-[700px]:px-[18px] max-[700px]:py-6"
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
            className="min-h-[280px] w-[min(720px,calc(100vw-32px))] bg-white px-[34px] py-7 text-center text-[#2b2b2b] shadow-[0_22px_70px_rgba(0,0,0,0.28)] max-[700px]:px-[18px] max-[700px]:py-6"
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
          <div className="flex min-h-[210px] w-[min(720px,calc(100vw-32px))] flex-col items-center justify-center gap-[26px] bg-white px-[34px] py-7 text-center text-[#2b2b2b] shadow-[0_22px_70px_rgba(0,0,0,0.28)] max-[700px]:px-[18px] max-[700px]:py-6">
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