# SOAP: Tổ tiên rườm rà nhưng Vững Trãi

> **Mục tiêu:** SOAP (Simple Object Access Protocol) tuy đã bị REST "cướp ngôi" mảng web/mobile nhẹ, nhưng ở Bank, Aviation (Hàng không) hay các hệ thống chính phủ cực cấu trúc, SOAP là độc bản bất tử mà kiến trúc sư cần phải tôn trọng sự chặt chẽ của nó.

## Sự Ngột Ngạt Và An Toàn Của Envelope
Khác với REST chỉ mượn giao thức thao tác (HTTP). SOAP tự nó là bản thể bao chùm, nó định nghĩa mọi quy tắc cực kỳ rắn rỏi qua hệ thống thư từ **Phong Mạng (Envelope)** trên nền **XML**.
Nó không quan tâm bạn xài HTTP, TCP hay cả SMTP (Gửi API qua Email vẫn được). Nhờ cái trò độc lập đó là vì SOAP là chuỗi thông điệp được gói thành chuẩn chung cứng ngắc.

```xml
<?xml version="1.0"?>
<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope">
  <soap:Header>
    <TransactionID>123445HAK</TransactionID> <!-- Tính bảo mật cứng cáp ở header -->
  </soap:Header>
  <soap:Body>
    <m:GiaoDichNganHang>
       <m:SoTien>20000</m:SoTien>
    </m:GiaoDichNganHang>
  </soap:Body>
</soap:Envelope>
```

Đặc Quyền Của SOAP:
- Sinh ra cho hệ thống giao ước cứng mã (WS-Security): Chống rò rỉ cấp quốc gia. Mã hoá từng node (không phải chỉ HTTPS).
- **ACID Transaction qua API (WS-AtomicTransaction):** Đây là con quái vật kinh khủng. Ở REST bạn lỗi giữa chừng, bạn phải viết Code bù trừ Saga (Compensation). Giao thức SOAP trang bị sẳn cỗ máy Atomic, Bank A trừ tiền, Bank B nhận tiền đứt bóng ở giữa chừng, SOAP tự bắt Rollback. REST KHÔNG có tính năng gốc gác này. Mọi doanh nghiệp Bank bám rễ vào nó là vì lẽ đó.
