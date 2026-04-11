# Băm Dữ Liệu (Hashing): Tấm Khiên Cứng Của Dữ Liệu Mật

❓ **Khái niệm (What is it?)**
Hashing (Băm dữ liệu) là quá trình đưa một chuỗi đầu vào (Ví dụ: mật khẩu `"sieumat123"`) qua một thuật toán toán học một chiều (One-way Function) để biến nó thành một chuỗi xáo trộn có độ dài cố định (VD: `"e5e9fa1ba31..."`). Đặc tính sống còn: **Không thể giải mã ngược lại** (Vô phương dịch chuỗi băm để tìm ra mật khẩu gốc), dù có là siêu máy tính.

🤔 **Tại sao tồn tại? Giải quyết vấn đề gì?**
Cựu Kiến Hệ: Rất nhiều sinh viên và Junior để Mật khẩu người dùng dạng Text Trắng (Plain-text) dưới Database SQL. Hậu quả: Dù Cổng mạng API của bạn an toàn tới đâu, nếu một Cựu Nhân Viên Backend tuồn Data User mang bán, hoặc Hacker chọt nát Database qua nhúng SQL Injection, toàn bộ Mật khẩu thật của khách hàng sẽ bị cướp. Hacker sẽ lấy Pass đó mang qua Facebook, Ngân hàng gõ thử vỡ nát toàn hệ thống Khách.
Hashing ra đời: Bạn băm mật khẩu ra mã Rỗng. Hacker ăn cắp Database cũng chỉ nhìn thấy một cục rác Vô Hồn `"e5e9fa1ba31"`. Hacker khóc hận vì không biết mật khẩu thật là gì để nhập vào màn hình Đăng Nhập.

⚙️ **Bộ Quy Tắc Lõi (Hashing vs Encryption - Điểm Nhầm Lẫn Bậc Nhất)**
- **Encryption (Mã Hóa - Ví dụ AES256):** Là con đường **2 CHIỀU**. Bạn khóa Cục data lại bằng cái Chìa Khóa (Key). Bạn phải cất Giữ cái Chìa Khóa đó để hôm sau mò vào mở Khóa Lấy Data Ra Đọc chữ gốc. Phù hợp lưu thẻ Visa, CCCD (Phải đọc lại được).
- **Hashing (Băm - Ví dụ Bcrypt):** Là con đường **1 CHIỀU**. Cho vô máy xay sinh tố, xay nát nhừ thành nước. Bạn không thể lắp ghép Ly nước Sinh tố để dựng thành quả Dâu Tây ban đầu. Phù hợp cho Mật Khẩu.
*Vậy đăng nhập thế nào?* Khách gõ Pass -> Backend Băm lại cục pass Khách vừa Nhập. Lấy Cấu Trúc Băm Vừa Chạy, So Sánh Chuỗi với Cấu Trúc Băm Trong DB. Trùng khít Chuỗi Hash -> Mật khẩu đúng! Kẻ trộm (Hacker) mò được chuỗi Hash cũng chả thể nhập vào Form Đăng Nhập vì Form bắt điền Pass Góc.

📚 **Khóa Môn Phái Hashing (Lịch Sử Các Thuật Toán Cốt Lõi)**
- 🔴 **MD5 & SHA-1 (TUYỆT ĐỐI CẤM):** MD5 chạy ra cục string 32 ký tự. Từng là bá chủ. Tuy nhiên Thuật toán này CỰC KỲ NHANH VÀ NGẦY NAY THÌ SIÊU YẾU. Các dàn Siêu Card Đồ Họa Máy GPU (RTX 4090) của Hackers có thể Băm Đoán Ngược (Hash Collision / Brute-force) MD5 tốc độ 100 Tỷ vòng/giây. Bạn dán chuỗi MD5 lên web giải mã, có kết quả pass Thô trong 0.5 giây! Cấm dùng để băm Password.
- 🟡 **SHA-256 (Tốt nhưng chưa Đủ cho Password):** Rất dài và khủng, nhưng SHA256 lại được thiết kế để "Nhanh" (Dùng tạo Hash BlockChain Bitcoin hay mã hóa JWT). Nhanh nghĩa là Hacker cũng băm thử sai Nhanh.
- ✅ **Bcrypt / Scrypt (Tiêu Chuẩn Công Nghiệp Hiện Tại):** Cố Tình Thiết Kế Để Chạy CHẬM RÌ RỢP.
- 👑 **Argon2 (Vua Bảo Mật Thập Kỷ Hàm Mật Mã Mới):** Đánh bại mọi chuẩn cũ, kết hợp cản phá Card GPU máy tính bằng cách ngốn cả Bộ nhớ RAM khi Băm!

✅ **Khi nào nên dùng (Kèm Use-Case thực tế)**
- Sôi động 100% trong TẤT CẢ các hệ thống có Authentication User để Trữ Mật Khẩu.
**Use-case Giải Bài Kéo Kẹp Mã Muối (Salt):** Hacker có chiêu Trữ Gắn "Bảng Cầu Vồng" (Rainbow Table). Nó Băm 1 Tỷ mật khẩu phổ biến nhất thế giới (như `123456`, `admin`) bằng `Bcrypt` Cất Sẵn Tự Điển Kho. Lấy DB của bạn, Dò So Sánh Khớp Hai Tự Điển Mảng là ra Pass. Để đập nát chiêu này, Bcrypt TỰ ĐỘNG sinh ra 1 nhúm chữ Rác Ngẫu nhiên (Gọi là Thêm **Salt - Muối**). Mật khẩu `admin` của Thằng A kẹp muối `xyz` sẽ băm ra dải Text KHÁC HOÀN TOÀN với Mật khẩu `admin` của Thằng B kẹp muối `abc`. Hacker sụp hố Rainbow Table triệt để!

❌ **Khi nào KHÔNG nên dùng / Anti-patterns**
🔴 **Bệnh Oái Chỉnh Bậc Đếm Nén Cost Băm Giật Lag Sập CPU Node.js:**
Bcrypt có một bộ số tên là vòng `Salt Rounds` (Mức độ Cày Trễ CPU: Cost Factor). Chuẩn an toàn 2010 là `10`. Với Cost `10`, NodeJS tốn 0.1s để Băm. Nếu Thợ mới gõ Mỏi Chóp Cost lên `15` hoặc `18`, độ trễ sẽ bị Đội theo Hàm Mũ. Băm một Pass Cost 15 sẽ tốn **3 Giây CPU**. Trong 3 Giây Băm đó, Thread Lõi Của Nodejs Đứng Cứng Khốc Nặng (Chống Lại Tính Non-Blocking). Rất Dễ Bị Bóp Tốc Sập API Nóng Do Hacker Cố Tình Nện Spam Nút Đăng Nhập 1000 Nháy Ép Server Nén Băm Bức Tử!!.

---

💻 **Code minh họa trong NestJS (Thực chiến cấp Kỹ Sư Bcrypt Cột Node)**

Trục cấu trúc Cáp Vi Băm Lực Bcrypt Kém Chuẩn Cấp Mệnh Node Trong Auth Guard.

```js
// hashing.service.ts
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordService {
  // 💡 Quyết Lệnh Cost Factor Thời Hiện Đại Ở Máy Đơn (10 Rất Nhanh Mỏng, 12 Cân Bằng Trì Lắc Dịch An Toàn Khốc)
  private readonly saltRounds = 12;

  async hashPassword(plainTextPassword: string): Promise<string> {
    // Bcrypt Cực Oanh Nhờ Tính Năng: Hàm Hash này Tự Sinh Kèm 1 Dòng Salt Trộn Chôn Ngầm Ngay Trong Result Header Text Trả Về. K Cần Lưu Cột CSQL Salt Riêng!
    return await bcrypt.hash(plainTextPassword, this.saltRounds);
  }

  async verify(plainTextPassword: string, hashMocTrongDB: string): Promise<boolean> {
    // 💡 Trí Mạng Logic: Bcrypt Xóa Mảnh Chuỗi Trích Xuất Ngầm Code Salt Từ "hashMocTrongDB" Lắp Trộn Mảng plainTextPassword Ngược, Băm Ra Check Khớp Lệnh OAI So Sánh String Vết Cũ!
    return await bcrypt.compare(plainTextPassword, hashMocTrongDB);
  }
}
```

🔍 **Đào sâu (Deep dive & Edge cases)**
- **Giới Hạn Kinh Ngạc Của Bcrypt (Lỗ Khóa Cắt Kí Tự 72 Byte):** Đa Số Gặp DB Sập Không Hồi Do Cấu Lập API Băm Của Nền Node `Bcrypt`. Bcrypt Sở Hữu 1 Yết Hầu Chết Người: Nó CHỈ MANG ĐI BĂM 72 KÝ TỰ ĐẦU TIÊN Của Mật Khẩu (Tính Theo Bytes C). Nếu Password user dài thượt 100 chữ như là: `Toi_la_ke_giau_co_nhat_the_gioi_12345678_Toi_rat_vip`. Bcrypt Băm Cắt Cái Rụp Bỏ Rác Phần Đuôi Đi Lúc Giải. Giao Lệnh Khách Hack Chỉ Gõ: `Toi_la_ke_giau_co_nhat_the_gioi_12345678_Hack_roi`, Backend Ráp Khớp Báo Password Đúng (Do Cặp Đoạn Code 72 Kí Tự Đầu Là Khớp Nhau Hoàn Toàn Xé Địch Cáp Băm K Báo Check Khứa Đuôi Lời). Cứu Hóa Giải: Giắp Pass Khách Vào Băm Vòng SHA-256 Trả Thành Hash Chữ Fix Size Xong Bộc SHA-256 Đó Nhét Vào Thùng Bcrypt Kéo Bảo Vệ Triệt Để Node Độ Dài Ngắn K Sượng Bão Gấp!

🔗 **Mối liên hệ với các kỹ năng khác**
- Nó Đi Tạch Rách Bám Theo Nạn Sinh Diệt Code Cho **Authentication Hệ JWT (Verify Payload bằng SHA-256 Signature)** Và Cấu Mã Oai Ngược Trái Lệnh Của Bọn Chứa Nặng Data Base API Giải **Open Web Application Security Project (OWASP Lỗi Lướt API Của Rò Rỉ Data)**.

❓ **Câu hỏi Phỏng Vấn (Kèm đáp án)**
1. **Lệnh Phanh Cấu Trục Ở Bằng Mã Hash MD5 Bằng Code Code Giải Nén Ngắn Rọc Dùng 1 Chú Code Code JWT Sinh Mã Có Nặng Lưới Hơn Sha256 Ráp Trong Khép Token Json K?**
   *Đáp án:* Rất Lệnh Lạc Bị Lốc Ngắt Cự Đoạn Chéo Vi Việc Nhúng! Nét Tĩnh Jwt Yêu Cầu Oanh 1 Lõi Chữ Kí Bọc API Đòi Tốc Độ CPU Gặp Mệnh Hit Kéo Nhẹ. Nhấn MD5 Tới Không Được OWASP Điển Vào Rác Cho Data Quyền Rác Nước Nặng Nền Kéo Hack Máng Oanh Của Kí Lệ (Do Gãy Cực Sát Sinh Giây). JWT Quy Tĩnh Xé Đọc Mã Code Algorithm Là `HS256` Nền (Nghĩa Oanh Tức Hàm SHA-256 Đội Kìm Khóa HMAC Chứa Khóa Secret Cấp Đè Bão Bằng Key). Bạn Áp MD5 Vọc Code Vào Signature Là Đóng Gông Nhận Nạn Fake Signature Rẽ Oanh Dễ Dàng Đảo Code Hacker JWT Mạch Lập Tốc Gấp! Do Nó (MD5 Lạc Hậu Tương Quan Kéo Size Key Yếu Giết Chữ Ký Nặng).
