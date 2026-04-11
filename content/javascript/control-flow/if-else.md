# Câu lệnh điều kiện if / else

## Khái niệm (What)

`if/else` là cấu trúc điều khiển **cơ bản nhất** — thực thi code khác nhau dựa trên điều kiện boolean. Điều kiện luôn được ép sang **Boolean** (truthy/falsy).

## Cách dùng (Usage)

### Cơ bản

```js
const diem = 8.5;

if (diem >= 9) {
  console.log("Giỏi");
} else if (diem >= 7) {
  console.log("Khá"); // ← chạy dòng này
} else if (diem >= 5) {
  console.log("Trung bình");
} else {
  console.log("Chưa đạt");
}
```

### Guard clause — Return sớm

```js
// ❌ Lồng sâu — khó đọc
function processOrder(order) {
  if (order) {
    if (order.items.length > 0) {
      if (order.isPaid) {
        // xử lý...
      }
    }
  }
}

// ✅ Guard clause — return sớm
function processOrder(order) {
  if (!order) return;
  if (order.items.length === 0) return;
  if (!order.isPaid) return;
  // xử lý... (code phẳng, dễ đọc)
}
```

### Truthy/Falsy trong điều kiện

```js
const ten = "";
if (ten) {
  // KHÔNG chạy — chuỗi rỗng là falsy
}

const arr = [];
if (arr) {
  // CHẠY — mảng rỗng là truthy! ⚠️
}

// Kiểm tra mảng rỗng đúng cách
if (arr.length > 0) {
  // chạy khi có phần tử
}
```

## Khi nào dùng (When)

| Trường hợp | Dùng |
|-----------|------|
| 1-2 nhánh đơn giản | `if/else` hoặc ternary |
| Nhiều nhánh rời rạc | `switch` hoặc object lookup |
| Validation | Guard clause (return sớm) |

## Best Practices

- ✅ **Guard clause** thay lồng sâu — mỗi hàm có 1 mức indent chính
- ✅ **Tường minh** trong điều kiện: `if (arr.length > 0)` thay vì `if (arr.length)`
- ✅ Dùng **ternary** cho biểu thức ngắn: `const x = cond ? a : b`
- ✅ Dùng **`===`** trong điều kiện — tránh ép kiểu bất ngờ
- ✅ Block `{}` ngay cả khi chỉ 1 dòng — tránh bug khi mở rộng

## Pitfalls

- ❌ `if (x = 5)` — **gán**, không phải so sánh (`==` hoặc `===`)
- ❌ Quên `{}` → dễ gây bug khi thêm dòng mới
- ❌ `if ([])` là `true` — mảng rỗng là truthy
- ❌ `if (x == null)` — khớp cả `null` VÀ `undefined` (có thể là ý muốn hoặc bug)
