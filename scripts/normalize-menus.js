const fs = require("fs");
const path = require("path");

const targets = [
  "data/menus/reactjs.json",
  "data/menus/typescript.json",
  "data/menus/docker.json",
  "data/menus/backend.json",
];

const slugify = (text) =>
  String(text || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

function normalizeNode(node, prefix = "") {
  const title = node.title || node.name || "Untitled";
  const base = slugify(title) || "item";
  const id = prefix ? `${prefix}-${base}` : base;

  const out = { id, title };
  if (Array.isArray(node.children) && node.children.length > 0) {
    out.children = node.children.map((child) => normalizeNode(child, id));
  } else {
    out.sectionId = node.sectionId || base;
  }
  return out;
}

for (const file of targets) {
  const abs = path.resolve(__dirname, "..", file);
  const raw = JSON.parse(fs.readFileSync(abs, "utf8"));
  const rootNodes = Array.isArray(raw)
    ? raw
    : Array.isArray(raw.children)
      ? raw.children
      : [];
  const normalized = rootNodes.map((n) => normalizeNode(n));
  fs.writeFileSync(abs, `${JSON.stringify(normalized, null, 2)}\n`, "utf8");
  console.log(`normalized ${file}`);
}
