# Tham số hàm (Function Parameters)

## Khái niệm (What)

Tham số (parameters) là biến được khai báo trong chữ ký hàm, nhận giá trị từ đối số (arguments) khi hàm được gọi. JavaScript có nhiều cách xử lý tham số linh hoạt.

## Cách dùng (Usage)

### Tham số cơ bản

```js
function chao(ten, loiChao) {
  console.log(`${loiChao}, ${ten}!`);
}
chao("An", "Xin chào"); // "Xin chào, An!"
chao("An");              // "undefined, An!" — thiếu tham số = undefined
```

### Default Parameters (ES6)

```js
function taoUser(ten, role = "viewer", active = true) {
  return { ten, role, active };
}

taoUser("An");                // { ten: "An", role: "viewer", active: true }
taoUser("An", "admin");       // { ten: "An", role: "admin", active: true }
taoUser("An", undefined, false); // undefined → dùng default
```

**Default có thể là biểu thức:**
```js
function getId(prefix = "user", id = Date.now()) {
  return `${prefix}_${id}`;
}
```

### Rest Parameters (ES6)

Gom **tham số còn lại** thành array — phải ở cuối:

```js
function sum(first, ...rest) {
  console.log(first); // 1
  console.log(rest);  // [2, 3, 4, 5]
  return rest.reduce((acc, n) => acc + n, first);
}
sum(1, 2, 3, 4, 5); // 15
```

### Destructuring Parameters

```js
// Object destructuring — phổ biến trong config/options
function fetchData({ url, method = "GET", headers = {} }) {
  console.log(`${method} ${url}`);
}
fetchData({ url: "/api/users" });

// Array destructuring
function firstTwo([a, b]) {
  return a + b;
}
firstTwo([10, 20, 30]); // 30
```

### Truyền theo giá trị vs tham chiếu

```js
// Primitive — truyền BẢN SAO (by value)
function tang(n) { n++; }
let x = 5;
tang(x);
console.log(x); // 5 — không đổi

// Object — truyền THAM CHIẾU (by reference)
function addField(obj) { obj.newField = true; }
const user = { ten: "An" };
addField(user);
console.log(user); // { ten: "An", newField: true } — bị thay đổi!
```

## Best Practices

- ✅ **Destructured options object** cho hàm nhiều tham số — rõ ràng, không quan tâm thứ tự
- ✅ **Default parameters** thay `param || fallback` — không bị vấn đề falsy
- ✅ **Rest parameter** thay `arguments` — là array thực sự, arrow function hỗ trợ
- ✅ **Giới hạn 3 tham số** — quá nhiều → dùng object

```js
// ❌ Quá nhiều tham số
function createUser(name, email, age, role, active, avatar) {}

// ✅ Dùng object
function createUser({ name, email, age, role = "user", active = true, avatar = null }) {}
```

## Pitfalls

- ❌ Default parameter **đánh giá mỗi lần gọi** — object/array mới mỗi lần (khác Python!)
- ❌ Mutation object tham số → side effect ngoài ý muốn — clone trước khi sửa
- ❌ `arguments` không có trong arrow function — dùng rest parameter
