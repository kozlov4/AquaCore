"use client";

import { ForgotPasswordModal } from "./AuthModalsParts/ForgotPasswordModal";
import { SuccessResetModal } from "./AuthModalsParts/SuccessResetModal";
import { ResetPasswordModal } from "./AuthModalsParts/ResetPasswordModal";

export function AuthModals({
  isForgotOpen,
  isSuccessOpen,
  isResetPasswordOpen,
  resetEmail,
  setResetEmail,
  closeForgotModal,
  handleSendReset,
  closeSuccessModal,
  handleOpenResetPasswordModal,
  closeResetPasswordModal,
  resetCode,
  handleCodeChange,
  handleCodeKeyDown,
  newPassword,
  setNewPassword,
  repeatPassword,
  setRepeatPassword,
  handleSavePassword,
}) {
  return (
    <>
      <ForgotPasswordModal
        isOpen={isForgotOpen}
        resetEmail={resetEmail}
        setResetEmail={setResetEmail}
        onClose={closeForgotModal}
        onSend={handleSendReset}
      />

      <SuccessResetModal
        isOpen={isSuccessOpen}
        onClose={closeSuccessModal}
        onOpenReset={handleOpenResetPasswordModal}
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
      />
    </>
  );
}