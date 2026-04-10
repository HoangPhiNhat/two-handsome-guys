const Renderer = {
  renderModuleView(moduleData) {
    const container = document.getElementById('content-area');
    container.innerHTML = `
      <div class="max-w-7xl mx-auto px-4 py-2">
        <h1 class="text-4xl font-bold mb-4">${moduleData.meta.title}</h1>
        <p class="text-lg opacity-80 mb-8">${moduleData.meta.description}</p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          ${moduleData.categories.map(cat => `
            <div class="surface p-6 rounded-lg shadow-sm border border-custom">
              <h3 class="text-xl font-semibold mb-2 flex items-center gap-2">
                <i data-lucide="${cat.icon || 'folder'}"></i>
                ${cat.name}
              </h3>
              ${cat.description ? `<p class="opacity-70 text-sm mb-4">${cat.description}</p>` : ''}
              <ul class="space-y-2">
                ${moduleData.sections.filter(s => s.categoryId === cat.id).map(section => `
                  <li>
                    <a href="#${moduleData.meta.id}/${section.id}" class="text-blue-500 hover:underline block p-2 rounded hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                      ${section.title}
                    </a>
                  </li>
                `).join('')}
              </ul>
            </div>
          `).join('')}
        </div>
      </div>
    `;
    if (window.lucide) lucide.createIcons();
  },

  renderSectionView(moduleData, sectionId) {
    const section = moduleData.sections.find(s => s.id === sectionId);
    if (!section) return this.renderError('Section not found');

    const container = document.getElementById('content-area');

    let html = `
      <div class="max-w-7xl mx-auto px-4 py-2">
        <div class="text-sm opacity-60 mb-4 flex items-center gap-2">
          <a href="#${moduleData.meta.id}" class="hover:underline">${moduleData.meta.title}</a>
          <i data-lucide="chevron-right" class="w-4 h-4"></i>
          <span>${section.title}</span>
        </div>
        <h1 class="text-4xl font-bold mb-2">${section.title}</h1>
        <p class="text-xl opacity-70 mb-8">${section.subtitle || ''}</p>

        <div class="prose max-w-none text-current">
          ${marked.parse(section.content.introduction || '')}
    `;

    if (section.content.topics) {
      section.content.topics.forEach(topic => {
        html += `<h2 class="text-2xl font-semibold mt-8 mb-4 border-b border-custom pb-2">${topic.heading}</h2>`;
        html += marked.parse(topic.content || '');

        if (topic.codeExamples) {
          topic.codeExamples.forEach(code => {
            if (code.title) {
              html += `<div class="text-sm font-semibold opacity-70 mt-4 mb-1">${code.title}</div>`;
            }
            html += `<pre><code class="language-${code.language}">${this.escapeHtml(code.code)}</code></pre>`;
            if (code.explanation) {
              html += `<div class="bg-blue-50 dark:bg-blue-900/30 p-4 rounded mt-2 text-sm border-l-4 border-blue-500">${code.explanation}</div>`;
            }
          });
        }
      });
    }

    if (section.content.summary) {
        html += marked.parse(section.content.summary);
    }

    html += `
        </div>
      </div>
    `;

    container.innerHTML = html;
    if (window.Prism) Prism.highlightAllUnder(container);
    if (window.lucide) lucide.createIcons();
  },

  renderError(msg) {
    const container = document.getElementById('content-area');
    container.innerHTML = `
      <div class="flex items-center justify-center h-full">
        <div class="text-center">
          <i data-lucide="alert-circle" class="w-16 h-16 text-red-500 mx-auto mb-4"></i>
          <h2 class="text-2xl font-bold text-red-500 mb-2">Lỗi</h2>
          <p class="opacity-80">${msg}</p>
        </div>
      </div>
    `;
    if (window.lucide) lucide.createIcons();
  },

  escapeHtml(unsafe) {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
  }
};
