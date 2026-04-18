export function formatDate(
  value,
  locale = 'en-US',
  options = { year: 'numeric', month: '2-digit', day: '2-digit' },
) {
  if (value === null || value === undefined || value === '') {
    return '';
  }

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return new Intl.DateTimeFormat(locale, options).format(date);
}
