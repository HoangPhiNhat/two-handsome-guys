# Knowledge Hub - Hệ thống tài liệu học tập lập trình

Dự án này là một nền tảng tài liệu học tập được xây dựng theo phong cách **Zero Build Step**, sử dụng Vanilla HTML/JS/CSS và Tailwind CSS (via CDN).

## 🚀 Cách chạy dự án

Vì dự án sử dụng `fetch()` để tải dữ liệu từ các file JSON, bạn cần chạy qua một web server cục bộ (local server) để tránh lỗi CORS (Cross-Origin Resource Sharing).

### Cách 1: Sử dụng Node.js (Khuyên dùng)

Nếu bạn đã cài đặt Node.js, bạn có thể chạy lệnh sau trong thư mục gốc của dự án:

```bash
npx serve -l 8080
```

Sau đó, mở trình duyệt và truy cập: `http://localhost:8080`

### Cách 2: Sử dụng Python

Nếu bạn có Python, hãy chạy:

```bash
# Python 3.x
python -m http.server 8080
```

Sau đó, mở: `http://localhost:8080`

### Cách 3: Sử dụng Live Server (VS Code Extension)

1. Cài đặt extension **Live Server** trên VS Code.
2. Nhấn chuột phải vào file `index.html`.
3. Chọn **Open with Live Server**.

---

## 🏗️ Cấu trúc dự án

- `index.html`: Shell chính của ứng dụng (SPA).
- `assets/js/`: Logic của ứng dụng (Router, Renderer, Search).
- `assets/css/`: Style tùy chỉnh và biến CSS cho Dark Mode.
- `data/`: Data layer (config, menu, modules, search index).
- `data/modules/`: Metadata module (không nhúng full nội dung bài).
- `content/`: Nội dung bài viết dạng Markdown.
- `scripts/build-index.js`: Script local sinh `data/search-index.json` từ Markdown.

## 🧭 Workflow thêm bài mới

1. Tạo file Markdown mới trong `content/...`.
2. Thêm section metadata vào `data/modules/<module>.json` với trường `path` trỏ đến file `.md`.
3. Chạy lệnh sau để cập nhật chỉ mục tìm kiếm:

```bash
node scripts/build-index.js
```

## 🛠️ Công nghệ sử dụng

- **Styling**: Tailwind CSS (CDN).
- **Icons**: Lucide Icons.
- **Markdown**: Marked.js (Chuyển đổi Content JSON sang HTML).
- **Highlighting**: Prism.js (Hiển thị code block đẹp mắt).
