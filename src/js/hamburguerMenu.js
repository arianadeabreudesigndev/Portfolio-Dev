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
  
    const closeMenu = () => toggleMenuState(false);
  
    const ensureInitialAria = () => {
      const ham = document.querySelector('.hamburger');
      if (ham && !ham.hasAttribute('aria-expanded')) ham.setAttribute('aria-expanded', 'false');
    };
  
    const onDocumentClick = (e) => {
      const clickedHamburger = e.target.closest('.hamburger');
      if (clickedHamburger) {
        e.stopPropagation();
        toggleMenuState();
        return;
      }
  
      const clickedMenuLink = e.target.closest('.menu a');
      if (clickedMenuLink) {
        closeMenu();
        return;
      }
  
      if (!e.target.closest('.menu') && !e.target.closest('.hamburger')) {
        const menu = document.querySelector('.menu');
        if (menu && menu.classList.contains('active')) closeMenu();
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
  