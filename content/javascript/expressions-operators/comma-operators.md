# Toán tử dấu phẩy (Comma Operator)

## Khái niệm (What)

Toán tử dấu phẩy (`,`) đánh giá **lần lượt** các biểu thức từ trái sang phải và trả về **giá trị của biểu thức cuối cùng**. Đây là toán tử ít gặp nhất trong code production.

## Cách dùng (Usage)

```js
let a = (1, 2, 3); // a === 3 — trả biểu thức cuối
```

### Trong vòng `for` — use case phổ biến nhất

```js
for (let i = 0, j = 10; i < j; i++, j--) {
  console.log(i, j);
}
// 0 10, 1 9, 2 8, 3 7, 4 6
```

> Lưu ý: trong phần khai báo `let i = 0, j = 10`, dấu phẩy là **cú pháp khai báo nhiều biến**, không phải comma operator.

## Khi nào dùng (When)

- **Vòng `for`** — cập nhật nhiều biến ở bước nhảy: `i++, j--`
- **Arrow function ngắn** — thực hiện side effect rồi return (hiếm dùng)

```js
// Side effect trong arrow (không khuyến khích)
const log = (x) => (console.log(x), x * 2);
log(5); // log 5, return 10
```

## Pitfalls

- ❌ Dùng `(a, b)` ngoài `for` rất **khó đọc** — tránh trong code production
- ❌ Dễ nhầm với dấu phẩy trong khai báo biến, tham số hàm, hoặc array literal
