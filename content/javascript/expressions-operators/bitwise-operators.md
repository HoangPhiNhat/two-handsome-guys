# Toán tử Bitwise

## Khái niệm (What)

Toán tử bitwise thao tác trực tiếp trên **bit** của số nguyên 32-bit có dấu (Int32). Engine chuyển toán hạng sang Int32, thực hiện phép toán, rồi chuyển kết quả về Number.

## Bảng toán tử

| Toán tử | Tên | Ví dụ | Bit operation |
|---------|-----|-------|-------------|
| `&` | AND | `5 & 3` → `1` | `0101 & 0011 = 0001` |
| `\|` | OR | `5 \| 3` → `7` | `0101 \| 0011 = 0111` |
| `^` | XOR | `5 ^ 3` → `6` | `0101 ^ 0011 = 0110` |
| `~` | NOT | `~5` → `-6` | Đảo tất cả bit |
| `<<` | Dịch trái | `5 << 1` → `10` | Nhân 2 |
| `>>` | Dịch phải có dấu | `5 >> 1` → `2` | Chia 2 (giữ dấu) |
| `>>>` | Dịch phải không dấu | `-1 >>> 0` → `4294967295` | Chuyển sang unsigned |

## Cách dùng (Usage)

```js
// AND — kiểm tra bit cụ thể
const READ = 0b100;    // 4
const WRITE = 0b010;   // 2
const EXEC = 0b001;    // 1

const permission = READ | WRITE; // 6 = 0b110

// Kiểm tra quyền
(permission & READ) !== 0;  // true — có quyền READ
(permission & EXEC) !== 0;  // false — không có quyền EXEC

// Thêm quyền
const withExec = permission | EXEC; // 7 = 0b111

// Xóa quyền
const noWrite = permission & ~WRITE; // 4 = 0b100
```

### Trick phổ biến

```js
// Làm tròn xuống (thay Math.floor cho số dương)
~~3.7;         // 3
3.7 | 0;       // 3
3.7 >> 0;      // 3

// Nhân/chia lũy thừa 2
8 << 1;        // 16 (nhân 2)
8 >> 1;        // 4  (chia 2)

// Kiểm tra chẵn lẻ
(7 & 1) === 0; // false — lẻ
(8 & 1) === 0; // true  — chẵn

// Hoán đổi không cần biến tạm (XOR swap)
let a = 5, b = 3;
a ^= b; b ^= a; a ^= b;
// a = 3, b = 5
```

## Khi nào dùng (When)

- **Hệ thống permission/flag** — hiệu quả bộ nhớ
- **Xử lý màu RGB** — `(r << 16) | (g << 8) | b`
- **Game/Graphics** — bitfield, canvas pixel manipulation
- **Thuật toán tối ưu** — competitive programming

## Pitfalls

- ❌ Bitwise chuyển sang **Int32** — mất precision với số lớn hơn 2^31
- ❌ `~` không phải "đảo boolean" — `~0` → `-1`, `~-1` → `0`
- ❌ Code bitwise **khó đọc** — luôn comment giải thích ý đồ
- ❌ `~~` trick chỉ đúng với **số dương** — `~~(-3.7)` → `-3` (không phải -4 như Math.floor)
