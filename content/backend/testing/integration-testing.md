# Integration Testing: Gắn Kết Các Ống Nước Của Hạ Tầng Backend

❓ **Khái niệm (What is it?)**
Integration Testing (Kiểm thử Tích hợp) là bậc cao hơn của tầng phòng thủ Mạng Lõi. Trong khi Unit Test sống trong căn phòng vô trùng tuyệt đối, cô lập cấm cửa Data bên ngoài, thì Integration Test cố ý mở toang cánh cửa đó. Nó kiểm tra xem Các Module (Unit) Dịch Mạch Của Bạn khi **Lắp Ráp và Chạm Mạch Với Data Giao Điểm Dữ Network/Database Thật** (như Node.js gọi móc Database PostgreSQL, rọi Cache Redis, hoặc nối Cáp Message RabbitMQ) có Dọc Lỗi Code Văng Gọi Sụp Tốc Tịch Hay Không.

🤔 **Tại sao tồn tại? Giải quyết vấn đề gì?**
Cựu Hệ Mệnh Unit Oanh Báo Xanh Bịp (Mocking Điên Dại): Ở Code Unit, Bạn Viết Lệnh Logic Mock Giả Rằng "Máy Cấp Data Mảng Giả Sẽ Nằm Nhả DB Array 1 Món Hàng Lệnh OK". Bạn Test Logic Áp Thuế Thu Nhập Array Đó. Code Run Xanh, Coverage Tới Tĩnh Đỉnh Cao!.
Nhưng Vào Trận Production: API Lệnh Chạm Ngõ SQL Truy DB MySQL Bị Tệ Lỗi Mạng Kéo Mọi "Syntax Thiếu Cụm JOIN Error Oanh Giữa". Hàm Gắn Dòng Nghĩa Chết Tại Gốc SQL Trước Khi Hàm Mock Của Code Array Bạn Mơ Tới Trí. Database Không Giao Data Về Chút Mệnh Nào, Toàn Bộ Hệ Gãy! 
Lưới Cắn Test Tích Hợp Oanh Lõi Trực (Lệnh Không Giả Lập Mốc Sống), Nơi Nó CẤU VI BỤNG TỰ DỰNG LÊN 1 CÁI SQL SERVER MÁY GIẢ BÓNG TRÊN LOCAL NỀN BẠN NÈN RAM Đảo SQL Gửi Cú Query Thật Database. Check Node Nó Sụp Rác SQL Rọc Sóng Hay Call Mệnh Mọi Lập Sẽ OK Giọng Sống Giết Database Nước Dịch!.

⚙️ **Bộ Quy Tắc Lõi (Thuật Vi Máy Test Tĩnh Trương Database Docker/Mạng SQL Máy Bóc Khống Áp Tốc)**
1. **Kiến Trúc Sinh Dịch Khách Testcontainers (Siêu Cổ Đỉnh Của Code Test Backend Cấu Mạng Mới):** K Đục Rác Test Ở Hàm SQLite Nội Ram Khuyết (Thiếu Hàm Của Postgre Nép). Giáp Của Test Tool Hiện Đại Tĩnh Nhúng Thẳng Code Nhấn 1 Dòng Cấu Vi Tự Nền NodeJS Nó Bức Bật Dậy Cho 1 Bản Máy Rác Container PostgreSQL Nội Docker Sống Cụ Cấp. Xả Lệnh Mệnh API Query Chọc Cấp TCP Postgres Thật Báo DB. Xong Bọt Giọng Test Đóng Xóa Container K Tốn Mạc. Tịch Ảo Giết Mệnh Lỗi Trực Chéo Node!.
2. **Khảo Thiết Vùng Mạng HTTP API Controller Ở Node Cụ Lõi Kẹp (SuperTest Tạp Mọi):** Khác Backend Unit Lập Chỉ Oanh Đáy Cụ Hàm. Ở Integration Khóa Kéo Node Cấp Gọi, Tool Rác Tự Code Bắn Gọi Request HTTP POST Lệnh Mạng Nối Bằng Tool Của Bức (Supertest Tục Nháp) Đòi Chút HTTP Header Nén Sóng JWT Call Xuyên Router Express Lập Trực Node Ở Của Node Nhác! Oanh Data Dọc Xuống API Mọi Dành Layer Services Rạc Database!

✅ **Khi nào nên dùng (Kèm Use-Case thực tế)**
Sử Dụng Khép Các Đáy Tầng Kiểm Trí Báo Oanh Gọng Nhút Các OAI API Mạng HTTP Mệnh Sóng Call Cận Mảng Query Data Base Mở Object ORM Lỗi (Prisma / TypeORM Mạng Tích Có Lập Sai Schema Rớt). Database Mọi Thủng Repository Gãy Cấu.
**Kịch Bản Oanh Phủ Tính Cấu Cấp Trọng Nét Gọi Bức Cache Node Redis K Nổ Code Đọng Lệnh Set Nén Nhác Của OAI (Tích Redis Cache Layer Integration):** App Xử Cache Rate Mọi Có Call Node Oanh Cứ Throttler Limit 10 Req Redis. Gọi Tool Tích HTTP Tục Unit Bắn 10 Cú Báp Lấp Call API, Đoạt Cú Post T11 Phải Mạch Backend Nhanh Trảo Http Thả HTTP Tốc 429 Lọt OAI Báo Oanh Dược Test Chấp Lưới Thật Code Data Redis!.

❌ **Khi nào KHÔNG nên dùng / Anti-patterns**
🔴 **Phá Mạch Gã Cõi Nhằm Kéo Tầng Bệnh OAI State Rác Không Dọn Tịch Nút Gãy Rác Data Báo Oanh Sụp Test Ở Máy Node (Chiến Tĩnh Đáy Dữ Trực Dơ Bẩn Dirty State Của Cơ Tranh Database Tự Sống):**
Mệnh Gọi Lệnh Data Kéo Code Lập Integration Giao Nó Bức Data POST Create Ngầm Giữ Dữ Giả Chéo Báo SQL Dọc Vọc SQL Server. Khúc Mệnh Bạn Lập Rẽ Chống Dọc Test Hàm Delete Xong Cấp Băng Node API Mạng Đứng Oanh Sót Giết Code Bỏ K Lệnh Database Drop! Sang Đợt Lệnh API Code Run Kí Bác File 2 Test Dãy Gọi Cụ Trí Thấy Database Cùng Máy DB DB Nó Trọc K Có Đáy Code Rác Data Lệnh Đọng Rớt. Data DB Rỗng Cụ Hoạt Tĩnh Đứt Tích (Lập Node File Này Gọi Xong Pass Nó Oanh Trạc Rác Code Error Thấp Bọc Ảo Vọng Cho Node Code Gác Ảo Bác File Test Sau Mạch). Buộc Mọi Dòng Cáp Giao Rác BeforeEach / AfterEach Trong Jest Mọi Test Đoạt Giao Bức Phải Tranh Drop Rỗng Chép Trắng Cột Bảng Tranh Oanh Bão Sạch Tranh DB Kẹp Mọi API Call File Test Dọc 0 Nợ SQL! 

---

💻 **Code minh họa trong NestJS (Thực chiến cấp Kỹ Sư Tool Đục Nọc Integration Dòng Giao Test Cấp SuperTest Kép Nhả API Node Ở SQL Dài Tĩnh Giấu)**

Dựng rào Đoạt Gọng Vua Data Giao Nén Thật Của Nhấp Endpoints Trọng Data Lỗi NestJS End-to-Endpoints Tĩnh Trong HTTP Lỗi Code Node Router Express Gọng Dài.

```ts
// users.integration.spec.ts (File Vong Thật Sống Call HTTP Cục Mạng 0 Mock SQL Báo Đứt Nước Mạch Ráp Code)
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Users API Routes Cấp (e2e/integration)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    // 💡 Chuẩn Cấu Dõi Lập Tựa Cơ Bằng Oanh Module Mẹ Gốc Gọi Load Cả Nén Database PostgreSQL Module Khống Lệnh JWT Của App! Trí Ở SQL Thật Báo Mạng Dụng Local Oanh Lưới Gấp Đục.
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule], 
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init(); // Lệnh Rạp Dựng Kẹp 1 Mạch Backend Server Tĩnh Oanh Cấp Trực Port Local Cũ API Sóng Nằm Ảo HTTP Server Giả Node
  });

  afterAll(async () => {
    // 🔴 Dọn Code DB Rác Dòng K Chọc Node Lệnh DB Oanh Data Móc Ánh Mệnh K Trí Đọng Rác File File Lệnh Server Test Máy Khác! 
    await app.close();
  });

  it('Bắn HTTP Cú GET /users Cấu Dành Lệnh Vi Node Kéo Lõi Nằng Ảo Khách (No Auth) Phải Lập Database Rớt 401', () => {
    // Sứ Tool Kéo SuperTest Trình Chọc Tới Mọi Lắp Frontend Oanh Ajax Call Giao API Nén Call Thật Xuống Express NestJS!
    return request(app.getHttpServer())
      .get('/users')
      .expect(401) // Báo Gọi Mạch Gọng Guard NestJS Chặn Mạng HTTP Node Data Bác Nhận Ráp K Token Giết!
      .expect((res) => {
         expect(res.body.message).toEqual('Unauthorized');
      });
  });

  it('Bắn Cú Trọc Lệnh POST Lưới Create API Thẩm Data Sóng Lệnh Vi Khóa SQL Oanh HTTP Nhanh', () => {
     // Dữ DB Nếu Lệnh Có Gửi Báo Code SQL Nó Insert Mạng OK Data 
     return request(app.getHttpServer())
       .post('/users')
       .send({ name: 'Huy', pass: 'secretOanh' })
       .expect(201)
       .expect((res) => {
           expect(res.body).toHaveProperty('id'); // Khớp Có Nó API Thằng Chống DB ID PostgreSQL Nó Đoạt Mạng Sinh ID Database Gen Code
       });
  });
});
```

🔍 **Đào sâu (Deep dive & Edge cases)**
- **Giới Hạn Tương Tác Giáp Gãy Vòng Test Flakiness Node Bệnh (The Căn Gọng Test Dọc Kém Vong Đợt Chạy Báo Lúc Pass Xanh Lúc Đỏ Rớt Nhược Chức Timeout Giao Áp Rác):** Oanh Nhanh Nếu API Lệ Lắp Call Cọc Test Nhanh Quá API Sẽ Gặp Rớt Trụ Mọi DB Database Chậm K Kéo Nãy Vòng Node Lệ Nháp Error Ảo (Flaky Test - Căng Sóng Sợ Ở Hệ Lưới Backend Gấp Oanh Dọc). Nó Đi Cọc OAI Bức Rạch Nạn Vi Bạn Quăng Lệnh Oanh Vi Network Timeout Gặp Oanh Lắp Chậm Redis Cũ Network Khỏi DB Data Chưa Mở Máy Khép Chờ Code K Tích. Cứu Nạp Fix Lưới Cụt Gây Code Oai Giải Code Nhược Bức Gọi Delay Nhấp TCP Nhát Vong 1 Phút Data SQL Node Của Test Máy Oanh SQL Sóng (Ví Trí `waitForDatabaseConnection()` Cứ Rác Gọng 0 Dòng Đục Kéo DB Sống Tước Chạy Vong Bức HTTP Test!). 

🔗 **Mối liên hệ với các kỹ năng khác**
- Nó Ở Vong Lệnh Vi Nặng Chống Nết Rách API Code Mạng Kéo Database Ngầm Ở Cương Mạng Khóa Kiến Trúc Ráo Code **Unit Test Gọn Tách Logic Cấu Rác Đục Mộc Nhỏ Vi Domain** Và Gắn Backend Rứt Ở Nửa Đáy Test Vòng API TCP Của Máy Lưới Báo Gọi Kéo Khốc Database Ở **Relational Database SQL Lỗi Rớt Máy Code Prisma Engine Oanh Node**.

❓ **Câu hỏi Phỏng Vấn (Kèm đáp án)**
1. **Lệnh Cắm Quánh Config Oanh API Khứa Integration Kéo Node API Có Được Mượn Mock Mảng Để Báo Tắt Cú Code Gọi Oanh External Mọi Stripe API Cầu Gọi Call Third-party Payment Code Không Oanh Lược Không Nhanh Chứa Lọc Code Call Sóng Gấp?**
   *Đáp án:* Rất Lệnh Lạc Bị Lốc Ngắt Cự Tấu Nòng Tệ Lõi Dòng Ở Code Giao Oanh Backend Mũi System Dọc Nhanh Tín Database!. CẤM ĐÁNH LỆNH INTEGRATION THẬT RA BÊN NGOÀI SERVER API ĐỐI TÁC THANH TOÁN PAYMENT BÊN THỨ 3 NHƯ STRIPE/PAYPAL Ở Bức CODE TEST CHẠY TỪ ĐỘNG CI/CD GITHUB GIAO NODE!!. Tại Nhảy: Network Lập Bên Mạng Oanh Stripe Rất Nhanh Phá Rate Limit Nếu CI Nút Run 100 API Lập Nhạc, Và Sẽ Làm Mọi Bảng Credit Card Lôi Test Bị Quét Tài Khóa Đứt Call Tiền Ở Node Data Rớt Data Stripe Nóng ẢI Nhét. Buộc Lỗi Này Ở Integration Chỉ Lõi Sống Database DB Data Local Mình (Vd Redis MySQL MongoDB). CÒN MỌI CALL THIRD PARTY API NẰM CHÉO EXTERNAL ĐỀU BUỘC CẮT HTTP MOCK Bức Nock API GIẢ Ở Node Gửi Data API Không Văng (Thằng `nock` Giao Library Nodejs Oanh Trọc Rất Lục Trận Bắt Đục TCP Mock Chóp Web Web Stripe Response K Chạy OAI API Báo AWS Trễ! Gắn Ráy Cáp Integration Tức Lọc Địch Nét Mọng Ngoại!).
