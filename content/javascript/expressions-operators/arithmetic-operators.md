# Toán tử số học (Arithmetic Operators)

## Khái niệm (What)

Toán tử số học thực hiện các phép tính toán học cơ bản trên **Number** (và **BigInt**).

## Bảng toán tử

| Toán tử | Tên | Ví dụ | Kết quả |
|---------|-----|-------|---------|
| `+` | Cộng / Nối chuỗi | `5 + 3` | `8` |
| `-` | Trừ | `5 - 3` | `2` |
| `*` | Nhân | `5 * 3` | `15` |
| `/` | Chia | `5 / 2` | `2.5` |
| `%` | Phần dư (Modulo) | `5 % 2` | `1` |
| `**` | Lũy thừa (ES2016) | `2 ** 3` | `8` |

## Cách dùng (Usage)

```js
// Cơ bản
10 + 3;   // 13
10 - 3;   // 7
10 * 3;   // 30
10 / 3;   // 3.3333...
10 % 3;   // 1 — phần dư
2 ** 10;  // 1024 — lũy thừa

// Modulo thực tế: kiểm tra chẵn/lẻ
const isEven = (n) => n % 2 === 0;
isEven(4); // true
isEven(7); // false

// Lũy thừa thực tế
const KB = 2 ** 10; // 1024
const MB = 2 ** 20; // 1_048_576
```

### Toán tử `+` — Hai vai trò

```js
// Cộng số
5 + 3;       // 8

// Nối chuỗi (nếu MỘT VẾ là chuỗi)
"5" + 3;     // "53" ⚠️
3 + "5";     // "35" ⚠️
"a" + "b";   // "ab"

// Nhiều vế — từ trái sang phải
1 + 2 + "3"; // "33" (1+2=3, 3+"3"="33")
"1" + 2 + 3; // "123" ("1"+2="12", "12"+3="123")
```

### Vấn đề dấu phẩy động (IEEE 754)

```js
0.1 + 0.2;                    // 0.30000000000000004 ⚠️
0.1 + 0.2 === 0.3;            // false!

// Giải pháp 1: So sánh với epsilon
Math.abs(0.1 + 0.2 - 0.3) < Number.EPSILON; // true

// Giải pháp 2: Làm tròn
+(0.1 + 0.2).toFixed(2);      // 0.3

// Giải pháp 3: Tính bằng cent (số nguyên) cho tiền tệ
const tien = 10 + 20;         // 30 cent → 0.30 đồng
```

## Best Practices

- ✅ Khi tính tiền, dùng **số nguyên** (cent/xu) rồi chia cuối cùng
- ✅ Ép kiểu rõ ràng trước khi cộng: `Number(input) + 3`
- ✅ Dùng `**` thay `Math.pow()` — ngắn gọn hơn

## Pitfalls

- ❌ `"5" + 3` là `"53"` — toán tử `+` ưu tiên nối chuỗi
- ❌ `0.1 + 0.2 !== 0.3` — lỗi dấu phẩy động IEEE 754
- ❌ `Infinity - Infinity` → `NaN`
- ❌ `1 / 0` → `Infinity` (không throw error)
