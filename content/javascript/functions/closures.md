# Closure (Bao đóng)

## Khái niệm (What)

**Closure** xảy ra khi một hàm **ghi nhớ và truy cập** biến từ scope bao ngoài, ngay cả sau khi hàm ngoài đã return. Đây là một trong những khái niệm quan trọng nhất của JavaScript.

## Cách hoạt động (How)

Khi hàm được tạo, nó nhận một tham chiếu ẩn đến **lexical environment** (bao gồm biến của scope bao ngoài). Tham chiếu này giữ biến "sống" ngay cả khi hàm ngoài đã kết thúc.

```js
function taoCounter() {
  let count = 0; // biến này "bị đóng gói" bởi closure

  return function() {
    count++;
    return count;
  };
}

const counter = taoCounter();
counter(); // 1
counter(); // 2
counter(); // 3
// count không thể truy cập từ ngoài — "private"!
```

## Cách dùng (Usage)

### 1. Data Privacy (Module Pattern)

```js
function createWallet(initialBalance) {
  let balance = initialBalance; // private

  return {
    deposit(amount) {
      balance += amount;
      return balance;
    },
    withdraw(amount) {
      if (amount > balance) throw new Error("Không đủ số dư");
      balance -= amount;
      return balance;
    },
    getBalance() {
      return balance;
    }
  };
}

const wallet = createWallet(1_000_000);
wallet.deposit(500_000);   // 1_500_000
wallet.getBalance();       // 1_500_000
// wallet.balance → undefined — PRIVATE!
```

### 2. Function Factory

```js
function createMultiplier(factor) {
  return (num) => num * factor; // closure giữ `factor`
}

const double = createMultiplier(2);
const triple = createMultiplier(3);

double(5); // 10
triple(5); // 15
```

### 3. Memoization (Cache kết quả)

```js
function memoize(fn) {
  const cache = new Map(); // closure giữ cache

  return function (...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);

    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

const expensiveCalc = memoize((n) => {
  console.log("Tính toán...");
  return n * n;
});

expensiveCalc(5); // "Tính toán..." → 25
expensiveCalc(5); // 25 (từ cache, không log)
```

### 4. Event Handler / Callback

```js
function setupButton(buttonId, message) {
  const btn = document.getElementById(buttonId);
  btn.addEventListener("click", () => {
    alert(message); // closure giữ `message`
  });
}

setupButton("btn1", "Xin chào!");
setupButton("btn2", "Tạm biệt!");
```

### 5. Partial Application / Currying

```js
function fetchAPI(baseURL) {
  return function (endpoint) {
    return fetch(`${baseURL}${endpoint}`).then(r => r.json());
  };
}

const api = fetchAPI("https://api.example.com");
api("/users");     // GET https://api.example.com/users
api("/products");  // GET https://api.example.com/products
```

## Khi nào dùng (When)

- **Data encapsulation** — biến private không cần class
- **Function factory** — tạo hàm với config riêng
- **Callback/event handler** — giữ context
- **Memoization / caching** — giữ cache giữa các lần gọi

## Tại sao quan trọng (Why)

- Closure là **nền tảng** của React hooks (`useState`, `useEffect`)
- Nhiều design pattern dựa trên closure: **module**, **observer**, **middleware**
- Hiểu closure = hiểu cách **bộ nhớ** và **scope** hoạt động trong JS

## Best Practices

- ✅ Dùng closure cho **data privacy** khi không cần class
- ✅ **Giữ closure nhỏ** — chỉ close over biến cần thiết
- ✅ **Clear references** khi không cần — tránh memory leak

## Pitfalls

### 1. Vòng lặp `var` + closure — Bug kinh điển

```js
// ❌ Bug
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}
// Log: 3, 3, 3 — tất cả closure share CÙNG biến i (var = function scope)

// ✅ Fix 1: dùng let
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}
// Log: 0, 1, 2 — let tạo binding mới mỗi vòng

// ✅ Fix 2: IIFE (cách cũ)
for (var i = 0; i < 3; i++) {
  ((j) => setTimeout(() => console.log(j), 100))(i);
}
```

### 2. Memory leak từ closure

```js
// ❌ Closure giữ reference lớn
function createHandler() {
  const hugeData = new Array(1_000_000).fill("data");

  return () => {
    console.log(hugeData.length); // closure giữ TOÀN BỘ hugeData
  };
}
// hugeData không bao giờ bị GC vì handler vẫn tham chiếu

// ✅ Fix: chỉ giữ cái cần
function createHandler() {
  const hugeData = new Array(1_000_000).fill("data");
  const length = hugeData.length; // chỉ giữ length

  return () => {
    console.log(length); // hugeData có thể bị GC
  };
}
```

### 3. Stale closure (React)

```js
// Trong React hooks — closure giữ giá trị cũ
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      console.log(count); // ⚠️ luôn là 0 (stale closure)
    }, 1000);
    return () => clearInterval(id);
  }, []); // deps rỗng → closure chỉ capture count = 0

  // ✅ Fix: dùng functional update
  // setCount(prev => prev + 1);
}
```
