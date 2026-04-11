# Chrome DevTools cho JavaScript

## Khái niệm (What)

Chrome DevTools là bộ công cụ **debug và profiling** tích hợp trong Chrome. Đây là kỹ năng thiết yếu cho mọi JavaScript developer.

## Các tab quan trọng

### 1. Console

```js
// Cơ bản
console.log("info");
console.warn("cảnh báo");
console.error("lỗi");

// Nâng cao
console.table([{ a: 1, b: 2 }, { a: 3, b: 4 }]); // bảng
console.group("Group"); console.log("nested"); console.groupEnd();
console.time("timer"); /* ... */ console.timeEnd("timer"); // đo thời gian
console.trace(); // in call stack
console.dir(document.body); // xem object dạng tree
console.assert(1 === 2, "1 không bằng 2"); // log nếu false
```

### 2. Sources — Debug

- **Breakpoint**: click số dòng → tạm dừng tại đó
- **Conditional breakpoint**: click phải → dừng chỉ khi điều kiện đúng
- **Step controls**: Step over (F10), Step into (F11), Step out (Shift+F11)
- **Watch**: theo dõi biến cụ thể
- **Call Stack**: xem chuỗi hàm gọi
- **Scope**: xem biến trong scope hiện tại

### 3. Network

- Xem tất cả HTTP request/response
- Filter: XHR, JS, CSS, Fetch
- **Throttling**: mô phỏng mạng chậm (3G, offline)
- **Waterfall**: xem thời gian từng request

### 4. Performance

- Record → tương tác → Stop
- **Flame chart**: xem thời gian thực thi từng hàm
- **Long tasks**: task > 50ms → có thể gây jank

### 5. Memory

- **Heap snapshot**: chụp trạng thái memory
- **Allocation timeline**: xem bộ nhớ theo thời gian
- So sánh 2 snapshot → tìm memory leak

## Debugging Patterns

### `debugger` statement

```js
function processData(data) {
  debugger; // dừng tại đây khi DevTools mở
  return data.map(transform);
}
```

### Live Expression

Trong Console → click icon con mắt → nhập biểu thức → theo dõi real-time.

## Best Practices

- ✅ **Breakpoint** hiệu quả hơn `console.log` cho debug phức tạp
- ✅ **`console.table()`** cho array/object — đọc dễ hơn `.log()`
- ✅ **Network Throttling** để test performance mạng chậm
- ✅ **Dọn `console.log`** trước khi deploy — hoặc dùng logger library

## Pitfalls

- ❌ Quá nhiều `console.log` → chậm performance (đặc biệt log object lớn)
- ❌ `debugger` quên xóa → ứng dụng dừng ở production
- ❌ Console giữ reference tới object đã log → ảnh hưởng GC
