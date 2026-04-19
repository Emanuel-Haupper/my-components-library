# components-library

Reusable React + TypeScript UI library used by Space Explorer, designed to be shared across apps with Git submodules or direct copy.

## What Is Included

The library is exported through `index.ts`, which re-exports:

- UI components from `components/index.ts`
- Utility helpers from `utils/index.ts`

### UI Components

- Badge
- BorderGlow
- CustomButton
- FilterPanel
- SearchInput
- RangeSlider
- PageHeader
- StatCard
- DataTable
- Topbar
- Footer
- HeroSection
- Content

### Utils

- formatDate
- escapeHtml
- formatTitleCase
- truncate

## Setup In Any Project

### Option 1: Use As A Git Submodule (Recommended)

1. Add the library as a submodule:

```bash
git submodule add https://github.com/Emanuel-Haupper/my-components-library.git src/_my-components
```

2. Initialize and fetch submodules after cloning:

```bash
git submodule update --init --recursive
```

3. Import from the library entrypoint:

```ts
import { Topbar, Footer, Content, CustomButton } from './_my-components/index.ts'
```

4. Load library theme variables in your app stylesheet:

```css
@import './_my-components/components/css/theme.css';
```

5. Optionally map your app theme tokens to library tokens:

```css
:root {
  --mc-accent: var(--accent);
  --mc-text: var(--text);
  --mc-surface: var(--surface);
}
```

### Option 2: Copy The Folder Directly

1. Copy the full components-library folder into your project (for example into `src/_my-components`).
2. Keep the same internal structure so paths continue working.
3. Import from `./_my-components/index.ts` in your app code.
4. Import the library `theme.css` once in your app stylesheet.

## Usage Example

```tsx
import { Topbar, Content, DataTable, Badge, formatDate } from './_my-components/index.ts'

const rows = [
  { name: 'Apollo 11', date: formatDate('1969-07-16'), status: 'Completed' },
  { name: 'Artemis II', date: formatDate('2025-01-01'), status: 'Active' },
]

const columns = [
  { key: 'name', label: 'Mission' },
  { key: 'date', label: 'Launch Date' },
  { key: 'status', label: 'Status', render: (v: string) => <Badge label={v} /> },
]
```

## Keeping The Submodule Updated

From your app repo root:

1. Pull latest changes inside submodule:

```bash
git -C src/_my-components checkout main
git -C src/_my-components pull origin main
```

2. Commit the updated submodule pointer in your app:

```bash
git add src/_my-components
git commit -m "Update components-library submodule"
```

## Notes

- Keep imports pointed to the library entrypoint to avoid deep import churn.
- Prefer library components for shared UI patterns to keep apps consistent.
- App-specific visuals can still live outside the library (example: heavy scene or page-specific effects).
