# Toán tử với BigInt

## Khái niệm (What)

`BigInt` biểu diễn **số nguyên lớn tùy ý** (giới hạn bởi bộ nhớ thực tế), dùng khi số vượt quá `Number.MAX_SAFE_INTEGER` (2^53 - 1). Hầu hết toán tử số học và bitwise đều hoạt động với BigInt nhưng có quy tắc riêng.

## Cách dùng (Usage)

```js
const a = 10n;
const b = 3n;
a + b;   // 13n
a - b;   // 7n
a * b;   // 30n
a / b;   // 3n — chia nguyên, CẮT phần thập phân
a % b;   // 1n
a ** b;  // 1000n
```

### Quy tắc trộn kiểu

```js
// ❌ KHÔNG được trộn BigInt với Number
// 1n + 1;        // TypeError: Cannot mix BigInt and other types

// ✅ Ép kiểu rõ ràng
Number(1n) + 1;    // 2 — mất precision nếu số lớn
1n + BigInt(1);    // 2n
```

### So sánh BigInt với Number

```js
1n < 2;    // true ✅ — so sánh lỏng OK
1n === 1;  // false — khác kiểu
1n == 1;   // true  — loose equality ép kiểu
```

## Khi nào dùng (When)

- ID từ database/API vượt quá 2^53
- Mã hóa, blockchain
- Tính toán tài chính chính xác (khi dùng số nguyên lớn)

## Pitfalls

- ❌ `JSON.stringify(1n)` → **TypeError** — BigInt không serialize được mặc định
- ❌ `Math.max(1n, 2n)` → **TypeError** — Math methods không hỗ trợ BigInt
- ❌ Chia BigInt = chia **nguyên**: `10n / 3n = 3n` (không phải 3.33n)
