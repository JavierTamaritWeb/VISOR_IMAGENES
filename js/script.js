// Array con tus imágenes y notas
const dataPages = [
  {
    src: "img/pluma.png",
    alt: "Un bello paisaje natural",
    note: "Nota: Un bello paisaje natural"
  },
  {
    src: "img/preguntar.jpeg",
    alt: "Vida urbana moderna",
    note: "Nota: Vida urbana moderna"
  },
  {
    src: "img/Preguntar.png",
    alt: "Avances tecnológicos",
    note: "Nota: Avances tecnológicos"
  },
  {
    src: "nueva-imagen.png",
    alt: "Algo nuevo",
    note: "Nota: Imagen agregada dinámicamente"
  }
  // ...Agrega tantas como quieras
];

const notepad = document.querySelector(".notepad");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const indicator = document.querySelector(".notepad__indicator");

let currentPage = 0;
let isAnimating = false;
let pages = []; // Aquí almacenaremos los nodos de cada página

// 1. Generar las páginas en el DOM
function createPages() {
  dataPages.forEach((item, index) => {
    const article = document.createElement("article");
    article.classList.add("notepad__page");
    if (index === 0) {
      article.classList.add("notepad__page--active");
      article.setAttribute("aria-hidden", "false");
    } else {
      article.setAttribute("aria-hidden", "true");
    }

    // Contenido interno (imagen + nota)
    article.innerHTML = `
      <img src="${item.src}" alt="${item.alt}" />
      <div class="notepad__caption">${item.note}</div>
    `;
    notepad.prepend(article); // Insertamos en .notepad (antes de .navigation)
    pages.push(article);
  });
}

// 2. Mostrar página según índice
function showPage(index) {
  pages.forEach((pg, i) => {
    pg.classList.remove(
      "notepad__page--active",
      "notepad__page--flip-forward",
      "notepad__page--flip-back"
    );
    pg.setAttribute("aria-hidden", "true");
    pg.style.zIndex = "2";
  });
  pages[index].classList.add("notepad__page--active");
  pages[index].setAttribute("aria-hidden", "false");
  pages[index].style.zIndex = "3";
}

// 3. Actualizar UI
function updateUI() {
  showPage(currentPage);
  prevBtn.disabled = currentPage === 0;
  nextBtn.disabled = currentPage === pages.length - 1;
  indicator.textContent = `Página ${currentPage + 1} de ${pages.length}`;
}

// 4. Navegar a siguiente página
function nextPage() {
  if (isAnimating || currentPage >= pages.length - 1) return;
  isAnimating = true;
  pages[currentPage].classList.add("notepad__page--flip-forward");
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

// 5. Navegar a página anterior
function prevPage() {
  if (isAnimating || currentPage <= 0) return;
  isAnimating = true;
  pages[currentPage].classList.add("notepad__page--flip-back");
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

// Listeners
prevBtn.addEventListener("click", prevPage);
nextBtn.addEventListener("click", nextPage);

// Inicialización
createPages();
updateUI();