# Array — Mảng trong JavaScript

## Khái niệm (What)

Array là **danh sách có thứ tự** các giá trị với index bắt đầu từ 0. Array trong JS thực chất là object đặc biệt, có thể chứa **bất kỳ kiểu dữ liệu nào** (khác C/Java — cùng kiểu).

## Cách dùng (Usage)

### Khai báo

```js
const arr = [1, 2, 3];
const mixed = [1, "hello", true, null, { a: 1 }]; // hỗn hợp
const filled = new Array(5).fill(0); // [0, 0, 0, 0, 0]
const range = Array.from({ length: 5 }, (_, i) => i + 1); // [1, 2, 3, 4, 5]
```

### Truy cập

```js
arr[0];     // 1
arr.at(-1); // 3 — ES2022, index âm
```

### Thêm/Xóa (mutation)

```js
arr.push(4);       // thêm cuối
arr.pop();         // xóa cuối
arr.unshift(0);    // thêm đầu
arr.shift();       // xóa đầu
arr.splice(1, 1);  // xóa 1 phần tử tại index 1
```

### Transform (trả mảng MỚI)

```js
const nums = [1, 2, 3, 4, 5];
nums.map(n => n * 2);           // [2, 4, 6, 8, 10]
nums.filter(n => n > 2);        // [3, 4, 5]
nums.reduce((acc, n) => acc + n, 0); // 15
nums.find(n => n > 3);          // 4
nums.findIndex(n => n > 3);     // 3
nums.some(n => n > 4);          // true
nums.every(n => n > 0);         // true
nums.flat();                    // flatten 1 cấp
nums.flatMap(n => [n, n * 2]);  // [1,2, 2,4, 3,6, 4,8, 5,10]
```

### ES2023 — Immutable methods

```js
const arr = [3, 1, 2];
arr.toSorted((a, b) => a - b);  // [1, 2, 3] — arr KHÔNG đổi
arr.toReversed();               // [2, 1, 3] — arr KHÔNG đổi
arr.toSpliced(1, 1, 99);        // [3, 99, 2]
arr.with(0, 10);                // [10, 1, 2]
```

### Slice vs Splice

| | `slice(start, end)` | `splice(start, count, ...items)` |
|-|-------------------|-------------------------------|
| Mutation | ❌ Trả mảng mới | ✅ Sửa mảng gốc |
| Return | Mảng con | Phần tử bị xóa |

## Best Practices

- ✅ Dùng **`.map()/.filter()/.reduce()`** thay `for` cho readability
- ✅ Dùng **spread** `[...arr]` cho shallow copy
- ✅ Dùng **`Array.isArray()`** kiểm tra — `typeof` trả `"object"`
- ✅ Dùng **`.toSorted()`** (ES2023) thay `.sort()` để không mutate
- ✅ Dùng **`.at(-1)`** thay `arr[arr.length - 1]`

## Pitfalls

- ❌ `.sort()` sắp xếp **string** mặc định: `[10, 2, 1].sort()` → `[1, 10, 2]`
- ❌ `delete arr[1]` tạo "lỗ hổng" — dùng `splice` thay
- ❌ `.forEach()` không `break` được — dùng `for...of`
- ❌ So sánh mảng: `[1,2] === [1,2]` → `false` (so tham chiếu)
