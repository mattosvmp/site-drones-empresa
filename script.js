/**
 * script.js
 * Funcionalidade para o menu de navegação responsivo (menu 'hamburguer') e utilidades.
 */

document.addEventListener("DOMContentLoaded", () => {
  // ----------------------------------------------------------------------
  // 1. FUNCIONALIDADE DO MENU RESPONSIVO
  // ----------------------------------------------------------------------
  const menuToggle = document.querySelector(".menu-toggle");
  const mainNav = document.querySelector(".main-nav");
  const navLinks = document.querySelectorAll(".main-nav a");

  // Abre/Fecha o menu ao clicar no botão
  menuToggle.addEventListener("click", () => {
    mainNav.classList.toggle("open");

    const isExpanded = mainNav.classList.contains("open");
    menuToggle.setAttribute("aria-expanded", isExpanded);

    if (isExpanded) {
      menuToggle.innerHTML = "&#10005;"; // X para fechar
    } else {
      menuToggle.innerHTML = "&#9776;"; // Hamburguer para abrir
    }
  });

  // Fecha o menu ao clicar em um link
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (mainNav.classList.contains("open")) {
        mainNav.classList.remove("open");
        menuToggle.innerHTML = "&#9776;";
        menuToggle.setAttribute("aria-expanded", "false");
      }
    });
  });

  // ----------------------------------------------------------------------
  // 2. FUNCIONALIDADE DE ANO AUTOMÁTICO NO RODAPÉ
  // ----------------------------------------------------------------------
  const currentYearEl = document.getElementById("current-year");
  if (currentYearEl) {
    const currentYear = new Date().getFullYear();
    currentYearEl.textContent = currentYear;
  }
});
