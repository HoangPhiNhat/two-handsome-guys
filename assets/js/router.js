const Router = {
  async handleRoute() {
    const hash = window.location.hash.slice(1) || 'javascript';
    const parts = hash.split('/');
    const moduleId = parts[0];
    const sectionId = parts[1];

    try {
      const response = await fetch(`./data/modules/${moduleId}.json`);
      if (!response.ok) throw new Error('Module not found');
      const moduleData = await response.json();

      document.getElementById('moduleSelect').value = moduleId;
      window.AppState.currentModule = moduleId;
      window.AppState.currentSection = sectionId;

      this.updateSidebarActiveState();

      if (sectionId) {
        Renderer.renderSectionView(moduleData, sectionId);
      } else {
        Renderer.renderModuleView(moduleData);
      }
    } catch (error) {
      console.error(error);
      Renderer.renderError(`Cannot load module '${moduleId}': ${error.message}`);
    }
  },

  updateSidebarActiveState() {
    document.querySelectorAll('#sidebar-menu a').forEach(el => {
      el.classList.remove('bg-blue-500/10', 'text-blue-600', 'dark:text-blue-400', 'font-medium');
      if (el.getAttribute('href') === window.location.hash) {
        el.classList.add('bg-blue-500/10', 'text-blue-600', 'dark:text-blue-400', 'font-medium');
      }
    });
  },

  init() {
    window.addEventListener('hashchange', () => this.handleRoute());
  }
};
