# HATEOAS: Vinh quang của REST Level 3

HATEOAS (Hypermedia As The Engine Of Application State) – nghe lú mề như kinh thánh học viện thuật!
Thực tế đây chính là đỉnh cao chóp của **REST API (Level 3 - Richardson Maturity Model)**. 

## Tư duy điều hướng thông qua Tình Trạng
Ở API thông thường, bạn trả về chi tiết Tài khoản ngân hàng, user phải Tự Biết (hardcode) rằng để nộp tiền thì phải gọi URL `/deposit`. Cực kì cạn tính năng, lỡ ngày nào đó Bank khóa nút Nộp tiền thì Frontend trên Mobile làm cách nào biết? Họ phải update App đẩy lên Appstore rất là khổ cực.

**HATEOAS ra tay giải cứu:** 
Backend cung cấp thêm các "hành vi khả dụng" dựa theo trạng thái tài khoản.
Nếu tài khoản Bị Khóa:
```json
{
  "account_id": "123",
  "balance": 100,
  "status": "locked",
  "links": [
    { "rel": "self", "href": "/accounts/123" },
    { "rel": "unlock", "href": "/accounts/123/unlock" }
  ]
}
```
Lúc này Frontend KHÔNG CẦN quan tâm hardcode. Nó chỉ đọc `links` và thấy "A, được phép Unlock", Thế là nút bấm sáng lên, và Action URL móc thẳng vào `href`. Giả sử hệ thống tháo nút Unlock đi thì UI cũng bốc hơi cái Link theo, người dùng không chọc ngoáy ngu ngốc. 

Kiến trúc cực đỉnh cao của trạng thái Application điều khiển bằng Data (Hypermedia). Nó giống y hệt như việc bạn duyệt trình duyệt Web bằng chữ Link màu xanh trên Wiki vậy! Khám phá bất tận không cần tài liệu!
