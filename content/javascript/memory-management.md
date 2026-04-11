# Quản lý bộ nhớ (Memory Management)

## Khái niệm (What)

JavaScript sử dụng **Garbage Collector (GC)** tự động — developer không cần `malloc`/`free` như C. Tuy nhiên, **memory leak** vẫn có thể xảy ra khi object không cần nhưng vẫn bị tham chiếu.

## Cách hoạt động: Mark-and-Sweep (How)

1. GC bắt đầu từ **root** (global, stack, closures)
2. **Mark**: đánh dấu tất cả object có thể truy cập từ root
3. **Sweep**: thu hồi bộ nhớ của object KHÔNG được đánh dấu

## Memory Leak phổ biến (What to avoid)

### 1. Biến global bất cẩn

```js
// ❌ Non-strict mode
function leak() {
  data = new Array(1_000_000); // quên let/const → biến global
}
// ✅ Luôn dùng strict mode + let/const
```

### 2. Timer không clear

```js
// ❌ setInterval không bao giờ clear
setInterval(() => {
  const data = loadHugeData();
  updateUI(data);
}, 1000);

// ✅ Clear khi không cần
const id = setInterval(update, 1000);
// cleanup
clearInterval(id);
```

### 3. Closure giữ reference lớn

```js
// ❌
function createHandler() {
  const hugeArray = new Array(1_000_000);
  return () => console.log(hugeArray.length); // giữ toàn bộ array
}

// ✅ Chỉ giữ cái cần
function createHandler() {
  const hugeArray = new Array(1_000_000);
  const len = hugeArray.length;
  return () => console.log(len);
}
```

### 4. Event listener không remove

```js
// ❌ Component unmount nhưng listener vẫn tồn tại
element.addEventListener("click", handler);
element.remove(); // DOM node bị xóa, nhưng listener giữ reference

// ✅ Remove trước khi xóa
element.removeEventListener("click", handler);
element.remove();
```

### 5. Detached DOM nodes

```js
// ❌ DOM node bị remove nhưng JS vẫn tham chiếu
const el = document.querySelector("#temp");
document.body.removeChild(el);
// el vẫn tồn tại trong memory vì biến JS giữ reference

// ✅ Set null sau khi xóa
let el = document.querySelector("#temp");
el.remove();
el = null;
```

## Debug Memory — Chrome DevTools

1. **Memory tab** → Take heap snapshot → So sánh snapshots
2. **Performance tab** → Record → Xem memory timeline
3. Tìm **Detached DOM**, **Closures lớn**, **Array/Map phình to**

## WeakRef và FinalizationRegistry (ES2021)

```js
// WeakRef — tham chiếu yếu, cho phép GC
let obj = { data: "value" };
const weak = new WeakRef(obj);
weak.deref(); // { data: "value" } hoặc undefined nếu bị GC

// FinalizationRegistry — callback khi object bị GC
const registry = new FinalizationRegistry((value) => {
  console.log(`Đã dọn: ${value}`);
});
registry.register(obj, "myObject");
```

## Best Practices

- ✅ **Strict mode** — tránh global leak
- ✅ **Clear timer** (`clearInterval`, `clearTimeout`) khi không cần
- ✅ **Remove event listener** khi component/element bị xóa
- ✅ **WeakMap/WeakSet** cho metadata cache — cho phép GC
- ✅ **Profiling** định kỳ với DevTools
