(function () {
    if (window.__menuInitDone) return;
    window.__menuInitDone = true;
  
    const toggleMenuState = (forceState = null) => {
      const ham = document.querySelector('.hamburger');
      const menu = document.querySelector('.menu');
  
      if (!ham || !menu) return;
  
      const newState = typeof forceState === 'boolean' ? forceState : !ham.classList.contains('active');
      ham.classList.toggle('active', newState);
      menu.classList.toggle('active', newState);
      document.body.classList.toggle('menu-open', newState);
      ham.setAttribute('aria-expanded', String(newState));
    };
  
    const closeMenu = () => {
      toggleMenuState(false);
      const menuOptionLanguage = document.querySelector('.menuOptionLanguage');
      if (menuOptionLanguage && menuOptionLanguage.classList.contains('active')) {
        menuOptionLanguage.classList.remove('active');
      }
      const menuOptionTheme = document.querySelector('.menuOptionTheme');
      if (menuOptionTheme && menuOptionTheme.classList.contains('active')) {
        menuOptionTheme.classList.remove('active');
      }
    };
  
    const ensureInitialAria = () => {
      const ham = document.querySelector('.hamburger');
      if (ham && !ham.hasAttribute('aria-expanded')) ham.setAttribute('aria-expanded', 'false');
    };
  
    const closeOtherDropdowns = (excludeElement) => {
      const menuOptionLanguage = document.querySelector('.menuOptionLanguage');
      const menuOptionTheme = document.querySelector('.menuOptionTheme');
      
      if (menuOptionLanguage && !menuOptionLanguage.contains(excludeElement) && menuOptionLanguage.classList.contains('active')) {
        menuOptionLanguage.classList.remove('active');
      }
      
      if (menuOptionTheme && !menuOptionTheme.contains(excludeElement) && menuOptionTheme.classList.contains('active')) {
        menuOptionTheme.classList.remove('active');
      }
    };

    const handleLanguageToggle = (e) => {
      const languageToggle = e.target.closest('.languageToggle');
      if (languageToggle) {
        e.preventDefault();
        e.stopPropagation();
        const menuOptionLanguage = languageToggle.closest('.menuOptionLanguage');
        if (menuOptionLanguage) {
          closeOtherDropdowns(menuOptionLanguage);
          menuOptionLanguage.classList.toggle('active');
        }
        return;
      }

      const languageSubmenuLink = e.target.closest('.mobileLanguageSubmenu a');
      if (languageSubmenuLink) {
        e.preventDefault();
        const lang = languageSubmenuLink.getAttribute('data-lang');
        if (lang && window.languageManager) {
          window.languageManager.setLanguage(lang);
          const menuOptionLanguage = languageSubmenuLink.closest('.menuOptionLanguage');
          if (menuOptionLanguage) {
            menuOptionLanguage.classList.remove('active');
          }
        }
        return;
      }
    };

    const handleThemeToggle = (e) => {
      const themeToggle = e.target.closest('.themeToggle');
      if (themeToggle) {
        e.preventDefault();
        e.stopPropagation();
        const menuOptionTheme = themeToggle.closest('.menuOptionTheme');
        if (menuOptionTheme) {
          closeOtherDropdowns(menuOptionTheme);
          menuOptionTheme.classList.toggle('active');
        }
        return;
      }

      const themeSubmenuLink = e.target.closest('.mobileThemeSubmenu a');
      if (themeSubmenuLink) {
        e.preventDefault();
        const theme = themeSubmenuLink.getAttribute('data-theme');
        if (theme && typeof applyTheme === 'function') {
          applyTheme(theme);
          const menuOptionTheme = themeSubmenuLink.closest('.menuOptionTheme');
          if (menuOptionTheme) {
            menuOptionTheme.classList.remove('active');
          }
        }
        return;
      }
    };

    const onDocumentClick = (e) => {
      const clickedHamburger = e.target.closest('.hamburger');
      if (clickedHamburger) {
        e.stopPropagation();
        toggleMenuState();
        return;
      }

      const clickedLanguageToggle = e.target.closest('.languageToggle');
      if (clickedLanguageToggle) {
        handleLanguageToggle(e);
        return;
      }

      const clickedLanguageSubmenuLink = e.target.closest('.mobileLanguageSubmenu a');
      if (clickedLanguageSubmenuLink) {
        handleLanguageToggle(e);
        return;
      }

      const clickedThemeToggle = e.target.closest('.themeToggle');
      if (clickedThemeToggle) {
        handleThemeToggle(e);
        return;
      }

      const clickedThemeSubmenuLink = e.target.closest('.mobileThemeSubmenu a');
      if (clickedThemeSubmenuLink) {
        handleThemeToggle(e);
        return;
      }

      const clickedMenuLink = e.target.closest('.menu a');
      if (clickedMenuLink && !clickedMenuLink.classList.contains('languageToggle') && !clickedMenuLink.classList.contains('themeToggle')) {
        closeMenu();
        return;
      }

      if (!e.target.closest('.menu') && !e.target.closest('.hamburger')) {
        const menu = document.querySelector('.menu');
        if (menu && menu.classList.contains('active')) closeMenu();
        
        const menuOptionLanguage = document.querySelector('.menuOptionLanguage');
        if (menuOptionLanguage && menuOptionLanguage.classList.contains('active')) {
          menuOptionLanguage.classList.remove('active');
        }
        
        const menuOptionTheme = document.querySelector('.menuOptionTheme');
        if (menuOptionTheme && menuOptionTheme.classList.contains('active')) {
          menuOptionTheme.classList.remove('active');
        }
      }
    };
  
    const onKeyDown = (e) => {
      if (e.key === 'Escape' || e.key === 'Esc') {
        const menu = document.querySelector('.menu');
        if (menu && menu.classList.contains('active')) closeMenu();
      }
    };
  
    const onPageShow = (event) => {
      closeMenu();
      ensureInitialAria();
    };
  
    const onResize = () => {
      if (window.matchMedia && window.matchMedia('(min-width: 1200px)').matches) {
        const menu = document.querySelector('.menu');
        if (menu && menu.classList.contains('active')) closeMenu();
      }
    };
  
    const attachListenersOnce = () => {
      if (!window.__menuListenersAttached) {
        document.addEventListener('click', onDocumentClick);
        document.addEventListener('keydown', onKeyDown);
        window.addEventListener('pageshow', onPageShow);
        window.addEventListener('resize', onResize);
        window.__menuListenersAttached = true;
      }
    };
      const init = () => {
      ensureInitialAria();
      attachListenersOnce();
      closeMenu();
    };
  
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      setTimeout(init, 0);
    }
  })();
  