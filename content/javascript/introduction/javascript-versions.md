# Phiên bản JavaScript (ECMAScript)

## Khái niệm (What)

JavaScript tuân theo đặc tả **ECMAScript** (viết tắt ES). Từ 2015 trở đi, TC39 phát hành **một bản mới mỗi năm**, đặt tên theo năm: ES2015, ES2016, …, ES2024.

## Cách đánh tên phiên bản

| Tên gọi | Giải thích |
|---------|-----------|
| **ES5** | ECMAScript 5 (2009) — bản nền tảng |
| **ES6 / ES2015** | Bản cách mạng năm 2015 (hai tên cùng chỉ một bản) |
| **ES2016, ES2017, …** | Tên theo năm (mô hình cập nhật hàng năm) |
| **ESNext** | Thuật ngữ chỉ các tính năng **đang ở stage 3-4**, sẽ vào bản tiếp theo |

## Quy trình đề xuất tính năng mới (TC39 Stages)

Mỗi tính năng mới trải qua 5 giai đoạn:

| Stage | Tên | Ý nghĩa |
|-------|-----|---------|
| 0 | Strawperson | Ý tưởng ban đầu |
| 1 | Proposal | Có champion (người bảo trợ), xác định vấn đề |
| 2 | Draft | Cú pháp và ngữ nghĩa cơ bản được mô tả |
| 3 | Candidate | Đặc tả hoàn chỉnh, đang được engine triển khai |
| 4 | Finished | Vào chuẩn chính thức trong bản ES năm sau |

## Tính năng quan trọng theo phiên bản

### ES5 (2009) — Nền tảng

```js
"use strict";
var arr = [1, 2, 3];
arr.forEach(function(item) { console.log(item); });
JSON.parse('{"a":1}');
Object.keys({ x: 1, y: 2 }); // ["x", "y"]
```

### ES2015/ES6 — Bản cách mạng

```js
// let/const thay var
const PI = 3.14;
let dem = 0;

// Arrow function
const binhPhuong = (x) => x * x;

// Template literal
const ten = "An";
console.log(`Chào ${ten}!`);

// Destructuring
const { x, y } = { x: 1, y: 2 };

// Class
class Nguoi {
  constructor(ten) { this.ten = ten; }
}

// Promise
fetch("/api").then(res => res.json());

// Module
// import { cong } from "./math.js";
```

### ES2017 — async/await

```js
async function layDuLieu() {
  const res = await fetch("/api/users");
  const data = await res.json();
  return data;
}
```

### ES2020 — Optional chaining & Nullish coalescing

```js
const tinh = user?.hoSo?.diaChi?.tinh; // undefined nếu bất kỳ mắt xích nào null/undefined
const port = config.port ?? 3000;       // chỉ fallback khi null/undefined (không fallback 0 hay "")
```

### ES2022 — Top-level await & Array.at()

```js
// Top-level await (trong module)
const data = await fetch("/api").then(r => r.json());

// Array.at() — index âm
const arr = [1, 2, 3];
arr.at(-1); // 3
```

### ES2023 — Immutable array methods

```js
const arr = [3, 1, 2];
const sorted = arr.toSorted((a, b) => a - b); // [1, 2, 3] — arr không đổi!
const reversed = arr.toReversed(); // [2, 1, 3] — arr không đổi!
```

## Kiểm tra hỗ trợ môi trường

```js
// Cách kiểm tra runtime: thử feature detection
const coOptionalChaining = (() => {
  try {
    return eval("({})?.a") === undefined;
  } catch {
    return false;
  }
})();
```

**Công cụ thực tế:**
- [caniuse.com](https://caniuse.com) — kiểm tra hỗ trợ trình duyệt
- [node.green](https://node.green) — kiểm tra hỗ trợ Node.js
- **Babel** — transpile code mới thành ES5 cho trình duyệt cũ
- **TypeScript** — biên dịch ra target ES version tùy chọn

## Best Practices

- ✅ Viết code theo **chuẩn ES mới nhất**, dùng Babel/TypeScript để compile xuống target cần thiết
- ✅ Kiểm tra **caniuse** trước khi dùng API web mới trên production
- ✅ Đọc **release notes** hàng năm để cập nhật tính năng mới
- ✅ Ưu tiên tính năng mới nếu giúp code **rõ ràng hơn** (`?.` thay chuỗi `&&`, `.at(-1)` thay `arr[arr.length - 1]`)

## Pitfalls

- ❌ **"Chọn phiên bản JS" như chọn phiên bản app** → Bạn viết theo chuẩn ES mới và dùng build tool để đảm bảo chạy
- ❌ **Dùng polyfill cho mọi thứ** → Chỉ polyfill những gì target browser thực sự thiếu
- ❌ **Bỏ qua ES5** → Nhiều dự án legacy vẫn dùng, cần đọc hiểu
