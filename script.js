/**
 * script.js
 * Funcionalidades: Header, Menu, Ano, Foco, Tradução via JSON, Voltar Topo, Vídeo Hover.
 */

document.addEventListener("DOMContentLoaded", () => {
  const mainHeader = document.querySelector(".main-header");
  const scrollThreshold = 50;

  // 1. HEADER ENCOLHÍVEL
  const checkScroll = () => {
    if (window.scrollY > scrollThreshold) {
      mainHeader.classList.add("scrolled");
    } else {
      mainHeader.classList.remove("scrolled");
    }
  };
  window.addEventListener("scroll", checkScroll);
  checkScroll();
  window.addEventListener("resize", checkScroll);

  // 2. MENU RESPONSIVO
  const menuToggle = document.querySelector(".menu-toggle");
  const mainNav = document.querySelector(".main-nav");
  const navLinks = document.querySelectorAll(".main-nav a");

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
      mainNav.classList.toggle("open");
      const isExpanded = mainNav.classList.contains("open");
      menuToggle.setAttribute("aria-expanded", isExpanded);
      menuToggle.innerHTML = isExpanded ? "&#10005;" : "&#9776;";
    });

    navLinks.forEach((link) => {
      // Modificado para fechar SEMPRE ao clicar, exceto links externos
      if (!link.target || link.target !== "_blank") {
        link.addEventListener("click", () => {
          if (mainNav.classList.contains("open")) {
            mainNav.classList.remove("open");
            menuToggle.innerHTML = "&#9776;";
            menuToggle.setAttribute("aria-expanded", "false");
          }
        });
      }
    });
  }

  // 3. ANO AUTOMÁTICO NO RODAPÉ
  const currentYearEl = document.getElementById("current-year");
  if (currentYearEl) {
    currentYearEl.textContent = new Date().getFullYear();
  }

  // 4. CORREÇÃO DE FOCO INICIAL (Opcional)
  const shiftInitialFocus = () => {
    if (document.activeElement && document.activeElement !== document.body) {
      document.activeElement.blur();
    }
  };
  shiftInitialFocus();

  // 5. LÓGICA DE TRADUÇÃO (CARREGANDO JSON)
  const languageLinks = document.querySelectorAll(".lang-link");
  // Seleciona elementos com chaves de texto OU chaves de href
  const translatableElements = document.querySelectorAll(
    "[data-translate-key], [data-translate-href]"
  );
  let currentTranslations = {};

  async function fetchTranslations(lang) {
    if (currentTranslations[lang]) return currentTranslations[lang];
    try {
      const response = await fetch(`locales/${lang}.json`);
      if (!response.ok) {
        console.error(
          `Could not load translation file for language: ${lang}. Status: ${response.status}`
        );
        return null;
      }
      const translations = await response.json();
      currentTranslations[lang] = translations;
      return translations;
    } catch (error) {
      console.error(
        `Error fetching or parsing translation file for ${lang}:`,
        error
      );
      return null;
    }
  }

  async function setLanguage(lang) {
    const translations = await fetchTranslations(lang);
    if (!translations) {
      if (lang !== "pt-br") {
        console.warn(
          `Fallback to pt-br because ${lang}.json was not found or invalid.`
        );
        await setLanguage("pt-br");
      }
      return;
    }
    document.documentElement.lang = lang.replace("_", "-");

    translatableElements.forEach((el) => {
      const key = el.dataset.translateKey;
      const hrefKey = el.dataset.translateHref; // Pega a chave do href

      // Traduz o texto (se tiver a chave)
      if (key) {
        const translation = translations[key];
        if (translation !== undefined) {
          if (key === "heroTitle") el.innerHTML = translation;
          else if (el.tagName === "META") {
            if (
              el.getAttribute("name") === "description" ||
              el.getAttribute("name") === "keywords"
            )
              el.setAttribute("content", translation);
            else if (
              el.getAttribute("property") &&
              el.getAttribute("property").startsWith("og:")
            )
              el.setAttribute("content", translation);
          } else if (el.tagName === "TITLE") document.title = translation;
          else el.textContent = translation;
        }
      }

      // Traduz o HREF (se tiver a chave)
      if (hrefKey) {
        const linkTranslation = translations[hrefKey];
        if (linkTranslation !== undefined && el.tagName === "A") {
          // Garante que é um link
          el.setAttribute("href", linkTranslation);
        }
      }
    });
    languageLinks.forEach((link) =>
      link.classList.toggle("lang-active", link.dataset.lang === lang)
    );
  }

  languageLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const selectedLang = link.dataset.lang;
      setLanguage(selectedLang);
    });
  });
  setLanguage("pt-br");

  // 6. BOTÃO VOLTAR AO TOPO
  const backToTopButton = document.querySelector(".back-to-top-btn");
  const showButtonThreshold = 300;
  if (backToTopButton) {
    const checkScrollForTopButton = () =>
      backToTopButton.classList.toggle(
        "visible",
        window.scrollY > showButtonThreshold
      );
    window.addEventListener("scroll", checkScrollForTopButton);
    checkScrollForTopButton();
    backToTopButton.addEventListener("click", (event) => {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // 7. VÍDEOS COM PLAY NO HOVER
  const videoItems = document.querySelectorAll(".solucao-item");
  videoItems.forEach((item) => {
    const video = item.querySelector(".solucao-video");
    if (video) {
      item.addEventListener("mouseenter", () => {
        video.play().catch((error) => {});
      });
      item.addEventListener("mouseleave", () => {
        video.pause();
        // Verifica se o vídeo tem #t= no src para resetar corretamente
        const srcTime = video.currentSrc.split("#t=")[1];
        video.currentTime = srcTime ? parseFloat(srcTime) : 0; // Reseta para 0 ou para o tempo inicial definido
      });
      // Garante que o vídeo comece no tempo certo se #t= estiver presente
      const srcTimeOnLoad = video.currentSrc.split("#t=")[1];
      if (srcTimeOnLoad) {
        video.currentTime = parseFloat(srcTimeOnLoad);
      }
    }
  });
}); // Fim do DOMContentLoaded
