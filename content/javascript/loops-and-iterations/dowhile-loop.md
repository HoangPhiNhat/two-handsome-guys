# Vòng lặp do...while

## Khái niệm (What)

`do...while` thực thi thân vòng lặp **ít nhất một lần** trước khi kiểm tra điều kiện. Khác với `while` (kiểm tra trước, có thể không chạy lần nào).

## Cách dùng (Usage)

```js
// Luôn chạy ít nhất 1 lần
let i = 0;
do {
  console.log(i); // 0, 1, 2, 3, 4
  i++;
} while (i < 5);

// Ngay cả khi điều kiện sai từ đầu
let x = 10;
do {
  console.log(x); // 10 — chạy 1 lần dù 10 >= 5
} while (x < 5);
```

### Use case thực tế: Hỏi lại đến khi hợp lệ

```js
let input;
do {
  input = prompt("Nhập số từ 1-10:");
} while (isNaN(input) || input < 1 || input > 10);
```

### Use case: Menu lựa chọn

```js
let choice;
do {
  choice = showMenu();
  handleChoice(choice);
} while (choice !== "quit");
```

## So sánh `while` vs `do...while`

| Đặc điểm | `while` | `do...while` |
|-----------|---------|-------------|
| Kiểm tra | **Trước** thân lặp | **Sau** thân lặp |
| Lần chạy tối thiểu | 0 | **1** |
| Use case | Có thể không cần chạy | Luôn chạy ít nhất 1 lần |

## Best Practices

- ✅ Dùng khi logic yêu cầu **thực thi trước, kiểm tra sau**
- ✅ Đảm bảo điều kiện sẽ trở thành `false` → tránh vòng lặp vô hạn

## Pitfalls

- ❌ Quên rằng thân lặp **luôn chạy ít nhất 1 lần** — khác `while`
- ❌ Quên cập nhật biến điều kiện → vòng lặp vô hạn
