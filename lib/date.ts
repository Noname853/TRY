// Util tanggal — semua di-anchor ke timezone Asia/Jakarta agar konsisten.
const TZ = "Asia/Jakarta";

export function todayISO(d = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(d);
  const y = parts.find((p) => p.type === "year")!.value;
  const m = parts.find((p) => p.type === "month")!.value;
  const day = parts.find((p) => p.type === "day")!.value;
  return `${y}-${m}-${day}`;
}

export function shiftDays(iso: string, days: number) {
  const d = new Date(iso + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export function dayOfWeekID(iso: string) {
  const d = new Date(iso + "T00:00:00Z");
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    timeZone: "UTC",
  }).format(d);
}

export function weekRange(anchor = todayISO()) {
  // Senin sebagai awal minggu
  const d = new Date(anchor + "T00:00:00Z");
  const dow = (d.getUTCDay() + 6) % 7; // 0=Senin
  const start = shiftDays(anchor, -dow);
  const end = shiftDays(start, 6);
  return { start, end };
}
