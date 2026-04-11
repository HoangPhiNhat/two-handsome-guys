# `this` trong Arrow Function

## Khái niệm (What)

Arrow function **không có `this` riêng**. Nó kế thừa `this` từ **lexical scope** (scope bao ngoài tại thời điểm khai báo). Đây là điểm khác biệt quan trọng nhất so với function thường.

## Cách hoạt động (How)

```js
const team = {
  name: "Dev",
  members: ["An", "Binh"],

  // Method thường — this = team
  list() {
    // Arrow callback — kế thừa this từ list() = team
    this.members.forEach(m => {
      console.log(`${m} thuộc ${this.name}`); // ✅ this = team
    });
  }
};

team.list();
// "An thuộc Dev"
// "Binh thuộc Dev"
```

### Arrow không bị ảnh hưởng bởi `call`, `bind`, `apply`

```js
const arrow = () => this;

const obj = { name: "An" };
arrow.call(obj);   // window/undefined — KHÔNG phải obj
arrow.bind(obj)(); // window/undefined — bind vô hiệu với arrow
```

### Class field arrow — auto-bind `this`

```js
class Button {
  label = "Click me";

  // Arrow class field — this luôn = instance
  handleClick = () => {
    console.log(this.label); // ✅ luôn đúng dù truyền đi đâu
  };
}

const btn = new Button();
const fn = btn.handleClick;
fn(); // "Click me" — không mất context!
```

## Bảng tổng hợp `this` trong các ngữ cảnh

| Ngữ cảnh | Function thường | Arrow function |
|----------|----------------|----------------|
| Method call (`obj.fn()`) | `this` = `obj` | `this` = lexical scope |
| Gọi độc lập (`fn()`) | `window` / `undefined` | `this` = lexical scope |
| Event handler | `this` = element | `this` = lexical scope |
| `call`/`apply`/`bind` | `this` = argument | **Không ảnh hưởng** |
| `new` | `this` = instance mới | ❌ TypeError |

## Best Practices

- ✅ Dùng arrow cho **callback** (`.map`, `.then`, `setTimeout`) — giữ `this` context
- ✅ Dùng arrow **class field** khi method sẽ truyền đi (event handler)
- ✅ Dùng function thường cho **method chính** của object literal

## Pitfalls

- ❌ Arrow làm **method** trong object literal → `this` không phải object đó
- ❌ Arrow làm **constructor** → TypeError (`new` không dùng được)
- ❌ `call`/`bind` không thay đổi `this` của arrow
