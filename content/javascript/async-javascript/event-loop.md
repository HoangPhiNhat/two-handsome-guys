# Event Loop (Vòng lặp sự kiện)

## Khái niệm (What)

JavaScript là **single-threaded** — chỉ có 1 call stack, chạy 1 việc tại 1 thời điểm. Event Loop là cơ chế cho phép JS xử lý **bất đồng bộ** (async) mà không block thread chính.

## Cách hoạt động (How)

```
┌─────────────────────────┐
│       Call Stack         │ ← JS engine chạy code ở đây
└───────────┬─────────────┘
            ↓ (khi stack rỗng)
┌─────────────────────────┐
│    Microtask Queue       │ ← Promise .then, queueMicrotask, MutationObserver
│    (ưu tiên cao hơn)     │
└───────────┬─────────────┘
            ↓ (khi microtask hết)
┌─────────────────────────┐
│    Macrotask Queue       │ ← setTimeout, setInterval, I/O, UI events
│    (xử lý 1 task/lần)    │
└─────────────────────────┘
```

### Thứ tự xử lý:
1. **Call Stack** — chạy hết code đồng bộ
2. **Microtask Queue** — xử lý HẾT micro trước khi sang macro
3. **Macrotask Queue** — lấy 1 macro task, chạy, quay lại bước 2

## Ví dụ kinh điển

```js
console.log("1"); // ① Đồng bộ → Call Stack

setTimeout(() => {
  console.log("2"); // ④ Macrotask
}, 0);

Promise.resolve().then(() => {
  console.log("3"); // ③ Microtask
});

console.log("4"); // ② Đồng bộ → Call Stack

// Output: 1, 4, 3, 2
```

### Giải thích:
1. `"1"` — chạy ngay (đồng bộ)
2. `setTimeout` → đưa callback vào **macrotask queue**
3. `Promise.then` → đưa callback vào **microtask queue**
4. `"4"` — chạy ngay (đồng bộ)
5. Stack rỗng → xử lý microtask: `"3"`
6. Microtask hết → lấy macrotask: `"2"`

## Ví dụ phức tạp hơn

```js
console.log("start");

setTimeout(() => console.log("timeout 1"), 0);
setTimeout(() => console.log("timeout 2"), 0);

Promise.resolve()
  .then(() => {
    console.log("promise 1");
    // Thêm microtask BÊN TRONG microtask → chạy ngay sau
    Promise.resolve().then(() => console.log("promise 2"));
  });

console.log("end");

// Output: start, end, promise 1, promise 2, timeout 1, timeout 2
```

## Microtask vs Macrotask

| Microtask (ưu tiên cao) | Macrotask |
|--------------------------|-----------|
| `Promise.then/catch/finally` | `setTimeout` / `setInterval` |
| `queueMicrotask()` | I/O callbacks |
| `MutationObserver` | `requestAnimationFrame` (tranh luận) |
| `async/await` (phần sau await) | UI rendering |

## Khi nào cần hiểu (When)

- **Debug thứ tự chạy** — tại sao code không chạy theo thứ tự viết
- **Performance** — microtask quá nhiều → block UI rendering
- **Phỏng vấn** — câu hỏi kinh điển

## Pitfalls

- ❌ `setTimeout(fn, 0)` KHÔNG chạy ngay — chờ stack trống + micro hết
- ❌ **Microtask starvation**: microtask liên tục thêm microtask → macrotask và render bị đói
- ❌ UI freeze khi đồng bộ chạy lâu — event loop bị block
