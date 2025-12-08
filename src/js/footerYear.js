function setFooterYear() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
        return true;
    }
    return false;
}
setFooterYear() || setTimeout(setFooterYear, 100);