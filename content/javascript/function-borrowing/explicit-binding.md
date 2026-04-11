# Explicit Binding — call, apply, bind

## Khái niệm (What)

JavaScript cho phép **chỉ định rõ ràng** giá trị `this` bằng 3 phương thức: `call()`, `apply()`, và `bind()`. Đây gọi là **explicit binding** (ràng buộc tường minh).

## Cách dùng (Usage)

### `call()` — gọi ngay, truyền tham số rời

```js
function chao(loiChao, dauCau) {
  console.log(`${loiChao}, ${this.ten}${dauCau}`);
}

const user = { ten: "An" };
chao.call(user, "Xin chào", "!"); // "Xin chào, An!"
```

### `apply()` — gọi ngay, truyền tham số là mảng

```js
chao.apply(user, ["Hello", "?"]); // "Hello, An?"

// Use case thực tế: tìm max trong mảng (trước spread)
const nums = [5, 1, 8, 3];
Math.max.apply(null, nums); // 8
// Hiện đại: Math.max(...nums)
```

### `bind()` — trả hàm mới, KHÔNG gọi ngay

```js
const chaoAn = chao.bind(user, "Hi");
chaoAn("!");  // "Hi, An!"
chaoAn("?");  // "Hi, An?"

// Use case: event handler giữ context
class Timer {
  constructor() {
    this.seconds = 0;
    // bind để setInterval giữ đúng this
    setInterval(this.tick.bind(this), 1000);
  }
  tick() {
    this.seconds++;
    console.log(this.seconds);
  }
}
```

### Partial Application (Hàm áp dụng một phần)

```js
function log(level, timestamp, message) {
  console.log(`[${level}] ${timestamp}: ${message}`);
}

const logError = log.bind(null, "ERROR");
const logInfo = log.bind(null, "INFO");

logError(Date.now(), "Something failed");
logInfo(Date.now(), "Server started");
```

## So sánh `call` vs `apply` vs `bind`

| Phương thức | Gọi ngay? | Tham số | Trả về |
|------------|-----------|---------|--------|
| `call(thisArg, a, b, c)` | ✅ Ngay | Rời rạc | Kết quả hàm |
| `apply(thisArg, [a, b, c])` | ✅ Ngay | Mảng | Kết quả hàm |
| `bind(thisArg, a, b)` | ❌ Không | Rời rạc (partial) | **Hàm mới** |

## Function Borrowing

Mượn method từ object khác:

```js
const person = {
  fullName() {
    return `${this.ho} ${this.ten}`;
  }
};

const student = { ho: "Nguyễn", ten: "An" };

// Mượn fullName và gọi với student làm this
person.fullName.call(student); // "Nguyễn An"
```

## Best Practices

- ✅ Dùng **`bind`** cho event handler, callback cần giữ `this`
- ✅ Dùng **arrow function** thay `bind` khi có thể — gọn hơn
- ✅ Dùng **`call`/`apply`** cho function borrowing
- ✅ Hiện đại: spread thay `apply` — `fn(...args)` thay `fn.apply(null, args)`

## Pitfalls

- ❌ `bind()` trả hàm mới — gọi `bind` nhiều lần tạo nhiều hàm (memory)
- ❌ `bind()` **không thể ghi đè** `this` sau khi bind lần đầu
- ❌ Arrow function **bỏ qua** `call`/`apply`/`bind` — `this` luôn lexical

```js
const fn = (() => this);
fn.call({ x: 1 }); // vẫn = outer this, KHÔNG phải { x: 1 }
```
