# Toán tử so sánh (Comparison Operators)

## Khái niệm (What)

Toán tử so sánh so sánh hai giá trị và trả về **Boolean** (`true`/`false`). JavaScript có toán tử so sánh **giá trị** (`>`, `<`, …) và toán tử so sánh **bằng** (`==`, `===`, …).

## Bảng toán tử

| Toán tử | Tên | Ví dụ | Kết quả |
|---------|-----|-------|---------|
| `>` | Lớn hơn | `5 > 3` | `true` |
| `<` | Nhỏ hơn | `5 < 3` | `false` |
| `>=` | Lớn hơn hoặc bằng | `5 >= 5` | `true` |
| `<=` | Nhỏ hơn hoặc bằng | `5 <= 4` | `false` |
| `==` | Bằng lỏng (có ép kiểu) | `1 == "1"` | `true` ⚠️ |
| `!=` | Khác lỏng | `1 != "1"` | `false` ⚠️ |
| `===` | Bằng chặt (không ép kiểu) | `1 === "1"` | `false` ✅ |
| `!==` | Khác chặt | `1 !== "1"` | `true` ✅ |

## Cách dùng (Usage)

### So sánh số

```js
10 > 5;   // true
10 >= 10; // true
3 < 3;    // false
3 <= 3;   // true
```

### So sánh chuỗi — theo Unicode (lexicographic)

```js
"a" < "b";     // true  (97 < 98)
"B" < "a";     // true  (66 < 97 — chữ hoa trước chữ thường!)
"abc" < "abd"; // true  (so từng ký tự, 'c' < 'd')
"10" < "9";    // true  (⚠️ so chuỗi "1" < "9", KHÔNG phải so số)
```

### So sánh kiểu hỗn hợp — cẩn thận

```js
"10" > 9;         // true   — chuỗi "10" bị ép thành số 10
null > 0;         // false
null == 0;        // false
null >= 0;        // true ⚠️ — hành vi kỳ lạ!
undefined == null; // true
undefined > 0;    // false
undefined < 0;    // false
```

### `==` vs `===`

```js
// == ép kiểu → dễ gây bug
0 == false;       // true
"" == false;      // true
null == undefined; // true

// === không ép kiểu → an toàn
0 === false;       // false
"" === false;      // false
null === undefined; // false
```

## Best Practices

- ✅ **Luôn dùng `===` và `!==`** — loại bỏ ép kiểu ngầm
- ✅ So sánh chuỗi dùng **`localeCompare()`** cho đa ngôn ngữ
- ✅ So sánh số: **ép kiểu rõ ràng** trước khi so sánh

```js
// So sánh chuỗi đa ngôn ngữ
"ä".localeCompare("z", "de"); // -1 (tiếng Đức: ä < z)
```

## Pitfalls

- ❌ `"10" < "9"` là `true` — so chuỗi theo Unicode, không phải số
- ❌ `null >= 0` là `true` nhưng `null == 0` là `false` — hai thuật toán khác nhau
- ❌ `NaN` không bằng bất cứ gì, kể cả chính nó: `NaN === NaN` → `false`
