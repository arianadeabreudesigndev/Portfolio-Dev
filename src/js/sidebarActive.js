(function() {
    'use strict';

    function initSidebarActive() {
        const sections = [
            { id: 'anchor-home', index: 0 },
            { id: 'anchor-about-me-section', index: 1 },
            { id: 'anchor-project', index: 2 },
            { id: 'anchor-skills', index: 3 },
            { id: 'anchor-contact', index: 4 },
            { id: 'recomendations', index: 5 }
        ];

        const sidebarLinks = document.querySelectorAll('.sticky-bar ul li a');
        if (sidebarLinks.length < 7) {
            console.warn('Sidebar links not found');
            return;
        }

        function removeActiveClasses() {
            for (let i = 0; i < 6; i++) {
                sidebarLinks[i].classList.remove('active');
            }
        }

        function setActiveLink(index) {
            removeActiveClasses();
            if (index >= 0 && index < 6) {
                sidebarLinks[index].classList.add('active');
            }
        }

        // Verificar se as seções existem
        const sectionElements = sections.map(s => document.getElementById(s.id)).filter(el => el);
        if (sectionElements.length === 0) {
            console.warn('No sections found');
            return;
        }

        const observerOptions = {
            root: null,
            rootMargin: '-15% 0px -15% 0px', // um pouco menos agressivo
            threshold: 0.2
        };

        const observer = new IntersectionObserver((entries) => {
            const visibleSections = entries
                .filter(entry => entry.isIntersecting)
                .map(entry => {
                    const id = entry.target.id;
                    return sections.find(s => s.id === id);
                })
                .filter(s => s);

            if (visibleSections.length > 0) {
                // Ordenar por índice (do topo para baixo) e pegar o primeiro
                visibleSections.sort((a, b) => a.index - b.index);
                setActiveLink(visibleSections[0].index);
            } else {
                // Nenhuma seção visível? Verificar se está no topo ou rodapé
                if (window.scrollY < 100) {
                    setActiveLink(0); // home
                } else {
                    // Talvez esteja no final da página, verificar a última seção
                    const lastSection = sections[sections.length - 1];
                    const lastEl = document.getElementById(lastSection.id);
                    if (lastEl && window.scrollY + window.innerHeight >= document.body.scrollHeight - 100) {
                        setActiveLink(lastSection.index);
                    } else {
                        removeActiveClasses();
                    }
                }
            }
        }, observerOptions);

        sections.forEach(section => {
            const el = document.getElementById(section.id);
            if (el) observer.observe(el);
        });

        // Fallback com scroll para garantir
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    // O observer já faz o trabalho, mas podemos forçar uma verificação
                    // se algo falhar. Não precisa duplicar.
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    // Aguardar o evento de carregamento das seções
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.addEventListener('sections-loaded', initSidebarActive);
        });
    } else {
        window.addEventListener('sections-loaded', initSidebarActive);
    }

    // Fallback: se o evento não for disparado em 3 segundos, tenta inicializar mesmo assim
    setTimeout(() => {
        if (document.querySelector('.sticky-bar ul li a')) {
            initSidebarActive();
        }
    }, 3000);
})();