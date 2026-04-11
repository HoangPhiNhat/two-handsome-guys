# Redis: Siêu Cơ Sở Dữ Liệu Trên Bộ Nhớ (In-Memory Datastore)

❓ **Khái niệm (What is it?)**
Redis (Remote Dictionary Server) là một hệ quản trị cơ sở dữ liệu NoSQL mã nguồn mở, hoạt động hoàn toàn trên bộ nhớ RAM (In-Memory). Khác với cơ sở dữ liệu truyền thống (như PostgreSQL, MySQL) phải đọc/ghi dữ liệu xoay vòng trên ổ cứng vật lý (SSD/HDD), Redis lưu trữ và truy xuất trực tiếp từ RAM, mang lại tốc độ phản hồi tính bằng Micro-giây (Dưới 1ms). Redis hỗ trợ nhiều cấu trúc dữ liệu mạnh mẽ, không chỉ là cơ chế Key-Value đơn thuần.

🤔 **Tại sao tồn tại? Giải quyết vấn đề gì?**
Cơ sở dữ liệu truyền thống vấp phải rào cản tốc độ vật lý (Disk I/O Bottleneck). Khi hệ thống đối mặt với hàng triệu truy vấn/giây (Ví dụ: Giỏ hàng sự kiện Flash Sale, Bảng xếp hạng Game toàn cầu), việc chọc vào ổ cứng SSD liên tục sẽ làm hệ thống quá tải và sập nguồn (Crash).
Redis ra đời đóng vai trò là Lớp Đệm Bộ Nhớ (Caching Layer), đứng chắn trước Cơ Sở Dữ Liệu gốc. Thay vì chạy các câu lệnh SQL phức tạp tốn 50ms, Backend sẽ hỏi Redis trước, nhận kết quả trong 0.2ms. Giúp kiến trúc mạng chịu tải Gấp 100 lần.

⚙️ **Kiến trúc cốt lõi (Core Architecture)**
Sự vĩ đại của Redis nằm ở thiết kế **Single-Threaded Event Loop (Vòng lặp sự kiện Đơn luồng)** kết hợp Multiplexing (Giống hệt kiến trúc lõi của Node.js).
Nhiều người thắc mắc: "Tại sao xử lý hàng triệu request mà dùng Đơn Luồng thay vì Đa Luồng (Multi-threading)?". 
1. Vì tốc độ đọc/ghi RAM quá khủng khiếp, điểm nghẽn không nằm ở tính toán CPU, mà nằm ở Băng thông Mạng (Network throughput) và Dung lượng RAM.
2. Hoạt động trên một Luồng duy nhất loại bỏ hoàn toàn chi phí đắt đỏ của Context Switching (Chuyển đổi luồng liên tục của CPU) và tuyệt đối ngăn chặn các lỗi Race Condition, Deadlock (Xung đột khóa dữ liệu khi 2 luồng cùng ghi đè). Đảm bảo tính nhất quán dữ liệu ở mức nguyên tử (Atomic).

📚 **9 Cấu trúc dữ liệu cốt lõi (Data Types) & Các hàm tối quan trọng**
Khác với Memcached chỉ lưu Chuỗi thô (String), Redis cài đặt sẵn các bộ thuật toán Cấu trúc dữ liệu bằng ngôn ngữ C. Mỗi cấu trúc có các bộ lênh (Commands) riêng (Redis sở hữu hơn 250+ commands):

**1. Strings (Chuỗi)**
Cấu trúc cơ bản nhất, lưu số, chữ, blob hình, tối đa 512MB/1 value. Dùng để Caching JSON, Session hoặc biến đếm Counter.
- `SET key value`: Lưu trữ dữ liệu.
- `GET key`: Lấy dữ liệu.
- `GETDEL key`: Lấy và xóa luôn key ngay lúc đó (tốt cho One-time Token).
- `MSET k1 v1 k2 v2` / `MGET k1 k2`: Lưu/Đọc nhiều keys cùng lúc (Batching giảm thiểu Network latency).
- `INCR key` / `DECR key`: Tăng/Giảm biến đếm 1 đơn vị cực an toàn Atomic (Dùng làm Rate Limiting).
- `SETEX key seconds value`: Lưu kèm thời gian tự hủy (TTL).

**2. Hashes (Bảng băm/Object)**
Lưu một Map các Field-Value (Giống JSON Object 1 lớp). Rất tốt để lưu Object User.
- `HSET user:1 name "Huy" age 30`: Cài dặt biến.
- `HGET user:1 name`: Lấy riêng tên "Huy".
- `HGETALL user:1`: Lấy toàn bộ mảng.
- `HINCRBY user:1 age 1`: Tăng tuổi lên 1 mà không cần phải đụng chạm tên.

**3. Lists (Danh sách liên kết Đôi - Linked Lists)**
Dãy mảng các String liên kết 2 đầu. Rất mạnh để làm Hàng Đợi (Message Queue) hoặc Timeline Newsfeed vòng tròn.
- `LPUSH / RPUSH`: Nhét 1 phần tử vào đầu/cuối List. O(1).
- `LPOP / RPOP`: Lấy và xóa 1 phần tử khỏi đầu/cuối List.
- `LRANGE mylist 0 10`: Lấy từ vị trí 0 đến 10.
- `BLPOP mylist 0`: (Tuyệt kỹ) - Chờ chực LPOP. Nếu list rỗng, nó chặn kết nối đứng đợi tới khi có data (Giống hệt mô hình Consumer Queue RabbitMQ).

**4. Sets (Tập hợp Không Trùng Lặp)**
Danh sách vô hướng (Không xếp theo thứ tự) chứa các String không bao giờ lặp lại (Tính chất toán tử Set). Thích hợp đếm danh sách IP Unique, Quản lý Tag, Tình trạng Theo dõi/Followers.
- `SADD tags "backend" "js"`: Thêm vào Set.
- `SMEMBERS tags`: Lọc toàn bộ.
- `SISMEMBER tags "js"`: Check xem "js" có tồn tại k O(1). Rất nhanh.
- `SINTER set1 set2`: TÌM giao điểm tập hợp. Ví dụ: SINTER "follower:Huy" "follower:Binh" -> Ra danh sách Bạn bè chung (Mutual Friends). SQL phải nát cả DB mới Join ra được.

**5. Sorted Sets (ZSET - Tập hợp Có Điểm Số)**
Tuyệt tác của Redis. Một Set kèm mảng biến số (Score). Nó tự động sắp xếp Log(N) vị trí mỗi khi có data mới. Áp dụng: Game Leaderboard (Bảng xếp hạng), Thời gian đặt vé.
- `ZADD leaderboard 500 "Huy" 1000 "Binh"`: Thêm binh 1k điểm.
- `ZRANGE leaderboard 0 -1`: Lấy danh sách từ dưới lên.
- `ZREVRANGE leaderboard 0 9 WITHSCORES`: Lấy Top 10 cao nhất thế giới cùng điểm số.
- `ZRANK leaderboard "Huy"`: Xem hạng hiển tại của Huy.

**6. Bitmaps**
Map thao tác dữ liệu Nhị phân (Array of bits). Lưu trữ bằng Bit 0/1. Giúp lưu mảng Boolean quy mô Siêu Khủng lồ Tiết Kiệm bộ nhớ (VD: Đếm lượt Online Daily Active User của 100 triệu người ngốn đúng 12MB RAM).
- `SETBIT user_active:2026_04_11 8129 1`: Đánh dấu User ID số 8129 đã Online hôm qua.
- `BITCOUNT user_active:2026_04_11`: Trả ngay đếm tổng có bao nhiêu bit 1 (Bao nhiêu người online).

**7. HyperLogLog**
Thuật toán ước lượng lượng Cardinality (Sô lượng phần tử duy nhất). Đếm hàng Tỷ ID Unique mà chỉ tốn Cứng Cáp 12KB RAM cố định. Sai số cực nhỏ 0.81%. (Dùng đếm số lượt View Youtube).
- `PFADD views "192.168.1.1"`: Đọc IP view video.
- `PFCOUNT views`: Hỏi số view. 

**8. Geospatial (Bản đồ Không gian)**
Chứa Tọa độ Kinh/Vĩ Độ. Dành cho các App bản đồ (Grab, Tinder).
- `GEOADD drivers 106.629 10.823 "Grab_Xe_01"`: Báo vị trí của grab.
- `GEORADIUS drivers 106.6 10.8 5 km`: Xin app tìm tài xế bán kính 5km trong 0.5ms!

**9. Streams**
Đối thủ của Kafka. Đây là cấu trúc dữ liệu Append-Only (Ghi gắn thêm liên tiếp) dùng để xây Event-Sourcing, Xử lý Log sự kiện tuần tự khổng lồ.
- `XADD mystream * msg "Hello"`: Bắn msg.
- `XREAD GROUP`: Tạo nhóm tiêu thụ phân tải.

🔥 **Các Tính Năng Kiến Trúc Cao Cấp**
- **Sự Bền bỉ (Persistence - RDB & AOF):** Mặc dù chạy trên RAM, thiết bị cúp điện là mất, Redis thiết kế hệ tự động backup dữ liệu vào ổ đĩa.
  - `RDB (Redis Database)`: Snapshot, chụp ảnh toàn bộ RAM định kỳ (VD: mỗi 5 phút) nén cục lưu xuống đĩa. Khởi động lại load rất nhanh nhưng dễ mất 5 phút dữ liệu cuối.
  - `AOF (Append Only File)`: Ghi lại MỌI dòng command SET/GET/INCR vào file Text trên ổ cứng 1 cách liên tục. Phục hồi không xót 1 giây.
- **Pub/Sub:** Cấu trúc Truyền tin Realtime bằng WebSockets. Redis đóng cổng Trung gian chia mảng `PUBLISH channel message` cho hàm trăm Subscriber. Rất tốt làm App Chat (Tuy nhiên Pub/Sub là quên lãng hỏa mù, client ngắt kết nối là mất tin, cần chắc cú thì xài Redis Streams).
- **Transactions & Lua Scripts:** Redis cung cấp khối lệnh `MULTI` và `EXEC` để gộp 5 lệnh SET/GET vào làm 1. Đặc biệt mạnh mẽ là `EVAL`, bạn nhúng mã nguồn Lua Scripts đẩy thẳng lên Redis Server chạy để khóa cứng tính mạch nguyên tử (Atomic) kết hợp logic của 10 lệnh cực sâu.
- **Topology (Các mô hình triển khai Cụm Máy):**
   - *Standalone:* 1 Node.
   - *Redis Sentinel:* High Availability (Tự động giám sát). Nếu Node Master chết, 3 giây sau nó bầu Node Slave lên làm Master tự động. 
   - *Redis Cluster:* Phân mảng 1000GB dữ liệu chia đều cho 10 máy nhỏ (Sharding kiến trúc lớn).

❌ **Khi nào KHÔNG nên dùng / Anti-patterns**
🔴 **Bệnh OOM (Out of memory) & Lưới Lập Lọc Quét Khóa Toàn Cục:**
Tuyệt đối KHÔNG chạy lệnh `KEYS *` (Lấy mảng toàn bộ hàng triệu Data) trên Cụm Mạng Producton. Vì Redis Single-Threaded, lệnh này tốn 30 giây để kéo 10 Triệu Key và trong 30s đó, Hàng vạn Client truy cập web bạn đều bị Tắc nghẽn sụp đứng ngắt kết nối Timeout chết sạch Website! Phải dùng lệnh Rê Phân mảng (SCAN) để tải dữ liệu lách từ từ. Hơn nữa, Phải luôn setup cấu hình đá Rác ra Khỏi Cửa Bằng `maxmemory-policy allkeys-lru` để RAM luôn rỗng mảng.

---

💻 **Code minh họa trong NestJS (Thực chiến Lên Tầm Middleware Không Rác)**

Code Redis Cache áp dụng Rate Limiting trong NestJs (Không Dùng thư viện Cache chung mà bọc thẳng IORedis).

```js
// rate-limit-redis.guard.ts
import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';

@Injectable()
export class RedisThrottlerGuard implements CanActivate {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const clientIp = request.ip;
    const redisKey = `rate_limit:${clientIp}`;
    
    const limit = 10; // Cầm 10 requests / 1 phút

    // ✅ Best Practice: Đẩy lệnh vào Pipeline để chạy gộp thành Khối Atomic
    // Nếu chạy 3 lệnh await (INCR, EXPIRE, GET) Rời rạc, Hệ thống chịu đứt Network 3 nhịp gây trễ Latency
    const result = await this.redis
      .multi() // Khởi Động Transaction
      .incr(redisKey) // Tăng đếm IP Này
      .expire(redisKey, 60, 'NX') // Cài Thời Rớt 60 giây (Chỉ báo Giấy Giờ Ở 1 Lần Trượt Đầu - Lệnh EX NX)
      .exec(); // Gói Gởi Đi Thực Hành Ở Redis Cụ Của!

    const currentRequests = result[0][1] as number; // Trả Từ Khối INCR

    if (currentRequests > limit) {
      throw new HttpException('Đứt Mạch Hệ Thống - Spam Quá Trớn', HttpStatus.TOO_MANY_REQUESTS);
    }
    return true;
  }
}
```

🔍 **Đào sâu (Deep dive & Edge cases)**
- **Cash Stampede & Cache Thundering Herd:** Mảng Lỗi Lực Này Rất Sâu Ở Big-Tech. Cả Triệu User Truy Cập Đúng 12:00:00 Khi Điểm Redis Key bị Xóa Sống (Expired). Redis Không Còn Code Đủ Phá Giáp Đỡ Nữa. Triệu User Gảy HTTP Dồn Trống Văng Call Gọi Xuống MySQL Bão Hoặc Postgres Sập Điện Bạo Loạn Chết Đứng. Các Dev Phán Lập Bảng (Sử dụng Mutex Lock / Trạch Khóa Tạm): Con API Tiên Phong Xuống Đầu Tiên Sẽ Set Vào Redis Lệnh Trác Giới Block Chờ Điểm (`SET lock_key 1 NX EX 5`). 99.999 Khách Còn Lại Phát Hiện Khóa Lock -> Sẽ Nằm Ngủ Timeout Đợi Khoảng 50ms Sau Để Con Tiên Phong Gọi Xong Lắp Trả DB Gói Chừa Trống Đẩy Giã Bề!!.

🔗 **Mối liên hệ với các kỹ năng khác**
- Nó đóng vai bộ nhớ siêu thanh chặn mạng đứt giáp và làm xương sống đai kẹp của Hệ cấu Trúc Caching (Đối trọng Memcached) Và Hệ Thông Authentication Opaque Token Session Kẹp Vòng Ở Nhòm API Network Lõi.

❓ **Câu hỏi Phỏng Vấn (Kèm đáp án)**
1. **Bạn nhồi một Value chuỗi JSON cực lớn (Cỡ 500 MB) vào một Key duy nhất trong Redis, hiệu năng có sập hầm không?**
   *Đáp án:* Sập hoàn toàn mạng lõi (Event Loop Blocked). Vấn Đề Lớn Đây vì Redis chạy cơ cấu Đơn Luồng (Single-Thread). Mặc dù nó hỗ trợ Key lưu tới 512MB, nhưng việc đẩy 500MB qua mạng Network TCP tốn mất 3 Giây Băng Sóng. Vòng Event Loop của Redis sẽ đứng yên trong 3 giây đó, làm đóng băng toàn bộ hàng chục ngàn Request GET/SET bé li ti khác của User, Gây nghẽn cổ chai cục bộ mạng đứt. Phải xẻ JSON 500MB thành Chunk, hoặc dùng DB Tĩnh, Cấu Tự Vệ Nhỏ Data Lôi 1 Lỗi Redis Size Đẹp (<1MB).
