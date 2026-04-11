# Primitive Types (Kiểu dữ liệu nguyên thủy)

## Khái niệm (What)

JavaScript có **7 kiểu dữ liệu nguyên thủy** (primitive). Chúng là giá trị **bất biến** (immutable) và được lưu trữ **theo giá trị** (by value) — khi gán hoặc truyền vào hàm, một bản sao độc lập được tạo ra.

## 7 Kiểu Primitive

| # | Kiểu | Ví dụ | `typeof` trả về |
|---|------|-------|----------------|
| 1 | **String** | `"hello"`, `'hi'`, `` `chào` `` | `"string"` |
| 2 | **Number** | `42`, `3.14`, `NaN`, `Infinity` | `"number"` |
| 3 | **BigInt** | `9007199254740991n` | `"bigint"` |
| 4 | **Boolean** | `true`, `false` | `"boolean"` |
| 5 | **undefined** | `undefined` | `"undefined"` |
| 6 | **null** | `null` | `"object"` ⚠️ |
| 7 | **Symbol** | `Symbol("id")` | `"symbol"` |

## Chi tiết từng kiểu

### 1. String (Chuỗi)

```js
// 3 cách tạo string
let s1 = 'Dấu nháy đơn';
let s2 = "Dấu nháy kép";
let s3 = `Template literal — ES6: ${1 + 1}`; // nhúng biểu thức

// String là immutable — không thay đổi được ký tự tại chỗ
let str = "hello";
str[0] = "H";  // im lặng thất bại
console.log(str); // vẫn "hello"

// Phương thức trả về string MỚI
console.log(str.toUpperCase()); // "HELLO" — str gốc không đổi

// Các method thường dùng
"  hello  ".trim();          // "hello"
"a,b,c".split(",");          // ["a", "b", "c"]
"hello".includes("ell");     // true
"hello".slice(1, 3);         // "el"
"hello".replace("ell", "ELL"); // "hELLo"
"5".padStart(3, "0");        // "005"
```

### 2. Number (Số)

JavaScript chỉ có **một kiểu số**: IEEE 754 64-bit floating point.

```js
let soNguyen = 42;
let soThapPhan = 3.14;
let soLon = 1_000_000; // dấu _ giúp đọc dễ hơn (ES2021)

// Giá trị đặc biệt
console.log(Infinity);              // Infinity
console.log(NaN);                   // Not a Number
console.log(typeof NaN);            // "number" (!)

// Giới hạn số an toàn
console.log(Number.MAX_SAFE_INTEGER); // 9007199254740991 (2^53 - 1)

// ⚠️ Vấn đề làm tròn nổi tiếng
console.log(0.1 + 0.2);             // 0.30000000000000004
console.log(0.1 + 0.2 === 0.3);     // false!

// Giải pháp: so sánh với epsilon
console.log(Math.abs(0.1 + 0.2 - 0.3) < Number.EPSILON); // true

// Kiểm tra
Number.isNaN(NaN);      // true (chính xác hơn isNaN toàn cục)
Number.isFinite(42);    // true
Number.isInteger(3.0);  // true
```

### 3. BigInt (Số nguyên lớn — ES2020)

```js
let soRatLon = 9007199254740991n; // thêm "n" vào cuối
let bigint2 = BigInt("12345678901234567890");

// ⚠️ Không trộn BigInt với Number
// 1n + 1;         // TypeError!
Number(1n) + 1;    // 2 — ép kiểu rõ ràng

// Chia BigInt = chia nguyên
10n / 3n; // 3n — không có phần thập phân
```

### 4. Boolean (Logic)

```js
let daDangNhap = true;
let daXacNhan = false;

// Các giá trị FALSY — tự động thành false khi ép boolean
Boolean(false);     // false
Boolean(0);         // false
Boolean("");        // false
Boolean(null);      // false
Boolean(undefined); // false
Boolean(NaN);       // false

// TRUTHY — tất cả còn lại
Boolean("0");       // true ⚠️ chuỗi "0" KHÁC số 0
Boolean([]);        // true ⚠️ mảng rỗng là truthy
Boolean({});        // true ⚠️ object rỗng là truthy
```

### 5. undefined

Biến đã khai báo nhưng **chưa gán giá trị**, hoặc hàm **không return** gì.

```js
let x;
console.log(x);        // undefined
console.log(typeof x); // "undefined"

function khongTraVe() {}
console.log(khongTraVe()); // undefined

const obj = {};
console.log(obj.thuocTinhKhongCo); // undefined
```

### 6. null

Giá trị "rỗng" hoặc "không tồn tại" **có chủ đích** — do lập trình viên gán.

```js
let nguoiDung = null; // chủ đích: "chưa có người dùng"

// ⚠️ Bug lịch sử nổi tiếng
console.log(typeof null); // "object" — đây là bug từ JS đầu tiên, không bao giờ sửa

// Kiểm tra null đúng cách
console.log(nguoiDung === null); // true

// null vs undefined
null == undefined;  // true  (loose equality)
null === undefined; // false (strict equality)
```

### 7. Symbol (Định danh duy nhất — ES6)

```js
const id1 = Symbol("id");
const id2 = Symbol("id");
console.log(id1 === id2); // false — mỗi Symbol là DUY NHẤT

// Dùng làm key không xung đột
const KEY = Symbol("userId");
const user = {
  ten: "An",
  [KEY]: 42,
};
console.log(user[KEY]);        // 42
console.log(Object.keys(user)); // ["ten"] — Symbol key không xuất hiện

// Symbol.for — Symbol toàn cục (shared giữa modules)
const s1 = Symbol.for("shared");
const s2 = Symbol.for("shared");
console.log(s1 === s2); // true
```

## Cách hoạt động: By Value (How)

```js
let a = 10;
let b = a;  // b nhận BẢN SAO của giá trị
b = 20;
console.log(a); // 10 — a không bị ảnh hưởng

// So sánh với reference type (object):
let obj1 = { x: 1 };
let obj2 = obj1;  // obj2 trỏ CÙNG object
obj2.x = 99;
console.log(obj1.x); // 99 — bị ảnh hưởng!
```

## Auto-boxing: Tại sao primitive có method?

```js
"hello".toUpperCase(); // "HELLO" — tại sao string có method?
```

Khi gọi method trên primitive, engine **tạm tạo object wrapper** (`new String("hello")`), gọi method, rồi bỏ wrapper. Quá trình này gọi là **auto-boxing**.

## Best Practices

- ✅ Dùng `===` thay `==` khi so sánh — tránh ép kiểu ngầm
- ✅ Dùng `null` cho "giá trị chủ đích rỗng", để `undefined` nghĩa là "chưa gán"
- ✅ Kiểm tra `NaN` bằng `Number.isNaN()`, không dùng `=== NaN`
- ✅ Dùng `BigInt` khi cần số vượt `2^53 - 1`

## Pitfalls

- ❌ `typeof null === "object"` — bug lịch sử, phải kiểm tra `x === null`
- ❌ `NaN === NaN` trả `false` — dùng `Number.isNaN(x)`
- ❌ `0.1 + 0.2 !== 0.3` — lỗi floating point, cần epsilon hoặc làm tròn
- ❌ `typeof NaN === "number"` — NaN thuộc kiểu number, chỉ là giá trị "không hợp lệ"
- ❌ `Boolean([]) === true` — mảng rỗng là truthy, khác nhiều ngôn ngữ khác
