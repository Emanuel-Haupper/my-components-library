import { escapeHtml } from "../utils/stringFormatter.ts";

type MyTableProps = {
  columns?: Array<string | { key: string; label?: string }>;
  rows?: Array<Record<string, any>>;
};

export function MyTable({ columns = [], rows = [] }: MyTableProps) {
  const normalizedColumns = columns.map((column) =>
    typeof column === "string" ? { key: column, label: column } : column,
  );

  const header = normalizedColumns
    .map((column) => `<th>${escapeHtml(column.label ?? column.key ?? "")}</th>`)
    .join("");

  const body = rows
    .map((row) => {
      const cells = normalizedColumns
        .map((column) => `<td>${escapeHtml(row?.[column.key] ?? "")}</td>`)
        .join("");

      return `<tr>${cells}</tr>`;
    })
    .join("");

  return `<table class="my-table"><thead><tr>${header}</tr></thead><tbody>${body}</tbody></table>`;
}
