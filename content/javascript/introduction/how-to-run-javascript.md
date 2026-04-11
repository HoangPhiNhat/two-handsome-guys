# Chạy JavaScript ở đâu?

## Khái niệm (What)

JavaScript có thể chạy ở nhiều môi trường khác nhau. Mỗi môi trường cung cấp một **runtime** với các API riêng (trình duyệt có `document`, `window`; Node.js có `fs`, `process`).

## Các môi trường chạy JavaScript

### 1. Trình duyệt (Browser)

Cách phổ biến nhất, mọi trình duyệt hiện đại đều có JS engine built-in.

```html
<!-- Cách 1: File ngoài (khuyến nghị) -->
<script src="app.js"></script>

<!-- Cách 2: Inline (tránh trong production) -->
<script>
  document.body.textContent = "Xin chào!";
</script>

<!-- Cách 3: ES Module (hiện đại) -->
<script type="module" src="./main.js"></script>
```

**DevTools Console** — chạy thử từng dòng, debug nhanh:
- Windows/Linux: `F12` hoặc `Ctrl + Shift + J`
- macOS: `Cmd + Option + J`

### 2. Node.js

Runtime chạy JavaScript **ngoài trình duyệt**, dùng cho backend, CLI tools, scripting.

```bash
# Cài đặt: https://nodejs.org
node --version          # kiểm tra phiên bản
node app.js             # chạy file
node                    # mở REPL tương tác
```

```js
// app.js — chạy trên Node.js
const os = require("os");
console.log(`Hệ điều hành: ${os.platform()}`);
console.log(`RAM: ${Math.round(os.totalmem() / 1e9)} GB`);
```

### 3. Deno và Bun — Các runtime mới

| Runtime | Đặc điểm | Engine |
|---------|----------|--------|
| **Deno** | Bảo mật mặc định (cần flag permission), hỗ trợ TypeScript native | V8 |
| **Bun** | Tốc độ cực nhanh, tương thích Node.js, bundler built-in | JavaScriptCore |

```bash
# Deno
deno run app.ts

# Bun
bun run app.js
```

### 4. REPL và Playground Online

Không cần cài gì, mở trình duyệt và code ngay:

- **[CodePen](https://codepen.io)** — frontend (HTML/CSS/JS)
- **[StackBlitz](https://stackblitz.com)** — full-stack (Node.js trong browser)
- **[JSFiddle](https://jsfiddle.net)** — test nhanh
- **[RunJS](https://runjs.app)** — desktop app, chạy JS tức thì

### 5. Module trên trình duyệt

```html
<script type="module" src="./main.js"></script>
```

`type="module"` bật chế độ **ES Module**:
- Cho phép `import`/`export`
- **Strict mode** mặc định
- **Defer** mặc định (chờ HTML parse xong mới chạy)
- Scope riêng (không ô nhiễm global)

```js
// main.js
import { tinhtong } from "./math.js";
console.log(tinhtong(1, 2));

// math.js
export function tinhtong(a, b) {
  return a + b;
}
```

## Khi nào dùng môi trường nào (When)

| Mục đích | Môi trường khuyến nghị |
|----------|----------------------|
| Học JS cơ bản | DevTools Console, CodePen |
| Frontend / DOM | Trình duyệt + bundler (Vite) |
| Backend / API | Node.js (hoặc Bun/Deno) |
| CLI tools / Scripts | Node.js |
| Test nhanh ý tưởng | REPL (`node` command) hoặc RunJS |

## Best Practices

- ✅ Đặt `<script>` ở **cuối `<body>`** hoặc dùng `defer`/`type="module"` để không chặn render HTML
- ✅ Dùng `type="module"` cho dự án mới — tự động strict, scope riêng
- ✅ Dùng bundler (**Vite**, webpack) cho production — tối ưu code, tree-shaking

## Pitfalls

- ❌ **Dùng `<script>` inline cho logic phức tạp** → Khó bảo trì, không cache, không tái sử dụng
- ❌ **Quên `defer` hoặc đặt script ở `<head>`** → Script chạy trước khi DOM sẵn sàng → lỗi
- ❌ **Nhầm API giữa môi trường** → `document` không tồn tại trên Node.js, `require` không có trên browser
