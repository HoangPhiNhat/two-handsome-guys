# Keyed Collections (Map, Set, WeakMap, WeakSet)

## Khái niệm (What)

ES6 bổ sung 4 **bộ sưu tập có khóa** (keyed collections), giải quyết các hạn chế của plain object khi dùng làm dictionary/set.

## Map — Key-value với key BẤT KỲ kiểu

```js
const map = new Map();
map.set("ten", "An");
map.set(42, "số");
map.set(true, "boolean");
const objKey = { id: 1 };
map.set(objKey, "object key");

map.get("ten");    // "An"
map.has(42);       // true
map.size;          // 4
map.delete(42);

for (const [key, val] of map) {
  console.log(`${key} → ${val}`);
}
```

| So sánh | Object | Map |
|---------|--------|-----|
| Key type | String/Symbol only | **Bất kỳ** (object, function, …) |
| Thứ tự | Gần đúng | ✅ Chèn trước-sau |
| Size | `Object.keys(o).length` | `map.size` |
| Iteration | Cần `Object.entries()` | ✅ `for...of` native |
| Performance (add/delete nhiều) | Chậm hơn | ✅ Tối ưu |

## Set — Tập giá trị KHÔNG trùng lặp

```js
const set = new Set([1, 2, 3, 2, 1]);
console.log(set); // Set(3) {1, 2, 3}
set.add(4);
set.delete(2);
set.has(3);       // true
set.size;         // 3

// Loại trùng mảng
const unique = [...new Set([1, 2, 2, 3])]; // [1, 2, 3]
```

## WeakMap / WeakSet — Tham chiếu yếu

Key (WeakMap) hoặc giá trị (WeakSet) phải là **object** — cho phép GC thu hồi khi object không còn tham chiếu khác.

```js
const weakMap = new WeakMap();
let obj = { data: "important" };
weakMap.set(obj, "metadata");
obj = null; // obj có thể bị GC → entry trong weakMap tự xóa
```

**Use case:** cache, private data, tracking DOM nodes.

## Khi nào dùng (When)

| Cần | Dùng |
|-----|------|
| Dictionary với key phức tạp | `Map` |
| Loại trùng lặp | `Set` |
| Cache/metadata gắn object | `WeakMap` |
| String key đơn giản, JSON serializable | Plain `Object` |

## Pitfalls

- ❌ WeakMap/WeakSet **không iterable**, không có `.size`
- ❌ `new Set([{a:1}, {a:1}])` → 2 phần tử — so tham chiếu, không so nội dung
