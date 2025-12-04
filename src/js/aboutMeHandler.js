class AboutMeMenu {
    constructor() {
        this.currentOption = 'tailane';
        this.isInitialized = false;
        this.swipeStartX = 0;
        this.swipeEndX = 0;
        this.swipeThreshold = 50;
        this.options = ['tailane', 'certifications', 'experience', 'hobbies', 'blog'];
        this.init();
    }
    
    init() {
        if (this.isInitialized) return;
        
        this.setupEventDelegation();
        this.setupAccessibility();
        this.setupSwipeEvents();
        this.setupTranslationIntegration();
        this.loadInitialContent();
        this.isInitialized = true;
    }
    
    setupEventDelegation() {
        document.addEventListener('click', (e) => {
            this.handleMobileMenuToggle(e);
            this.handleMenuClose(e);
            this.handleOptionSelection(e);
        });
        
        window.addEventListener('resize', this.handleResize.bind(this));
    }
    
    setupSwipeEvents() {
        const aboutMeContainer = document.querySelector('.aboutMeContainer');
        const aboutMeImgs = document.querySelector('.aboutMeImgs');
        const aboutMeText = document.querySelector('.aboutMeText');
        
        if (!aboutMeContainer || !aboutMeImgs || !aboutMeText) return;
        
        const isTabletMode = () => {
            return window.innerWidth >= 768 && window.innerWidth <= 1399;
        };
        
        [aboutMeContainer, aboutMeImgs, aboutMeText].forEach(element => {
            if (!element) return;
            
            element.addEventListener('touchstart', (e) => {
                if (!isTabletMode()) return;
                this.swipeStartX = e.changedTouches[0].screenX;
            }, { passive: true });
            
            element.addEventListener('touchend', (e) => {
                if (!isTabletMode()) return;
                this.swipeEndX = e.changedTouches[0].screenX;
                this.handleSwipe();
            }, { passive: true });
            
            element.addEventListener('mousedown', (e) => {
                if (!isTabletMode()) return;
                this.swipeStartX = e.screenX;
            });
            
            element.addEventListener('mouseup', (e) => {
                if (!isTabletMode()) return;
                this.swipeEndX = e.screenX;
                this.handleSwipe();
            });
        });
        
        const updateTabletMode = () => {
            const isTablet = isTabletMode();
            aboutMeContainer.classList.toggle('tablet-mode', isTablet);
            aboutMeImgs.classList.toggle('tablet-mode', isTablet);
            aboutMeText.classList.toggle('tablet-mode', isTablet);
            
            const menuList = document.getElementById('menuList');
            if (menuList) {
                menuList.style.display = isTablet ? 'none' : '';
            }
        };
        
        updateTabletMode();
        window.addEventListener('resize', updateTabletMode);
    }
    
    handleSwipe() {
        const distance = this.swipeStartX - this.swipeEndX;
        
        if (Math.abs(distance) < this.swipeThreshold) return;
        
        const currentIndex = this.options.indexOf(this.currentOption);
        
        if (distance > 0) {
            const nextIndex = (currentIndex + 1) % this.options.length;
            this.changeDescription(this.options[nextIndex]);
        } else {
            const prevIndex = (currentIndex - 1 + this.options.length) % this.options.length;
            this.changeDescription(this.options[prevIndex]);
        }
        
        this.addSwipeFeedback(distance > 0 ? 'left' : 'right');
    }
    
    addSwipeFeedback(direction) {
        const container = document.querySelector('.aboutMeContainer');
        if (!container) return;
        
        container.classList.add('swipe-feedback', `swipe-${direction}`);
        
        setTimeout(() => {
            container.classList.remove('swipe-feedback', 'swipe-left', 'swipe-right');
        }, 300);
    }
    
    setupAccessibility() {
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardNavigation(e);
        });
    }
    
    setupTranslationIntegration() {
        window.addEventListener('languageChanged', (e) => {
            console.log('Idioma alterado, atualizando About Me:', e.detail.language);
            this.refreshContent();
        });
    }
    
    loadInitialContent() {
        setTimeout(() => {
            this.changeDescription('tailane');
        }, 100);
    }
    
    handleMobileMenuToggle(e) {
        const toggleElement = e.target.closest('#mobileMenuToggle');
        const isMobile = window.innerWidth <= 767;
        
        if (!toggleElement || !isMobile) return;
        
        e.preventDefault();
        e.stopPropagation();
        
        const menuList = document.getElementById('menuList');
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        const toggleBtn = mobileMenuToggle?.querySelector('button');
        
        if (!menuList || !mobileMenuToggle || !toggleBtn) return;
        
        const isActive = menuList.classList.contains('active');
        
        if (isActive) {
            this.closeMenu(menuList, mobileMenuToggle, toggleBtn);
        } else {
            this.openMenu(menuList, mobileMenuToggle, toggleBtn);
        }
    }
    
    handleMenuClose(e) {
        const isMobile = window.innerWidth <= 767;
        const menuList = document.getElementById('menuList');
        
        if (!isMobile || !menuList || !menuList.classList.contains('active')) return;
        
        const clickedOutside = !e.target.closest('#mobileMenuToggle') && 
                              !e.target.closest('#menuList');
        
        if (clickedOutside) {
            this.closeMenu(
                menuList,
                document.getElementById('mobileMenuToggle'),
                document.querySelector('#mobileMenuToggle button')
            );
        }
    }
    
    handleOptionSelection(e) {
        if (!e.target.classList.contains('menuOption')) return;
        
        const isMobile = window.innerWidth <= 767;
        
        if (isMobile) {
            this.closeMenu(
                document.getElementById('menuList'),
                document.getElementById('mobileMenuToggle'),
                document.querySelector('#mobileMenuToggle button')
            );
        }
        
        const optionId = e.target.id.replace('Option', '');
        this.changeDescription(optionId);
    }
    
    handleResize() {
        if (window.innerWidth > 767) {
            this.closeMenu(
                document.getElementById('menuList'),
                document.getElementById('mobileMenuToggle'),
                document.querySelector('#mobileMenuToggle button')
            );
        }
    }
    
    handleKeyboardNavigation(e) {
        if (e.key === 'Escape' && window.innerWidth <= 767) {
            this.closeMenu(
                document.getElementById('menuList'),
                document.getElementById('mobileMenuToggle'),
                document.querySelector('#mobileMenuToggle button')
            );
        }
    }
    
    openMenu(menuList, mobileMenuToggle, toggleBtn) {
        menuList.classList.add('active');
        mobileMenuToggle.classList.add('active');
        if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'true');
    }
    
    closeMenu(menuList, mobileMenuToggle, toggleBtn) {
        menuList.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
        if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'false');
    }
    
    changeDescription(option) {
        this.currentOption = option;
        this.updateMenuSelection(option);
        this.updateVisibleImage(option);
        this.updateTextContent(option);
    }
    
    refreshContent() {
        if (this.currentOption) {
            console.log('Atualizando conteúdo do About Me para:', this.currentOption);
            this.updateTextContent(this.currentOption);
        }
    }
    
    updateMenuSelection(option) {
        const menuOptions = document.querySelectorAll('.menuOption');
        if (menuOptions.length === 0) return;
        
        menuOptions.forEach(opt => {
            opt.classList.remove('selected');
        });
        
        const selectedOption = document.getElementById(`${option}Option`);
        if (selectedOption) {
            selectedOption.classList.add('selected');
        }
    }
    
    updateVisibleImage(option) {
        const images = document.querySelectorAll('.aboutMeImgs img');
        if (images.length === 0) return;
        
        images.forEach(img => {
            img.classList.remove('is-visible');
        });
        
        const selectedImg = document.querySelector(`.aboutMeImgs img[data-option="${option}"]`);
        if (selectedImg) {
            selectedImg.classList.add('is-visible');
        }
    }
    
    updateTextContent(option) {
        const descriptionElement = document.getElementById('description');
        const headingElement = document.querySelector('.aboutMeText h2');
        
        if (!descriptionElement || !headingElement) {
            console.warn('Elementos de texto do About Me não encontrados');
            return;
        }
        
        if (window.languageManager) {
            this.applyContentThroughLanguageManager(option, descriptionElement, headingElement);
        } else {
            this.applyFallbackContent(option, descriptionElement, headingElement);
        }
    }
    
    applyContentThroughLanguageManager(option, descriptionElement, headingElement) {
        const langManager = window.languageManager;
        const isPortuguese = langManager.getCurrentLanguage() === 'pt-BR';
        
        const translationKeys = this.getTranslationKeys(option);
        
        if (isPortuguese) {
            this.applyPortugueseContent(option, descriptionElement, headingElement);
        } else {
            this.applyEnglishContent(option, descriptionElement, headingElement);
        }
        
        headingElement.setAttribute('data-i18n', translationKeys.heading);
        descriptionElement.setAttribute('data-i18n', translationKeys.description);
    }
    
    applyPortugueseContent(option, descriptionElement, headingElement) {
        const contentMap = {
            tailane: {
                heading: "Sobre mim",
                description: "Desde a infância sempre fui autodidata, aprendi a explorar os diversos softwares sozinha, descobrindo minha afinidade natural com design, programação e games. A curiosidade virou prática, e a prática virou paixão por criar soluções digitais que unem estética e funcionalidade.<br><br>Minha trajetória não foi simples: cresci em uma região rural, com poucos recursos, mas isso nunca me impediu de buscar conhecimento. Conquistei uma vaga em uma universidade federal no curso de Sistemas de Informação, onde cheguei até o último ano. Pretendo retomar e concluir a graduação já no próximo ano, consolidando ainda mais minha formação, mas já possuo outras.<br><br>Sigo evoluindo com dedicação em design e tecnologia, criando experiências digitais úteis e bem construídas. Este portfólio foi desenvolvido inteiramente por mim, desde o design de cada página no Figma até a implementação final com HTML, CSS e JavaScript, sobre bases sólidas, o bem-feito arroz com feijão, reforçando meu compromisso com o desenvolvimento em bases consistentes rumo ao objetivo de me tornar desenvolvedora Full Stack sênior."
            },
            certifications: {
                heading: "Certificações",
                description: "Graduação em Sistemas de Informação (UFF, conclusão em breve)<br><br>Técnico em Administração (1200h, cursando - gestão, logística)<br><br>Técnico em Marketing (800h, concluído - comportamento do consumidor, branding, mídias digitais)<br><br>Administração de Banco de Dados (IFRS, cursando - SQL/NoSQL, performance)<br><br>Python para PLN (ICM - processamento textual, automação)<br><br>Projeto de Sistemas Web (IFRS, 30h - requisitos, UML)<br><br>Programação com Swift (Hackatruck - POO, APIs)<br><br>Automação de Sistemas (IFRS, 30h - Automação e Projeto; Robótica e Indústria; Máquinas e Redes)"
            },
            experience: {
                heading: "Experiência",
                description: "Freelancer Full Stack & Designer (2025-atual - desenvolvimento web, design para redes sociais)<br><br>Gerente de Desenvolvimento de Negócios - Desconto Urbano (2024 - estratégias de expansão, análise de mercado)<br><br>Estagiária de TI - Secretaria Municipal de Educação de Saquarema (2022-2023 - suporte em eventos, resolução de problemas de TI, manuais de sistemas, capacitação de usuários)<br><br>Analista de Banco de Dados - Hospital UNIMED (2020 - bancos Oracle, PL/SQL, otimização de queries)<br><br>Projeto \"How I Met Robin\" (em construção - colaboração com programadores e comunidades do Reddit e fãs da série How I Met Your Mother; criação de peça artística autoral, design, narrativa e desenvolvimento digital em equipe)"
            },
            hobbies: {
                heading: "Hobbies", 
                description: "Ciclismo noturno com o grupo Ciclistas Sem Fronteiras, explorando a cidade e enquanto tento não cair da bike<br><br>Clube do livro com programadores e profissionais de TI, debatendo livros técnicos e inovação<br><br>Blog Gluten No More, onde compartilho minha jornada com Hashimoto, aprendizados sobre saúde e exercícios para corpo e mente<br><br>Pintura, escultura e fotografia, além de desenho digital, já participei de competições e adoro experimentar novas técnicas para ver até onde minha criatividade vai<br><br>Jogo frequentemente e adoro desafios estratégicos ou cooperativos, se quiser jogar comigo é só chamar<br><br>Aos sábados, pedais até a praia, meu momento para recarregar energia e manter corpo e mente em equilíbrio"
            },
            blog: {
                heading: "Blog",
                description: "A Gluten No More é um blog que criei há 3 anos para compartilhar minha jornada com Hashimoto.<br><br>Convivo com essa condição autoimune desde os 12 anos, o que foi uma exceção, pois não é comum ela surgir tão cedo. Por isso, desenvolvi um foco intenso em manter saúde mental e física equilibradas, conciliando com meu interesse irrestrito em tecnologia.<br><br>A ideia de transformar meu blog pessoal em uma comunidade nasceu em 2025. Inicialmente era bem íntimo, mas agora estou reformulando completamente para lançar em breve uma plataforma comunitária sobre histórias, superação e uma vida saudável com a Hashimoto. Quero que a plataforma ajude outras pessoas a encontrar equilíbrio e inspiração, assim como me ajudou compartilhar minhas experiências.<br><br>Pretendo usar minhas habilidades em desenvolvimento Full Stack e design para criar uma experiência digital intuitiva e acolhedora, integrando conteúdo e interação de forma que a tecnologia potencialize a comunidade, sempre me desenvolvendo no caminho rumo ao meu objetivo Full Stack."
            }
        };
        
        const content = contentMap[option] || contentMap.tailane;
        headingElement.textContent = content.heading;
        descriptionElement.innerHTML = content.description;
    }
    
    applyEnglishContent(option, descriptionElement, headingElement) {
        const langManager = window.languageManager;
        const translationKeys = this.getTranslationKeys(option);
        
        const headingText = langManager.getTranslation(translationKeys.heading) || translationKeys.heading;
        const descriptionText = langManager.getTranslation(translationKeys.description) || translationKeys.description;
        
        headingElement.textContent = headingText;
        descriptionElement.innerHTML = descriptionText;
    }
    
    applyFallbackContent(option, descriptionElement, headingElement) {
        const fallbackContent = {
            tailane: {
                heading: "About me",
                description: "Self-taught since childhood, I've always been the family artist who fixed computers and created solutions to problems where others saw none.<br><br>I overcame health and access limitations to transform my childhood artistic gift and logical ease into full stack development expertise.<br><br>My goal is to reach senior level and have the freedom to create whatever I want, the way it deserves to be done: the best way possible."
            }
        };
        
        const content = fallbackContent[option] || fallbackContent.tailane;
        headingElement.textContent = content.heading;
        descriptionElement.innerHTML = content.description;
    }
    
    getTranslationKeys(option) {
        const keysMap = {
            tailane: { heading: 'about-title', description: 'about-description-tailane' },
            certifications: { heading: 'about-title-certifications', description: 'about-description-certifications' },
            experience: { heading: 'about-title-experience', description: 'about-description-experience' },
            hobbies: { heading: 'about-title-hobbies', description: 'about-description-hobbies' },
            blog: { heading: 'about-title-blog', description: 'about-description-blog' }
        };
        
        return keysMap[option] || keysMap.tailane;
    }
}

function initializeAboutMe() {
    if (document.querySelector('.aboutMeContainer')) {
        if (window.languageManager && window.languageManager.isInitialized) {
            window.aboutMeMenu = new AboutMeMenu();
            console.log('AboutMeMenu inicializado com sucesso com funcionalidade de swipe');
        } else {
            setTimeout(initializeAboutMe, 100);
        }
    } else {
        setTimeout(initializeAboutMe, 100);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAboutMe);
} else {
    initializeAboutMe();
}

window.changeDescription = (option) => {
    if (window.aboutMeMenu) {
        window.aboutMeMenu.changeDescription(option);
    }
};