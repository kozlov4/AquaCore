"use client";

import { ForgotPasswordModal } from "./AuthModalsParts/ForgotPasswordModal";
import { ResetPasswordModal } from "./AuthModalsParts/ResetPasswordModal";

export function AuthModals({
  isForgotOpen,
  isResetPasswordOpen,

  resetEmail,
  setResetEmail,

  resetCode,
  handleCodeChange,
  handleCodeKeyDown,

  newPassword,
  setNewPassword,

  repeatPassword,
  setRepeatPassword,

  resetLoading,
  resetError,
  resetSuccess,

  closeForgotModal,
  closeResetPasswordModal,

  handleSendForgotPassword,
  handleSavePassword,
}) {
  return (
    <>
      <ForgotPasswordModal
        isOpen={isForgotOpen}
        resetEmail={resetEmail}
        setResetEmail={setResetEmail}
        onClose={closeForgotModal}
        onSend={handleSendForgotPassword}
        isLoading={resetLoading}
        error={resetError}
      />

      <ResetPasswordModal
        isOpen={isResetPasswordOpen}
        resetEmail={resetEmail}
        resetCode={resetCode}
        handleCodeChange={handleCodeChange}
        handleCodeKeyDown={handleCodeKeyDown}
        newPassword={newPassword}
        setNewPassword={setNewPassword}
        repeatPassword={repeatPassword}
        setRepeatPassword={setRepeatPassword}
        onClose={closeResetPasswordModal}
        onSave={handleSavePassword}
        isLoading={resetLoading}
        error={resetError}
        success={resetSuccess}
      />
    </>
  );
}