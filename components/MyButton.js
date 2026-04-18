import { escapeHtml } from '../utils/stringFormatter.js';

export function MyButton({
  label = 'Button',
  variant = 'primary',
  type = 'button',
  disabled = false,
} = {}) {
  const safeLabel = escapeHtml(label);
  const safeVariant = escapeHtml(variant);
  const safeType = escapeHtml(type);
  const disabledAttribute = disabled ? ' disabled' : '';

  return `<button class="my-button my-button--${safeVariant}" type="${safeType}"${disabledAttribute}>${safeLabel}</button>`;
}
