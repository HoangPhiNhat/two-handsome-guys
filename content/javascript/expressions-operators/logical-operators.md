# Toán tử Logic (Logical Operators)

## Khái niệm (What)

Toán tử logic trong JavaScript không chỉ trả `true`/`false` — chúng trả **giá trị gốc** của toán hạng nhờ cơ chế **short-circuit evaluation** (đánh giá ngắn mạch).

## Bảng toán tử

| Toán tử | Tên | Hành vi |
|---------|-----|---------|
| `&&` | AND | Trả vế **đầu tiên falsy**, hoặc vế cuối nếu tất cả truthy |
| `\|\|` | OR | Trả vế **đầu tiên truthy**, hoặc vế cuối nếu tất cả falsy |
| `!` | NOT | Đảo boolean |
| `??` | Nullish Coalescing (ES2020) | Trả vế phải chỉ khi vế trái là `null`/`undefined` |

## Cách hoạt động: Short-circuit (How)

```js
// && — dừng ở vế falsy đầu tiên
true && "hello";     // "hello" — tất cả truthy, trả vế cuối
false && "hello";    // false — dừng ở false
0 && "hello";        // 0 — dừng ở 0 (falsy)
"An" && 42;          // 42 — tất cả truthy, trả vế cuối

// || — dừng ở vế truthy đầu tiên
false || "hello";    // "hello" — dừng ở truthy
0 || "default";      // "default" — 0 là falsy
"An" || "Binh";      // "An" — dừng ở truthy đầu tiên
null || undefined || "cuối"; // "cuối"
```

## Cách dùng (Usage)

### Giá trị mặc định

```js
// || — fallback khi falsy
const port = config.port || 3000;
const name = user.name || "Khách";
// ⚠️ Vấn đề: 0 và "" cũng bị thay thế!

// ?? — fallback CHỈ khi null/undefined (ES2020)
const port = config.port ?? 3000;   // giữ 0 nếu port = 0
const name = user.name ?? "Khách";  // giữ "" nếu name = ""
```

### Render có điều kiện (React pattern)

```js
// && dùng để render khi điều kiện đúng
const greeting = isLoggedIn && `Chào ${user.name}`;

// Nếu isLoggedIn = true → greeting = "Chào An"
// Nếu isLoggedIn = false → greeting = false
```

### Optional chaining `?.` (ES2020)

```js
// Truy cập sâu an toàn
const tinh = user?.hoSo?.diaChi?.tinh; // undefined nếu bất kỳ mắt xích nào null/undefined

// Gọi method an toàn
user?.getProfile?.();

// Truy cập index an toàn
const first = arr?.[0];
```

### NOT (`!`) và Double NOT (`!!`)

```js
!true;          // false
!0;             // true
!null;          // true
!"hello";       // false

// !! — chuyển thành boolean
!!0;            // false
!!1;            // true
!!"";           // false
!!"hello";      // true
!!null;         // false
```

## So sánh `||` vs `??`

| Biểu thức | `\|\|` | `??` |
|-----------|------|------|
| `null \|\| "mặc định"` | `"mặc định"` | `"mặc định"` |
| `undefined \|\| "mặc định"` | `"mặc định"` | `"mặc định"` |
| `0 \|\| 42` | `42` ⚠️ | `0` ✅ |
| `"" \|\| "mặc định"` | `"mặc định"` ⚠️ | `""` ✅ |
| `false \|\| true` | `true` ⚠️ | `false` ✅ |

**Quy tắc**: Dùng `??` khi `0`, `""`, `false` là giá trị **hợp lệ**.

## Best Practices

- ✅ Dùng `??` thay `||` cho giá trị mặc định — an toàn hơn với `0` và `""`
- ✅ Dùng `?.` truy cập object sâu — tránh `a && a.b && a.b.c`
- ✅ Dùng `!!` để chuyển sang boolean rõ ràng
- ✅ Hiểu short-circuit để tránh side effect bất ngờ

## Pitfalls

- ❌ `||` thay thế cả `0`, `""`, `false` — dùng `??` nếu cần giữ
- ❌ Không trộn `??` với `||`/`&&` mà không có ngoặc: `a ?? b || c` → SyntaxError
- ❌ `&&` với giá trị `0`: `count && doSomething()` — không chạy khi count = 0

```js
// ⚠️ Phải dùng ngoặc khi kết hợp ?? với ||/&&
(a ?? b) || c;   // ✅ OK
// a ?? b || c;  // ❌ SyntaxError
```
