// js/Script.js



  // Función para crear las páginas a partir del JSON
  async function loadPages() {
    try {
      const response = await fetch('dataPages.json');
      if (!response.ok) throw new Error('No se pudo cargar el JSON');
      const dataPages = await response.json();

      const notepad = document.querySelector('.notepad');
      const pages = [];
      // Crear cada página en base a los datos
      dataPages.forEach((item, index) => {
        const article = document.createElement('article');
        article.classList.add('notepad__page'); // usa tu convención BEM
        // La primera página se activa por defecto
        if (index === 0) {
          article.classList.add('notepad__page--active');
          article.setAttribute('aria-hidden', 'false');
        } else {
          article.setAttribute('aria-hidden', 'true');
        }
        article.innerHTML = `
          <img src="${item.src}" alt="${item.alt}" />
          <div class="notepad__caption">${item.note}</div>
        `;
        // Insertar la página en el contenedor, antes de la navegación
        notepad.insertBefore(article, notepad.querySelector('.notepad__navigation'));
        pages.push(article);
      });
      return pages;
    } catch (error) {
      console.error(error);
    }
  }

  // Luego puedes usar la función loadPages() para inicializar la aplicación.
  loadPages().then(pages => {
    // Aquí inicializas tu lógica de navegación usando el array "pages"
    // Por ejemplo:
    let currentPage = 0;
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    const pageIndicator = document.querySelector(".notepad__indicator");

    function showPage(index) {
      pages.forEach((pg, i) => {
        pg.classList.remove("notepad__page--active", "flip-forward", "flip-back");
        pg.setAttribute("aria-hidden", "true");
        pg.style.zIndex = "2";
      });
      pages[index].classList.add("notepad__page--active");
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
      if (currentPage < pages.length - 1) {
        pages[currentPage].classList.add("flip-forward");
        pages[currentPage].addEventListener(
          "transitionend",
          () => {
            currentPage++;
            updateUI();
          },
          { once: true }
        );
      }
    }

    function prevPage() {
      if (currentPage > 0) {
        pages[currentPage].classList.add("flip-back");
        pages[currentPage].addEventListener(
          "transitionend",
          () => {
            currentPage--;
            updateUI();
          },
          { once: true }
        );
      }
    }

    prevBtn.addEventListener("click", prevPage);
    nextBtn.addEventListener("click", nextPage);
    updateUI();
  });

  pages[currentPage].classList.add("flip-forward");
  pages[currentPage].addEventListener("transitionend", () => {
    console.log("Terminó la transición");
    currentPage++;
    updateUI();
    isAnimating = false;
  }, { once: true });
  