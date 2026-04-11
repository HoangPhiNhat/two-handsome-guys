const Renderer = {
  renderModuleView(moduleData) {
    this.cleanupFloatingTools();
    const container = document.getElementById("content-area");
    container.innerHTML = `
      <div class="max-w-7xl mx-auto px-4 py-2">
        <h1 class="text-4xl font-bold mb-4">${moduleData.meta.title}</h1>
        <p class="text-lg opacity-80 mb-8">${moduleData.meta.description}</p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          ${moduleData.categories
            .map(
              (cat) => `
            <div class="surface p-6 rounded-lg shadow-sm border border-custom">
              <h3 class="text-xl font-semibold mb-2 flex items-center gap-2">
                <i data-lucide="${cat.icon || "folder"}"></i>
                ${cat.name}
              </h3>
              ${cat.description ? `<p class="opacity-70 text-sm mb-4">${cat.description}</p>` : ""}
              <ul class="space-y-2">
                ${moduleData.sections
                  .filter((s) => s.categoryId === cat.id)
                  .map(
                    (section) => `
                  <li>
                    <a href="#${moduleData.meta.id}/${section.id}" class="text-blue-500 hover:underline block p-2 rounded hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                      ${section.title}
                    </a>
                  </li>
                `,
                  )
                  .join("")}
              </ul>
            </div>
          `,
            )
            .join("")}
        </div>
      </div>
    `;
    if (window.lucide) lucide.createIcons();
  },

  async renderSectionView(moduleData, sectionId) {
    const section = moduleData.sections.find((s) => s.id === sectionId);
    if (!section) return this.renderError("Section not found");

    const container = document.getElementById("content-area");
    container.innerHTML = `
      <div class="flex items-center justify-center p-12 opacity-50">
        <i data-lucide="loader" class="animate-spin w-8 h-8"></i>
      </div>
    `;
    if (window.lucide) lucide.createIcons();

    let contentHtml = "";

    if (section.path) {
      try {
        const markdown = await this.fetchMarkdown(section.path);
        contentHtml = marked.parse(markdown);
      } catch (error) {
        return this.renderError(
          `Cannot load content for '${section.title}': ${error.message}`,
        );
      }
    } else if (section.content) {
      contentHtml = this.renderLegacySectionContent(section);
    } else {
      return this.renderError(`Section '${section.title}' has no content path`);
    }

    const html = `
      <div class="max-w-7xl mx-auto px-4 py-2">
        <div class="text-sm opacity-60 mb-4 flex items-center gap-2">
          <a href="#${moduleData.meta.id}" class="hover:underline">${moduleData.meta.title}</a>
          <i data-lucide="chevron-right" class="w-4 h-4"></i>
          <span>${section.title}</span>
        </div>
        <h1 class="text-4xl font-bold mb-2">${section.title}</h1>
        <p class="text-xl opacity-70 mb-8">${section.subtitle || ""}</p>
        <article class="prose max-w-none text-current">
          ${contentHtml}
        </article>
      </div>
    `;

    container.innerHTML = html;
    this.enhanceArticleExperience(container);
    if (window.Prism) Prism.highlightAllUnder(container);
    if (window.lucide) lucide.createIcons();
  },

  enhanceArticleExperience(container) {
    const article = container.querySelector("article.prose");
    if (!article) return;

    const headings = article.querySelectorAll("h1, h2, h3, h4, h5, h6");
    const usedIds = new Set();

    headings.forEach((heading) => {
      const slug = this.createSlug(heading.textContent || "section", usedIds);
      heading.id = slug;
      usedIds.add(slug);
    });

    const numberedHeadings = this.applyHeadingNumbering(article);
    this.renderFloatingTools(article, numberedHeadings);

    const tocHeading = Array.from(article.querySelectorAll("h2")).find((h) =>
      (h.textContent || "").trim().toLowerCase().includes("mục lục"),
    );
    if (tocHeading && tocHeading.nextElementSibling?.tagName === "OL") {
      tocHeading.nextElementSibling.classList.add("toc-list");
    }

    const hashAnchor = this.getAnchorFromHash();
    if (hashAnchor) {
      const decodedHashAnchor = decodeURIComponent(hashAnchor);
      const idFromHash = article.querySelector(
        `#${CSS.escape(decodedHashAnchor)}`,
      )
        ? decodedHashAnchor
        : this.createSlug(decodedHashAnchor);
      this.scrollToHeading(article, idFromHash, "auto");
    }

    article.querySelectorAll('a[href^="#"]').forEach((link) => {
      const rawTarget = decodeURIComponent(link.getAttribute("href").slice(1));
      if (!rawTarget) return;

      let finalTarget = rawTarget;
      if (!article.querySelector(`#${CSS.escape(finalTarget)}`)) {
        const fallbackFromText = this.createSlug(link.textContent || rawTarget);
        if (article.querySelector(`#${CSS.escape(fallbackFromText)}`)) {
          finalTarget = fallbackFromText;
          link.setAttribute("href", `#${finalTarget}`);
        }
      }

      link.addEventListener("click", (event) => {
        const targetEl = article.querySelector(`#${CSS.escape(finalTarget)}`);
        if (!targetEl) return;

        event.preventDefault();
        this.navigateToHeading(article, finalTarget, "smooth");
      });
    });
  },

  applyHeadingNumbering(article) {
    const candidates = Array.from(article.querySelectorAll("h2, h3, h4"));
    const headings = candidates.filter((heading) => {
      const text = (heading.textContent || "").trim().toLowerCase();
      return text && !text.includes("mục lục");
    });

    const counters = { 2: 0, 3: 0, 4: 0 };
    const headingData = [];

    headings.forEach((heading) => {
      const level = Number(heading.tagName.slice(1));
      if (level < 2 || level > 4) return;

      if (level === 2) {
        counters[2] += 1;
        counters[3] = 0;
        counters[4] = 0;
      }
      if (level === 3) {
        if (counters[2] === 0) counters[2] = 1;
        counters[3] += 1;
        counters[4] = 0;
      }
      if (level === 4) {
        if (counters[2] === 0) counters[2] = 1;
        if (counters[3] === 0) counters[3] = 1;
        counters[4] += 1;
      }

      const number = [counters[2], counters[3], counters[4]]
        .slice(0, Math.max(1, level - 1))
        .filter((n) => n > 0)
        .join(".");

      // if (!heading.querySelector(".section-number")) {
      //   const originalText = heading.textContent || "";
      //   heading.textContent = "";
      //   const numberNode = document.createElement("span");
      //   numberNode.className = "section-number";
      //   numberNode.textContent = `${number}. `;
      //   heading.appendChild(numberNode);
      //   heading.appendChild(document.createTextNode(originalText));
      // }

      headingData.push({
        id: heading.id,
        level,
        title: (heading.textContent || "").trim(),
        number,
      });
    });

    return headingData;
  },

  renderFloatingTools(article, headingData) {
    this.cleanupFloatingTools();

    const controls = document.createElement("div");
    controls.className = "floating-tools";

    const topBtn = document.createElement("button");
    topBtn.className = "floating-tool-btn";
    topBtn.type = "button";
    topBtn.title = "Lên đầu trang";
    topBtn.innerHTML = '<i data-lucide="arrow-up"></i>';
    topBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    controls.appendChild(topBtn);

    if (headingData.length > 0) {
      const tocBtn = document.createElement("button");
      tocBtn.className = "floating-tool-btn";
      tocBtn.type = "button";
      tocBtn.title = "Mở mục lục";
      tocBtn.innerHTML = '<i data-lucide="list"></i>';

      const panel = document.createElement("aside");
      panel.className = "floating-toc-panel hidden";
      panel.innerHTML = `
        <div class="floating-toc-head">
          <strong>Mục lục</strong>
          <button type="button" class="floating-toc-close" aria-label="Đóng mục lục">×</button>
        </div>
        <ol class="floating-toc-list"></ol>
      `;

      const list = panel.querySelector(".floating-toc-list");
      headingData.forEach((heading) => {
        const li = document.createElement("li");
        li.className = `toc-level-${heading.level}`;
        const a = document.createElement("a");
        a.href = `#${heading.id}`;
        a.textContent = heading.title;
        a.addEventListener("click", (event) => {
          event.preventDefault();
          this.navigateToHeading(article, heading.id, "smooth");
          panel.classList.add("hidden");
        });
        li.appendChild(a);
        list.appendChild(li);
      });

      tocBtn.addEventListener("click", () => {
        panel.classList.toggle("hidden");
      });

      panel
        .querySelector(".floating-toc-close")
        .addEventListener("click", () => {
          panel.classList.add("hidden");
        });

      document.body.appendChild(panel);
      controls.appendChild(tocBtn);
    }

    document.body.appendChild(controls);
  },

  cleanupFloatingTools() {
    document
      .querySelectorAll(".floating-tools, .floating-toc-panel")
      .forEach((el) => el.remove());
  },

  navigateToHeading(article, headingId, behavior) {
    const routePrefix = this.getCurrentRoutePrefix();
    window.history.replaceState(null, "", `#${routePrefix}/#${headingId}`);
    this.scrollToHeading(article, headingId, behavior);
  },

  getCurrentRoutePrefix() {
    const hash = window.location.hash.slice(1);
    const routePart = hash.split("/#")[0];
    const parts = routePart.split("/").filter(Boolean);
    const moduleId = window.AppState?.currentModule || parts[0] || "javascript";
    const sectionId =
      window.AppState?.currentSection || parts[1] || "variables";
    return `${moduleId}/${sectionId}`;
  },

  getAnchorFromHash() {
    const hash = window.location.hash.slice(1);
    const anchorIndex = hash.indexOf("/#");
    if (anchorIndex === -1) return "";
    return hash.slice(anchorIndex + 2);
  },

  scrollToHeading(article, headingId, behavior) {
    const targetEl = article.querySelector(`#${CSS.escape(headingId)}`);
    if (!targetEl) return;

    requestAnimationFrame(() => {
      const topbarHeight = 72;
      const y =
        targetEl.getBoundingClientRect().top + window.scrollY - topbarHeight;
      window.scrollTo({ top: y, behavior });
    });
  },

  createSlug(text, usedIds) {
    const base = text
      .toLowerCase()
      .trim()
      .replace(/[^\p{L}\p{N}\s-]/gu, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

    if (!usedIds) return base || "section";

    let candidate = base || "section";
    let index = 2;
    while (usedIds.has(candidate)) {
      candidate = `${base || "section"}-${index}`;
      index += 1;
    }

    return candidate;
  },

  async fetchMarkdown(path) {
    const normalizedPath = path.startsWith("/") ? `.${path}` : path;
    const response = await fetch(normalizedPath);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return response.text();
  },

  renderLegacySectionContent(section) {
    let html = marked.parse(section.content.introduction || "");

    if (section.content.topics) {
      section.content.topics.forEach((topic) => {
        html += `<h2 class="text-2xl font-semibold mt-8 mb-4 border-b border-custom pb-2">${topic.heading}</h2>`;
        html += marked.parse(topic.content || "");

        if (topic.codeExamples) {
          topic.codeExamples.forEach((code) => {
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

    return html;
  },

  renderError(msg) {
    this.cleanupFloatingTools();
    const container = document.getElementById("content-area");
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
  },
};
