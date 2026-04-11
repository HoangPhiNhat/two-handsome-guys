# Hiểu Ngọn Ngành Về Internet (How does the Internet work?)

❓ **Khái niệm (What is it?)**
Internet là mạng lưới khổng lồ kết nối hàng tỷ máy tính và thiết bị trên toàn cầu, hoạt động dựa trên bộ giao thức quy chuẩn TCP/IP. Hãy tưởng tượng nó như hệ thống giao thông vận tải toàn cầu: cáp quang dưới đáy đại dương là các đại lộ, router định tuyến là các vòng xuyến giao thông, và gói tin (packet) chính là những chiếc xe tải chở dữ liệu.

🤔 **Tại sao tồn tại? Giải quyết vấn đề gì?**
Trước khi Internet (hay mạng tiền thân ARPANET) ra đời, các máy chủ bị cô lập tĩnh. Muốn chia sẻ 10MB dữ liệu, kỹ sư phải vác ổ đĩa mềm hoặc băng từ chạy từ máy bay này sang máy tính khác (Sneakernet). Hệ thống mạng phân tán phi tập trung của Internet giải quyết bài toán giao tiếp tức thời, với khả năng tự tìm đường thay thế nếu một đường truyền bị đứt.

⚙️ **Cách hoạt động ngầm (How it works)**
Khi backend NestJS của bạn bắn một mẩu tin JSON đi, luồng thực tiễn diễn ra:
1. **Application Layer (Tầng ứng dụng):** NodeJS/Express đóng gói file JSON vào payload của HTTP.
2. **Transport Layer (Tầng giao vận - TCP):** Dữ liệu bị băm nhỏ thành các đoạn (segment). TCP chịu trách nhiệm khắt khe: đánh số thứ tự từng kiện hàng, bắt máy chủ đích phải ký nhận (ACK) khi nhận được. Nếu mất? TCP gửi lại ngay lập tức.
3. **Internet Layer (Tầng mạng - IP):** Đóng gói thành Packet, dán mác "IP người gửi" và "IP người nhận". 
4. Các Router cấp quốc gia sử dụng thuật toán BGP (Border Gateway Protocol) để tính đường ngắn nhất truyền luồng ánh sáng cáp quang đi châu lục khác.

✅ **Khi nào nên dùng (Kèm Use-Case thực tế)**
Bạn liên tục "dùng" Internet, nhưng phải hiểu **Độ trễ vật lý (Latency)** để ra quyết định kiến trúc.
**Kịch bản:** Con server NestJS nằm ở Mĩ (`us-east-1`), người dùng mua hàng ở Việt Nam. Khúc cáp quang xuyên Thái Bình Dương tốn mất 200ms (1 phần 5 giây) cho một vòng đi về. Thay vì thiết kế Frontend gọi 5 API nối tiếp (waterfall - mất tổng 1 giây chỉ để chờ mạng), bạn phải gộp (batch) lại thành 1 API duy nhất trả về Toàn Bộ Dữ Liệu!

❌ **Khi nào KHÔNG nên dùng / Anti-patterns**
🔴 **Sai lầm:** "Fallacy of Distributed Computing" - Tin rằng mạng luôn hoàn hảo và siêu nhanh. Dev tay ngang hay gọi API bên thứ ba (vd: Cổng thanh toán) mà không hề thiết lập Timeout (thời gian chờ tối đa). Nếu BGP rớt nhịp, luồng mạng mất hút, con Thread NodeJs của bạn sẽ ngồi chờ đến ngày tận thế, phá sập RAM hệ thống.

💻 **Code minh họa trong NestJS (Thực chiến)**
Đối mặt với sự rớt mạng và đường truyền vật lý bất định thông qua NestJS `HttpModule`.

```js
// app.module.ts
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PaymentService } from './payment.service';

@Module({
  imports: [
    // ✅ Đúng: Luôn khai báo Timeout (5s) chặn đứng rủi ro rớt luồng cáp quang
    // Nếu mạng chập chờn, API sẽ chủ động ném lỗi để giải phóng bộ nhớ
    HttpModule.register({
      timeout: 5000, 
      maxRedirects: 3,
    }),
  ],
  providers: [PaymentService],
})
export class AppModule {}
```

```js
// payment.service.ts
import { Injectable, Logger, RequestTimeoutException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom, retry } from 'rxjs';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);
  constructor(private readonly httpService: HttpService) {}

  async processPayment(orderId: string, amount: number) {
    const payload = { orderId, amount };

    // 🔴 Sai: Kêu API mù quáng, không bọc try-catch mạng
    // const response = await firstValueFrom(this.httpService.post('https://api.stripe.com/charge', payload));

    // ✅ Đúng: Xử lý đứt gãy Internet bằng chiến thuật Retry (Thử lại)
    try {
      const response = await firstValueFrom(
        this.httpService.post('https://api.stripe.com/charge', payload).pipe(
          // Trạm mạng quá tải mất gói tin, hãy âm thầm gửi lại 3 lần trước khi bỏ cuộc
          retry(3),
          catchError((error) => {
            this.logger.error(`Đứt cáp lúc gọi Stripe: ${error.message}`);
            throw new RequestTimeoutException('Hệ thống thanh toán đang gián đoạn mạng');
          }),
        ),
      );
      return response.data;
    } catch (error) {
      // Bắn thông báo về Queue hoăc lưu Data chờ chạy lại
      throw error;
    }
  }
}
```

🔍 **Đào sâu (Deep dive & Edge cases)**
- **MTU (Maximum Transmission Unit):** Chuẩn gói tin trên Internet chứa được 1500 byte. Nếu server NestJS trả về cục JSON bự 3000 byte, TCP buộc phải cưa nó thành 2 gói. Nếu gói 1 đến nơi, gói 2 bị thất lạc, hệ thống bị nghẽn mạch (Head-of-Line Blocking) chờ TCP gửi bù gói 2 thì file JSON mới parse được. 
- **Thiết lập DNS rác (BGP Hijacking):** Router cấp thế giới tin tưởng lẫn nhau. Nếu 1 nhà cung cấp cấu hình định tuyến sai, họ có thể "hút" sạch traffic Internet (Mạng Amazon từng bị rớt toàn bộ chỉ vì 1 bảng tính sai ở Mỹ).

🔗 **Mối liên hệ với các kỹ năng khác**
- Cội nguồn của mọi thiết kế **DNS**, **CDNs**, **WebSockets**, và đặc tính Stateful/Stateless của **HTTP**.

❓ **Câu hỏi Phỏng Vấn (Kèm đáp án)**
1. **TCP khác UDP ở điểm nào trong lớp Giao Vận (Transport)?**
   *Đáp án:* TCP là kết nối đảm bảo, 2 bên ngầm bắt tay 3 bước (3-way handshake) trước khi truyền để chắc chắn data đi đến nơi theo đúng thứ tự, có sai sẽ tự chép lại. UDP vứt bỏ hoàn toàn xác nhận, bắn data liên tục qua mạng (Fire-and-forget), mất gói thì bỏ qua. TCP dùng cho Call API/Web, UDP xài cho Video Livestream hay Chơi Game Online cực nhanh.
2. **Nếu anh ping tới server trong mạng LAN mất 1ms, nhưng luồng kết nối TCP HTTP tốn tới 3ms. Tại sao?**
   *Đáp án:* Do cơ chế TCP 3-way Handshake. Máy tính phải Gửi `SYN` (1ms đi), nhận `SYN-ACK` (1ms về), và chốt `ACK` (1ms đi) tạo ra 3 vòng lặp thời gian truyền tải vật lý trước khi cục Data HTTP thật sự được rót ra.
3. **Trace route là lệnh gì?**
   *Đáp án:* Là cung cụ kiểm tra xem cục dữ liệu mạng (packet) phải nhảy qua bao nhiêu Trạm Đổi Chuyến (Hops / Routers) trước khi đáp tới Server đích, giúp dò tiệm hỏng hóc hoặc cáp đứt nằm ở node nào.
