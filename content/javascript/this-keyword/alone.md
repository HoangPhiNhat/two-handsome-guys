# `this` khi đứng một mình (Global Context)

## Khái niệm (What)

Ở **top-level** (ngoài bất kỳ hàm nào), `this` trỏ tới **global object** — `window` (browser), `global` (Node), hoặc `globalThis` (chuẩn chung ES2020).

## Cách dùng (Usage)

```js
// Browser
console.log(this === window);     // true (non-strict, script tag)
console.log(this === globalThis); // true

// Node (top-level module)
console.log(this); // {} (trong ES Module) hoặc module.exports (CommonJS)
```

### ES Module — ngoại lệ

```js
// Trong ES Module, top-level this = undefined
// <script type="module">
console.log(this); // undefined
// </script>
```

## `globalThis` — chuẩn đa môi trường (ES2020)

```js
// Luôn trỏ tới global object dù ở đâu
console.log(globalThis); // window (browser) / global (Node)
```

## Best Practices

- ✅ Dùng **`globalThis`** nếu cần truy cập global object đa môi trường
- ✅ **Tránh** dùng `this` ở global scope — không rõ ràng, dễ nhầm

## Pitfalls

- ❌ `this` ở top-level khác nhau giữa script, module, và Node
- ❌ Dựa vào `window` → chỉ chạy trên browser  
