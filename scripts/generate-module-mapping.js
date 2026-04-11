const fs = require('fs');
const path = require('path');

// Lấy tham số dòng lệnh, mặc định là 'backend' nếu không truyền
const targetModule = process.argv[2] || 'backend';

console.log(`Bắt đầu quét và tạo JSON module cho: ${targetModule}`);

// Đường dẫn tương đối từ vị trí folder /scripts
const menuPath = path.join(__dirname, `../data/menus/${targetModule}.json`);
const modulePath = path.join(__dirname, `../data/modules/${targetModule}.json`);

if (!fs.existsSync(menuPath)) {
  console.error(`❌ Lỗi: Không tìm thấy file menu tại ${menuPath}`);
  process.exit(1);
}

const menuData = JSON.parse(fs.readFileSync(menuPath, 'utf8'));

const moduleData = {
  meta: {
    id: targetModule,
    title: `${targetModule.charAt(0).toUpperCase() + targetModule.slice(1)} Complete Guide`,
    description: `Hướng dẫn chuyên sâu về ${targetModule}`,
    version: '1.0.0',
    lastUpdated: new Date().toISOString().split('T')[0],
    language: 'vi'
  },
  categories: [],
  sections: []
};

let categoryOrder = 1;

// Hàm đệ quy quét dẹt (flatten) luồng thư mục
function flattenChildren(children, categoryId, folderPath) {
  children.forEach(child => {
    // Nếu vẫn còn mảng con, tiếp tục cắm sâu xuống
    if (child.children) {
      flattenChildren(child.children, categoryId, folderPath); 
    } else {
      const secId = child.sectionId;
      if (secId) {
        moduleData.sections.push({
          id: secId,
          categoryId: categoryId,
          title: child.title, // Lấy tên hiển thị
          path: `/content/${targetModule}/${folderPath}/${secId}.md`
        });
      }
    }
  });
}

menuData.forEach(cat => {
  // Push mục cha lớn nhất làm Category
  moduleData.categories.push({
    id: cat.id,
    name: cat.title,
    description: '',
    icon: 'folder', // Icon mặc định
    order: categoryOrder++
  });
  
  if (cat.children) {
    // Đổ toàn bộ file con tìm được vào chung 1 category lớn tương ứng
    flattenChildren(cat.children, cat.id, cat.id);
  } else if (cat.sectionId) {
     // Trường hợp hi hữu nếu Item cha kiêm luôn file section mà ko có children
     moduleData.sections.push({
        id: cat.sectionId,
        categoryId: cat.id,
        title: cat.title,
        path: `/content/${targetModule}/${cat.id}/${cat.sectionId}.md`
      });
  }
});

// Xuất file
fs.writeFileSync(modulePath, JSON.stringify(moduleData, null, 2), 'utf8');
console.log(`✅ Thành công! Đã sinh ra file ánh xạ tại: data/modules/${targetModule}.json\nCác path thư mục đã trỏ vào mảng "/content/${targetModule}/..."`);
