"use client";

import { useState } from "react";

export function useAuthModals() {
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);

  const [email, setEmail] = useState("");
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

    console.log("Код:", fullCode);
    console.log("Новий пароль:", newPassword);

    setIsResetPasswordOpen(false);
  };

  return {
    isForgotOpen,
    isSuccessOpen,
    isResetPasswordOpen,
    email,
    resetEmail,
    resetCode,
    newPassword,
    repeatPassword,
    setEmail,
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