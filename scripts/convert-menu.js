const fs = require('fs');

const menuJS = JSON.parse(fs.readFileSync('menujs.json', 'utf8'));

function slugify(text) {
  return text.toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function transform(node, parentId = '') {
  const id = (parentId ? parentId + '-' : '') + slugify(node.name || '');
  const result = {
    id: id,
    title: node.name,
  };

  if (node.children && node.children.length > 0) {
    result.children = node.children.map(child => transform(child, id));
  } else {
    result.sectionId = slugify(node.name);
  }

  return result;
}

// Ensure the sidebar can handle the structure
// The current sidebar handles: Module -> Category -> Section
// menujs is: Module -> Introduction -> What is JS (Section)
// We might need to flatten it slightly if it's too deep, or just keep it and I'll update the UI.
// Let's keep it and see.

const transformed = menuJS.children.map(child => transform(child, 'js'));

fs.writeFileSync('data/menus/javascript.json', JSON.stringify(transformed, null, 2));
console.log('Generated data/menus/javascript.json');
