# Scope (Phạm vi) trong JavaScript

## Khái niệm (What)

**Scope** xác định **phạm vi truy cập** (visibility) của biến — nơi nào trong code có thể "nhìn thấy" và sử dụng một biến. JavaScript có 3 loại scope chính: **Global**, **Function**, và **Block**.

## Cách hoạt động (How)

Khi engine tìm một biến, nó tra cứu theo **scope chain** — bắt đầu từ scope hiện tại, đi ra ngoài từng lớp cho đến global:

```
Block Scope → Function Scope → Global Scope
     ↑              ↑               ↑
  (tìm tại đây)  (nếu không thấy)  (cuối cùng)
```

Nếu không tìm thấy ở bất kỳ đâu → `ReferenceError`.

## Các loại Scope

### 1. Global Scope (Phạm vi toàn cục)

Biến khai báo bên ngoài mọi hàm/block. Truy cập được từ **mọi nơi**.

```js
const APP_NAME = "Knowledge Hub"; // global

function batKy() {
  console.log(APP_NAME); // ✅ truy cập được
}
```

**Lưu ý quan trọng về `var` và `window`:**

```js
var toancuc = "tôi ở khắp nơi";
let cungToancuc = "tôi cũng vậy nhưng không gắn vào window";

// Chỉ var gắn vào window (trình duyệt)
console.log(window.toancuc);     // "tôi ở khắp nơi"
console.log(window.cungToancuc); // undefined — let/const KHÔNG gắn vào window
```

### 2. Function Scope (Phạm vi hàm)

Biến khai báo bên trong hàm **chỉ thấy được từ bên trong hàm** đó.

```js
function tinhToan() {
  var ketQua = 42;   // function-scoped
  let trungGian = 10; // cũng bị giới hạn trong hàm (và block)
  return ketQua + trungGian;
}

// console.log(ketQua);   // ❌ ReferenceError
// console.log(trungGian); // ❌ ReferenceError
```

### 3. Block Scope (Phạm vi khối) — ES6+

`let` và `const` bị giới hạn trong cặp ngoặc nhọn `{}`. `var` thì **không**.

```js
{
  let blockLet = "chỉ trong block";
  const blockConst = 3.14;
  var thoatRaNgoai = "var không tôn trọng block!";
}

// console.log(blockLet);    // ❌ ReferenceError
// console.log(blockConst);  // ❌ ReferenceError
console.log(thoatRaNgoai);   // ✅ "var không tôn trọng block!"
```

**Block scope áp dụng cho:** `if`, `for`, `while`, `switch`, và bất kỳ cặp `{}` nào:

```js
for (let i = 0; i < 3; i++) {
  // i chỉ tồn tại trong vòng for
}
// console.log(i); // ❌ ReferenceError

for (var j = 0; j < 3; j++) {}
console.log(j); // ✅ 3 — var thoát ra!
```

### 4. Module Scope

Mỗi file ES Module (`import`/`export`) có scope riêng. Biến khai báo trong module **không** tự động trở thành global.

```js
// utils.js — biến nội bộ, không export
const SECRET = "abc123"; // không ai ngoài file này thấy

// Chỉ cái được export mới accessible
export const VERSION = "1.0.0";
```

## Scope Chain và Lexical Scope

**Lexical scope** nghĩa là scope được xác định bởi **vị trí khai báo trong code** (không phải nơi gọi):

```js
const x = "ngoài";

function outer() {
  const y = "giữa";

  function inner() {
    const z = "trong";
    console.log(x); // ✅ "ngoài" — tìm lên scope chain
    console.log(y); // ✅ "giữa"
    console.log(z); // ✅ "trong"
  }

  inner();
  // console.log(z); // ❌ — z chỉ trong inner()
}
```

## Closure — Hệ quả của Lexical Scope

Khi hàm con **giữ tham chiếu** đến biến của scope cha, ngay cả sau khi hàm cha đã return:

```js
function taoTaiKhoan(soDuBanDau) {
  let soDu = soDuBanDau; // biến "private"

  return {
    napTien(so) { soDu += so; },
    rutTien(so) { soDu = Math.max(0, soDu - so); },
    xemSoDu() { return soDu; }
  };
}

const tk = taoTaiKhoan(1_000_000);
tk.napTien(500_000);
console.log(tk.xemSoDu()); // 1_500_000
// tk.soDu → undefined — không truy cập trực tiếp được!
```

## Tại sao Scope quan trọng (Why)

- **Tránh xung đột tên**: hai module có thể dùng cùng tên biến mà không đụng nhau
- **Bảo vệ dữ liệu**: biến private qua closure
- **Giải phóng bộ nhớ**: biến local được GC khi hàm kết thúc (trừ closure)
- **Code dễ đọc**: biết biến thuộc về đâu, ảnh hưởng phạm vi nào

## Best Practices

- ✅ **Khai báo biến ở scope hẹp nhất** có thể — giảm side effect
- ✅ **Dùng `const`/`let`** để có block scope rõ ràng
- ✅ **Tránh biến global** — dùng module, IIFE, hoặc namespace object
- ✅ **Dùng module** (`import`/`export`) thay vì script global

## Pitfalls (Lỗi thường gặp)

### 1. Quên khai báo → tạo global ngầm

```js
function loi() {
  bien = "oops"; // không có let/const/var → global ngầm!
}
loi();
console.log(bien); // "oops" — ô nhiễm global!

// ✅ "use strict" hoặc module sẽ throw ReferenceError
```

### 2. Shadowing (che biến bên ngoài)

```js
const ten = "An";

function test() {
  const ten = "Binh"; // shadow biến ngoài — hợp lệ nhưng dễ nhầm
  console.log(ten);   // "Binh"
}

test();
console.log(ten); // "An" — không bị ảnh hưởng
```

### 3. `var` trong vòng lặp + async

```js
// ❌ Bug kinh điển
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 10);
}
// Log: 3, 3, 3 — var chỉ có 1 biến i cho toàn bộ function

// ✅ Fix: dùng let
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 10);
}
// Log: 0, 1, 2
```
