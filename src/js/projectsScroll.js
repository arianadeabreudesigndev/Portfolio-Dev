let scrollArrowsInitialized = false;

function initScrollArrows() {
    if (scrollArrowsInitialized) return;
    
    if (!window.matchMedia('(min-width: 1400px)').matches) return;
    
    const projectsGrid = document.querySelector('.projects-grid');
    const upArrow = document.querySelector('.arrow-up');
    const downArrow = document.querySelector('.arrow-down');
    
    if (!projectsGrid || !upArrow || !downArrow) return;
    
    const firstCard = document.querySelector('.projectItem');
    if (!firstCard) return;
    
    const cardHeight = firstCard.offsetHeight;
    const gap = 1.2 * 16;
    const scrollAmount = cardHeight + gap;
    
    const handleDownClick = (e) => {
        e.preventDefault();
        projectsGrid.scrollBy({ top: scrollAmount, behavior: 'smooth' });
    };
    
    const handleUpClick = (e) => {
        e.preventDefault();
        projectsGrid.scrollBy({ top: -scrollAmount, behavior: 'smooth' });
    };
    
    downArrow.addEventListener('click', handleDownClick);
    upArrow.addEventListener('click', handleUpClick);
    
    downArrow._scrollHandler = handleDownClick;
    upArrow._scrollHandler = handleUpClick;
    
    scrollArrowsInitialized = true;
}

function waitForProjectsSection() {
    if (document.querySelector('#projects')) {
        setTimeout(initScrollArrows, 100);
        return;
    }
    
    const observer = new MutationObserver(() => {
        if (document.querySelector('#projects')) {
            observer.disconnect();
            setTimeout(initScrollArrows, 100);
        }
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', waitForProjectsSection);
} else {
    waitForProjectsSection();
}

window.addEventListener('resize', () => {
    if (window.matchMedia('(min-width: 1400px)').matches) {
        scrollArrowsInitialized = false;
        setTimeout(initScrollArrows, 50);
    }
});