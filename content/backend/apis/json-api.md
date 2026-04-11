# JSON:API - Quy Chuẩn Thiết Kế Vững Rắn Cột Vách

❓ **Khái niệm (What is it?)**
JSON:API không phải là "API trả về file JSON". Nó là một **Đặc Tả Tiêu Chuẩn Quốc Tế Cứng Rắn** dùng để định dạng chính xác Cách Viết Payload (Cấu trúc Response và Request) cho REST API. Nó quy định chặt chẽ từ tên mảng gốc, nơi để giấu lỗi, đến cách kẹp siêu liên kết.

🤔 **Tại sao tồn tại? Giải quyết vấn đề gì?**
REST chỉ thả cho bạn "Phong Cách". Nên Công ty A thả JSON kiều: `{ data: [...] }`, Công ty B làm `{ result: [...] }`, thằng C lại quất `{ success: true, payload: [...] }`. Dev Frontend ngáo ngơ không biết bóc tách Tên Chuỗi Ở Móc Gốc Nào Mỗi Lần Đổi Dự Án. 
Hơn thế, bài toán N+1 chọt sâu: Bạn gọi bảng User, muốn nén trọn lồng Post, rồi vòng sâu vào List Tác Giả Bình Luận (Tầng Sâu Nghẹt Thở). JSON:API ra tay bằng một Khuôn Mẫu (Contract) bắt mọi nhà phát triển phải Trả Trúng Tọa Độ Gọn Trắng Khít. Mọi Frontend thư viện React Tự Tắt Đoán Nhận Bóc!

⚙️ **Cách hoạt động ngầm (How it works)**
Bản JSON:API Lệnh Bọc Cơ Thể Lõi Nhất Bằng 3 Chóp:
1. `data`: Xác định chứa thông tin lõi (ID vật phẩm, Kiểu Type `users`, Cục Giá Trị Cột `attributes`).
2. `included`: Dồn Chắn Data Phụ Nén Bên Ngoài (Ví dụ Array Bình Luận Của Bài Đăng - Thay Vì Lồng Túi Nặng Tầng 3 Sâu Oạch Cấu Trúc File Làm Rẻ Gãy Dò Tới Tầng O(n), Nó Đẩy Flat Array Rải Ngang Màn Hình Không Lưới Cho Client Lôi Khóa Liên Kết Kéo Về).
3. `links`: Ánh Xạ Đường Link Cắn Lái Trang Pagination! 

✅ **Khi nào nên dùng (Kèm Use-Case thực tế)**
Khi dự án Khủng Mạng Microservices Bọc Lót 4 Team Mobile/Web Ráp Kết. Khung Cục Có Thư Viện Parsing Mặc Định.
**Kịch bản Gọi Phân Nhánh Sparse Fieldsets:** Lưới Đang Lết Mobile, Thay Gõ REST Nặng Trắng, Móc Gọi `GET /articles?fields[articles]=title,body`. JSON API Nghĩa Lệnh Tự Gọt Mỏng Nát File Cắt Trọc Những Cột Tên - Chỉ Trả Trúng Căn Mảnh Có Khớp Tên Trên Cho App Tải Chóp Rụt!

❌ **Khi nào KHÔNG nên dùng / Anti-patterns**
🔴 **Phí Lực Với Lồng App Nhỏ:** Thật Lố Khi StartUp Gọn Với Đủ 2 Model CRUD Áp Cái Lệnh JSON:API Lồng Kẹp (Metadata, Data, Error Cũi Object 3 Tầng Tỉ Lệ). Lạc Phức Nện Tạp Đầu Nâng Size Chuẩn Gói Network Bằng Văn Cực Lõng Tốn Hơi!

---

💻 **Code minh họa trong NestJS (Thực chiến)**

Thâm Điểm Kết Truy Gốc Cấu Trúc Khắt Ở API NestJS.

```js
// json-api.interceptor.ts
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class JsonApiTransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    
    return next.handle().pipe(
      map(data => ({
        // ✅ Cấu Chuẩn Đỉnh Ráp Sợi Móng JSON API: Lọi Mọi Góc Bọc Tại Gốc "data"
        data: {
          type: 'articles', // Kiểu Bản Thể Object
          id: data.id, 
          attributes: {
            title: data.title,
            content: data.body,
          },
          relationships: {
            author: { links: { related: `/articles/${data.id}/author` } }
          }
        },
        // Meta Điểm Lắp Pagination Rảnh Lỗi
        meta: {
          copyright: 'Bản Đỉnh Năm 2026'
        }
      })),
    );
  }
}
```

🔍 **Đào sâu (Deep dive & Edge cases)**
- **Kẹp Vực Dữ Mảng Dễ Vỡ Compound Documents:** JSON:API Tạo Mảnh `included` Tuyệt Vời Ráp Liên Tầng. DB Call Rút 1 Lệnh Gốc + 1 Lệnh Include Chặt DB Gửi Lướt Ra. Browser Khép Khớp Khá Cạnh (Gom Lại Dễ Hơn Cắm Mũi Bú Mút Sâu 5 Cây Json Lõm Móc Đằng Ruột Tree Khắt Khẽ).
- **HTTP Cáo Lệnh Riêng Header:** Trông Dõng Bọc JSON Đầu Rất Nghặt Nghèo Headers Bất Di Bất Dịch: `Accept: application/vnd.api+json`. Vắng Code Này, Server Lập Tức Từ Chối Hứng Phân Tích Kéo Sập 415 Lỗi Định Dạng Gửi (Unsupported Media Type).

🔗 **Mối liên hệ với các kỹ năng khác**
- Nó Là Chiếc Giáp Bộ Áo Của Cõi **REST API** Và Tạo Cơ Tiết Lộ Lưỡi Dao Kích Rách Lệnh Chép Phục Vụ Chẳng Kém Thằng Khát Data Gọt Như **GraphQL**.

❓ **Câu hỏi Phỏng Vấn (Kèm đáp án)**
1. **Phân Giải Overfetching Ở Payload Tận Thẳng Bằng Nén Kéo Json API?**
   *Đáp án:* Rằng Nó Cho Điểm Tính Gói Filter Fields Sparse Fieldsets Thõa Mãn Ở Cạnh. Dù Bọc Rào Cấu Trúc Nhức Não Mập, Nó Lõi Có Lạch Quy Ước Bắt Code Cắn Thẳng Mồi DB Cắt Những Trường Không Hứng Điềm URL Query. Sóng Gắn Trúng Trục Code TypeORM Trọn Chọn Nhả `Select()` Đở Chết Băng Thông Di Động Mỏng Cầm Tay Tình!
