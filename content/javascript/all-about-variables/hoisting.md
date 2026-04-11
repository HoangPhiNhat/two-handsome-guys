# Hoisting trong JavaScript

## Khái niệm (What)

**Hoisting** là hành vi của JavaScript engine trong đó các **khai báo** biến và hàm được "nhấc" (hoist) lên đầu **scope** hiện tại ở giai đoạn compilation, trước khi code thực sự chạy.

> **Quan trọng:** Chỉ **khai báo** (declaration) được hoist, **phép gán** (assignment) KHÔNG được hoist.

## Cách hoạt động (How)

JavaScript engine xử lý code qua 2 bước:

1. **Creation phase**: Quét toàn bộ scope, đăng ký tất cả khai báo
2. **Execution phase**: Chạy code từ trên xuống dưới

| Loại khai báo | Hoist? | Giá trị ban đầu | Truy cập trước khai báo |
|--------------|--------|-----------------|----------------------|
| `var` | ✅ | `undefined` | Được (trả `undefined`) |
| `let` / `const` | ✅ | ❌ Không khởi tạo | ❌ ReferenceError (TDZ) |
| Function Declaration | ✅ | **Toàn bộ hàm** | ✅ Gọi được luôn |
| Function Expression | Như biến chứa nó | — | Phụ thuộc `var`/`let`/`const` |
| `class` | ✅ | ❌ Không khởi tạo | ❌ ReferenceError (TDZ) |

## Cách dùng (Usage)

### 1. Hoisting với `var`

```js
console.log(a); // undefined (không lỗi)
var a = 5;
console.log(a); // 5

// Engine thực sự "thấy":
// var a;          ← khai báo được hoist lên đầu
// console.log(a); ← undefined
// a = 5;          ← gán giá trị tại chỗ
// console.log(a); ← 5
```

### 2. Hoisting với Function Declaration

Khai báo hàm được hoist **hoàn toàn** (cả tên và thân hàm):

```js
chao("An"); // "Chào An!" — gọi TRƯỚC khi định nghĩa, hoàn toàn OK

function chao(ten) {
  console.log("Chào " + ten + "!");
}
```

### 3. Hoisting với `let` và `const` — TDZ

`let` và `const` cũng được hoist nhưng **không được khởi tạo giá trị**. Vùng từ đầu block đến dòng khai báo gọi là **Temporal Dead Zone (TDZ)**:

```js
{
  // ← TDZ bắt đầu cho biến `b`
  // console.log(b); // ❌ ReferenceError: Cannot access 'b' before initialization
  let b = 10;     // ← TDZ kết thúc
  console.log(b); // ✅ 10
}
```

**Tại sao TDZ tồn tại?** Để bắt lỗi sớm — nếu bạn dùng biến trước khi khai báo, đó gần như chắc chắn là bug.

### 4. Function Expression KHÔNG được hoist đầy đủ

```js
// tangToc(); // ❌ TypeError: tangToc is not a function (var → undefined, gọi undefined() → lỗi)
var tangToc = function () {
  console.log("vroom");
};

// chaySau(); // ❌ ReferenceError (let → TDZ)
let chaySau = () => {
  console.log("zoom");
};
```

### 5. Class cũng có TDZ

```js
// const n = new Nguoi("An"); // ❌ ReferenceError
class Nguoi {
  constructor(ten) {
    this.ten = ten;
  }
}
const n = new Nguoi("An"); // ✅ OK
```

## Tại sao cần hiểu Hoisting (Why)

- **Debug**: giải thích tại sao biến `var` là `undefined` thay vì lỗi
- **Phỏng vấn**: câu hỏi classic về output của code
- **Tổ chức code**: hiểu hoisting giúp biết vì sao function declaration gọi trước được

## Best Practices

- ✅ **Khai báo biến ở đầu scope** — dù engine hoist, đọc code từ trên xuống rõ ràng hơn
- ✅ **Dùng `const`/`let`** — TDZ giúp phát hiện bug sớm
- ✅ **Dùng Function Declaration** khi muốn hàm có thể gọi ở bất kỳ đâu trong scope
- ✅ **Dùng Function Expression** khi muốn kiểm soát thứ tự chặt chẽ

## Pitfalls (Lỗi thường gặp)

### 1. Nghĩ code được "di chuyển" vật lý

```js
// ❌ Sai: hoisting KHÔNG di chuyển code lên trên
// ✅ Đúng: engine ĐĂNG KÝ khai báo trước, rồi mới chạy code theo thứ tự
```

### 2. TDZ trong tham số mặc định

```js
// ❌ Lỗi tinh vi
function test(a = b, b = 1) {
  return a + b;
}
// test() → ReferenceError: b chưa khởi tạo khi a dùng nó

// ✅ Fix: đảo thứ tự
function test(b = 1, a = b) {
  return a + b;
}
```

### 3. Hai function declaration cùng tên

```js
chao(); // "Chào lần 2" — hàm SAU ghi đè hàm TRƯỚC

function chao() { console.log("Chào lần 1"); }
function chao() { console.log("Chào lần 2"); }
```

## Ví dụ phỏng vấn kinh điển

```js
var x = 1;
function test() {
  console.log(x); // undefined (không phải 1!)
  var x = 2;      // var x được hoist trong function scope
  console.log(x); // 2
}
test();

// Engine thấy:
// function test() {
//   var x;          ← hoist
//   console.log(x); ← undefined
//   x = 2;
//   console.log(x); ← 2
// }
```
