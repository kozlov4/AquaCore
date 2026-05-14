"use client";

import { useState } from "react";
import { useRouter } from "next/router";
import { loginUser, registerUser } from "../services/authApi";

export function useAuthModals() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);

  const [resetEmail, setResetEmail] = useState("");
  const [resetCode, setResetCode] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  const openForgotModal = () => {
    setResetEmail(email);
    setIsForgotOpen(true);
  };

  const closeForgotModal = () => {
    setIsForgotOpen(false);
  };

  const closeSuccessModal = () => {
    setIsSuccessOpen(false);
  };

  const closeResetPasswordModal = () => {
    setIsResetPasswordOpen(false);
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

      router.push("/dashboard");
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

      router.push("/dashboard");
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

  const handleSendReset = () => {
    if (!resetEmail.trim()) {
      alert("Введіть email");
      return;
    }

    setIsForgotOpen(false);
    setIsSuccessOpen(true);
  };

  const handleOpenResetPasswordModal = () => {
    setIsSuccessOpen(false);
    setIsResetPasswordOpen(true);
  };

  const handleCodeChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;

    const updatedCode = [...resetCode];
    updatedCode[index] = value;
    setResetCode(updatedCode);

    if (value && index < 5) {
      const nextInput = document.getElementById(`code-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleCodeKeyDown = (index, e) => {
    if (e.key === "Backspace" && !resetCode[index] && index > 0) {
      const prevInput = document.getElementById(`code-input-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleSavePassword = () => {
    const fullCode = resetCode.join("");

    if (fullCode.length !== 6) {
      alert("Введіть 6-значний код");
      return;
    }

    if (!newPassword.trim() || !repeatPassword.trim()) {
      alert("Заповніть усі поля");
      return;
    }

    if (newPassword !== repeatPassword) {
      alert("Паролі не співпадають");
      return;
    }

    alert("API для відновлення пароля ще не підключено");
    setIsResetPasswordOpen(false);
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
    isSuccessOpen,
    isResetPasswordOpen,

    resetEmail,
    resetCode,
    newPassword,
    repeatPassword,

    setResetEmail,
    setNewPassword,
    setRepeatPassword,

    openForgotModal,
    closeForgotModal,
    closeSuccessModal,
    closeResetPasswordModal,

    handleSendReset,
    handleOpenResetPasswordModal,
    handleCodeChange,
    handleCodeKeyDown,
    handleSavePassword,
  };
}