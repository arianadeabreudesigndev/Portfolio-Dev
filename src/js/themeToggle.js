function applyTheme(theme) {
    const html = document.documentElement;
    html.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    updateSvgColors(theme);
}

function updateSvgColors(theme) {
    if (document.readyState === 'loading') {
        return;
    }
    
    const svgImages = document.querySelectorAll('img[src$=".svg"]');
    
    svgImages.forEach(img => {
        const src = img.src || img.getAttribute('src') || '';
        const srcLower = src.toLowerCase();
        
        if (srcLower.includes('preview.svg')) {
            img.style.filter = '';
            return;
        }
        
        if (srcLower.includes('project-images')) {
            return;
        }
        
        if (theme === 'light') {
            img.style.filter = 'invert(1)';
        } else {
            img.style.filter = '';
        }
    });
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme(newTheme);
}

function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
        applyTheme(savedTheme);
    } else {
        applyTheme('dark');
    }
}

function setupThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', (e) => {
            e.preventDefault();
            toggleTheme();
        });
        return true;
    }
    return false;
}

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    updateSvgColors(currentTheme);

    if (!setupThemeToggle()) {

        const observer = new MutationObserver(() => {
            if (setupThemeToggle()) {
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        setTimeout(() => {
            observer.disconnect();
        }, 10000);
    }
    
    const svgObserver = new MutationObserver(() => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        updateSvgColors(currentTheme);
    });
    
    svgObserver.observe(document.body, {
        childList: true,
        subtree: true
    });
});

