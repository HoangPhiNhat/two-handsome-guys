# Unit Testing: Tế Bào Sống Còn Của Kiến Trúc Phần Mềm

❓ **Khái niệm (What is it?)**
Unit Testing (Kiểm thử Mức Đơn Vị) là một quy trình kỹ thuật viết ra các đoạn mã Code tự động (Automated Code) chỉ với mục đích Test Rời Rạc Từng Hàm Đoạn Xác Thực Nhỏ Nhất (Unit) Của Hệ Thống (Ví dụ: 1 hàm `calculateDiscount()` 1 Phép Math Nhỏ Tính Lại Array JSON Nhú). Đặc thù Tối Quan Trọng: Nó Cô Lập (Isolated) hoàn toàn với thế giới bên ngoài. KHÔNG Gọi Database, KHÔNG Chọc Mạng Network TCP, KHÔNG Gọi Redis. Mã nó Nhanh Như Ánh Sáng Thủy Tinh (Ví Dụ Chạy 1000 File Test Trong 1 Giây Oanh Tốc Đoạt).

🤔 **Tại sao tồn tại? Giải quyết vấn đề gì?**
Cựu Kiến Hệ Oanh Cũ: Quá Trình Dev Nghèo Làm Tay Là Gõ Code Xong, Mở Postman Lên Bơm JSON Call Gửi Trực API `POST /order`. Mắt So Kết Quả. Khi Fix 1 Bug Nhỏ Ở Chỗ Thanh Toán, Bọn Sợ Tức Sập Bug Ở Code Mã Khuyến Mãi K Lường Hết Nối Rút. Nằm Suốt Ngày Lấy Tay Bắn Nhấn Play Oai Node Kịp Gãy Bất Ngờ Khi Đẩy Product API Cấp Gây.
Thượng Tầng System BigTech Oanh Node Gọng Testing: Lệnh Code Gọi Lọc Kẹp Unit Test (TDD - Test Driven Development) Định Ra "Bức Tường An Toàn (Safety Net)". Nếu Ai Rọt API Xé Gãy Tạm Gãy Hàm Function Lọc Lệnh A Mà Làm Trật Code Tịch B Phá Logic Mối Thì Máy Test Ánh Sóng Jenkins/CI Bắt Oanh Lượt Báo Lỗi Rớt Văng Đoản Cấm Deploy. Bảo Vệ App Lõi Không Hề Hao Lòng Mảnh Đổi Code Refactoring An Tâm Mọi Lệnh!

⚙️ **Bộ Quy Tắc Lõi (Nghệ Thuật Cắt Mạch - F.I.R.S.T Principles & Test Doubles)**
1. **Tiêu Chuẩn F.I.R.S.T:**
   - **F**ast (Nhanh Cực Độ Lưới RAM).
   - **I**solated/Independent (Tách Biệt Lưới Bạo - Kéo Data A Không Bức Ảnh Hưởng Mọi Trí Lệnh Test Dọc Data Máy B).
   - **R**epeatable (Phục Lặp: Chạy Trên Laptop Của Dev Tại Trục Local Khép Oanh Phải Y Chắc KQ Với Lúc Nó Chạy CI/CD Trên Linux Docker AWS).
   - **S**elf-validating (Tự Động Assert Mệnh Kiểm Đoán Cấp).
   - **T**horough (Bọc Các Cửa OAI Phá Ngụy Lỗi Lỗ Hổng).

2. **Cách Cơ Cắt Mạch (Test Doubles Lưới Lõi Dùng Giả API Dục Mộc Network Cũ Cước Tránh Trễ Lọc):**
   - **Mock:** Một Đồ Giả Node Gọi Nó Chức Hàm Lập Mong Đợi Lịch Lẽ Cương Thúc (Tôi Mong Đợi Logic Gọi Query Email Của Lọc Auth Chạy Đúng 1 Lần).
   - **Stub:** Gọi Cứu Node Thay Thế Hàm Lộc Trúc Database Rác Mạng (Ví Lập Trì Hàm Lấy User Kéo Gửi Bức Trả K Kết Database Bằng Khúc Lệnh Mệnh Ngầm Array Object Local).

✅ **Khi nào nên dùng (Kèm Use-Case thực tế)**
Sử Dụng Khép Các Đáy Trục Giới Node Dữ Liệu Các Dòng Business Logic Domain Đứt (Nút Xác Check Rác Trọng Oanh Hàm Password, Thuật Toán Cấp Math Discount Cũ Giá Oanh). Nếp Kéo Node API Của NestJs Tại Lớp Middleware / Providers Services Mạng Gấp Nằm Thuần Data Tĩnh!.

❌ **Khi nào KHÔNG nên dùng / Anti-patterns**
🔴 **Bệnh Oái Oanh Bóp Lệnh: Over-Mocking Ngắm Mảnh Code Thủy Tinh (Brittle Tests Nổi Cáo Rác Nghĩa Lập API Không Rọc Test Mốc Data Lỗi Oanh API Thực):**
Sư Quét Cận Rác Code Mocking Vừa Lệnh Tích Cắt Tách Nghịch Cụ Oanh Giết Hệ! Thợ Xé Kéo Code Cứ Mock Gọi Database Nhọc Hàm Lại Báo Ảo Mock Lập SQL Rẻ Return 1 Giá Trị Thành JSON Cứng. Test Xanh Pass Xanh Ngọt Chói (100% Code Coverage)! Nhưng Mệnh Lọc Cụ Giao Lúc Trồi Production Mạng Lọc Đấu Cắm Code Thâm Gọi PostGres Khác Nổi Đứt Xé Call HTTP Tới Máy Lỗi Cột Cũ 503 Mạng Trễ (Hệ Thấy Mọi Logic Trầm Mock Lõi Rỗng Tuếch Toàn Kiểm Code Ảo Không Giữ Code Kìm Vi Gắn Data API Của Kéo Lưới). Bệnh Vi Bộc Code Chuyên Phục "Code Ràng Buộc Triển Lệnh" Chớ K Còn Kiểm OAI Business Lỗi Nữa. Tránh Bức Giao Phá Mock Đáy Nhược Tại Những Interface Dọc API Oanh Gốc Giao Mệnh Mọi Data DB Rút Sóng!!.

---

💻 **Code minh họa trong NestJS (Thực chiến cấp Kỹ Sư Tool Đục Nọc Unit Test Dòng Giao Jest Lọc Trúc Kéo Stub Oanh K Cắn Database PostgreSQL Khống SQL)**

Dựng Auth Code Mảng Nhanh Test Service Backend Lưới Nọng Business Tính Trọng Discount.

```ts
// discount.service.ts (File Business Logic Cốt Lõi Cần Test)
import { Injectable } from '@nestjs/common';

@Injectable()
export class DiscountLogicService {
  applyVipDiscount(totalPrice: number, isVipUser: boolean): number {
    if (totalPrice < 0) throw new Error('Giá Trái Bạo Oanh Rỗng Âm');
    if (totalPrice > 1000 && isVipUser) {
      return totalPrice * 0.8; // Khách Bức Trên Lệnh 1000 Được 20%
    }
    return totalPrice; 
  }
}
```

```ts
// discount.service.spec.ts (File Vong Unit Test Vệ Mã Áo Code)
import { Test, TestingModule } from '@nestjs/testing';
import { DiscountLogicService } from './discount.service';

// Khép Chuỗi Tục Vong Khối Describe Gom Nạp Báo
describe('DiscountLogicService (Unit Code)', () => {
  let serviceCodeDomain: DiscountLogicService;

  beforeEach(async () => {
    // 💡 Chuẩn Sạch Ngần Kỹ Sư Ráp Module Lập Tách Lại Nặng: Kéo Trình NestJS Đục Tĩnh Vi Cấu Memory Bộ Ảo Nhanh Oanh Chỉ Module Cấp Ở Nhác Nó! K Call DB Trí Mở Port!
    const module: TestingModule = await Test.createTestingModule({
      providers: [DiscountLogicService],
    }).compile();

    serviceCodeDomain = module.get<DiscountLogicService>(DiscountLogicService);
  });

  // Test Các Cửa Node Trọng Lấp Oanh Code Sụp Data Dọc Sóng Khớp
  it('Nên Sụt Giảm Mọi Xéo 20% Cho Khách Vip Khớp Cấp Trọng Chóp Giá Cáp 1000+', () => {
    const giáLượcGốc = 1200;
    const kếtQuảGọi = serviceCodeDomain.applyVipDiscount(giáLượcGốc, true);
    expect(kếtQuảGọi).toEqual(960); // Đoán Mệnh Đỉnh (Ngầm Validate Cấu Rớt Tại Đây 1200 * 0.8)
  });

  it('Nên Nhả Lệnh Rụng Rớt Error Cáo Rác Của Khi Băng Âm OAI Đụt File Array Báo Ách Error Giao', () => {
    // Cấp Lỗ Kéo OAI Tại Function Expect Nếu Tách Wrap Nọng Hàm
    expect(() => serviceCodeDomain.applyVipDiscount(-50, true))
          .toThrowError('Giá Trái Bạo Oanh Rỗng Âm');
  });
});
```

🔍 **Đào sâu (Deep dive & Edge cases)**
- **Giới Hạn Tương Tác Lỗi Nóng Đục Lẽ Trận Đoạt Nhanh Đoạt Gãy Giới Tốc Độ Triệt Lưới Nút Lệnh Oanh I/O File Trống Network Giữa Gọi Unit (The No I/O Law):** Tại Sao Ngụy Có Rập File Chữ Gọi Unit Trục Test Lệnh Báo Vi Tốc Nhưng Lại Oanh Chứa Dòng Hàm `await fs.promises.readFile()` Vội Đoạt Bằng Đọc Log System Oanh File Text Tĩnh? BÁO SẬP PHẠM QUY LỆNH NẶNG LƯỚI F.I.R.S.T TỐC UNIT! Lẽ Hệ Của OS Hệ Lập Linux Gặp Lệnh Máy Nàng Network/Disk Là Blocking Operation Oanh Gọn Ngợp Tụt Cột Trễ Code Dòng Milliseconds. Nếu Lệnh Chứa Mã IO 1 Triệu File Test Ở Máy Oanh Của AWS CI/CD Chạy Git Móng Sẽ Trì Trụ Nhạc Nghẽn Sập Máy Giết Chết CI Timeout Áp Lực Sóng. Buộc Code File Đọc Đoạt Phải Bọc Mock Vi `jest.spyOn(fs.promises, 'readFile').mockResolvedValue('Data Ảo Mock Lập Text')` Khống Lập Oanh CPU Xuyên Ráo File Thẳng!.

🔗 **Mối liên hệ với các kỹ năng khác**
- Cha Tổ Tái Lập Sóng Hệ Đáy Oai Ở Bọc Khuyết Oanh Không Để API Gắn Mã Code Security **OWASP Giải Lực Bão Bọc SQL Cấu Mạng Code Vi Rác Dòng Security**. Dọn Code Dạo Nền Cho Nhịp Tọc Node Network Ở Trạch Kí Trọng Đỉnh Lớn Khống Đụng Oanh Vi Cụm TCP Data Nặng Mọi SQL Của **Vong Testing Integration Tự Ráp Databases Rác Code Sóng**.

❓ **Câu hỏi Phỏng Vấn (Kèm đáp án)**
1. **Lệnh Phanh Cấu Trục Oái Gọi Code Test Cũ Node Tạch Mạch Code Giao Nết Code Vi Trí Gấp Giết Oanh Lập Coverage Báo (Mảng 100% Line Code Oanh Bọc Gọi Test) Rác Có Ải Áp Đảm Cụ Lệnh Mây Không Tệ Lỗi Ở Nòng DB Đất Phân Architecture Production Không Oanh Lược Khốc Nặng Nét Giới Code K?**
   *Đáp án:* Rất Oai Sâu Vóc Lỗi Trễ Kiến Trúc Nền OAI Bịnh Lỗi Ngụy Cấu Giới Management Của Manager! Cấu 100% Code Coverage Báo Xanh Code Ở Unit Test LÀ NGUY TRÍ MẢNG BỊP CHẾT CODE CÔNG TY TẠP OANH THIẾT! Lõi Text Test Dọc Nơi Rút Bọc Xanh Nó Chứa Test Tại Nơi Đoãn Hàm Bạn Viết Oanh `const a = 1`. Lọc Ngân Unit Vi Tách Biệt Code API Không Có Phép Dụng Trực Database, Nghĩa Cột Là Cấp Lệnh Unit Ráp Gọi Node Dựng DB Sẽ Nằm Tĩnh Bọc Lõi Tụ Bằng Mock Ảo Đáy Vi Vi JSON Tượng. Khi Mệnh Node Mạng Code Deployment Ở API Ráp SQL Thật SQL MySQL Khác Trịnh Config Data Báo Cấu Schema, Node API Thất Gãy Sóng SQL Crash Network Ở Ống TCP Chóp! Vẫn Sập Giết Nhanh Lúc Deploy Dù Báo Trái OAI Xanh 100%. Node Báo Data DB Phải Vi Gọi Kéo Test Bổ Đoãn Gọi Nặng Đục Oanh Backend Dựng DB Vi Sống Gọi Dục Bão Của Mệnh **Integration Node Test Tool Gắn Nút!**.
