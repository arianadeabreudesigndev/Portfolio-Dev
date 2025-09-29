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
        const filterToggle = document.querySelector('.filter-toggle');
        const filterDropdown = document.querySelector('.filter-dropdown');
        
        if (filterToggle && filterDropdown) {
            const newToggle = filterToggle.cloneNode(true);
            filterToggle.parentNode.replaceChild(newToggle, filterToggle);
            
            document.querySelector('.filter-toggle').addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log("Botão de filtro clicado");
                filterDropdown.classList.toggle('show');
            });
            
            document.addEventListener('click', (e) => {
                const isClickInsideFilter = e.target.closest('.filter-icon-container');
                if (!isClickInsideFilter && filterDropdown.classList.contains('show')) {
                    filterDropdown.classList.remove('show');
                }
            });
            
            filterDropdown.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }
        
        const applyBtn = document.querySelector('.apply-filters');
        const clearBtn = document.querySelector('.clear-filters');
        
        if (applyBtn) {
            applyBtn.addEventListener('click', () => this.applyFilters());
        }
        
        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.clearFilters());
        }
    }
    
    applyFilters() {
        console.log("Aplicando filtros");
        this.updateActiveFilters();
        this.filterProjects();
        this.updateActiveFiltersView();
        document.querySelector('.filter-dropdown')?.classList.remove('show');
    }
    
    clearFilters() {
        console.log("Limpando filtros");
        document.querySelectorAll('.filter-options input[type="checkbox"]').forEach(cb => {
            cb.checked = false;
        });
        
        this.activeFilters = { tech: [], category: [], status: [], date: [] };
        
        document.querySelectorAll('.projectItem').forEach(item => {
            item.classList.remove('hide');
        });
        
        const activeFiltersContainer = document.querySelector('.active-filters');
        if (activeFiltersContainer) {
            activeFiltersContainer.innerHTML = '';
        }
    }
    
    updateActiveFilters() {
        this.activeFilters = { tech: [], category: [], status: [], date: [] };
        
        document.querySelectorAll('.filter-options input[type="checkbox"]:checked').forEach(checkbox => {
            const type = checkbox.name;
            const value = checkbox.value;
            if (this.activeFilters[type]) {
                this.activeFilters[type].push(value);
            }
        });
        
        console.log("Filtros ativos:", this.activeFilters);
    }
    
    filterProjects() {
        const items = document.querySelectorAll('.projectItem');
        console.log(`Filtrando ${items.length} projetos`);
        
        items.forEach(item => {
            const show = this.shouldShowItem(item);
            item.classList.toggle('hide', !show);
        });
    }
    
    shouldShowItem(item) {
        const hasActiveFilters = Object.values(this.activeFilters).some(arr => arr.length > 0);
        if (!hasActiveFilters) return true;
        
        const checks = [
            this.checkTech(item),
            this.checkCategory(item),
            this.checkStatus(item),
            this.checkDate(item)
        ];
        
        return checks.every(check => check !== false);
    }
    
    checkTech(item) {
        if (this.activeFilters.tech.length === 0) return true;
        const itemTechs = item.dataset.tech.split(' ');
        return this.activeFilters.tech.some(tech => itemTechs.includes(tech));
    }
    
    checkCategory(item) {
        if (this.activeFilters.category.length === 0) return true;
        return this.activeFilters.category.includes(item.dataset.category);
    }
    
    checkStatus(item) {
        if (this.activeFilters.status.length === 0) return true;
        return this.activeFilters.status.includes(item.dataset.status);
    }
    
    checkDate(item) {
        if (this.activeFilters.date.length === 0) return true;
        
        const itemDate = parseInt(item.dataset.date);
        let shouldShow = true;
        
        if (this.activeFilters.date.includes('recent')) {
            shouldShow = shouldShow && itemDate >= 202305;
        }
        if (this.activeFilters.date.includes('oldest')) {
            shouldShow = shouldShow && itemDate < 202305;
        }
        
        return shouldShow;
    }
    
    updateActiveFiltersView() {
        const container = document.querySelector('.active-filters');
        if (!container) return;
        
        container.innerHTML = '';
        
        Object.entries(this.activeFilters).forEach(([type, values]) => {
            values.forEach(value => {
                if (!value) return;
                
                const filterEl = document.createElement('div');
                filterEl.className = 'active-filter';
                filterEl.innerHTML = `
                    ${this.getFilterLabel(type, value)}
                    <button data-type="${type}" data-value="${value}">×</button>
                `;
                
                filterEl.querySelector('button').addEventListener('click', (e) => {
                    this.removeFilter(type, value);
                });
                
                container.appendChild(filterEl);
            });
        });
    }
    
    removeFilter(type, value) {
        console.log(`Removendo filtro: ${type} = ${value}`);
        
        this.activeFilters[type] = this.activeFilters[type].filter(v => v !== value);
        
        const checkbox = document.querySelector(`.filter-options input[name="${type}"][value="${value}"]`);
        if (checkbox) checkbox.checked = false;
        
        this.filterProjects();
        this.updateActiveFiltersView();
    }
    
    getFilterLabel(type, value) {
        const labels = {
            tech: {
                react: 'React',
                html: 'HTML', 
                css: 'CSS',
                typescript: 'TypeScript',
                javascript: 'JavaScript'
            },
            category: {
                fullstack: 'Fullstack',
                frontend: 'Front-end',
                backend: 'Back-end'
            },
            status: {
                completed: 'Finalizado',
                progress: 'Em andamento'
            },
            date: {
                recent: 'Mais recentes',  // Implementar depois
                oldest: 'Mais antigos'
            }
        };
        
        const typeLabels = {
            tech: 'Tec',
            category: 'Categoria',
            status: 'Status',
            date: 'Data'
        };
        
        return `${typeLabels[type]}: ${labels[type]?.[value] || value}`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        window.filterManager = new FilterManager();
    }, 100);
});

window.addEventListener('load', () => {
    if (!window.filterManager) {
        window.filterManager = new FilterManager();
    }
});