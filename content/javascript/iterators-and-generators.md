# Iterator và Generator

## Khái niệm (What)

**Iterator Protocol** chuẩn hóa cách "duyệt qua" tập giá trị. **Generator** (`function*`) tạo iterator dễ dàng bằng `yield` — hàm có thể **tạm dừng** và **tiếp tục**.

## Iterator Protocol (How)

Object là **iterable** nếu có method `[Symbol.iterator]()` trả về **iterator** (object có method `next()` trả `{ value, done }`).

```js
const arr = ["a", "b", "c"];
const it = arr[Symbol.iterator]();

it.next(); // { value: "a", done: false }
it.next(); // { value: "b", done: false }
it.next(); // { value: "c", done: false }
it.next(); // { value: undefined, done: true }
```

`for...of`, spread `[...x]`, destructuring — tất cả dùng iterator protocol.

### Custom Iterable

```js
class Range {
  constructor(start, end) {
    this.start = start;
    this.end = end;
  }

  [Symbol.iterator]() {
    let current = this.start;
    const end = this.end;
    return {
      next() {
        return current <= end
          ? { value: current++, done: false }
          : { done: true };
      }
    };
  }
}

for (const n of new Range(1, 5)) {
  console.log(n); // 1, 2, 3, 4, 5
}

console.log([...new Range(1, 3)]); // [1, 2, 3]
```

## Generator Function

```js
function* dem(n) {
  for (let i = 0; i < n; i++) {
    yield i; // tạm dừng, trả giá trị
  }
}

const gen = dem(3);
gen.next(); // { value: 0, done: false }
gen.next(); // { value: 1, done: false }
gen.next(); // { value: 2, done: false }
gen.next(); // { value: undefined, done: true }

// Dùng với for...of
for (const x of dem(5)) {
  console.log(x); // 0, 1, 2, 3, 4
}
```

### Yield Two-Way Communication

```js
function* chat() {
  const name = yield "Tên bạn là gì?";
  const age = yield `Chào ${name}! Bao nhiêu tuổi?`;
  return `${name}, ${age} tuổi`;
}

const c = chat();
c.next();           // { value: "Tên bạn là gì?", done: false }
c.next("An");       // { value: "Chào An! Bao nhiêu tuổi?", done: false }
c.next(25);         // { value: "An, 25 tuổi", done: true }
```

### Infinite Sequence

```js
function* fibonacci() {
  let a = 0, b = 1;
  while (true) {
    yield a;
    [a, b] = [b, a + b];
  }
}

// Lấy 10 số Fibonacci đầu tiên
const fib10 = [];
for (const n of fibonacci()) {
  if (fib10.length >= 10) break;
  fib10.push(n);
}
// [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]
```

### Async Generator (ES2018)

```js
async function* fetchPages(url) {
  let page = 1;
  while (true) {
    const res = await fetch(`${url}?page=${page}`);
    const data = await res.json();
    if (data.length === 0) return;
    yield data;
    page++;
  }
}

// Dùng for await...of
for await (const pageData of fetchPages("/api/items")) {
  console.log(pageData);
}
```

## Khi nào dùng (When)

- **Lazy evaluation** — tính giá trị khi cần, không load hết vào memory
- **Infinite sequences** — Fibonacci, random stream
- **Data pipeline** — compose generator thành chuỗi xử lý
- **Async iteration** — stream data, paginated API

## Best Practices

- ✅ Dùng generator cho **lazy sequence** — tiết kiệm bộ nhớ
- ✅ Dùng `for...of` thay `.next()` thủ công khi có thể
- ✅ `async function*` cho stream API/WebSocket
- ✅ **`yield*`** để delegate sang generator khác

```js
function* concat(a, b) {
  yield* a;
  yield* b;
}
[...concat([1, 2], [3, 4])]; // [1, 2, 3, 4]
```

## Pitfalls

- ❌ Generator function trả **iterator**, không phải giá trị — phải gọi `.next()` hoặc dùng `for...of`
- ❌ Generator **không reusable** — sau khi done, phải tạo mới
- ❌ `yield` chỉ dùng trong generator — syntax error nếu trong callback thường
