# Khảm Sâu Vào HTTP (What is HTTP?)

❓ **Khái niệm (What is it?)**
HTTP (Hypertext Transfer Protocol) là "bộ ngôn ngữ mẹ đẻ" của Application Layer dùng để trao đổi tài liệu trên web (HTML, Hình ảnh, JSON). Nó là các quy tắc ứng xử giữa Người Khách (Trình Duyệt/Mobile) và Phục Vụ (Server Backend) thông qua dạng gửi/nhận chữ văn bản thô ráp.

🤔 **Tại sao tồn tại? Giải quyết vấn đề gì?**
Trước năm 1990, FTP hay Telnet quá phiền toán để xài. Cần cấp tên đăng nhập, đợi máy móc xác thủ tục rườm rà. Internet cần một phương thức Siêu Nhanh, Đơn Giản, Chạm Là Đọc (Click-and-Read) dựa trên siêu liên kết (Hyperlinks). HTTP được đẻ ra với thiết kế Stateless (Vô Biểu Trạng), giải quyết độ nặng nhọc: Vừa gọi một cái tải xong file là tự thắt ống xả, không nhớ nhung ai hết.

⚙️ **Cách hoạt động ngầm (How it works)**
Là một khối Text chuẩn cấu trúc chạy chồng dính trên đường ray TCP.
1. Khách hàng mở TCP Port 80 (hoặc 443 SSL).
2. Gửi Cấu trúc Dòng Lệnh `GET /users HTTP/1.1`. Kèm nguyên mảng **Headers** chứa thông tin mật (`Cookie`, định dạng `Accept`).
3. Server tiêu hóa dòng text đó, lôi Data JSON ra và Bồi Bắn ngược về Client 1 mã Status Code (`200 OK`) kèm theo Headers của Server.
Điểm Mấu Chốt: Kể từ thời bản nâng cấp **HTTP/1.1**, cơ chế đai lưng `Keep-Alive` mở ra. Cướp TCP xong, dốc API về, xong Cửa Ống Cáp Mạng Vẫn Được Giữ Mở Thêm Trống Không Chút Thời gian (Keep Alive) để đở phí sức Bắt Tay Lại nếu Khách Tái Phát Yêu Cầu Gì Đó Ở Sau Nhanh Gọn.

✅ **Khi nào nên dùng (Kèm Use-Case thực tế)**
Sử dụng HTTP (cốt lõi là REST) làm Phương Thức Giao Ước Mặc Định Cho Mọi Khách Cần Xin Lấy - Ghi Database - Trả Về.
**Trị điểm:** Module Admin muốn Lấy Danh Sách Tồn Kho Vật Lưu (Inventory). 
Dùng HTTP `GET /api/inventory`. Cặp gọi đáp hoàn toàn độc lập, Máy chủ NodeJS 1 mệt, Nhảy rớt sang Máy 2 chạy cực kỳ Dễ Dàng do Server không cần Chừa RAM nhớ Cột Cờ. (Scale theo ngang vô hạn định!).

❌ **Khi nào KHÔNG nên dùng / Anti-patterns**
🔴 **Lỗi Hệ Phái:** Bắt HTTP Lặp Liên Tục Để Lấy DATA NÓNG Gọi Là Sốc API (HTTP Long/Short Polling). 
App Đấu Giá Cứ Mõi Dây Giật HTTP Kêu Mạng Hỏi "Đã Có Ai Ra Giá Trễ Không?" -> Header Của 1 Cuốc HTTP Đôi Lúc Nặng 2 KiloByte Chỉ Để Chở 1 Cái Chữ Báo Báo "Không có gì mới". Ngốn Băng Thông rách nát túi, Nghẹt Sò Lỗ Chốt. Phải Đảo Chiều Sử Dụng **WebSockets/SSE**.

💻 **Code minh họa trong NestJS (Thực chiến)**
Kiểm Soát Tinh vi các HTTP Status Codes Tránh Gây Nhầm Lẫn Cho Robot Google & CDN Mạng.

```js
import { 
  Controller, Get, Post, Body, Param, 
  HttpCode, HttpStatus, NotFoundException, Res 
} from '@nestjs/common';
import { Response } from 'express';

interface CreateOrderDto { productId: string; quantity: number; }

@Controller('orders')
export class OrdersController {
  
  // 🔴 Sai lầm kinh hoàng: Lỗi mà Trả 200 OK (Hội chứng "Hễ Gửi Được Là OK")
  @Post('bad-create')
  async badCreateOrder(@Body() dto: CreateOrderDto) {
    const isError = this.checkStock();
    if (isError) {
      // Trả HTTP 200 OK kẹp ruột Báo Lỗi! 
      // Reverse Proxy của Nginx sẽ thấy HTTP 200 liền Cất Liền File Lại Vô Cache (Sai toét).
      return { success: false, error: 'Hết hàng rách kho' }; 
    }
  }

  // ✅ Chuẩn xác BigTech: Làm Trọng Mã Lỗi Web Phổ Cập HTTP Headers Semantics
  @Post()
  @HttpCode(HttpStatus.CREATED) // Nhả cứng màng HTTP 201 -> Máy chủ báo Lệnh POST Thật Sự Sinh Ra 1 Vật mới
  async createOrder(
    @Body() dto: CreateOrderDto,
    @Res({ passthrough: true }) res: Response // Tiêm Đối tượng Express Gốc Vào Để Khống Chế Header
  ) {
    const orderId = 'ORD-202X';
    
    // Header Location Dội chỉ cho Client Biết Rằng Vật Đó Chui Rúc Nằm Ở Link Này Mà Truy!
    res.header('Location', `/api/orders/${orderId}`);
    return { id: orderId, status: 'PENDING' };
  }

  @Get(':id')
  async getOrder(@Param('id') id: string) {
    const order = null;
    if (!order) {
      // Phun Lỗi 404 Cấp HTTP - Quăng Ngộp Cửa Nảy Chấp Thuận Chuẩn Ngữ Nghĩa Ván Mạng
      throw new NotFoundException(`Biên Lại Hóa đơn mang Code ${id} Không Tìm Thấy Ở Cột!`);
    }
    return order;
  }
}
```

🔍 **Đào sâu (Deep dive & Edge cases)**
- **Nghẽn Nút Chặng Đường (Head-of-Line Blocking):** Do HTTP/1.1 xài Cống Dòng Chảy TCP theo hàng đợi ống hút nước liên tục. File Gởi đi Mập Ú kẹt thì File Sau Gửi Đi Có Nhỏ mấy Củng Phải Xấp Hàng Lép.
- **HTTP/2 Tỏa Mạch Băm Tràn (Multiplexing):** Cực Hình Chặn Ở HTTP/1 Được Gãy Nứt Nhờ Phóng Chén Frame Binary Nhị Phân Lột Nén Header, Gửi Nghe Chồng Lên Nát 10 Tác Vụ Chung 1 Sợi TCP Giúp Web Sạch Trơn Tiết Lộ Load Nhanh Kinh Hoàng. Lõi Microservices gRPC Sử dụng Mái Xoáy H2 Cho Nghành Gọi Nhau.

🔗 **Mối liên hệ với các kỹ năng khác**
- Cha đẻ sinh thành của **REST APIs** và cái mầm móng đẻ ra Cột Giữ Rương Tội Lỗi **Cookie**.

❓ **Câu hỏi Phỏng Vấn (Kèm đáp án)**
1. **Sự khác biệt Bề Ngoài Và Bên Trong của POST vs PUT?**
   *Đáp án:* POST đập data tạo ra dữ liệu Mới Cáu Khởi ở Database. PUT Dùng Để ĐÈ TOÀN BỘ Bản Khai Gốc Bằng Cục Thay Thế. PUT có Tính Chất Tự Xóa (Idempotent) -> Nghĩa Là Tui Bấm Lệnh PUT 1 Lần hay Bấm Nhồi 10 Lượt Liền Thì DB Vẫn Xót Về Đúng Cái Bộ Trạng Thái Ghi Đè Đó. POST Ấn Liên Cục 10 Lượt Là Em Tạo Ra 10 Dàn Tài Khoản Gây Dị Tượng Méo Não.
2. **Kể Các Múi Nhóm HTTP Status Code Chung.**
   *Đáp án:* Đầu mốc 2xx (200, 201, 204) - Mượt, Phê Duyệt Tốt Đẹp. Mốc 3xx (301, 302, 304) - Xô Mông Rẽ Lối Nhảy URL, Cầm File Cũ xài Tạm. Mốc 4xx (400, 401 Auth Rớt, 403 Thiếu Quyền, 404 Mất Tiêu) - Lỗi Xẩy Tại Phía Lập Trình Viên Client Sài Bậy. Mốc 5xx (500, 502, 503) - Dev Backend Rớt Não Đoạt Tử Server.
3. **Stateless (Vô Biểu Trạng) Nghĩa là Server Bị Mù Trí Nhớ Vậy Lấy Gì Giữ Em Phía Đăng Nhập?**
   *Đáp án:* Stateless tức Cổng Chào Nơi Server Sẽ Reset Não Trắng Phớ Về Client Mới Kết Nối Xong. Muốn Nhớ Chuyến Trở Về Cửa Của User - Ta Bóp Cục Bộ Chữ Thân Phận Bõ Vào Cần Kéo Thẻ Mã Session ID Vào Cookie/Header Lợi Hàm HTTP Rồi Vức Cho Trình Duyệt Ngậm Cầm Đi Trọng Hành Liệu! Mọi Yêu Cuốn Phải Trình Thẻ Đói Đó Gọi Kép Theo Headers.
