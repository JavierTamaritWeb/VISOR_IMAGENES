// js/script.js
// 
// Selección de elementos
const notepad = document.querySelector(".notepad");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const indicator = document.querySelector(".notepad__indicator");

// Variables de estado
let currentPage = 0;
let isAnimating = false;
let pages = []; // Almacenará los <article> generados

// 1. Cargar JSON y crear páginas
async function loadPages() {
  try {
    const response = await fetch("dataPages.json");
    if (!response.ok) throw new Error("No se pudo cargar dataPages.json");
    const data = await response.json();
    createPages(data);
    updateUI();
  } catch (error) {
    console.error(error);
  }
}

// 2. Generar las páginas en el DOM a partir del array "data"
function createPages(dataPages) {
  dataPages.forEach((item, index) => {
    const article = document.createElement("article");
    article.classList.add("notepad__page");

    // La primera página será la activa
    if (index === 0) {
      article.classList.add("notepad__page--active");
      article.setAttribute("aria-hidden", "false");
    } else {
      article.setAttribute("aria-hidden", "true");
    }

    // Contenido de la página: imagen y nota
    article.innerHTML = `
      <img src="${item.src}" alt="${item.alt}" />
      <div class="notepad__caption">${item.note}</div>
    `;

    // Insertamos antes de la navegación
    const navigation = document.querySelector(".notepad__navigation");
    notepad.insertBefore(article, navigation);

    // Guardamos el nodo en el array "pages"
    pages.push(article);
  });
}

// 3. Mostrar la página según el índice actual
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

// 4. Actualizar la interfaz (botones e indicador)
function updateUI() {
  showPage(currentPage);
  prevBtn.disabled = currentPage === 0;
  nextBtn.disabled = currentPage === pages.length - 1;
  indicator.textContent = `Página ${currentPage + 1} de ${pages.length}`;
}

// 5. Avanzar a la siguiente página con animación
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

// 6. Retroceder a la página anterior con animación
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

// Eventos de los botones
prevBtn.addEventListener("click", prevPage);
nextBtn.addEventListener("click", nextPage);

// Iniciar todo
loadPages();
