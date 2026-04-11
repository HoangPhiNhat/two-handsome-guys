# Callback

## Khái niệm (What)

Callback là **hàm được truyền vào hàm khác** để gọi sau khi tác vụ hoàn thành. Đây là cơ chế xử lý async **đầu tiên** của JavaScript, trước Promise.

## Cách dùng (Usage)

### Callback đồng bộ

```js
[1, 2, 3].map(n => n * 2);        // callback trong .map()
[1, 2, 3].filter(n => n > 1);     // callback trong .filter()
```

### Callback bất đồng bộ

```js
// setTimeout — macrotask
setTimeout(() => {
  console.log("Sau 1 giây");
}, 1000);

// Event listener
button.addEventListener("click", () => {
  console.log("Clicked!");
});

// Node.js I/O (error-first convention)
const fs = require("fs");
fs.readFile("data.txt", "utf8", (err, data) => {
  if (err) {
    console.error("Lỗi:", err);
    return;
  }
  console.log(data);
});
```

### Error-first Convention (Node.js)

```js
// Tham số đầu tiên luôn là error
function fetchData(url, callback) {
  // ... fetch
  if (error) callback(error, null);
  else callback(null, data);
}

fetchData("/api", (err, data) => {
  if (err) return handleError(err);
  process(data);
});
```

## Callback Hell — Vấn đề

```js
// ❌ Pyramid of doom
getUser(userId, (err, user) => {
  if (err) return handleError(err);
  getOrders(user.id, (err, orders) => {
    if (err) return handleError(err);
    getOrderDetails(orders[0].id, (err, details) => {
      if (err) return handleError(err);
      getShipping(details.shippingId, (err, shipping) => {
        // ... lồng sâu vô tận
      });
    });
  });
});
```

**Giải pháp → Promise (xem bài Promise).**

## Khi nào dùng (When)

- **Event listener** — `addEventListener` vẫn dùng callback
- **Array methods** — `.map()`, `.filter()`, `.reduce()`
- **Timer** — `setTimeout`, `setInterval`
- **Tránh callback cho async chain** → dùng Promise/async-await

## Best Practices

- ✅ **Error-first** cho Node-style callbacks
- ✅ **Named function** thay anonymous — debug dễ hơn
- ✅ Chuyển sang **Promise** cho async phức tạp

## Pitfalls

- ❌ **Callback hell** — lồng sâu, khó đọc, khó bảo trì
- ❌ **Inversion of control** — bạn tin tưởng hàm khác sẽ gọi callback đúng lần, đúng lúc
- ❌ Error handling không nhất quán giữa các library
