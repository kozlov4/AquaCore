"use client";

import { useEffect, useRef, useState } from "react";

export function useProfileModals(isOwnProfile = false) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUnfollowOpen, setIsUnfollowOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isChangeEmailOpen, setIsChangeEmailOpen] = useState(false);
  const [isChangeEmailSuccessOpen, setIsChangeEmailSuccessOpen] =
    useState(false);
  const [isVerifyEmailOpen, setIsVerifyEmailOpen] = useState(false);
  const [emailCode, setEmailCode] = useState(["", "", "", "", "", ""]);
  const [isEmailChangedSuccessOpen, setIsEmailChangedSuccessOpen] =
    useState(false);

  const [reportText, setReportText] = useState("");
  const [profileName, setProfileName] = useState("Upvox");
  const [profileNickname, setProfileNickname] = useState("upvox_");
  const [profileBio, setProfileBio] = useState("");

  const [oldPassword, setOldPassword] = useState("**");
  const [newPassword, setNewPassword] = useState("upvox_");
  const [repeatNewPassword, setRepeatNewPassword] = useState("upvox_");

  const [newEmail, setNewEmail] = useState("");

  const menuRef = useRef(null);

  const [profileAvatar, setProfileAvatar] = useState("/images/Avatar.png");

  const handleChangeProfilePhoto = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setProfileAvatar(imageUrl);
  };

  const toggleMenu = () => {
    if (isOwnProfile) {
      setIsEditProfileOpen(true);
      setIsMenuOpen(false);
      return;
    }

    setIsMenuOpen((prev) => !prev);
  };

  const handleOpenReport = () => {
    setIsMenuOpen(false);
    setIsReportOpen(true);
  };

  const handleOpenUnfollow = () => {
    setIsMenuOpen(false);
    setIsUnfollowOpen(true);
  };

  const handleCloseReport = () => {
    setIsReportOpen(false);
    setReportText("");
  };

  const handleCloseUnfollow = () => {
    setIsUnfollowOpen(false);
  };

  const handleCloseEditProfile = () => {
    setIsEditProfileOpen(false);
  };

  const handleOpenChangePassword = () => {
    setIsEditProfileOpen(false);
    setIsChangePasswordOpen(true);
  };

  const handleCloseChangePassword = () => {
    setIsChangePasswordOpen(false);
  };

  const handleOpenChangeEmail = () => {
    setIsEditProfileOpen(false);
    setIsChangeEmailOpen(true);
  };

  const handleCloseChangeEmail = () => {
    setIsChangeEmailOpen(false);
    setNewEmail("");
  };

  const handleCloseChangeEmailSuccess = () => {
    setIsChangeEmailSuccessOpen(false);
  };

  const handleBackToChangeEmail = () => {
    setIsChangeEmailSuccessOpen(false);
    setIsVerifyEmailOpen(true);
  };

  const handleSendReport = () => {
    console.log("REPORT:", reportText);
    setIsReportOpen(false);
    setReportText("");
  };

  const handleConfirmUnfollow = () => {
    console.log("UNFOLLOW");
    setIsUnfollowOpen(false);
  };

  const handleSaveProfile = () => {
    console.log("SAVE PROFILE", {
      profileName,
      profileNickname,
      profileBio,
    });

    setIsEditProfileOpen(false);
  };

  const handleSavePassword = () => {
    if (
      !oldPassword.trim() ||
      !newPassword.trim() ||
      !repeatNewPassword.trim()
    ) {
      alert("Заповніть усі поля");
      return;
    }

    if (newPassword !== repeatNewPassword) {
      alert("Нові паролі не співпадають");
      return;
    }

    console.log("CHANGE PASSWORD", {
      oldPassword,
      newPassword,
      repeatNewPassword,
    });

    setIsChangePasswordOpen(false);
  };

  const handleSaveEmail = () => {
    if (!newEmail.trim()) {
      alert("Введіть новий email");
      return;
    }

    console.log("CHANGE EMAIL", newEmail);

    setIsChangeEmailOpen(false);
    setIsChangeEmailSuccessOpen(true);
  };

  const handleCodeChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;

    const updated = [...emailCode];
    updated[index] = value;
    setEmailCode(updated);

    if (value && index < 5) {
      const next = document.getElementById(`email-code-${index + 1}`);
      if (next) next.focus();
    }
  };

  const handleCodeKeyDown = (index, e) => {
    if (e.key === "Backspace" && !emailCode[index] && index > 0) {
      const prev = document.getElementById(`email-code-${index - 1}`);
      if (prev) prev.focus();
    }
  };

  const handleVerifyEmail = () => {
    const fullCode = emailCode.join("");

    if (fullCode.length !== 6) {
      alert("Введіть код");
      return;
    }

    console.log("VERIFY EMAIL CODE:", fullCode);

    setIsVerifyEmailOpen(false);
    setIsEmailChangedSuccessOpen(true);
  };

  const handleCloseEmailChangedSuccess = () => {
    setIsEmailChangedSuccessOpen(false);
    setEmailCode(["", "", "", "", "", ""]);
    setNewEmail("");
  };

  useEffect(() => {
    if (isOwnProfile) return;

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOwnProfile]);

  return {
    isMenuOpen,
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

    menuRef,
    toggleMenu,
    handleOpenReport,
    handleOpenUnfollow,
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
    setEmailCode,
    handleCodeChange,
    handleCodeKeyDown,
    handleVerifyEmail,
    isEmailChangedSuccessOpen,
    handleCloseEmailChangedSuccess,
    profileAvatar,
    handleChangeProfilePhoto,
  };
}
