# Toán tử chuỗi (String Operators)

## Khái niệm (What)

JavaScript có toán tử `+` để **nối chuỗi** (concatenation) và các toán tử so sánh hoạt động theo thứ tự **Unicode**.

## Cách dùng (Usage)

### Nối chuỗi với `+`

```js
"Xin " + "chào";     // "Xin chào"
"Tuổi: " + 20;       // "Tuổi: 20" — số bị ép thành chuỗi
"" + 42;              // "42" — shorthand chuyển số → chuỗi
```

### Template Literal (ES6) — Khuyên dùng

```js
const ten = "An";
const tuoi = 25;

// Nhúng biểu thức
const gioi_thieu = `Tôi là ${ten}, ${tuoi} tuổi`;

// Multiline — không cần \n
const html = `
  <div>
    <h1>${ten}</h1>
    <p>Tuổi: ${tuoi}</p>
  </div>
`;

// Biểu thức phức tạp
`Tổng: ${items.reduce((a, b) => a + b, 0)} VNĐ`;
```

### Tagged Template (nâng cao)

```js
function highlight(strings, ...values) {
  return strings.reduce((result, str, i) => {
    const val = values[i] !== undefined ? `<b>${values[i]}</b>` : "";
    return result + str + val;
  }, "");
}

const name = "An";
highlight`Chào ${name}!`; // "Chào <b>An</b>!"
```

### So sánh chuỗi — Unicode

```js
"a" < "b";     // true (so char code)
"abc" < "abd"; // true (so từng ký tự)
"B" < "a";     // true (⚠️ chữ hoa < chữ thường)

// So sánh chính xác theo locale
"ä".localeCompare("z", "de"); // -1 (tiếng Đức: ä đứng trước z)
```

### Phương thức String thường dùng

```js
"  hello  ".trim();           // "hello"
"hello".toUpperCase();        // "HELLO"
"HELLO".toLowerCase();        // "hello"
"a,b,c".split(",");           // ["a", "b", "c"]
"hello".includes("ell");      // true
"hello".startsWith("he");     // true
"hello".endsWith("lo");       // true
"hello".slice(1, 3);          // "el"
"abc".repeat(3);              // "abcabcabc"
"5".padStart(3, "0");         // "005"
"hello".replaceAll("l", "L"); // "heLLo" (ES2021)
"hello".at(-1);               // "o" (ES2022)
```

## Best Practices

- ✅ Dùng **template literal** thay nối chuỗi `+` — dễ đọc, hỗ trợ multiline
- ✅ Dùng **`localeCompare()`** cho sắp xếp chuỗi đa ngôn ngữ
- ✅ Dùng **`includes()`** thay `indexOf() !== -1`

## Pitfalls

- ❌ `"5" + 3` là `"53"` — toán tử `+` ưu tiên nối chuỗi khi có string
- ❌ So sánh `<` / `>` theo Unicode, KHÔNG theo ý nghĩa ngôn ngữ tự nhiên
- ❌ `"B" < "a"` là `true` — chữ hoa có code nhỏ hơn chữ thường
