class ProjectsModal {
    constructor() {
        this.modal = null;
        this.currentProjectData = null;
        this.isInitialized = false;
        this.init();
    }

    init() {
        const waitForLanguageManager = () => {
            if (window.languageManager && window.languageManager.hasSavedOriginals) {
                this.setupModal();
                this.setupEventListeners();
                this.isInitialized = true;
            } else {
                setTimeout(waitForLanguageManager, 100);
            }
        };

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', waitForLanguageManager);
        } else {
            waitForLanguageManager();
        }
    }

    setupModal() {
        this.modal = document.getElementById('projectModal');
        if (!this.modal) {
            console.error('Modal element not found!');
            return;
        }
    }

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            const projectLink = e.target.closest('.project-image-link');
            if (projectLink) {
                e.preventDefault();
                const projectItem = projectLink.closest('.projectItem');
                if (projectItem) {
                    this.openModal(projectItem);
                }
                return;
            }

            if (e.target.closest('.modal-close') || e.target === this.modal) {
                this.closeModal();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                this.closeModal();
            }
        });

        if (window.languageManager) {
            window.addEventListener('languageChanged', () => {
                if (this.currentProjectData) {
                    this.updateModalContent();
                }
            });
        }
    }

    openModal(projectItem) {
        try {
            this.currentProjectData = this.extractProjectData(projectItem);
            this.updateModalContent();
            
            this.modal.classList.add('active');
            document.body.style.overflow = 'hidden';

        } catch (error) {
            console.error('Error opening modal:', error);
        }
    }

    extractProjectData(projectItem) {
        const details = projectItem.querySelector('.project-details');
        if (!details) throw new Error('Project details not found');

        return {
            image: projectItem.querySelector('.projectImage')?.src,
            title: projectItem.querySelector('h2')?.textContent?.trim(),
            titleKey: projectItem.querySelector('h2')?.getAttribute('data-i18n'),
            description: details.querySelector('.detailed-description')?.textContent?.trim(),
            descriptionKey: details.querySelector('.detailed-description')?.getAttribute('data-i18n'),
            tags: Array.from(projectItem.querySelectorAll('.tag')).map(tag => ({
                text: tag.textContent?.trim(),
                key: tag.getAttribute('data-i18n')
            })),
            githubUrl: details.querySelector('.github-url')?.textContent?.trim(),
            demoUrl: details.querySelector('.demo-url')?.textContent?.trim()
        };
    }

    updateModalContent() {
        if (!this.currentProjectData) return;

        const modalImage = this.modal.querySelector('.modal-image');
        const titleElement = this.modal.querySelector('.modal-title');
        const descriptionElement = this.modal.querySelector('.modal-description');
        const tagsContainer = this.modal.querySelector('.modal-tags');
        const githubBtn = this.modal.querySelector('.github-btn');
        const demoBtn = this.modal.querySelector('.demo-btn');

        if (modalImage && this.currentProjectData.image) {
            modalImage.src = this.currentProjectData.image;
            modalImage.alt = this.currentProjectData.title || '';
        }

        if (githubBtn && this.currentProjectData.githubUrl) {
            githubBtn.href = this.currentProjectData.githubUrl;
        }

        // Se não houver demoUrl, esconde o botão demo, senão mostra e define href
        if (demoBtn) {
            if (this.currentProjectData.demoUrl && this.currentProjectData.demoUrl.trim() !== '') {
                demoBtn.href = this.currentProjectData.demoUrl;
                demoBtn.style.display = 'flex'; // ou '' para restaurar o estilo padrão
            } else {
                demoBtn.style.display = 'none';
            }
        }

        this.updateTranslatedContent();

        if (tagsContainer) {
            tagsContainer.innerHTML = '';
            this.currentProjectData.tags.forEach(tag => {
                const tagElement = document.createElement('span');
                tagElement.className = 'tag';
                tagElement.textContent = tag.text || '';
                tagsContainer.appendChild(tagElement);
            });
        }
    }

    updateTranslatedContent() {
        const titleElement = this.modal.querySelector('.modal-title');
        const descriptionElement = this.modal.querySelector('.modal-description');

        if (window.languageManager?.getCurrentLanguage() === 'pt-BR' || !window.languageManager?.translations.en) {
            if (titleElement) titleElement.textContent = this.currentProjectData.title || '';
            if (descriptionElement) descriptionElement.textContent = this.currentProjectData.description || '';
            return;
        }

        const translations = window.languageManager.translations.en;
        
        if (titleElement) {
            if (this.currentProjectData.titleKey && translations[this.currentProjectData.titleKey]) {
                titleElement.textContent = translations[this.currentProjectData.titleKey];
            } else {
                titleElement.textContent = this.currentProjectData.title || '';
            }
        }

        if (descriptionElement) {
            if (this.currentProjectData.descriptionKey && translations[this.currentProjectData.descriptionKey]) {
                descriptionElement.textContent = translations[this.currentProjectData.descriptionKey];
            } else {
                descriptionElement.textContent = this.currentProjectData.description || '';
            }
        }
    }

    closeModal() {
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
        this.currentProjectData = null;
    }
}

function initProjectsModal() {
    if (!window.projectsModalInstance) {
        window.projectsModalInstance = new ProjectsModal();
    }
    return window.projectsModalInstance;
}

function startProjectsModal() {
    if (window.languageManager) {
        if (window.languageManager.hasSavedOriginals) {
            initProjectsModal();
        } else {
            setTimeout(startProjectsModal, 100);
        }
    } else {
        document.addEventListener('DOMContentLoaded', initProjectsModal);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startProjectsModal);
} else {
    startProjectsModal();
}