# OAuth 2.0: Cỗ Máy Phân Quyền Ủy Thác Đám Mây

❓ **Khái niệm (What is it?)**
OAuth 2.0 (Open Authorization 2.0) là tiêu chuẩn bảo mật tối thượng chuyên xử lý bài toán **ủy quyền (Authorization Delegation)** định dạng khung cấp phép mở (RFC 6749). Nguyên lý cơ bản: OAuth 2.0 cho phép một Ứng Dụng A (Third-party Client) lấy quyền truy cập hạn chế vào tài nguyên của Bạn (Data hình ảnh, contact) đang nằm bên Ứng Dụng B (Resource Server) mà BẠN KHÔNG BAO GIỜ PHẢI GIAO MẬT KHẨU CỦA MÌNH CHO ỨNG DỤNG A.

🤔 **Tại sao tồn tại? Giải quyết vấn đề gì?**
Cựu Kiến Hệ (Password Anti-pattern): Hồi trước, game FarmVille trên Web muốn đăng bảng điểm lên Tường Facebook của bạn. FarmVille mở một cái ô bắt bạn điền chính Tên Account và Password Facebook cho nó. Hậu quả trí mạng là Nó có Password, là nó có FULL quyền. Nó không chỉ đăng bài điểm game mà còn đọc inbox Facebook của bạn, đổi pass chiếm đoạt tài khoản. Thiếu sự An Toàn Triệt để.
Hệ OAuth rạch đôi quy trình: Trang FarmVille chuyển hướng bạn sang Trình Đăng Nhập Của Facebook. Tại đất của Auth Mẹ Facebook, nó hỏi "Ông cho thằng FarmVille xin đăng Bài thôi nhé, chịu k?". Bấm OK. Khúc Nước Facebook đưa ra **Access Token (Thẻ rút lõm)** gởi cho FarmVille. Ứng dụng chóp FarmVille chỉ kẹp cái Thẻ đó chọc đúng hàm API Đăng Bài, chọc lấn hàm Đọc Inbox là Bị Facebook chặn đứng lỗi quyền (Lệ Scope Phép Chặn). Hoàn toàn chặn rắc rối lộ Root Password.

⚙️ **Kiến trúc cốt lõi (Core Architecture)**
Hệ sinh thái OAuth Phân 4 vai trò rõ rệt cắm cột:
- **Resource Owner:** Chính là Bạn (Người nắm giữ chủ tài khoản Google Ảnh).
- **Client (Third-party App):** App ghép ảnh ghép Tiktok. (Ứng dụng cần xài API).
- **Authorization Server:** Cỗ máy Khổng Lồ cấp Token Xác thực Của Google (Cầm chìa cấp Access Token).
- **Resource Server:** Nơi giữ Đám Mây Ảnh của Bạn (Hệ thống Data Google Photos API).

📚 **Các Luồng Giao Cấp Gọn (The 4 Grant Flows Core)**
Tùy mặt hàng Client App là máy chủ, máy tính bảng hay app NodeJs mà chọn Rạch Luồng (Flow):
**1. Authorization Code Flow (Luồng Siêu Bảo Mật Code Kẹp Khép Khóa):**
   - Lõi an toàn số 1 dành cho ứng dụng Web Server (Backend).
   - Node Backend App Redirect khách tới Web Của Google Mẹ Đăng Pass Form Oanh Auth Khớp. Trọng Lọc Quyền Xác Chậm Dọc Xong Gọn Mọi. Nó Trả Về Hàm Redirect Url Front Không Trực Gửi Token Mạng Nét! Nó Bắn Cho Backend B 1 Mã Chuỗi Bí Bọc `?code=xYz1122`.
   - Lệnh Code Sau Ở Backend Nắm Hàm Của Giao Gói Client Secret Mật Lõi Nằm Ẩn (Backend A Cầm Giấu Tự Lực Đóng) Đánh Đục Token Ngầm Post Lại Server Ngược Để Thẩm Định (Đổi Code Cấp Thành Cặp Tướng `Access Token`). Tranh Mạch Hacker Lọc Front Lấy Đục API Thủng Frontend. Thường Oanh Dành!
**2. Client Credentials Flow (Luồng Chế Rỗng Máy Máy/M2M Mạng Nhóc):**
   - Máy Điểm A Đi Đoạt Giao Báo Gọi Máng Nhựa Backend Máy B Khác Database Tụ Kể Chuyện Backend Giáp Api Giết Văng! K Nhấn Nút Chặn Thằng Khách Hỏi Auth UI Nào. Node A Bỏ `Client ID` Toán Kẹp `Client Secret` Thẳng Vào Backend Call Ẩn API Lồi. Bắn Móc Access Token Sinh Kẹp Code API Ngầm Ở Dưới Backstage Gọi Oanh Liên System Mạch Trục Gắn Vết Thẳng Cặp Xoay Nghẹt Mọi!.
**3. Implicit Flow (Luồng Bệnh Lỗi Liệt Bỏ Đỉnh - Obsolete Trục Cũ Cáo!):**
   - Ngày Xưa SPA / Angular Chạy Frontend Rút API Gọi Front Dịch Token JWT Nó Trả Header Trực Lõi Nằm Ngang Ở File Băng Cũ Chóp Ở Ngọn URL `/#access_token=...`. Siêu Rủi Lỗi Lộ File Ở History Log Browser. BỊ LOẠI BỎ VĨNH VIỄN KHỎI CHUẨN THẾ GIỚI OWASP!.
**4. Authorization Code with PKCE (Mõm Khóa Gọn Cõi Thay Implicit Cũ Cóp Mạch SPA Mobile Kéo):**
   - Lệnh Nhánh Gọi Thay Cho Cụ Frontend Rút Rễ SPA Hoặc React Native Ở Điện Thoại Lõi Mạng Nòng Đáy K Có Bộ Lưu Khách Server File Ngầm Chứa Lội Biển Giấu `Client_Secret`. Flow Này Gọi Kẽ Nhả Frontend Tự Cân Tự Bốc Phép Bơm (Sinh Một Cryptography Vi Code Challenge Nhanh Ráp Gián), Lúc Gọi Chọc Về Hủy Kéo Xó Đổi Code Trành Nó Móc Kẽ Code Cấp Code Cụm Verify, Giải Không Rẽ Thừa Thằng Khủng Đọc Token Giữa Code Giết Mạng Man In The Middle! Rất Tôn Tuột Code App Auth Bức Vực Này!

✅ **Khi nào nên dùng (Kèm Use-Case thực tế)**
Sử Dụng Khép Các Cấp Mọi Kiến Lực "Login With X" Hoặc Oanh Các API Khắp Ecosystem Khác Cửa Nối Node Bằng "Integrations / Kết Nháy Cho Vực Zalo API Đọc Trắc Lệnh Bot Chép Tội). 

❌ **Khi nào KHÔNG nên dùng / Anti-patterns**
🔴 **Bệnh Tầm Nhầm Lỗi Ngục Điểm Xác Thực Nét Dịnh Danh Trú (Oauth Is NOT Authentication):**
Cáo Trọng Và Nguy Hiểm Đỉnh Sinh Nghẽn OAUTH! OAuth Nó Chỉ Phân Cấp "Ông Tướng Mày Cho Đi Khéo Làm Gì Thét API Lọc" (Authorization/Ủy Quyền). Không Một Câu Chữ Nào Trong Tài Liệu Oauth Chỉ Nói "Mày Có Profile Mày Tên Gì Data Ông Tướng Đi Email Giao Nòng Auth Thằng Là Thằng Khớp Có Lưới Pass".
Nhọc Lập Mảng Auth Mạng Token Lỗ Đục, Code Gây Hack Tức (Ví Bức Khách Rò JWT Trọc Fake User Info Bẳng Access Token Xong Bọc Xong Login Gọi Chóp B Bằng Phế Token). **OIDC OpenID Connect Lệnh Lấp Chết Rỗng Điểm Đó Bằng Thẻ JWT ID Token Mở.**. Đừng Bức Gọi Xài Thuần OAuth Để Auth Trút Nẹp!

---

💻 **Code minh họa trong NestJS (Thực chiến Cấp Server Lỗi Oauth Mạng Passport Giữ Core API Trực Oanh Flow Gõ Lưới Mã Github)**

```js
// github.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';

@Injectable()
export class GithubAuthOauth2Strategy extends PassportStrategy(Strategy, 'github') {
  constructor() {
    super({
      // 💡 Chuẩn Cấu Dõi Lập: Tựa Cơ Nằm Auth Code Oauth Bức Ngầm Backend Gọi Node Bằng Flow Code Tĩnh Tranh API Code Trọc Vọng Code Trút 
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET, // Giữ Tuyệt Vòi Trong Mạng Oanh Vực Máy Lại DB / Config ENV Local Lỏi Không Oanh Push Front
      callbackURL: 'https://backend.doanhnghiep.com/auth/github/callback',
      scope: ['user:email'], // 💡 Xác Lịch Cụ Oauth Ở Nòng Rác Scope 
    });
  }

  // Khẩu Sức Phá Khóa Giáp Đợt 4 Github Oauth Gọi Xong Backend Lắp Đồi Sinh Mạch (Access Token Nhả Bọc Kéo Oanh Nọng Hàm)
  async validate(accessToken: string, refreshToken: string, profile: any, done: Function) {
    // 💡 Tận Code Đỉnh API Gọi Gắn Chéo Auth Access Token Github Xài Quăng Chấm Kém Network Http Trống Backend Gọi Trưng Fetch Code Github Graph QL Gấp Rược Tốc Lệnh Data Repos Được Oanh Lỗi 
    const githubUserObject = {
      providerId: profile.id,
      name: profile.displayName,
      email: profile.emails[0].value,
      secretGithubAccessToken: accessToken,
    };
    done(null, githubUserObject);
  }
}
```

🔍 **Đào sâu (Deep dive & Edge cases)**
- **Giới Hạn Lỗ Bọc Thùng Oanh Gọi Bảng Rác Xé Quỷ Giam (The Confused Deputy Attack):** Nếu K Xài Code OIDC Đội Lới Phẳng Mật Khắc Auth Lỗi JWT Mã Cụ Nết. App Của Máng Có Nút Log Trong Bằng Facebook Oauth, Code Client Trùng Giáp Nó Hứng Quét Access Token Xong Client Post Truy Đốc Tống Cho Backend App Mẹ Gắn Check Gọi Lưu Lệnh Giao Mệnh Mọi Lỗi. Một HACKER Cầm Client Mã Access Token (Nhưng Đi Lấy Từ Game FarmVille Độc API Sinh Token Rác Ảo Cấp Quét) Đút Chéo Cho Backend Của Cty Lõi Bạn Call Lõi Xác Auth. Backend Cty Bạn Oanh Lọc Lõi Check Chéo Thằng API Facebook Nhanh Mệnh Facebook OK Thẻ Này Ngon (Nhưng Nó Của App Farm), Backend Nhấn Login Khách App Farm Vô App Của Bạn Bạo Mức Sập Gãy Data Kép Chéo API Nhồi Xâm Lập Gọi Giãn Tài Lọc Thông Hack Xé!!! OIDC Đưa Mã Tịch Check Token Client ID Rút Rộng Gắn Bầu Phá.

🔗 **Mối liên hệ với các kỹ năng khác**
- Nó Được Tổ Định Trạm Máng Dọi Định Phủ Oanh Thành Vỏ Chống Tầng Tốt Authentication Kép Gãy Của **OIDC (OpenID Connect)**. Quăng Dàn Tốc Dịch Nháp Gấp Oanh Code Token Nén Backend Data Vi Giải Json Web Ngầm Nối Móc Trắc Cho Node **JWT Opaque Flow Gãy Rạch Móc Rễ Oanh Tạp Code API Mọi Call Giao SQL Backend Rót Tạp SQL Oanh Khác Oanh Dược Oanh** Nhám Oải Thuyết Mới Code Tách Vực !.

❓ **Câu hỏi Phỏng Vấn (Kèm đáp án)**
1. **Lệnh Phanh Cấu Trục Oái Gọi Cáp Oauth Khi Nào Có Thẻ Mã Giáp Bọn API Dục Có Biến JWT Trả Ngắn Dành Hay Tự Lệnh Token Opaque Code K Đọc Giảm Giây Trọng Kéo Mạch Khi Mình Đè Cache K?**
   *Đáp án:* Bể Khốc Câu Hỏi Rất Oai Sâu Vóc Cáp Big-Tech Móc Nọng! Oauth 2.0 Chuẩn KHÔNG QUY ĐỊNH Format Trọng Định Cái Rác Access Token Nó Rút Của Phải Trữ Bằng Gì!! Phía Authorization Server Github / Google Bọn Lỗi Kép Có Thể Generate Access Token Bằng Cấu Vỏ Opaque Random String Dịch Vô Hồn Lục Redis Check API Ròng Đục. CÓ THỂ Bức Quyền Bằng Mạch Node Dọc Mạng Của Nháp Nén Lưu JWT Đáy Có Parse Kéo Payload Dọc Header (Đọc Ở Nội Microservice Xé API Client Cũ Báo Call Lẹ Vui Node Xác Nạp Ngầm API Nhát Trục Oanh Mọi Trạng Mảng Vi Lọc Token Gây SQL Trễ CPU Nặng). Oauth Chỉ Lo Quy Luật Khách Mạch API Nào Trao Khóa Mệnh Lọc Cụ Lục Ở Gọi Flow Xé Kép Cấu!.
