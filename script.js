/**
 * script.js
 * Funcionalidades: Header Encolhível, Menu Responsivo, Ano Automático,
 * Foco Inicial, Tradução via JSON, Botão Voltar ao Topo.
 */

document.addEventListener("DOMContentLoaded", () => {
  const mainHeader = document.querySelector(".main-header");
  const scrollThreshold = 50;

  // ----------------------------------------------------------------------
  // 1. HEADER ENCOLHÍVEL
  // ----------------------------------------------------------------------
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

  // ----------------------------------------------------------------------
  // 2. MENU RESPONSIVO
  // ----------------------------------------------------------------------
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
      if (!link.classList.contains("btn-lumasky")) {
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

  // ----------------------------------------------------------------------
  // 3. ANO AUTOMÁTICO NO RODAPÉ
  // ----------------------------------------------------------------------
  const currentYearEl = document.getElementById("current-year");
  if (currentYearEl) {
    currentYearEl.textContent = new Date().getFullYear();
  }

  // ----------------------------------------------------------------------
  // 4. CORREÇÃO DE FOCO INICIAL (Opcional)
  // ----------------------------------------------------------------------
  const shiftInitialFocus = () => {
    if (document.activeElement && document.activeElement !== document.body) {
      document.activeElement.blur();
    }
  };
  shiftInitialFocus();

  // ----------------------------------------------------------------------
  // 5. LÓGICA DE TRADUÇÃO (CARREGANDO JSON)
  // ----------------------------------------------------------------------
  const languageLinks = document.querySelectorAll(".lang-link");
  const translatableElements = document.querySelectorAll(
    "[data-translate-key]"
  );
  let currentTranslations = {};

  async function fetchTranslations(lang) {
    if (currentTranslations[lang]) {
      return currentTranslations[lang];
    }
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
      const translation = translations[key];

      if (translation !== undefined) {
        if (key === "heroTitle") {
          el.innerHTML = translation;
        } else if (el.tagName === "META") {
          if (
            el.getAttribute("name") === "description" ||
            el.getAttribute("name") === "keywords"
          ) {
            el.setAttribute("content", translation);
          } else if (
            el.getAttribute("property") &&
            el.getAttribute("property").startsWith("og:")
          ) {
            el.setAttribute("content", translation);
          }
        } else if (el.tagName === "TITLE") {
          document.title = translation;
        } else {
          el.textContent = translation;
        }
      }
    });

    languageLinks.forEach((link) => {
      link.classList.toggle("lang-active", link.dataset.lang === lang);
    });

    // localStorage.setItem('preferredLanguage', lang);
  }

  languageLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const selectedLang = link.dataset.lang;
      setLanguage(selectedLang);
    });
  });

  // const preferredLanguage = localStorage.getItem('preferredLanguage');
  // if (preferredLanguage && ['pt-br', 'en', 'es'].includes(preferredLanguage)) {
  //   setLanguage(preferredLanguage);
  // } else {
  setLanguage("pt-br");
  // }

  // ----------------------------------------------------------------------
  // 6. BOTÃO VOLTAR AO TOPO
  // ----------------------------------------------------------------------
  const backToTopButton = document.querySelector(".back-to-top-btn");
  const showButtonThreshold = 300; // Pixels de rolagem para mostrar o botão

  if (backToTopButton) {
    const checkScrollForTopButton = () => {
      if (window.scrollY > showButtonThreshold) {
        backToTopButton.classList.add("visible");
      } else {
        backToTopButton.classList.remove("visible");
      }
    };

    window.addEventListener("scroll", checkScrollForTopButton);
    checkScrollForTopButton();

    backToTopButton.addEventListener("click", (event) => {
      event.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }
}); // Fim do DOMContentLoaded
