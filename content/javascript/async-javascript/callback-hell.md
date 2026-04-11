# Callback Hell (Địa ngục Callback)

## Khái niệm (What)

Callback hell (hay "Pyramid of Doom") là tình trạng **lồng callback nhiều cấp** khi xử lý nhiều tác vụ async tuần tự. Code trở nên khó đọc, khó debug, và khó bảo trì.

## Ví dụ minh họa

```js
// ❌ Callback Hell — kinh điển
getUser(userId, (err, user) => {
  if (err) return handleError(err);
  getOrders(user.id, (err, orders) => {
    if (err) return handleError(err);
    getOrderDetails(orders[0].id, (err, details) => {
      if (err) return handleError(err);
      getShipping(details.shippingId, (err, shipping) => {
        if (err) return handleError(err);
        renderPage(user, orders, details, shipping);
      });
    });
  });
});
```

## Giải pháp

### 1. Tách hàm riêng (Named functions)

```js
function handleShipping(user, orders, details) {
  getShipping(details.shippingId, (err, shipping) => {
    if (err) return handleError(err);
    renderPage(user, orders, details, shipping);
  });
}

function handleDetails(user, orders) {
  getOrderDetails(orders[0].id, (err, details) => {
    if (err) return handleError(err);
    handleShipping(user, orders, details);
  });
}
// ... ít lồng hơn nhưng vẫn phức tạp
```

### 2. Promise chain — phẳng hóa

```js
getUser(userId)
  .then(user => getOrders(user.id))
  .then(orders => getOrderDetails(orders[0].id))
  .then(details => getShipping(details.shippingId))
  .then(shipping => renderPage(shipping))
  .catch(handleError);
```

### 3. async/await — đọc như đồng bộ ✅

```js
async function loadPage(userId) {
  try {
    const user = await getUser(userId);
    const orders = await getOrders(user.id);
    const details = await getOrderDetails(orders[0].id);
    const shipping = await getShipping(details.shippingId);
    renderPage(user, orders, details, shipping);
  } catch (err) {
    handleError(err);
  }
}
```

## Tại sao cần biết (Why)

- Hiểu **tại sao** Promise và async/await ra đời
- Đọc và refactor **code legacy**
- Các bài phỏng vấn thường kiểm tra

## Tóm tắt

| Cách | Độ phức tạp | Đọc được |
|------|-----------|----------|
| Nested callbacks | Cao | ❌ Khó |
| Named functions | Trung bình | Trung bình |
| Promise chain | Thấp | ✅ Tốt |
| async/await | Thấp | ✅ **Tốt nhất** |
