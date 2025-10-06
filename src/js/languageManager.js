class LanguageManager {
    constructor() {
        this.translations = {};
        this.currentLanguage = 'pt-BR';
        this.config = {
            translationPath: '/src/locales/en.json',
            translationPathPT: '/src/locales/pt.json',
            storageKey: 'portfolio-language'
        };

        this.originalTexts = new Map();
        this.originalAttributes = new Map();
        this.originalPlaceholders = new Map();
        this.hasSavedOriginals = false;
        this.isInitialized = false;
    }

    async init() {
        if (this.isInitialized) return;
        
        try {
            await this.loadTranslations();
            this.setupLanguageDetection();

            this.restoreDefaultTexts();

            if (!this.hasSavedOriginals) {
                this.saveOriginalTexts();
                this.hasSavedOriginals = true;
            }

            this.applyCurrentLanguage();
            this.setupEventListeners();
            
            this.isInitialized = true;
            console.log('LanguageManager inicializado com sucesso');
        } catch (error) {
            console.warn('LanguageManager: Using default language only', error);
            this.applyCurrentLanguage();
            this.isInitialized = true;
        }
    }

    saveOriginalTexts() {
        try {
            document.querySelectorAll('[data-i18n]').forEach(element => {
                const key = element.getAttribute('data-i18n');
                if (key && element.textContent) {
                    this.originalTexts.set(key, element.textContent);
                }
            });

            document.querySelectorAll('[data-i18n-attr]').forEach(element => {
                const attrValue = element.getAttribute('data-i18n-attr');
                if (attrValue) {
                    const [attr, key] = attrValue.split(':');
                    if (attr && key && element.getAttribute(attr)) {
                        this.originalAttributes.set(key, element.getAttribute(attr));
                    }
                }
            });

            document.querySelectorAll('[data-i18n-ph]').forEach(element => {
                const key = element.getAttribute('data-i18n-ph');
                if (key && element.getAttribute('placeholder')) {
                    this.originalPlaceholders.set(key, element.getAttribute('placeholder'));
                }
            });
        } catch (error) {
            console.warn('Erro ao salvar textos originais:', error);
        }
    }

    async loadTranslations() {
        try {
            // Carrega traduções em inglês
            const responseEN = await fetch(this.config.translationPath);
            if (!responseEN.ok) {
                throw new Error(`HTTP error! status: ${responseEN.status}`);
            }
            const translationsEN = await responseEN.json();
            
            // Carrega traduções em português
            const responsePT = await fetch(this.config.translationPathPT);
            if (!responsePT.ok) {
                throw new Error(`HTTP error! status: ${responsePT.status}`);
            }
            const translationsPT = await responsePT.json();
            
            // Combina as traduções mantendo as chaves corretas
            this.translations = {
                'pt-BR': translationsPT.pt,
                'en': translationsEN.en
            };
            
            console.log('Traduções carregadas:', Object.keys(this.translations));
        } catch (error) {
            console.warn('Erro ao carregar traduções:', error);
            this.translations = {};
        }
    }

    setupLanguageDetection() {
        try {
            const savedLanguage = localStorage.getItem(this.config.storageKey);
            const browserLanguage = navigator.language.startsWith('en') ? 'en' : 'pt-BR';
            this.currentLanguage = savedLanguage || browserLanguage;
            console.log('Idioma detectado:', this.currentLanguage);
        } catch (error) {
            console.warn('Erro na detecção de idioma:', error);
            this.currentLanguage = 'pt-BR';
        }
    }

    setupEventListeners() {
        try {
            const langButton = document.querySelector('.langButton');
            const languageOptions = document.querySelector('.languageOptions');

            if (langButton && languageOptions) {
                langButton.addEventListener('click', (e) => {
                    e.stopPropagation();
                    languageOptions.classList.toggle('active');
                });

                document.querySelectorAll('.languageOptions a').forEach(link => {
                    link.addEventListener('click', (e) => {
                        e.preventDefault();
                        const lang = link.getAttribute('data-lang');
                        if (lang) {
                            this.setLanguage(lang);
                            languageOptions.classList.remove('active');
                        }
                    });
                });

                document.addEventListener('click', (e) => {
                    if (!e.target.closest('.languageMenu')) {
                        languageOptions.classList.remove('active');
                    }
                });

                languageOptions.addEventListener('click', (e) => {
                    e.stopPropagation();
                });
            } else {
                console.warn('Elementos do seletor de idioma não encontrados');
            }
        } catch (error) {
            console.warn('Erro ao configurar event listeners:', error);
        }
    }

    setLanguage(language) {
        if (language !== 'pt-BR' && language !== 'en') {
            console.warn('Idioma não suportado:', language);
            return;
        }

        try {
            this.currentLanguage = language;
            localStorage.setItem(this.config.storageKey, language);
            this.applyCurrentLanguage();

            window.dispatchEvent(new CustomEvent('languageChanged', {
                detail: { language }
            }));

            console.log('Idioma alterado para:', language);
        } catch (error) {
            console.warn('Erro ao alterar idioma:', error);
        }
    }

    applyCurrentLanguage() {
        try {
            if (this.currentLanguage === 'pt-BR') {
                this.restoreDefaultTexts();
                this.restoreDownloadLinks();
            } else {
                this.applyTranslations();
                this.updateDownloadLinks();
            }
            this.updateLanguageButton();
            this.refreshDynamicContent();
        } catch (error) {
            console.warn('Erro ao aplicar idioma:', error);
        }
    }

    applyTranslations() {
        const langData = this.translations[this.currentLanguage];
        if (!langData) {
            console.warn('Dados de tradução não encontrados para:', this.currentLanguage);
            return;
        }

        try {
            document.querySelectorAll('[data-i18n]').forEach(element => {
                const key = element.getAttribute('data-i18n');
                if (key && langData[key]) {
                    element.textContent = langData[key];
                }
            });

            document.querySelectorAll('[data-i18n-attr]').forEach(element => {
                const attrValue = element.getAttribute('data-i18n-attr');
                if (attrValue) {
                    const [attr, key] = attrValue.split(':');
                    if (attr && key && langData[key]) {
                        element.setAttribute(attr, langData[key]);
                    }
                }
            });
            document.querySelectorAll('[data-i18n-ph]').forEach(element => {
                const key = element.getAttribute('data-i18n-ph');
                if (key && langData[key]) {
                    element.setAttribute('placeholder', langData[key]);
                }
            });

            this.updateDownloadLinks();
        } catch (error) {
            console.warn('Erro ao aplicar traduções:', error);
        }
    }

    restoreDefaultTexts() {
        try {
            document.querySelectorAll('[data-i18n]').forEach(element => {
                const key = element.getAttribute('data-i18n');
                if (key && this.originalTexts.has(key)) {
                    element.textContent = this.originalTexts.get(key);
                }
            });

            document.querySelectorAll('[data-i18n-attr]').forEach(element => {
                const attrValue = element.getAttribute('data-i18n-attr');
                if (attrValue) {
                    const [attr, key] = attrValue.split(':');
                    if (attr && key && this.originalAttributes.has(key)) {
                        element.setAttribute(attr, this.originalAttributes.get(key));
                    }
                }
            });

            document.querySelectorAll('[data-i18n-ph]').forEach(element => {
                const key = element.getAttribute('data-i18n-ph');
                if (key && this.originalPlaceholders.has(key)) {
                    element.setAttribute('placeholder', this.originalPlaceholders.get(key));
                }
            });

            this.restoreDownloadLinks();
        } catch (error) {
            console.warn('Erro ao restaurar textos padrão:', error);
        }
    }

    updateDownloadLinks() {
        if (this.currentLanguage === 'en') {
            try {
                // Procura por links que tenham cv-pt.pdf no href
                const cvLinks = document.querySelectorAll('a[href*="cv-pt.pdf"]');
                cvLinks.forEach(cvLink => {
                    cvLink.href = '/src/docs/cv-en.pdf';
                    const downloadName = this.getTranslation('cv');
                    if (downloadName) {
                        cvLink.download = downloadName;
                    }
                });
            } catch (error) {
                console.warn('Erro ao atualizar links de download:', error);
            }
        }
    }

    restoreDownloadLinks() {
        try {
            // Procura por links que tenham cv-en.pdf no href
            const cvLinks = document.querySelectorAll('a[href*="cv-en.pdf"]');
            cvLinks.forEach(cvLink => {
                cvLink.href = '/src/docs/cv-pt.pdf';
                const downloadName = this.getTranslation('cv');
                if (downloadName) {
                    cvLink.download = downloadName;
                }
            });
        } catch (error) {
            console.warn('Erro ao restaurar links de download:', error);
        }
    }

    updateLanguageButton() {
        try {
            const langButton = document.querySelector('.langButton');
            if (langButton) {
                langButton.textContent = this.currentLanguage === 'pt-BR' ? 'PT' : 'EN';
                langButton.setAttribute('aria-label', 
                    this.currentLanguage === 'pt-BR' ? 'Idioma Português' : 'English Language');
            }
        } catch (error) {
            console.warn('Erro ao atualizar botão de idioma:', error);
        }
    }

    refreshDynamicContent() {
        try {
            if (window.aboutMeMenu && typeof window.aboutMeMenu.refreshContent === 'function') {
                window.aboutMeMenu.refreshContent();
            }
            
            // Atualiza outros componentes dinâmicos aqui se necessário
            if (window.updateSkillsContent && typeof window.updateSkillsContent === 'function') {
                window.updateSkillsContent();
            }
        } catch (error) {
            console.warn('Erro ao atualizar conteúdo dinâmico:', error);
        }
    }

    getCurrentLanguage() {
        return this.currentLanguage;
    }

    forceUpdate() {
        this.applyCurrentLanguage();
    }

    hasTranslation(key) {
        const langData = this.translations[this.currentLanguage];
        return langData && langData[key] !== undefined;
    }

    getTranslation(key) {
        const langData = this.translations[this.currentLanguage];
        return langData && langData[key] ? langData[key] : null;
    }
}

function initializeLanguageManager() {
    window.languageManager = new LanguageManager();
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.languageManager.init().catch(error => {
                console.error('Erro na inicialização do LanguageManager:', error);
            });
        });
    } else {
        window.languageManager.init().catch(error => {
            console.error('Erro na inicialização do LanguageManager:', error);
        });
    }
}

initializeLanguageManager();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = LanguageManager;
}