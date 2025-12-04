
function updateFooterYear() {
    const yearElement = document.getElementById('current-year');
    if (!yearElement) return;
    
    const now = new Date();
    const year = now.getFullYear();
    
    yearElement.textContent = year;
    yearElement.setAttribute('datetime', year);
}

document.addEventListener('DOMContentLoaded', updateFooterYear);

setInterval(updateFooterYear, 3600000);