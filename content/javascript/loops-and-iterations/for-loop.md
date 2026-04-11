# Vòng lặp for

## Khái niệm (What)

`for` là vòng lặp **truyền thống** với 3 phần: **khởi tạo**, **điều kiện**, **bước nhảy**. Được dùng khi biết trước số lần lặp hoặc cần kiểm soát chỉ số.

## Cách dùng (Usage)

```js
// Cú pháp: for (khởi tạo; điều kiện; bước nhảy)
for (let i = 0; i < 5; i++) {
  console.log(i); // 0, 1, 2, 3, 4
}
```

### Lặp ngược

```js
for (let i = 4; i >= 0; i--) {
  console.log(i); // 4, 3, 2, 1, 0
}
```

### Nhiều biến đếm

```js
for (let i = 0, j = 10; i < j; i++, j--) {
  console.log(i, j); // 0 10, 1 9, 2 8, 3 7, 4 6
}
```

### Lặp mảng (cách cũ)

```js
const arr = ["a", "b", "c"];
for (let i = 0; i < arr.length; i++) {
  console.log(arr[i]);
}

// Tối ưu: cache length (ít cần trong engine hiện đại)
for (let i = 0, len = arr.length; i < len; i++) {
  console.log(arr[i]);
}
```

## Khi nào dùng (When)

| Cần | Dùng |
|-----|------|
| Lặp với index | `for` |
| Lặp giá trị mảng | `for...of` |
| Lặp key object | `for...in` |
| Transform mảng | `.map()`, `.filter()`, `.reduce()` |

## Best Practices

- ✅ Dùng `let` (không phải `var`) — đảm bảo block scope
- ✅ Ưu tiên **`for...of`** hoặc **array methods** khi không cần index
- ✅ Dùng `for` khi cần index, lặp ngược, hoặc bước nhảy tùy chỉnh

## Pitfalls

- ❌ `var` trong `for` → biến thoát ra block, gây bug với async/closure
- ❌ Sửa `i` bên trong thân lặp → logic rối, khó debug
