export function parseCookies(): Record<string, string> {
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
  return getCookie("username");
}
