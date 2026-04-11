# Object trong JavaScript

## Khái niệm (What)

**Object** là kiểu dữ liệu **tham chiếu** (reference type) trong JavaScript, cho phép lưu trữ tập hợp các cặp **key-value**. Object là nền tảng của gần như mọi thứ trong JS — array, function, Date, RegExp đều là object.

## Cách hoạt động (How)

Object được lưu trên **heap** (vùng nhớ động). Biến chỉ giữ **tham chiếu** (địa chỉ) đến object, không phải bản thân giá trị.

```js
// Gán object = sao chép tham chiếu (KHÔNG sao chép dữ liệu)
const a = { x: 1 };
const b = a;       // b trỏ CÙNG object với a
b.x = 99;
console.log(a.x);  // 99 — a bị ảnh hưởng!
```

## Cách dùng (Usage)

### 1. Khai báo Object

```js
// Object literal (phổ biến nhất)
const sinhVien = {
  ten: "Minh",
  tuoi: 21,
  diaChi: {
    tinh: "Hà Nội",
    quan: "Cầu Giấy",
  },
  chao() {
    return `Tôi là ${this.ten}`;
  },
};

// Object constructor (ít dùng)
const obj = new Object();

// Object.create (tạo với prototype chỉ định)
const base = { loai: "sinh vien" };
const sv = Object.create(base);
```

### 2. Truy cập thuộc tính

```js
// Dot notation — khi key là identifier hợp lệ
console.log(sinhVien.ten);          // "Minh"
console.log(sinhVien.diaChi.tinh);  // "Hà Nội"

// Bracket notation — khi key là biến, chuỗi đặc biệt, hoặc Symbol
const field = "tuoi";
console.log(sinhVien[field]);       // 21
console.log(sinhVien["ten"]);       // "Minh"
```

### 3. Thêm / Sửa / Xóa

```js
sinhVien.email = "minh@gmail.com"; // thêm
sinhVien.tuoi = 22;                // sửa
delete sinhVien.email;             // xóa

// Kiểm tra thuộc tính tồn tại
console.log("ten" in sinhVien);                // true
console.log(sinhVien.hasOwnProperty("diaChi")); // true
```

### 4. Duyệt thuộc tính

```js
// Object.keys / values / entries
Object.keys(sinhVien);    // ["ten", "tuoi", "diaChi", "chao"]
Object.values(sinhVien);  // ["Minh", 22, {...}, ƒ]
Object.entries(sinhVien); // [["ten","Minh"], ["tuoi",22], ...]

// for...in (duyệt cả prototype enumerable — cẩn thận)
for (const key in sinhVien) {
  if (sinhVien.hasOwnProperty(key)) {
    console.log(`${key}: ${sinhVien[key]}`);
  }
}
```

### 5. Sao chép Object

```js
// Shallow copy (bản sao nông)
const copy1 = Object.assign({}, sinhVien);
const copy2 = { ...sinhVien }; // spread — phổ biến hơn

// Deep copy (bản sao sâu)
const deep1 = JSON.parse(JSON.stringify(sinhVien)); // cách cũ (mất function, Date, ...)
const deep2 = structuredClone(sinhVien);            // ES2022 — cách hiện đại
```

### 6. Đóng băng / Phong tỏa

```js
// Object.freeze — KHÔNG thể thêm/sửa/xóa (shallow)
const config = Object.freeze({ host: "localhost", port: 3000 });
config.port = 8080; // im lặng thất bại (strict mode → TypeError)

// Object.seal — cho sửa giá trị, KHÔNG cho thêm/xóa
const user = Object.seal({ ten: "An" });
user.ten = "Binh"; // ✅ OK
user.email = "x";  // ❌ im lặng thất bại
```

### 7. Shorthand và Computed Property (ES6+)

```js
const ten = "An";
const tuoi = 25;

// Property shorthand
const nguoi = { ten, tuoi }; // { ten: "An", tuoi: 25 }

// Computed property name
const field = "email";
const obj = {
  [field]: "an@gmail.com",        // key động
  [`${field}Backup`]: "backup@",  // key từ biểu thức
};
```

## Khi nào dùng (When)

- **Mọi lúc** — Object là cấu trúc dữ liệu phổ biến nhất trong JS
- **Gom nhóm dữ liệu liên quan**: user info, config, API response
- **Truyền nhiều tham số**: thay vì `f(a, b, c, d)` → `f({ a, b, c, d })`

## Best Practices

- ✅ Dùng **object literal** `{}` thay vì `new Object()`
- ✅ Dùng **spread** `{...obj}` để clone shallow
- ✅ Dùng **`structuredClone()`** cho deep clone (ES2022+)
- ✅ Dùng **`Object.freeze()`** cho config không đổi
- ✅ Dùng **optional chaining** `obj?.a?.b` thay chuỗi `&&`
- ✅ Dùng **destructuring** khi lấy nhiều property: `const { ten, tuoi } = user;`

## Pitfalls

- ❌ **Nhầm shallow copy là deep copy**: `{...obj}` chỉ copy 1 cấp, object lồng nhau vẫn share reference
- ❌ **Dùng `==` so sánh object**: luôn trả `false` (so tham chiếu, không so nội dung)
- ❌ **`Object.freeze()` là shallow**: object con bên trong vẫn có thể thay đổi
- ❌ **`delete` không ảnh hưởng prototype**: chỉ xóa own property

```js
const a = { x: 1 };
const b = { x: 1 };
console.log(a === b); // false — hai object khác nhau dù cùng nội dung
console.log(a === a); // true  — cùng tham chiếu
```
