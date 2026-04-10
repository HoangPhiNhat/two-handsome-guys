# 🎯 PROJECT OVERVIEW

### Tên dự án

**Knowledge Hub** - Hệ thống tài liệu học tập lập trình tương tác (Version 2.0)

### Mục tiêu chính

Xây dựng một nền tảng web tĩnh để lưu trữ, tổ chức và hiển thị kiến thức lập trình một cách chuyên nghiệp. Ưu tiên việc dễ dàng cập nhật nội dung mà không làm vỡ cấu trúc dữ liệu.

### Đối tượng hướng đến

- Lập trình viên đang học tập, nghiên cứu và chuẩn bị phỏng vấn.
- Quản lý system design, architecture documentation nội bộ.

---

## 🏗️ ARCHITECTURE

### Triết lý thiết kế (Cập nhật)

1. **Separation of Concerns:** Tách biệt hoàn toàn Metadata (JSON) và Nội dung bài viết (Markdown).
2. **Pure Vanilla Frontend:** HTML/CSS/JS thuần cho giao diện, sử dụng fetch API để tải nội dung động.
3. **Local Build Script (Node.js):** Sử dụng một script nhỏ chạy ở local để tự động tạo Search Index từ các file Markdown, giúp tìm kiếm client-side mượt mà mà không cần server.
4. **SPA-like Experience:** Hash-based router, không reload trang.

### Tech Stack

- **Frontend:** HTML5 + TailwindCSS + Vanilla JavaScript (ES6+)
- **Nội dung:** Markdown chuẩn (hỗ trợ code blocks, tables).
- **Libraries:** Prism.js (Syntax Highlighting), Marked.js (Markdown Parser).
- **Local Tooling:** Node.js (fs, path) để chạy file `generate-search-index.js`.

---

## 📂 CẤU TRÚC THƯ MỤC CHI TIẾT

````text
/project-root
│
├── index.html                  # Main entry point UI
├── SKILL.md                    # Project documentation
│
├── /scripts                    # LOCAL TOOLING (Chạy bằng Node.js khi viết xong bài)
│   └── build-index.js          # Script quét file .md và tạo search-index.json
│
├── /data                       # DATA LAYER - Chỉ chứa cấu trúc & config
│   ├── config.json             # App configuration
│   ├── menu.json               # Navigation tree structure
│   ├── search-index.json       # Auto-generated bởi build-index.js
│   │
│   └── /modules                # Chỉ chứa Meta-data của các module
│       ├── javascript.json
│       ├── reactjs.json
│       └── nodejs.json
│
├── /content                    # CONTENT LAYER - Nơi viết nội dung thực tế
│   ├── /javascript
│   │   ├── /basics
│   │   │   ├── variables.md    # Nội dung bài Variables
│   │   │   └── operators.md    # Nội dung bài Operators
│   │   └── /advanced
│   │       └── closures.md
│   │
│   └── /reactjs
│       └── /hooks
│           └── use-effect.md
│
└── /assets                     # ASSET LAYER (JS, CSS, Icons)
    ├── /js
    │   ├── main.js
    │   ├── router.js
    │   ├── renderer.js         # fetch() nội dung .md và parse qua Marked.js
    │   └── store.js            # Quản lý State cơ bản (Proxy pattern)
    └── /css
        ├── style.css
        └── prism-theme.css

DATA STRUCTURE (Cải tiến)
1. File Metadata: /data/modules/javascript.json
File này chỉ dùng để render Sidebar và TOC, KHÔNG chứa nội dung bài viết
{
  "meta": {
    "id": "javascript",
    "title": "JavaScript Complete Guide",
    "version": "1.0.0"
  },
  "sections": [
    {
      "id": "variables",
      "categoryId": "basics",
      "title": "Variables & Data Types",
      "path": "/content/javascript/basics/variables.md",
      "readTime": "15 mins",
      "difficulty": "beginner"
    }
  ]
}
2. File Nội dung: /content/javascript/basics/variables.md
Viết hoàn toàn bằng Markdown chuẩn, thoải mái sử dụng backticks cho code.
# Variables & Data Types trong JavaScript

## 1. Giới thiệu
Biến là khái niệm cơ bản nhất trong lập trình...

## 2. Cách khai báo

Dưới đây là sự khác biệt giữa `let`, `const`, và `var`:

\```javascript
// Using let (có thể gán lại)
let name = 'Backend Dev';
name = 'Fullstack Dev';

// Using const (không thể gán lại)
const role = 'Engineer';
\```

> **Warning:** Không nên sử dụng `var` do vấn đề về function scope và hoisting.
CORE FEATURES & WORKFLOW
1. Luồng hoạt động của Router & Renderer
User truy cập #javascript/variables.

router.js bắt sự kiện hashchange.

Kiểm tra AppState xem đã load javascript.json chưa. Nếu chưa -> fetch().

Tìm thuộc tính path của id: "variables" (được /content/javascript/basics/variables.md).

fetch() file .md đó.

Đưa text lấy được qua marked.js chuyển thành HTML.

Chèn HTML vào DOM và gọi Prism.highlightAll() để tô màu code
2. Hệ thống State Management (Gợi ý áp dụng Proxy)
Thay vì gán DOM thủ công, sử dụng ES6 Proxy để tự động trigger UI update:

const state = new Proxy({
  currentModule: 'javascript',
  currentSection: 'variables'
}, {
  set(target, property, value) {
    target[property] = value;
    if(property === 'currentModule') renderSidebar();
    if(property === 'currentSection') loadContent();
    return true;
  }
});

QUY TRÌNH THÊM BÀI VIẾT MỚI (Tối ưu hóa)
Tạo file .md mới trong thư mục /content/... và viết nội dung.

Thêm một object khai báo (chứa đường dẫn path) vào file module .json tương ứng trong /data/modules/.

Mở terminal tại thư mục gốc, chạy lệnh node scripts/build-index.js (Script này bạn sẽ tự viết để đọc các file .md và xuất ra search-index.json).

Xong! Nội dung mới đã lên web và có thể search được ngay.
````
