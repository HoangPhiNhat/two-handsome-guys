# REST: Kiến Trúc Nghệ Thuật Lõi Của Internet

❓ **Khái niệm (What is it?)**
REST (Representational State Transfer) không phải là một giao thức như HTTP, nó là một **Phong cách Kiến trúc (Architectural Style)**. Được khai sinh bởi Roy Fielding (ngôi sao thiết kế HTTP), REST yêu cầu bạn nhìn mọi thứ trên Server như một "Tài nguyên" (Resource - ví dụ: Khách hàng, Đơn hàng) và định vị chúng thông qua URL rành mạch (như `/users/123`).

🤔 **Tại sao tồn tại? Giải quyết vấn đề gì?**
Trước REST, khi trình duyệt gọi Server, mọi người sử dụng các lệnh rác lộn xộn: Bấm gọi URL `/get-user?id=1` hay `/delete_order_5`. Code bảo trì cực nát vì không có quy chuẩn "Hành động". 
REST giải quyết bằng cách áp dụng **HTTP Verbs (Danh từ)**: URL chỉ làm nhiêm vụ định danh tài nguyên (Danh từ `/users/123`), còn Bộ Động Từ (GET, POST, PUT, DELETE, PATCH) của HTTP chịu trách nhiệm báo cho server biết phải Xóa, Sửa hay Lấy.

⚙️ **Cách hoạt động ngầm (How it works)**
Trái Tim REST nằm ở chữ **Stateless (Vô Biểu Trạng)**.
Người dùng B đăng nhập Server 1. Ở Backend dùng REST, Máy chủ Không Sẽ Không Cắm Bộ Nhớ Rằng "Khách Này Mới Chào Mình Hồi Nãy". Ở mỗi MỘT Lệnh Cực Kỳ Độc Lập tiếp theo (Ví dụ gửi `GET /profile`), trình gọi bắt buộc phải kẹp toàn bộ Chìa Khóa Nòng (Token) gửi sang.
Nhờ điểm Rỗng Trí Nhớ này, Load Balancer Nhắm Cửa Cáp Quăng Trúng Máy Chủ Server 2, Server 2 đọc thẻ Token vẫn Giải Quyết Được Báo Cáo, Scale Ngang vô hạn!

✅ **Khi nào nên dùng (Kèm Use-Case thực tế)**
Sử dụng làm Gốc Mặc Định cho 90% các API gọi từ Màn Web Frontend hay Mobile App về Trung Tâm Đám Mây Mẹ.
**Kịch bản:** Màn hình Mobile Danh sách User. `GET /users?page=1&limit=20`. Server rọi DB và Quất Chuỗi JSON Rất Cặn Nghẽn Mạch Chuẩn Chỉ Phục Vụ Ngay Trang Mobile Đó Mượt Chóp.

❌ **Khi nào KHÔNG nên dùng / Anti-patterns**
🔴 **Phá Mạch Gã Đói Băng Thông (Overfetching / Underfetching):**
Màn hình App hiển thị Avatar của `User`. Trình Khách Gõ Cánh Lấy Cú `GET /users/1` Bị Thằng REST đè Cả Khối Array [Thẻ Tín Dụng, Bảng Cấp Quyền Lỗ Lại] Bắng Đứt 1MB Chữ Xuống Máy. Tràn Viền RAM Của Khách (Đó Là Overfetching). Muốn lấy Ngắn Sẽ Phải Viết Dày Cục Giao Tiếp Trả Lại Cực Phí (Khắc Phục: GraphQL Nhảy Lên Thay DB). 

---

💻 **Code minh họa trong NestJS (Thực chiến)**

Thâm Điểm Kết Truy Gốc REST ở NestJS Dài Chữ Mọi Tính.

```js
// orders.controller.ts
import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode } from '@nestjs/common';
import { OrderService } from './order.service';

@Controller('orders') // Danh từ số nhiều, Tuyệt đối k đặt /get-orders
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  // Lệnh Mót Rút Dữ Liệu
  @Get(':id')
  getOrder(@Param('id') id: string) {
    return this.orderService.find(id);
  }

  // Tái Sinh Tài Nguyên (Rớt Xuống Mâm Nhận 201 Created)
  @Post()
  @HttpCode(201)
  createOrder(@Body() payload: { productId: string }) {
    // 🔴 Sai Nhất Lịch Sử: POST Mà Update Tiền DB Khách. Post Là Sinh Mới Cáu!
    return this.orderService.create(payload);
  }

  // Cạo Sạch Toàn Bộ Cây Ghi Rác Cắm Mới Bản (Lệnh Idempotent)
  @Put(':id')
  replaceOrder(@Param('id') id: string, @Body() payload: any) {
    // Lưu Ý: PUT là Chùi Trắng Cả Đống Data Để Đè Payload Này. Nếu Chỉnh 1 trường, Dùng PATCH.
    return this.orderService.replaceAll(id, payload);
  }

  // Bấm Mảnh Rớt - Trả 204 No Content Để Giảm Tải Máy Lạnh Network
  @Delete(':id')
  @HttpCode(204)
  deleteOrder(@Param('id') id: string) {
    this.orderService.remove(id);
    return; // Đã chém đầu thì đừng trả rác về
  }
}
```

🔍 **Đào sâu (Deep dive & Edge cases)**
- **Mức Độ Sang Chảnh (Richardson Maturity Model):** REST có 4 đỉnh Chóp (Level 0 tới Level 3). Mọi Cty Phần Lớn Kẹt Ở Level 2 (Có Nút Động Từ HTTP, Đi URL đúng). Rất Sát Ai Leo Lên Đỉnh Level 3 Mãn Nhãn Đó Là **HATEOAS** (Lát Giải Mã Dưới). REST không Phải Nôm Na Là Code Get/Post Thô!
- **Tính tự Tự Hủy Sạch (Idempotency):** Cốt Mạch Hệ Chống Gãy Đứt 2 Lần Trùng. Gửi Lệnh `GET` Hoặc `PUT`  Vấp Rớt Wifi Chạy Nữa Gởi Lại Thêm 100 Lại. System DB Code Xử Lí Đáy Không Thay Biến Hình Lệnh Cuối! Duy Có Trúng Móc Lệnh `POST`, Dấp Mạng 10 Múi, Backend Sẽ Lỡ Khai Khoái Đẻ Lầm Sinh 10 Hóa Đơn Trắng Trợn!!

🔗 **Mối liên hệ với các kỹ năng khác**
- Nó Đi Gài Cắn Móng Dưới Căn Gầm Cho Chuẩn Cầu Liên Trục **HTTP** Và Tiền Đế Diển Lệnh Cho Khúc Rạch **GraphQL**.

❓ **Câu hỏi Phỏng Vấn (Kèm đáp án)**
1. **Tôi Thay PATCH Bằng PUT Cho Việc Sửa 1 Cột Tên Thì Cắn Code Nát Nào?**
   *Đáp án:* PUT Là Khối Ghi Đè (Replace Toàn Bộ Mạng Lưới Object). Ví Dụ Bảng User Có Cột Tên - Tuổi - Ngày Cấp. Mão Chấm Gửi Cục PUT Lõi Body JSON Mỏng Tanh Nhõn Mổi Đổi Chữ `{ "ten": "Lê" }`. Trực Diện Code Chuẩn Của Backend Sẻ Quăng Lệnh Update Đè Gắn, Khiến Rớt Tạch Khô Cột Tuổi Với Ngày Thành Trắng Xoá Lõ Lòi Hoặc NULL! Phải Dùng Lệnh PATCH Để Cắm Cập Rõi Góc Đúng Nghĩa Vá Đường Nứt Gập 1 Góc Code.
