window.AppState = {
  currentModule: "javascript",
  currentSection: null,
  config: {},
  menu: [],
  searchIndex: [],
};

const App = {
  async init() {
    await this.loadConfig();
    await this.loadMenu();
    await this.loadSearchIndex();
    this.setupTheme();
    this.setupSidebar();
    this.setupModuleSwitcher();
    this.setupSearch();
    Router.init();
    Router.handleRoute(); // initial route
  },

  slugify(text) {
    if (!text) return "";
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  },

  async loadConfig() {
    try {
      const res = await fetch("./data/config.json");
      AppState.config = await res.json();
    } catch (e) {
      console.warn("Could not load config", e);
    }
  },

  async loadMenu() {
    try {
      const res = await fetch("./data/menu.json");
      const data = await res.json();
      const modules = data.menu;

      // Fetch individual menus for each module
      const fullMenu = await Promise.all(
        modules.map(async (mod) => {
          if (mod.menuPath) {
            try {
              const menuRes = await fetch("./" + mod.menuPath);
              mod.children = await menuRes.json();
            } catch (e) {
              console.warn(`Could not load menu for ${mod.id}`, e);
              mod.children = mod.children || [];
            }
          }
          return mod;
        })
      );

      AppState.menu = fullMenu;
      this.renderSidebar();
    } catch (e) {
      console.error("Could not load menu", e);
    }
  },

  async loadSearchIndex() {
    try {
      const res = await fetch("./data/search-index.json");
      if (!res.ok) throw new Error("Search index not found");
      const data = await res.json();
      AppState.searchIndex = Array.isArray(data.items) ? data.items : [];
    } catch (e) {
      AppState.searchIndex = [];
      console.warn("Could not load search index, fallback to menu search", e);
    }
  },

  setupTheme() {
    const isDark =
      AppState.config.darkMode !== undefined ? AppState.config.darkMode : true;
    if (isDark) {
      document.body.setAttribute("data-theme", "dark");
      document.documentElement.classList.add("dark");
    } else {
      document.body.setAttribute("data-theme", "light");
      document.documentElement.classList.remove("dark");
    }

    const themeBtn = document.getElementById("theme-toggle");
    if (themeBtn) {
      themeBtn.addEventListener("click", () => {
        const currentlyDark =
          document.body.getAttribute("data-theme") === "dark";
        if (currentlyDark) {
          document.body.setAttribute("data-theme", "light");
          document.documentElement.classList.remove("dark");
          AppState.config.darkMode = false;
        } else {
          document.body.setAttribute("data-theme", "dark");
          document.documentElement.classList.add("dark");
          AppState.config.darkMode = true;
        }
      });
    }
  },

  setupSidebar() {
    const sidebar = document.getElementById("sidebar");
    const toggleBtn = document.getElementById("sidebar-toggle");

    if (toggleBtn && sidebar) {
      toggleBtn.addEventListener("click", () => {
        sidebar.classList.toggle("open");
      });
    }
  },

  setupModuleSwitcher() {
    const select = document.getElementById("moduleSelect");
    if (!select) return;

    AppState.menu.forEach((mod) => {
      const option = document.createElement("option");
      option.value = mod.id;
      option.textContent = mod.title;
      select.appendChild(option);
    });

    const findFirstSection = (nodes) => {
      for (const node of nodes) {
        if (node.sectionId) return node.sectionId;
        if (node.children && node.children.length > 0) {
          const found = findFirstSection(node.children);
          if (found) return found;
        }
      }
      return null;
    };

    select.addEventListener("change", (e) => {
      const moduleId = e.target.value;
      const moduleNode = AppState.menu.find((mod) => mod.id === moduleId);
      const firstSectionId = moduleNode?.children
        ? findFirstSection(moduleNode.children)
        : null;

      if (firstSectionId) {
        window.location.hash = `#${moduleId}/${firstSectionId}`;
      } else {
        window.location.hash = `#${moduleId}`;
      }
    });
  },

  setupSearch() {
    const modal = document.getElementById("search-modal");
    const toggle = document.getElementById("search-toggle");
    const closeBtn = document.getElementById("close-search");
    const input = document.getElementById("search-input");
    const results = document.getElementById("search-results");

    if (!modal || !toggle) return;

    toggle.addEventListener("click", () => {
      modal.classList.remove("hidden");
      modal.classList.add("flex");
      input.focus();
    });

    closeBtn.addEventListener("click", () => {
      modal.classList.add("hidden");
      modal.classList.remove("flex");
    });

    input.addEventListener("input", (e) => {
      const q = e.target.value.toLowerCase();
      results.innerHTML = "";
      if (!q) return;

      const searchHits = this.searchSections(q);

      if (!searchHits.length) {
        results.innerHTML =
          '<li class="p-2 opacity-60 text-sm">Không tìm thấy kết quả.</li>';
        return;
      }

      searchHits.forEach((hit) => {
        const li = document.createElement("li");
        li.innerHTML = `<a href="#${hit.moduleId}/${hit.sectionId}" class="block p-2 hover:bg-blue-500/10 rounded" onclick="document.getElementById('close-search').click()">
           <span class="text-xs opacity-60">${hit.moduleTitle} > ${hit.categoryTitle}</span><br>
           <span class="font-medium">${hit.title}</span>
         </a>`;
        results.appendChild(li);
      });
    });
  },

  searchSections(query) {
    if (AppState.searchIndex.length) {
      return AppState.searchIndex
        .filter((item) => {
          const haystack =
            `${item.title} ${item.moduleTitle} ${item.categoryTitle} ${item.excerpt || ""}`.toLowerCase();
          return haystack.includes(query);
        })
        .slice(0, 20);
    }

    const fallbackResults = [];
    const searchNode = (node, mod) => {
      if (node.children && node.children.length > 0) {
        node.children.forEach((child) => searchNode(child, mod));
      } else {
        const matched =
          node.title.toLowerCase().includes(query) ||
          mod.title.toLowerCase().includes(query);
        if (matched) {
          fallbackResults.push({
            moduleId: mod.id,
            moduleTitle: mod.title,
            categoryTitle: mod.title,
            sectionId: node.sectionId || this.slugify(node.title),
            title: node.title,
            excerpt: "",
          });
        }
      }
    };

    AppState.menu.forEach((mod) => {
      if (mod.children) {
        mod.children.forEach((child) => searchNode(child, mod));
      }
    });

    return fallbackResults;
  },

  renderSidebar() {
    const sidebarMenu = document.getElementById("sidebar-menu");
    if (!sidebarMenu) return;

    const slugify = (text) => {
      return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");
    };

    const renderNode = (node, moduleId) => {
      const hasChildren = node.children && node.children.length > 0;

      if (hasChildren) {
        return `
          <li class="menu-item-parent">
            <div class="px-4 py-2 font-medium flex items-center justify-between opacity-80 cursor-pointer category-toggle">
              <span>${node.title}</span>
              <i data-lucide="chevron-right" class="w-4 h-4"></i>
            </div>
            <ul class="pl-4 space-y-1 hidden">
              ${node.children
                .map((child) => renderNode(child, moduleId))
                .join("")}
            </ul>
          </li>
        `;
      } else {
        const sectionId = node.sectionId || slugify(node.title);
        return `
          <li>
            <a href="#${moduleId}/${sectionId}" class="block px-4 py-2 text-sm rounded hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
              ${node.title}
            </a>
          </li>
        `;
      }
    };

    const html = AppState.menu
      .map((mod) => {
        let text = `<div class="mb-6 module-group hidden" data-module="${mod.id}">`;
        text += `<h2 class="px-4 text-xs font-bold uppercase tracking-wider opacity-60 mb-2">${mod.title}</h2>`;
        text += `<ul class="space-y-1">`;
        if (mod.children) {
          text += mod.children.map((cat) => renderNode(cat, mod.id)).join("");
        }
        text += `</ul></div>`;
        return text;
      })
      .join("");

    sidebarMenu.innerHTML = html;

    // Add event listeners for toggles
    document.querySelectorAll(".category-toggle").forEach((toggle) => {
      toggle.addEventListener("click", (e) => {
        const ul = e.currentTarget.nextElementSibling;
        const icon = e.currentTarget.querySelector("[data-lucide]");
        if (ul.classList.contains("hidden")) {
          ul.classList.remove("hidden");
          if (icon) {
            icon.setAttribute("data-lucide", "chevron-down");
            if (window.lucide) lucide.createIcons({ attrs: { "data-lucide": "chevron-down" } });
          }
        } else {
          ul.classList.add("hidden");
          if (icon) {
            icon.setAttribute("data-lucide", "chevron-right");
            if (window.lucide) lucide.createIcons({ attrs: { "data-lucide": "chevron-right" } });
          }
        }
        if (window.lucide) lucide.createIcons();
      });
    });

    // Logic to show/hide group based on hash
    this.updateSidebarVisibility();

    window.addEventListener("hashchange", () => this.updateSidebarVisibility());

    if (window.lucide) lucide.createIcons();
  },

  updateSidebarVisibility() {
    const hash = window.location.hash.slice(1) || "javascript";
    const moduleId = hash.split("/")[0];

    document.querySelectorAll(".module-group").forEach((el) => {
      if (el.getAttribute("data-module") === moduleId) {
        el.classList.remove("hidden");
      } else {
        el.classList.add("hidden");
      }
    });

    const select = document.getElementById("moduleSelect");
    if (select) select.value = moduleId;
  },
};

document.addEventListener("DOMContentLoaded", () => {
  App.init();
});
