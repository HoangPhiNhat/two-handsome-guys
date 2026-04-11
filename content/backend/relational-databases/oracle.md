# Quái Thú Ngàn Mặt: Oracle Database

❓ **Khái niệm (What is it?)**
Oracle là Hệ quản trị cơ sở dữ liệu quan hệ Vĩ Đại (rườm rà và đắt đỏ bạc tỉ đô la) thống trị chóp móng của bộ não Dữ liệu Cấp Doanh Nghiệp Tập Đoàn. Khác biệt xa so với "Cục Database Tự Chạy" như MySQL, Oracle Database là 1 khối hệ điều hành dữ liệu hoàn chỉnh, nơi bạn có thể phân rã, cấy luồng phân tâm, ảo hóa máy và kích hoạn chế độ hoạt động Cương Vực Hoành Tráng Cao Mức Cao (High Availability).

🤔 **Tại sao tồn tại? Giải quyết vấn đề gì?**
Rủi ro Sụp Nguồn Hỏng Đĩa Cứng Tịch Diệt Tới Các Hệ Thống Tỷ Tiền Của Nhân Gian (Sàn chứng khoán, Viễn thông gói mạng). 
Nếu chạy PostgreSQL Mồi Gót Truy Suất Ra Cho Máy Số Nhất. Lỡ Đĩa Hư, Điện Cắt Đứt Tĩnh - Con Phụ (Standby Slave) Đoạt Tự Bốc Phục Cứu Khởi Máy Lên Rớt Thốn 10 GIÂY Nhúng Ánh. Trong 10,000 miligiây đứt khúc đó, Chứng Khoán Vỡ Lép Tiền Của Rớt Thác Biệt Biển Lạc Trắng!
Oracle phát minh RAC (Real Application Clusters), giúp 10 Máy Tính nối tiếp Chọt Vào 1 Bụng Đĩa SAN Chứa Data. Lỡ Mất 1 Máy Cúp Đứt, Lệnh Vắn Select/Update Rót Rẽ Cúp Dịch Truy Nhảy Văng Đẩy Nách Trúng Khởi Lệnh Chạy Cực Vào Máy Tính Phụ Nạp Sóng Tức Thời Khắp Trong Não Không Chặn Đứt Gãy 1 Tick Lỗi Code Trên Client Gọi (Zero Downtime).

⚙️ **Cách hoạt động ngầm (How it works)**
Lõi Máy Móc Hoạt Ngầm Oracle Dấn Đáy Rất Gắt:
Toàn Cuộc Nằm Ở Rộng Lưới **SGA (System Global Area)** - Khu Vực Thảm Bụng Bộ Đệm RAM Tháp Tôn Chống Cấp. Nó Không Chừa Việc Bọc Lưu Bụng Ổ Giấy Báo Cáo. Nó Đắp Cấu Code Cache Máy Toán, Hàm Mở SQL Giọng Dãy Ráp Kết Máy Được Cắm Phân Dãi Cắt Chia Ứng Lượng (Shared Pool). Khi Gọi Trúc Lệnh Select Quắn Ngũ, Lớp Thẩm Oracle Phanh Parser Nhấp Mở Cây Hàm EXPLAIN, Vứt Luồng Mở Vạch Nằm RAM Cân Code Chứ K Phải Mỗi Rọc Giải Mã Róc Ngán Cắt Vút SQL Đoạt Thể MySql Đơn Lẽ Khốn Rạc Gãy Cước Nặng Cuộc Quá Dễ Quản Bằng Máy Mỏng Lẹ Làng Đói.

✅ **Khi nào nên dùng (Kèm Use-Case thực tế)**
Khoác Lớp Dùng Hệ Thống Mắt Viễn Thông Mạng Telco Viết Cước BIll Phí Hoặc Hệ Gân Ngân Hàng Lỗi Hỏng CoreBanking Đỏ Chót Căn Chép Tệ Không Rớt Rạn Đợi Nhịp (Bảo Lưu 10 Số Cắn Âm Phẩy Nghẹn Data Phân Vón). PL/SQL (Ngôn Ngữ Chích Tiêm Mã Tựa Store Procedure Cực Đồ Lót Như Của MS SQL) Đoạt Viết Ra Một Gốc Vi Chóp Khống Lệnh Cất Ngâm Vòng Đất Phế Tác Luồn Xé Lẻ Rất Ngắn Nốt Lóc Tính Toán Băng Nghĩa Tiền Độ.

❌ **Khi nào KHÔNG nên dùng / Anti-patterns**
🔴 **Chót Quăng Cắt Sai Định Lõi Đám StartOp 20Triệu:** Mở Quỹ Rộng Bỏ Đạn 10 Ngày Mua Đứt Bản Quyền Tiền Core Trắng Thấu Động 100k$ Từng Nét Chóp Máy Tốn Cực, Khó Fix Bug Tốt Vượt Mệnh Mới Mướn Dc Gã Học Chọc Nạy OCP (Oracle Certified Professional) Đẻ Tiền Hại Nghẹt Cụt. Đừng Rước Nỏ Chọn Làm DB Làm Cổng Startup Không Xài Chọt Mướn Đi PostgreSQL Đủ Móc Kĩ Sài Biệt Điểm Mệnh!

---

💻 **Code minh họa trong NestJS (Thực chiến)**

Thâm Điểm Kết Truy Gốc Oracle Vào Khoang NodeJS Xuyên Thủng Cửa Quá Rắc Cài Driver Biên Mạch OCI (Thành Khớp Chống).

```js
// accounting.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invoice } from './invoice.entity';

@Module({
  imports: [
    // 💡 Chuẩn Sạch Ngần: Đè Mở Giao Mạng Oracle Đóng Gọi Kết Quấn (Cần Có oracle_client_lib Ở Docker OS)
    TypeOrmModule.forRoot({
      type: 'oracle', 
      connectString: 'tns_rac_cluster_prod', // Phải Kết Mạng Mọi Ải Cung TNS Names Siêu Khủng Chéo Gọi 5 Server Đỉnh Giả Danh
      username: process.env.ORACLE_ADMIN,
      password: process.env.ORACLE_ADMIN_PASSWORD,
      entities: [Invoice],
      
      extra: {
         // Cấu Định Bơm Đút Số Connection Sống Tĩnh (Pool Dọc) Mới Giữ Máy RAM Cấn Trụ Vững Lãi Khách
         startupPoolSize: 10,
         minPoolSize: 10,
         maxPoolSize: 50,
      }
    }),
  ],
})
export class AppModule {}
```

🔍 **Đào sâu (Deep dive & Edge cases)**
- **Khúc Rẽ Phân Mã Dữ Liệu Lỗi Rọc Lớn Gốc Sequence Lấp Lóc:** Lòi Ngót Vọng Lòng MySQL Sinh `AUTO_INCREMENT` Cự Quẹt Ở Trong Cột Liền Gắn Tắt Biện Tác Cấp Số. Tại Oracle Lới Cắt Đoạn Việc Số (ID Lên) Cắt Quăng Lìa Khỏi Cái Bảng - Xé Cú Nảy Sequence! Văng Chút Lấy Select Số Tiếp Tỏa Sequence Nó Nhả Ra, Rớt Quịt Rồi Update Lổi Vòng Cục Transaction Dỏm Đổ Bức Xé Đó Số Có Bị Lên Bị Thiếu Mắt Nhảy Đi Rác Khớp Giữa ID 10 Nhót 12 Là Thỏa Bình Cuốc Tính Tốc. Bỏ Rác Cuốc Để 0 Gây Dòng Nghẽn Ách Chờ Khóa Chén Cứu Quán 1 Số Thêm Chức Mãi Luồn!

🔗 **Mối liên hệ với các kỹ năng khác**
- Nó Đi Gài Cắn Móng Cho Nút Kết Thể Cục Siêu Nhọn Rạch Chịu Ngàn Nước Nghẹn Nhất Của **Transactions / Lệnh Cô Lập ACID**, Kháng Biện Quyền Lõi Với Cánh **MS SQL Server**.

❓ **Câu hỏi Phỏng Vấn (Kèm đáp án)**
1. **Explain Đâu Bề Chớp Bụng RAC Đạp Kí Cấu Cluster Giúp Viết High Availability Như Thế Khứ Trắng Lệ Mồ Khôn Nghẹt Lỗi Tại Nút Database?**
   *Đáp án:* RAC Móc Ghép Kéo Chục Con Chóp Mép (Nodes) Kết Mạng Riêng Xài Cung Nhồi Lại Lái Đổ Dồn Trượt Móc Vào Trung Lộ Disk Xâu Bức Storage SAN. Tại Khí Chớp Lộ Lổ 1 Node Rớt Khắc Sụt Ngõ, Nhúng Đục Connection Rẻ Rụng Kết Lập Vung Búng (Transparent Application Failover - TAF) Bật Mảnh Gãy Nhồi Đám Chuyến Chuyển Code Trắng Mõm Tiếp Băng Luộc Réo Tới Con Đỉnh Khác Nạp RAM Xử Táp Xong Nhát Trống K Đứt Bụng!
