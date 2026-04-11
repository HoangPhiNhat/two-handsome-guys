# arguments Object

## Khái niệm (What)

`arguments` là object **array-like** (giống mảng nhưng không phải Array) tự động có trong mọi **function thường** (không phải arrow), chứa tất cả đối số được truyền vào.

## Cách dùng (Usage)

```js
function showArgs() {
  console.log(arguments);        // { 0: "a", 1: "b", 2: "c", length: 3 }
  console.log(arguments.length); // 3
  console.log(arguments[0]);     // "a"
}
showArgs("a", "b", "c");
```

### Chuyển arguments thành Array

```js
function legacy() {
  // Cách cũ
  const args1 = Array.prototype.slice.call(arguments);
  // Cách hiện đại
  const args2 = Array.from(arguments);
  const args3 = [...arguments]; // spread

  return args2.join(", ");
}
```

## Tại sao dùng (Why)

- **Code legacy** — rất phổ biến trước ES6
- **Variadic function** — hàm nhận số lượng tham số tùy ý (trước rest params)

## So sánh: `arguments` vs Rest Parameters

| Đặc điểm | `arguments` | Rest `...args` |
|-----------|------------|----------------|
| Kiểu | Array-like object | **Array thực sự** |
| Arrow function | ❌ Không có | ✅ Có |
| `.map()`, `.filter()` | ❌ Cần chuyển đổi | ✅ Dùng ngay |
| Chỉ lấy tham số dư | ❌ Lấy tất cả | ✅ Lấy phần còn lại |

```js
// ❌ Cách cũ — arguments
function sum() {
  return Array.from(arguments).reduce((a, b) => a + b, 0);
}

// ✅ Cách hiện đại — rest
const sum = (...numbers) => numbers.reduce((a, b) => a + b, 0);

sum(1, 2, 3); // 6
```

## Best Practices

- ✅ **Dùng rest parameters** (`...args`) thay `arguments` trong code mới
- ✅ Hiểu `arguments` để đọc code legacy

## Pitfalls

- ❌ `arguments` **không có** trong arrow function — `ReferenceError` hoặc lấy từ scope ngoài
- ❌ Sửa `arguments[i]` ảnh hưởng tham số tương ứng (non-strict mode) — behavior kỳ lạ
- ❌ `arguments` là array-like — không có `.map()`, `.filter()` trực tiếp
