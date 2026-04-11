# Hiểu Sâu Về DNS (DNS and how it works?)

❓ **Khái niệm (What is it?)**
DNS (Domain Name System) là "danh bạ điện thoại" của Internet. Con người nhớ và truy cập các trang web thông qua tên miền (như `google.com`), nhưng máy tính và các bộ định tuyến lại giao tiếp bằng các dãy số IP IP (như `142.250.190.46`). DNS làm nhiệm vụ dịch các tên miền dễ đọc thành địa chỉ IP tĩnh để trình duyệt có thể tải tài nguyên Internet.

🤔 **Tại sao tồn tại? Giải quyết vấn đề gì?**
Hãy thử tưởng tượng nếu danh bạ điện thoại của bạn bị xóa sạch, bạn phải nhớ hàng trăm dãy số 10 chữ số của bạn bè. Internet cũng vậy, các địa chỉ IP cực kỳ khó nhớ (đặc biệt là IPv6 dài ngoằng). Quan trọng hơn, IP của một máy chủ có thể thay đổi khi hệ thống chuyển đổi qua lại giữa các trung tâm dữ liệu (datacenter). DNS tách biệt tên gọi ra khỏi vị trí vật lý, cho phép bạn đổi máy chủ thoải mái mà tên miền không hề suy suyển.

⚙️ **Cách hoạt động ngầm (How it works)**
Quá trình phân giải DNS không phải gọi 1 server là xong, nó là một chuỗi hành trình tìm kiếm ngược:
1. **Trình duyệt & OS Cache:** Khi nhập `api.company.com`, trình duyệt hoặc Hệ điều hành máy bạn sẽ kiểm tra bộ đệm ngầm (Cache) xem có lới nhớ cũ không.
2. **DNS Resolver (Nhà cung cấp mạng ISP):** Nếu không có, máy tính gọi đến máy chủ DNS của FPT/Viettel.
3. **Root Nameserver:** Nếu ISP không biết, nó lóc cóc chạy tới hỏi máy chủ Gốc (`.`). Máy chủ Gốc nói "Tao không biết, nhưng hãy qua hỏi máy chủ quản lý đuôi `.com`".
4. **TLD Nameserver:** Máy chủ `.com` lại nói "Tao không có IP, nhưng tao biết thằng NameCheap đang quản lý tên miền `company.com`".
5. **Authoritative Nameserver:** Cuối cùng, tín hiệu chạy đến Nameserver của NameCheap/Cloudflare (nơi bạn cấu hình DNS lúc mua tên miền). Máy chủ này giở sổ ra và dõng dạc trả về bản ghi chữ A (A Record) chứa địa chỉ IP `192.168.1.1` cuối cùng.

✅ **Khi nào nên dùng (Kèm Use-Case thực tế)**
Bạn bắt buộc phải hiểu và dùng **DNS Routing Policy** (Định tuyến DNS) khi xử lý bài toán Scaling.
**Kịch bản:** Bạn có 1 API Server ở Mỹ và 1 API Server ở Nhật. Khi khách hàng ở Việt Nam truy cập, bạn muốn họ gọi Server Nhật cho nhanh.
**Giải pháp:** Bạn mua dịch vụ DNS của Route53 (AWS) hoặc Cloudflare, thiết lập bản ghi **Geolocation Routing**. Khi truy vấn DNS được bắn ra từ IP Việt Nam, DNS server lập tức lọc và trả về cấu hình IP của Server bên Nhật, còn khách Mỹ gọi sẽ nhận IP Mỹ. DNS gánh trọn việc điều hướng lưu lượng trước khi máy chủ Backend phải làm việc.

❌ **Khi nào KHÔNG nên dùng / Anti-patterns**
🔴 **Sai lầm:** Cache tĩnh độ phân giải DNS trên Server quá lâu (TTL siêu dài).
Nếu NestJS app của bạn chọc vào kết nối cơ sở dữ liệu `db-cluster.us-east.rds.com`, nhưng OS Linux hoặc code Node.js của bạn cache cái địa chỉ IP đó vĩnh viễn (DNS TTL bị phớt lờ). Đến khi máy chủ DB bên AWS bị sụp, AWS lập tức kích hoạt cụm DB phụ và đổi IP ngầm của cái tên miền đó đi. Hệ thống NestJS của bạn vẫn kiên quyết lao đầu bắn Query vào cái IP cũ (do dính Cache), gây ra hàng loạt lỗi `Connection Timeout`.

💻 **Code minh họa trong NestJS (Thực chiến)**
Trong NestJS, Node.js mặc định sử dụng module `dns` của thư viện C `c-ares`. Chúng ta phải hiểu cách nó giải quyết hostname qua code.

```js
// dns-check.service.ts
import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import * as dns from 'dns';
import { promisify } from 'util';

// Biến hàm callback của thư viện cơ sở thành hàm Promise chuẩn hiện đại
const resolveSrv = promisify(dns.resolveSrv);
const resolve4 = promisify(dns.resolve4);

@Injectable()
export class NetworkVerificationService {
  private readonly logger = new Logger(NetworkVerificationService.name);

  // ✅ Đúng: Thẩm định xem Tên Miền Cổng Thanh Toán có đang nháy đèn (Sống qua IP) không
  async verifyPaymentGatewayStatus(domain: string): Promise<string[]> {
    try {
      // Hàm này ép Node.js phải gởi truy vấn DNS thật sự (bỏ qua file /etc/hosts cục bộ)
      // Lấy địa chỉ IPv4 (Bản ghi A Record)
      const ipAddresses = await resolve4(domain);
      this.logger.log(`Tên miền ${domain} tương ứng với ${ipAddresses.length} IP(s).`);
      return ipAddresses;
    } catch (error) {
      if (error.code === 'ENOTFOUND') {
        this.logger.error(`DNS báo lỗi: Không tìm thấy tên miền ${domain}`);
        throw new InternalServerErrorException('Payment provider is unreachable');
      }
      throw error;
    }
  }

  // 💡 Pro tip: Khám phá kiến trúc Microservices qua Bản Ghi SRV
  // Khi dùng service mesh (như Consul hoặc K8s), các dịch vụ tìm nhau 
  // không phải qua A record, mà qua SRV record (Bản ghi dịch vụ gồm IP + Cổng)
  async discoverInternalService(serviceName: string) {
    try {
      // Giả sử gọi: _auth._tcp.internal.mycompany.local
      const records = await resolveSrv(serviceName);
      
      // Xếp hạng trích xuất máy chủ ưu tiên nhất
      records.sort((a, b) => a.priority - b.priority || b.weight - a.weight);
      
      return `http://${records[0].name}:${records[0].port}`;
    } catch (error) {
      this.logger.error('Service Discovery Failed');
    }
  }
}
```

🔍 **Đào sâu (Deep dive & Edge cases)**
- **Thảm họa DNS Cache Poisoning:** Nếu DNS Resolver bị hack xâm nhập giả mạo phản hồi chèn IP xấu (VD: `bank.com` trỏ qua IP `1.1.1.1` của hacker), khi nhập tên đúng bạn vẫn vào web giả ngụy trang y hệt web ngân hàng. Việc bắt buộc xài **HTTPS/SSL** xử lý lớp này do hacker không có File Chứng Chỉ bảo mật để mạo danh cái khóa xanh (Green Padlock) của ngân hàng thật.
- **Node.js HTTP Agent Caching (Nguy hiểm ngầm):** Mặc định Axios/Fetch trong Node.js sử dụng Connection Pooling (gom kết nối). Nếu Socket vẫn "Keep-Alive", thì dù bản ghi DNS trên mây đã đổi, Socket cũ đã chốt IP vẫn được tận dụng xài sướng tay. Phải rất cẩn thận khi kết nối với các hệ lưu trữ động.

🔗 **Mối liên hệ với các kỹ năng khác**
- Nó đứng trước **Domain Name** và là cỗ máy điều tiết mấu chốt của **Load Balancer (Nginx)** hay **CDN**.

❓ **Câu hỏi Phỏng Vấn (Kèm đáp án)**
1. **Phân biệt A Record, CNAME Rercord và MX Record?**
   *Đáp án:* `A Record` dùng để trỏ thẳng tên miền vào trực tiếp một địa chỉ số IPv4. `CNAME Record` dùng để gán bí danh, lấy tên miền này trỏ bóng qua một tên miền khác (ví dụ `www.abc.com` trỏ về `abc.com`). `MX Record` dùng cho cấu hình hệ thống Mail, báo hiệu "hễ có Email gửi tới tên miền này, hãy tạt luồng tín hiệu qua hệ thống mail server này".
2. **TTL trong DNS là gì? Nếu bạn lỡ trỏ sai IP và muốn sửa nhanh làm sao để cứu Server?**
   *Đáp án:* TTL (Time To Live) là thời gian duy trì bộ nhớ đệm (Cache) tính bằng giây. Nếu TTL là 86400 (1 ngày), khi lỡ trỏ sai IP, bạn sửa lại đúng, thì ai đã trót truy cập sẽ bị Dính Bộ Nhớ Rác và không vào được 1 ngày chờ xoá sổ cache. Đáp án khắc phục là bạn phải giảm cái TTL xuống cực nhỏ (5 phút - 300s) ngay từ đầu nếu dự trù có đợt di tản Máy Server.
3. **Mã lỗi ERR_NAME_NOT_RESOLVED ở trình duyệt mô tả gì?**
   *Đáp án:* Nó xảy ra ngay khâu đầu tiên, báo hiệu Trình duyệt đã gọi tổng đài DNS nhưng trả về tay trắng (không tìm ra A Record nào đính với tên miền đó cả). Việc này không dính dáng gì tới Backend Code sụp hay Nginx lỗi. Nguyên do 1 là nhà mạng bị mất điện (cáp quang lủng), hoặc 2 là cấu hình quên chưa mua domain/trỏ domain.
