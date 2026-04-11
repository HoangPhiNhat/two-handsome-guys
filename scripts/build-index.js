const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const modulesDir = path.join(rootDir, "data", "modules");
const outputFile = path.join(rootDir, "data", "search-index.json");

function stripMarkdown(markdown) {
  return markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/^#+\s+/gm, "")
    .replace(/[>*_~|-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function safeReadJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    console.warn(`Skip invalid JSON: ${filePath} (${error.message})`);
    return null;
  }
}

function buildSearchIndex() {
  const files = fs.readdirSync(modulesDir).filter((f) => f.endsWith(".json"));
  const items = [];

  files.forEach((fileName) => {
    const modulePath = path.join(modulesDir, fileName);
    const moduleData = safeReadJson(modulePath);
    if (
      !moduleData ||
      !moduleData.meta ||
      !Array.isArray(moduleData.sections)
    ) {
      return;
    }

    const categoryTitleById = new Map(
      (moduleData.categories || []).map((cat) => [
        cat.id,
        cat.name || cat.title || cat.id,
      ]),
    );

    moduleData.sections.forEach((section) => {
      if (!section.path) {
        return;
      }

      const absoluteContentPath = path.join(
        rootDir,
        section.path.replace(/^\//, ""),
      );
      if (!fs.existsSync(absoluteContentPath)) {
        console.warn(`Missing markdown file: ${absoluteContentPath}`);
        return;
      }

      const markdown = fs.readFileSync(absoluteContentPath, "utf8");
      const plainText = stripMarkdown(markdown);

      items.push({
        moduleId: moduleData.meta.id,
        moduleTitle: moduleData.meta.title,
        categoryId: section.categoryId,
        categoryTitle:
          categoryTitleById.get(section.categoryId) ||
          section.categoryId ||
          "General",
        sectionId: section.id,
        title: section.title,
        path: section.path,
        excerpt: plainText.slice(0, 240),
      });
    });
  });

  const payload = {
    generatedAt: new Date().toISOString(),
    itemCount: items.length,
    items,
  };

  fs.writeFileSync(outputFile, JSON.stringify(payload, null, 2), "utf8");
  console.log(`search-index.json generated with ${items.length} items.`);
}

buildSearchIndex();
