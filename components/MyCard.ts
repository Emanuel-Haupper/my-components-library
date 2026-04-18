import { escapeHtml } from "../utils/stringFormatter.ts";

type MyCardProps = {
  title?: string;
  content?: string;
  footer?: string;
};

export function MyCard({ title = "", content = "", footer = "" }: MyCardProps) {
  const titleHtml = title ? `<h3 class="my-card__title">${escapeHtml(title)}</h3>` : "";
  const contentHtml = `<div class="my-card__content">${escapeHtml(content)}</div>`;
  const footerHtml = footer ? `<div class="my-card__footer">${escapeHtml(footer)}</div>` : "";

  return `<section class="my-card">${titleHtml}${contentHtml}${footerHtml}</section>`;
}
