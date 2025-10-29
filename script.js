/**
 * script.js
 * Funcionalidades: Header, Menu, Ano, Foco, Tradução via JSON, Voltar Topo, Vídeo Hover.
 */

document.addEventListener("DOMContentLoaded", () => {
  const mainHeader = document.querySelector(".main-header");
  const scrollThreshold = 50;

  // 1. HEADER ENCOLHÍVEL
  const checkScroll = () => {
    // Adiciona ou remove a classe 'scrolled' baseando na posição de rolagem
    // Usa uma forma mais concisa com classList.toggle
    mainHeader.classList.toggle("scrolled", window.scrollY > scrollThreshold);
  };
  // Adiciona listeners para rolagem e redimensionamento, e executa uma vez ao carregar
  window.addEventListener("scroll", checkScroll);
  window.addEventListener("resize", checkScroll);
  checkScroll();

  // 2. MENU RESPONSIVO
  const menuToggle = document.querySelector(".menu-toggle");
  const mainNav = document.querySelector(".main-nav");
  const navLinks = document.querySelectorAll(".main-nav a"); // Seleciona todos os links dentro da nav

  if (menuToggle && mainNav) {
    // Alterna a classe 'open' no menu e atualiza atributos ARIA no botão
    menuToggle.addEventListener("click", () => {
      mainNav.classList.toggle("open");
      const isExpanded = mainNav.classList.contains("open");
      menuToggle.setAttribute("aria-expanded", isExpanded);
      menuToggle.innerHTML = isExpanded ? "&#10005;" : "&#9776;"; // Muda ícone para X ou hambúrguer
    });

    // Fecha o menu ao clicar em um link interno (não abre nova aba)
    navLinks.forEach((link) => {
      // Verifica se o link não tem target="_blank"
      if (!link.target || link.target !== "_blank") {
        link.addEventListener("click", () => {
          // Se o menu estiver aberto, fecha-o
          if (mainNav.classList.contains("open")) {
            mainNav.classList.remove("open");
            menuToggle.innerHTML = "&#9776;"; // Volta ícone para hambúrguer
            menuToggle.setAttribute("aria-expanded", "false");
          }
        });
      }
    });
  }

  // 3. ANO AUTOMÁTICO NO RODAPÉ
  const currentYearEl = document.getElementById("current-year");
  if (currentYearEl) {
    currentYearEl.textContent = new Date().getFullYear(); // Insere o ano atual
  }

  // 4. CORREÇÃO DE FOCO INICIAL (Opcional)
  // Tenta remover o foco de qualquer elemento ativo ao carregar a página
  const shiftInitialFocus = () => {
    if (document.activeElement && document.activeElement !== document.body) {
      document.activeElement.blur();
    }
  };
  shiftInitialFocus();

  // 5. LÓGICA DE TRADUÇÃO (CARREGANDO JSON)
  const languageLinks = document.querySelectorAll(".lang-link"); // Seleciona os botões/links de idioma
  // Seleciona todos os elementos que têm uma chave de tradução de texto ou de link
  const translatableElements = document.querySelectorAll(
    "[data-translate-key], [data-translate-href]"
  );
  let currentTranslations = {}; // Cache para guardar traduções já carregadas

  // Função assíncrona para buscar o arquivo JSON de tradução
  async function fetchTranslations(lang) {
    // Se já carregamos este idioma antes, retorna do cache
    if (currentTranslations[lang]) return currentTranslations[lang];

    try {
      // Tenta buscar o arquivo JSON correspondente ao idioma
      const response = await fetch(`locales/${lang}.json`);
      // Se o arquivo não for encontrado ou houver erro no servidor
      if (!response.ok) {
        console.error(
          `Não foi possível carregar o arquivo de tradução para o idioma: ${lang}. Status: ${response.status}`
        );
        return null; // Retorna nulo para indicar falha
      }
      // Converte a resposta em JSON
      const translations = await response.json();
      // Armazena no cache
      currentTranslations[lang] = translations;
      return translations; // Retorna as traduções
    } catch (error) {
      // Captura erros de rede ou de parse do JSON
      console.error(
        `Erro ao buscar ou processar o arquivo de tradução para ${lang}:`,
        error
      );
      return null; // Retorna nulo para indicar falha
    }
  }

  // Função assíncrona para aplicar as traduções na página
  async function setLanguage(lang) {
    // Busca as traduções para o idioma solicitado
    const translations = await fetchTranslations(lang);

    // Se a busca falhou (retornou nulo)
    if (!translations) {
      // Se o idioma solicitado não era o padrão (pt-br), tenta carregar o pt-br como fallback
      if (lang !== "pt-br") {
        console.warn(
          `Fallback para pt-br porque ${lang}.json não foi encontrado ou é inválido.`
        );
        await setLanguage("pt-br"); // Chama a função novamente com 'pt-br'
      }
      return; // Interrompe a função se não houver traduções
    }

    // Define o atributo 'lang' na tag <html> para acessibilidade e SEO
    document.documentElement.lang = lang.replace("_", "-"); // ex: pt_br -> pt-BR

    // Percorre todos os elementos marcados para tradução
    translatableElements.forEach((el) => {
      const key = el.dataset.translateKey; // Chave para tradução de texto
      const hrefKey = el.dataset.translateHref; // Chave para tradução de link (href)

      // Se o elemento tem uma chave de texto
      if (key) {
        const translation = translations[key]; // Busca a tradução no JSON carregado
        if (translation !== undefined) {
          // Se encontrou a tradução
          // Casos especiais:
          if (key === "heroTitle") {
            // Permite HTML (como <br>) no título do Hero
            el.innerHTML = translation;
          } else if (el.tagName === "META") {
            // Atualiza o atributo 'content' de meta tags
            if (
              el.getAttribute("name") === "description" ||
              el.getAttribute("name") === "keywords"
            ) {
              el.setAttribute("content", translation);
            } else if (
              el.getAttribute("property") &&
              el.getAttribute("property").startsWith("og:")
            ) {
              el.setAttribute("content", translation); // Para Open Graph tags
            }
          } else if (el.tagName === "TITLE") {
            // Atualiza o título da página na aba
            document.title = translation;
          } else {
            // Para a maioria dos elementos (p, h2, a, label, etc.)
            el.textContent = translation; // Define o texto simples
          }
        } else {
          // Opcional: Avisa no console se uma tradução está faltando
          // console.warn(`Tradução faltando para a chave "${key}" no idioma "${lang}"`);
        }
      }

      // Se o elemento tem uma chave de href
      if (hrefKey) {
        const linkTranslation = translations[hrefKey]; // Busca o valor do link no JSON
        // Garante que encontrou a tradução e que o elemento é um link (<a>)
        if (linkTranslation !== undefined && el.tagName === "A") {
          el.setAttribute("href", linkTranslation); // Atualiza o atributo href
        } else if (linkTranslation === undefined) {
          // Opcional: Avisa se o link não foi encontrado
          // console.warn(`Link não encontrado para a chave "${hrefKey}" no idioma "${lang}"`);
        }
      }
    });

    // Atualiza qual botão de idioma está com a classe 'lang-active'
    languageLinks.forEach((link) => {
      link.classList.toggle("lang-active", link.dataset.lang === lang);
    });

    // Opcional: Salvar a preferência de idioma no navegador
    // try {
    //    localStorage.setItem('preferredLanguage', lang);
    // } catch (e) {
    //    console.warn("Não foi possível salvar a preferência de idioma no localStorage.");
    // }
  }

  // Adiciona o evento de clique para cada botão de idioma
  languageLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault(); // Impede a navegação padrão do link (#)
      const selectedLang = link.dataset.lang; // Pega o idioma do atributo data-lang
      setLanguage(selectedLang); // Chama a função para aplicar o idioma
    });
  });

  // Carrega o idioma inicial ao carregar a página
  // Opcional: Tenta carregar do localStorage primeiro
  // let initialLang = 'pt-br'; // Padrão
  // try {
  //    const preferredLanguage = localStorage.getItem('preferredLanguage');
  //    if (preferredLanguage && ['pt-br', 'en', 'es'].includes(preferredLanguage)) {
  //      initialLang = preferredLanguage;
  //    }
  // } catch(e) {
  //    console.warn("Não foi possível ler a preferência de idioma do localStorage.");
  // }
  // setLanguage(initialLang);

  // Carrega PT-BR como padrão
  setLanguage("pt-br");

  // 6. BOTÃO VOLTAR AO TOPO
  const backToTopButton = document.querySelector(".back-to-top-btn");
  const showButtonThreshold = 300; // Distância de rolagem para mostrar o botão

  if (backToTopButton) {
    // Função para mostrar/esconder o botão
    const checkScrollForTopButton = () => {
      backToTopButton.classList.toggle(
        "visible",
        window.scrollY > showButtonThreshold
      );
    };
    // Verifica ao rolar e ao carregar a página
    window.addEventListener("scroll", checkScrollForTopButton);
    checkScrollForTopButton();

    // Adiciona a funcionalidade de clique para rolar suavemente ao topo
    backToTopButton.addEventListener("click", (event) => {
      event.preventDefault(); // Impede o link de pular para '#'
      window.scrollTo({ top: 0, behavior: "smooth" }); // Rola para o topo com animação suave
    });
  }

  // 7. VÍDEOS COM PLAY NO HOVER
  const videoItems = document.querySelectorAll(".solucao-item"); // Seleciona todos os cards de solução

  videoItems.forEach((item) => {
    const video = item.querySelector(".solucao-video"); // Encontra o elemento de vídeo dentro do card
    if (video) {
      // Se encontrou um vídeo
      // Evento quando o mouse entra na área do card
      item.addEventListener("mouseenter", () => {
        // Tenta dar play no vídeo. O .catch() evita erros no console se o navegador bloquear.
        video.play().catch((error) => {
          /* Opcional: console.log("Video play failed:", error); */
        });
      });

      // Evento quando o mouse sai da área do card
      item.addEventListener("mouseleave", () => {
        video.pause(); // Pausa o vídeo
        // Verifica se o src do vídeo tem um tempo inicial definido (ex: #t=3)
        const srcTimeFragment = video.currentSrc.split("#t=")[1];
        // Reseta o tempo do vídeo para o início (0) ou para o tempo definido no src
        video.currentTime = srcTimeFragment ? parseFloat(srcTimeFragment) : 0;
      });

      // Garante que o vídeo comece no tempo certo se #t= estiver presente no carregamento inicial
      // (Isso pode precisar de um listener 'loadedmetadata' para ser 100% confiável em todos os casos)
      video.addEventListener(
        "loadedmetadata",
        () => {
          const srcTimeOnLoad = video.currentSrc.split("#t=")[1];
          if (srcTimeOnLoad) {
            video.currentTime = parseFloat(srcTimeOnLoad);
          }
        },
        { once: true }
      ); // Executa apenas uma vez quando os metadados carregam
    }
  });
}); // Fim do DOMContentLoaded
