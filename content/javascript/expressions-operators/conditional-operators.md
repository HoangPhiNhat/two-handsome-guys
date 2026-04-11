# Toán tử điều kiện — Ternary (`? :`)

## Khái niệm (What)

Toán tử điều kiện (ternary) là toán tử **duy nhất** trong JS có 3 toán hạng. Nó là dạng rút gọn của `if/else` cho **biểu thức** (trả về giá trị).

**Cú pháp:** `điềuKiện ? giáTrịĐúng : giáTrịSai`

## Cách dùng (Usage)

```js
// Gán có điều kiện
const loai = diem >= 5 ? "đạt" : "chưa đạt";

// Return theo điều kiện
function getLabel(role) {
  return role === "admin" ? "Quản trị viên" : "Người dùng";
}

// Trong template literal
const msg = `Bạn ${isLoggedIn ? "đã" : "chưa"} đăng nhập`;

// Trong JSX (React)
// <div>{isLoading ? <Spinner /> : <Content />}</div>
```

### Chuỗi ternary (chain)

```js
const grade = score >= 9 ? "A"
            : score >= 7 ? "B"
            : score >= 5 ? "C"
            : "F";
```

## Khi nào dùng (When)

- **Biểu thức ngắn**, gán/return một giá trị theo điều kiện
- **JSX/Template**: chọn component/text hiển thị
- **Giá trị mặc định** có điều kiện

## So sánh với `if/else`

| Tiêu chí | Ternary | `if/else` |
|----------|---------|-----------|
| Trả giá trị | ✅ Là biểu thức | ❌ Là câu lệnh |
| Phù hợp | 1 dòng, logic đơn giản | Nhiều dòng, logic phức tạp |
| Trong JSX | ✅ Dùng được | ❌ Không trực tiếp |

## Best Practices

- ✅ Dùng cho logic **1 dòng**, kết quả rõ ràng
- ✅ Format chuỗi ternary trên nhiều dòng để dễ đọc (như ví dụ grade ở trên)
- ✅ Có thể thay chuỗi ternary dài bằng object lookup

```js
// Object lookup thay ternary chain
const gradeMap = { A: "Giỏi", B: "Khá", C: "Trung bình" };
const result = gradeMap[grade] ?? "Không xác định";
```

## Pitfalls

- ❌ **Lồng quá sâu** → khó đọc, khó debug — dùng `if/else` hoặc function
- ❌ **Side effect trong ternary**: `cond ? doA() : doB()` — nên dùng `if` cho hành động
- ❌ Nhầm thứ tự: `a ? b : c ? d : e` — cần ngoặc rõ ràng

```js
// ❌ Khó đọc
const x = a ? (b ? (c ? 1 : 2) : 3) : 4;

// ✅ Dùng if hoặc tách helper function
function getX(a, b, c) {
  if (!a) return 4;
  if (!b) return 3;
  return c ? 1 : 2;
}
```
