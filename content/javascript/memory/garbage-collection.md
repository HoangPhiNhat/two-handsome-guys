# Garbage Collection (Thu gom rác)

## Khái niệm (What)

Garbage Collection (GC) là quá trình **tự động giải phóng bộ nhớ** của object không còn được tham chiếu. JavaScript developer không cần (và không thể) gọi GC thủ công.

## Thuật toán: Mark-and-Sweep (How)

1. **Mark**: GC bắt đầu từ **root** (global object, call stack, closures đang active) → đánh dấu tất cả object có thể truy cập
2. **Sweep**: xóa object KHÔNG được đánh dấu → giải phóng bộ nhớ

```
Root (global, stack)
  ├── obj1 ✅ (reachable)
  │   └── obj2 ✅
  └── obj3 ✅
      └── obj4 ✅

obj5 ❌ (unreachable → bị GC thu hồi)
obj6 ❌
```

### Generational GC (V8)

V8 chia heap thành:
- **Young generation** (Nursery) — object mới, GC thường xuyên (Scavenger)
- **Old generation** — object sống lâu, GC ít thường hơn (Mark-Compact)

Hầu hết object chết sớm → tối ưu ở young generation.

## Circular Reference — Không còn là vấn đề

```js
function circular() {
  const a = {};
  const b = {};
  a.ref = b;
  b.ref = a; // vòng tròn
}
circular();
// Sau khi hàm kết thúc, a và b unreachable từ root → GC thu hồi
// (Reference counting cũ sẽ leak, nhưng mark-and-sweep thì không)
```

## WeakRef và FinalizationRegistry (ES2021)

```js
// WeakRef — tham chiếu yếu, cho phép GC
let bigData = { items: new Array(1_000_000) };
const weak = new WeakRef(bigData);

bigData = null; // bây giờ object có thể bị GC
weak.deref();   // có thể undefined sau khi GC chạy

// FinalizationRegistry — callback sau khi GC
const registry = new FinalizationRegistry((label) => {
  console.log(`GC đã thu hồi: ${label}`);
});
registry.register(someObject, "myObject");
```

## Best Practices

- ✅ Hiểu **reachability** — object chỉ bị GC khi không ai tham chiếu
- ✅ **Dọn dẹp** explicit: `clearInterval`, `removeEventListener`, set `null`
- ✅ Dùng **WeakMap** cho metadata cache gắn object
- ✅ **Profiling** với DevTools Memory tab

## Pitfalls

- ❌ **Closure** giữ reference lớn → object sống lâu hơn mong đợi
- ❌ **Timer** không clear → callback giữ reference → object không bị GC
- ❌ **GC không deterministic** — không biết chính xác khi nào chạy
- ❌ **WeakRef.deref()** có thể `undefined` bất cứ lúc nào — đừng phụ thuộc

> Xem thêm: [Memory Lifecycle](memory-lifecycle.md) | [Memory Management](../memory-management.md)
