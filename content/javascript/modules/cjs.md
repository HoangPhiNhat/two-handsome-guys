# CommonJS (CJS)

## Khái niệm (What)

CommonJS là hệ thống module **truyền thống** của Node.js, dùng `require()` để import và `module.exports` để export. Đang dần được thay thế bởi ESM nhưng vẫn rất phổ biến.

## Cách dùng (Usage)

```js
// math.js
function cong(a, b) { return a + b; }
function tru(a, b) { return a - b; }
module.exports = { cong, tru };
// hoặc: exports.cong = cong;

// main.js
const { cong, tru } = require("./math");
cong(1, 2); // 3

// Default-like
module.exports = class User { /* ... */ };
const User = require("./User");
```

### Dynamic require (runtime)

```js
// Load có điều kiện
const db = process.env.DB === "mysql"
  ? require("./db/mysql")
  : require("./db/postgres");
```

## Khi nào dùng (When)

- **Node.js legacy** — dự án chưa chuyển sang ESM
- **Config files** — `webpack.config.js`, `jest.config.js` (nhiều tool vẫn dùng CJS)
- **Chuyển dần** sang ESM cho project mới

## Pitfalls

- ❌ **Không tree-shakeable** — bundler không loại code không dùng
- ❌ **Synchronous** — `require` block execution
- ❌ **Không dùng** trong browser native (cần bundler)
