# setTimeout và setInterval (Timers)

## Khái niệm (What)

Timer functions lên lịch chạy code **trong tương lai**. Chúng là **macrotask** — được xử lý sau khi call stack trống và microtask queue xong. Thời gian delay là **tối thiểu**, không chính xác.

## Cách dùng (Usage)

### setTimeout — Chạy 1 lần

```js
const timeoutId = setTimeout(() => {
  console.log("Chạy sau ít nhất 1 giây");
}, 1000);

// Hủy trước khi chạy
clearTimeout(timeoutId);
```

### setInterval — Lặp lại

```js
let count = 0;
const intervalId = setInterval(() => {
  count++;
  console.log(`Tick ${count}`);
  if (count >= 5) clearInterval(intervalId); // dừng sau 5 lần
}, 1000);
```

### `setTimeout(fn, 0)` — Defer to next macrotask

```js
console.log("1");
setTimeout(() => console.log("2"), 0); // macrotask — chờ micro xong
Promise.resolve().then(() => console.log("3")); // microtask
console.log("4");
// Output: 1, 4, 3, 2
```

### Recursive setTimeout thay setInterval

```js
// ❌ setInterval — callback có thể chồng nếu chạy lâu hơn interval
setInterval(heavyTask, 1000);

// ✅ Recursive setTimeout — đảm bảo khoảng cách giữa các lần
function poll() {
  heavyTask();
  setTimeout(poll, 1000); // lên lịch SAU khi task xong
}
poll();
```

### Debounce và Throttle (ứng dụng phổ biến)

```js
// Debounce — chờ ngừng gõ rồi mới chạy
function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

const handleSearch = debounce((query) => {
  fetch(`/search?q=${query}`);
}, 300);

// Throttle — chạy tối đa 1 lần / khoảng thời gian
function throttle(fn, limit) {
  let inThrottle = false;
  return function (...args) {
    if (inThrottle) return;
    fn.apply(this, args);
    inThrottle = true;
    setTimeout(() => (inThrottle = false), limit);
  };
}
```

## Best Practices

- ✅ **`clearTimeout`/`clearInterval`** khi không cần — tránh memory leak
- ✅ **Recursive setTimeout** thay setInterval cho task nặng
- ✅ **Debounce** cho search/input, **Throttle** cho scroll/resize

## Pitfalls

- ❌ Delay **không chính xác** — `setTimeout(fn, 100)` có thể chạy sau 105ms
- ❌ **`this`** trong callback: function thường → `window`/`undefined`; dùng arrow
- ❌ setInterval chồng: nếu callback > interval → queue lại, chạy liên tục
- ❌ Inactive tab: browser có thể **throttle** timer (giãn ra 1s+)
