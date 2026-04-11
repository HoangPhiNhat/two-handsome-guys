# Scope và Call Stack trong hàm

## Khái niệm (What)

**Scope** trong ngữ cảnh hàm xác định biến nào được nhìn thấy. **Call Stack** là cấu trúc LIFO (Last In, First Out) mà engine dùng để theo dõi hàm nào đang chạy.

## Call Stack (How)

```js
function a() { b(); }
function b() { c(); }
function c() { console.log("end"); }
a();

// Call Stack:
// [1] a()   → push
// [2] b()   → push
// [3] c()   → push
// [3] c()   → pop (xong)
// [2] b()   → pop
// [1] a()   → pop
```

**Xem trong DevTools:** mở **Sources** tab → đặt breakpoint → xem panel **Call Stack**.

### Stack Overflow

```js
function infinite() {
  infinite(); // gọi chính mình không có điểm dừng
}
// infinite(); // RangeError: Maximum call stack size exceeded
```

## Scope trong hàm

Mỗi lần gọi hàm, engine tạo **execution context** mới với scope riêng:

```js
function outer() {
  const x = 1; // scope của outer

  function inner() {
    const y = 2; // scope của inner
    console.log(x + y); // 3 — truy cập x qua scope chain
  }

  inner();
  // console.log(y); // ❌ ReferenceError — y chỉ trong inner
}
```

## Khi nào cần hiểu (When)

- **Debug**: đọc stack trace, hiểu lỗi xảy ra ở đâu
- **Performance**: call stack sâu → chậm, tốn bộ nhớ
- **Recursion**: cần hiểu call stack để tránh overflow
- **Async**: hiểu tại sao callback chạy sau khi stack trống

## Best Practices

- ✅ Đọc **stack trace** từ dưới lên — dòng cuối là nguyên nhân gốc
- ✅ Tránh recursion quá sâu — dùng **iteration** hoặc **tail call** (nếu engine hỗ trợ)
- ✅ Dùng `console.trace()` để in call stack tại bất kỳ điểm nào

## Pitfalls

- ❌ Stack overflow từ recursion không có base case
- ❌ Nhầm scope chain với call stack — scope theo **vị trí khai báo** (lexical), không theo vị trí gọi
