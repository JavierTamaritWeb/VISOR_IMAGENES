// Script.js

const pages = document.querySelectorAll(".page");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    const pageIndicator = document.querySelector(".page-indicator");

    let currentPage = 0;
    let isAnimating = false;

    function showPage(index) {
      pages.forEach((pg, i) => {
        pg.classList.remove("active", "flip-forward", "flip-back");
        pg.setAttribute("aria-hidden", "true");
        pg.style.zIndex = "2";
      });
      pages[index].classList.add("active");
      pages[index].setAttribute("aria-hidden", "false");
      pages[index].style.zIndex = "3";
    }

    function updateUI() {
      showPage(currentPage);
      prevBtn.disabled = currentPage === 0;
      nextBtn.disabled = currentPage === pages.length - 1;
      pageIndicator.textContent = `Página ${currentPage + 1} de ${pages.length}`;
    }

    function nextPage() {
      if (isAnimating || currentPage >= pages.length - 1) return;
      isAnimating = true;
      pages[currentPage].classList.add("flip-forward");
      pages[currentPage].addEventListener(
        "transitionend",
        () => {
          currentPage++;
          updateUI();
          isAnimating = false;
        },
        { once: true }
      );
    }

    function prevPage() {
      if (isAnimating || currentPage <= 0) return;
      isAnimating = true;
      pages[currentPage].classList.add("flip-back");
      pages[currentPage].addEventListener(
        "transitionend",
        () => {
          currentPage--;
          updateUI();
          isAnimating = false;
        },
        { once: true }
      );
    }

    prevBtn.addEventListener("click", prevPage);
    nextBtn.addEventListener("click", nextPage);

    // Inicialización
    updateUI();