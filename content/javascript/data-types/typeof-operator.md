# Toán tử `typeof`

## Khái niệm (What)

`typeof` là **toán tử một ngôi** (unary operator) trả về **chuỗi** mô tả kiểu "thô" của toán hạng. Đây là cách nhanh nhất để kiểm tra kiểu primitive.

## Bảng kết quả đầy đủ

| Biểu thức | Kết quả | Ghi chú |
|-----------|---------|---------|
| `typeof undefined` | `"undefined"` | |
| `typeof null` | `"object"` | ⚠️ **Bug lịch sử** — không bao giờ sửa |
| `typeof true` | `"boolean"` | |
| `typeof 42` | `"number"` | |
| `typeof 1n` | `"bigint"` | ES2020 |
| `typeof "hello"` | `"string"` | |
| `typeof Symbol()` | `"symbol"` | ES2015 |
| `typeof function(){}` | `"function"` | Technically object, nhưng typeof trả riêng |
| `typeof {}` | `"object"` | |
| `typeof []` | `"object"` | ⚠️ Array cũng trả "object" |
| `typeof NaN` | `"number"` | ⚠️ NaN thuộc kiểu number |

## Cách dùng (Usage)

```js
// Kiểm tra kiểu cơ bản
if (typeof x === "string") {
  console.log(x.toUpperCase());
}

// Kiểm tra biến có tồn tại (không throw ReferenceError)
if (typeof myVar !== "undefined") {
  // myVar đã được khai báo và có giá trị
}

// Type guard function
function isNumber(val) {
  return typeof val === "number" && !Number.isNaN(val);
}
```

## Giới hạn và cách khắc phục

### 1. `typeof null === "object"` → dùng `=== null`

```js
const x = null;
typeof x;     // "object" — sai!
x === null;   // true — đúng!
```

### 2. Phân biệt Array vs Object → dùng `Array.isArray()`

```js
const arr = [1, 2, 3];
typeof arr;         // "object" — không phân biệt được
Array.isArray(arr); // true ✅
```

### 3. Phân biệt chi tiết → dùng `Object.prototype.toString.call()`

```js
const getType = (val) => Object.prototype.toString.call(val).slice(8, -1);

getType(42);        // "Number"
getType("abc");     // "String"
getType(null);      // "Null" ✅
getType([]);        // "Array" ✅
getType({});        // "Object"
getType(new Date()); // "Date"
getType(/abc/);     // "RegExp"
```

## Khi nào dùng (When)

| Cần kiểm tra | Dùng |
|-------------|------|
| Primitive type (string, number, boolean, …) | `typeof x === "string"` |
| `null` | `x === null` |
| Array | `Array.isArray(x)` |
| Biến chưa khai báo | `typeof x !== "undefined"` |
| Kiểu chi tiết (Date, RegExp, …) | `Object.prototype.toString.call(x)` |
| Instance của class | `x instanceof MyClass` |

## Best Practices

- ✅ Dùng `typeof` cho primitive — nhanh và đủ
- ✅ Luôn dùng `===` với kết quả typeof (so sánh chuỗi)
- ✅ Kết hợp nhiều công cụ cho type checking toàn diện
- ✅ Xem xét TypeScript nếu cần type safety mạnh

## Pitfalls

- ❌ Dựa vào `typeof` để kiểm tra `null` — luôn trả `"object"`
- ❌ Dựa vào `typeof` để phân biệt array và object — cả hai trả `"object"`
- ❌ Quên rằng `typeof NaN === "number"` — NaN thuộc kiểu number
