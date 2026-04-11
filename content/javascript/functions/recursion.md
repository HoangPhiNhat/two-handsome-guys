# Đệ quy (Recursion)

## Khái niệm (What)

Đệ quy là kỹ thuật hàm **gọi chính nó** để giải bài toán bằng cách chia nhỏ thành bài toán con cùng dạng. Mỗi hàm đệ quy cần **base case** (điều kiện dừng) để tránh lặp vô hạn.

## Cách hoạt động (How)

Mỗi lần gọi đệ quy, engine **push** execution context mới lên call stack. Khi gặp base case, các context được **pop** lần lượt (unwinding).

## Cách dùng (Usage)

### Giai thừa

```js
function giaiThua(n) {
  if (n <= 1) return 1;        // base case
  return n * giaiThua(n - 1);  // recursive case
}

giaiThua(5); // 120
// 5 * 4 * 3 * 2 * 1

// Call stack: giaiThua(5) → giaiThua(4) → ... → giaiThua(1) return 1 → unwind
```

### Duyệt cây / object sâu

```js
function flatten(obj, prefix = "", result = {}) {
  for (const [key, val] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}.${key}` : key;
    if (typeof val === "object" && val !== null && !Array.isArray(val)) {
      flatten(val, newKey, result); // đệ quy vào object con
    } else {
      result[newKey] = val;
    }
  }
  return result;
}

flatten({ a: { b: { c: 1 } }, d: 2 });
// { "a.b.c": 1, "d": 2 }
```

### Fibonacci — minh họa cache

```js
// ❌ Không tối ưu — O(2^n)
function fib(n) {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
}

// ✅ Memoization — O(n)
function fibMemo(n, cache = {}) {
  if (n in cache) return cache[n];
  if (n <= 1) return n;
  cache[n] = fibMemo(n - 1, cache) + fibMemo(n - 2, cache);
  return cache[n];
}

fibMemo(50); // 12586269025 — nhanh
```

## Khi nào dùng (When)

- **Cấu trúc cây**: DOM tree, file system, JSON deep
- **Chia để trị**: quicksort, mergesort
- **Backtracking**: sudoku solver, permutations

## So sánh: Đệ quy vs Iteration

| Tiêu chí | Đệ quy | Iteration (loop) |
|----------|---------|-----------------|
| Code | Ngắn, thanh lịch cho bài toán cây | Dài hơn nhưng rõ ràng |
| Hiệu năng | Call stack overhead | Nhanh hơn, ít bộ nhớ |
| Stack overflow | Có thể xảy ra | Không |

## Best Practices

- ✅ **Luôn có base case** rõ ràng
- ✅ **Memoization** cho đệ quy có overlapping subproblems
- ✅ Chuyển sang **iteration** khi depth lớn (>10k) để tránh stack overflow
- ✅ Xem xét **tail recursion** (Safari hỗ trợ, V8 chưa)

## Pitfalls

- ❌ **Quên base case** → RangeError: Maximum call stack size exceeded
- ❌ **Đệ quy naive** cho Fibonacci → exponential time
- ❌ JavaScript **không tối ưu tail call** trên V8/SpiderMonkey
