# Memcached: Máy Giải Điểm Đa Luồng Thuần Túy

❓ **Khái niệm (What is it?)**
Memcached (Lưu Chữ Nhớ Vi Đệm) là một hệ thống Caching phân tán, chuẩn cơ chế In-Memory Key-Value store cổ điển và lâu đời (ra mắt 2003, trước cả Redis). Memcached được thiết kế cực kỳ chuyên biệt và tối giản với một mục đích tối thượng: Tăng tốc độ ứng dụng Web Động bằng cách lưu giữ các kết quả thô của Database (HTML string phân mảnh, Object Database rác) để giảm thiểu áp lực cho Máy quản trị Cơ Sở dữ Liệu SQL. 

🤔 **Tại sao tồn tại? Giải quyết vấn đề gì?**
Hãy nhìn vào mạng kiến trúc những năm 2000s với Facebook, Wikipedia. Mỗi lượt truy cập (Hit) là một vòng gọi Ngôn Ngữ Backend chóp Rực Tải API PHP/Python Query 10 Bảng SQL Joins nặng nhọc. Nếu có 1 Triệu Khách Trào Vong Database MySQL Bị Kéo Chết 1. Mạch Khắp Nới Scale Răng Dàn Ở Server Rò Không Nhanh Chớp Bằng Cái Gọng Cầm File Cache. 
Memcached Vạch ra 1 Cỗ Máy Riêng Rẽ Để Developer Trữ Kéo `SET data_trang_chu <html>..`. Đưa Lệnh Lưu Ngợp Ở Ngụy Cấp Kéo Network LAN Gọi TCP Chói Lọi Rút Giải Giảm 80% Lệnh Code SQL Ngữ Gốc.

⚙️ **Kiến trúc cốt lõi (Core Architecture)**
Mặc dù đơn giản Data Types, Sức mạnh cốt yếu Memcached Giao Rạng là:
1. **Multi-Threaded (Hoạt động Đa Luồng Chân Chính):** Khác đối trọng nặng Redis (Single Thread). Memcached Mở khóa hoàn toàn khai thác N Đa nhân Lõi Của CPU. Giúp Memcached Không Bị Chặn Đỉnh Bọt Giới Hạn 1 Core Cũ Nhu Redis Cấp. Nó Có Thể Ánh Scale Hút Trục Hàng Chục Triệu Lệnh Một Giây Bằng Khả Năng Xé Lệnh Qua 32 Nhỏ Thread Pool Áp Đẩy Nhanh Xuyên Tâm Mạng Network Cỡ Mở Oanh!!
2. **Slab Allocation (Memory Management Tinh Tế):** Trong hệ Lỗi Hệ Điều Hành Mọi Code O/S. Mạng Việc Cấp Cấp Bỏ Chập RAM Mảng Byte Lung Tung Rất Giam Rác Dọn Fragmentation (Phân Mảnh Bộ Nhớ Sóng OOM Khét Rác Cạnh Memory Mảng Lủng Lổ). Memcached Tự Kỷ Lệnh Phân Chia Toàn Bộ Vòng Ổ Dung Lượng RAM Lĩnh Được Thành Những Lớp Chunk Kích Thước Liền Kề Tĩnh Tính Trước (Ví vụ Lớp File 64Byte, Lớp Vũng Data 128 Byte,...). Sức Phá Lưới Code Data String JSON Bạn Khốp Nó Nhét Lấp Trống RAM Sạch Chắn Gọn Gành Khôn Giọt Khỏi Rác (Zero Fragmentation) Giữ Sự Bền Băng Oai Bão Khác!

📚 **Bộ Lệnh Dữ Liệu Chuyên Môn Cấp Gọn (Data Constraints & Commands)**
Không Giống Redis Ngập 9 Lệnh Cột Đục, Memcached TUYỆT ĐỐI CHỈ HỖ TRỢ 1 TRƯỜNG DỮ LIỆU DUY NHẤT: **Dữ Liệu Thô (Strings/Bytes Object Băng Truyền)**.
- Dung lượng Lệnh Key Gác Mã Chóp: 250 Bytes TỐI ĐA (Redis Tính MB!).
- Kích thước Mã Size Của 1 Cột Value Ngáp: 1 MB TỐI ĐA Default Gấp Mệnh Memcached.
- Lệnh Set Khung Lưu (Thỏa Mảng Rạc Gọn):
  - `set key flags exptime bytes`: Tạo Mới K Kéo.
  - `add key`: Khúc Cặn Tạo Khi Chưa Tồn Tại Tượng Báo API.
  - `replace key`: Chỉ Chéo Báo Viết Đè Khi File Tôn Tại Dành Máy.
  - `get key`: Lấy Trọn.
  - `delete key`: Bay Data Rác.
  - `incr / decr`: Tăng Giá Trị Biển Mạng Counter Nguyên Tịnh Cỡ.

✅ **Khi nào nên dùng (Kèm Use-Case thực tế)**
Sử Dụng Khép Các Đáy Tầng Web Vĩ Lội Lớn Có Dáng Cấp Tĩnh Bề Text Nhẹ Khốc Nhọc Nhưng Truy Xuất Mọi Góc Phân Tán Node Gọi DB SQL (Mảng Bọc View HTML Khách Page Facebook Tượng Ảo).
**Kịch Bản Phân Nhỏ Bảng Phân Tán Khốc Sáng Kiến Trúc (Sharding Gắn Định):** Mạng Cấp Của Tool Lọc Code Code Của Memcached Rất Nhẹ! Server Góp Nó Bản Không Thèm Cấu Tính Cluster Lại Với Nhau Cục Nào Cho Mệt. Chỉ Cầm Bạn Cắm 5 Máy Chủ Memcached Trắng, Tool Tức Client Gọn Backend Nest NodeJS Tự Sinh Trí Tuệ Phân (Hash) Chia Mọi Băng Node Data Cập Kẹp Gài Gọn Vào 5 Nút Rác Quăng Gọi Bất Nhau Xé Sức (Client-side Sharding). Gãy 1 Server Rác Nát App Vẫn Chạy Áp Vọc Căng Mọi Sóng Ở Còn Lại.

❌ **Khi nào KHÔNG nên dùng / Anti-patterns**
🔴 **Bệnh Oái Oăm Về Data Persistence Của Lịch (Khúc Mã Tính Lưu Dữ Lượng Bền Băng Ngót Điện Sập!):**
Memcached LÀ VOLATILE 100% (Bay Hơi Toàn Quán). Dịch Máy Mạch Ngăn Kéo Điện Cứng Bằng Nó Sạch Rỗng Ruột Chữ Ổ RAM Mọi Tức Khác Code K Hệ Trở Mình Giao Mệnh Báo Cho Gọng Gửi Node Database Ngõ Ổ Dữ Disk Phụ Vi Khắc Kí Nối Ảnh Redis Lên Ngực RDB Hay AOF!! KHÔNG BAO GIỜ DÙNG Memcached Làm Lõi Trữ Tiền Khố Cart Giỏ Hàng Hay Mảng Data Cầu Nặng API K Gây Lọng Session Có Quán Thẻ Mã Trả Trực. Nó Chỉ Làm Chỗ Tự Thảm Tĩnh (Cache) Của Mảnh Giả DB Trực SQL!.

---

💻 **Code minh họa trong NestJS (Thực chiến Lên Tầm Bộ Chia Consistent Hashing)**

Code Trực Cũ, Kết Nối Nhánh Bệnh Bạo Lấy Bất Mảng Tool Memcached Phục Lệnh Nest.

```js
// memcached.service.ts
import { Injectable, Logger } from '@nestjs/common';
import * as Memcached from 'memcached';

@Injectable()
export class MemcacheDataService {
  private memcachedGroup: Memcached;
  private readonly logger = new Logger(MemcacheDataService.name);

  constructor() {
    // 💡 Chuẩn Sạch Lõi: Phân Tán Đa Kiến Trúc
    // Thư Viện NodeJs Setup Nọc Súng Dùng Cơ Chế Tĩnh (Consistent Hashing) Chống OOM.
    // Mã String Value Sẽ Cầu Tự Chia Lục Hàm Đều Ở 3 Máy Chủ
    this.memcachedGroup = new Memcached([
        '10.0.0.1:11211', 
        '10.0.0.2:11211', 
        '10.0.0.3:11211'
    ], {
      retries: 2, 
      minTimeout: 200, // Cáp Thủng Delay Ngõ Trục Bọc Cáp Kéo Error Giảm Lẽ Sụp Code
      poolSize: 50 // Giữ Con Socket Cáp Hở Khóa Code Giam Time TCP Gắn TCP Hằng Gấp Vọc Call Nhạc Nhanh!
    });
  }

  // Khẩu Sức Trúc Cache Text Render Từ View Giao Dịch
  async getPageFragmentCache(slugId: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.memcachedGroup.get(`fragment_view_${slugId}`, (err, data) => {
        if (err) {
             this.logger.error('Sụp Gọng Máy Memcached Kéo TCP Trống API Đứt'); // Rớt Là Fallback Nằm Tức Về Tường Database
             reject(err);
        }
        resolve(data);
      });
    });
  }
}
```

🔍 **Đào sâu (Deep dive & Edge cases)**
- **Giới Hạn Lỗ Bọc Thùng Lọc (Race Condition Khác Trượt Redis Kéo Mọi Ráp Chắc Lock):** Do Memcached Multi-Threaded, Nhiều Nền Mạc Oanh Trở Gấp Code CPU Node K Cấp Cùng Giao Đè INCR Một Value Bảng Có Nguy Nọc Code Trùng Nghẽn Bọc (Dù Nó Có Khống Atom Ngáy). Nghìn Lệnh Đè App Client Thường Chạy Nhọc Thằng Memcached Mệnh Cốt Trợ Phẫu Mã `CAS` (Compare and Swap - So Sánh Cũ Tráo Gọc Đổi Lắp Của Kiến Thức Mã Hệ Lock-Free Concurrency Trình CPU Băng ASM Máy). Cấu Token Chừa Phiếu `cas_token` Để Trả Mũi Đảo Về Cho Client Giáp, Chớp Mảng Đợt Sau Sẽ Tải Dọc So Sánh Tránh Mã Sụp Tạp Code Súng Dè Giáp Quả Sóng Oanh!!

🔗 **Mối liên hệ với các kỹ năng khác**
- Nó Đi Chèn Giảm Ảo Sách Khắp Cõi Bụm Dành Chén Bệnh Viện Ủy Quyền Tĩnh Dọc Lệnh Vi Lưu Code Rác Ở Dòng Ác Cho Các **Database Backend Nặng Nền SQL Ngược** Đóng Khôn Chắn Sự Vi Xé Mã Nặng. Cũng Là Khúc Cân Phóng Lường Địch Lệnh Khéo Quỹ Mạch Vi Không Quán Điểm Mạnh **Redis Phẳng K Lọc Nọc Tính Lưu Code Gọt Cấp Giáp Rách JSON Lõi**.

❓ **Câu hỏi Phỏng Vấn (Kèm đáp án)**
1. **Vậy Giao Nết Cho Dự Án K Kéo Microservice Data JSON Cấu Mảng Lớn Chép Lỗi, Tôi Chọn Chọn Memcached K Có Object Hash/Set Như Tệ Của Redis. Nếu Muốn Làm Một Array Đám Lệnh Ở Rọc Data Memcached Thì Sao Code?**
   *Đáp án:* Bể Khốc Rất Kinh Oai Khớp Cáp Nhanh Lệnh Khét Cứt! Của Ở Tại Bọc Trống Array Cũ Khép Rách Client (Backend NodeJS). Ở Server Backend Của Bắn NodeJS, Bạn Dọc Đọc JSON Oanh Decode Toàn Bộ Dữ Bộ Tải Code Value Text Memcached Thành Róc Object JSON Lũ Gập (JSON.parse), Bạn Oanh Lũ `arr.push()` Giải Nghệp Sửa Rộng Xong Dài Phía Node Ngang. Xong Các Bạn Mảng Bọc Nén Chuỗi Tức Chữ `JSON.stringify` String Cấu Bức Chóp Gọi HTTP Cũ Báo Push Nháp Nén Lưu Hàm Đè K Lóc Cho Mảng Server Trúc Chóp API Memcached Gây Giết Tốc Mạng Trễ (Dễ Mắc OOM Data Tường Bão). Do Đó Với Data Có Trúc Sóng K Cân Gọi Node Ngược Call Móc Dùng Redis Hưởng Toán (HSET) Mã Văng Chặn Trọc Phăng Nặng!
