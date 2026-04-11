# Class (ES2015+)

## Khái niệm (What)

`class` là **cú pháp đường** (syntactic sugar) trên hệ thống prototype. Nó cung cấp cú pháp quen thuộc cho OOP nhưng bên dưới vẫn là **prototype delegation**.

## Cách dùng (Usage)

### Khai báo Class

```js
class Nguoi {
  // Constructor — chạy khi new
  constructor(ten, tuoi) {
    this.ten = ten;
    this.tuoi = tuoi;
  }

  // Method — trên prototype
  chao() {
    return `Chào, tôi là ${this.ten}`;
  }

  // Getter
  get thongTin() {
    return `${this.ten} (${this.tuoi} tuổi)`;
  }

  // Setter
  set tuoiMoi(val) {
    if (val < 0) throw new RangeError("Tuổi phải >= 0");
    this.tuoi = val;
  }

  // Static method — gọi trên class, không trên instance
  static taoKhach() {
    return new Nguoi("Khách", 0);
  }
}

const an = new Nguoi("An", 25);
an.chao();           // "Chào, tôi là An"
an.thongTin;         // "An (25 tuổi)"
an.tuoiMoi = 26;     // setter
Nguoi.taoKhach();    // static
```

### Kế thừa (extends / super)

```js
class HocSinh extends Nguoi {
  constructor(ten, tuoi, lop) {
    super(ten, tuoi);  // BẮT BUỘC gọi super() trước this
    this.lop = lop;
  }

  chao() {
    return `${super.chao()}, lớp ${this.lop}`; // gọi method cha
  }
}

const hs = new HocSinh("Minh", 16, "10A");
hs.chao();            // "Chào, tôi là Minh, lớp 10A"
hs instanceof HocSinh; // true
hs instanceof Nguoi;   // true
```

### Private Fields (`#`) — ES2022

```js
class BankAccount {
  #balance = 0; // private — chỉ truy cập trong class

  constructor(initialBalance) {
    this.#balance = initialBalance;
  }

  deposit(amount) {
    if (amount <= 0) throw new Error("Số tiền phải > 0");
    this.#balance += amount;
  }

  get balance() {
    return this.#balance;
  }

  // Private method
  #validate(amount) {
    return amount > 0 && amount <= this.#balance;
  }
}

const acc = new BankAccount(1000);
acc.deposit(500);
acc.balance;     // 1500
// acc.#balance; // ❌ SyntaxError — private
```

### Static Fields và Static Private

```js
class Config {
  static #instance = null;

  static getInstance() {
    if (!Config.#instance) {
      Config.#instance = new Config();
    }
    return Config.#instance;
  }
}
```

### Class Fields (Public)

```js
class Button {
  label = "Click me";           // public field
  handleClick = () => {         // arrow field — auto-bind this
    console.log(this.label);
  };
}
```

## Khi nào dùng (When)

- **Object cần nhiều instance** với cùng behavior
- **Kế thừa** rõ ràng giữa các entity
- **Encapsulation** với private fields
- **Framework/Library** yêu cầu class (React class components, TypeORM entities)

## So sánh Class vs Factory Function

| Tiêu chí | Class | Factory Function |
|----------|-------|-----------------|
| Private data | `#field` (ES2022) | Closure |
| Kế thừa | `extends` | Composition, Object.assign |
| `this` binding | Cần cẩn thận | Không cần `this` |
| `instanceof` | ✅ | ❌ |
| Memory | Method shared trên prototype | Method riêng mỗi instance |

## Best Practices

- ✅ **Dùng class** khi cần kế thừa, `instanceof`, hoặc framework yêu cầu
- ✅ **Dùng `#private`** thay convention `_private` — hard enforcement
- ✅ **super()** phải gọi TRƯỚC bất kỳ `this` nào trong constructor con
- ✅ **Composition over inheritance** — tránh hierarchy sâu

## Pitfalls

- ❌ **Quên `new`**: `Nguoi("An")` → lỗi (strict mode) hoặc bug (non-strict)
- ❌ **Quên `super()`** trong constructor con → ReferenceError
- ❌ **Arrow method** tốn bộ nhớ hơn — mỗi instance tạo hàm mới (nhưng auto-bind)
- ❌ Class không hoist — phải khai báo trước khi dùng (TDZ)
