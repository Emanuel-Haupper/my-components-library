import { escapeHtml } from "../utils/stringFormatter.js";

export function MyInput({
  name = "",
  value = "",
  placeholder = "",
  type = "text",
  label = "",
} = {}) {
  const safeName = escapeHtml(name);
  const safeValue = escapeHtml(value);
  const safePlaceholder = escapeHtml(placeholder);
  const safeType = escapeHtml(type);
  const labelHtml = label
    ? `<label class="my-input__label" for="${safeName}">${escapeHtml(label)}</label>`
    : "";

  return `<div class="my-input">${labelHtml}<input id="${safeName}" name="${safeName}" type="${safeType}" value="${safeValue}" placeholder="${safePlaceholder}" /></div>`;
}
