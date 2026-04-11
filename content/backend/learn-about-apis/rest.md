# REST API: Phá Vỡ Nhầm Tưởng CRUD

> **Mục tiêu:** Sinh viên thường lầm tưởng "Làm backend tạo cái API method GET, link trả JSON thì tao gọi là REST API". Sai hoàn toàn! Bài viết làm rõ tư duy HATEOAS và Stateless Constraint định hình nên khái niệm Representational State Transfer do Roy Fielding sáng tạo.

## 1. Thế nào là Thực Thể (Resource-Oriented)
Tôn chỉ tối thượng của REST là bạn không gọi một THAO TÁC (Action), bạn thao tác trên MỘT TÀI NGUYÊN (Resource).
- **Lỗi tư duy (RPC Style):** URL thiết kế `POST /api/createNewUser` hay `GET /api/deactiveUser?id=123`. Đây là kiểu thiết kế gọi Hàm ở xa, không phải REST!
- **Chuẩn mực RESTful:** Tài nguyên mang danh từ (Noun) và các HTTP Methods định hình Hành động (Verb).
  - `POST /api/v1/users` (Tạo tài nguyên vô Collection "users").
  - `PUT /api/v1/users/123/status` (Ghi đè cái trạng thái của thực thể mang mã 123 xuống db).
  - `DELETE /api/v1/users/123`

## 2. Các Rào Cản Khắt Khe của REST
Roy Fielding không phát minh ra giao thức HTTP, ông ta đưa ra kiến trúc để xài HTTP đúng cách:
1. **Client-Server Separation:** UI và Backend phải tách bạch. Backend không quan tâm UI render bằng màu gì.
2. **Stateless (Vô biểu trạng):** Đã phân tích kĩ ở bài Internet HTTP. Không hề có Session ID lưu bộ nhớ Ram Server. Mọi Request phải nhét đủ JWT/Cấu hình tự thân nó.
3. **Cacheability:** Khai thác tối đa `Cache-Control` cho GET queries để tiết kiệm tải dội về DB.

## 3. Maturity Model (Mô hình Richardson - Các cấp độ trưởng thành)
Rất hiếm các dự án ngoài thực tế đạt được Level 3 chuẩn chỉ của REST.
- **Level 0 (Sinh lầy):** Quăng cục SOAP Envelope hoặc 1 cái link `/api` và mọi thứ dùng POST/XML hỗn tạp.
- **Level 1 (Tài nguyên):** Phân chia được URL theo danh từ `/users`, `/articles`. Nhưng toàn dùng POST cho mọi thứ, kệ method.
- **Level 2 (HTTP Verbs):** Tôn trọng tuyệt đối method (GET an toàn, PUT idempotent, DELETE). Đây là level 90% công ty thị trường xưng hô là "hệ thống tôi xài REST".
- **Level 3 (Hypermedia Controls - HATEOAS):** "Siêu Việt". Dữ liệu trả về không chỉ là JSON thuần tuý, mà ở dưới đáy phản hồi đính kèm các Link Tương Lai cho phép Client điều hướng mà không cần tra Document API.

## 4. Gập Ghềnh Thực Chiến
Lý thuyết là vậy, nhưng REST có các giới hạn khiến ngành công nghiệp nhức nhối sinh ra GraphQL & gRPC:
1. **Thiếu vắng chuẩn mực Batching/Liên kết phức tạp:** Làm sao POST 1 cái gọi Update được Data ở 3 bảng? REST truyền thống nhăn mặt.
2. **Over-fetching (Dư thừa chéo):** App Mobile chỉ muốn hiện ra Tên & Tuổi. Việc gọi `GET /users/123` nhả ra chuỗi JSON khổng lồ bao gồm cả Giới tính, Address, History -> Phung phí băng thông thảm họa cho Mobile.

*(Phần này đánh cầu nối trực tiếp để team bạn nhận ra ưu thế vì sao chuẩn gRPC/GraphQL lại lấn sân).*
