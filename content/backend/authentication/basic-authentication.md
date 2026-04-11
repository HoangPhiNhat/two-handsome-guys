# Basic Authentication: Chìa Khóa Nguyên Thủy Gắn Liền Mạng Lưới HTTP

❓ **Khái niệm (What is it?)**
Basic Authentication là cơ chế chứng thực danh tính cổ xưa và sơ khai nhất của thế giới Web, được tích hợp thẳng vào cấp độ Giao thức HTTP (chuẩn RFC 7617). Nó định nghĩa một lề lối làm việc đơn giản: Nếu tài nguyên có khóa, Client hãy gửi chuỗi Mật khẩu và Tên Đăng Nhập kẹp chung vào Header HTTP trong "MỌI và TỪNG" request gọi lên máy chủ.

🤔 **Tại sao tồn tại? Giải quyết vấn đề gì?**
Quay về những năm 1999, đa số website chỉ phục vụ các file và thư mục tĩnh. Người quản trị mạng (DevOps/SysAdmin) cần một công cụ siêu tối giản để bảo vệ một thư mục cấu hình trên con chủ Apache mà không rảnh rỗi đâu đi viết Code Session Database Backend và Frontend Đăng nhập Form cực nhọc.
Basic Auth nhờ vậy thống trị: Chỉ mất 1 dòng config trên Nginx, khi có khách vào, tự động Trình duyệt Browser sẽ thả cái hộp thoại Popup bắt điền mật khẩu. Server đối chiếu qua file chữ thô nội bộ, quá nhanh và không tốn 1 dòng code Dev.

⚙️ **Kiến trúc cốt lõi (Core Architecture)**
Quy trình trao đổi giữa Trình duyệt và Server rất kinh điển với Vòng lặp Challenge-Response (Thách thức HTTP `401`):
1. Bạn gọi GET `/admin/panel`.
2. Lớp chặn của Server phát hiện k có khóa, đáp trả lỗi `401 Unauthorized`. Kèm theo lời Thách Thức ở Header: `WWW-Authenticate: Basic realm="Restricted Khu Rừng"`.
3. Nhờ có cái cờ Header này, Chrome/Firefox của Khách Khựng Lại. Trình duyệt **TỰ ĐỘNG Bật Cửa Sổ Popup Của Hệ Điều Hành** đòi user nhập User/Pass.
4. User gõ: `admin` mật khẩu `sieu_mat_123`.
5. Trình duyệt ghép hai chữ lại bằng dấu hai chấm: `admin:sieu_mat_123`.
6. Trình duyệt chạy hệ mã Encoding qua Base64 cho chuỗi trên (Ví dụ ra `YWRtaW46c2lldV9tYXRfMTIz`).
7. Browser tự động tải lại vòng GET gởi Header mới đóng thẻ: `Authorization: Basic YWRtaW4:....`. Server nhận, dịch ngược Base64 kiểm tra File Hash và Cho qua Màn!

✅ **Khi nào nên dùng (Kèm Use-Case thực tế)**
Chủ yếu sống sót ở phần cấu hình Server Hệ Sinh Thái Vận Hành / Tooling thay vì các API Web của User thông thường. Cực kỳ tiện cho System Admin.
**Use-case Backend nội bộ Webhooks / Swagger Docs:** Bạn viết Cổng Tài Liệu OpenAPI (Swagger) cho Hệ thống và muốn giấu kín, không cho Bot Google quét. Gắn cơ chế OAuth rất nặng. Đơn giản nhất, bọc Basic Auth bằng Middleware. Các API của K8S / RabbitMQ Admin / ElasticSearch ở lớp mạng riêng Backend VPC cũng hay dùng Basic Auth, do các service gọi chung bằng Mạng riêng (Internal Network), gõ cọc Password Text tĩnh ở biến môi trường cực dễ dàng cho các tool tự động call API!

❌ **Khi nào KHÔNG nên dùng / Anti-patterns**
🔴 **Phơi Thây Trong Trận Giáp Chiến Public Layer (Chạy Mạng Thô HTTP không SSL):**
Đây là lỗi sơ đẳng chết rụi công ty. Khái Niệm Encoding Bằng Tiêu Chuẩn Chuỗi ASCII của Thằng Base64 HOÀN TOÀN KHÔNG PHẢI LÀ MẬT MÃ HAY MÃ HÓA (NO ENCRYPTION AT ALL!). Bất kỳ sinh viên năm nhất nào bắt được gói tin Mạng HTTP Của bạn bằng phần mềm WireShark (Kỹ thuật Man-in-the-Middle), thì chỉ cần Ctrl+C cục Chuỗi kia quăng vào hàm Javascript `atob('YWRt...')` LÀ MẬT KHẨU ADMIN CỦA BẠN SẼ HIỆN THÔ HOÀN TOÀN BẰNG TEXT TRẮNG KHÔNG SÓT VẾT!!! 
Lệnh cấm: KHÔNG DÙNG Nó Ngoài Mạng Public Trừ Khi Có Khóa Mã SSL/TLS HTTPs 443 Xanh Lét Bảo Kể Tường Mã Hóa HTTP Request!

---

💻 **Code minh họa trong NestJS (Thực chiến cấp Kỹ Sư)**

Dựng rào chắn Basic Auth thông thường cho Swagger hoặc các cổng rác Dùng Middleware kịch kim.

```js
// basic-auth.middleware.ts
import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class SystemBasicAuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Rút thẻ Header ở dạng Basic (Tức nó không phải chữ Bearer JWT)
    const b64auth = (req.headers.authorization || '').split('Basic ')[1] || '';

    // Dịch Ngược Dòng Kéo Base64 Sinh Ra Buffer Hệ Lỗi -> Dịch qua text
    const decodedPayload = Buffer.from(b64auth, 'base64').toString(); // Result: "admin:passwd"
    const [loginUser, loginPass] = decodedPayload.split(':');

    // 💡 So Khúc Khớp Biến Trong Gọng File Môi Trường System. K Chạm DB
    if (loginUser === process.env.SYSTEM_CRON_USER && loginPass === process.env.SYSTEM_CRON_PASS) {
      return next(); // Trót Lọt Cho Lệnh Pass Dọc Controller
    }

    // 💡 Cờ Header Bắn Súng Yêu Cầu Trình Duyệt Phục Tùng Mở Modal Nhập
    res.set('WWW-Authenticate', 'Basic realm="Zone Bi Cuong"');
    throw new UnauthorizedException('Kéo Mật Khẩu Sai Rỗng Trục Rớt!');
  }
}
```

🔍 **Đào sâu (Deep dive & Edge cases)**
- **Giới Hạn Tù Khép Đỉnh Căn Thép Log Out Của Trình Duyệt HTTP Cổ (The Logout Impasse):** Một kẹt cực bựa: Khi Client là Trình Web như Chrome điền Password Basic. Chrome tự nhận nhiệm vụ "Lưu Ngầm Vào Kernel Memory" và Từ nay Vứt Tự Nện Gói Header Authorization Mọi Lúc Call. ĐIỂM SẬP LÀ CHROME KHÔNG CUNG CẤP NÚT XÓA MẬT KHẨU HTTP BASIC TẰNG API! User ấn chữ Logout của Web, JS k thể ép Chrome quăng cấu trúc Basic. Hệ lụy người ta muốn dẹp Password cũ, họ phải tạo Script Gửi Fake Đè Login Sai (Như username giả `logout:xxx`) Dội dập Chrome hoặc Bắt Người Ta "Giữ Chặt Nút X Tắt Hẳn Khung Cửa Sổ Trình Duyệt Bật Lại" Đi Cực Chướng!

🔗 **Mối liên hệ với các kỹ năng khác**
- Nó gần như đã Mất Đi Địa Vị Thượng Phong Trong Nút Gọi Tải Kiến Trúc Modern Web Application Trước Sự Xâm Nhập Nhỏ Nhẹ Của Vị Thần Mã Gọn Hệ Cột Lệnh Không Trạng Thái **JSON Web Tokens (JWT)** Mảng Mã Code Web Và Luồng **Oauth / OIDC** Trọc Mọi.

❓ **Câu hỏi Phỏng Vấn (Kèm đáp án)**
1. **Lệnh Cắm Quánh Ngầm Bụng Base64 Auth Encode Rát Trong Dòng Lệnh Cắt Có Gây Nghẽn System Nặng Cụ Database Hơn Khi Xài JWT Nếu Có Triệu Khách Hits Lệnh K?**
   *Đáp án:* Rất Lệnh Lạc Khốc Lõm Đục Backend Rút Chết Luôn! Đặc biệt là Mạng Ngược JWT. Thằng JWT Sinh Trúc Nó Bọc Rứt Quyền Vào Payload Dấu Validation Signature Nằm Sẽ Trả Trắc 1 Ms, KHÔNG GỌI DATABASE! Điểm Yếu Chết Huyệt Của Basic Auth Là Ở Dòng Request API Nào Khách CŨng Thả Dọc Chuỗi Password Khách Theo! Nếu Trình Bạn Call 50 Mạch API Rút File Đổ Web, Backend NestJS Phải Gánh Tròn Mã Băm Mệnh So Sánh Bằng SQL Database Cực Tốn Hash Cost Của Bcrypt Nghẹn CPU Chọc Liên Kéo. Chập Đứng Giết Code Cụm API Không Cách Khống Gánh Băng Sóng!!
