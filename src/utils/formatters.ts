const dateFormatCache = new Map<
  string,
  { dateTime: string; dateOnly: string }
>();
const MAX_CACHE_SIZE = 100;

function getOrCreateFormattedDate(isoString: string) {
  if (dateFormatCache.has(isoString)) {
    return dateFormatCache.get(isoString)!;
  }

  const date = new Date(isoString);
  const formatted = {
    dateTime: date.toLocaleString(),
    dateOnly: date.toLocaleDateString(),
  };

  if (dateFormatCache.size >= MAX_CACHE_SIZE) {
    const firstKey = dateFormatCache.keys().next().value;
    if (firstKey) {
      dateFormatCache.delete(firstKey);
    }
  }

  dateFormatCache.set(isoString, formatted);
  return formatted;
}

export function formatDateTime(isoString: string): string {
  return getOrCreateFormattedDate(isoString).dateTime;
}

export function formatDateOnly(isoString: string): string {
  return getOrCreateFormattedDate(isoString).dateOnly;
}

export function formatPhoneForMobile(phone: string): string {
  return phone.replace(/[^\d]/g, "").slice(-4);
}

export function truncateText(text: string, maxLength: number): string {
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
}
