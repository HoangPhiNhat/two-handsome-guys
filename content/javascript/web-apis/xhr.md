# XMLHttpRequest (XHR)

## Khái niệm (What)

XMLHttpRequest (XHR) là API **cũ** để gửi HTTP request, ra đời trước `fetch()`. Dùng callback/event-based thay vì Promise. Hiện chủ yếu gặp trong **code legacy**.

## Cách dùng (Usage)

```js
const xhr = new XMLHttpRequest();
xhr.open("GET", "/api/users");
xhr.responseType = "json";

xhr.onload = function () {
  if (xhr.status === 200) {
    console.log(xhr.response); // parsed JSON
  } else {
    console.error(`Error ${xhr.status}`);
  }
};

xhr.onerror = function () {
  console.error("Network error");
};

xhr.send();
```

### POST với JSON

```js
const xhr = new XMLHttpRequest();
xhr.open("POST", "/api/users");
xhr.setRequestHeader("Content-Type", "application/json");
xhr.send(JSON.stringify({ ten: "An" }));
```

### Upload Progress — lợi thế của XHR

```js
const xhr = new XMLHttpRequest();
xhr.upload.onprogress = (e) => {
  const percent = (e.loaded / e.total * 100).toFixed(0);
  console.log(`Upload: ${percent}%`);
};
xhr.open("POST", "/upload");
xhr.send(formData);
```

## So sánh XHR vs Fetch

| Tiêu chí | XHR | Fetch |
|----------|-----|-------|
| API style | Event/callback | **Promise** ✅ |
| Upload progress | ✅ Có | ❌ Khó (ReadableStream) |
| Abort | `xhr.abort()` | `AbortController` |
| Code hiện đại | ❌ | ✅ **Khuyên dùng** |

## Best Practices

- ✅ **Dùng `fetch()`** cho code mới — gọn, Promise-based
- ✅ Chỉ dùng XHR khi cần **upload progress** (hoặc dùng lib Axios)
