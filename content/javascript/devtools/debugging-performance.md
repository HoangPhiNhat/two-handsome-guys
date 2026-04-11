# Debug hiệu năng (Performance Debugging)

## Khái niệm (What)

Performance debugging là quá trình **tìm và khắc phục bottleneck** trong JavaScript — bao gồm long tasks, layout thrashing, bundle size, và render blocking.

## Công cụ chính

### 1. Performance Panel (DevTools)

```
1. DevTools → Performance tab
2. Click Record (Ctrl+E) → tương tác → Stop
3. Đọc kết quả:
   - Main thread → Flame chart (hàm nào tốn thời gian)
   - Long Tasks marker (đỏ — task > 50ms → gây jank)
   - Layout/Paint/Composite layers
   - FPS chart → dưới 60fps = giật
```

### 2. Lighthouse

```
DevTools → Lighthouse tab → Analyze
- Performance score (0-100)
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Total Blocking Time (TBT)
- Cumulative Layout Shift (CLS)
```

### 3. `console.time()` / `performance.now()`

```js
// Đo thời gian thực thi
console.time("process");
heavyComputation();
console.timeEnd("process"); // "process: 142.5ms"

// Chính xác hơn
const start = performance.now();
doWork();
const duration = performance.now() - start;
console.log(`${duration.toFixed(2)}ms`);
```

## Bottleneck phổ biến và Fix

### 1. Long Tasks — Main Thread bận

```js
// ❌ Task > 50ms → block UI
function processAll(items) {
  items.forEach(item => heavyCalc(item)); // 500ms task
}

// ✅ Chia nhỏ bằng requestIdleCallback hoặc setTimeout
async function processAll(items) {
  for (const chunk of splitIntoChunks(items, 100)) {
    chunk.forEach(heavyCalc);
    await new Promise(r => setTimeout(r, 0)); // yield to browser
  }
}
```

### 2. Layout Thrashing — Đọc/ghi DOM xen kẽ

```js
// ❌ Forced reflow mỗi vòng lặp
elements.forEach(el => {
  const width = el.offsetWidth; // READ → trigger layout
  el.style.width = width + 10 + "px"; // WRITE → invalidate layout
});

// ✅ Batch: đọc trước, ghi sau
const widths = elements.map(el => el.offsetWidth); // READ all
elements.forEach((el, i) => {
  el.style.width = widths[i] + 10 + "px"; // WRITE all
});
```

### 3. Bundle Size lớn

```js
// ❌ Import toàn bộ library
import _ from "lodash"; // 70KB+

// ✅ Import riêng
import debounce from "lodash/debounce"; // ~1KB

// ✅ Dynamic import cho route/feature
const Chart = lazy(() => import("./Chart"));
```

### 4. Render blocking

```html
<!-- ❌ Script block parse HTML -->
<script src="heavy.js"></script>

<!-- ✅ defer/async -->
<script src="app.js" defer></script>
<!-- defer: tải song song, chạy sau DOM parse xong -->
<!-- async: tải song song, chạy ngay khi tải xong -->
```

## Web Workers — Offload nặng

```js
// main.js
const worker = new Worker("worker.js");
worker.postMessage({ data: hugeArray });
worker.onmessage = (e) => {
  console.log("Kết quả:", e.data); // nhận từ worker
};

// worker.js
self.onmessage = (e) => {
  const result = heavyComputation(e.data);
  self.postMessage(result);
};
```

## Best Practices

- ✅ **Đo trước, tối ưu sau** — `Performance.now()`, Lighthouse, Flame chart
- ✅ **requestAnimationFrame** cho animation — sync với refresh rate
- ✅ **Code splitting** + **lazy loading** — giảm initial bundle
- ✅ **Web Worker** cho CPU-intensive work
- ✅ **Debounce/Throttle** cho scroll, resize, input

## Pitfalls

- ❌ Tối ưu sớm (premature optimization) — đo trước rồi hãy fix
- ❌ `console.log` trong production → ảnh hưởng performance
- ❌ `requestAnimationFrame` không phải "làm nhanh hơn" — chỉ sync timing

> Xem thêm: [Chrome DevTools](chrome-devtools.md) | [Event Loop](../async-javascript/event-loop.md)
