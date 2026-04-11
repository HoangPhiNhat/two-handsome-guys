# Strict Equality (`===`)

## Khái niệm (What)

`===` so sánh **không ép kiểu**: nếu hai vế khác kiểu → `false` ngay. Đây là cách so sánh **khuyên dùng mặc định**.

## Quy tắc

1. Khác kiểu → `false`
2. Cùng kiểu → so giá trị (primitive) hoặc so tham chiếu (object)
3. `NaN !== NaN` (ngoại lệ duy nhất)
4. `+0 === -0` → `true`

```js
1 === "1";           // false — khác kiểu
0 === false;         // false — khác kiểu
null === undefined;  // false — khác kiểu
NaN === NaN;         // false — ngoại lệ!

// Object — so THAM CHIẾU
const a = [1, 2];
const b = [1, 2];
a === b;             // false — hai object khác nhau
a === a;             // true  — cùng tham chiếu
```

## Best Practices

- ✅ **Mặc định dùng `===` và `!==`** cho mọi so sánh
- ✅ Dùng `Number.isNaN()` kiểm tra NaN (vì `NaN !== NaN`)
- ✅ So sánh nội dung object: dùng custom function hoặc thư viện (lodash `_.isEqual`)

## Pitfalls

- ❌ `NaN === NaN` → `false` — phải dùng `Number.isNaN()`
- ❌ `+0 === -0` → `true` — dùng `Object.is()` nếu cần phân biệt
