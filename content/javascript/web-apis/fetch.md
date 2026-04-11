# Fetch API

## Khái niệm (What)

`fetch()` là API hiện đại (ES6) để thực hiện **HTTP requests**. Trả về Promise, thay thế XMLHttpRequest. Hoạt động trong cả browser và Node.js (v18+).

## Cách dùng (Usage)

### GET Request

```js
const res = await fetch("https://api.example.com/users");

// Kiểm tra response — fetch KHÔNG reject khi HTTP 4xx/5xx
if (!res.ok) throw new Error(`HTTP ${res.status}`);

const users = await res.json(); // parse JSON body
```

### POST Request

```js
const res = await fetch("/api/users", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({ ten: "An", email: "an@mail.com" }),
});

const newUser = await res.json();
```

### Các response type

```js
const text = await (await fetch("/page.html")).text();
const blob = await (await fetch("/image.png")).blob();
const buffer = await (await fetch("/file")).arrayBuffer();
const form = await (await fetch("/form")).formData();
```

### Abort — Hủy request

```js
const controller = new AbortController();

fetch("/api/data", { signal: controller.signal })
  .then(r => r.json())
  .catch(err => {
    if (err.name === "AbortError") console.log("Đã hủy");
  });

// Hủy sau 5s
setTimeout(() => controller.abort(), 5000);
```

### Timeout pattern

```js
async function fetchWithTimeout(url, ms = 5000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), ms);

  try {
    const res = await fetch(url, { signal: controller.signal });
    return await res.json();
  } finally {
    clearTimeout(timeout);
  }
}
```

## Best Practices

- ✅ **Kiểm tra `res.ok`** — fetch không throw cho 404/500
- ✅ **AbortController** cho timeout và cleanup (React useEffect)
- ✅ **Error handling** — bọc try/catch
- ✅ **Content-Type** header khi gửi JSON

## Pitfalls

- ❌ `fetch` chỉ reject khi **network error** — 404/500 vẫn resolve!
- ❌ `res.json()` chỉ gọi **1 lần** — body là stream, đọc lần 2 = lỗi
- ❌ Quên `await res.json()` → nhận Promise, không phải data
- ❌ CORS — cross-origin request bị block nếu server thiếu headers
