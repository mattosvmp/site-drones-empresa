/**
 * script.js
 * Funcionalidades: Header Encolhível, Menu Responsivo, Ano Automático,
 * Foco Inicial, e Tradução via JSON.
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
  let currentTranslations = {}; // Guarda as traduções carregadas

  // Função assíncrona para buscar o arquivo JSON de tradução
  async function fetchTranslations(lang) {
    // Verifica se já temos as traduções em memória
    if (currentTranslations[lang]) {
      return currentTranslations[lang];
    }

    const response = await fetch(`locales/${lang}.json`);
    if (!response.ok) {
      console.error(`Could not load translation file for language: ${lang}`);
      return null; // Retorna null em caso de erro
    }
    const translations = await response.json();
    currentTranslations[lang] = translations; // Armazena em memória
    return translations;
  }

  // Função para aplicar as traduções (agora assíncrona)
  async function setLanguage(lang) {
    const translations = await fetchTranslations(lang);

    // Se não conseguiu carregar as traduções, não faz nada
    if (!translations) {
      // Tenta carregar o idioma padrão (pt-br) como fallback
      if (lang !== "pt-br") {
        console.warn(`Fallback to pt-br because ${lang}.json was not found.`);
        await setLanguage("pt-br"); // Chama recursivamente com pt-br
      }
      return;
    }

    // Define o atributo lang na tag <html>
    document.documentElement.lang = lang.replace("_", "-");

    translatableElements.forEach((el) => {
      const key = el.dataset.translateKey;
      const translation = translations[key];

      if (translation !== undefined) {
        if (key === "heroTitle") {
          el.innerHTML = translation;
        } else if (el.tagName === "META") {
          // Atualiza atributos 'content' das meta tags
          if (
            el.getAttribute("name") === "description" ||
            el.getAttribute("name") === "keywords"
          ) {
            el.setAttribute("content", translation);
          } else if (
            el.getAttribute("property") &&
            el.getAttribute("property").startsWith("og:")
          ) {
            // Trata meta tags Open Graph (og:title, og:description, etc.)
            el.setAttribute("content", translation);
          }
        } else if (el.tagName === "TITLE") {
          document.title = translation; // Atualiza o título da página
        } else {
          el.textContent = translation;
        }
      } else {
        // console.warn(`Missing translation for key "${key}" in language "${lang}"`);
      }
    });

    // Atualiza a classe ativa nos links de idioma
    languageLinks.forEach((link) => {
      link.classList.toggle("lang-active", link.dataset.lang === lang);
    });

    // Opcional: Salvar no localStorage
    // localStorage.setItem('preferredLanguage', lang);
  }

  // Adiciona evento de clique aos links de idioma
  languageLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const selectedLang = link.dataset.lang;
      setLanguage(selectedLang);
    });
  });

  // Carrega o idioma inicial (padrão PT-BR ou do localStorage)
  // const preferredLanguage = localStorage.getItem('preferredLanguage');
  // if (preferredLanguage && ['pt-br', 'en', 'es'].includes(preferredLanguage)) {
  //   setLanguage(preferredLanguage);
  // } else {
  setLanguage("pt-br");
  // }
}); // Fim do DOMContentLoaded
