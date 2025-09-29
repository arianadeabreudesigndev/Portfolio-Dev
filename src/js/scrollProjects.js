document.addEventListener("DOMContentLoaded", () => {
    const grid = document.querySelector(".projects-grid");
    const arrowLeft = document.querySelector(".arrow-left");
    const arrowRight = document.querySelector(".arrow-right");
    const items = Array.from(document.querySelectorAll(".projectItem"));
  
    let currentIndex = 0;
  
    function isMobile() {
        return window.innerWidth < 768;
    }
  
    function showProject(index) {
        if (index < 0) index = 0;
        if (index >= items.length) index = items.length - 1;
        currentIndex = index;
        items[currentIndex].scrollIntoView({
            behavior: "smooth",
            block: isMobile() ? "nearest" : "start",
            inline: isMobile() ? "center" : "nearest"
        });
    }
  
    arrowLeft.addEventListener("click", (e) => {
        e.preventDefault();
        showProject(currentIndex - 1);
    });
  
    arrowRight.addEventListener("click", (e) => {
        e.preventDefault();
        showProject(currentIndex + 1);
    });
  });
  