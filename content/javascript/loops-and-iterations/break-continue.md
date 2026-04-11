# break và continue

## Khái niệm (What)

- **`break`**: thoát **hoàn toàn** khỏi vòng lặp hiện tại
- **`continue`**: bỏ qua **lần lặp hiện tại**, nhảy sang lần tiếp theo

## Cách dùng (Usage)

### break — Dừng vòng lặp

```js
// Tìm phần tử đầu tiên thỏa điều kiện
const arr = [1, 3, 7, 4, 9, 2];
let result;
for (const n of arr) {
  if (n > 5) {
    result = n;
    break; // dừng ngay khi tìm thấy
  }
}
console.log(result); // 7
```

### continue — Bỏ qua lần lặp

```js
// Xử lý chỉ số chẵn
for (let i = 0; i < 10; i++) {
  if (i % 2 !== 0) continue; // bỏ qua số lẻ
  console.log(i); // 0, 2, 4, 6, 8
}
```

### Label — break/continue vòng lặp bên ngoài

```js
outer: for (let i = 0; i < 3; i++) {
  for (let j = 0; j < 3; j++) {
    if (i === 1 && j === 1) break outer; // thoát CẢ vòng lặp ngoài
    console.log(i, j);
  }
}
// 0 0, 0 1, 0 2, 1 0 — dừng tại i=1, j=1
```

### break trong switch

```js
switch (action) {
  case "save":
    save();
    break; // thoát switch, không fall-through
  case "delete":
    remove();
    break;
}
```

## Khi nào dùng (When)

| Cần | Dùng |
|-----|------|
| Tìm phần tử đầu tiên và dừng | `break` hoặc `.find()` |
| Bỏ qua giá trị không hợp lệ | `continue` hoặc `.filter()` |
| Thoát vòng lặp lồng nhau | `break label` hoặc tách hàm |

## So sánh với Array methods

```js
// ❌ Dùng for + break
let found;
for (const item of items) {
  if (item.id === 5) { found = item; break; }
}

// ✅ Dùng .find() — gọn hơn
const found = items.find(item => item.id === 5);

// ❌ Dùng for + continue
const results = [];
for (const item of items) {
  if (!item.active) continue;
  results.push(item);
}

// ✅ Dùng .filter() — gọn hơn
const results = items.filter(item => item.active);
```

## Best Practices

- ✅ Ưu tiên **`.find()`**, **`.filter()`**, **`.some()`** thay `for` + `break`/`continue` khi có thể
- ✅ Dùng `break` với `for...of` khi cần **thoát sớm** (`.forEach()` không hỗ trợ)
- ✅ Tránh `label` — tách thành hàm riêng dễ đọc hơn

## Pitfalls

- ❌ `break`/`continue` **không dùng được** trong `.forEach()` — phải dùng `for...of`
- ❌ Label hiếm dùng — code khó đọc khi lạm dụng
