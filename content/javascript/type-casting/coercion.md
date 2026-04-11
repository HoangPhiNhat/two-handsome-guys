# Ép kiểu chi tiết (Type Casting / Coercion)

## Khái niệm (What)

Bài này đi sâu vào **cơ chế** JavaScript dùng để ép kiểu, bao gồm quy tắc **ToPrimitive**, **ToNumber**, **ToString**, và **ToBoolean** — những abstract operation mà engine thực hiện bên trong.

> Xem bài [Chuyển kiểu vs Ép kiểu](conversion-vs-coercion.md) để phân biệt tường minh / ngầm định ở mức tổng quan.

## Cách hoạt động (How) — Abstract Operations

### 1. ToBoolean — Quy tắc Falsy/Truthy

**8 giá trị FALSY** (tất cả còn lại là truthy):

| Giá trị | Kiểu |
|---------|------|
| `false` | Boolean |
| `0` | Number |
| `-0` | Number |
| `0n` | BigInt |
| `""` | String (rỗng) |
| `null` | null |
| `undefined` | undefined |
| `NaN` | Number |

```js
// ⚠️ Truthy bất ngờ
Boolean("0");        // true — chuỗi "0" KHÔNG rỗng
Boolean("false");    // true — chuỗi "false" KHÔNG rỗng
Boolean([]);         // true — mảng rỗng là object
Boolean({});         // true — object rỗng
Boolean(-1);         // true — số khác 0
Boolean(Infinity);   // true
```

### 2. ToNumber — Chuyển sang Number

| Input | Kết quả | Ghi chú |
|-------|---------|---------|
| `undefined` | `NaN` | |
| `null` | `0` | ⚠️ Khác undefined |
| `true` | `1` | |
| `false` | `0` | |
| `""` | `0` | ⚠️ Chuỗi rỗng → 0 |
| `"  "` | `0` | ⚠️ Whitespace only → 0 |
| `"42"` | `42` | |
| `"42px"` | `NaN` | Number() khác parseInt() |
| `[]` | `0` | [].toString()="" → 0 |
| `[1]` | `1` | [1].toString()="1" → 1 |
| `[1,2]` | `NaN` | "1,2" → NaN |

### 3. ToString — Chuyển sang String

```js
String(42);        // "42"
String(true);      // "true"
String(null);      // "null"
String(undefined); // "undefined"
String([1, 2]);    // "1,2"
String({});        // "[object Object]"
String(Symbol());  // "Symbol()" — nhưng ép ngầm sẽ TypeError!
```

### 4. ToPrimitive — Object → Primitive

Khi engine cần chuyển object thành primitive, nó gọi:
1. `[Symbol.toPrimitive](hint)` nếu có
2. Hoặc `valueOf()` rồi `toString()` (hint "number")
3. Hoặc `toString()` rồi `valueOf()` (hint "string")

```js
// Tùy chỉnh ép kiểu với Symbol.toPrimitive
class TienTe {
  constructor(so, donVi) {
    this.so = so;
    this.donVi = donVi;
  }
  [Symbol.toPrimitive](hint) {
    if (hint === "number") return this.so;
    if (hint === "string") return `${this.so} ${this.donVi}`;
    return this.so; // "default"
  }
}

const tien = new TienTe(100, "VNĐ");
console.log(+tien);       // 100     (hint: "number")
console.log(`${tien}`);   // "100 VNĐ" (hint: "string")
console.log(tien + 50);   // 150     (hint: "default")
```

## Ép kiểu tường minh — Tổng hợp

```js
// → String
String(123);            // "123"
(123).toString();       // "123"
(255).toString(16);     // "ff"
`${123}`;               // "123" — template literal

// → Number
Number("123");          // 123
parseInt("10px", 10);   // 10 — dừng ở ký tự không phải số, LUÔN truyền radix
parseFloat("3.14abc");  // 3.14
+"42";                  // 42 — unary plus
~~3.7;                  // 3 — double NOT bitwise (trunc, nâng cao)

// → Boolean
Boolean(1);             // true
!!1;                    // true — double NOT shorthand
```

## Ép kiểu ngầm — Trường hợp nguy hiểm

```js
// Case 1: + ưu tiên nối chuỗi
"5" + 3;              // "53" — không phải 8!
3 + "5";              // "35"

// Case 2: Template literal luôn gọi ToString
`Giá trị: ${null}`;   // "Giá trị: null"

// Case 3: if/while/ternary luôn gọi ToBoolean
if ("") { /* không chạy */ }
if ("0") { /* CHẠY! */ }

// Case 4: So sánh lạ
[] == ![];    // true 😱
// Giải thích: ![] = false → [] == false → "" == false → 0 == 0 → true

[] + [];     // "" — cả hai toString → "" + ""
{} + [];     // 0 hoặc "[object Object]" tùy context
```

## Best Practices

- ✅ **Ép kiểu rõ ràng** khi xử lý input: `Number(input.value)`
- ✅ Dùng **`Number.isNaN()`** thay `isNaN()` — chặt hơn
- ✅ Dùng **`===`** — không ép kiểu khi so sánh
- ✅ Validate input **trước** khi chuyển kiểu

## Pitfalls

- ❌ `Number("")` → `0` (không phải NaN) — cần validate chuỗi rỗng riêng
- ❌ `parseInt("08")` — có thể bị hiểu là bát phân ở engine cũ
- ❌ `+"" === 0` — chuỗi rỗng thành 0, không phải NaN
- ❌ Implicit coercion trong `==` cực kỳ khó nhớ — **luôn dùng `===`**
