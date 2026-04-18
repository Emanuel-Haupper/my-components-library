import { escapeHtml } from "../utils/stringFormatter.ts";

type MyInputProps = {
  name?: string;
  value?: string;
  placeholder?: string;
  type?: string;
  label?: string;
};

export function MyInput({
  name = "",
  value = "",
  placeholder = "",
  type = "text",
  label = "",
}: MyInputProps) {
  const safeName = escapeHtml(name);
  const safeValue = escapeHtml(value);
  const safePlaceholder = escapeHtml(placeholder);
  const safeType = escapeHtml(type);
  const labelHtml = label
    ? `<label class="my-input__label" for="${safeName}">${escapeHtml(label)}</label>`
    : "";

  return `<div class="my-input">${labelHtml}<input id="${safeName}" name="${safeName}" type="${safeType}" value="${safeValue}" placeholder="${safePlaceholder}" /></div>`;
}
