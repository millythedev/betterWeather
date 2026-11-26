// open-meteo gives local times without a timezone like "2025-06-01T14:00"
// so i just read the numbers straight out instead of using new Date() which would shift it

export const formatHour = (iso: string) => {
  const hour = parseInt(iso.slice(11, 13), 10);
  const suffix = hour >= 12 ? 'PM' : 'AM';
  const h = hour % 12 === 0 ? 12 : hour % 12;
  return `${h} ${suffix}`;
};

export const formatTime = (iso: string) => {
  const hour = parseInt(iso.slice(11, 13), 10);
  const minutes = iso.slice(14, 16);
  const suffix = hour >= 12 ? 'PM' : 'AM';
  const h = hour % 12 === 0 ? 12 : hour % 12;
  return `${h}:${minutes} ${suffix}`;
};

export const formatDay = (date: string, index: number) => {
  if (index === 0) return 'Today';
  const [y, m, d] = date.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-US', { weekday: 'short' });
};

export const formatDate = (iso: string) => {
  const [y, m, d] = iso.slice(0, 10).split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
};

export const round = (n: number) => Math.round(n);
