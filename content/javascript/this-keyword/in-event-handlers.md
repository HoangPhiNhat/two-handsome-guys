# `this` trong Event Handler

## Khái niệm (What)

Trong DOM event handler, `this` trỏ tới **phần tử nhận sự kiện** (element mà listener được gắn). Tuy nhiên, arrow function thay đổi hành vi này.

## Cách dùng (Usage)

```js
const btn = document.querySelector("#myBtn");

// Function thường — this = element
btn.addEventListener("click", function (e) {
  console.log(this);           // <button id="myBtn">...</button>
  console.log(this === e.currentTarget); // true
  this.classList.toggle("active");
});

// ❌ Arrow function — this = scope bên ngoài (KHÔNG phải element)
btn.addEventListener("click", (e) => {
  console.log(this);           // window hoặc undefined (module)
  // this.classList.toggle(...)  // ❌ lỗi!
  e.currentTarget.classList.toggle("active"); // ✅ dùng event object
});
```

### Inline event (HTML) — tránh dùng

```html
<!-- this = element -->
<button onclick="console.log(this)">Click</button>
```

## Best Practices

- ✅ Dùng **function thường** khi cần `this` = element
- ✅ Dùng **`e.currentTarget`** hoặc **`e.target`** khi dùng arrow
- ✅ Tránh inline event handler trong HTML

## Pitfalls

- ❌ Arrow function trong addEventListener → `this` KHÔNG phải element
- ❌ `e.target` vs `e.currentTarget`: target = phần tử thực sự click, currentTarget = phần tử gắn listener
