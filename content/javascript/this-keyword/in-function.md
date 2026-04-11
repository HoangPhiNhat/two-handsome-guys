# `this` trong Function (Hàm thường)

## Khái niệm (What)

Khi hàm được gọi **độc lập** (không phải method, không phải `new`), `this` phụ thuộc chế độ:
- **Non-strict**: `this` = `globalThis` (`window` trong browser, `global` trong Node)
- **Strict mode**: `this` = `undefined`

## Cách dùng (Usage)

```js
function showThis() {
  console.log(this);
}

showThis(); // window (browser, non-strict) hoặc undefined (strict mode)

// Strict mode
"use strict";
function strictFn() {
  console.log(this); // undefined
}
strictFn();
```

### Lỗi phổ biến: callback trong method

```js
const timer = {
  seconds: 0,
  start() {
    // ❌ function thường — this = window/undefined
    setInterval(function () {
      this.seconds++; // TypeError hoặc sửa nhầm global
    }, 1000);

    // ✅ Arrow function — lexical this = timer
    setInterval(() => {
      this.seconds++; // ✅ this = timer
    }, 1000);
  }
};
```

## Best Practices

- ✅ Dùng **strict mode** (hoặc module) — `this` rõ ràng hơn (`undefined` thay `window`)
- ✅ Dùng **arrow function** cho callback khi cần `this` từ context bên ngoài
- ✅ Dùng **`bind()`** nếu cần truyền function thường mà giữ `this`

## Pitfalls

- ❌ Non-strict mode: `this` = `window` → vô tình sửa global
- ❌ Nhầm function thường là arrow → `this` khác nhau
