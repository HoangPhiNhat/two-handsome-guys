# IIFE (Immediately Invoked Function Expression)

## Khái niệm (What)

IIFE là hàm được **định nghĩa và gọi ngay lập tức**. Trước ES6 (khi chưa có `let`/`const` với block scope), IIFE là cách duy nhất để **tạo scope riêng**, tránh ô nhiễm global.

## Cách dùng (Usage)

```js
// Cú pháp cơ bản
(function () {
  const secret = "không ai thấy";
  console.log("Chạy ngay!");
})();

// Arrow function
(() => {
  console.log("IIFE arrow");
})();

// Có tham số
((name) => {
  console.log(`Chào ${name}`);
})("An");

// Async IIFE
(async () => {
  const data = await fetch("/api/data").then(r => r.json());
  console.log(data);
})();
```

### Module Pattern (trước ES6)

```js
const Counter = (function () {
  let count = 0; // private

  return {
    increment() { count++; },
    decrement() { count--; },
    getCount() { return count; },
  };
})();

Counter.increment();
Counter.increment();
Counter.getCount(); // 2
// Counter.count → undefined — private!
```

## Khi nào dùng (When)

- **Top-level `await` workaround** — trong script không phải module
- **Tránh ô nhiễm global** — trong code không dùng module
- **Khởi tạo một lần** — setup code, config initialization

## Tại sao cần biết (Why)

- Hiểu **code legacy** — rất phổ biến pre-ES6
- Hiểu **module bundler output** — webpack/rollup wrap code trong IIFE
- **async IIFE** vẫn hữu ích trong script/config file

## So sánh: IIFE vs Block Scope vs Module

| Phương pháp | Scope riêng? | Khi nào |
|------------|------------|--------|
| IIFE | ✅ | Code cũ, script tag |
| Block `{}` + `let`/`const` | ✅ | ES6+, cần scope nhanh |
| ES Module (`import`/`export`) | ✅ | Cách hiện đại, mặc định |

## Pitfalls

- ❌ IIFE **ít cần** trong code hiện đại — dùng block scope hoặc module
- ❌ Quên `;` trước IIFE → lỗi khi nối file: `a = 1(function(){})()` → parse sai
- ❌ Dùng IIFE khi không cần — over-engineering
