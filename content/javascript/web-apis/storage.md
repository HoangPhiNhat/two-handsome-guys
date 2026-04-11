# Storage APIs (localStorage, sessionStorage, Cookies)

## Khái niệm (What)

Browser cung cấp nhiều cơ chế **lưu trữ dữ liệu phía client**:
- **`localStorage`** — lưu vĩnh viễn (cho đến khi xóa)
- **`sessionStorage`** — lưu cho đến khi đóng tab
- **Cookies** — lưu với thời hạn, gửi kèm HTTP request
- **IndexedDB** — database NoSQL phía client

## localStorage

```js
// Lưu
localStorage.setItem("theme", "dark");
localStorage.setItem("user", JSON.stringify({ name: "An" }));

// Đọc
const theme = localStorage.getItem("theme"); // "dark"
const user = JSON.parse(localStorage.getItem("user"));

// Xóa
localStorage.removeItem("theme");
localStorage.clear(); // xóa tất cả
```

## sessionStorage

```js
// API giống localStorage — nhưng xóa khi đóng tab
sessionStorage.setItem("tempData", "value");
```

## Cookies

```js
// Set
document.cookie = "theme=dark; path=/; max-age=86400"; // 1 ngày

// Đọc — chuỗi tất cả cookies
const cookies = document.cookie; // "theme=dark; lang=vi"

// Helper function
function getCookie(name) {
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? match[2] : null;
}
```

## So sánh

| | localStorage | sessionStorage | Cookie |
|-|-------------|---------------|--------|
| Dung lượng | ~5-10 MB | ~5 MB | ~4 KB |
| Thời gian | Vĩnh viễn | Tab session | Tùy `max-age` |
| Gửi server | ❌ | ❌ | ✅ Mỗi request |
| API | Đơn giản | Đơn giản | Chuỗi (phức tạp) |

## Best Practices

- ✅ **localStorage** cho user preferences (theme, language)
- ✅ **sessionStorage** cho data chỉ cần trong session (form draft)
- ✅ **Cookie** cho auth token (HttpOnly, Secure flags)
- ✅ **JSON.stringify/parse** khi lưu object

## Pitfalls

- ❌ localStorage chỉ lưu **string** — phải stringify/parse
- ❌ **Đồng bộ** (synchronous) — block main thread với data lớn
- ❌ Không có **encryption** — đừng lưu sensitive data trong localStorage
- ❌ Cookie gửi **mỗi request** — ảnh hưởng performance nếu lớn
