# for...of — Duyệt giá trị Iterable

## Khái niệm (What)

`for...of` (ES6) duyệt **giá trị** của các đối tượng **iterable**: Array, String, Map, Set, arguments, NodeList, generator, … Đây là cách duyệt mảng **hiện đại** và rõ ràng nhất.

## Cách dùng (Usage)

### Array

```js
const fruits = ["táo", "cam", "chuối"];
for (const fruit of fruits) {
  console.log(fruit); // "táo", "cam", "chuối"
}
```

### String

```js
for (const char of "xin chào") {
  console.log(char); // "x", "i", "n", " ", "c", "h", "à", "o"
}
```

### Map

```js
const map = new Map([["a", 1], ["b", 2]]);
for (const [key, val] of map) {
  console.log(`${key} = ${val}`);
}
```

### Set

```js
const set = new Set([1, 2, 3]);
for (const val of set) {
  console.log(val);
}
```

### arguments, NodeList

```js
function sum() {
  let total = 0;
  for (const n of arguments) { total += n; }
  return total;
}

// DOM NodeList
for (const el of document.querySelectorAll(".item")) {
  el.classList.add("active");
}
```

### Kết hợp destructuring

```js
const users = [
  { ten: "An", tuoi: 20 },
  { ten: "Binh", tuoi: 25 },
];

for (const { ten, tuoi } of users) {
  console.log(`${ten}: ${tuoi} tuổi`);
}
```

## So sánh `for...of` vs `for...in` vs `.forEach()`

| Tiêu chí | `for...of` | `for...in` | `.forEach()` |
|----------|-----------|-----------|-------------|
| Duyệt | **Giá trị** (iterable) | **Key** (enumerable) | **Giá trị** (Array) |
| `break`/`continue` | ✅ | ✅ | ❌ Không hỗ trợ |
| `await` trong loop | ✅ | ✅ | ❌ Không chạy tuần tự |
| Dùng cho Object | ❌ (Object không iterable) | ✅ | ❌ |

## Khi nào dùng (When)

- **Duyệt mảng** khi không cần index → `for...of`
- **Cần `break`/`continue`** → `for...of` (`.forEach()` không hỗ trợ)
- **Async lặp tuần tự** → `for...of` với `await`
- **Cần index** → `for` truyền thống hoặc `entries()`

```js
// Lấy cả index
for (const [i, val] of arr.entries()) {
  console.log(`${i}: ${val}`);
}
```

## Pitfalls

- ❌ **Object thường không iterable** — `for (const x of {a:1})` → TypeError
- ❌ `.forEach()` không dừng được bằng `break`
- ❌ `.forEach()` với `await` → chạy song song, không tuần tự

```js
// ❌ Bug async với forEach
[url1, url2].forEach(async (url) => {
  await fetch(url); // chạy SONG SONG, không đúng thứ tự
});

// ✅ Tuần tự với for...of
for (const url of [url1, url2]) {
  await fetch(url); // chạy TUẦN TỰ
}
```
