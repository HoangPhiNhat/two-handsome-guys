/**
 * One-off generator: merges meta/categories from current module JSON with full section list.
 * Run: node scripts/gen-javascript-module-sections.js
 */
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const modulePath = path.join(root, "data", "modules", "javascript.json");

const base = JSON.parse(fs.readFileSync(modulePath, "utf8"));

const basics = "basics";
const advanced = "advanced";

/** @type {{ id: string; categoryId: string; title: string; path: string }[]} */
const sections = [
  // Giới thiệu
  { id: "what-is-javascript", categoryId: basics, title: "JavaScript là gì?", path: "/content/javascript/introduction/what-is-javascript.md" },
  { id: "history-of-javascript", categoryId: basics, title: "Lịch sử JavaScript", path: "/content/javascript/introduction/history-of-javascript.md" },
  { id: "javascript-versions", categoryId: basics, title: "Phiên bản JavaScript (ES)", path: "/content/javascript/introduction/javascript-versions.md" },
  { id: "how-to-run-javascript", categoryId: basics, title: "Chạy JavaScript ở đâu?", path: "/content/javascript/introduction/how-to-run-javascript.md" },
  // Biến
  { id: "variable-declarations", categoryId: basics, title: "Khai báo biến (var, let, const)", path: "/content/javascript/all-about-variables/declarations.md" },
  { id: "hoisting", categoryId: basics, title: "Hoisting", path: "/content/javascript/all-about-variables/hoisting.md" },
  { id: "variable-naming-rules", categoryId: basics, title: "Quy tắc đặt tên biến", path: "/content/javascript/all-about-variables/naming-rules.md" },
  { id: "variable-scopes", categoryId: basics, title: "Phạm vi biến (scope)", path: "/content/javascript/all-about-variables/scopes.md" },
  // Kiểu dữ liệu
  { id: "primitive-types", categoryId: basics, title: "Kiểu nguyên thủy", path: "/content/javascript/data-types/primitive-types.md" },
  { id: "object", categoryId: basics, title: "Object", path: "/content/javascript/data-types/objects.md" },
  { id: "object-prototype", categoryId: advanced, title: "Nguyên mẫu (prototype) của object", path: "/content/javascript/data-types/object-prototype.md" },
  { id: "prototypal-inheritance", categoryId: advanced, title: "Kế thừa theo prototype", path: "/content/javascript/data-types/prototypal-inheritance.md" },
  { id: "typeof-operator", categoryId: basics, title: "Toán tử typeof", path: "/content/javascript/data-types/typeof-operator.md" },
  { id: "built-in-objects", categoryId: basics, title: "Đối tượng built-in", path: "/content/javascript/data-types/built-in-objects.md" },
  // Ép kiểu
  { id: "type-conversion-vs-coercion", categoryId: basics, title: "Chuyển kiểu vs ép kiểu (coercion)", path: "/content/javascript/type-casting/conversion-vs-coercion.md" },
  { id: "implicit-type-casting", categoryId: basics, title: "Ép kiểu ngầm định", path: "/content/javascript/type-casting/coercion.md" },
  { id: "explicit-type-casting", categoryId: basics, title: "Ép kiểu tường minh", path: "/content/javascript/type-casting/coercion.md" },
  // Cấu trúc dữ liệu
  { id: "map", categoryId: basics, title: "Map", path: "/content/javascript/data-structures/keyed-collections.md" },
  { id: "weak-map", categoryId: advanced, title: "WeakMap", path: "/content/javascript/data-structures/keyed-collections.md" },
  { id: "set", categoryId: basics, title: "Set", path: "/content/javascript/data-structures/keyed-collections.md" },
  { id: "weak-set", categoryId: advanced, title: "WeakSet", path: "/content/javascript/data-structures/keyed-collections.md" },
  { id: "typed-arrays", categoryId: advanced, title: "Typed Arrays", path: "/content/javascript/data-structures/typed-arrays.md" },
  { id: "arrays", categoryId: basics, title: "Mảng (Array)", path: "/content/javascript/data-structures/arrays.md" },
  { id: "json", categoryId: basics, title: "JSON", path: "/content/javascript/data-structures/json.md" },
  // So sánh bằng
  { id: "loose-equality", categoryId: basics, title: "So sánh lỏng (==)", path: "/content/javascript/equality-comparisons/loose-equality.md" },
  { id: "strict-equality", categoryId: basics, title: "So sánh chặt ===", path: "/content/javascript/equality-comparisons/strict-equality.md" },
  { id: "objectis", categoryId: basics, title: "Object.is", path: "/content/javascript/equality-comparisons/object-is.md" },
  { id: "islooselyequal", categoryId: advanced, title: "Thuật toán IsLooselyEqual (==)", path: "/content/javascript/equality-comparisons/abstract-algorithms.md" },
  { id: "isstrictlyequal", categoryId: advanced, title: "Thuật toán IsStrictlyEqual (===)", path: "/content/javascript/equality-comparisons/abstract-algorithms.md" },
  { id: "samevaluezero", categoryId: advanced, title: "SameValueZero", path: "/content/javascript/equality-comparisons/abstract-algorithms.md" },
  { id: "samevalue", categoryId: advanced, title: "SameValue", path: "/content/javascript/equality-comparisons/abstract-algorithms.md" },
  // Vòng lặp
  { id: "for", categoryId: basics, title: "Vòng lặp for", path: "/content/javascript/loops-and-iterations/for-loop.md" },
  { id: "dowhile", categoryId: basics, title: "do…while", path: "/content/javascript/loops-and-iterations/dowhile-loop.md" },
  { id: "while", categoryId: basics, title: "while", path: "/content/javascript/loops-and-iterations/while-loop.md" },
  { id: "forin-loop", categoryId: basics, title: "for…in", path: "/content/javascript/loops-and-iterations/for-in.md" },
  { id: "forof-loop", categoryId: basics, title: "for…of", path: "/content/javascript/loops-and-iterations/for-of.md" },
  { id: "break-continue", categoryId: basics, title: "break và continue", path: "/content/javascript/loops-and-iterations/break-continue.md" },
  // Luồng điều khiển
  { id: "ifelse", categoryId: basics, title: "if…else", path: "/content/javascript/control-flow/if-else.md" },
  { id: "switch", categoryId: basics, title: "switch", path: "/content/javascript/control-flow/switch.md" },
  { id: "throw-statement", categoryId: basics, title: "throw", path: "/content/javascript/control-flow/exception-handling.md" },
  { id: "trycatchfinally", categoryId: basics, title: "try / catch / finally", path: "/content/javascript/control-flow/exception-handling.md" },
  { id: "error-objects", categoryId: basics, title: "Đối tượng Error", path: "/content/javascript/control-flow/exception-handling.md" },
  // Toán tử
  { id: "assignment-operators", categoryId: basics, title: "Toán tử gán", path: "/content/javascript/expressions-operators/assignment-operators.md" },
  { id: "comparison-operators", categoryId: basics, title: "Toán tử so sánh", path: "/content/javascript/expressions-operators/comparison-operators.md" },
  { id: "arithmetic-operators", categoryId: basics, title: "Toán tử số học", path: "/content/javascript/expressions-operators/arithmetic-operators.md" },
  { id: "bitwise-operators", categoryId: advanced, title: "Toán tử bitwise", path: "/content/javascript/expressions-operators/bitwise-operators.md" },
  { id: "logical-operators", categoryId: basics, title: "Toán tử logic", path: "/content/javascript/expressions-operators/logical-operators.md" },
  { id: "bigint-operators", categoryId: advanced, title: "Toán tử BigInt", path: "/content/javascript/expressions-operators/bigint-operators.md" },
  { id: "string-operators", categoryId: basics, title: "Toán tử chuỗi", path: "/content/javascript/expressions-operators/string-operators.md" },
  { id: "conditional-operators", categoryId: basics, title: "Toán tử điều kiện (ternary)", path: "/content/javascript/expressions-operators/conditional-operators.md" },
  { id: "comma-operators", categoryId: advanced, title: "Toán tử dấu phẩy", path: "/content/javascript/expressions-operators/comma-operators.md" },
  { id: "unary-operators", categoryId: basics, title: "Toán tử một ngôi", path: "/content/javascript/expressions-operators/unary-operators.md" },
  // Hàm
  { id: "default-params", categoryId: basics, title: "Tham số mặc định", path: "/content/javascript/functions/parameters.md" },
  { id: "rest", categoryId: basics, title: "Rest parameters", path: "/content/javascript/functions/parameters.md" },
  { id: "arrow-functions", categoryId: basics, title: "Arrow function", path: "/content/javascript/functions/arrow-functions.md" },
  { id: "iifes", categoryId: advanced, title: "IIFE", path: "/content/javascript/functions/iife.md" },
  { id: "arguments-object", categoryId: basics, title: "Đối tượng arguments", path: "/content/javascript/functions/arguments-object.md" },
  { id: "scope-function-stack", categoryId: advanced, title: "Scope và call stack", path: "/content/javascript/functions/scope-and-stack.md" },
  { id: "built-in-functions", categoryId: basics, title: "Hàm built-in (parseInt, …)", path: "/content/javascript/functions/built-in-functions.md" },
  { id: "recursion", categoryId: advanced, title: "Đệ quy", path: "/content/javascript/functions/recursion.md" },
  { id: "lexical-scoping", categoryId: advanced, title: "Lexical scoping", path: "/content/javascript/functions/lexical-scoping.md" },
  { id: "closures", categoryId: advanced, title: "Closure", path: "/content/javascript/functions/closures.md" },
  // this
  { id: "in-a-method", categoryId: basics, title: "this trong method", path: "/content/javascript/this-keyword/in-method.md" },
  { id: "in-a-function", categoryId: basics, title: "this trong hàm thường", path: "/content/javascript/this-keyword/in-function.md" },
  { id: "using-it-alone", categoryId: basics, title: "this đứng một mình", path: "/content/javascript/this-keyword/alone.md" },
  { id: "in-event-handlers", categoryId: basics, title: "this trong xử lý sự kiện", path: "/content/javascript/this-keyword/in-event-handlers.md" },
  { id: "in-arrow-functions", categoryId: basics, title: "this trong arrow function", path: "/content/javascript/this-keyword/in-arrow-functions.md" },
  // Mượn hàm
  { id: "call", categoryId: advanced, title: "Function.prototype.call", path: "/content/javascript/function-borrowing/explicit-binding.md" },
  { id: "apply", categoryId: advanced, title: "Function.prototype.apply", path: "/content/javascript/function-borrowing/explicit-binding.md" },
  { id: "bind", categoryId: advanced, title: "Function.prototype.bind", path: "/content/javascript/function-borrowing/explicit-binding.md" },
  { id: "strict-mode", categoryId: basics, title: "Strict mode", path: "/content/javascript/strict-mode.md" },
  // Bất đồng bộ
  { id: "event-loop", categoryId: advanced, title: "Event loop", path: "/content/javascript/async-javascript/event-loop.md" },
  { id: "settimeout", categoryId: basics, title: "setTimeout", path: "/content/javascript/async-javascript/timers.md" },
  { id: "setinterval", categoryId: basics, title: "setInterval", path: "/content/javascript/async-javascript/timers.md" },
  { id: "callbacks", categoryId: basics, title: "Callback", path: "/content/javascript/async-javascript/callbacks.md" },
  { id: "promises", categoryId: basics, title: "Promise", path: "/content/javascript/async-javascript/promises.md" },
  { id: "callback-hell", categoryId: basics, title: "Callback hell", path: "/content/javascript/async-javascript/callback-hell.md" },
  { id: "asyncawait", categoryId: basics, title: "async / await", path: "/content/javascript/async-javascript/async-await.md" },
  // API
  { id: "fetch", categoryId: basics, title: "Fetch API", path: "/content/javascript/working-with-apis/fetch.md" },
  { id: "xmlhttprequest", categoryId: advanced, title: "XMLHttpRequest", path: "/content/javascript/working-with-apis/xmlhttprequest.md" },
  { id: "dom-apis", categoryId: basics, title: "DOM APIs", path: "/content/javascript/dom-apis.md" },
  { id: "classes", categoryId: basics, title: "Class (ES6)", path: "/content/javascript/classes.md" },
  { id: "iterators-and-generators", categoryId: advanced, title: "Iterator và Generator", path: "/content/javascript/iterators-and-generators.md" },
  { id: "commonjs", categoryId: advanced, title: "CommonJS", path: "/content/javascript/modules/commonjs.md" },
  { id: "esm", categoryId: advanced, title: "ES Modules (ESM)", path: "/content/javascript/modules/esm.md" },
  { id: "memory-lifecycle", categoryId: advanced, title: "Vòng đời bộ nhớ", path: "/content/javascript/memory/memory-lifecycle.md" },
  { id: "garbage-collection", categoryId: advanced, title: "Garbage collection", path: "/content/javascript/memory/garbage-collection.md" },
  { id: "debugging-memory-leaks", categoryId: advanced, title: "Debug rò rỉ bộ nhớ", path: "/content/javascript/devtools/debugging-memory-leaks.md" },
  { id: "debugging-performance", categoryId: advanced, title: "Debug hiệu năng", path: "/content/javascript/devtools/debugging-performance.md" },
];

base.sections = sections;
fs.writeFileSync(modulePath, JSON.stringify(base, null, 2) + "\n", "utf8");
console.log("Wrote", sections.length, "sections to", modulePath);
