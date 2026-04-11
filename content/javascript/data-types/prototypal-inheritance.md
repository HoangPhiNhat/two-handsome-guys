# Kế thừa theo Prototype (Prototypal Inheritance)

## Khái niệm (What)

JavaScript dùng **kế thừa dựa prototype** (prototypal inheritance), không phải kế thừa class kiểu Java/C# truyền thống. Khi truy cập thuộc tính, engine **ủy quyền tra cứu** (delegation) lên chuỗi prototype cho đến khi tìm thấy hoặc gặp `null`.

ES6 `class` và `extends` chủ yếu là **cú pháp đường** (syntactic sugar) trên nền prototype.

## Cách hoạt động (How)

```
instance → SubClass.prototype → SuperClass.prototype → Object.prototype → null
```

Khi gọi `obj.method()`:
1. Tìm `method` trên chính `obj`
2. Không có → tìm trên `Object.getPrototypeOf(obj)`
3. Tiếp tục cho đến `null` → `undefined`

## Cách dùng (Usage)

### 1. Dùng `Object.create` (cách thủ công)

```js
const dongVat = {
  keu() {
    return `${this.ten} kêu: ...`;
  }
};

const cho = Object.create(dongVat);
cho.ten = "Lucky";
cho.keu = function () {
  return `${this.ten} kêu: Gâu gâu!`;
};

console.log(cho.keu()); // "Lucky kêu: Gâu gâu!" — own method (shadow)
delete cho.keu;
console.log(cho.keu()); // "Lucky kêu: ..." — fallback lên prototype
```

### 2. Dùng Constructor Function (cách cũ)

```js
function DongVat(ten) {
  this.ten = ten;
}
DongVat.prototype.keu = function () {
  return "...";
};

function Cho(ten, giong) {
  DongVat.call(this, ten); // gọi constructor cha
  this.giong = giong;
}

// Thiết lập chuỗi prototype
Cho.prototype = Object.create(DongVat.prototype);
Cho.prototype.constructor = Cho; // sửa lại constructor reference

Cho.prototype.keu = function () {
  return "Gâu gâu!";
};

const d = new Cho("Lucky", "Corgi");
d.keu();            // "Gâu gâu!"
d instanceof Cho;    // true
d instanceof DongVat; // true
```

### 3. Dùng `class` và `extends` (cách hiện đại — khuyên dùng)

```js
class DongVat {
  constructor(ten) {
    this.ten = ten;
  }
  keu() {
    return "...";
  }
}

class Cho extends DongVat {
  constructor(ten, giong) {
    super(ten);        // BẮT BUỘC gọi super() trước khi dùng this
    this.giong = giong;
  }
  keu() {
    return "Gâu gâu!"; // override method cha
  }
  moTa() {
    return `${this.ten} (${this.giong}) — ${this.keu()}`;
  }
}

const dog = new Cho("Lucky", "Corgi");
dog.moTa();          // "Lucky (Corgi) — Gâu gâu!"
dog instanceof Cho;    // true
dog instanceof DongVat; // true
```

### 4. Ghi đè (Override / Shadow)

Thuộc tính **trên chính object** che (shadow) thuộc tính cùng tên trên prototype:

```js
const base = { loiChao: "Xin chào" };
const con = Object.create(base);
con.loiChao = "Hi"; // shadow — chỉ ghi lên con, không ảnh hưởng base

console.log(con.loiChao);  // "Hi" — own property
console.log(base.loiChao); // "Xin chào" — không bị sửa
```

## Khi nào dùng (When)

- **Tạo hệ thống class/object** có quan hệ cha-con
- **Chia sẻ method** giữa nhiều instance (tiết kiệm bộ nhớ)
- **Mixin pattern**: kết hợp nhiều nguồn behavior vào object

```js
// Mixin — kết hợp nhiều nguồn (không cần chuỗi dài)
const Serializable = {
  toJSON() { return JSON.stringify(this); }
};

const Loggable = {
  log() { console.log(this.toJSON()); }
};

class User {
  constructor(ten) { this.ten = ten; }
}

Object.assign(User.prototype, Serializable, Loggable);

const u = new User("An");
u.log(); // '{"ten":"An"}'
```

## So sánh: Prototypal vs Classical Inheritance

| Đặc điểm | Prototypal (JS) | Classical (Java/C#) |
|-----------|----------------|-------------------|
| Cơ chế | Ủy quyền tra cứu trên chuỗi object | Copy behavior từ class blueprint |
| Tạo instance | `new` + constructor / `Object.create` | `new` + class |
| Đa kế thừa | Không trực tiếp (dùng mixin) | Interface / multiple inheritance |
| Runtime thay đổi | Có thể sửa prototype lúc runtime | Cố định sau compile |

## Best Practices

- ✅ Dùng **`class`/`extends`** — cú pháp rõ ràng, được engine tối ưu
- ✅ Luôn gọi **`super()`** trong constructor con **trước** khi dùng `this`
- ✅ Dùng **composition over inheritance** khi mối quan hệ không phải "is-a"
- ✅ Dùng **mixin** cho shared behavior giữa class không cùng cây kế thừa

## Pitfalls

- ❌ **Quên `super()` trong constructor con** → `ReferenceError: Must call super constructor`
- ❌ **Sửa prototype của built-in** (`Array.prototype.myMethod = ...`) → ảnh hưởng toàn bộ runtime
- ❌ **Chuỗi prototype quá dài** → chậm tra cứu, khó debug
- ❌ **Nhầm `class` JS với class Java** → Vẫn là prototype delegation bên dưới, không có true encapsulation (trước `#private`)
