# Quy tắc đặt tên biến trong JavaScript

## Khái niệm (What)

**Identifier** (định danh) là tên bạn đặt cho biến, hàm, class, tham số, … JavaScript có quy tắc cú pháp bắt buộc và quy ước (convention) được cộng đồng thống nhất.

## Quy tắc bắt buộc (Syntax Rules)

### Ký tự hợp lệ

- Tên biến có thể gồm: **chữ cái**, **chữ số**, `_` (underscore), `$` (dollar)
- **Bắt đầu** bằng chữ cái, `_`, hoặc `$` — **KHÔNG** được bắt đầu bằng chữ số
- Unicode được phép syntactically, nhưng thực tế **luôn dùng tiếng Anh**

```js
// ✅ Hợp lệ
let tenHopLe = 1;
let _private = 2;
let $jqueryStyle = 3;
let camelCase123 = 4;

// ❌ Không hợp lệ
// let 2sai = 5;       // SyntaxError — bắt đầu bằng số
// let ten-toi = 6;    // SyntaxError — dấu gạch ngang
// let my var = 7;     // SyntaxError — có khoảng trắng
```

### Từ khóa và từ dành riêng

Không dùng từ khóa JavaScript làm tên biến:

```js
// ❌ Không được dùng
// let if = 1;
// let function = 2;
// let class = 3;
// let return = 4;
// let const = 5;
```

Danh sách từ khóa: `break`, `case`, `catch`, `class`, `const`, `continue`, `debugger`, `default`, `delete`, `do`, `else`, `export`, `extends`, `finally`, `for`, `function`, `if`, `import`, `in`, `instanceof`, `let`, `new`, `return`, `static`, `super`, `switch`, `this`, `throw`, `try`, `typeof`, `var`, `void`, `while`, `with`, `yield`

### Phân biệt hoa thường (Case-sensitive)

```js
let myVar = 1;
let myvar = 2;
let MYVAR = 3;
// Ba biến hoàn toàn khác nhau!
```

## Quy ước đặt tên (Naming Conventions)

| Quy ước | Dùng cho | Ví dụ |
|---------|---------|-------|
| **camelCase** | Biến, hàm, tham số | `soLuong`, `layNguoiDung()`, `isActive` |
| **PascalCase** | Class, Constructor, Component | `NguoiDung`, `HttpClient`, `UserProfile` |
| **UPPER_SNAKE_CASE** | Hằng cấu hình, giá trị cố định | `API_BASE_URL`, `MAX_RETRY`, `PI` |
| **_prefix** | Biến "private" theo quy ước (trước khi có `#`) | `_internalState` |

```js
// Ví dụ đầy đủ
const MAX_RETRY = 3;                    // hằng cấu hình
let soLanThu = 0;                       // biến thay đổi
const layDuLieu = async (url) => {};    // hàm
class QuanLyNguoiDung {}               // class

// Boolean nên bắt đầu bằng is/has/can/should
let isLoading = false;
let hasPermission = true;
let canEdit = user.role === "admin";
```

## Best Practices

- ✅ **Tên mô tả mục đích**: `soLuongSanPham` thay vì `n` hoặc `sl`
- ✅ **Ngắn gọn nhưng rõ nghĩa**: `getUserById` thay vì `functionToGetTheUserFromDatabaseById`
- ✅ **Nhất quán**: một dự án chọn một style, không trộn (ví dụ không lúc `get_user` lúc `getUser`)
- ✅ **Viết tắt phổ biến OK**: `req`, `res`, `err`, `ctx`, `i` (trong loop ngắn)
- ✅ **Tên hàm = hành động**: `tinhTong()`, `sendEmail()`, `validateInput()`
- ✅ **Tên biến = danh từ**: `nguoiDung`, `danhSachSanPham`, `totalPrice`

## Pitfalls (Lỗi thường gặp)

### 1. Tên quá ngắn hoặc vô nghĩa

```js
// ❌ Không rõ nghĩa
let a = users.filter(u => u.age > 18);
let tmp = calculatePrice(items);

// ✅ Rõ ràng
let nguoiDungTruongThanh = users.filter(u => u.age > 18);
let tongGia = calculatePrice(items);
```

### 2. Dùng viết tắt tự chế

```js
// ❌ Khó hiểu
let usrMgr = new UserManager();
let btnClkHndlr = () => {};

// ✅ Dễ hiểu
let userManager = new UserManager();
let handleButtonClick = () => {};
```

### 3. Boolean không rõ ý

```js
// ❌ Không rõ true/false nghĩa gì
let flag = true;
let status = false;

// ✅ Rõ ràng
let isVisible = true;
let hasError = false;
```

## So sánh Convention giữa các hệ sinh thái

| Ngôn ngữ / Framework | Biến/Hàm | Class | Hằng |
|----------------------|----------|-------|------|
| JavaScript (chung) | camelCase | PascalCase | UPPER_SNAKE |
| React Component | camelCase | PascalCase | UPPER_SNAKE |
| Python | snake_case | PascalCase | UPPER_SNAKE |
| Java / C# | camelCase | PascalCase | UPPER_SNAKE |
