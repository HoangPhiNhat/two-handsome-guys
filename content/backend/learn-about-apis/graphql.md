# GraphQL: Quyền Lực Chuyển Giao Cho Frontend

> **Mục tiêu:** Một phát minh vĩ đại của Facebook 2015. RESTful đã và đang cản trở tiến độ của Frontend Engineer do Backend luôn làm nút thắt cổ chai (Phải chờ sửa Data). Bài viết giải phẫu GraphQL - Mỏ vàng về Data Graph, vấn nạn N+1 (Dataloger), và Caching Pain.

---

## 1. Vấn Đề Mang Tên: Over-fetching và Under-fetching
* **Over-fetching:** Lấy thừa xả lãng. Bạn làm App xem comment Facebook, chỉ cần cái Avartar mờ mờ và Text bình luận. Gọi `GET /users/50` Backend tống ra một nùi JSON cực nặng có luôn cả Mật khẩu hash, Ngày tháng đăng ký, Sở thích... Quá mệt mạng di động 4G.
* **Under-fetching:** Lấy một lần không đủ. Phải lặp cái vòng đi theo thác nước `Water-fall API`. `API lấy List Posts` -> Lấy ID từng post để vòng ra đá lên `API lấy tác giả`.

GraphQL dẹp bỏ tất - Trình khách cần cái gì (Shape), đòi (Query) đích danh cái đó, hệ thống (Server) tự tổ hợp, ghép nối và trả về khối lượng chính xác không sai 1 tấc. Một cục Endpoint duy nhất: `POST /graphql`.

## 2. Cách Vận Hành Và Đồ Cổ Resolver
Để chạy GraphQL. Backend quy hoạch sẵn 1 khu vườn (Schema). Khu vườn quy định Noun (Danh từ): Nút User quan hệ 1-Nhiều với Nút Post. Mật mã cấu trúc Schema rất ngặt Type giống hệt Typescript.

Client gửi Lời Triệu Hồi (Query):
```graphql
query Tui_Can_Du_Lieu_Xin_Xo {
  user(id: "123") {
    name
    email
    posts(limit: 5) {
      title    # Chỉ nhả title thôi đấy nhé!
    }
  }
}
```
Ở bên trong BE (NodeJS GraphQL Server chạy trên Express), thay vì xài Controllers mớ REST, ta có **Resolvers**. Ở Resolver `user.posts`, cái hàm JS đi truy xuất DB tìm hàm móc nối. Dễ chịu, Frontend ko gào thét "Tao thiếu field Email, thêm vào Database gấp đi" mà bạn tự khai hoang hết thảy để người ta chủ động gắp mồi.

## 3. Tử Huyệt của GraphQL (Middle/Senior Domain)
Khả năng "vương quyền" cho Frontend đính kèm cái giá của một nền móng kiến trúc dễ bị bầm dập.

### Quái vật N+1 Query
Vì nó phân mảnh logic ra từng nhánh Resolver. Nhánh User gọi ra trả 10 objects User. 10 cục User lại lôi đệ quy về Resolver Posts để tìm Comment. Mới chớp mắt cái, MySQL Backend chạy `100 câu SELECT` tách rời đè gãy răng rụng cả hệ thống.
👉 **Thuốc giải:** Senior Backend Engineers MẶC ĐỊNH phải sử dụng Dataloader pattern. Nó hoạt động bằng cơ chế ngâm Request theo kiểu gom (Batching) trong 1 chu kỳ Event Loop vài milisecond. Tất cả 10 lời kêu tìm id (1..10) được gom chặt lại thành 1 câu duy nhất `SELECT * FROM posts WHERE id IN (1..10)`. Đội ngũ FB tối ưu quá dã man!

### Nỗi Bất Hạnh của Caching Edge
Ở thời REST, HTTP GET dễ dàng lưu lại Cache qua CDN (Cloudflare/Redis cache tầng cổng) vì nó có cái đường link URL phân biệt rõ, e.g. `/users/1?field=name`.
GraphQL chơi kiểu chọc `POST` duy nhất vào một điểm nút. Thân chứa các chữ nghĩa lòng thòng vô hạn. Khả năng HTTP Cache hoàn toàn mù lòa! Giải pháp là đội phải cấu hình những Cache Tooling rất nặng nề như Apollo Federation hoặc Redis Persisted Queries (Biến đống dông dài thành cái cục mã hoá Hash ngắn gọn rồi tìm).

Nắm vững GraphQL đồng nghĩa với việc bạn không thể nào xài cấu trúc RDBMS đơn điệu mà luôn phải nhạy bén về Graph liên đới và Tối ưu Batch Queries!
