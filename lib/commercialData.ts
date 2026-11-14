/** Accept only web URLs for links stored in business data. */
export function toExternalUrl(value: string | null | undefined): string | null {
  const raw = value?.trim();
  if (!raw) return null;

  try {
    const url = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
    return url.protocol === "https:" || url.protocol === "http:" ? url.href : null;
  } catch {
    return null;
  }
}

/** Format only real, non-future dates supplied by the source data. */
export function formatDataDate(value: string | null | undefined): string | null {
  if (!value?.trim()) return null;
  const date = new Date(value);
  if (!Number.isFinite(date.getTime()) || date.getTime() > Date.now()) return null;

  return new Intl.DateTimeFormat("en-LK", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Colombo",
  }).format(date);
}

/** Exclude records already marked as duplicates or closed Colombo locations. */
export function isActiveColomboBusiness(record: {
  verificationStatus?: string | null;
  notes?: string | null;
  verification_status?: string | null;
}): boolean {
  const verificationStatus = (record.verificationStatus ?? record.verification_status)?.toLocaleLowerCase() ?? "";
  const notes = record.notes?.toLocaleLowerCase() ?? "";

  const confirmedDuplicate =
    verificationStatus.includes("duplicate") ||
    notes.includes("confirmed duplicate of");
  const closedColomboLocation =
    notes.includes("permanently closed") || notes.includes("closed in colombo");

  return !confirmedDuplicate && !closedColomboLocation;
}
