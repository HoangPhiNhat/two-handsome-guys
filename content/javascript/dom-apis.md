# DOM APIs (tổng quan)

## Khái niệm (What)

DOM (Document Object Model) là **giao diện lập trình** cho HTML/XML. Trình duyệt parse HTML thành **cây object** — JavaScript dùng DOM API để thao tác giao diện.

> Xem bài chi tiết: [DOM Manipulation](dom-manipulation.md)

## Các nhóm API

### 1. Selection APIs

```js
document.getElementById("id");
document.querySelector(".class");      // 1 element
document.querySelectorAll("li.item");  // NodeList
document.getElementsByTagName("div");  // HTMLCollection (live)
```

### 2. Traversal APIs

```js
el.parentElement;
el.children;           // HTMLCollection
el.firstElementChild;
el.lastElementChild;
el.nextElementSibling;
el.previousElementSibling;
el.closest(".ancestor"); // tìm lên trên cây DOM
```

### 3. Manipulation APIs

```js
document.createElement("div");
el.appendChild(child);
el.removeChild(child);
el.replaceChild(newChild, oldChild);
el.cloneNode(true); // deep clone
el.remove(); // xóa chính nó
```

### 4. Attribute APIs

```js
el.getAttribute("data-id");
el.setAttribute("data-id", "123");
el.removeAttribute("disabled");
el.hasAttribute("hidden");
el.dataset.id; // data-id → dataset.id
```

### 5. Event APIs

```js
el.addEventListener("click", handler, { once: true, passive: true });
el.removeEventListener("click", handler);
el.dispatchEvent(new CustomEvent("myEvent", { detail: data }));
```

## Best Practices

- ✅ Dùng **`querySelector`** cho consistency
- ✅ **Event delegation** thay listener mỗi element
- ✅ **`textContent`** thay `innerHTML` — tránh XSS
- ✅ Batch DOM changes → dùng `DocumentFragment`

## Tóm tắt

DOM API là cầu nối JS ↔ giao diện. Nắm 5 nhóm trên là nền tảng vững cho front-end thuần hoặc hiểu framework.
