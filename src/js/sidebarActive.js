(function() {
    'use strict';

    function initSidebarActive() {
        // Lista de seções com seus IDs e índices
        const sections = [
            { id: 'anchor-home', index: 0 },
            { id: 'anchor-about-me-section', index: 1 },
            { id: 'anchor-project', index: 2 },
            { id: 'anchor-skills', index: 3 },
            { id: 'anchor-contact', index: 4 },
            { id: 'recomendations', index: 5 }
        ];

        // Seleciona todos os links da sidebar (já deve estar carregada)
        const sidebarLinks = document.querySelectorAll('.sticky-bar ul li a');
        if (sidebarLinks.length < 7) {
            console.warn('SidebarActive: Links da sidebar não encontrados');
            return;
        }

        // Remove a classe active de todos os links (exceto o de tema, que é o último)
        function removeActiveClasses() {
            for (let i = 0; i < 6; i++) {
                sidebarLinks[i].classList.remove('active');
            }
        }

        // Ativa o link correspondente ao índice
        function setActiveLink(index) {
            removeActiveClasses();
            if (index >= 0 && index < 6) {
                sidebarLinks[index].classList.add('active');
            }
        }

        // Verifica se as seções existem
        const sectionElements = sections.map(s => document.getElementById(s.id)).filter(el => el);
        if (sectionElements.length === 0) {
            console.warn('SidebarActive: Nenhuma seção encontrada');
            return;
        }

        // Configuração do Intersection Observer com margens mais precisas
        const observerOptions = {
            root: null,
            rootMargin: '-10% 0px -10% 0px', // margem menor para maior precisão
            threshold: [0, 0.2, 0.4, 0.6, 0.8, 1.0] // múltiplos thresholds para capturar melhor
        };

        const observer = new IntersectionObserver((entries) => {
            // Mapeia entradas que estão interseccionando com pelo menos 20% de visibilidade
            const visibleSections = entries
                .filter(entry => entry.intersectionRatio >= 0.2)
                .map(entry => {
                    const id = entry.target.id;
                    return sections.find(s => s.id === id);
                })
                .filter(s => s);

            if (visibleSections.length > 0) {
                // Ordena pela área visível (maior primeiro) e pega a primeira
                // Mas também precisamos considerar a ordem no documento. Vamos pegar a que tem maior intersecção
                // e, em caso de empate, a que está mais acima (menor índice)
                visibleSections.sort((a, b) => {
                    // Primeiro por área (interseção)
                    const entryA = entries.find(e => e.target.id === a.id);
                    const entryB = entries.find(e => e.target.id === b.id);
                    if (entryA.intersectionRatio !== entryB.intersectionRatio) {
                        return entryB.intersectionRatio - entryA.intersectionRatio;
                    }
                    // Se áreas iguais, prioriza a que está acima (menor índice)
                    return a.index - b.index;
                });
                setActiveLink(visibleSections[0].index);
            } else {
                // Nenhuma seção com visibilidade suficiente: fallback baseado na posição do scroll
                const scrollY = window.scrollY;
                const windowHeight = window.innerHeight;
                const documentHeight = document.body.scrollHeight;

                // Verifica se está no topo
                if (scrollY < 100) {
                    setActiveLink(0);
                    return;
                }

                // Verifica se está no final da página
                if (scrollY + windowHeight >= documentHeight - 100) {
                    setActiveLink(sections[sections.length - 1].index);
                    return;
                }

                // Se não encontrou, tenta encontrar a seção mais próxima
                let closestIndex = -1;
                let closestDistance = Infinity;
                sections.forEach(section => {
                    const el = document.getElementById(section.id);
                    if (el) {
                        const rect = el.getBoundingClientRect();
                        const distance = Math.abs(rect.top + rect.height/2 - windowHeight/2);
                        if (distance < closestDistance) {
                            closestDistance = distance;
                            closestIndex = section.index;
                        }
                    }
                });
                if (closestIndex !== -1) {
                    setActiveLink(closestIndex);
                } else {
                    removeActiveClasses();
                }
            }
        }, observerOptions);

        // Observa cada seção
        sections.forEach(section => {
            const el = document.getElementById(section.id);
            if (el) observer.observe(el);
        });

        // Reavalia quando o tamanho da janela mudar (especialmente após carregamento dinâmico)
        window.addEventListener('resize', () => {
            // Dispara uma verificação forçada
            observer.takeRecords(); // opcional
        });

        // Também podemos usar um MutationObserver para detectar mudanças no conteúdo que afetem a altura
        const projectsSection = document.getElementById('anchor-project');
        if (projectsSection) {
            const mutationObserver = new MutationObserver(() => {
                // Reavalia o observer para capturar mudanças de altura
                observer.unobserve(projectsSection);
                observer.observe(projectsSection);
            });
            mutationObserver.observe(projectsSection, { childList: true, subtree: true, attributes: true, attributeFilter: ['style', 'class'] });
        }

        console.log('SidebarActive inicializado com sucesso');
    }

    // Aguarda o carregamento completo das seções
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.addEventListener('sections-loaded', initSidebarActive);
        });
    } else {
        window.addEventListener('sections-loaded', initSidebarActive);
    }

    // Fallback
    setTimeout(() => {
        if (document.querySelector('.sticky-bar ul li a')) {
            initSidebarActive();
        }
    }, 3000);
})();