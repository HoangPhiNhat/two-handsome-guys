# Strict Mode

## Khái niệm (What)

`"use strict"` bật chế độ **nghiêm ngặt** — biến nhiều lỗi im lặng thành ngoại lệ, cấm cú pháp xấu, và chuẩn bị cho tính năng tương lai. ES Module tự động **strict mode**.

## Cách bật

```js
// Đầu file — strict toàn bộ file
"use strict";

// Đầu hàm — strict chỉ trong hàm
function strict() {
  "use strict";
  // code strict tại đây
}

// ES Module — tự động strict
// <script type="module">, import/export
```

## Thay đổi quan trọng (What changes)

### 1. Biến phải khai báo

```js
"use strict";
x = 10; // ❌ ReferenceError (non-strict: tạo global ngầm)
```

### 2. Gán thuộc tính read-only → lỗi

```js
"use strict";
const obj = Object.freeze({ a: 1 });
obj.a = 2; // ❌ TypeError (non-strict: im lặng thất bại)
```

### 3. `this` trong function là `undefined`

```js
"use strict";
function fn() { console.log(this); } // undefined (non-strict: window)
```

### 4. Cấm duplicate parameter

```js
// ❌ SyntaxError
function f(a, a) {} // non-strict: cho phép (!)
```

### 5. Cấm `with` statement, octal literal `0123`

### 6. `delete` biến → lỗi

```js
"use strict";
let x = 1;
delete x; // ❌ SyntaxError
```

## Khi nào dùng (When)

- **Luôn luôn** — không có lý do không dùng strict mode
- Dùng ES Module (`import`/`export`) → tự động strict
- Dùng class → method tự động strict

## Best Practices

- ✅ Dùng **ES Module** (tự động strict) cho mọi dự án mới
- ✅ Thêm `"use strict"` cho script cũ chưa chuyển module
- ✅ ESLint rule `strict` — buộc strict mode

## Pitfalls

- ❌ Thêm strict vào giữa file → **không hiệu lực** (phải ở đầu file hoặc đầu hàm)
- ❌ Strict mode có thể **break code cũ** — test kỹ khi bật retroactively
