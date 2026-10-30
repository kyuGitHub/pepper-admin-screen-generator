/* Display helpers for screen metadata. Supabase returns timestamps in UTC; the team reads them in Korea time. */

const KST = new Intl.DateTimeFormat('ko-KR', {
  timeZone: 'Asia/Seoul',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
});

/** "2026-10-29T04:05:00+00:00" → "2026.10.29 13:05" (Asia/Seoul). Returns the input when it is not a date. */
export function formatKst(iso: string | null | undefined): string {
  if (!iso) return '-';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const p = Object.fromEntries(KST.formatToParts(d).map((x) => [x.type, x.value]));
  return `${p.year}.${p.month}.${p.day} ${p.hour}:${p.minute}`;
}

/** Author shown on cards: the part of the e-mail before "@" (full address stays in the tooltip). */
export function authorLabel(email: string | null | undefined): string {
  if (!email) return '작성자 미상';
  return email.split('@')[0];
}
