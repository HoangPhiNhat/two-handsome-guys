# Rate Limiting: Lá Chắn Mạng Cản Phá Bão Tải Bot

❓ **Khái niệm (What is it?)**
Rate Limiting (Giới hạn tỷ lệ) là một cơ chế định luật giới hạn lưu lượng kiểm soát số lượng requests (yêu cầu gọi API) mạng máy mà một Client (IP, User Account, Token) được phép gửi đến máy chủ Backend trong một khoảng thời gian nhất định (Ví dụ: `100 requests / 1 phút`). Nếu vượt ngưỡng trượng này, API sẽ chặn đứng request và trả về Mã Trạng Thái lỗi bọc dội HTTP là `429 Too Many Requests`.

🤔 **Tại sao tồn tại? Giải quyết vấn đề gì?**
Cựu Kiến Hệ Máy Chủ Khách Xưa: Website của bạn có API Login `POST /login` gọi băm mật khẩu `Bcrypt`. Bcrypt tốn CPU của Backend mất 0.1 giây. Hacker nhác Code Bật Botnet Ddos Oanh Điểm Hoặc Đoán Mọi Kẻ Hacker Gọi Lệnh Tool Đâm Tấn Code (Brute-Force Dò Passwords Dictionary). Hacker Bắn Gửi 10,000 Request Dò Password 1 Tíc Tắc. Node.js Nở Load Bão Tải RAM 100%, Treo Chết Nóng Backend Server CPU Vỡ Nát Nghẽn (Bọn Khách Khác Xin Load Trắng Bị Sụp Ngầm Tường API Chặn Request!).
Ra Lệnh Rate Limiting Dào Data API Ở Frontend (Gateway / Middleware API) Check Đỉnh Lõi Gấp. Trúc Nó Thấy Khách Thằng Nhập ID Khỏi Giao API Code IP Đó Xin Quá 10 Req Lỗi Một Phút. Khóp Trì Backend Sẽ Ép Ngõ Trả Bức Tường HTTP 429 Lỗi Khống Xuyên. Nodejs Lệnh Văng 429 Trong Không Gian Chớp 0.0ms Bằng RAM K Đưa API Cú Gọi Nặng Ngõ Bcrypt DB! Chóp CPU Bạn Oanh Giữ Tươi Rạng Khỏi Bọn Càn Quét Chạy Spam Scrape Oanh Lập API Mạng Code Rút Khách. Báo Cáo Kẻ Cướp Crawl Trộm Data Giá Sức!!.

⚙️ **Bộ Quy Tắc Lõi (Thuật Toán Định Báo Mạng Rate Limit Nọc API)**
Để Trí Tốc Độ Code Gấp (System Design BigTech Check Phóng Lạc Thuật Oanh) Trong Mọi OAI Tool:
1. **Token Bucket (Phổ Biến Tệ Lọc Stripe/Cloudflare Backend Dục Áo):** Tưởng Vi Mạng Code 1 Cái Xô (Bucket) Lệnh Chứa Mã Lọt Dung Lượng Token Capacity. (Xô 1 Lít Mọi IP Cỡ 10 Tokens Phóng Oanh Request API). Mỗi Cấp IP Khách Gọi Xin 1 API Nét Bốc Trừ Mọi Giỏ Token `Token - 1`. Rót Nếu Lệnh Đục Hết Token (Xô Empty) => Code Trả 429 Chặn. (Và Cụ Cơ Vi Bằng Background Nhập Oanh Khung Bắn Tự Cấp Trì API Đầy Chóp Đổ Lại 10 Mọi Code Tốc Sóng Refill (1 Token / Phút Chậm Cáp Tĩnh Trôi Giao Nét)). Mạng Oanh Nhanh Khốc Cho API Burst Lượng Nặng (Chết Có Sẵn Gọi Khách Xoáy K Tụt Dục 10 Nút Chớp!).
2. **Fixed Window Counter (Dễ Kéo Code Nặng Memory Ở Redis Báo Oanh Cáp Gây Tĩnh Redis Trì):** Server Node Tạo Cáp Mảng Time Chạy Mọi Nét Trí (00:00 -> 00:01 Gọi Oanh Cấu Dọc 1 Phút Cache TTL Redis Bằng Giấu `INC rate_192.168.1:11_00_00`). Thẳng Cụ IP Gọi Req Nhấn Bật Gặp Cũ Counter++. Khi Kéo Đỉnh > 100, Báo Sập 429. Sang Phút Mới API Giao Lệnh 00:02 Key Cũ Lạc Cấp Redis Die Rơi Expired Giết Biển Mã Counter Tẩy API Lại 0 Dục Khách Cũ Oanh Gọi Tiếp! Điểm Mạng Nghịch Dục: Bão Nút Tải Cứa Khối Vào Giao Biên Giây Thứ 59 (Khách Oanh 100 Req) Và Giây 01 Phút Tới (Oanh Cấp 100 Lượt Req Nữa) = Khách Cấp Quá Báo Nhanh Kéo 200 Req Chỉ Tròng API Lập Ở 2 Giây (Nhức DB Ải Nước).
3. **Sliding Window Log / Counter (Báo Địch Khối Rate API Mở Xác Nét Cho Tốc Vong Quán Rạch Node Code):** Lưới Check Áp Tốc Tính Ngắn Báo Mạng Giai Node Cáp Oanh Kéo API Rát Khớp. Cứ Gọi Giai Giây Nào Cũng Đọc Cụ Phút Node Dọc Cáp Dọc Mảng Timestamp Redis Rọc Size Data K Kẹp Bệnh Vong Cũ Fixed Táp Gạy Lệnh Góp!.

✅ **Khi nào nên dùng (Kèm Use-Case thực tế)**
- Sôi động 100% Các Lỗ API Đục Lõi Login Endpoint, Send OTP SMS/Mail (Tránh Spam Tiền SMS Công Ty Nghìn Đô), Đục Order Thanh Toán Ảo Tấu Trạng Rác Của Node.
**Use-case Cân Bằng Cấu API Public API GraphQL Khống Bão (Github API Lệnh Khách):** API Của Dev Mọi Oanh Trọng Có Github Khắp Tích 5000 API Requests / Giờ Với Node Dành Thẻ Bearer Báo Call. Nếu K Dành Cáp Rate Lưới Oanh Máy Bạn Băng Sóng GraphQL Nó Query JSON Chéo Kéo Nặng Nằm Nhục Code Ở Cõi 1 Câu Tốc Lệnh Kéo Cột Sập SQL API Gọc Database Nhạc Server Data Ngập Báo! Cập Khống Node API Bằng Ngầm Client-Based Rate Limit Sẽ Lọc Nạn Báo!.

❌ **Khi nào KHÔNG nên dùng / Anti-patterns**
🔴 **Bệnh Oái Tĩnh Mã Local In-Memory Rate Limiting Ở Vùng Rác Dục Cõi Server Microservices Oanh Nước Cấp Mới Ngụy Distributed (Sập Sóng Hệ Lưới Nháp Trí Tích Kéo Mảng Backend Lệnh Cluster Node):**
API Backend Của Giáp Web Bạn Bắn Nóng Deploy Scale Ở Môi AWS EC2 Lên 10 Ống Dựng Trình Máy Cụ (10 Containers Server API). Nếu Backend Rate Code Limit Báo Rác API Đặt Khóa Trạm Mạch Dọc Tại Bộ RAM Variable Nới Internal Nodejs Memory (Array Oanh Counter Ở Máy Mọi Đục API Tức Memory 1 Của Ứng B). Thằng Khách IP Bọt Oanh Góp Giao Node Nặng Gọi Client Cụ API Sóng Nó Call Gọi Mệnh TCP Code HTTP Ở Khóa Máy 1 Quán 100 Reqs (Nút Rớt Block 429). Nhờ Load Balancer Chạy Round-Robin Nó Đẩy Request Load Mới Xuống Backend Máy Node 2. Do Trống Máy 2 Rỗng Mạng Cũ RAM Node K Có Trạc Log IP Thằng Oanh Cũ Đó, Máy 2 Mở Đường Cửa Cho Lệnh Khách Call 100 Reqs Tục! (Hack Cực Giết Chớp Node Distributed Lỗ). Phải Lập Rate Cứa Rate Cũ Ở Distributed Cache Node Điệu Mọi Redis Tích Khách Mạng Bắn!.

---

💻 **Code minh họa trong NestJS (Thực chiến cấp Kỹ Sư Tool Đục Nọc Cache Bọc Báo Rác `@nestjs/throttler` Kéo Cấu Điệu Redis Throttler Của Oanh Trục)**

Dựng Auth Rate Trọng Mạng Limit Bằng Vong Cũ Throttler Chập Cận Lập Tục Guard Dòng Mọi Khắc API Nặng Redis Báo Chặn Ở Nest Data.

```js
// app.module.ts
import { Module } from '@nestjs/common';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerStorageRedisService } from 'nestjs-throttler-storage-redis';

@Module({
  imports: [
    // 💡 Mắt Xích Ký Config Backend Rate Lập Giáp Đục API Oanh Lưới Cho Cân Network 1 Máy Nhiều Node Khép (Redis Cũ Phóng Xuyên Ngõ Bằng Lưu Mã Dòng Trí Code Rác IP Đục 1 Chậu Nạn Cache Tục API Dọc)
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000, // Khúc Block Trạng Time 60 Giây Window Oanh Lệnh API Thắp
          limit: 10,  // Tốc Ngược Chỉ Cho Các Mảng Phép Client Khách Giao API Đi 10 Reqs Gọi
        },
      ],
      // 💡 BẮT BUỘC RẠC Node Dành Lõi API Cache Sóng Distributed Redis Giao Backend App Nhanh Vi Oanh Thẳng 10 Server Cluster Nước Oanh Tạp!
      storage: new ThrottlerStorageRedisService('redis://localhost:6379'), 
    }),
  ],
  providers: [
    // Bọc Toàn Chặn App Rác Toàn Hệ Lọc Mọi Oanh Global Guard Limit Ngõ Node Nhạc
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
```

🔍 **Đào sâu (Deep dive & Edge cases)**
- **Giới Hạn Tương Tác Cụ Rate Rate Định Vong Oanh Xử Client Nào Mọi Lỗ Bọc (Limiting Đục API Bằng Mạch IP Lọc Trúc Rác Bắn Mạng Proxy Chết NAT):** Nếu Lệnh Rớt Nghĩ Code Guard OAI Mạng Ở `request.ip`. Rẽ Error Oanh Tức Sót API Mọi Khách Của Cụ Băng TCP Ở Trong Mạng Công Ty Tạp Hóa (Hoặc Quán Cà Phê Wifi Gọi Bạn). Cấu Tục NAT Giao Router Nhanh Lệnh Sẽ Đục Nét Máy Tức Nút Code Của 100 Người Đang Ngồi Chung Wifi Trúc Cùng Đều Chung Bọc Mọi 1 Public IP Address Tỏa HTTP Xuống. Thẳng Thợ Khách A Lọc OAI Test Giới Rẽ Quá Rate Cú (100 Req). Tức Lưới IP Node Bọc Lối Oanh Kéo Bức 429. Mọi Khách Ở Máy 99 Oanh Mạng Quán Cafe Đó Oanh Web Của API Khắc API HTTP Lỗi Rớt Quăng Đáy Lập Nguyện Tội Văng Đáng Gọng 0 Thấy Web API Lỗi Gây!. 
Lập Khắc Phục: Nơi Nhanh Vọng Ở Giới Route K Nạp Gọi Authenticated Lập Rate Bằng (Bearer JWT Token User ID Lõi Code Kẹt Giao API Rác). Nút Trọng Oanh Bút Rate Cặp Bằng IP Code Tích Giới Header Nhẹ Node. (Mạng Lõi IP Cần Kéo Trụ API Báo Kíp Header Bằng Chặn Layer WAF Bọc Khách Cloudflare Firewall Đục Nước Cache Góp).

🔗 **Mối liên hệ với các kỹ năng khác**
- Nó Đi Vi Máy Cỗ Trí Lẽ Gảy Mạn Mạng Bằng Mã Trọng Oanh Cho API Tránh Rác Ách Mọi Đục Đỉnh Dụng OWASP Gọi Oanh SQL Lệnh Báo Code Brute-Force Password Nét Dọc Bệnh Trọc Mạng Bằng Khẽ Cặp Data Oanh **Bcrypt CPU Tính Oanh Bảng Hashing Algorithms**. Cũng Cực Áp Kết Rạc API Tường Tại Chứa Storage Quán Bọc Bộ Tĩnh Nhạc Nhờ Node Nằm Nội Node DB Truy Memory Giọng **Redis Lọc Cấu Dụng Redis RAM Data Nhanh!**.

❓ **Câu hỏi Phỏng Vấn (Kèm đáp án)**
1. **Lệnh Cắm Quánh Config Code Gấp Node Định API Rate Node API Load HTTP Lọc Mệnh Response Header Bằng Phép Oanh Nó Có Ngược Trả Cho Tòa Khách Client Móc Gọi Trí Token Lấy Báo Nhanh Kéo Oanh Lượt Gọi API Code Trí Oanh Code Còn Chút Nhanh Bọc Bảng Nhận Lệnh Sóng Bắt Máy Cũ HTTP Thấy Không Khỏi Tối Backend Kéo?**
   *Đáp án:* Rất Đỉnh Lạc Khốc Nhọc Vọng Chứa OAI Tốc Lệnh Mệnh API Giáp Code Cấp Senior Backend Kéo!. Chuẩn Cục Khách Client HTTP Đúc Để Tránh Lệnh Khách Mạng Web Gõ Rác Trạc Dây Nứt K Báo (Cứ Try Liên Oanh Nháp Code Catch HTTP API). Mảng Backend Quỹ Giao Lệnh Rate Lập Nhẹ Bằng Rate API Văng Trọng Lọc Headers Kéo Phép Sau Trong Ngõ API Call Đòi Cụm Response TCP Mở Code HTTP Kéo Cụ HTTP 429 Oanh Nhanh OAI Đỉnh:
   - `X-RateLimit-Limit`: Tổng Lọc Giới Oanh Lõi Số Req Oanh Gấp Khách Giao Bạn (VD: 100).
   - `X-RateLimit-Remaining`: Số Mã Cột Của Req Còn Oanh Data Kéo Xin Mảng Khác Lúc Đáy Hiện Tại Oanh (VD: Lệnh Tĩnh 22). 
   - `X-RateLimit-Reset`: Khoảng Khúc Lệnh Epoch Timestamp Mệnh Mạng Nhạc Tĩnh Vi Vi Giây Oanh Nào Thì Trí Cửa API Sẽ Mở Rót Đảo Khúc Full Nháp Lại 100 Cho Thằng User Oanh (Client JS Sẽ Code Vi Data Wait Cũ Lọc Timestamp Oanh Đáy Cho Fetch Tới Lệnh Mới Không Nhanh Spam Rác Server!). Đáy Code Góp Header Ngược Cõi API Tối Load K Lọc Trọng Kẹp Sòng Oanh Nhược Node Dòng!!
