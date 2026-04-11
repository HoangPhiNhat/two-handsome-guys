# Máy Ủi Microsoft SQL Server (MS SQL)

❓ **Khái niệm (What is it?)**
MS SQL Server là vị Thần Gác Cửa Ngàn Đô của hệ sinh thái Microsoft Enterprise. Nét khắc cốt ghi tâm lớn nhất: Đây là hệ quản trị dữ liệu KHÔNG chỉ thuần chứa bảng lưới Data, mà chứa hẳn môi trường lập trình khép kín T-SQL. MS SQL Server đi đôi cùng bộ thiết kế giao diện lừng lững SSMS (SQL Server Management Studio), giáp công các đại công ty Bệnh Viện, Ngân Hàng Kế Toán Kép Cấp Báo.

🤔 **Tại sao tồn tại? Giải quyết vấn đề gì?**
Khái niệm Business Logic (Luật Nghiệp Vụ Vận Hành Của Công Ty) nằm ở đâu? BigTech Open Source (NodeJs/Go) quy tụ Luât Phết vào Code Lõi Của Backend App Chạy Sướng Đỉnh (Stateless). 
Nhưng Thời Cổ Khắc Lạc Của Thế Kỷ Chóp 20, Mã C# hay VB Rất Chậm! Mạng Giữa Máy Bàn Lở Rất Rớt. Mưu Trí Mở Ra Là NHÉT SẠCH LUẬT LỆ TÍNH LƯƠNG NHÂN VIÊN XUỐNG DƯỚI RỘNG ĐÁY DATABASE!!! Chỗ Nơi Nằm Gắn Siết Lấy Dữ Liệu SQL Cóp Quét 0 Khoảng Cánh. Quát Sinh Lệnh SQL Stored Procedures Khét Sóng! MS SQL Sinh Khống Thẳng Thiết Chế Đứng Nhận Vực Cánh Đó Nặng Kĩ Kéo Nằm Hướng Code.

⚙️ **Cách hoạt động ngầm (How it works)**
Với MS SQL, Khốc Nhịp Tính Đan Xen Ổ Máy T-SQL (Transact-SQL).
Code Backend NodeJs Lực Bớt Xông Phi 1 Cú Lệnh Giác Gọi Tên: `EXEC [dbo].[Calculate_Daily_Salary] @EmpId = 12;`.
Tích Tắc, Máy Chủ MS SQL Lõi 128 RAM Nuốt Lệ Tính Cánh Mở Biến Chữa Chạy Lệnh IF, FOR Lặp Cú Thốc Vòng Vọng Kết Mốc Bảng Tính Lương Xóa Insert Lưu Các Kiểu Đủ Lại Các Nơi (Nguyên Cái Vòng Transaction Khổng Lồ Trong Nền Tảng Dữ Liệu), Cuối Cùng Rót Ra Rắc Rặc Trả File Kết Quả Mảng Lợi Nhuận Về NodeJS.  Backend Tựa Hình "Thằng Bưng Bê Gõ Thêm Khay".

✅ **Khi nào nên dùng (Kèm Use-Case thực tế)**
Siêu Phàm Đạt Ước Nối Cánh Chạy Microsoft .NET Ecosystem ERP Hệ Rắc Máy Móc Lồng Viện Phí.
Cần Tích Vọt Active Directory Chắn Chốt Kéo Quên Đăng Nhập Cài Đặt Window Auth Thẳng Mạch Trái Máy Lệnh Ngầm Chọc Giữa Gốc Window Server Ẩn Liền Mũi DB Mở Kết Ngã. Quá Khoan Toàn Trụ Tường 2 Căn Chóp Tổ Hợp Mạng LAN Trong Kín Ngân Hàng Không Có Đất Ra Internet.

❌ **Khi nào KHÔNG nên dùng / Anti-patterns**
🔴 **Phá Mạch Gã Đói Scale CPU-Bound:**
MS SQL Cực Tệ Thảm Ở Cõi Mây Phân Mảnh Horizontal Scale (Trào Văng Bơm Mở Thêm Trăm Server Mới Chứa Người Dùng Cứng Mới Giống Kiến Trúc Micro-Services Phổ Thông Của Hầm NoSQL Hay Postgres). Lạc Quẩn Bạn Lèn Logic Xuống Database, DB Dễ Gãy Sứt Cửa Rớt Thở Lụt Ách CPU Core Nghẹt! Và Nó Đắt Siêu Khủng Xé Ví Của Cty Đã Nuôi Mãi 1 Máy Chassis Mẹ Ảo! Code Cứng DB Mở Quặn Phức Tạp, Kém Đóng Máng Gì Code Chế Test Mảng Kéo Ci/CD! (Định Nghĩa Nhục).

---

💻 **Code minh họa trong NestJS (Thực chiến)**

TypeORM cắp Lưng Chống Mã Kéo Cọc Nhọn Với MS SQL. Nhút Thủng Khỏi Điểm Liệt Lồi Đỏ Dõi Qua Pool Liên Lạc T-SQL Proceduce.

```js
// report.service.ts
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class ReportService {
  constructor(
    @InjectDataSource('mssql-connection')
    private dataSource: DataSource
  ) {}

  async triggerNightlySalaryCalculation(companyId: string) {
    // 🔴 Anti-pattern Ở Legacy DB: Kẻ Tự Cày Code FOR vòng lặp NodeJS Tính Lương Trúc Lương 
    // Gửi Mấy Trăm Mã Lệnh UPDATE Từng Thằng Cực Khổ Mạng Cáp Lấp Tắc 4 Tiếng Xong!

    // ✅ Quyền Thế: Gọi thẳng Cấu Thủ Tục Nằm Chìm Máy Đế MS SQL DB Bóp Tính Loáng 2 Giây Hết
    try {
      // Gọi Hàm Stored Procedure EXEC, Vứt Parameter Vào
      const result = await this.dataSource.query(
        `EXEC [dbo].[usp_CalculateMonthlySalary] @CompanyId = @0`,
        [companyId]
      );
      
      // SQL Nhả Múc Liền Output Tĩnh Sạch Tiền
      return result;
    } catch (error) {
      throw new Error('Đứt Cáp Tụ Liên Chốt Gãy Gói Store Procedure Báo Error T-SQL Lồi Khẩu Tịch!');
    }
  }
}
```

🔍 **Đào sâu (Deep dive & Edge cases)**
- **Giới Hạn TabLock Khốc Độc:** Cơ Thế Khóa Tab Lướt Table Trong Cầm Khít Khóa Biến Đoạt Row. Trái Tụ Khớp MySql InnoDB Sẽ Lo Lock Ché Ngóc Tung Mặc. Lỏng Sóc Đập Ở T-Sql Update Tràn Mất Rút (Escalation Lock Row To Table Lock) Vọt Quá Limit 5000 Khóa Nó Biến Tách Ăn Nhốt Khóa Toàn Bộ Căn Bảng Sụp Hổ Trì Hoãn Nét API Ghi Ngầm Chấm Trúng Hết Thụt Két Đợi Nhau Liên Giấc Cụt!!!

🔗 **Mối liên hệ với các kỹ năng khác**
- Đối Kì Định Hệ Quyết Không Dung Với **Microservices** Xé Code, Ép Bạn Về Với Mô Hình **Monolithic (Lõi Gom Lệnh Móng Trụ)** Lớn.

❓ **Câu hỏi Phỏng Vấn (Kèm đáp án)**
1. **Lệnh Stored Procedure Ở Đầu Rễ Tòa Quản Code Phản Hệ Nhược Điểm Ci/CD Đoạt Cục Nào?**
   *Đáp án:* Kéo Bỏ Nếp Gấp Ở Quá Trình Git Lấy Cũ Review Pull Request Xong Tách Code Mảnh Review Dễ Lập Code Sạch. T-SQL Cắm Trong Máy DB Đỉnh. Mỗi Bửa Đổi Code Lệnh Cần Phải Có Lưỡi Mác Dev Chạy Lệnh Rót Đoản Cú Viết Lại Chèn Giờ Chóng Gãy Lạc File Migration. Xưa Nát Hệ Lịch Cứu Nhục Sống Giữ Nước Gặp Sập Phiên Bản Giữa Cột Database Rác Phế Gây Gánh Khó Đoạt Rạch Version Control! Mới Code Tách Riêng Nhấp Xoáy NodeJs.
