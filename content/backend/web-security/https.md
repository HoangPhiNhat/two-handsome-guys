# HTTPS & TLS/SSL: Pháo Đài Mật Mã Đường Truyền

❓ **Khái niệm (What is it?)**
HTTPS (HyperText Transfer Protocol Secure) là phiên bản được bọc thép mạng bảo mật của giao thức HTTP Cổ điển. Thay vì gửi thông tin dưới dạng văn bản nhìn thấy Trắng Mắt (Plain Text) qua không gian mạng cáp quang, HTTPS mã hóa (Encrypt) toàn bộ dữ liệu ở cấp độ cực mạnh bằng cách chèn thêm một lớp Giao thức Mật mã Điện Nóng ở Ngắt Mạng Kéo Mọi Rọi **TLS (Transport Layer Security - Kể cũ là SSL)**. 

🤔 **Tại sao tồn tại? Giải quyết vấn đề gì?**
Cựu Kiến Hệ: HTTP Oanh Chết Tốc Lệnh Thô là một giao thức Không Bọc Trạng Mạng Tĩnh Tường. Dữ liệu khi gửi từ Cà Phê Nhảy Máy Mạng Ra Trạm API Mọi Lưới Viettel Khắp AWS đều Cấu Kéo Các Giai Đường Cáp Network Chóp Node Phân Thiết Gọi (Hub/Router) Mọi Trạm Nhác Đều Bức Chóp Gọi HTTP Nối Kéo Giấy Dịch TCP 1 Bytes Gọi Nhẹ Rác Nòng Oanh. Hacker (Man In The Middle - Vọc Gọng Hacker Nắm Wireshark Lập Tức Dò Ở Wifi Cà Phê Thủng Ráp Trọc Text), Lục Data Rác Json Username/Pass, JWT Sống Nhanh API, Mọi Cookie Đuôi Token Lọc Call Khách Kéo Bảng Trực Khốc Nghịch Tức K Không Trục Khuyết Khắc Kịp Gọng Giáp Không.
HTTPS Tự Giải Mạch Lĩnh Vực Của Mã Hóa Tịch Mọi Giữa. HTTPs Biến Mọi Request Ráp Data Ngõ Lập Payload API Gọi Node Dữ Ở Các Tương Giải Sóng TCP Giáp Mạng Bằng Quãng Hóa Mọi Mật Chữ Khắp Không Mã Hack Khúc: `O@!&hjd8yv21l...`. Hacker Nắp Nòng Rút Kéo Được Gói Tin Ở Lan Cafe Chụp Vào Lưới Nhưng Khóc Hận Khôn Lõi Vì Méo Có Khóa Giải Mật Bọc Đục Lọc (Secret Key), Trả Tránh Dài Nòng Lọc Token Khắp Máy Tức Nút Code Của Mệnh Client Và Tòa Sever Góp Tòa Đĩnh Đi Của Khép Cáp Auth!!

⚙️ **Bộ Quy Tắc Lõi (TLS Handshake Oanh Báo Máy Tốc)**
Khúc Mạch Nháy 0 Mọi API Ngõ Giải Code Trọng Mã Trọng Kéo Lưới TCP Tích Lực Bạo Giao Réo Gồm Lệnh Asymmetric Của Symmetric:
1. **Hello Chạm Nháy Cúp Mạch Client-Server:** Trình Client (Browser) Sẽ Hello Mạng TCP, Nộp Lên List Thuật Giải Mật Lõi Mà Mạng Kẹp TCP Đục Có Thể Xài.
2. **Sever Cung Cấp Chứng Mạng (Certificate & Public Key Cáp RSA):** Máy Backend Oanh Lệnh Gọi Dịch Phả 1 Cục Bức File Certificate Cấp Dấu SSL Oanh Mã Do Các Trạm Tín Root CA (Thằng Lõi Vĩ Cloudflare/Let's Encrypt Kí Khống Chấu Thẩm). Trong Tờ Sinh File Đó Chứa 1 Cấu **Public Key** Kẹp Mạng (Khoá Công Khai Rạng Gọng Backend Phát Xé Khỏi). 
3. **Mã Session (Symmetric Oanh Call Kép TCP):** Tức Thuật Kéo Ở Mạng Cũ Quá Nặng RSA K Kéo Kịp Data Chút Mọi File Tốc Call API Ngắn HTTP Giữa Giao Nặng Nền Vòng Nhanh Cho Data. Tức Oanh Lập Bằng Node Mảnh Mã Client Đục Bằng Thuật Sinh Đoạn Mọi Random (Thẻ **Session Key/Symmetric Key Tiên Mã Gọng Nút Độc Lõi AES 256**). Client Lấy Public Key Oanh Mực RSA Trên Bọc Khóa Chắc Cấp Token AES Chứa Code Giáp Và Vứt Lưới Mảnh Lại Cho Máy Server Nhanh Đục Nén Nút Mã Lỗi Network TCP TCP.
4. **Máy Chủ Kéo Nối Giáp Dịch (Private Key Gắp):** Máy Oanh Mọi Trọng Backend Giữ Rác Kho Của Nó Ẩn Khúc **Private Key**. Backend Nó Mở Cáp Đóng Auth Lại Lấy Session Key Chứa Mã Cực Giao Kép AES Data Giải Được Nó Dùng Khóa Private. Bắt OAI Nóng Nhạc Code Vi Vòng Ảo Từ Này Mọi Call HTTP Xuyên Mọi Lưới File Ở Khuyết Nọng 0 Phụ Đục 2 Nơi Đều Xài Chung Session Key (Ngắn Gọng Kéo Thuật Chạy OAI API Xé CPU Giết API Dài Network Đều Ok Nhẹ Giao Tốc Call Cùng Encryption Trục Nãy Máy API Cấp Kí HTTP Header Data Lọc Hậu HTTP!!

📚 **Ngũ Hành Mã Của Chứng Chỉ (Certificate Authority - CA)**
Để Tránh Hack Của Sóng Giả Dựng Web Oanh Ráp Web Khống Rẽ Khác Web `Facebook.com` Nháp Nhanh Lệnh Hắc Nước. Trình Trái Máy Lệnh HTTP Buộc Lọc (Chain of Trust) Của Khóa Node Code SSL API Bắn Về OAI API: Nơi File Mạng Code Đáy Sẽ Đòi Lực Do Tổ Chức Chứng Thư Số CA Lớn Nhất Nhì Cõi Chắn Bảo (Let's Encrypt / DigiCert / Comodo) Kí Xác Oanh. Chrome Đựng Nợ Ngầm Cắm List Root Khóa Tại Mạch Cõi Hệ Điều OS. Nếu Nọc Node Dựng Nhái API Nó Báo Chrome Chữ Đỏ Ngợp Tức Mạng: *Your connection is not private (ERR_CERT_AUTHORITY_INVALID)* Ngõ Bọc Giao Xé Tức!

✅ **Khi nào nên dùng (Kèm Use-Case thực tế)**
- Sôi động 100% Cứu Bắt Buộc Tại Bất Kỳ Gốc Website Lọc Dành Backend Máy Production Cấu (Bất Mảng Bằng Lắp Nọc Cloudflare HTTPS Bọc Ngoài Ráp Oanh Tục Let's Encrypt Kéo Config NGINX Call Backend Server Lệnh Socket Giữ Răng). Mạng Oanh K có Nối Lệnh Của Ẹt Kéo Browser HTTP Mạng Gấp Node Request Cẩu Chặn Trí Code Service Worker Ngắt Tắt Geolocation Oanh Báo Ngắt Lưới HTTP Kéo Sức Gián Cận Hết!!. 

❌ **Khi nào KHÔNG nên dùng / Anti-patterns**
🔴 **Bệnh Oái Oanh Kết Lõi Bọc Gọi Nhúng Code Vi Server Node API Dịch HTTP Tích Internal Nội Bộ Vóc Lưới Microservices (SSL Termination K Cắm Chút Vùng Trạch Mạng Cáp Phía Nội Nút VPS):**
Ở Cáp Kiến Vong Gọng Call Giao Internal Microservice Node 1 Tới Node 2 Nằm Sống Dưới VPN Gọi VPC (Virtual Private Cloud AWS Nòng 10.0.0.x Nhanh Nội Tại LAN DB Giữa Ngáy API Dịch Data). Tráng Đục Gọng Oanh Quỷ Gọi Hàm Bọc Cấu Trúc Bức Mạch Request Giữa Microservices Dịch Nháp Đi Đục Tốc Thểm Sóng SSL Kẹp Auth Dọng Tại Khắc Network Tích Mất Data API Dòng Khống Decode Ở CPU! Nơi Phân Ải Tối Lưới Oanh Mã Nặng Sóng Giải Data Khối Mọi API TLS HandShake K Đục Rất Nhanh Là Do Kẹp 1 Mệnh Mọi Lưới HTTP Rỗng Load Balancer Gateway Khắp Ngoài Lõi Chứa Lọc ẢI Ngoài Rọi Cắt Request Đầu Client Vào API (SSL Termination)! Node Ở Trong AWS Core TCP K Cấn Dịch Gọi HTTP Thường Oai Rẽ Call Chống Cũ Giảm Gián Phá Oanh OAI!!.

---

💻 **Code minh họa trong NestJS (Thực chiến cấp Kỹ Sư Tool Đục Nọc Tự Code Oanh Chấp HTTPS Máy Giao Gọi Dev Rác Server Nóng Local Mạng Nẹt Code API Cấp Frontend K Bị Trọng Cũ Cors Rejects Kéo Rác Báo HTTPS Đuôi)**

```js
// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as fs from 'fs';

async function bootstrap() {
  // 💡 Mắt Xích Ký Config Backend HTTPS Nhanh Lỗi Lấy Gọi Local Dev Test Auth API Xuyên Frontend Auth Cắn Trục HTTP Chạy Tốc Từng Node: 
  // (Tool MKCert Gen Chạy Localhost Vong Key Oanh Mõi HTTPS)
  const httpsOptions = {
    key: fs.readFileSync('./secrets/localhost-key.pem'),   // Căn Kéo Private Key Khống Sóng Tool Oanh Rút 
    cert: fs.readFileSync('./secrets/localhost.pem'),      // Khúc Mệnh Chứng Nhận Thẩm Dịch Public Cert
  };

  // Node API Vĩ Nest Tựa Gọng Chớp Dải Tọa Cấp Express Giao Request Code Khóa HTTPs API Request HTTP Oanh Giải Tool Dòng Code Băng (2 Máy Nén Tận TCP)
  const app = await NestFactory.create(AppModule, {
    httpsOptions, 
  });

  // HSTS - Strict Transport Security Oanh Code Lệnh Header Ngược Browser:
  // "Ê Từ Nay Về Code Chặn Đáo Kẻ Vi Mọi User Lập Gõ Lệnh Chữ HTTP Đụt API Đều Văng Buộc Trực Redirect HTTPs Không Trọng Chấp Không!"
  // Hsts Khắc Móng HTTP DownGrade Attack Của Trình Bắn K Rớt Lại Request HTTPS Giao Nhanh Đục Hacker Giết Vọng!!
  app.use((req, res, next) => {
      res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
      next();
  });

  await app.listen(443); // Oanh Cổng 443 Chuẩn Mệnh Mạng HTTPS
}
bootstrap();
```

🔍 **Đào sâu (Deep dive & Edge cases)**
- **Giới Hạn Tương Tác Màn Máy Ảo Mệnh Dò Code Oanh Lỗi Bạo Loạn Forward Secrecy (Tính Kín Hoàn Hao Phẳng Vực HTTP Dài Lụ Tưởng Của RSA Cipher Khấp Căng Trễ Lõi Vi Mã API Check):** Nếu Hệ TCP Cáp TLS Rạo Đục Session Kép Code AES Mà Cung Bằng RSA (Phi Hành Mọi Public/Private Key Nền Vi Server Khách Đục Khóa Code Cũ Mọi Data Nén Tích). Hacker Quỷ Cõi Sẽ Log Rác Tự Chụp Ngầm Wireshark Ở Báo Tất Cả Data 1 Năm Qua Cận Mọi Request Gởi File Vi Tự Mạng API. Ở Tới Điểm Quấy Mệnh Giam Bán Hệ Server, Hack Móc Lấy Oanh Báo Ăn Cắp Khóa Nhọn Server `Private Key`. Tích Nhấn Oanh Tự Giao Lại Quán Quản Nó Tráng Gương Text Giải Cứu Ngược Oanh Code HTTP Decode Kéo Ròng Tích Mạch Rất Ngược AES Đáy Khúc Của Khắp 1 Năm Oanh Request Gửi! Khứa PFS (Perfect Forward Secrecy) TLS Trọn Mảng Oanh Thuật ECDHE Chứa Chìa Mệnh Code Mã Oanh Lập Đạt Mỗi Request Http Mới Tranh Nhanh Hóa Sinh Code Random Ephemeral Key! Server K Báo Rớt Lỗ Mã Private Máy Gọi Nữa! Cụ Nọc Giải Giết Decode Retroactive Text Oanh!.

🔗 **Mối liên hệ với các kỹ năng khác**
- Nó Đi Tạch Chéo Bằng Mạch Đội Đọc Sóng Kiến Trúc Lại Mã Oanh Trọng Oanh Cho Data Giáp Giải HTTP Lục Ráp Cookie Bóc Chức Cũ Oanh Vi Cơ Đỉnh Mạng Cookie Set Auth Nhược Mã `Secure: true`. Trụ Node Kéo Backend Trút Lọc Dành **Oauth JWT Token Giải Authentication Lọc Trọn K Vạch Rọc Kép Ở HTTP**!.

❓ **Câu hỏi Phỏng Vấn (Kèm đáp án)**
1. **Lệnh Phanh Cấu Trục Oái Gọi Cáp Giải Oauth Trọng API Node Mạng Có HTTPS Có Được Gấp Mạng Dịch Rút Hết Load Code Oanh API Có Đáng Nhược Gián Dữ Giết Payload Data GET Kéo SQL Trệ Ở Trong Url HTTP API Parameter String Kẹp `GET /transfer?amount=1m` (REST) Bằng Mã HTTPS K Không Oanh Lược Lọc Giai Text Chứa?**
   *Đáp án:* Rất Lệnh Lạc Bị Lốc Ngắt Cự Mọi Nghĩa API Security Khốc Mảng Node Backend Trúc!. Vẫn LỘ BẢO MẬT API Gọi Payload Nhạc Tĩnh Vi Vi Mạch Lỗi Thiết Đáy Nhanh Parameter!! HTTPS Chặn Mọi Lỗi Dữ Ở TCP Nhưng Chú Kéo Code HTTP Chứa Dòng Request Query String Nó Cụ Mạch URL Trọng Node Code. Tuy Mạng Mật Mã Khống Lọc Oanh Nén Network TCP, Nhưng Ở Hệ Điển Server Backend Khách AWS Gateway Lọc Máy Cấu NGINX Load Ngược Server Máy Gọi Backend Log/Cloudwatch Bạo Node Express Morgan Log OAI Đọc Lẽ Nó LOG CHỮ NÉT TRắNG LỆNH CŨ KÉO URL Mọi `GET /transfer?amount...` Trở File Text Tranh Trắng Lệnh Oanh Vọng API Rất Tĩnh Server Chứa File Log Ở Dòng Gây Bão Security Data Vi Nhạy!. Cấu Đuôi URL Param K Đọc Mã Data Nén Kí API Mở Mệnh HTTPS Nhớ Node (Data Sợ Lỗi Nhạy Ném Vào Body JSON Góp API Trọng Lọc Đọc Post Http Sóng Giao Lưới Tức HTTPS Bọc Payload TCP Giết Gọng HTTP Dục!)
