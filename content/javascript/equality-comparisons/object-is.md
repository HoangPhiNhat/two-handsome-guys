# Object.is()

## Khái niệm (What)

`Object.is()` (ES6) so sánh giống `===` nhưng xử lý **đúng** 2 edge case mà `===` sai:
- `NaN` bằng `NaN`
- `+0` khác `-0`

## Cách dùng (Usage)

```js
Object.is(NaN, NaN);   // true  ✅ (=== trả false)
Object.is(+0, -0);     // false ✅ (=== trả true)
Object.is(1, 1);       // true
Object.is("a", "a");   // true
Object.is(null, null); // true
Object.is({}, {});     // false — vẫn so tham chiếu
```

## Khi nào dùng (When)

- Cần phân biệt `+0` và `-0` (toán học, physical simulation)
- Cần kiểm tra `NaN` bằng so sánh thay vì `Number.isNaN()`
- **Hiếm dùng** trong code thường — `===` đủ cho 99% trường hợp

## So sánh 3 phương thức

| Biểu thức | `==` | `===` | `Object.is()` |
|-----------|------|-------|---------------|
| `NaN, NaN` | `false` | `false` | `true` ✅ |
| `+0, -0` | `true` | `true` | `false` ✅ |
| `0, false` | `true` | `false` | `false` |
| `"", false` | `true` | `false` | `false` |
| `null, undefined` | `true` | `false` | `false` |
