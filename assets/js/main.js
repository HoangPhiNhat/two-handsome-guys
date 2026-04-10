window.AppState = {
  currentModule: 'javascript',
  currentSection: null,
  config: {},
  menu: []
};

const App = {
  async init() {
    await this.loadConfig();
    await this.loadMenu();
    this.setupTheme();
    this.setupSidebar();
    this.setupModuleSwitcher();
    this.setupSearch();
    Router.init();
    Router.handleRoute(); // initial route
  },

  async loadConfig() {
    try {
      const res = await fetch('./data/config.json');
      AppState.config = await res.json();
    } catch(e) {
      console.warn("Could not load config", e);
    }
  },

  async loadMenu() {
    try {
      const res = await fetch('./data/menu.json');
      const data = await res.json();
      AppState.menu = data.menu;
      this.renderSidebar();
    } catch(e) {
      console.error("Could not load menu", e);
    }
  },

  setupTheme() {
    const isDark = AppState.config.darkMode !== undefined ? AppState.config.darkMode : true;
    if (isDark) {
      document.body.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    } else {
      document.body.setAttribute('data-theme', 'light');
      document.documentElement.classList.remove('dark');
    }

    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        const currentlyDark = document.body.getAttribute('data-theme') === 'dark';
        if (currentlyDark) {
          document.body.setAttribute('data-theme', 'light');
          document.documentElement.classList.remove('dark');
          AppState.config.darkMode = false;
        } else {
          document.body.setAttribute('data-theme', 'dark');
          document.documentElement.classList.add('dark');
          AppState.config.darkMode = true;
        }
      });
    }
  },

  setupSidebar() {
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('sidebar-toggle');
    
    if (toggleBtn && sidebar) {
      toggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('open');
      });
    }
  },

  setupModuleSwitcher() {
    const select = document.getElementById('moduleSelect');
    if (!select) return;

    AppState.menu.forEach(mod => {
      const option = document.createElement('option');
      option.value = mod.id;
      option.textContent = mod.title;
      select.appendChild(option);
    });

    select.addEventListener('change', (e) => {
      const moduleId = e.target.value;
      window.location.hash = `#${moduleId}`;
    });
  },

  setupSearch() {
    const modal = document.getElementById('search-modal');
    const toggle = document.getElementById('search-toggle');
    const closeBtn = document.getElementById('close-search');
    const input = document.getElementById('search-input');
    const results = document.getElementById('search-results');

    if(!modal || !toggle) return;

    toggle.addEventListener('click', () => {
      modal.classList.remove('hidden');
      modal.classList.add('flex');
      input.focus();
    });

    closeBtn.addEventListener('click', () => {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    });

    input.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase();
      results.innerHTML = '';
      if(!q) return;

      let found = false;
      AppState.menu.forEach(mod => {
        mod.children.forEach(cat => {
          cat.children?.forEach(sec => {
            if(sec.title.toLowerCase().includes(q) || mod.title.toLowerCase().includes(q)) {
              found = true;
              const li = document.createElement('li');
              li.innerHTML = `<a href="#${mod.id}/${sec.sectionId}" class="block p-2 hover:bg-blue-500/10 rounded" onclick="document.getElementById('close-search').click()">
                 <span class="text-xs opacity-60">${mod.title} > ${cat.title}</span><br>
                 <span class="font-medium">${sec.title}</span>
              </a>`;
              results.appendChild(li);
            }
          });
        });
      });

      if(!found) {
        results.innerHTML = '<li class="p-2 opacity-60 text-sm">Không tìm thấy kết quả.</li>';
      }
    });
  },

  renderSidebar() {
    const sidebarMenu = document.getElementById('sidebar-menu');
    let html = '';

    const currentModuleHtml = AppState.menu.map(mod => {
        let text = `<div class="mb-6 module-group hidden" data-module="${mod.id}">`;
        text += `<h2 class="px-4 text-xs font-bold uppercase tracking-wider opacity-60 mb-2">${mod.title}</h2>`;
        text += `<ul class="space-y-1">`;
        mod.children.forEach(category => {
           text += `<li>
             <div class="px-4 py-2 font-medium flex items-center justify-between opacity-80 cursor-pointer category-toggle">
               <span>${category.title}</span>
               <i data-lucide="chevron-down" class="w-4 h-4"></i>
             </div>
             <ul class="pl-4 space-y-1">`;
           if (category.children) {
               category.children.forEach(sec => {
                  text += `<li>
                    <a href="#${mod.id}/${sec.sectionId}" class="block px-4 py-2 text-sm rounded hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                      ${sec.title}
                    </a>
                  </li>`;
               });
           }
           text += `</ul></li>`;
        });
        text += `</ul></div>`;
        return text;
    }).join('');
    
    sidebarMenu.innerHTML = currentModuleHtml;
    
    // Add event listeners for toggles
    document.querySelectorAll('.category-toggle').forEach(toggle => {
      toggle.addEventListener('click', (e) => {
        const ul = e.currentTarget.nextElementSibling;
        const icon = e.currentTarget.querySelector('[data-lucide]');
        if (ul.classList.contains('hidden')) {
           ul.classList.remove('hidden');
           if (icon) icon.setAttribute('data-lucide', 'chevron-down');
        } else {
           ul.classList.add('hidden');
           if (icon) icon.setAttribute('data-lucide', 'chevron-right');
        }
        if (window.lucide) lucide.createIcons();
      });
    });
    
    // Logic to show/hide group based on hash
    this.updateSidebarVisibility();

    window.addEventListener('hashchange', () => this.updateSidebarVisibility());

    if (window.lucide) lucide.createIcons();
  },

  updateSidebarVisibility() {
    const hash = window.location.hash.slice(1) || 'javascript';
    const moduleId = hash.split('/')[0];
    
    document.querySelectorAll('.module-group').forEach(el => {
       if (el.getAttribute('data-module') === moduleId) {
           el.classList.remove('hidden');
       } else {
           el.classList.add('hidden');
       }
    });

    const select = document.getElementById('moduleSelect');
    if (select) select.value = moduleId;
  }
};

document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
