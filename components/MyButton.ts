import { escapeHtml } from "../utils/stringFormatter.js";

type MyButtonProps = {
  label?: string;
  icon?: string;
  variant?: "primary" | "secondary" | "danger";
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
};

export function MyButton({
  label = "Button",
  variant = "primary",
  type = "button",
  disabled = false,
}: MyButtonProps) {
  const safeLabel = escapeHtml(label);
  const safeVariant = escapeHtml(variant);
  const safeType = escapeHtml(type);
  const disabledAttribute = disabled ? " disabled" : "";

  return `<button class="my-button my-button--${safeVariant}" type="${safeType}"${disabledAttribute}>${safeLabel}</button>`;
}
