# Variable Declarations (var, let, const)

## Khái niệm (What)

Trong JavaScript, có 3 từ khóa để khai báo biến: `var`, `let`, và `const`. Mỗi cách có **phạm vi (scope)**, **hành vi hoisting**, và **quy tắc gán lại** khác nhau.

## Cách hoạt động (How)

Khi JavaScript engine đọc code, nó thực hiện 2 bước:
1. **Compilation phase**: quét tất cả khai báo biến, đăng ký chúng vào scope tương ứng
2. **Execution phase**: chạy code và gán giá trị

Sự khác biệt giữa `var`, `let`, `const` nằm ở cách engine xử lý ở bước 1.

## Cách dùng (Usage)

### `var` — Cách cũ (ES5 trở về trước)

```js
var ten = "Nguyen Van A";
var tuoi = 25;
var ten = "Nguyen Van B"; // có thể khai báo LẠI cùng tên — KHÔNG lỗi
```

**Đặc điểm:**
- **Function-scoped**: chỉ bị giới hạn trong hàm, KHÔNG bị giới hạn trong block `{}`
- Có thể **khai báo lại** nhiều lần mà không báo lỗi
- Bị **hoisting** lên đầu — tự động gán giá trị `undefined` trước khi chạy

```js
console.log(x); // undefined (không lỗi — đã hoisted!)
var x = 10;

if (true) {
  var blockVar = "tôi thoát ra ngoài block được";
}
console.log(blockVar); // "tôi thoát ra ngoài block được"
```

### `let` — ES6 (Khuyên dùng khi cần gán lại)

```js
let diemThi = 9.5;
diemThi = 8.0; // ✅ có thể gán lại
// let diemThi = 7; // ❌ LỖI: không thể khai báo lại cùng tên trong cùng scope
```

**Đặc điểm:**
- **Block-scoped**: bị giới hạn trong cặp `{}`
- Không thể khai báo lại trong cùng scope
- Bị hoisting nhưng **không được khởi tạo** → rơi vào **Temporal Dead Zone (TDZ)**

```js
if (true) {
  let blockLet = "chỉ tồn tại trong block này";
  console.log(blockLet); // ✅ OK
}
// console.log(blockLet); // ❌ LỖI: blockLet is not defined
```

### `const` — ES6 (Dùng mặc định)

```js
const PI = 3.14159;
// PI = 3; // ❌ LỖI: Assignment to constant variable

const NGUOI_DUNG = { ten: "An", tuoi: 20 };
NGUOI_DUNG.tuoi = 21; // ✅ OK — thuộc tính bên trong CÓ THỂ thay đổi
// NGUOI_DUNG = {}; // ❌ LỖI — không thể gán lại tham chiếu
```

> **Lưu ý quan trọng:** `const` ngăn **gán lại tham chiếu** (reference), không ngăn **thay đổi nội dung** (mutation) bên trong object/array.

## Bảng so sánh `var` / `let` / `const`

| Đặc điểm | `var` | `let` | `const` |
|----------|:-----:|:-----:|:-------:|
| Scope | Function | Block | Block |
| Hoisting | ✅ (khởi tạo `undefined`) | ✅ (TDZ — không truy cập được) | ✅ (TDZ) |
| Khai báo lại cùng scope | ✅ | ❌ | ❌ |
| Gán lại giá trị | ✅ | ✅ | ❌ |
| Gắn vào `window` (global) | ✅ | ❌ | ❌ |
| **Khuyến nghị** | ❌ Tránh dùng | ✅ Khi cần gán lại | ✅ **Ưu tiên mặc định** |

## Khi nào dùng (When)

```js
// const — mặc định, chiếm ~90% khai báo
const API_URL = "https://api.example.com";
const nguoiDung = { ten: "An" };
const danhSach = [1, 2, 3];

// let — khi cần gán lại giá trị
let dem = 0;
for (let i = 0; i < 5; i++) {
  dem += i;
}

// var — KHÔNG dùng trong code mới (chỉ đọc hiểu code cũ)
```

## Best Practices

- ✅ **Mặc định dùng `const`**, chỉ chuyển sang `let` khi thực sự cần gán lại
- ✅ **Khai báo biến ở đầu scope** để dễ đọc
- ✅ **Một biến = một mục đích**: tránh tái sử dụng biến cho ý nghĩa khác
- ✅ **Đặt tên có nghĩa**: `soLuongSanPham` thay vì `n`

## Pitfalls (Lỗi thường gặp)

### 1. Nhầm `const` === immutable

```js
const arr = [1, 2, 3];
arr.push(4);      // ✅ OK — mutation nội dung
console.log(arr); // [1, 2, 3, 4]
// arr = [5, 6]; // ❌ LỖI — gán lại tham chiếu
```

**Muốn immutable thật sự?** Dùng `Object.freeze()`:
```js
const config = Object.freeze({ port: 3000 });
config.port = 8080; // Im lặng thất bại (strict mode sẽ lỗi)
```

### 2. Vòng lặp `var` + closure

```js
// ❌ Bug kinh điển
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 10);
}
// Log: 3, 3, 3 — vì var là function-scoped, chỉ có 1 biến i

// ✅ Fix: dùng let
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 10);
}
// Log: 0, 1, 2 — let tạo binding mới mỗi lần lặp
```

### 3. Quên khai báo biến → tạo global ngầm

```js
function loi() {
  tenBien = "oops"; // quên let/const → gắn vào global (window)!
}
// strict mode sẽ throw ReferenceError → luôn bật strict mode
```

## Ví dụ thực tế (Real-world)

```js
// Trong một component React / Express handler
const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000; // const — không đổi
let requestCount = 0;                  // let — sẽ tăng dần

app.get("/", (req, res) => {
  requestCount++; // cần gán lại → let
  res.json({ message: "Hello", requests: requestCount });
});

app.listen(PORT); // PORT là const
```
