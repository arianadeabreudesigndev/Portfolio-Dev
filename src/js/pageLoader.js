function loadPage(targetId, url) {
    const el = document.getElementById(targetId);
    if (!el) return;

    fetch(url, { cache: "no-store" })
        .then(res => res.text())
        .then(html => {
            el.innerHTML = html;

            // Dispara quando cada página é carregada
            document.dispatchEvent(
                new CustomEvent("pageLoaded", { detail: { id: targetId } })
            );
        })
        .catch(err => console.error(`Error loading ${targetId}:`, err));
}

loadPage("header", "/pages/1-header/header.html");
loadPage("home", "/pages/2-home/home.html");
loadPage("about-me", "/pages/3-about-me/about-me.html");
loadPage("projects", "/pages/4-projects/projects.html");
loadPage("skills", "/pages/5-skills/skills.html");
loadPage("contact", "/pages/6-contact/contact.html");
loadPage("recomendations", "/pages/7-recomendations/recomendation.html");
loadPage("footer", "/pages/8-footer/footer.html");
