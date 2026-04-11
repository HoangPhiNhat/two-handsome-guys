# JSON (JavaScript Object Notation)

## Khái niệm (What)

JSON là **format trao đổi dữ liệu** dạng text, dễ đọc cho người và dễ parse cho máy. Dù tên có "JavaScript", JSON là format **ngôn ngữ-trung lập** — hầu hết ngôn ngữ đều hỗ trợ.

## Cách dùng (Usage)

### Cú pháp JSON

```json
{
  "ten": "An",
  "tuoi": 25,
  "active": true,
  "diaChi": null,
  "soCuoi": [1, 2, 3],
  "hoSo": { "email": "an@mail.com" }
}
```

**Quy tắc:** Key phải là string (dấu `"`), không có `undefined`, function, Symbol, trailing comma, comment.

### `JSON.stringify()` — Object → JSON string

```js
const data = { ten: "An", tuoi: 25 };
JSON.stringify(data);                 // '{"ten":"An","tuoi":25}'
JSON.stringify(data, null, 2);        // pretty print (2 spaces)
JSON.stringify(data, ["ten"]);        // '{"ten":"An"}' — chọn field

// Replacer function
JSON.stringify(data, (key, val) => {
  if (typeof val === "number") return undefined; // loại bỏ number
  return val;
});
// '{"ten":"An"}'
```

### `JSON.parse()` — JSON string → Object

```js
const str = '{"ten":"An","tuoi":25}';
const obj = JSON.parse(str);
console.log(obj.ten); // "An"

// Reviver — transform khi parse
JSON.parse(str, (key, val) => {
  if (key === "tuoi") return val + 1;
  return val;
});
// { ten: "An", tuoi: 26 }
```

### Deep Clone (cách cũ — có giới hạn)

```js
const original = { a: 1, nested: { b: 2 } };
const clone = JSON.parse(JSON.stringify(original));
clone.nested.b = 99;
console.log(original.nested.b); // 2 — không bị ảnh hưởng

// ⚠️ Giới hạn: mất undefined, function, Symbol, Date → string, circular reference → lỗi
// ✅ Dùng structuredClone() (ES2022) thay thế
```

## Best Practices

- ✅ Dùng `JSON.stringify(obj, null, 2)` để debug
- ✅ **Validate** JSON trước khi parse — bọc `try/catch`
- ✅ Dùng **`structuredClone()`** thay JSON clone cho deep copy
- ✅ Dùng **`JSON.parse(JSON.stringify())`** chỉ cho data thuần (không function/Date)

## Pitfalls

- ❌ `JSON.stringify` bỏ qua `undefined`, `function`, `Symbol`
- ❌ `Date` → string khi stringify, không tự chuyển lại khi parse
- ❌ Circular reference → throws `TypeError`
- ❌ `BigInt` → throws `TypeError` — cần custom serializer
