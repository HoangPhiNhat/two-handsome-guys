# Xử lý lỗi (Exception Handling)

## Khái niệm (What)

`try/catch/finally` cho phép **bắt và xử lý lỗi runtime** thay vì để chương trình crash. `throw` cho phép **tạo lỗi tùy chỉnh**.

## Cách hoạt động (How)

```
try {
  // code có thể gây lỗi
} catch (error) {
  // xử lý lỗi
} finally {
  // LUÔN chạy, kể cả khi có return trong try/catch
}
```

## Cách dùng (Usage)

### Cơ bản

```js
try {
  const data = JSON.parse('invalid json');
} catch (error) {
  console.error("Parse thất bại:", error.message);
  // "Parse thất bại: Unexpected token i in JSON..."
} finally {
  console.log("Luôn chạy — dọn dẹp resource");
}
```

### Throw lỗi tùy chỉnh

```js
function chia(a, b) {
  if (b === 0) throw new Error("Không thể chia cho 0");
  return a / b;
}

try {
  chia(10, 0);
} catch (e) {
  console.error(e.message); // "Không thể chia cho 0"
}
```

### Các loại Error built-in

```js
throw new Error("Lỗi chung");
throw new TypeError("Sai kiểu dữ liệu");
throw new RangeError("Ngoài phạm vi");
throw new ReferenceError("Biến không tồn tại");
throw new SyntaxError("Cú pháp sai");
throw new URIError("URI không hợp lệ");
```

### Custom Error class

```js
class ValidationError extends Error {
  constructor(field, message) {
    super(message);
    this.name = "ValidationError";
    this.field = field;
  }
}

class NotFoundError extends Error {
  constructor(resource) {
    super(`${resource} không tìm thấy`);
    this.name = "NotFoundError";
    this.statusCode = 404;
  }
}

// Sử dụng
try {
  throw new ValidationError("email", "Email không hợp lệ");
} catch (e) {
  if (e instanceof ValidationError) {
    console.log(`Lỗi tại field: ${e.field}`); // "email"
  } else {
    throw e; // re-throw lỗi không biết xử lý
  }
}
```

### Xử lý lỗi trong async/await

```js
async function layDuLieu(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }
    return await res.json();
  } catch (error) {
    if (error.name === "TypeError") {
      console.error("Lỗi mạng:", error.message);
    } else {
      console.error("Lỗi API:", error.message);
    }
    return null; // fallback
  }
}
```

### `finally` luôn chạy

```js
function readFile() {
  let handle;
  try {
    handle = openFile("data.txt");
    return processData(handle);
  } catch (e) {
    console.error(e);
    return null;
  } finally {
    // Dọn dẹp — luôn chạy dù try return hay catch return
    if (handle) handle.close();
  }
}
```

## Khi nào dùng (When)

| Trường hợp | Cách xử lý |
|-----------|-----------|
| Parse JSON, XML | `try/catch` |
| Network request | `try/catch` với async/await |
| Validate input | `throw` custom Error |
| Truy cập quyền (file, DB) | `try/catch/finally` (dọn dẹp) |
| Lỗi logic dự đoán được | if/else (không cần exception) |

## Best Practices

- ✅ **Bắt lỗi cụ thể** — dùng `instanceof` để phân loại, re-throw lỗi không biết
- ✅ **Custom Error class** — giúp phân loại và xử lý tinh tế
- ✅ **Dùng `finally` cho cleanup** — đóng connection, file, timer
- ✅ **Không nuốt lỗi** — luôn log hoặc re-throw, tránh `catch (e) {}`
- ✅ **Error message rõ ràng** — bao gồm context (`"User 123 not found"`, không phải `"not found"`)

## Pitfalls

- ❌ **Catch rỗng**: `catch (e) {}` — nuốt lỗi, rất khó debug
- ❌ **try/catch bọc toàn bộ** — chỉ bọc đoạn có thể lỗi, giữ scope nhỏ
- ❌ **throw string**: `throw "lỗi"` — luôn `throw new Error("lỗi")` để có stack trace
- ❌ **finally return** ghi đè try/catch return

```js
// ⚠️ finally return ghi đè!
function test() {
  try {
    return 1;
  } finally {
    return 2; // ← ghi đè! hàm trả 2, không phải 1
  }
}
test(); // 2
```
