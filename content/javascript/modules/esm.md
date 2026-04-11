# ES Modules (import / export)

## Khái niệm (What)

ES Modules (ESM) là hệ thống module **chính thức** của JavaScript (ES2015). Cho phép chia code thành file riêng biệt, quản lý dependency rõ ràng, và tree-shake (loại code không dùng).

## Cách dùng (Usage)

### Named Export / Import

```js
// math.js
export function cong(a, b) { return a + b; }
export function tru(a, b) { return a - b; }
export const PI = 3.14159;

// main.js
import { cong, tru, PI } from "./math.js";
cong(1, 2); // 3

// Rename khi import
import { cong as add } from "./math.js";

// Import tất cả
import * as math from "./math.js";
math.cong(1, 2);
```

### Default Export / Import

```js
// User.js
export default class User {
  constructor(name) { this.name = name; }
}

// main.js
import User from "./User.js"; // tên tùy chọn
import TenGi from "./User.js"; // cũng OK — default không gắn tên
```

### Re-export

```js
// index.js — barrel file
export { cong, tru } from "./math.js";
export { default as User } from "./User.js";
```

### Dynamic Import (ES2020)

```js
// Load khi cần — trả Promise
const { cong } = await import("./math.js");

// Dùng cho code splitting, lazy loading
button.addEventListener("click", async () => {
  const { Chart } = await import("./chart.js");
  new Chart(canvas);
});
```

## So sánh ESM vs CommonJS

| | ESM (`import/export`) | CommonJS (`require/module.exports`) |
|-|----------------------|-------------------------------------|
| Môi trường | Browser + Node | Node (truyền thống) |
| Loading | **Static** (compile time) | Dynamic (runtime) |
| Tree-shaking | ✅ | ❌ |
| Top-level await | ✅ | ❌ |
| File extension | `.mjs` hoặc `"type": "module"` | `.cjs` hoặc mặc định |

## Best Practices

- ✅ **ESM** cho mọi project mới — cả browser và Node
- ✅ **Named export** mặc định — rõ ràng, refactor-friendly, tree-shakeable
- ✅ **Barrel file** (`index.js`) cho public API — nhưng cẩn thận bundle size
- ✅ **Dynamic import** cho lazy loading — giảm initial bundle

## Pitfalls

- ❌ **Circular import** — A import B, B import A → có thể nhận `undefined`
- ❌ Barrel file re-export TẤT CẢ → tree-shaking kém nếu bundler không tốt
- ❌ Quên `"type": "module"` trong `package.json` → Node mặc định CJS
- ❌ ESM path phải có **extension** trong browser: `"./math.js"` (không phải `"./math"`)
