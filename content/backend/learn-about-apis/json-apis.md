# JSON APIs và Chuẩn Mực Dữ Liệu Tự Do

> **Mục tiêu:** Khi sử dụng RESTful, bạn có thể trả về XML, Text, nhị phân. Nhưng JSON (JavaScript Object Notation) đã thống trị tuyệt đối nhờ sự nhẹ nhàng và native array. Tuy nhiên "JSON bừa bãi" dễ sinh nợ kĩ thuật. Tìm hiểu tại sao cấu trúc JSON:API chuẩn mực lại cần thiết cho BigTech.

## Bệnh Cứng Đầu: JSON Cục Bộ
Lúc mới code Backend:
```json
{
  "code": 200,
  "message": "OK",
  "name": "Tom",
  "age": 20
}
```
Khi qua tay một ông Dev khác trong cùng công ty, ông kia rãnh tay thiết kế API trả về:
```json
{
  "status_code": "success",
  "data": { "ten": "Tom", "tuoi": 20 }
}
```
Nhắm mắt tưởng tượng Frontend gào thét cắn xé như thế nào với 10 API 10 Format khác nhau. Để hệ thống trơn tru tự động hoá, chúng ta có một quy ước vàng **JSON:API (chuẩn JSON:API spec)**.

## Chuẩn mực JSON:API (Application/vnd.api+json)
Được sinh ra để triệt tiêu mấy mớ tranh cãi format ở phía trên.
Đặc trưng:
* **Tài nguyên là chính:** Phân bóc data ra một cấp `data`.
* **Mối quan hệ:** Liên kết `relationships` riêng rẻ, tránh bóc data đè nhau.
* **Xử lý Error siêu tiêu chuẩn hóa:** Không còn cái kiểu `code: 600, error: thieu text`.

```json
{
  "data": [{
    "type": "articles",
    "id": "1",
    "attributes": {
      "title": "Backend Engineering"
    },
    "relationships": {
      "author": {
        "data": { "type": "people", "id": "9" }
      }
    }
  }]
}
```
Sạch sẽ, quy củ và Frontend có thể tái chế thư viện parse API duy nhất cho n dự án.
