# Hàm Built-in phổ biến

## Khái niệm (What)

JavaScript cung cấp nhiều **hàm toàn cục** (global functions) có thể gọi ở bất kỳ đâu mà không cần import.

## Danh sách hàm quan trọng

### Chuyển kiểu

```js
parseInt("42px", 10);       // 42 — parse số nguyên, LUÔN truyền radix
parseFloat("3.14abc");      // 3.14 — parse số thập phân
Number("42");               // 42 — strict hơn parseInt
String(42);                 // "42"
Boolean(1);                 // true
```

### Kiểm tra

```js
isNaN("abc");               // true  — ép kiểu rồi kiểm tra
Number.isNaN(NaN);          // true  — KHÔNG ép kiểu (recommended ✅)
isFinite(42);               // true
Number.isFinite(Infinity);  // false
```

### Encoding/Decoding URL

```js
encodeURIComponent("xin chào & hello"); // "xin%20ch%C3%A0o%20%26%20hello"
decodeURIComponent("xin%20ch%C3%A0o");  // "xin chào"
encodeURI("https://example.com/đường dẫn"); // encode URL đầy đủ (giữ :, /)
```

### Timer Functions

```js
// Trì hoãn
const id = setTimeout(() => console.log("sau 1s"), 1000);
clearTimeout(id); // hủy

// Lặp lại
const intervalId = setInterval(() => console.log("mỗi 2s"), 2000);
clearInterval(intervalId); // hủy
```

### Khác

```js
eval("1 + 2");              // 3 — ⚠️ TRÁNH: nguy hiểm, chậm
structuredClone({ a: 1 });  // { a: 1 } — deep clone (ES2022)
```

## Best Practices

- ✅ Dùng `Number.isNaN()` thay `isNaN()` — không ép kiểu ngầm
- ✅ Luôn truyền **radix** cho `parseInt(str, 10)`
- ✅ **TRÁNH `eval()`** — rủi ro bảo mật, khó debug, chậm
- ✅ Dùng `clearTimeout`/`clearInterval` khi component unmount

## Pitfalls

- ❌ `parseInt("08")` → có thể hiểu là bát phân ở engine cũ
- ❌ `isNaN("hello")` → `true` nhưng `Number.isNaN("hello")` → `false`
- ❌ `setTimeout(..., 0)` không chạy ngay — chờ call stack trống + microtask
