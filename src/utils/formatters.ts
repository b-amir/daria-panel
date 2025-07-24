export function formatDateTime(isoString: string): string {
  return new Date(isoString).toLocaleString();
}

export function formatDateOnly(isoString: string): string {
  return new Date(isoString).toLocaleDateString();
}

export function formatPhoneForMobile(phone: string): string {
  return phone.replace(/[^\d]/g, "").slice(-4);
}

export function truncateText(text: string, maxLength: number): string {
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
}
