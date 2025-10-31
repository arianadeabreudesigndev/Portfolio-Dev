class FilterManager {
    constructor() {
        this.activeFilters = {
            tech: [],
            category: [],
            status: [],
            date: []
        };

        this.init();
    }

    init() {
        this.bindEvents();
        console.log("Filtro inicializado com sucesso");
    }

    bindEvents() {
        const filterToggle = document.querySelector(".filter-toggle");
        const filterDropdown = document.querySelector(".filter-dropdown");
        const applyBtn = document.querySelector(".apply-filters");
        const clearBtn = document.querySelector(".clear-filters");

        // --- Dropdown de Filtro ---
        if (filterToggle && filterDropdown) {
            // Clona o botão para evitar conflitos de listener duplicado
            const newToggle = filterToggle.cloneNode(true);
            filterToggle.parentNode.replaceChild(newToggle, filterToggle);

            newToggle.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log("Botão de filtro clicado");
                filterDropdown.classList.toggle("show");
            });

            document.addEventListener("click", (e) => {
                const clickedInside = e.target.closest(".filter-icon-container");
                if (!clickedInside && filterDropdown.classList.contains("show")) {
                    filterDropdown.classList.remove("show");
                }
            });

            filterDropdown.addEventListener("click", (e) => e.stopPropagation());
        }

        // --- Botões principais ---
        applyBtn?.addEventListener("click", () => this.applyFilters());
        clearBtn?.addEventListener("click", () => this.clearFilters());
    }

    // --- Ações principais ---
    applyFilters() {
        console.log("Aplicando filtros");
        this.updateActiveFilters();
        this.filterProjects();
        this.updateActiveFiltersView();
        document.querySelector(".filter-dropdown")?.classList.remove("show");
    }

    clearFilters() {
        console.log("Limpando filtros");

        document
            .querySelectorAll(".filter-options input[type='checkbox']")
            .forEach(cb => (cb.checked = false));

        this.activeFilters = { tech: [], category: [], status: [], date: [] };

        document.querySelectorAll(".projectItem").forEach(item =>
            item.classList.remove("hide")
        );

        const activeContainer = document.querySelector(".active-filters");
        if (activeContainer) activeContainer.innerHTML = "";
    }

    // --- Atualiza o estado interno dos filtros ---
    updateActiveFilters() {
        const filters = { tech: [], category: [], status: [], date: [] };

        document
            .querySelectorAll(".filter-options input[type='checkbox']:checked")
            .forEach(({ name, value }) => {
                if (filters[name]) filters[name].push(value);
            });

        this.activeFilters = filters;
        console.log("Filtros ativos:", this.activeFilters);
    }

    // --- Filtra os projetos visíveis ---
    filterProjects() {
        const items = document.querySelectorAll(".projectItem");
        console.log(`Filtrando ${items.length} projetos`);

        items.forEach(item => {
            const show = this.shouldShowItem(item);
            item.classList.toggle("hide", !show);
        });
    }

    shouldShowItem(item) {
        const hasActive = Object.values(this.activeFilters).some(arr => arr.length);
        if (!hasActive) return true;

        return (
            this.checkTech(item) &&
            this.checkCategory(item) &&
            this.checkStatus(item) &&
            this.checkDate(item)
        );
    }

    // --- Verificações individuais ---
    checkTech(item) {
        const { tech } = this.activeFilters;
        if (!tech.length) return true;

        const itemTechs = item.dataset.tech?.split(" ") || [];
        return tech.some(t => itemTechs.includes(t));
    }

    checkCategory(item) {
        const { category } = this.activeFilters;
        if (!category.length) return true;
        return category.includes(item.dataset.category);
    }

    checkStatus(item) {
        const { status } = this.activeFilters;
        if (!status.length) return true;
        return status.includes(item.dataset.status);
    }

    checkDate(item) {
        const { date } = this.activeFilters;
        if (!date.length) return true;

        const itemDate = parseInt(item.dataset.date, 10);
        let visible = true;

        if (date.includes("recent")) visible &&= itemDate >= 202305;
        if (date.includes("oldest")) visible &&= itemDate < 202305;

        return visible;
    }

    // --- Atualiza visual dos filtros ativos ---
    updateActiveFiltersView() {
        const container = document.querySelector(".active-filters");
        if (!container) return;

        container.innerHTML = "";

        Object.entries(this.activeFilters).forEach(([type, values]) => {
            values.forEach(value => {
                if (!value) return;

                const el = document.createElement("div");
                el.className = "active-filter";
                el.innerHTML = `
                    ${this.getFilterLabel(type, value)}
                    <button data-type="${type}" data-value="${value}">×</button>
                `;

                el.querySelector("button").addEventListener("click", () =>
                    this.removeFilter(type, value)
                );

                container.appendChild(el);
            });
        });
    }

    // --- Remove um filtro ativo ---
    removeFilter(type, value) {
        console.log(`Removendo filtro: ${type} = ${value}`);

        this.activeFilters[type] = this.activeFilters[type].filter(v => v !== value);

        const checkbox = document.querySelector(
            `.filter-options input[name='${type}'][value='${value}']`
        );
        if (checkbox) checkbox.checked = false;

        this.filterProjects();
        this.updateActiveFiltersView();
    }

    // --- Labels amigáveis ---
    getFilterLabel(type, value) {
        const labels = {
            tech: {
                react: "React",
                html: "HTML",
                css: "CSS",
                typescript: "TypeScript",
                javascript: "JavaScript"
            },
            category: {
                fullstack: "Fullstack",
                frontend: "Front-end",
                backend: "Back-end"
            },
            status: {
                completed: "Finalizado",
                progress: "Em andamento"
            },
            date: {
                recent: "Mais recentes",
                oldest: "Mais antigos"
            }
        };

        const typeLabels = {
            tech: "Tec",
            category: "Categoria",
            status: "Status",
            date: "Data"
        };

        const label = labels[type]?.[value] || value;
        return `${typeLabels[type]}: ${label}`;
    }
}

// --- Inicialização ---
document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        window.filterManager = new FilterManager();
    }, 100);
});

window.addEventListener("load", () => {
    if (!window.filterManager) window.filterManager = new FilterManager();
});
