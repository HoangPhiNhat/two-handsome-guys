# Vòng lặp while

## Khái niệm (What)

`while` kiểm tra điều kiện **trước** mỗi lần lặp. Nếu điều kiện sai ngay từ đầu, thân lặp **không chạy lần nào**.

## Cách dùng (Usage)

```js
let i = 0;
while (i < 5) {
  console.log(i); // 0, 1, 2, 3, 4
  i++;
}
```

### Chờ điều kiện

```js
// Polling pattern
let data = null;
while (data === null) {
  data = tryFetch(); // chạy cho đến khi có dữ liệu
}
```

### Xử lý dữ liệu theo batch

```js
const queue = [1, 2, 3, 4, 5];
while (queue.length > 0) {
  const item = queue.shift();
  process(item);
}
```

### Vòng lặp vô hạn (có điều kiện thoát)

```js
while (true) {
  const cmd = readCommand();
  if (cmd === "exit") break; // thoát bằng break
  execute(cmd);
}
```

## Khi nào dùng (When)

- **Không biết trước số lần lặp** — phụ thuộc dữ liệu runtime
- **Polling/waiting** — chờ điều kiện
- **Game loop** — `while (running) { update(); render(); }`

## Best Practices

- ✅ Đảm bảo **điều kiện sẽ trở thành false** hoặc có `break`
- ✅ Ưu tiên `for` khi biết trước số lần, `for...of` cho mảng

## Pitfalls

- ❌ Quên tăng biến đếm → **vòng lặp vô hạn** → tab/process treo
- ❌ `while` đồng bộ không await → block main thread
