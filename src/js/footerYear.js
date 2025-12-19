function setFooterYear() {
    const yearElement = document.getElementById('current-year');
    if (!yearElement) {
        return false;
    }

    yearElement.textContent = new Date().getFullYear();
    return true;
}

(function initFooterYear() {
    if (setFooterYear()) return;

    const intervalId = setInterval(() => {
        if (setFooterYear()) {
            clearInterval(intervalId);
        }
    }, 100);
})();