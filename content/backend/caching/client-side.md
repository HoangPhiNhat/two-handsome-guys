# Client-Side Caching (HTTP Headers Caching): Vũ Khí Của Browser Tàng Hình

> **Mục tiêu:** Nhấn chìm chi phí Backend Băng thông về $0 bằng cách tận dụng triệt để Không Gian Lưu Trữ Của Chính Khách Hàng! Lãnh vực Client Side mang trong mình sức mạnh vô tiền khoáng hậu từ những chiếc Header tưởng tẻ nhạt.

## Lỗ Hỏng Hiểu Biết Về Phía Mạng Phác Thảo
Rất nhiều Lập trình Viên thét lệnh đè sấp Đổ Cục Json Vào LocalStorage bằng Tay chân rườm rà của React/Axios để né Gọi Dông Dài Data Lại. Nực Cười! Mọi Browser đều Tích Trữ Cho Bạn Bộ Máy Caching Bậc Nhất Nếu bạn biết Ra Chỉ Thị Còi qua HTTP Headers! Lực này nằm Trọn ở Phía Của Mưu Trí Từ Backend!

## Chỉ Lệnh Huyền Thoại (Cache-Control)

Thứ duy nhất để Ra Lệnh cho Máy Client Trữ Của Đó Chính Là 1 cái Header được đính Cùng Payload về. 
`Cache-Control: public, max-age=3600`
1 tiếng (3600s) sau, Mọi Thao Yêu Cầu Về Cái Link Đó (vd: Chỏ hình .jpg) Trình Duyệt BĂNG ĐẦU Ngóc Đầu Gọi Xoắn Xuống Cạc Ổ Cứng Và Nhã Nét Thẳng Không Cần Đâm Quán Mạng Internet Gọi Cho Backend Bóp nghẽn Nữa.

## Hai Mô Hình Phách Định Bộ Nhớ Nhạy Cảm Nghe Trộm Cắn xé Của Edge Caching

### Lệnh Rắn ETag (Validation Cache)
Giả định Bạn có Cái Bài Viết 100Mb Khách Gọi đi Kêu Mãi. 
* Lần 1: Khách Nới tay Trải gọi. Backend Đưa 100MB xả xối Cùng Đính cái Header Nhẹ hều: `ETag: "hashXoSoNaoDo"`. Trình duyệt Bợ Cả 100Mb Lẫn Con Chữ Etag Lộn ruột Cất Vô Local Cache.
* Lần 2 (Vài ngày sau): Khách Trở lại Bấm xem Báo Bài Đăng Đứa Khóc Nhặt. Browser Bóc lệnh Dặn Khẩn gọi Vào Mạng Chọt Backend: "Tao đang cầm Đồ Hash Củ Khớp mã `If-None-Match: hashXoSoNaoDo`, Bên Mày File Mới Còn Khớp Không Hả DB?" 
👉 Cấp cứu Ngay Khẩn. Backend Khẽ Quẹt MySQL Thấy File Còn Nguyên chả sửa, Thật nhịp Nhàng Tung Ra Response `304 Not Modified` Nặng Chỉ 1 Kilo-byte!!! Bụng Rỗng. Trình Duyệt Thở Phào Lôi 100Mb Từ Trong Kho Trữ Xa Xôi của Dấu Khách Hiện ra. Tốc độ Tiết Băng Thông Cẩu Huyết!

### Cú Tụt Quần Áo Cache-Busting Mưu Mẹo (Immutable Versioning)

Lệnh trên Khổ nỗi Có Thằng Browser Xài Liều `max-age=31536000` (Cache Luôn 1 Năm ko theng Hỏi). Frontend Update Code Cả Ngày Làm Sao Chữa Thay Đổi Cái Chữ Dưới Màn hình Văng Lõi. Lệnh Vàng Chở Giải Đắng Mang Cấu Khía Cái Chuỗi Gọi Chế Tên Bẻ Đùi!
Cứ Mỗi lần Có Chỉnh CSS / JS Gấp gút. Tool Địch Biên Dịch React Sẽ Build Cứ Cái Chuổi Bảnh Hash Dịch Đổi Đuôi: `main.2ab14sd.js` Thành `main.8g7s1f.js`. Tự khắc Việc Đổi Link (URL khác Biệt Cấp Dị) Máy Tính Khách Không Ngờ Sụp Vở Bộ Nhớ Tải Bản Mới Coóng, Bản Củ Vứt Lũ Lọt Quá Hạn Phế Cục.

Nắm Nắn Gói HTTP Cache là thứ Đóng Khuôn Chở Toạt Vị Thể Senior Xứ Người!
