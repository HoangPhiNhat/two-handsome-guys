# Abstract Equality Algorithm

## Khái niệm (What)

Đây là thuật toán chính thức mà JavaScript engine thực hiện khi dùng `==`. Hiểu thuật toán giúp **dự đoán** kết quả so sánh lỏng.

## Thuật toán (How)

Khi so sánh `x == y`:

1. **Cùng kiểu** → so sánh như `===`
2. **`null == undefined`** → `true` (và ngược lại)
3. **Number == String** → chuyển String thành Number
4. **Boolean == bất kỳ** → chuyển Boolean thành Number (true→1, false→0), so lại
5. **Object == Primitive** → gọi `ToPrimitive(object)`, so lại
6. **BigInt == String** → chuyển String thành BigInt
7. Còn lại → `false`

## Ví dụ Apply thuật toán

```js
// [] == false
// Bước 4: false → 0  →  [] == 0
// Bước 5: ToPrimitive([]) = ""  →  "" == 0
// Bước 3: Number("") = 0  →  0 == 0
// → true ✅

// [] == ![]
// ![] = false ([] là truthy, đảo = false)
// → [] == false → (theo trên) → true ✅ 😱
```

## Khi nào cần hiểu (When)

- **Phỏng vấn**: câu hỏi kinh điển
- **Debug**: giải thích behavior lạ với `==`
- **Quyết định**: có nên dùng `==` không (hầu hết: KHÔNG)

## Best Practices

- ✅ Hiểu thuật toán ở mức **tham khảo** — không cần thuộc lòng
- ✅ **Dùng `===`** để tránh hoàn toàn sự phức tạp này
