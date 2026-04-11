# JSON Web Token (JWT): Giải Phẫu Mã Thông Báo Stateless

❓ **Khái niệm (What is it?)**
JSON Web Token (JWT) là định dạng quy chuẩn mở (RFC 7519) dùng để truyền tải thông tin an toàn giữa hai bên (VD: Client và Server) dưới dạng một object JSON. Trong thế giới Backend, JWT gần như là tiêu chuẩn công nghiệp (De facto standard) để thực hiện Xác thực (Authentication) cho các kiến trúc API hiện đại và Microservices.

🤔 **Tại sao tồn tại? Giải quyết vấn đề gì?**
Trước đây, chúng ta dùng Session: Người dùng đăng nhập thành công, Server lưu thông tin họ vào RAM (Session Memory) và trả về một Session ID rỗng tuếch (Cookie) cho trình duyệt. Khi user gọi API, Server lại phải lấy ID đó đi dò trong RAM để xem họ là ai. Vấn đề bùng nổ khi bạn Scale ứng dụng lên 10 con Server phân tán qua Load Balancer: Trình duyệt gửi API lên Server số 2, nhưng hôm qua nó lại Login ở Server số 1 -> Server số 2 không biết thằng này là ai! Văng lỗi đăng xuất.
JWT khai sinh cơ chế **Stateless (Phi trạng thái)**. Mọi thứ Server cần biết về User (Tên, UserID, Quyền Admin) đều được nhét trực tiếp vào trong chính cái Token. Server KHÔNG CẦN CHỌC VÀO DB HAY RAM ĐỂ TRUY VẤN NỮA. Thằng Server nào chỉ cần biết cách xác minh chữ ký (Verify Signature) của JWT là đều nhận diện được User. Giúp ứng dụng Scale vô hạn.

⚙️ **Kiến trúc cốt lõi (Core Architecture)**
Cầm 1 chuỗi JWT, bạn sẽ thấy nó có 3 đoạn được ngăn cách bằng dấu chấm `.`: `Header.Payload.Signature`.
- **Header (Phần đầu):** JSON mã hóa dạng Base64Url, khai báo loại (typ: "JWT") và thuật toán (alg: "RS256" hoặc "HS256").
- **Payload (Dữ liệu thực):** JSON mã hóa Base64Url. Chứa các "Claims" (Khẳng định). 
  - *Registered Claims:* `sub` (UserID), `iat` (Thời điểm tạo), `exp` (Thời điểm chết).
  - *Custom Claims:* `role: "admin"`, `email: "a@a.com"`. Đây là dữ liệu Public, tuyệt đối không quăng Mật khẩu hay Số thẻ ngân hàng vào đây.
- **Signature (Chữ ký):** Trái tim của JWT. Nó lấy chuỗi Header + Payload, dùng Thuật toán (như SHA256) băm cùng với 1 cái **Secret Key** (Khóa bí mật chỉ Backend mới biết). Trả ra 1 chuỗi loằng ngoằng.
💥 *Khi Hacker giở thủ đoạn:* Thử lên web `jwt.io`, sửa chữ `role: "user"` thành `"admin"` trong Payload. Khi Request lên Backend, Backend sẽ băm lại chuỗi Header + Payload Đã Sửa + Secret Key. Chắc chắn kết quả băm ra sẽ lệch hoàn toàn với cái Signature thằng Hacker gửi lên. Token lập tức bị từ chối 401.

📚 **Phân mảng Thuật Toán Ký (HS256 vs RS256)**
Đa số hướng dẫn trên mạng dạy bạn dùng `HS256` (Symmetric - Đối xứng). Tức là Dùng chung đúng 1 cái chuỗi Secret Khóa (VD: `"my_secret_123"`) vừa để Tạo Token (Sign) vừa để Dịch Token (Verify). Nếu bạn có 10 con Microservices, cả 10 con đều phải lưu cực kỳ bí mật cái chuỗi dở hơi này. Lộ là chết toàn app.
Công ty công nghệ lớn quy định bắt buộc phải xài `RS256` (Asymmetric - Phi đối xứng). Bạn tạo ra 1 cặp Private/Public Key. Con Auth Server sẽ giấu nhẹm Private Key dùng để Sign Sinh ra Token. 10 Con Microservices còn lại bạn cứ quăng đại cái Public Key cho nó. Nó dùng Public Key để Verify chữ ký trót lọt, nhưng k thằng nào có thể giả mạo sinh ra được JWT giả! An toàn vô đối.

✅ **Khi nào nên dùng (Kèm Use-Case thực tế)**
- Cơ chế mặc định để uỷ quyền API cho Single Page Apps (React/Vue) và Mobile Apps.
- Bức tường liên lạc bảo mật giữa các cụm Server-to-Server (Microservices).
**Use-case: Phân phát liên kết chia sẻ One-time (Giáp mặt S3):** Mọt tính năng hay bị bỏ quên. Bạn muốn cho File PDF trên S3 nhưng chỉ cho người khác tải trong 5 phút. Bạn sinh ra một cái JWT rỗng, gài `exp` 5 phút, ghép JWT vào url thành dạng `?token=eyJ...`. Server check Url xem token còn hạn k là cho tải. Khỏi cần truy vấn Database check lằng nhằng!

❌ **Khi nào KHÔNG nên dùng / Anti-patterns**
🔴 **Siêu bệnh nhức nhối: Bức Tường Đá Logout & Vô Hiệu Hóa (Revocation):**
Đặc ân của Stateless cũng chính là lời nguyền của JWT. Vì bạn không lưu Session trên Server, bạn KHÔNG THỂ ẤN NÚT LOGOUT cưỡng chế trên Backend. Nếu User bị lộ JWT, hoặc Admin muốn Cấm (Ban) quyền thằng User đó, cái JWT cũ 15 phút của nó vẫn được API xem là Hợp lệ.
Cách fix thực tế: App buộc phải xây dựng Bảng Đen (Blacklist). Khi User bấm Đăng xuất, Backend phải bỏ cái token đó vào cơ sở dữ liệu RAM Redis. Ở Mọi Request API từ nay về sau, Auth Guard phải tốn thêm chi phí móc Redis kiểm tra "JWT này có lọt sổ đen không". Điều này GIẾT CHẾT mục đích "Phi trạng thái (Stateless)" không đụng DB nguyên thủy của JWT, nó lôi hệ thống trở lại mô hình Stateful một cách phèn chua!

---

💻 **Code minh họa trong NestJS (Thực chiến cấp BigTech)**

```js
// auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      // ✅ Chuẩn Kỹ sư Senior: Xóa bỏ secret HS256, chuyển sang PEM RSA
      privateKey: process.env.JWT_RSA_PRV_KEY, 
      publicKey: process.env.JWT_RSA_PUB_KEY,
      signOptions: { 
        algorithm: 'RS256', // Khai báo rõ để đập tan lỗ hổng Cổ điển 'alg: none'
        expiresIn: '15m',   // JWT chỉ được sống rất ngắn để nhỡ bị lộ cũng hạn chế sát thương
        issuer: 'auth.handsome-guys.vn'
      },
      verifyOptions: {
         algorithms: ['RS256'], // Khóa cứng Verify, k cho Hacker múa thuật toán
      }
    }),
  ],
})
export class AuthModule {}
```

🔍 **Đào sâu (Deep dive & Edge cases)**
- **Khái niệm Refresh Token Rotation (Tráo đổi Thẻ bài):** Vì Access JWT trên (thẻ đi đường) chỉ sống 15 phút. Bạn k thể bắt User 15p bắt đăng nhập lại. Backend phải cấp cho nó 1 cái Tờ giấy phụ gọi là `Refresh Token` (Sống 30 ngày). Khi Access Token hết hạn, React tự dùng cái Refresh Token bắn xuống BE xin đổi 1 cặp Token mới. Để chống Hacker copy trộm Refresh Token, cơ chế `Rotation` áp đặt: Mỗi khi Refresh Token đem gọi lấy Access, BE sẽ **Tiêu hủy Refresh Token cũ và cấp luôn 1 cái Refresh token mới cứng kẹp theo**. Hacker mà đè file xài Refresh token cũ báo Replay Attack -> BE báo trộm, Block User và Xóa thẳng thừng hết thẻ Session! Lập tức an toàn.

🔗 **Mối liên hệ với các kỹ năng khác**
- JWT chỉ là CƠ CHẾ ĐI ĐƯỜNG (The Envelope). Nó là lõi vận chuyển nằm trong lòng của các luồng Ủy quyền vĩ mô như **OAuth 2.0** và Căn cước định danh **OpenID Connect (OIDC)**. Storage lưu JWT trên Frontend dính trực tiếp đến bài toán phòng chống **XSS/CSRF Security**.

❓ **Câu hỏi Phỏng Vấn (Kèm đáp án)**
1. **Developer trong team muốn mã hóa mật khẩu và Thẻ Visa vào Payload của JWT để Client tiện đọc bằng Cú pháp Encode có được không? Dùng cái gì để an toàn?**
   *Đáp án:* Rất Lỗi và Rủi ro Cực Mạng! JWT (Json Web Token) tiêu chuẩn chỉ có chữ Ký (Signature) để chống giả mạo sửa đổi (Integrity). Phần Base64Url của Payload nằm đó phơi trần và BẤT CỨ AI HACK ĐƯỢC TOKEN CŨNG DỄ DÀNG COPY VÀO BROWSER DỊCH RA ĐỌC ĐƯỢC BẰNG MẮT THƯỜNG (Lack of Confidentiality). Nếu dự án Yêu cầu Che giấu mã hóa cực độ Data trên đường truyền, phải dùng bản nâng cấp tên là **JWE (JSON Web Encryption)**, mọi thứ bên trong sẽ bị Encrypt đen thui, chỉ có chìa khóa Private mới dịch được Text. Mặc dù JWE quá cồng kềnh hiếm ai xài so với đẩy Data thẳng về API Call.
