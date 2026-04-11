# Loose Equality (`==`)

## Khái niệm (What)

`==` so sánh **sau khi ép kiểu** (coercion). Engine thực hiện **Abstract Equality Comparison** — chuyển đổi toán hạng cho đến khi cùng kiểu, rồi so sánh.

## Quy tắc ép kiểu

1. `null == undefined` → `true` (và chỉ bằng nhau, không bằng gì khác)
2. Number == String → String chuyển sang Number
3. Boolean so với bất kỳ → Boolean chuyển sang Number (true→1, false→0)
4. Object so với primitive → Object gọi `ToPrimitive()`

```js
0 == false;        // true  (false → 0)
"" == false;       // true  ("" → 0, false → 0)
"1" == 1;          // true  ("1" → 1)
null == undefined; // true  (đặc biệt)
null == 0;         // false (null chỉ == undefined)
NaN == NaN;        // false (NaN không bằng gì cả)
[] == false;       // true  ([] → "" → 0, false → 0)
```

## Khi nào dùng (When)

Trường hợp duy nhất hữu ích: kiểm tra `null` hoặc `undefined` cùng lúc:

```js
if (val == null) {
  // val là null HOẶC undefined
}
// Tương đương: if (val === null || val === undefined)
```

## Best Practices

- ✅ **Luôn dùng `===`** — tránh ép kiểu bất ngờ
- ✅ Exception: `x == null` để check cả null và undefined (nhiều style guide cho phép)

## Pitfalls

- ❌ `[] == ![]` → `true` — rất bất ngờ
- ❌ `"" == false` → `true` — chuỗi rỗng bằng false?
- ❌ Bảng == quá phức tạp → gần như không ai nhớ hết quy tắc
