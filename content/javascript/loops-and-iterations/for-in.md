# for...in — Duyệt key của Object

## Khái niệm (What)

`for...in` duyệt **tất cả thuộc tính enumerable** (kể cả trên prototype chain) của object, trả về **tên key** (string).

## Cách dùng (Usage)

```js
const user = { ten: "An", tuoi: 25, email: "an@mail.com" };

for (const key in user) {
  console.log(`${key}: ${user[key]}`);
}
// ten: An
// tuoi: 25
// email: an@mail.com
```

### Lọc own properties (quan trọng)

```js
function Animal(name) { this.name = name; }
Animal.prototype.type = "animal"; // trên prototype

const dog = new Animal("Lucky");

// ⚠️ for...in duyệt CẢ prototype
for (const key in dog) {
  console.log(key); // name, type ← type không phải own property
}

// ✅ Fix: lọc bằng hasOwnProperty
for (const key in dog) {
  if (dog.hasOwnProperty(key)) {
    console.log(key); // chỉ "name"
  }
}
```

## Khi nào dùng (When)

- Duyệt **key** của object thông thường (config, mapping)
- **KHÔNG** dùng cho Array — thứ tự không đảm bảo, duyệt cả prototype

## So sánh `for...in` vs `Object.keys()` vs `for...of`

| Phương thức | Duyệt | Prototype? | Dùng cho |
|------------|-------|-----------|---------|
| `for...in` | Key (string) | ✅ Có | Object |
| `Object.keys(obj)` | Own key | ❌ Không | Object (an toàn hơn) |
| `for...of` | **Giá trị** | — | Array, Map, Set, String |

```js
// Thay thế an toàn hơn
Object.keys(user).forEach(key => {
  console.log(`${key}: ${user[key]}`);
});

// Hoặc entries
for (const [key, val] of Object.entries(user)) {
  console.log(`${key}: ${val}`);
}
```

## Pitfalls

- ❌ **KHÔNG dùng `for...in` cho Array** — có thể duyệt cả property thêm vào, thứ tự không chắc
- ❌ Quên `hasOwnProperty()` → duyệt cả prototype
- ❌ Key luôn là **string** — ngay cả khi object có key là số
