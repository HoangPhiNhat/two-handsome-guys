# Typed Arrays

## Khái niệm (What)

Typed Arrays là mảng **cố định kiểu**, thao tác trực tiếp trên **bộ nhớ nhị phân **(`ArrayBuffer`). Mỗi phần tử cùng kích thước và kiểu dữ liệu — hiệu năng cao, dùng cho đồ họa, audio, network, và binary data.

## Các kiểu Typed Array

| Tên | Bytes/element | Mô tả |
|-----|:---:|---------|
| `Int8Array` | 1 | -128 → 127 |
| `Uint8Array` | 1 | 0 → 255 |
| `Uint8ClampedArray` | 1 | 0 → 255 (clamp) — Canvas |
| `Int16Array` | 2 | -32768 → 32767 |
| `Uint16Array` | 2 | 0 → 65535 |
| `Int32Array` | 4 | -2^31 → 2^31-1 |
| `Float32Array` | 4 | Single-precision float |
| `Float64Array` | 8 | Double-precision float |

## Cách dùng (Usage)

```js
// Tạo từ length
const arr = new Int32Array(4);
arr[0] = 1; arr[1] = 2;

// Tạo từ giá trị
const bytes = new Uint8Array([255, 128, 0]);

// Tạo từ ArrayBuffer
const buffer = new ArrayBuffer(16); // 16 bytes
const view = new Float32Array(buffer); // 4 phần tử (4 bytes/element)
```

## Khi nào dùng (When)

- **Canvas / WebGL**: `Uint8ClampedArray` cho pixel data
- **Audio API**: `Float32Array` cho samples
- **WebSocket / File**: binary data
- **Performance-critical**: xử lý số lượng lớn số

## Pitfalls

- ❌ Không có `.push()`, `.pop()`, `.splice()` — kích thước cố định
- ❌ Giá trị ngoài phạm vi bị cắt ngắn (wrap hoặc clamp)
- ❌ Typed Array KHÔNG phải Array — `Array.isArray()` trả `false`
