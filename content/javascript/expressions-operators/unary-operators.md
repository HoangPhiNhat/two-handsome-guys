# Toán tử một ngôi (Unary Operators)

## Khái niệm (What)

Toán tử một ngôi (unary) thao tác trên **một toán hạng duy nhất**. JavaScript có nhiều unary operator phục vụ các mục đích khác nhau.

## Bảng toán tử

| Toán tử | Tên | Ví dụ | Kết quả |
|---------|-----|-------|---------|
| `+x` | Unary plus | `+"42"` | `42` (chuyển sang Number) |
| `-x` | Unary minus | `-5` | `-5` (đảo dấu) |
| `++x` | Prefix increment | `let a=1; ++a` | `a = 2`, trả `2` |
| `x++` | Postfix increment | `let a=1; a++` | trả `1`, rồi `a = 2` |
| `--x` | Prefix decrement | `let a=5; --a` | `a = 4`, trả `4` |
| `x--` | Postfix decrement | `let a=5; a--` | trả `5`, rồi `a = 4` |
| `!x` | Logical NOT | `!true` | `false` |
| `typeof x` | Kiểm tra kiểu | `typeof "a"` | `"string"` |
| `delete o.k` | Xóa property | `delete obj.a` | `true`/`false` |
| `void x` | Trả undefined | `void 0` | `undefined` |

## Cách dùng (Usage)

### Unary Plus — chuyển sang Number

```js
+"42";       // 42
+"";         // 0
+true;       // 1
+false;      // 0
+null;       // 0
+undefined;  // NaN
+{};         // NaN
```

### `++` / `--` — Prefix vs Postfix

```js
let n = 5;

// Prefix: tăng TRƯỚC, rồi trả giá trị mới
console.log(++n); // 6 (n = 6)

// Postfix: trả giá trị CŨ, rồi tăng
console.log(n++); // 6 (trả 6, rồi n = 7)
console.log(n);   // 7
```

**Trong vòng lặp — không khác biệt:**
```js
// Cả hai cho kết quả giống hệt nhau trong for
for (let i = 0; i < 5; i++) {} // postfix
for (let i = 0; i < 5; ++i) {} // prefix — cùng kết quả
```

### `delete` — Xóa property

```js
const obj = { a: 1, b: 2 };
delete obj.a;       // true
console.log(obj);   // { b: 2 }

// ❌ Không xóa được let/const/var
let x = 5;
// delete x;        // false (strict mode: SyntaxError)
```

### `void` — Luôn trả undefined

```js
void 0;            // undefined — cách viết ngắn nhất
void "anything";   // undefined

// Use case: đảm bảo arrow function không return giá trị
button.onclick = () => void doSomething();
```

### `typeof` — Kiểm tra kiểu

```js
typeof "hello";     // "string"
typeof 42;          // "number"
typeof undefined;   // "undefined"
typeof null;        // "object" — bug lịch sử

// Đặc biệt: không throw ReferenceError cho biến chưa khai báo
typeof notDeclared; // "undefined" (không lỗi)
```

## Best Practices

- ✅ Dùng `Number(x)` rõ ràng hơn `+x` trong code production
- ✅ Hiểu prefix/postfix khi dùng trong biểu thức lớn
- ✅ Dùng `void 0` thay `undefined` khi cần đảm bảo (hiếm cần)

## Pitfalls

- ❌ `i++` trong biểu thức → giá trị CŨ được dùng trước khi tăng
- ❌ `delete` không dọn bộ nhớ — chỉ xóa liên kết property
- ❌ `typeof null === "object"` — luôn nhớ exception này
