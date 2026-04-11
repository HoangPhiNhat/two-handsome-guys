# Rồng Lữa Mở Nguồn MariaDB

❓ **Khái niệm (What is it?)**
MariaDB là một nhánh ngã ngang (fork) trực tiếp từ bộ mã nguồn lõi của MySQL. Khi tập đoàn khổng lồ Oracle thâu tóm Sun Microsystems (công ty sở hữu MySQL), cộng đồng mã nguồn mở lo sợ MySQL sẽ bị thương mại hóa và đóng mã nguồn. Michael Widenius (nhà sáng lập MySQL gốc) đã quyết định sao chép tách nhánh hệ thống này và đặt tên là MariaDB (Maria là tên con gái thứ hai của ông, tương tự My là con gái đầu). Nó hoàn toàn miễn phí, phát triển vượt bậc và định hình tương lai RDBMS Open-source.

🤔 **Tại sao tồn tại? Giải quyết vấn đề gì?**
MySQL tuy ổn định nhưng vướng cơ chế phát triển chậm chạp thời Oracle nắm quyền, và engine InnoDB gốc gặp rào cản quá lớn khi số lượng kết nối mạng tăng vọt (connection congestion). Đôi khi máy chủ cấu hình Cực Cao vẫn bị chậm vì luồng TCP bóp nghẹt. 
MariaDB ra đời với tôn chỉ "Drop-in Replacement" (Rút máy MySQL ra, cắm MariaDB vào, hệ thống chạy ngay tắp lự mà không cần sửa 1 dòng code Backend). Đồng thời, giải quyết vấn đề bằng **Thread Pool Architecture** xịn xò.

⚙️ **Cách hoạt động ngầm (How it works)**
Sức mạnh huỷ diệt của MariaDB ở mức hệ thống (tương đương MySQL Enterprise tốn tiền) nằm ở **Thread Pool**.
Bình thường, MySQL quy định 1 Connection HTTP Gọi vào = 1 Thread cấp phát RAM độc quyền chờ đợi. Khi 10,000 App kết nối, nó sinh ra 10,000 Threads cày xé CPU (Context Switching - Đổi qua lại liên tục), CPU bị quá tải tới mức đứng máy (100% Load nhưng không xử lý được gì).
MariaDB Thread Pool gom 10,000 connection đó nhét vào Đội Ngũ Gánh Vác 16 Threads Bọc Lót (Theo số lượng Cores). Tới lượt ai lấy Data thì luồn vào xử lý cực nhanh, bỏ tình trạng giẫm đạp lên vòi CPU. Băng thông xuyên thủng tới cúp máy không suy nhuyễn. Lại Kẹp Thêm Engine Aria tối ưu nhóp nháp rác dư tốt hơn.

✅ **Khi nào nên dùng (Kèm Use-Case thực tế)**
Sử dụng làm lựa chọn số một thay thế MySQL ở môi trường Production Big-Tech có tính Đọc Nặng nề (Microservices RDBMS).
**Kịch bản Báo Cáo Siêu Dữ Liệu:** Hệ thống bán hàng gom 500 triệu đơn hàng, bạn muốn Select SUM() phân tích. MySQL InnoDB sẽ chết kẹt với BTree nhả nháp cả bản ghi Cột (Row). Đợi vài tiếng ra kết quả. Với MariaDB, bạn chắp nhánh đúc Engine `ColumnStore` (Lưu chữ Trục Dọc từng Cột nạp SSD cực bảnh). Bạn SUM(price) Nó quét Nhịp Độ Chút Cột Price Mấy Giây Cục Thượng Ra Kết Quả!

❌ **Khi nào KHÔNG nên dùng / Anti-patterns**
🔴 **Méo Tích Hợp Lệ Lệnh:** Trầm tư Ráp PostgreSQL Mãnh Ngữ Đập Nát Chọc Lướt Cho Các Toán Nghập Rác JSONB Nặng Sâu Thủng Rễ (Toán Index GIN rạch mảng R-Tree GIS Bản Đồ Khống Định Dạng Chặt Chẽ Mảng Postgres Đoạn Tuyệt Nát Gấp Gấp Đối Trọng). Chứa Đựng Chậm Rớt Gấp Nữa Thời JSON Thủng Cột.

---

💻 **Code minh họa trong NestJS (Thực chiến)**

MariaDB giao ước nối mạng mượt tựa MySQL, Tối Ưu Tận Đáy Connection Pool Ở NestJs Để Max Dụng Thread Pool!

```js
// database.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      // ✅ Đúng: Thống kê Gốc Trục Database Đỏ Khung (Chuẩn Dõi Trắng Không Thay MySQL)
      type: 'mariadb',
      host: 'maria-cluster.intranet',
      port: 3306,
      username: 'db_admin',
      password: 'super_secret_password',
      database: 'core_sales',
      entities: [Product],
      
      // 💡 Chớp Ngán Điểm Chặn Khóa Thread Pool: Đặt Socket Max Tràn Chứa Ít 
      // Nhưng Không Gian Lưới Khắc Connection Vứt Ra Đừng Gãy Ngõ Để Bọn Thread Khều Luân Gọi 
      extra: {
        connectionLimit: 150,  // Đè Cầu Limit Cho Khỏi Bóp Ách Mạng Dọc
        waitForConnections: true,
        queueLimit: 0 // Cho Ép Client Rớt Vô Hàng Đợi (Queue) Nhụy Mạch
      }
    }),
  ],
})
export class DatabaseModule {}
```

🔍 **Đào sâu (Deep dive & Edge cases)**
- **Kiến Cương Storage Engine (Aria):** Sự Biến Đạt Ổ Lưu Aria Sống Phép Ở Việc Giáp Chống Nạn Crashed Crash-Safe. Văng Điện Gãy Ổ Máu Đất, Mảnh Vút Cache DB Vẫn Hồi Sinh Liền Nhất Quán Vẹn Nguyên Mã, Cấp Nền Ló Quên MyISAM Gốc Nát Gặp Điện Tạch Rớt Mất Chỉ Mục (Corrupted Index).

🔗 **Mối liên hệ với các kỹ năng khác**
- Đối chọi khốc liệt và Thay thế Cục Diên Hoàn Mỹ cho **MySQL**. Không Cân Được Lực Lưu Không Gian Của **PostgreSQL**.

❓ **Câu hỏi Phỏng Vấn (Kèm đáp án)**
1. **Drop-in replacement (Thay thế Tương Đương Lại Xẻ Cửa Nhờ MySQL) Hoạt Động Khía Chỗ Nào?**
   *Đáp án:* Rất Mạnh Mẽ Khóa Ngay Tới Khúc Socket TCP Cột (Port 3306) Lẫn Giao Thức (Protocol Client Protocol Xách Túi Mở Connect Lõi). Nên Cục Drive MySQL Trong NodeJs App Khẳng Bấu Hoàn Toàn Liền Sướt Vô Hệ Maria Dù Rẳng Nó Chả Mấy Chốc Hiểu Là Khác Server Cha Hãng Viết! Điểm Đặc Biệt Đãi Thơm Cho Dev Chết Xập Mũ Lên Gộp DB Chuyển.
