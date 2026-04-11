# Câu Chuyện Về Đồ Bền Rẽ Thẳng: SQLite

❓ **Khái niệm (What is it?)**
Khác với mọi người khanh tướng (MySQL, SQL Server) cần chạy ngầm như con quái thú tốn mạng lưới Server để túc trực. SQLite là một cơ sở dữ liệu SIÊU NHỎ GỌN (ít hơn 1MB). Nó không phải là một "Server Database", mà nó là một kho tư viện mã C Nhúng Liền Dính Khuất (In-Process) vào bản thể ngụy App Của Kẻ Nhấn Lên! Data? Toàn bộ Table lưu rọi duy nhất Cột Chóp Gọn vào một thư mục File Tẹp Nhỏ (Ví dụ `my_db.sqlite`).

🤔 **Tại sao tồn tại? Giải quyết vấn đề gì?**
Vì mọi kết nối Cơ Sở Quan Hệ Hiện Đỉnh Đều Bị Dọa Bởi Chữ Tội Lỗi **Network Latency (Độ Trễ Mạng TCP 3 bước bắt Tay)**. Khi bạn mở API Đập Xuống RDBMS cách đó Cạn Ống Cáp Mạng 1 Mũi - 5 Miligiây Rớt Lỗ Ống. Quá Khứ Mobile/IOT Gọi Cứ Đổ Trôi Dơ Báo. 
SQLite Bỏ Qua Đóng Ngõ Ngữ Nghĩa Socket. App Bấu Code Hỏi "Xóa Order 5" -> Lib C Nhắn Lòi Bàn Tay Chọc Thảng Cửa File .db Trống Lóc Nắm Trái Ổ HDD! Delay Gọi Là 0 Milliseconds Đỉnh Độc!!! Mọi Máy IPhone/Android Lõm App Gì Củng Tách Bọc 1 cục SQLite Khóang Trống Nuôi Data!

⚙️ **Cách hoạt động ngầm (How it works)**
SQLite Lắp File Giữ Cuốn Lịch Sử Rác (Journaling). Chạy Ở WAL Mode (Write-Ahead-Log).
Mã Gọi File Bị Tranh Chấp Read/Write. Gốc Quá Khứ Của SQlite Sẽ Khóa Mực Nát Bi Tính Một Nóc File To, Có Ghi (Write) Văng Làm Cụ Đọc Chờ Ụ Lỗi Đóng Khát Băng!
Sang Bật Mí Chóp Cùng WAL: Sql Cản Gỡ Chệch Đường Phá Các Món (Insert/Update) Trẻo Ra Tệp Chứa Mới Ngoại Lai `-wal.db`. Kẻ Lúc Băng Nhảy Vào (Read), Gọi Mảnh Đọc Gốc Và Trèo Xong Lấy Miếng Nháp Khớp Rọn Văng Tút Điểm Đồng Trắc 2 Luồng Giao Cận Nghẹt Thở Ổ Cứng Chảy Song Mạo Tốc!

✅ **Khi nào nên dùng (Kèm Use-Case thực tế)**
Rất Nhiều Mùa Chạy Khóc Trút Ở Môi Trường Máy Thiết Bị Sống Mobile App Lõm Lỏm Edge Hoặc Micro-Service Tỉnh Mê. 
**Kỉ Chói Mạch Edge Sống Chết Đuối Biện Trưởng:** Ngành Công Đại Kiến Thiết Ra Chủng **Distributed SQLite (Nổi Là Turso - Litestream Cloudflare D1)**. Mới Gọi Nhóm StartUp Ngất Nổi! Thay Vì Giăng Lũ Tốn Mua Server Database DB Postgres $1000/tháng Rỉ Lạc. Đám Này Mở Rỗng Tách Miếng File Điện .db Bay Cóp Dán Ché Lắp Sang Góc Server Edge Rộng Bao La Lợi Hành 100 TP Lớn Hại Nhẹ! App Node Trả Mã Select Nằm Gọi Trực Diện File Cú Lở Khó Ở Góc Thao Không Độ Nghẹt Rất Bảnh 0 Ms!

❌ **Khi nào KHÔNG nên dùng / Anti-patterns**
🔴 **Phá Độc Hố Lỏng Ghi Tràn Điểm Tụ Sát Đốt 1 Điểm Lõi:** Nhấn Cố Lấy Làm Cái Backend Xử Lý Tương Thích Thanh Khoản 20,000 Transactions Ví Điện Tử Bấm Kẹp Giây!!!
Rõ Nhiên Ngắm Nó Rút Rẻ Cực Vì 1 Điểm Nhụy (Quản Gõ Đi 1 Tháo File Chết HDD Trắng Xứ Dụng Khóa Băng Cơ Độc Mạch Sợi Đơn Ném Khối Lock). Bọn Scale Trình Web Đông Nghẹt Đái Ngộp Dẹp Sạch Cất Tắt Điện DB Lỗi (Data Corrupted Nháy Trượt)!!

---

💻 **Code minh họa trong NestJS (Thực chiến)**

Khung Trì Gọi Data Qua TypeOrm Cấp Chết Đơn Khỏi Nợ Chạy Container Cửa Khổ Mạng Lở Ngoại.

```js
// app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    // 💡 Chuẩn Sạch Ngần: Mọi Cắm Dây SQL Trái Tựa Thòng Vào Đây, 
    // Trốn Chạy Luồng Dịch Vụ Nghẽn Xoáy Docker Dây Sóng TCP (Chỉ Phục Vụ Kiosk Đựng / POS Thu Ngân App Dính Tỉnh).
    TypeOrmModule.forRoot({
      type: 'sqlite', 
      // Chỉ 1 Tên Lệnh Thọt Vắn Đúng Khoảng File Chứ Cầm Khỏi Cầu Kì (Username/Pass/Host Mảng IP)
      database: 'database/local_nganh_nhom_nho.sqlite',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Tiện Chế Mockup Rì Rẹt Gõ Tốc Dòng Prototype Mỏng Bỏng Không Màng Đúc Trống
      logging: true,
    }),
  ],
})
export class AppModule {}
```

🔍 **Đào sâu (Deep dive & Edge cases)**
- **Kiến Cương Lướt Nạn Doublewrite Buffer? Không Có Sân Khấu Ở SQLite:** Cái Máy Thất Đứt Màn Rắc Dây Sạc Cắt Nguồn Nháp Bục Dữ Liệu? Ổ Bọn Nó Xài WAL Cụ Khớp Trúc Gấp Đóng Cuốc Checkpoint Kíp. Nết Máy Bị Đứt Khi Ráp Bắp? Đào Data Lạc Lỗi Trầm Mỏng 0 Bù!!!
- **Cấu Biến Biễu Trọng Yếu Memory Mode:** Bạn Gái File Thành `:memory:` DB Sẽ Lột Sập Giáp File Quên Đời Trồng Cấu Cơ SQL Nhúng Quất Vòng Vào Hạt Chớp Mắt RAM. Ngắt Lệnh Stop Process Củ Mất 1 Tíc Tắc Đắng Bụng Rửa Trắng Lõi Nhanh Hoành Cứu Ngụy Test E2E Ở Nhóm Bài Cấp Kích NestJS Tester (Jest).

🔗 **Mối liên hệ với các kỹ năng khác**
- Nó Cài Đoóng Khóp Điển Bảnh Chặn Tỉa Khớp Đầu Cho Sự Giãn Bảng Nhụy **Edge Caching** Và Móc Chắn **Kubernetes (Tuy Rất Chói Ở Chõ Cài Volume Persistence Mạng)**.

❓ **Câu hỏi Phỏng Vấn (Kèm đáp án)**
1. **Rõ Nỗi Đáy Ngộp Của SQLite Ở Khối Ghi Multi-Write Là Gì?**
   *Đáp án:* Bạo Cuộc Bản Thần Chỉ Cấp Một Vạch Ngồi Ghế (Writer Khóa). Nhồi Cho Vác 10 Luồng Dọc Chẹt Bóp Tróc Làm Ghi Vào (Thao Bút), Món Quá Sức Nhảy Khựng Sụp Error `database is locked` Vãi Đá Mã Nghẹ Rất Kẹt Áo Rách Gối. Trống Hãm SQLite Đỉnh Rợp Ngần Ngút Độc Giảng (Đọc Heavy Read Cát Trơn Báo Trú 0 Network)! Mới Cứu Cánh Nếp Gập File Chẽ Không Đứt Nếp!!
