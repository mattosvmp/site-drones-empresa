/**
 * script.js
 * Funcionalidade para o menu de navegação responsivo (menu 'hamburguer') e utilidades.
 */

document.addEventListener("DOMContentLoaded", () => {
  const mainHeader = document.querySelector(".main-header"); // Seleciona o header
  const scrollThreshold = 50; // Limite de rolagem para o encolhimento (em pixels)

  // ----------------------------------------------------------------------
  // 1. FUNCIONALIDADE DO HEADER ENCOLHÍVEL (SHRINKING HEADER)
  // ----------------------------------------------------------------------
  const checkScroll = () => {
    // Esta lógica agora se aplica a TODOS os tamanhos de tela
    if (window.scrollY > scrollThreshold) {
      mainHeader.classList.add("scrolled");
    } else {
      mainHeader.classList.remove("scrolled");
    }
  };

  // Executa a função na rolagem
  window.addEventListener("scroll", checkScroll);
  // Executa uma vez ao carregar
  checkScroll();
  // Reavalia ao redimensionar a janela (para mobile/desktop)
  window.addEventListener("resize", checkScroll);

  // ----------------------------------------------------------------------
  // 2. FUNCIONALIDADE DO MENU RESPONSIVO
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
  // 3. FUNCIONALIDADE DE ANO AUTOMÁTICO NO RODAPÉ
  // ----------------------------------------------------------------------
  const currentYearEl = document.getElementById("current-year");
  if (currentYearEl) {
    const currentYear = new Date().getFullYear();
    currentYearEl.textContent = currentYear;
  }

  // ----------------------------------------------------------------------
  // 4. CORREÇÃO DE FOCO INICIAL DO NAVEGADOR
  // Força o desvio do foco do navegador para resolver o problema do Contato selecionado no load
  // ----------------------------------------------------------------------
  const shiftInitialFocus = () => {
    // Verifica se algum elemento está focado
    if (document.activeElement) {
      // Desvia o foco para que nenhum elemento seja inicialmente selecionado
      document.activeElement.blur();
    }
  };

  // Executa a correção logo após o DOM estar pronto
  shiftInitialFocus();
});
