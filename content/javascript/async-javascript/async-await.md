# async / await

## Khái niệm (What)

`async/await` (ES2017) là cú pháp viết code bất đồng bộ **giống như đồng bộ**. Nó xây dựng trên Promise — `async` function luôn trả Promise, `await` tạm dừng hàm đến khi Promise resolve.

## Cách dùng (Usage)

### Cơ bản

```js
async function layDuLieu() {
  try {
    const res = await fetch("/api/users");
    const users = await res.json();
    return users; // resolve Promise với giá trị users
  } catch (err) {
    console.error("Lỗi:", err.message);
    throw err; // re-throw để caller bắt
  }
}

// Gọi
const users = await layDuLieu(); // top-level await (ES Module)
```

### Song song (Parallel)

```js
// ❌ Tuần tự — chậm! Mỗi cái đợi cái trước
const user = await getUser(id);
const posts = await getPosts(id);
const comments = await getComments(id);
// Tổng thời gian = user + posts + comments

// ✅ Song song — nhanh!
const [user, posts, comments] = await Promise.all([
  getUser(id),
  getPosts(id),
  getComments(id),
]);
// Tổng thời gian = max(user, posts, comments)
```

### Error Handling

```js
// Pattern 1: try/catch
async function example() {
  try {
    const data = await riskyOperation();
  } catch (err) {
    handleError(err);
  }
}

// Pattern 2: .catch() trên Promise (inline)
const data = await riskyOperation().catch(err => {
  console.error(err);
  return null; // fallback
});
```

### Async Loop — `for...of` tuần tự

```js
const urls = ["/api/1", "/api/2", "/api/3"];

// ✅ Tuần tự — mỗi request đợi cái trước
for (const url of urls) {
  const res = await fetch(url);
  const data = await res.json();
  console.log(data);
}

// ✅ Song song — tất cả cùng lúc
const results = await Promise.all(
  urls.map(url => fetch(url).then(r => r.json()))
);
```

### Top-level await (ES2022)

```js
// Chỉ trong ES Module (type="module")
const config = await fetch("/config.json").then(r => r.json());
export default config;
```

## Khi nào dùng (When)

- **Mọi code async** — thay `.then()` chain
- **API calls** — fetch, database queries
- **File I/O** — đọc/ghi file (Node.js)

## So sánh: Callback vs Promise vs async/await

```js
// Callback
getUser(id, (err, user) => {
  if (err) return handleError(err);
  getOrders(user.id, (err, orders) => { /* ... */ });
});

// Promise
getUser(id)
  .then(user => getOrders(user.id))
  .then(orders => { /* ... */ })
  .catch(handleError);

// ✅ async/await — đọc như code đồng bộ
try {
  const user = await getUser(id);
  const orders = await getOrders(user.id);
} catch (err) {
  handleError(err);
}
```

## Best Practices

- ✅ **`Promise.all`** cho request song song — tránh await tuần tự
- ✅ **`try/catch`** cho error handling
- ✅ Dùng **async/await** thay `.then()` chain — dễ đọc hơn
- ✅ **Không quên `await`** trước Promise → nếu quên sẽ nhận Promise object

## Pitfalls

- ❌ **Quên `await`** → nhận Promise thay vì giá trị
- ❌ **Await trong vòng lặp** → tuần tự (chậm) — xem xét `Promise.all`
- ❌ **forEach + async** → chạy song song, KHÔNG tuần tự

```js
// ❌ Bug
items.forEach(async (item) => {
  await processItem(item); // KHÔNG đợi tuần tự!
});

// ✅ Fix
for (const item of items) {
  await processItem(item);
}
```

- ❌ **Unhandled rejection** — async function throw mà không catch → crash (Node) hoặc cảnh báo (browser)
