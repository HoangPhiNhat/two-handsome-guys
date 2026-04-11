# Vòng đời bộ nhớ (Memory Lifecycle)

## Khái niệm (What)

Bộ nhớ trong JavaScript đi qua **3 giai đoạn**: Cấp phát → Sử dụng → Giải phóng. Không như C/C++, JS tự động hóa giai đoạn 1 và 3 nhưng developer vẫn cần hiểu để tránh memory leak.

## Ba giai đoạn (How)

### 1. Cấp phát (Allocation)

```js
// Tự động khi khai báo
const num = 42;                    // stack (primitive)
const obj = { name: "An" };        // heap (object)
const arr = [1, 2, 3];             // heap
const fn = () => {};               // heap (function object)
const str = "hello".repeat(1000);  // heap (string dài)
```

### 2. Sử dụng (Usage)

```js
// Đọc/ghi — bộ nhớ đang "sống"
obj.name = "Binh";
arr.push(4);
console.log(num);
```

### 3. Giải phóng (Release)

Engine tự động qua **Garbage Collection** — thu hồi object **không còn reachable** từ root.

## Stack vs Heap

| | Stack | Heap |
|-|-------|------|
| Chứa | Primitive, reference | Object, Array, Function |
| Truy cập | Nhanh (LIFO) | Chậm hơn (dynamic) |
| Quản lý | Tự động (scope) | GC (Mark-and-Sweep) |
| Kích thước | Nhỏ (~1MB) | Lớn (GB) |

## Khi nào cần hiểu (When)

- **Debug memory leak** — biết object sống ở đâu, chết khi nào
- **Tối ưu performance** — tránh tạo garbage quá nhiều
- **Xử lý data lớn** — streaming thay load toàn bộ vào memory

## Best Practices

- ✅ Gán `null` cho reference lớn khi không cần — giúp GC sớm hơn
- ✅ Dùng **WeakMap/WeakSet** cho cache — cho phép GC
- ✅ **Dọn dẹp** timer, listener, subscription khi component destroy

> Xem thêm: [Garbage Collection](garbage-collection.md) | [Memory Management](../memory-management.md)
