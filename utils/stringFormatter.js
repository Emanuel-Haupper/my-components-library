export function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function formatTitleCase(value = '') {
  return String(value)
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function truncate(value = '', maxLength = 100, suffix = '...') {
  const text = String(value);
  if (maxLength < 0 || text.length <= maxLength) {
    return text;
  }

  return text.slice(0, Math.max(0, maxLength - suffix.length)) + suffix;
}
