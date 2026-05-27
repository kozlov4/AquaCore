"use client";

import { useState } from "react";
import { useRouter } from "next/router";
import { loginUser, registerUser } from "../services/authApi";
import { forgotPassword, resetPassword } from "../services/resetPasswordApi";

export function useAuthModals() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);

  const [resetEmail, setResetEmail] = useState("");
  const [resetCode, setResetCode] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState("");
  const [resetSuccess, setResetSuccess] = useState("");

  const openForgotModal = () => {
    setResetEmail(email || "");
    setResetError("");
    setResetSuccess("");
    setIsForgotOpen(true);
  };

  const closeForgotModal = () => {
    setIsForgotOpen(false);
    setResetError("");
  };

  const closeResetPasswordModal = () => {
    setIsResetPasswordOpen(false);
    setResetError("");
    setResetSuccess("");
    setResetCode(["", "", "", "", "", ""]);
    setNewPassword("");
    setRepeatPassword("");
  };

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      setAuthError("");

      if (!email.trim()) {
        setAuthError("Введіть email");
        return;
      }

      if (!password.trim()) {
        setAuthError("Введіть пароль");
        return;
      }

      await loginUser({
        email: email.trim(),
        password,
      });

      router.push("/aquariums");
    } catch (error) {
      setAuthError(error.message || "Помилка входу");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    try {
      setIsLoading(true);
      setAuthError("");

      if (!name.trim()) {
        setAuthError("Введіть імʼя");
        return;
      }

      if (!email.trim()) {
        setAuthError("Введіть email");
        return;
      }

      if (!password.trim()) {
        setAuthError("Введіть пароль");
        return;
      }

      if (name.trim().length < 3) {
        setAuthError("Імʼя має містити мінімум 3 символи");
        return;
      }

      if (password.length < 8) {
        setAuthError("Пароль має містити мінімум 8 символів");
        return;
      }

      await registerUser({
        name: name.trim(),
        email: email.trim(),
        password,
      });

      await loginUser({
        email: email.trim(),
        password,
      });

      router.push("/aquariums");
    } catch (error) {
      setAuthError(error.message || "Помилка реєстрації");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitAuth = async (isLogin) => {
    if (isLogin) {
      await handleLogin();
    } else {
      await handleRegister();
    }
  };

  const handleSendForgotPassword = async () => {
    try {
      setResetLoading(true);
      setResetError("");
      setResetSuccess("");

      if (!resetEmail.trim()) {
        setResetError("Введіть email");
        return;
      }

      await forgotPassword(resetEmail.trim());

      setIsForgotOpen(false);
      setIsResetPasswordOpen(true);
      setResetSuccess("Код відправлено на вашу пошту");
    } catch (error) {
      setResetError(error.message || "Не вдалося відправити код");
    } finally {
      setResetLoading(false);
    }
  };

  const handleCodeChange = (index, value) => {
    const onlyNumber = value.replace(/\D/g, "");

    setResetCode((prev) => {
      const next = [...prev];
      next[index] = onlyNumber.slice(0, 1);
      return next;
    });

    if (onlyNumber && index < 5) {
      document.getElementById(`code-input-${index + 1}`)?.focus();
    }
  };

  const handleCodeKeyDown = (index, event) => {
    if (event.key === "Backspace" && !resetCode[index] && index > 0) {
      document.getElementById(`code-input-${index - 1}`)?.focus();
    }
  };

  const handleSavePassword = async () => {
    try {
      setResetLoading(true);
      setResetError("");
      setResetSuccess("");

      const code = resetCode.join("");

      if (!resetEmail.trim()) {
        setResetError("Email відсутній. Спробуйте ще раз");
        return;
      }

      if (code.length !== 6) {
        setResetError("Введіть 6-значний код");
        return;
      }

      if (!newPassword.trim()) {
        setResetError("Введіть новий пароль");
        return;
      }

      if (newPassword.length < 8) {
        setResetError("Новий пароль має містити мінімум 8 символів");
        return;
      }

      if (newPassword !== repeatPassword) {
        setResetError("Паролі не співпадають");
        return;
      }

      await resetPassword({
        email: resetEmail.trim(),
        code,
        newPassword,
      });

      setResetSuccess("Пароль успішно змінено");

      setTimeout(() => {
        closeResetPasswordModal();
        router.push("/signIn");
      }, 900);
    } catch (error) {
      setResetError(error.message || "Не вдалося змінити пароль");
    } finally {
      setResetLoading(false);
    }
  };

  return {
    name,
    setName,

    email,
    setEmail,

    password,
    setPassword,

    isLoading,
    authError,

    handleLogin,
    handleRegister,
    handleSubmitAuth,

    isForgotOpen,
    isResetPasswordOpen,

    resetEmail,
    setResetEmail,

    resetCode,
    setResetCode,

    newPassword,
    setNewPassword,

    repeatPassword,
    setRepeatPassword,

    resetLoading,
    resetError,
    resetSuccess,

    openForgotModal,
    closeForgotModal,
    closeResetPasswordModal,

    handleSendForgotPassword,
    handleCodeChange,
    handleCodeKeyDown,
    handleSavePassword,
  };
}