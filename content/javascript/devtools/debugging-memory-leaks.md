# Debug rò rỉ bộ nhớ (Memory Leaks)

## Khái niệm (What)

Memory leak xảy ra khi object **không còn cần** nhưng vẫn bị giữ reference — GC không thể thu hồi. Dẫn đến RAM tăng liên tục, cuối cùng **crash** hoặc **chậm nghiêm trọng**.

## Quy trình phát hiện (How)

### Bước 1: Nghi ngờ leak

- Tab browser dùng RAM tăng liên tục khi tương tác
- Performance giảm dần theo thời gian
- `Detached DOM tree` trong heap snapshot

### Bước 2: Heap Snapshot (DevTools → Memory)

```
1. Mở DevTools → Memory tab
2. Chọn "Heap snapshot" → Take snapshot (S1)
3. Thực hiện thao tác nghi ngờ (mở/đóng modal, navigate)
4. Take snapshot lần 2 (S2)
5. So sánh S1 vs S2:
   - Summary view → sort by Retained Size
   - Comparison view → xem delta (object mới không bị GC)
   - Tìm "Detached" nodes, closure lớn
```

### Bước 3: Performance Timeline

```
1. DevTools → Performance tab
2. Check "Memory" checkbox
3. Record → tương tác → Stop
4. Xem biểu đồ JS Heap: nên có dạng răng cưa (tăng → GC → giảm)
5. Nếu chỉ tăng → có leak
```

### Bước 4: Allocation Timeline

```
1. Memory tab → "Allocation instrumentation on timeline"
2. Record trong khi tương tác
3. Xem blue bars (allocated) vs gray bars (freed)
4. Blue bars còn lại = potential leak
```

## 5 Memory Leak phổ biến và cách fix

### 1. Event Listener không remove

```js
// ❌ Leak
function setupPage() {
  const handler = () => processData(hugeData);
  window.addEventListener("resize", handler);
  // Không bao giờ removeEventListener!
}

// ✅ Fix
function setupPage() {
  const handler = () => processData(hugeData);
  window.addEventListener("resize", handler);
  return () => window.removeEventListener("resize", handler); // cleanup
}
```

### 2. Timer không clear

```js
// ❌
const id = setInterval(() => updateDashboard(data), 1000);
// Component unmount nhưng interval vẫn chạy

// ✅
useEffect(() => {
  const id = setInterval(update, 1000);
  return () => clearInterval(id);
}, []);
```

### 3. Detached DOM Nodes

```js
// ❌ Biến JS giữ reference tới DOM đã xóa
let el = document.querySelector("#temp");
el.remove();
// el vẫn sống trong memory!

// ✅ Set null
el.remove();
el = null;
```

### 4. Closure giữ reference lớn

```js
// ❌
function process() {
  const huge = loadMassiveDataset();
  return () => console.log(huge.length); // giữ toàn bộ
}

// ✅
function process() {
  const huge = loadMassiveDataset();
  const len = huge.length;
  return () => console.log(len); // chỉ giữ số
}
```

### 5. Cache không giới hạn

```js
// ❌ Map grow vô hạn
const cache = new Map();
function getData(key) {
  if (!cache.has(key)) cache.set(key, fetch(key));
  return cache.get(key);
}

// ✅ WeakMap (object key) hoặc LRU cache
const cache = new WeakMap();
// hoặc giới hạn size:
if (cache.size > 1000) cache.delete(cache.keys().next().value);
```

## Best Practices

- ✅ **Profile trước khi fix** — đo, đừng đoán
- ✅ **Cleanup pattern** ở mọi nơi: `useEffect` return, `destroy()`, `dispose()`
- ✅ `console.log` object lớn cũng giữ reference — xóa khi deploy
- ✅ Kiểm tra **Detached DOM** trong snapshot → dấu hiệu rõ ràng nhất

> Xem thêm: [Memory Management](../memory-management.md) | [Garbage Collection](../memory/garbage-collection.md)
