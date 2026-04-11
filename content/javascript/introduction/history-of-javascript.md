# Lịch sử JavaScript

## Khái niệm (What)

Hiểu lịch sử giúp bạn biết **tại sao** JavaScript có những quirk (hành vi kỳ lạ) nhất định, và đặt đúng chỗ cho các tính năng "cũ" (`var`, `arguments`) và "mới" (module ESM, `class`, `?.`) trong cùng một codebase.

## Dòng thời gian quan trọng

### 1995 — Ra đời

- **Brendan Eich** tạo ra **Mocha** tại Netscape trong **10 ngày**
- Đổi tên: Mocha → LiveScript → **JavaScript** (tên mang tính marketing, chạy theo hype Java lúc đó)
- Mục tiêu ban đầu: thêm logic nhẹ vào trình duyệt, bổ sung cho HTML/CSS

### 1997 — Chuẩn hóa ECMAScript

- ECMA đưa ra chuẩn **ECMA-262**, gọi là **ECMAScript**
- JavaScript là **triển khai** (implementation) phổ biến nhất của ECMAScript

### 2005–2009 — Thời kỳ Ajax & jQuery

- **Ajax** (Asynchronous JavaScript and XML) thay đổi cách xây dựng web app
- **jQuery** (2006) trở thành thư viện phổ biến nhất, giúp thao tác DOM dễ dàng
- **ES5** (2009): `strict mode`, `JSON`, `forEach`, `map`, `filter`, `Object.keys`

### 2009 — Node.js ra đời

- **Ryan Dahl** tạo **Node.js** — đưa JavaScript ra ngoài trình duyệt
- Cho phép viết backend bằng JS → khái niệm **full-stack JavaScript** bắt đầu

### 2015 — ES6/ES2015 (Bản cách mạng)

- Bản lớn nhất trong lịch sử: `let`/`const`, `class`, `module`, `arrow function`, `Promise`, `template literals`, `destructuring`, `Symbol`, `Map`/`Set`, …
- Thay đổi hoàn toàn cách viết JavaScript hiện đại

### 2016+ — Cập nhật hàng năm

| Năm | Tính năng tiêu biểu |
|------|-------------------|
| ES2016 | `**` (lũy thừa), `Array.prototype.includes` |
| ES2017 | `async`/`await`, `Object.entries`/`values` |
| ES2018 | Rest/spread cho object, `Promise.finally` |
| ES2020 | Optional chaining `?.`, nullish `??`, `BigInt` |
| ES2021 | Logical assignment (`??=`, `||=`), `WeakRef` |
| ES2022 | Top-level `await`, `Array.at()`, private class fields `#` |
| ES2023 | `Array.findLast()`, `Array.toSorted()` (immutable) |
| ES2024 | `Object.groupBy()`, `Promise.withResolvers()` |

## Engine cạnh tranh

Các engine JavaScript liên tục cạnh tranh về hiệu năng:

| Engine | Trình duyệt / Runtime | Công ty |
|--------|----------------------|---------|
| **V8** | Chrome, Edge, Node.js, Deno | Google |
| **SpiderMonkey** | Firefox | Mozilla |
| **JavaScriptCore** | Safari, Bun | Apple |

```js
// Cách kiểm tra môi trường runtime
if (typeof window !== "undefined") {
  console.log("Đang chạy trong trình duyệt");
} else if (typeof process !== "undefined") {
  console.log("Có thể đang chạy trên Node.js");
}
```

## Tại sao cần biết lịch sử (Why)

- **Đọc code cũ**: hiểu tại sao dùng `var`, `arguments`, IIFE, jQuery pattern
- **Chọn tính năng đúng**: biết API nào cần polyfill cho trình duyệt cũ
- **Phỏng vấn**: câu hỏi về lịch sử JS rất phổ biến
- **Debug quirks**: nhiều hành vi kỳ lạ (`typeof null === "object"`) là do lỗi lịch sử không thể sửa

## Pitfalls

- ❌ **Nghĩ ES6 là phiên bản mới nhất** → ECMAScript cập nhật hàng năm, bản mới nhất là ES2024
- ❌ **Dùng tính năng mới mà không kiểm tra hỗ trợ** → Kiểm tra trên [caniuse.com](https://caniuse.com) hoặc [MDN](https://developer.mozilla.org)
- ❌ **Bỏ qua code legacy** → Rất nhiều dự án vẫn chạy ES5, cần hiểu để bảo trì
