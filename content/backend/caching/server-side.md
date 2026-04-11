# Server-Side Caching: Giáp Đỡ Cho Hệ Thống Trọng Yếu

> **Mục tiêu:** Sinh viên có thể Cache. Nhưng Senior Backend Engineer phải giải quyết bài toán Invalidation (Kháng mòn Cache). Khi Cache bị cũ (Stale cache), bạn làm sao để đuổi nó đi? Server-Side Caching là lớp rào cản ngăn không cho hàng triệu request đục thủng Database.

## Các Cấp Độ (Tiers) của Cache Phía Server

### 1. In-Memory Cache (Local Cache Phục Vụ Tốc Độ Ánh Sáng)
Cache được găm ngầm trên chính không gian RAM sống của tiến trình App (e.g., Biến Global trong Nodejs/Java, hoặc thư viện node-cache).
* **Nhanh nhất thế giới:** Truy xuất RAM cực đoan chỉ bằng chu kỳ CPU (Vài nanosecond).
* **Bài Toán Cản Trở Phân Tán:** Khi bạn bật 4 Server NodeJS bằng Docker. Server 1 Vừa Sửa Lệnh Sản Phẩm (Set lại biến RAM). Thế nhưng Server 2, 3, 4 RAM của nó ĐIẾC hoàn toàn và vẫn trả data trật lất. (Inconsistent Lỗi).

### 2. Distributed Cache
Lôi cổ bọn Redis / Memcached ra. Độc lập Tự Cường trên hệ lưới.
* Mọi thằng NodeJS App của hệ thống Gọi Cắm đầu vào 1 chùm Redis chung. Data trật tự tập trung nhất quán. Tốc độ qua Mạng Loopback mất chừng 1-2 Miliseconds. Đây là chuẩn mực tối cao.

## Cơ Chế Phá Bỏ Cache Khi Quá Hạn (Eviction Policies) & Invalidation
Cực hình khó nhất trong lập trình Máy tính là Cache Invalidation.

### 1. Phá Dẫn Chuyên Dụng (Eviction Tự Động Giải Cứu Dung Lượng)
Bộ nhớ đắt đỏ, Redis Server 16GB bị nhồi ngập nát data. Nó sẽ vứt Bỏ data đi theo quy luật nào để nạp cái khác vào?
* **LRU (Least Recently Used):** Rác lâu không ai xài vứt đi trước. (Thừa dãi các dự án dùng Cài Đặt này).
* **LFU (Least Frequently Used):** Ít lượt dòm ngó xỏ xiên nhứt vứt trước.
* Tiêu hủy Theo Thời gian gài mìn `TTL (Time To Live)` Hết 60s Chết Mất Mảng. 

### 2. Mô Hình Chọc Vào (Invalidation/Writing Pattern)
Viết vào DB rồi thì làm gỏi thế nào với cục Cache đang bầy nhầy cũ kĩ ở ngoài kia?
* **Write-Through:** Chọc bút Ghi DB chậm chạp 1 phát, thì Ngầm Gọi Xoá Bỏ Update luôn Cache 1 lúc. Cực kì Khớp Dữ Liệu ở Phút chốc. (Nhưng Ghi bị Chậm Đi Rất nhiều).
* **Write-Behind (Write-Back):** Bão Data ập đến 10,000 requests/s. Thợ Lập trình Mưu Đồ đẩy GHI VÀO NGỢP CACHE REDIS trước đã... Redis Ghi Cực Mượt. Tầm chốc lát vài phút sau, HỆ THỐNG Xúi Trợ Lệnh ngầm mang Lấy data gom cục nhả Xuống RDBMS (MySql) cứng cáp sau hưng phấn. Nó là Mạng Cứu Hoả Tốt nhưng ngặt Cúp Điện giữa chừng Cúp cái là Đi Luôn Data Bão Gần Nhất Không có Kịp Xuống Disk.
* **Cache-Aside (Hút Từ Bến Bên Canh):** Quen mui nhứt. Luồng Check: (1) Nhìn Vô Redis. (2) Trống ko Trơn? Thong Cổ Chọc MySQL. Lấy Lên Gởi Về. Kêu gọi Thêm Cú Gởi Xuống Nhồi Vào Cache làm Gương Dễ Xài cho Request Đợt Kế Trước.

Tâm Nhãn Senior: Ở Những Lớp DB Đắt Tiền, Không Xoá Cache Khi Update Đôi khi Văng Trục Cứng Nứt, Trôi Bill Chết Khách!
