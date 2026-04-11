# JavaScript là gì?

## Khái niệm (What)

JavaScript là ngôn ngữ lập trình **động**, **thông dịch**, ban đầu được thiết kế để làm trang web tương tác trong trình duyệt. Ngày nay JavaScript chạy trên **server** (Node.js, Deno, Bun), **mobile** (React Native), **desktop** (Electron) và nhiều môi trường khác.

JavaScript tuân theo chuẩn **ECMAScript** (chuẩn chính thức của ngôn ngữ), được duy trì bởi TC39.

## Cách hoạt động (How)

JavaScript được thực thi bởi **JavaScript Engine** — chương trình chuyên biệt biên dịch và chạy code JS:

- **V8** — Chrome, Node.js, Deno
- **SpiderMonkey** — Firefox
- **JavaScriptCore (Nitro)** — Safari

Engine hiện đại sử dụng **JIT compilation** (Just-In-Time): phân tích code → biên dịch sang mã máy tại thời điểm chạy → tối ưu các đoạn "hot" (chạy nhiều lần).

```
Source Code → Parser → AST → Bytecode → JIT Compiler → Machine Code
```

## Đặc điểm chính

| Đặc điểm | Giải thích |
|-----------|-----------|
| **Đa mô hình** | Hỗ trợ lập trình hướng đối tượng (prototype-based), hàm (functional), và hướng sự kiện |
| **Kiểu động** | Kiểu biến được xác định lúc chạy, không khai báo kiểu tĩnh như Java hay C# |
| **Đơn luồng** | Một call stack duy nhất, tác vụ nặng dùng callback, Promise, `async`/`await` |
| **First-class functions** | Hàm là giá trị — có thể gán vào biến, truyền làm tham số, return từ hàm khác |
| **Garbage collected** | Tự động quản lý bộ nhớ, lập trình viên không cần `free()` thủ công |

```js
// Minh họa: hàm là giá trị (first-class)
const chao = (ten) => `Xin chào, ${ten}!`;
const xuLy = (fn, giaTri) => fn(giaTri);
console.log(xuLy(chao, "An")); // "Xin chào, An!"
```

## JavaScript vs ECMAScript vs TypeScript

| Thuật ngữ | Ý nghĩa |
|-----------|---------|
| **ECMAScript** | Chuẩn đặc tả ngôn ngữ do TC39 duy trì (ES2015, ES2020, …) |
| **JavaScript** | Triển khai phổ biến nhất của ECMAScript + API môi trường (DOM, Node API, …) |
| **TypeScript** | Siêu ngôn ngữ của Microsoft, thêm hệ thống kiểu tĩnh, biên dịch ra JavaScript |

## Khi nào dùng (When)

- **Frontend web**: thao tác DOM, SPA (React, Vue, Angular)
- **Backend**: API server (Node.js, Express, NestJS)
- **Mobile**: React Native, Ionic
- **Desktop**: Electron (VS Code, Discord)
- **Scripting**: tự động hóa, CLI tools
- **Game**: Phaser.js, Three.js (3D trong browser)

## Tại sao JavaScript phổ biến (Why)

- **Chạy ở mọi nơi**: mọi trình duyệt đều hỗ trợ, không cần cài đặt thêm
- **Hệ sinh thái khổng lồ**: npm có hơn 2 triệu package
- **Cộng đồng lớn**: dễ tìm tài liệu, hỗ trợ, việc làm
- **Full-stack**: dùng một ngôn ngữ cho cả frontend và backend
- **Liên tục phát triển**: TC39 cập nhật hàng năm với tính năng mới

## Pitfalls (Hiểu nhầm phổ biến)

- ❌ **"JavaScript = Java"** → Hai ngôn ngữ hoàn toàn khác, tên giống vì lý do marketing lịch sử
- ❌ **"JS chỉ dùng cho frontend"** → JS chạy được ở mọi nơi (server, mobile, IoT, …)
- ❌ **"JS chậm"** → V8 engine rất nhanh nhờ JIT, đủ cho hầu hết ứng dụng thực tế
- ❌ **"JS đơn giản, không cần học sâu"** → Prototype, closure, event loop, async — đều cần hiểu kỹ
