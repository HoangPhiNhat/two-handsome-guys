# OpenAPI Specs (Swagger): Nghệ Thuật Viết "Sách Hướng Dẫn"

> **Mục tiêu:** Backend viết Code xong, quăng cho Frontend hoặc bên thứ 3 và quát là "Tự mò mà gọi API đi". Đó là một tai nạn kĩ thuật thảm khốc. Ở BigTech, API Contract Management là yếu tố không thể thiếu. OpenAPI Spec là vị cứu tinh của toàn ngành.

## "Bố" của Tự Động Hóa (Automation Father)
OpenAPI (Tiền thân là Swagger) không phải là cái API (REST, gRPC), nó là cái **Quy chuẩn Mô tả**. Động tác của bạn: Viết quy chuẩn bằng Text (YAML / JSON).

```yaml
openapi: 3.0.0
info:
  title: Users Service API
paths:
  /users:
    get:
      summary: Lấy DS user
      responses:
        '200':
          content:
            application/json: 
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/User'
```

Trái tim sự khủng khiếp nằm ở **Hệ sinh thái ăn theo**:
1. Tự động sinh Giao diện dùng thử API cho đội Test/Frontend (Qua Swagger UI chọc ngoáy trực quan).
2. Tự động sinh bộ Test Postman Collections, CI/CD sẽ quăng test check xem dev có làm xô vỡ API đã hứa không.
3. Kỹ năng "Đỉnh cao lười biếng": Generator có thể tự động đọc file YAML rồi code **BUNG RA MÃ NGUỒN CỨNG** (Sinh sẳn Controller ExpressJS, Sinh sẳn giao diện Typescript Type bên React luôn). Nếu Backend lén thêm 1 trường trả về, tự khắc Frontend bên kia màn hình hiển thị cập nhật Typescript đỏ choét yêu cầu thêm Types (Code-Gen). Mọi thứ trọn vẹn hợp đồng.
