# Promise

## Khái niệm (What)

Promise là object đại diện cho **kết quả tương lai** của một tác vụ bất đồng bộ. Có 3 trạng thái:
- **pending** — đang chờ
- **fulfilled** — thành công (có giá trị)
- **rejected** — thất bại (có lý do)

Promise **bất biến** sau khi settled (fulfilled hoặc rejected) — không thể thay đổi trạng thái.

## Cách dùng (Usage)

### Tạo Promise

```js
const promise = new Promise((resolve, reject) => {
  const success = true;
  setTimeout(() => {
    if (success) resolve({ data: "OK" }); // fulfilled
    else reject(new Error("Thất bại"));    // rejected
  }, 1000);
});
```

### then / catch / finally

```js
promise
  .then(result => {
    console.log(result); // { data: "OK" }
    return result.data;  // return → truyền cho .then tiếp
  })
  .then(data => {
    console.log(data);   // "OK"
  })
  .catch(err => {
    console.error(err.message); // bắt bất kỳ reject nào ở trên
  })
  .finally(() => {
    console.log("Done — dù thành công hay thất bại");
  });
```

### Promise Chain — giải quyết Callback Hell

```js
// ✅ Flat chain thay vì nested callbacks
getUser(userId)
  .then(user => getOrders(user.id))
  .then(orders => getOrderDetails(orders[0].id))
  .then(details => getShipping(details.shippingId))
  .then(shipping => console.log(shipping))
  .catch(err => console.error(err));
```

### Static Methods

```js
// Promise.all — chờ TẤT CẢ, reject nếu BẤT KỲ cái nào reject
const [users, posts] = await Promise.all([
  fetch("/api/users").then(r => r.json()),
  fetch("/api/posts").then(r => r.json()),
]);

// Promise.allSettled — chờ tất cả, KHÔNG reject
const results = await Promise.allSettled([
  fetch("/good-url"),
  fetch("/bad-url"),
]);
// [{ status: "fulfilled", value: ... }, { status: "rejected", reason: ... }]

// Promise.race — trả kết quả của cái XONG ĐẦU TIÊN
const fastest = await Promise.race([fetch("/api1"), fetch("/api2")]);

// Promise.any — trả cái THÀNH CÔNG ĐẦU TIÊN (ES2021)
const first = await Promise.any([
  fetch("/slow"),
  fetch("/fast"),    // nếu thành công trước → trả cái này
  fetch("/failing"), // reject bị bỏ qua
]);

// Promise.resolve / Promise.reject — tạo nhanh
const p1 = Promise.resolve(42);     // fulfilled ngay
const p2 = Promise.reject("error"); // rejected ngay
```

## So sánh Static Methods

| Method | Chờ | Reject khi | Trả về |
|--------|-----|-----------|--------|
| `all` | Tất cả | 1 cái reject | Array giá trị |
| `allSettled` | Tất cả | Không bao giờ reject | Array `{status, value/reason}` |
| `race` | Cái đầu tiên | Cái đầu reject | Giá trị/lỗi đầu tiên |
| `any` | Cái thành công đầu | Tất cả reject | Giá trị thành công đầu |

## Best Practices

- ✅ **Luôn có `.catch()`** hoặc `try/catch` (với async/await)
- ✅ Dùng **`Promise.all`** cho các request song song
- ✅ Dùng **`Promise.allSettled`** khi cần kết quả tất cả (kể cả lỗi)
- ✅ **Return** trong `.then()` — không return = `.then()` tiếp nhận `undefined`

## Pitfalls

- ❌ **Quên return** trong `.then()` chain → giá trị bị mất
- ❌ **Quên `.catch()`** → lỗi bị nuốt im lặng (UnhandledPromiseRejection)
- ❌ **`.then(fn1, fn2)`** → `fn2` KHÔNG bắt lỗi từ `fn1` — dùng `.catch()` riêng
- ❌ **Promise constructor anti-pattern**: bọc Promise trong Promise mới

```js
// ❌ Anti-pattern
const bad = new Promise((resolve) => {
  somePromise.then(result => resolve(result));
});

// ✅ Đúng — trả Promise trực tiếp
const good = somePromise;
```
