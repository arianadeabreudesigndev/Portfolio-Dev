class FilterManager {
    constructor() {
        this.activeTechs = new Set();
        this.techOptionsContainer = null;
        this.dropdown = null;
        this.bound = false;
        this.init();
    }

    init() {
        this.tryBindDom();
    }

    tryBindDom() {
        this.techOptionsContainer = document.querySelector(".filter-options.tech-options");
        this.dropdown = document.querySelector(".filter-dropdown");

        const filterToggle = document.querySelector(".filter-toggle");
        const applyBtn = document.querySelector(".apply-filters");
        const clearBtn = document.querySelector(".clear-filters");

        if (!filterToggle || !this.dropdown) {
            // conteúdo de projetos é carregado depois, tenta novamente
            setTimeout(() => this.tryBindDom(), 120);
            return;
        }

        if (this.bound) return;
        this.bound = true;

        filterToggle.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.dropdown.classList.toggle("show");
        });

        document.addEventListener("click", (e) => {
            const clickedInside = e.target.closest(".filter-icon-container");
            if (!clickedInside && this.dropdown.classList.contains("show")) {
                this.dropdown.classList.remove("show");
            }
        });

        this.dropdown.addEventListener("click", (e) => e.stopPropagation());
        applyBtn?.addEventListener("click", () => this.applyFilters());
        clearBtn?.addEventListener("click", () => this.clearFilters());
    }

    setAvailableTechs(techs = []) {
        if (!this.techOptionsContainer) return;
        this.techOptionsContainer.innerHTML = "";

        const unique = Array.from(new Set(techs.map(t => t.toLowerCase()))).sort();

        unique.forEach(tech => {
            const label = document.createElement("label");
            label.innerHTML = `<input type="checkbox" name="tech" value="${tech}">${tech}`;
            this.techOptionsContainer.appendChild(label);
        });
    }

    applyFilters() {
        this.updateActiveTechs();
        this.filterProjects();
        this.dropdown?.classList.remove("show");
    }

    clearFilters() {
        document
            .querySelectorAll(".filter-options input[type='checkbox']")
            .forEach(cb => (cb.checked = false));

        this.activeTechs = new Set();
        document.querySelectorAll(".projectItem").forEach(item =>
            item.classList.remove("hide")
        );
    }

    updateActiveTechs() {
        const techs = new Set();
        document
            .querySelectorAll(".filter-options input[type='checkbox']:checked")
            .forEach(({ value }) => techs.add(value));
        this.activeTechs = techs;
    }

    filterProjects() {
        const items = document.querySelectorAll(".projectItem");
        if (!items.length) return;

        items.forEach(item => {
            const show = this.shouldShowItem(item);
            item.classList.toggle("hide", !show);
        });
    }

    shouldShowItem(item) {
        if (!this.activeTechs.size) return true;
        const itemTechs = (item.dataset.tech || "").split(" ").filter(Boolean);
        return itemTechs.some(t => this.activeTechs.has(t));
    }
}

function ensureFilterManager() {
    if (!window.filterManager) {
        window.filterManager = new FilterManager();
    }
    return window.filterManager;
}

document.addEventListener("DOMContentLoaded", () => {
    ensureFilterManager();
});

window.addEventListener("load", ensureFilterManager);
