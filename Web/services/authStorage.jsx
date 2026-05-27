export function getAccessToken() {
  if (typeof window === "undefined") return null;

  return (
    localStorage.getItem("access_token") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("token")
  );
}

export function isUserAuthorized() {
  return Boolean(getAccessToken());
}