# Lexical Scoping (Phạm vi từ vựng)

## Khái niệm (What)

**Lexical scoping** nghĩa là scope của biến được xác định bởi **vị trí khai báo trong source code** — không phải nơi hàm được gọi. Đây là nền tảng cho closure.

## Cách hoạt động (How)

Khi engine tìm biến, nó tra cứu theo **scope chain** — từ scope hiện tại ra scope bao ngoài, rồi global:

```js
const x = "global";

function outer() {
  const y = "outer";

  function inner() {
    const z = "inner";
    console.log(x); // "global" — tìm lên scope chain
    console.log(y); // "outer"  — tìm ở scope cha
    console.log(z); // "inner"  — scope hiện tại
  }

  inner();
}
outer();
```

### So sánh: Lexical vs Dynamic scoping

```js
const x = 10;

function foo() {
  console.log(x); // Lexical: 10 (theo vị trí khai báo)
  // Dynamic scoping (không có trong JS): sẽ tìm trong scope CỦA NƠI GỌI
}

function bar() {
  const x = 20;
  foo(); // output: 10 — vì lexical scope, KHÔNG phải 20
}

bar();
```

## Tại sao quan trọng (Why)

- **Closure** — hàm con nhớ được biến scope cha nhờ lexical scoping
- **Module pattern** — biến private nhờ scope ngoài
- **Dự đoán được** — nhìn code biết biến lấy từ đâu, không phụ thuộc runtime

## Best Practices

- ✅ Hiểu rằng scope xác định lúc **viết code**, không phải lúc chạy
- ✅ Arrow function + lexical `this` = dễ dự đoán behavior
- ✅ Tận dụng lexical scope cho encapsulation (closure, module)

## Pitfalls

- ❌ Nhầm lexical scope với call stack — scope theo khai báo, không theo gọi
- ❌ `this` trong function thường là **dynamic** (theo cách gọi) — ngoại lệ của lexical scoping
