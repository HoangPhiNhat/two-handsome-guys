# Switch Statement

## Khái niệm (What)

`switch` so sánh **một giá trị** với nhiều `case` bằng `===` (strict equality). Phù hợp khi có **nhiều nhánh** dựa trên cùng một biến.

## Cách dùng (Usage)

```js
const role = "editor";

switch (role) {
  case "admin":
    console.log("Toàn quyền");
    break;
  case "editor":
    console.log("Chỉnh sửa nội dung"); // ← chạy
    break;
  case "viewer":
    console.log("Chỉ đọc");
    break;
  default:
    console.log("Không xác định");
}
```

### Fall-through (chạy tiếp nếu thiếu `break`)

```js
const day = new Date().getDay();

switch (day) {
  case 0:
  case 6:
    console.log("Cuối tuần"); // case 0 và 6 cùng xử lý
    break;
  case 1:
  case 2:
  case 3:
  case 4:
  case 5:
    console.log("Ngày làm");
    break;
}
```

### Khai báo biến trong case

```js
// ❌ Lỗi: cùng block scope
switch (type) {
  case "a":
    let x = 1; // x thuộc block switch, xung đột case "b"
    break;
  case "b":
    let x = 2; // SyntaxError!
    break;
}

// ✅ Fix: dùng {} tạo block riêng
switch (type) {
  case "a": {
    let x = 1;
    break;
  }
  case "b": {
    let x = 2;
    break;
  }
}
```

## So sánh: switch vs if/else vs object lookup

```js
// Object lookup — gọn hơn switch cho mapping đơn giản
const gradeMap = {
  A: "Giỏi",
  B: "Khá",
  C: "Trung bình",
  D: "Yếu",
};
const result = gradeMap[grade] ?? "Không xác định";

// Map cho logic phức tạp hơn
const handlers = new Map([
  ["admin", () => showAdminPanel()],
  ["editor", () => showEditor()],
  ["viewer", () => showViewer()],
]);
(handlers.get(role) ?? showDefault)();
```

## Best Practices

- ✅ **Luôn có `break`** — hoặc comment rõ `// fall-through` nếu cố ý
- ✅ **Luôn có `default`** — xử lý trường hợp không khớp
- ✅ Dùng **`{}`** trong case khi khai báo biến
- ✅ Xem xét **object lookup** cho mapping giá trị — gọn hơn

## Pitfalls

- ❌ Quên `break` → fall-through không mong muốn
- ❌ `switch` dùng `===` — `case "1"` KHÔNG khớp `1` (số)
- ❌ Không khai báo biến `let`/`const` trực tiếp trong case mà không có `{}`
