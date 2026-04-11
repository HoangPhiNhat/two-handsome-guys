# Nguyên mẫu (Prototype) của Object

## Khái niệm (What)

Trong JavaScript, hầu hết object được nối với một object khác gọi là **prototype**. Khi đọc thuộc tính mà object không có, engine **tìm trên chuỗi prototype** (prototype chain) cho đến khi tìm thấy hoặc gặp `null`.

Đây là cơ chế **kế thừa** cốt lõi của JavaScript — khác biệt hoàn toàn so với class-based inheritance của Java/C#.

## Cách hoạt động (How)

```
myObj → MyConstructor.prototype → Object.prototype → null
  ↑            ↑                        ↑              ↑
(tìm tại đây) (nếu không thấy)    (tiếp tục)      (dừng → undefined)
```

Mỗi object có slot nội bộ `[[Prototype]]` trỏ đến prototype của nó.

## Cách dùng (Usage)

### `[[Prototype]]` và cách truy cập

```js
const a = { x: 1 };
const b = Object.create(a); // b có [[Prototype]] trỏ tới a
b.y = 2;

console.log(b.x); // 1 — không có trên b, tìm thấy trên prototype (a)
console.log(b.y); // 2 — có trên chính b

// Kiểm tra prototype
console.log(Object.getPrototypeOf(b) === a); // true
```

### `prototype` trên hàm constructor

Khi dùng `new Fn()`, object mới có `[[Prototype]]` trỏ tới `Fn.prototype`:

```js
function Nguoi(ten) {
  this.ten = ten;
}

// Method được chia sẻ qua prototype (tiết kiệm bộ nhớ)
Nguoi.prototype.chao = function () {
  return "Chào " + this.ten;
};

const an = new Nguoi("An");
const binh = new Nguoi("Bình");

an.chao();   // "Chào An"
binh.chao(); // "Chào Bình"

// Cả hai DÙNG CHUNG một hàm chao trên prototype
console.log(an.chao === binh.chao); // true
```

### `Object.prototype` — đỉnh chuỗi

Gần như mọi object cuối chuỗi đều nối tới `Object.prototype`:

```js
const obj = { a: 1 };
console.log(obj.toString());    // "[object Object]" — từ Object.prototype
console.log(obj.hasOwnProperty("a")); // true — từ Object.prototype

// Ngoại lệ: object không có prototype
const bare = Object.create(null);
// bare.toString(); // TypeError — không có prototype nào
```

### Kiểm tra own property vs inherited

```js
const animal = { type: "dog" };
const pet = Object.create(animal);
pet.name = "Lucky";

console.log("name" in pet);              // true — own
console.log("type" in pet);              // true — inherited
console.log(pet.hasOwnProperty("name")); // true
console.log(pet.hasOwnProperty("type")); // false — trên prototype
```

## Tại sao cần hiểu Prototype (Why)

- **Class ES6 = syntactic sugar trên prototype** — hiểu prototype = hiểu class ở mức sâu
- **Debug `this`**, `instanceof`, lỗi method mất context
- **Tiết kiệm bộ nhớ**: method trên prototype được share, không duplicate mỗi instance
- **Hiểu thư viện**: nhiều thư viện (jQuery, Lodash, framework) dùng prototype manipulation

## Best Practices

- ✅ Dùng **`class`/`extends`** cho code hiện đại — cú pháp rõ ràng hơn
- ✅ Dùng **`Object.getPrototypeOf()`** thay vì `__proto__`
- ✅ Dùng **`hasOwnProperty()`** khi duyệt `for...in` để lọc inherited properties
- ✅ Đặt **method trên prototype** (hoặc class), không gán trong constructor

## Pitfalls

- ❌ **Dùng `__proto__`** — accessor lịch sử, không chuẩn; dùng `Object.getPrototypeOf` / `Object.setPrototypeOf`
- ❌ **Sửa `Object.prototype`** — ảnh hưởng MỌI object trong runtime — cực kỳ nguy hiểm
- ❌ **Nhầm `prototype` property của hàm với `[[Prototype]]` của object** — hai khái niệm khác nhau

```js
function Foo() {}
// Foo.prototype — object dùng làm [[Prototype]] cho instance tạo bởi new Foo()
// Object.getPrototypeOf(Foo) — [[Prototype]] của chính hàm Foo (thường là Function.prototype)
```
