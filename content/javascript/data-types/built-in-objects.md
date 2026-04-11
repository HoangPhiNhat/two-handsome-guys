# Đối tượng Built-in (Tiêu biểu)

## Khái niệm (What)

JavaScript cung cấp nhiều **object và hàm sẵn có** (built-in) trong môi trường chuẩn ECMAScript. Đây là những công cụ bạn dùng hàng ngày mà không cần install thêm.

## Nhóm Built-in chính

### 1. Object — Nền tảng

```js
Object.keys({ a: 1, b: 2 });      // ["a", "b"]
Object.values({ a: 1, b: 2 });    // [1, 2]
Object.entries({ a: 1, b: 2 });   // [["a",1], ["b",2]]
Object.assign({}, { a: 1 }, { b: 2 }); // { a: 1, b: 2 }
Object.freeze({ x: 1 });          // immutable (shallow)
Object.fromEntries([["a", 1]]);    // { a: 1 } — ES2019
```

### 2. Array — Mảng

```js
Array.isArray([]);                    // true
Array.from({ length: 3 }, (_, i) => i); // [0, 1, 2]
Array.of(1, 2, 3);                    // [1, 2, 3]
```

### 3. String, Number, Boolean — Wrapper primitives

```js
// Thường KHÔNG tạo tay — engine auto-box khi cần
String(123);    // "123"
Number("42");   // 42
Boolean(0);     // false
Number.isNaN(NaN);         // true
Number.isFinite(Infinity); // false
Number.parseInt("10px");   // 10
```

### 4. Math — Toán học (namespace, không phải constructor)

```js
Math.PI;                // 3.141592653589793
Math.max(1, 5, 3);      // 5
Math.min(1, 5, 3);      // 1
Math.floor(3.7);         // 3
Math.ceil(3.2);          // 4
Math.round(3.5);         // 4
Math.random();           // 0 ≤ x < 1
Math.abs(-5);            // 5
Math.pow(2, 3);          // 8 (hoặc 2 ** 3)
Math.sqrt(16);           // 4
Math.trunc(3.9);         // 3 — cắt phần thập phân

// Random số nguyên trong [min, max]
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
```

### 5. Date — Thời gian

```js
const now = new Date();
const specific = new Date("2024-01-15T10:30:00");

now.getFullYear();   // 2024
now.getMonth();      // 0-11 (⚠️ tháng bắt đầu từ 0!)
now.getDate();       // 1-31
now.getTime();       // milliseconds since epoch
now.toISOString();   // "2024-01-15T03:30:00.000Z"

// Tính khoảng cách thời gian
const diff = Date.now() - specific.getTime(); // milliseconds
```

### 6. JSON — Trao đổi dữ liệu

```js
const obj = { ten: "An", tuoi: 20 };
const str = JSON.stringify(obj);       // '{"ten":"An","tuoi":20}'
const parsed = JSON.parse(str);        // { ten: "An", tuoi: 20 }

// Pretty print
JSON.stringify(obj, null, 2);
```

### 7. Promise — Bất đồng bộ

```js
const p = Promise.resolve(42);
const results = await Promise.all([p1, p2, p3]);
const settled = await Promise.allSettled([p1, p2]);
```

### 8. Map, Set, WeakMap, WeakSet — Tập hợp hiện đại

```js
const map = new Map([["a", 1], ["b", 2]]);
const set = new Set([1, 2, 2, 3]); // {1, 2, 3}
```

### 9. RegExp — Biểu thức chính quy

```js
const re = /\d+/g;
"abc123def456".match(re); // ["123", "456"]
re.test("có số 42");      // true
```

### 10. Error — Lỗi

```js
throw new Error("Thông báo lỗi");
throw new TypeError("Sai kiểu");
throw new RangeError("Ngoài phạm vi");
```

### 11. Proxy & Reflect — Meta-programming (nâng cao)

```js
const handler = {
  get(target, prop) {
    return prop in target ? target[prop] : `Không có ${prop}`;
  }
};
const p = new Proxy({ ten: "An" }, handler);
console.log(p.ten);   // "An"
console.log(p.email); // "Không có email"
```

## Global Functions (Hàm toàn cục)

```js
parseInt("42px", 10);     // 42 — luôn truyền radix
parseFloat("3.14abc");    // 3.14
isNaN("abc");             // true (ép kiểu rồi check — dùng Number.isNaN thay)
isFinite(Infinity);       // false
encodeURIComponent("a b"); // "a%20b"
decodeURIComponent("a%20b"); // "a b"
```

## Khi nào dùng (When)

| Cần | Dùng |
|-----|------|
| Clone/merge object | `Object.assign`, spread `{...}`, `structuredClone` |
| Xử lý mảng | `Array.from`, `Array.isArray`, array methods |
| Random/math | `Math.random()`, `Math.floor()` |
| Thời gian | `Date`, hoặc thư viện (day.js, date-fns) |
| JSON API/config | `JSON.parse`/`stringify` |
| Pattern matching | `RegExp` |

## Best Practices

- ✅ Đọc MDN chi tiết cho từng method — hiểu edge cases
- ✅ Dùng `Number.isNaN()` thay `isNaN()` toàn cục
- ✅ Luôn truyền **radix** cho `parseInt()`: `parseInt("08", 10)`
- ✅ Cân nhắc thư viện cho Date phức tạp (day.js nhẹ hơn moment.js)
- ✅ Tránh `eval()` — cho phép chạy mã tùy ý, nguy hiểm bảo mật

## Pitfalls

- ❌ `Date.getMonth()` trả **0-11** (tháng 1 = 0) — rất dễ nhầm
- ❌ `JSON.stringify` bỏ qua `undefined`, `function`, `Symbol`
- ❌ `Math.random()` không phải cryptographically secure — dùng `crypto.getRandomValues()` cho bảo mật
- ❌ `parseInt("08")` có thể bị hiểu là bát phân ở engine cũ — luôn truyền radix 10
