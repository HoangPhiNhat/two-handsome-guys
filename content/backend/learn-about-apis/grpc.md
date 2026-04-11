# gRPC: Sức mạnh nhị phân xé nát giới hạn JSON

> **Mục tiêu:** Kỷ nguyên Microservices bắt đầu bị nghẽn mạng bởi sự cồng kềnh của JSON REST API qua HTTP/1.1. gRPC là siêu vũ khí của Google để giải bài toán Tốc Độ Liên Dịch Vụ (Inter-service communication) mang âm hưởng Contract-First (Protocol Buffers).

## 1. gRPC khác gì so với REST API?

Nếu REST là gửi thư tay (Tốn giấy, ghi dài dòng, bưu tá rề rà) thì gRPC là một đường truyền cáp quang Morse code với bản mật mã đã biết trước ở 2 đầu.

- **Payload:** Thay vì dùng text chuẩn JSON phình to với các dấu `{} ". ,` gRPC dùng chuẩn mã hoá siêu nén dạng nhị phân **Protocol Buffers (Protobuf)**.
- **Transport:** Ép dùng mìn **HTTP/2**. Mở cánh cửa cho phép "Streaming 2 chiều vô hạn" (Truyền 1 lượng dữ liệu chục MB trong khi cái cống TCP dùng chung ko hề tắc nghẽn - Nhờ tính Multiplexing).
- **Paradigm:** REST ép bạn phải chơi theo Noun (users, items). gRPC là thuần gọi hàm từ xa (Remote Procedure Call). Thiết kế theo động từ hoang dại: `CreateSuperAwesomeTask()`. Ở file code Node.js của service A, bạn gọi lệnh thẳng biến Node.js nhưng thực thi lệnh đó nó ném tít sang Service chạy GoLang ở mạng máy nọ.

## 2. Trái tim của gRPC: The Protocol Buffers (.proto)
Kiến trúc Microservices thường chết nhất bởi lỗi: Backend anh A sửa tên field `userId` thành `user_id` nhưng quên báo ông B. Ông B xài App tạch toàn diện.

gRPC giải quyết bằng file hợp đồng (Contract-first) gọi là file `schema_user.proto`. Nó phi ngôn ngữ. Một file duy nhất, công ty xài Go, Java, TS xài chung 1 file và biên dịch (Compile) ra các Class SDK cứng ngắc.

```protobuf
// Đoạn code protobuf cực sạch
syntax = "proto3";

// Định nghĩa con đường giao thương
service UserBilling {
  rpc ChargeMoney (ChargeRequest) returns (ChargeResponse);
  // Hỗ trợ Server ngậm ống Streaming data trả liên tục về ko đứt API
  rpc WatchBalanceStream (UserReq) returns (stream BalanceStatus);
}

// Struct siêu việt
message ChargeRequest {
  string user_id = 1;      // Tag số 1, ngầm chứa metadata nén 
  double amount_usd = 2;   // Data type cưỡng bức ko đc lăng nhăng Type
}
```
Lúc truyền trên mạng, HTTP chẳng truyền chữ "amount_usd" đi, nó gửi con số "2" và binary nhồi. Tốc độ Parse dữ liệu của gRPC cực kỳ khủng bố (nhanh hơn JSON tới 10-15 lần ở mức CPU deserialization).

## 3. Khó Khăn Của gRPC Trong Sản Xuất
Ngon lành bảo mật thần sầu như vậy, cớ sao ta không đem nó phục vụ thẳng cho cái Web / App ReactJS ở người dùng cuối?
1. **Trình duyệt (Browser) ngậm hành:** API của web (XHR / Fetch) bị limit không có quyền truy cập toàn phần sâu vào Header của lõi giao thức HTTP/2 để thực thi gRPC trực diện. Frontend React/Angular mà gọi `grpc` phải thông qua proxy Envoy / `grpc-web` translation cực kỳ cồng kềnh.
2. **Khó vọc Load Balancer:** gRPC duy trì siêu ống kính HTTP/2 dài dẳng (Long-lived TCP connection). Load Balancer Layer 4 truyền thống (truyền theo TCP gói) sẽ thấy 1 connection khổng lồ ko biết chia cho cụm Server đằng sau. 👉 Build hạ tầng phải dùng hàng tản tải L7 "biết đọc thư" hiện đại.

**Thực tiễn BigTech:** External (Ứng dụng ngoài, Web Mobile) kết nối đập vô API Gateway bằng JSON/REST siêu thân thiện. Tại lớp rào chắn ngầm API Gateway ở trong nhà... nó biến hoá data thành gRPC và gọi nát máy các dịch vụ Node/Go/Rust ở tốc độ ánh sáng.
