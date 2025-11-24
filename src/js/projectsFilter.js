/* Filtro de projetos
   - Inicialização segura (não duplica listeners)
   - Funciona com HTML carregado dinamicamente (pageLoader)
*/

(function () {
    const ATTR_INIT = 'data-fm-initialized';

    class FilterManager {
        constructor(root = document) {
            this.root = root;
            this.activeFilters = { tech: [], category: [], status: [], date: [] };
            this.dom = {};
            this._onDocClick = this._onDocClick.bind(this);
            this._onKeydown = this._onKeydown.bind(this);
            this._checkboxChangeHandler = this._checkboxChangeHandler.bind(this);

            this.cacheDOM();
            this.bindEvents();
        }

        cacheDOM() {
            const scope = this.root;
            this.dom.dropdown = scope.querySelector(".filter-dropdown");
            this.dom.toggleBtn = scope.querySelector(".filter-toggle");
            this.dom.applyBtn = scope.querySelector(".apply-filters");
            this.dom.clearBtn = scope.querySelector(".clear-filters");
            this.dom.activeFiltersContainer = scope.querySelector(".active-filters");
            this.dom.items = Array.from(scope.querySelectorAll(".projectItem"));
            this.dom.checkboxInputs = Array.from(scope.querySelectorAll(".filter-options input[type='checkbox']"));
        }

        bindEvents() {
            const { toggleBtn, dropdown, applyBtn, clearBtn, checkboxInputs } = this.dom;

            if (toggleBtn && toggleBtn.getAttribute(ATTR_INIT) !== '1') {
                toggleBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    dropdown?.classList.toggle('show');
                });
                toggleBtn.setAttribute(ATTR_INIT, '1');
            }

            if (dropdown && dropdown.getAttribute(ATTR_INIT) !== '1') {
                dropdown.addEventListener('click', (e) => e.stopPropagation());
                dropdown.setAttribute(ATTR_INIT, '1');
            }

            if (!document.body.hasAttribute('data-fm-doc-listeners')) {
                document.addEventListener('click', this._onDocClick);
                document.addEventListener('keydown', this._onKeydown);
                document.body.setAttribute('data-fm-doc-listeners', '1');
            }

            if (applyBtn && applyBtn.getAttribute(ATTR_INIT) !== '1') {
                applyBtn.addEventListener('click', () => this.applyFilters());
                applyBtn.setAttribute(ATTR_INIT, '1');
            }

            if (clearBtn && clearBtn.getAttribute(ATTR_INIT) !== '1') {
                clearBtn.addEventListener('click', () => this.clearFilters());
                clearBtn.setAttribute(ATTR_INIT, '1');
            }

            checkboxInputs.forEach(cb => {
                if (cb.getAttribute(ATTR_INIT) !== '1') {
                    cb.addEventListener('change', this._checkboxChangeHandler);
                    cb.setAttribute(ATTR_INIT, '1');
                }
            });
        }

        _onDocClick(e) {
            const dd = this.dom.dropdown;
            if (dd && dd.classList.contains('show')) {
                const inside = e.target.closest?.('.filter-dropdown') || e.target.closest?.('.filter-icon-container');
                if (!inside) dd.classList.remove('show');
            }
        }

        _onKeydown(e) {
            if (e.key === 'Escape') {
                this.dom.dropdown?.classList.remove('show');
            }
        }

        _checkboxChangeHandler() {
            this.updateActiveFilters();
            this.filterProjects();
            this.updateActiveFiltersView();
        }

        applyFilters() {
            this.updateActiveFilters();
            this.filterProjects();
            this.updateActiveFiltersView();
            this.dom.dropdown?.classList.remove('show');
        }

        clearFilters() {
            this.dom.checkboxInputs.forEach(cb => (cb.checked = false));
            this.activeFilters = { tech: [], category: [], status: [], date: [] };
            this.dom.items.forEach(item => item.classList.remove('hide'));
            if (this.dom.activeFiltersContainer) this.dom.activeFiltersContainer.innerHTML = '';
        }

        updateActiveFilters() {
            const filters = { tech: [], category: [], status: [], date: [] };
            this.dom.checkboxInputs
                .filter(cb => cb.checked)
                .forEach(({ name, value }) => {
                    if (filters[name]) filters[name].push(value);
                });
            this.activeFilters = filters;
        }

        filterProjects() {
            this.dom.items = Array.from(this.root.querySelectorAll('.projectItem'));
            const hasFilters = Object.values(this.activeFilters).some(a => a.length);
            this.dom.items.forEach(item => {
                const visible = hasFilters ? this.checkItem(item) : true;
                item.classList.toggle('hide', !visible);
            });
        }

        checkItem(item) {
            return (
                this.matchFilter(item, 'tech', () => item.dataset.tech?.split(/\s+/) || []) &&
                this.matchFilter(item, 'category', () => item.dataset.category) &&
                this.matchFilter(item, 'status', () => item.dataset.status) &&
                this.matchDate(item)
            );
        }

        matchFilter(item, type, extractor) {
            const values = this.activeFilters[type];
            if (!values.length) return true;
            const itemVal = extractor();
            return Array.isArray(itemVal)
                ? values.some(v => itemVal.includes(v))
                : values.includes(itemVal);
        }

        matchDate(item) {
            const dates = this.activeFilters.date;
            if (!dates.length) return true;
            const itemDate = Number(item.dataset.date);
            return dates.every(rule => (rule === 'recent' ? itemDate >= 202305 : itemDate < 202305));
        }

        updateActiveFiltersView() {
            const container = this.dom.activeFiltersContainer;
            if (!container) return;
            container.innerHTML = '';
            Object.entries(this.activeFilters).forEach(([type, values]) => {
                values.forEach(value => {
                    container.appendChild(this.createFilterTag(type, value));
                });
            });
        }

        createFilterTag(type, value) {
            const tag = document.createElement('div');
            tag.className = 'active-filter';
            tag.innerHTML = `${this.getFilterLabel(type, value)} <button data-type="${type}" data-value="${value}">×</button>`;
            const btn = tag.querySelector('button');
            btn.addEventListener('click', () => this.removeFilter(type, value));
            return tag;
        }

        removeFilter(type, value) {
            this.activeFilters[type] = this.activeFilters[type].filter(v => v !== value);
            const cb = this.root.querySelector(`.filter-options input[name='${type}'][value='${value}']`);
            if (cb) cb.checked = false;
            this.filterProjects();
            this.updateActiveFiltersView();
        }

        getFilterLabel(type, value) {
            const labels = {
                tech: { react: "React", html: "HTML", css: "CSS", typescript: "TypeScript", javascript: "JavaScript" },
                category: { fullstack: "Fullstack", frontend: "Front-end", backend: "Back-end" },
                status: { completed: "Finalizado", progress: "Em andamento" },
                date: { recent: "Mais recentes", oldest: "Mais antigos" }
            };
            const prefixes = { tech: "Tec", category: "Categoria", status: "Status", date: "Data" };
            return `${prefixes[type]}: ${labels[type]?.[value] || value}`;
        }

        destroy() {
            if (document.body.hasAttribute('data-fm-doc-listeners')) {
                document.removeEventListener('click', this._onDocClick);
                document.removeEventListener('keydown', this._onKeydown);
                document.body.removeAttribute('data-fm-doc-listeners');
            }

            this.dom.checkboxInputs.forEach(cb => {
                if (cb.getAttribute(ATTR_INIT) === '1') {
                    cb.removeEventListener('change', this._checkboxChangeHandler);
                    cb.removeAttribute(ATTR_INIT);
                }
            });

            this.dom = {};
            this.activeFilters = { tech: [], category: [], status: [], date: [] };
        }
    }

    /* Inicialização automática (funciona com pageLoader + SPA simples) */
    let observer = null;

    function initFiltersOnce() {
        if (window.filterManager) {
            try {
                window.filterManager.cacheDOM();
                window.filterManager.bindEvents();
                window.filterManager.filterProjects();
                window.filterManager.updateActiveFiltersView();
            } catch { }
            return;
        }

        const toggle = document.querySelector('.filter-toggle');

        if (toggle && document.querySelector('.projectItem')) {
            window.filterManager = new FilterManager(document.getElementById('projects') || document);
            return;
        }

        if (!observer) {
            observer = new MutationObserver((mutations, obs) => {
                if (document.querySelector('.filter-toggle') && document.querySelector('.projectItem')) {
                    initFiltersOnce();
                    obs.disconnect();
                    observer = null;
                }
            });
            observer.observe(document.documentElement, { childList: true, subtree: true });
        }
    }

    document.addEventListener('pageLoaded', (e) => {
        if (!e?.detail) return;
        if (e.detail.id === 'projects') {
            initFiltersOnce();
            return;
        }

        setTimeout(() => {
            if (window.filterManager) {
                window.filterManager.cacheDOM();
                window.filterManager.bindEvents();
            }
        }, 50);
    });

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initFiltersOnce);
    } else {
        initFiltersOnce();
    }

    window.initFilters = initFiltersOnce;
    window.destroyFilters = () => {
        if (window.filterManager) {
            window.filterManager.destroy();
            delete window.filterManager;
        }
        if (observer) {
            observer.disconnect();
            observer = null;
        }
    };
})();
