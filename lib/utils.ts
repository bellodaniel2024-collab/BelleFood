import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind CSS classes intelligently, handling conflicts.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a kobo amount as Nigerian Naira string.
 * e.g. 250000 kobo → "₦2,500"
 */
export function formatNaira(kobo: number): string {
  const naira = kobo / 100;
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(naira);
}

/**
 * Converts naira to kobo for storage.
 */
export function nairaToKobo(naira: number): number {
  return Math.round(naira * 100);
}

/**
 * Converts kobo to naira for display.
 */
export function koboToNaira(kobo: number): number {
  return kobo / 100;
}

/**
 * Generates a human-readable order reference.
 * e.g. BF-240001
 */
export function generateOrderReference(): string {
  const year = new Date().getFullYear().toString().slice(-2);
  const random = Math.floor(Math.random() * 90000) + 10000;
  return `BF-${year}${random}`;
}

/**
 * Creates a URL-friendly slug from a string.
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Truncates text to a given character limit, adding ellipsis.
 */
export function truncate(text: string, limit: number): string {
  if (text.length <= limit) return text;
  return text.slice(0, limit).trim() + "…";
}

/**
 * Formats a Nigerian phone number for display.
 */
export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 11) {
    return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
  }
  return phone;
}

/**
 * Returns true if a Nigerian phone number looks valid.
 */
export function isValidNigerianPhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s-+()]/g, "");
  return /^(0[789][01]\d{8}|234[789][01]\d{8})$/.test(cleaned);
}

/**
 * Checks if the restaurant is currently open based on opening hours config.
 * @param openingHours JSON string of opening hours array
 * @param acceptingOrders whether orders are manually enabled
 */
export function isRestaurantOpen(
  openingHours: string | null,
  acceptingOrders: boolean
): boolean {
  if (!acceptingOrders) return false;
  if (!openingHours) return false;

  try {
    const hours: Array<{
      day: string;
      openTime: string;
      closeTime: string;
      closed: boolean;
    }> = JSON.parse(openingHours);

    const now = new Date();
    const dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const todayName = dayNames[now.getDay()];
    const todayHours = hours.find((h) => h.day === todayName);

    if (!todayHours || todayHours.closed) return false;

    const [openH, openM] = todayHours.openTime.split(":").map(Number);
    const [closeH, closeM] = todayHours.closeTime.split(":").map(Number);

    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    const openMinutes = openH * 60 + openM;
    const closeMinutes = closeH * 60 + closeM;

    return nowMinutes >= openMinutes && nowMinutes < closeMinutes;
  } catch {
    return false;
  }
}
