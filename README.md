# components-library

A simple base library with reusable `My`-prefixed UI components and formatting helpers.

## Structure

- `/components`
  - `MyButton`
  - `MyTable`
  - `MyCard`
  - `MyInput`
- `/utils`
  - `formatDate`
  - `formatTitleCase`
  - `truncate`

## Usage

```js
import { MyButton, MyTable, formatDate } from './index.js';

const button = MyButton({ label: 'Save', variant: 'primary' });
const table = MyTable({
  columns: [{ key: 'name', label: 'Name' }, { key: 'joined', label: 'Joined' }],
  rows: [{ name: 'Alice', joined: formatDate('2026-04-18') }],
});
```

Open `/examples/demo.html` in a browser to view rendered components.
