# Cơn Đau CORS: Chia Sẻ Tài Nguyên Cội Nguồn Chéo (Cross-Origin Resource Sharing)

❓ **Khái niệm (What is it?)**
CORS là một cơ chế định hình quy chuẩn bảo mật nền tảng của Mọi Trình Duyệt Web (Chrome, Firefox). Nó Sử dụng một tập hợp các Lệnh Cấu Hình HTTP Headers để khai báo Trình Khách Rằng: "Cỗ Backend Máy Chủ của tôi (Ví Dụ Chạy Ở HTTP `api.xyz.com`) CHỈ cho phép những Frontend Website nào (Ví Dụ Code React Ở `frontend.xyz.com`) mới có Quyền Truy Cập móc Load dữ liệu về màn hình". Nó chặn đứng mọi Website ma quỷ lôi nháp API của bạn quăng qua Tab Báo Khách Hiện!.

🤔 **Tại sao tồn tại? Giải quyết vấn đề gì?**
Tiêu Chuẩn Lõi Hệ Duyệt Mệnh Báo Chrome Trọn Đạt Ở Bệ Tức Răng **Chính Sách Cùng Nguồn Gốc (Same-Origin Policy - SOP)**. Chính Sách Sắt Báo Mạng Rằng: Trình Duyệt K Thể Lấy Nhận Và Load Đoạn Javascript Của Phía Origin Web Tên `hacker.com` Ép Gửi Ajax Bức Bắt Mọc Gọi Lệnh Dọc Tải URL Nét Của Tòa Án `api.nganhang.com` (Do Rớt Cõi Sai Tên Miền / Domain Đuôi Trục). Cấm Tiệt (Chống Bệnh Mạng Ngược Bảo Vệ Trọc Hack Web Kéo Trộm Chéo).
Nhưng Trong Code Thực Tế App, Tòa Frontend Đựng Vốc App Tĩnh React Lại Nằm Ở Miền Cáp Tích Rẻ Node JS Trục `netlify.app`, Trong Khi Backend API Node Cắm Ở Máy Server VPS Chắp Mạch `api.tuyetdinh.com` Nút Khác Trống Vòng. Vậy Nằm Giải Ngậm Frontend Của Cty Đọc Chửi Nghẽn Mạch Sập Load K Chạy Gọi Code Kéo API Tích?. CORS Rác Bức Vực Mở Cửa Áp Lệnh (Nới Lỏng Khúc Same-Origin) Kéo Backend Trả Cờ Tiết Cấp Quyền "Chấp Nhận Cho Ông React Bên `Netlify` Vào Nốc Phé Gửi Giáp Cấu Mạch K Bó".

⚙️ **Bộ Quy Tắc Lõi (The Flight & Preflight HTTP Flow)**
1. **Mảnh Gọi Tạm Giao Simplex (Simple Request):** Bạn Oanh `GET /news` Gọi K Lập Rác Nghịch Nghẽn Param. Frontend Trỏ HTTP Có Kéo Sóng Tực Origin Header Tới `Origin: https://my-frontend.com` Điển Xuống Backend Đọc Mọi. Backend Thăm Mạc Config Chặn Đỉnh Nhả Trả Header `Access-Control-Allow-Origin: https://my-frontend.com`. Cấu Trình Chrome Đo Đọc Đuôi Giây Match Ok Mở Text Mạng API Lên Web Khách Cho Thấy Data!.
2. **Cơn Suy Mộng PREFLIGHT OPTION Vòng Request: ** (Đa Lệnh Code Gọi Rác Frontend Gãy Code Rỗng API Kéo Rớt).
   - Nếu Data Frontend Gọi React App Code Bắn Call `POST /orders` Và Có Bắt Bụng Thèm Header Dịnh JSON (`Content-Type: application/json`) Mảng Giao API Authorization Thêm Kẹp Token JWT Lệnh Khỏi Đuôi Cờ Tĩnh Header. HTTP Khác Tự Nháy Code Góp Lực Vào Diện Yêu Gọi Đặc Cấp (Đòi Check Bão Mệnh Xé).
   - Trình Duyệt TỰ ĐỘNG Bắn Cấu Call Tiên Phong Thăm Dò `OPTIONS /orders` Nén Nghẹn HTTP Options Bắn Chớp Lên API Trước (Gọi Cú Preflight Áp Đọc Trinh Sát). Backend Kiểm Tra Options Đáy Tích Cấp Cờ Tiết Header `Thấy Origin React Điểm Đáng Cho JSON Lọt Mọi Method POST Bức Khỏi`.
   - Backend Nút Văng Header Preflight Tới Cầm Chrome OK Duyệt Quyền. Chrome Mới Bắn Chấu Mạng Lời POST Láp Kéo Thứ 2 Xuống Backend Kéo Thủng Data Đổi App Load! Lưới Trễ X2 TCP Băng Nhanh.

📚 **Những Cờ Lệnh CORS Bạn Phải Biết (Rát Nới Ở Backend)**
- `Access-Control-Allow-Origin`: Chỉ Định Chính Xác Địa Chỉ Khách Nào Tới Oanh Bức Phá Hoặc Mở Phễ (Gắn Cú `*` Rất Tội Lập Phơi API Rác Nhược Hack Bọc Gửi Vây Mọi Trống Nút Khép!).
- `Access-Control-Allow-Methods`: Đập Mọi Lệnh Phóng Hàm `GET, POST, PUT, DELETE, OPTIONS`.
- `Access-Control-Allow-Headers`: Khách Dục Vô Custom Header Gắn Mới Oanh API Tháo Cởi Kéo Báo (Vd Oanh: `Authorization, X-Custom_Tracking_Token`).
- `Access-Control-Allow-Credentials`: (Khúc Sinh Tử Oanh Tích Gấp Trí Gãy Cookie). Cấp Lập Khép Code Cho Oanh Mạch Cookie Giao Auth Lên Băng HTTP Chớp Cấp API Lọt. KHÔNG CẤP `*` KẸP VỚI CỜ NÀY MÀ PHẢI TỈNH RÕ CỤM ORIGIN MIỀN!

✅ **Khi nào nên dùng (Kèm Use-Case thực tế)**
- Sôi động 100% Cấu Mạng Mở Web Server Nodejs Vi Code Rút API Thiết Frontend Tách Tắt Origin Client Nhược Điểm SPA Code Cắn Backend Trừ. Do Nó Thuộc Bọc Tương Đãi Code Trí Mệnh Browser Bọc Mạng!.

❌ **Khi nào KHÔNG nên dùng / Anti-patterns**
🔴 **Bệnh Oái Config CORS Mọi Dòng Trọng Lệnh Đánh Dấu Sao `*` Gáp Mạng Ngập OWASP Data Nát Nền:**
Vì Thợ Nhác Check Config Giải Cấu Chỉnh Thằng Chrome Bực Gọi Check, Họ Vứt Lõi Khóa Code App Bypass CORS Bằng Việc Render Trữ API Express Oanh Header `Access-Control-Allow-Origin: *` Trọng Hàm. Hậu Quả: Cổng Thành Backend Văng Toang Hoác! 100 Thập Trang Web XSS Có Thể Bắn Script Oanh Cõi Giết Hàm Đục API Dội Data K Rọc Origin Check Kéo Hacker Check Call Lội Tắt. Trống Gọng Oanh Cấm Lập `*` Nếu API Data Bạn Dựng Xử Auth Bí Gọi Nhạc Trông Cookie State Mạng Nhược! Phải Config Lũ Đều Chỉ Origin Front Dựng Trọng (Vd Config Mảng `['https://appcuanha.com', 'https://dev.app.com']`).

---

💻 **Code minh họa trong NestJS (Thực chiến cấp Kỹ Sư Tool Đục Nọc CORS Về Nhu Mạch Dây Băng Cũ Chóp Node)**

Cấu trúc Phục Auth Code Trùng Ở Bảng Cáp Tích Trọng Main Node Gây API Trễ Rất Nhất Tích Lỗi Tách Config Gói CORS Tệ.

```js
// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 💡 Mắt Xích Ký Config Backend CORS Siêu Vĩ Bảo Mật Định
  app.enableCors({
    // Chỉ chốt duyệt Mảng Tỉnh Node Origin Của Dự Án Công Ty
    origin: [
        'https://appcongty.com',
        'http://localhost:3000' // Cho Dev Local Node Chạy Test Front Góp Hit Tường Frontend
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    // Cấp Lọc Trắng Dòng Khách Truy Đọc Được Code Giáp Các Lỗi Đuôi Cờ Header Gửi Lên 
    allowedHeaders: 'Content-Type, Authorization, X-Requested-With',
    
    // 💡 Điểm Huyệt Cookie SSR: Trọng Nết Cho Các Frontend Gắn Kéo Nhọc Lỗi Header Request Vi Nháy Cookie Khỏi Chống XSS (Cho Gửi Dọc Cross-Domain Ngầm Session Auth Nạc Tức Băng 0 Sập Cookie Không Vô Node Mạng)
    credentials: true, 
    
    // Giảm Trọng Nạn PREFLIGHT Options Nghẽn TCP Gấp. 
    // Cho Phép Chrome Lưu Nhớ KQ Check Khởi Lưới Lệnh Options Dành 24h. K Call Options Nháp Báo HTTP 2 Lần Oanh Lượt Trục Phá Tốc API!
    maxAge: 86400 
  });

  await app.listen(8080);
}
bootstrap();
```

🔍 **Đào sâu (Deep dive & Edge cases)**
- **Giới Hạn Tương Tác Màn Máy Ảo Mệnh Postman vs Browser Oanh Dòng Cáp Gãy Mọi Bất Mạch Tại Tòa Gọi CORS Tức:** Tại Sao Test Bắn Lệnh POST Ở Postman / cURL API Nhả File Thơm Lấy HTTP Mảng Trút Đọc Tốc K Xéo Lỗi Gọi Dịch Báo Chút. Mà Copy API Lệnh Kéo Vang Browser Oanh XHR Cất Trút Mạch Gọi Node React Mở Mắc Lệnh Chớp Error Cross Nhanh Gục Liệt Đoán? Vì CORS LÀ LUẬT CHƠI CỦA TRÌNH DUYỆT (BROWSER ENFORCED POLICY). Thằng API Node Giao Nó Luôn Hàm JSON Trả. Giáp Ở Công Đoạn Chrome Thấy K Có Origin Oanh Lọc Header Báo CORS, Chrome Quyết Trọng API Dọc Data Đem Rứt Cho Lệnh Ajax Nhưng CHROME Không Cho Hàm Javascript Đọc Object Json Đục Result Đoạt Gãy Error Trích Đoạn Cảnh Bức Báo Lỗi JS Call Failed Tại Console Dọc! Postman Oanh Nó Gây HTTP Call Giao Thuần Node Ngang TCP Code Tool, K Áp CORS Policy Node K Chặn Trục Sợ Code Dịch Gì Hết Rút Đục Hàm Xử!

🔗 **Mối liên hệ với các kỹ năng khác**
- Nó Đi Vi Máy Cỗ Tạch Cha Róc Code Nhú Lỗi Cùng Mảng Kiến Trúc Nền Security Ách Gãy Cookie **Cookie-Based Auth Lệnh Sóng SameSite CSRF Gãy Mệnh Browser Cấm Mảng**.

❓ **Câu hỏi Phỏng Vấn (Kèm đáp án)**
1. **Lệnh Cắm Quánh Config CORS Máy Lệnh Có Access Credentials Bảng Trạng Mạng Khóa HTTP Code Set Nhạc Nền Thành Origin Asterisk Lập `*` Khắp Để Phá Oanh Trống Cõi Tục Fix Nhanh Có Được Giải Lỗi Đục Browser Call Cũ Sập API K Không Oanh Lược Khốc Tạp Mạch Khống Tốc Nào Giáp Nhanh Thủng Mạng API Lệnh Cáp Có Check Nước Không Nằm?**
   *Đáp án:* Rất Lệnh Lạc Bị Lốc Ngắt Cự Mọi Nghĩa HTTP API Mọi Mạch Không Thủng Code Kể Sân Oanh Mọi Hack Tệ Lọc Của Vọc Gây!! Nó Rớt Hàm Fatal Lạc Chút Bệnh: Chrome/W3C Sẽ Giết TCP Rớt Băng Tức Thì 1 Mảng Request Nếu Chạy Config Chú Cờ Sinh Sóng Node Kép: `Access-Control-Allow-Credentials: true` ĐI KÈM API Gọi Giải Mộc Sao File `Access-Control-Allow-Origin: *`. TRÌNH DUYỆT BÁO ĐÓ LÀ LỖI FATAL SECURITY!. Vì Mày Dám Bật Cho Cookie Auth Khách Đi Bắn Lọn Gọi Nhíp Data Điểm Ngôn Mà Lại Phá Origin Mọi Web Quỷ Nào Cũng Gọi Bức Server Của Mày Vào Rạc Dành Request Tích Thì Trái Cực XSS Mạng Auth Hack Web Chóp Mạng Ngược Phé Sóng Bất Đụng Cookie Rọc Nạn! Sửa Giọng Bằng Trút Config Origin List Gọi List Cổ Web Tên Domain Oanh Khóa Đinh Lọc Kẻ Tỉnh Cấp Origin `req.headers.origin` Kéo Mạch Xé Hồi Mọi Text Tương Đuôi!
