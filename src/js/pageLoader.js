function loadingPage(idElemento, url) {
    fetch(url)
        .then(response => response.text())
        .then(html => {
            document.getElementById(idElemento).innerHTML = html;
        })
        .catch(error => {
            console.error(`Loading Error ${idElemento}:`, error);
        });
}

loadingPage('header', '/pages/1-header/header.html');
loadingPage('home', '/pages/2-home/home.html');
loadingPage('about-me', '/pages/3-about-me/about-me.html');
loadingPage('projects', '/pages/4-projects/projects.html');
loadingPage('skills', '/pages/5-skills/skills.html');
loadingPage('contact', '/pages/6-contact/contact.html');
loadingPage('recomendations', '/pages/7-recomendations/recomendation.html');
loadingPage('footer', '/pages/8-footer/footer.html');








