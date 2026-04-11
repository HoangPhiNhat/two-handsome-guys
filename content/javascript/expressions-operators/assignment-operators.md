# Toán tử gán (Assignment Operators)

## Khái niệm (What)

Toán tử gán dùng để **gán giá trị** cho biến. Ngoài `=` cơ bản, JavaScript có các **toán tử gán kết hợp** (`op=`) giúp viết ngắn gọn hơn.

## Bảng toán tử gán

| Toán tử | Tương đương | Ví dụ |
|---------|------------|-------|
| `=` | — | `x = 5` |
| `+=` | `x = x + y` | `x += 3` → `x = x + 3` |
| `-=` | `x = x - y` | `x -= 1` |
| `*=` | `x = x * y` | `x *= 2` |
| `/=` | `x = x / y` | `x /= 4` |
| `%=` | `x = x % y` | `x %= 3` |
| `**=` | `x = x ** y` | `x **= 2` (ES2016) |
| `<<=` | `x = x << y` | `x <<= 1` |
| `>>=` | `x = x >> y` | `x >>= 1` |
| `&=` | `x = x & y` | `x &= 0xff` |
| `\|=` | `x = x \| y` | `x \|= 1` |
| `^=` | `x = x ^ y` | `x ^= mask` |
| `??=` | `x = x ?? y` | `x ??= "default"` (ES2021) |
| `\|\|=` | `x = x \|\| y` | `x \|\|= fallback` (ES2021) |
| `&&=` | `x = x && y` | `x &&= newVal` (ES2021) |

## Cách dùng (Usage)

### Gán cơ bản và kết hợp

```js
let x = 10;
x += 5;   // x = 15
x -= 3;   // x = 12
x *= 2;   // x = 24
x /= 4;   // x = 6
x %= 4;   // x = 2
x **= 3;  // x = 8
```

### Logical Assignment (ES2021)

```js
// ??= — gán chỉ khi null/undefined
let port = null;
port ??= 3000;  // port = 3000
port ??= 8080;  // port vẫn = 3000 (không null/undefined)

// ||= — gán khi falsy (0, "", false, null, undefined, NaN)
let name = "";
name ||= "Khách"; // name = "Khách" (chuỗi rỗng là falsy)

// &&= — gán khi truthy
let user = { active: true };
user.active &&= false; // gán false vì active đang truthy
```

### Destructuring Assignment (ES6)

```js
// Array destructuring
let a, b;
[a, b] = [1, 2];
[a, b] = [b, a]; // hoán đổi giá trị!

// Object destructuring
const { ten, tuoi, email = "N/A" } = { ten: "An", tuoi: 25 };
// ten = "An", tuoi = 25, email = "N/A"

// Nested
const { diaChi: { tinh } } = { diaChi: { tinh: "Hà Nội" } };
```

### Chuỗi gán (ít dùng)

```js
let u, v, w;
u = v = w = 0; // gán từ phải sang trái: w=0, v=0, u=0
```

## Khi nào dùng (When)

- `+=`, `-=` → đếm, tích lũy giá trị
- `??=` → gán giá trị mặc định an toàn (không ghi đè `0` hay `""`)
- Destructuring → lấy dữ liệu từ API response, function params

## Best Practices

- ✅ Dùng `??=` thay `||=` khi `0` và `""` là giá trị hợp lệ
- ✅ Dùng destructuring để code gọn khi lấy nhiều field
- ✅ Tránh chuỗi gán phức tạp — khó đọc

## Pitfalls

- ❌ `+=` với chuỗi → nối chuỗi, không cộng số: `"5" += 3` → `"53"`
- ❌ `||=` ghi đè `0` và `""` — dùng `??=` nếu muốn giữ falsy
