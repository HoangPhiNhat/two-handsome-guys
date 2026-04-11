# Chuyển kiểu (Type Conversion) vs Ép kiểu (Type Coercion)

## Khái niệm (What)

JavaScript là ngôn ngữ **kiểu động** — biến không gắn kiểu cố định. Khi cần thao tác giữa các kiểu khác nhau, có hai cơ chế:

- **Chuyển kiểu tường minh (Explicit Conversion)**: lập trình viên **chủ động** gọi hàm/toán tử để đổi kiểu
- **Ép kiểu ngầm (Implicit Coercion)**: JavaScript engine **tự** đổi kiểu khi thực hiện phép toán hoặc so sánh

## Cách hoạt động (How)

### Tường minh: Bạn kiểm soát

```js
// → String
String(123);                // "123"
String(true);               // "true"
String(null);               // "null"
String(undefined);          // "undefined"
(255).toString(16);         // "ff" — chuyển sang hex

// → Number
Number("42");               // 42
Number("");                 // 0
Number("  ");               // 0
Number(true);               // 1
Number(false);              // 0
Number(null);               // 0
Number(undefined);          // NaN ⚠️
Number("abc");              // NaN
parseInt("42px", 10);       // 42 — dừng ở ký tự không phải số
parseFloat("3.14abc");      // 3.14
+"42";                      // 42 — unary plus (shorthand)

// → Boolean
Boolean(1);                 // true
Boolean(0);                 // false
Boolean("hello");           // true
Boolean("");                // false
!!value;                    // shorthand cho Boolean(value)
```

### Ngầm: Engine kiểm soát

```js
// + với chuỗi → NỐI CHUỖI (string concatenation)
"5" + 3;        // "53" ⚠️ — số bị ép thành chuỗi
"5" + true;     // "5true"
"5" + null;     // "5null"

// -, *, / → CHUYỂN VỀ NUMBER
"5" - 3;        // 2
"5" * "2";      // 10
"6" / "2";      // 3
"5" - true;     // 4 (true → 1)
"5" - null;     // 5 (null → 0)
"5" - undefined; // NaN (undefined → NaN)

// So sánh == (loose) → ép kiểu
0 == false;     // true ⚠️
"" == false;    // true ⚠️
null == undefined; // true
"1" == 1;       // true
```

## Bảng ép kiểu ngầm với `+`

| Biểu thức | Kết quả | Giải thích |
|-----------|---------|-----------|
| `"5" + 3` | `"53"` | Có chuỗi → nối chuỗi |
| `5 + 3` | `8` | Cả hai Number → cộng |
| `5 + null` | `5` | null → 0 |
| `5 + undefined` | `NaN` | undefined → NaN |
| `5 + true` | `6` | true → 1 |
| `"" + 42` | `"42"` | Chuỗi rỗng + số → nối |

## So sánh `==` vs `===`

| Toán tử | Ép kiểu? | Khuyên dùng |
|---------|---------|-------------|
| `==` / `!=` | ✅ Có (theo Abstract Equality) | ❌ Tránh |
| `===` / `!==` | ❌ Không | ✅ **Luôn dùng** |

```js
// Với === — an toàn, dự đoán được
1 === "1";        // false
0 === false;      // false
null === undefined; // false

// Với == — bất ngờ
0 == "";          // true ⚠️
false == "";      // true ⚠️
null == 0;        // false (!!)
[] == ![];        // true (!!!) — cực kỳ bất ngờ
```

## Khi nào cần chuyển kiểu (When)

- **Dữ liệu từ form/input** — luôn là string, cần chuyển sang number
- **API response string** — `"true"` cần chuyển sang boolean
- **Template rendering** — số/boolean cần chuyển sang string

```js
// Form input luôn trả string
const inputAge = document.querySelector("#age").value; // "25"
const age = Number(inputAge); // 25

// Query parameter
const page = parseInt(new URLSearchParams(location.search).get("page"), 10) || 1;
```

## Best Practices

- ✅ **Luôn dùng `===`** cho so sánh — tránh ép kiểu ngầm
- ✅ **Ép kiểu rõ ràng** khi cần: `Number(x)`, `String(x)`, `Boolean(x)`
- ✅ Kiểm tra `NaN` sau khi chuyển: `Number.isNaN(result)`
- ✅ Dùng `parseInt(str, 10)` — luôn truyền **radix**

## Pitfalls

- ❌ `Number("")` và `Number(" ")` trả `0` — không phải `NaN`
- ❌ `Number(null)` trả `0` nhưng `Number(undefined)` trả `NaN` — không nhất quán
- ❌ `"5" + 3` là `"53"` nhưng `"5" - 3` là `2` — toán tử `+` ưu tiên nối chuỗi
- ❌ `Boolean([])` là `true` nhưng `[] == false` là `true` — hai cơ chế khác nhau

```js
// Bẫy kinh điển
if ([]) console.log("truthy!");     // ✅ chạy — [] là truthy
if ([] == false) console.log("?!"); // ✅ chạy — [] bị ép thành "" → 0 → bằng false
// Hai dòng trên đều đúng — đó là sự kỳ lạ của JS
```
