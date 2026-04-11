# `this` trong Method (Phương thức)

## Khái niệm (What)

Khi hàm được gọi **như method của object** (`obj.method()`), `this` trỏ tới **object đứng trước dấu chấm** — chính là object sở hữu method đó.

## Cách hoạt động (How)

```js
const user = {
  ten: "An",
  chao() {
    console.log(this);     // { ten: "An", chao: ƒ }
    console.log(this.ten); // "An"
  }
};

user.chao(); // this = user (object trước dấu chấm)
```

### Method shorthand vs Arrow

```js
const obj = {
  val: 42,
  // ✅ Method shorthand — this = obj
  getVal() { return this.val; },
  // ❌ Arrow — KHÔNG có this riêng → this từ scope ngoài (global/module)
  getValArrow: () => this.val, // undefined hoặc lỗi
};
```

### Method gán vào biến → mất context

```js
const user = {
  name: "An",
  greet() { return `Hi, ${this.name}`; }
};

const fn = user.greet;
fn(); // "Hi, undefined" — this = global (hoặc undefined trong strict mode)

// ✅ Fix: bind
const bound = user.greet.bind(user);
bound(); // "Hi, An"
```

## Best Practices

- ✅ Dùng **method shorthand** `method() {}` — không dùng arrow cho method
- ✅ **Bind** khi truyền method ra ngoài (event handler, callback)
- ✅ Hiểu rằng `this` phụ thuộc **cách gọi**, không phải nơi khai báo

## Pitfalls

- ❌ Arrow function làm method → `this` sai
- ❌ Gán method vào biến → mất context
- ❌ Truyền method vào callback → `this` thay đổi
