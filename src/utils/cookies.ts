export function parseCookies(): Record<string, string> {
  if (typeof document === "undefined" || !document.cookie) {
    return {};
  }

  return Object.fromEntries(
    document.cookie
      .split(";")
      .map((cookie) => cookie.trim().split("="))
      .filter(([key]) => key)
      .map(([key, value]) => [key, decodeURIComponent(value || "")])
  );
}

export function getCookie(name: string): string | undefined {
  const cookies = parseCookies();
  return cookies[name];
}

export function getUsernameFromCookies(): string | undefined {
  const username = getCookie("username");
  const isLoggedIn = getCookie("logged_in");

  return username && isLoggedIn === "true" ? username : undefined;
}
