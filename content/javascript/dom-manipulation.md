# DOM Manipulation (Thao tác DOM)

## Khái niệm (What)

DOM (Document Object Model) là **cây đối tượng** đại diện cho trang HTML. JavaScript dùng DOM API để **đọc, tạo, sửa, xóa** phần tử trên trang.

## Cách dùng (Usage)

### Truy vấn phần tử

```js
// Đơn lẻ — trả 1 element (hoặc null)
document.getElementById("myId");
document.querySelector(".class");     // CSS selector
document.querySelector("#id > .child");

// Nhiều — trả NodeList
document.querySelectorAll(".item");   // tĩnh (snapshot)
document.getElementsByClassName("item"); // live collection

// ✅ Khuyên dùng querySelector/querySelectorAll — linh hoạt nhất
```

### Tạo và thêm phần tử

```js
const div = document.createElement("div");
div.textContent = "Xin chào";
div.classList.add("card");
div.setAttribute("data-id", "123");

// Thêm vào DOM
document.body.appendChild(div);
parent.insertBefore(div, referenceNode);
parent.append(div, "text", anotherEl);     // nhiều node, text
parent.prepend(div);                        // đầu
el.before(newEl);                           // trước element
el.after(newEl);                            // sau element
```

### innerHTML vs textContent

```js
el.textContent = "<b>text</b>"; // hiển thị nguyên HTML text (an toàn)
el.innerHTML = "<b>text</b>";   // parse HTML (⚠️ XSS risk!)

// Tạo HTML phức tạp
el.innerHTML = `
  <div class="card">
    <h2>${title}</h2>
    <p>${description}</p>
  </div>
`;
```

### Sửa style và class

```js
// Class
el.classList.add("active", "highlight");
el.classList.remove("hidden");
el.classList.toggle("dark-mode");
el.classList.contains("active"); // true/false

// Style trực tiếp
el.style.backgroundColor = "#333";
el.style.cssText = "color: white; padding: 10px;";
```

### Event Handling

```js
// ✅ addEventListener — khuyên dùng
el.addEventListener("click", (e) => {
  console.log(e.target);      // phần tử thực sự click
  console.log(e.currentTarget); // phần tử gắn listener
});

// Event Delegation — gắn listener ở cha
document.querySelector(".list").addEventListener("click", (e) => {
  if (e.target.matches(".item")) {
    handleItem(e.target);
  }
});

// Cleanup
const handler = () => {};
el.addEventListener("click", handler);
el.removeEventListener("click", handler); // cùng reference!
```

### DocumentFragment — batch insert

```js
const fragment = document.createDocumentFragment();
for (let i = 0; i < 1000; i++) {
  const li = document.createElement("li");
  li.textContent = `Item ${i}`;
  fragment.appendChild(li);
}
list.appendChild(fragment); // 1 reflow thay vì 1000
```

## Best Practices

- ✅ **`querySelector`** thay các `getElement*` cũ — nhất quán
- ✅ **Event delegation** thay gắn listener mỗi phần tử — hiệu năng
- ✅ **`DocumentFragment`** cho batch insert — giảm reflow
- ✅ **`textContent`** thay `innerHTML` khi không cần HTML — tránh XSS
- ✅ **Remove listener** khi element bị xóa — tránh memory leak

## Pitfalls

- ❌ **`innerHTML` + user input** → XSS vulnerability
- ❌ `querySelectorAll` trả **NodeList** (không phải Array) — cần `Array.from()` hoặc `[...nodeList]`
- ❌ Sửa DOM trong loop → nhiều reflow → chậm
- ❌ `removeEventListener` cần **cùng function reference** — anonymous function không xóa được
