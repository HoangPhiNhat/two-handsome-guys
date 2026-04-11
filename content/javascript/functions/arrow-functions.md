# Arrow Functions (Hàm mũi tên)

## Khái niệm (What)

Arrow function (ES6) là cú pháp **ngắn gọn** để khai báo hàm. Điểm khác biệt quan trọng nhất: arrow function **không có `this` riêng** — nó kế thừa `this` từ scope bao ngoài (lexical `this`).

## Cách dùng (Usage)

```js
// Đầy đủ
const cong = (a, b) => {
  return a + b;
};

// Implicit return (1 biểu thức)
const cong = (a, b) => a + b;

// 1 tham số — bỏ ()
const binh = x => x ** 2;

// 0 tham số — cần ()
const now = () => Date.now();

// Return object literal — cần bọc ()
const makeUser = (ten) => ({ ten, createdAt: Date.now() });
```

## So sánh Arrow vs Function truyền thống

| Đặc điểm | Arrow | Function |
|-----------|-------|----------|
| `this` | **Lexical** (kế thừa bên ngoài) | Phụ thuộc cách gọi |
| `arguments` | ❌ Không có | ✅ Có |
| Dùng `new` | ❌ Không phải constructor | ✅ Là constructor |
| `prototype` | ❌ Không có | ✅ Có |
| Hoisting | ❌ (vì gán vào biến) | ✅ (function declaration) |
| Method trong object | ❌ Tránh | ✅ Dùng |

### Lexical `this` — điểm khác biệt lớn nhất

```js
const team = {
  name: "Dev Team",
  members: ["An", "Binh", "Chi"],

  // ❌ Arrow KHÔNG có this riêng — lấy this bên ngoài (global)
  listBad: () => {
    this.members.forEach(m => console.log(m)); // TypeError!
  },

  // ✅ Function thường — this = team
  listGood() {
    this.members.forEach(m => {
      console.log(`${m} - ${this.name}`); // ✅ this = team
      // Arrow bên trong callback → lexical this = team
    });
  }
};
```

## Khi nào dùng (When)

| Trường hợp | Dùng |
|-----------|------|
| Callback (`.map`, `.filter`, `.then`) | ✅ Arrow |
| Event handler cần `this` = element | ❌ Tránh arrow |
| Method trong object literal | ❌ Tránh arrow |
| Method trong class | ✅ Arrow (class field) cho auto-bind |
| Hàm utility, helper nhỏ | ✅ Arrow |

## Best Practices

- ✅ Dùng arrow cho **callback ngắn**: `.map(x => x * 2)`
- ✅ Dùng **function declaration** cho hàm chính, cần hoisting
- ✅ Dùng arrow trong class field khi cần **auto-bind** `this`
- ✅ Bỏ `return` và `{}` khi chỉ có 1 biểu thức

## Pitfalls

- ❌ Arrow làm method trong object → `this` sai
- ❌ Arrow không có `arguments` — dùng rest: `(...args) => {}`
- ❌ Quên `()` khi return object: `() => { key: "value" }` → `undefined` (bị hiểu là block)
- ❌ Arrow không thể dùng `new` → TypeError

```js
// ❌ Return object sai
const bad = () => { name: "An" };  // undefined — block statement
// ✅ Fix: bọc ()
const good = () => ({ name: "An" }); // { name: "An" }
```
