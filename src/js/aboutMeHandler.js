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
            // Usa exclusivamente as traduções do languageManager
            const translationKeys = this.getTranslationKeys(option);
            const headingText = window.languageManager.getTranslation(translationKeys.heading) || '';
            const descriptionText = window.languageManager.getTranslation(translationKeys.description) || '';
            
            headingElement.textContent = headingText;
            descriptionElement.innerHTML = descriptionText; // innerHTML permite tags HTML (links)
        } else {
            // Fallback caso languageManager não esteja disponível
            this.applyFallbackContent(option, descriptionElement, headingElement);
        }
    }
    
    applyFallbackContent(option, descriptionElement, headingElement) {
        const fallbackContent = {
            tailane: {
                heading: "About me",
                description: "Self-taught since childhood, I've always been the family artist who fixed computers and created solutions to problems where others saw none.<br><br>I overcame health and access limitations to transform my childhood artistic gift and logical ease into full stack development expertise.<br><br>My goal is to reach senior level and have the freedom to create whatever I want, the way it deserves to be done: the best way possible."
            },
            certifications: {
                heading: "Certifications",
                description: "Information Systems Bachelor's Degree (UFF, completion soon)<br><br>Technical in Administration (1200h, in progress - management, logistics)<br><br>Technical in Marketing (800h, completed - consumer behavior, branding, digital media)<br><br>Database Administration (IFRS, in progress - SQL/NoSQL, performance)<br><br>Python for NLP (ICM - text processing, automation)<br><br>Web Systems Project (IFRS, 30h - requirements, UML)<br><br>Swift Programming (Hackatruck - OOP, APIs)<br><br>Systems Automation (IFRS, 30h - Automation and Project; Robotics and Industry; Machines and Networks)."
            },
            experience: {
                heading: "Experience",
                description: "Freelancer Full Stack & Designer (2025-current - web development, social media design)<br><br>Business Development Manager - Desconto Urbano (2024 - expansion strategies, market analysis)<br><br>IT Intern - Municipal Education Department of Saquarema (2022-2023 - event support, IT problem resolution, system manuals, user training)<br><br>Database Analyst - UNIMED Hospital (2020 - Oracle databases, PL/SQL, query optimization)<br><br>\"How I Met Robin\" Project (under construction - collaboration with programmers and communities from Reddit and How I Met Your Mother fans; creation of original artwork, design, narrative and digital development in team."
            },
            hobbies: {
                heading: "Hobbies",
                description: "Night cycling with the Ciclistas Sem Fronteiras group, exploring the city while trying not to fall off the bike<br><br>Book club with programmers and IT professionals, discussing technical books and innovation<br><br>Blog Gluten No More, where I share my journey with Hashimoto, learnings about health and exercises for body and mind<br><br>Painting, sculpture and photography, plus digital drawing, I've participated in competitions and love experimenting with new techniques to see how far my creativity goes<br><br>I often play games and love strategic or cooperative challenges, if you want to play with me just call<br><br>On Saturdays, bike rides to the beach, my moment to recharge energy and keep body and mind in balance."
            },
            blog: {
                heading: "Blog",
                description: "Gluten No More is a blog I created 3 years ago to share my journey with Hashimoto.<br><br>I've lived with this autoimmune condition since I was 12, which was an exception, as it's not common for it to appear so early. That's why I developed an intense focus on maintaining balanced mental and physical health, reconciling with my unrestricted interest in technology.<br><br>The idea of transforming my personal blog into a community was born in 2025. Initially it was very intimate, but now I'm completely reformulating it to soon launch a community platform about stories, overcoming and healthy living with Hashimoto. I want the platform to help other people find balance and inspiration, just as it helped me share my experiences.<br><br>I intend to use my Full Stack development and design skills to create an intuitive and welcoming digital experience, integrating content and interaction in a way that technology enhances the community, always developing on the path towards my Full Stack goal."
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