const foldersRoot = document.getElementById("folders-root");
const breadSeparator = document.getElementById("breadcrumb-separator");
const breadCurrent = document.getElementById("breadcrumb-current");
const mainTitle = document.querySelector(
  'h1[data-translate-key="videoGalleryTitle"]'
);
const mainSubtitle = document.querySelector(".subtitle");

// Variável para guardar qual chave de tradução estamos usando no momento
let currentKey = null;
let translationsCache = {};

// Função auxiliar para buscar as traduções (mesma lógica do script principal)
async function getTranslation(key) {
  // Pega o idioma atual (ex: 'pt-br', 'en')
  const lang = document.documentElement.lang.toLowerCase() || "pt-br";

  // Se não tivermos o arquivo desse idioma no cache, buscamos
  if (!translationsCache[lang]) {
    try {
      // Busca o arquivo JSON de tradução
      const resp = await fetch(`locales/${lang}.json`);
      if (resp.ok) {
        translationsCache[lang] = await resp.json();
      }
    } catch (e) {
      console.error("Erro ao carregar tradução para breadcrumb", e);
    }
  }

  // Retorna a tradução (se existir) ou a própria chave (se falhar)
  if (translationsCache[lang] && translationsCache[lang][key]) {
    return translationsCache[lang][key];
  }
  return key;
}

// Função para atualizar o texto do breadcrumb (chamada ao abrir e ao trocar idioma)
async function updateBreadcrumbText() {
  if (!currentKey) return;
  const text = await getTranslation(currentKey);
  if (breadCurrent) breadCurrent.textContent = text;
}

// === FUNÇÃO PRINCIPAL CHAMADA PELO HTML ===
function openFolder(folderId, translationKey) {
  // 1. Guarda a chave para usar se o idioma mudar
  currentKey = translationKey;

  // 2. Esconde a grade principal
  foldersRoot.style.display = "none";
  if (mainTitle) mainTitle.style.display = "none";
  if (mainSubtitle) mainSubtitle.style.display = "none";

  // 3. Fecha todas e abre a selecionada
  const allFolders = document.querySelectorAll(".directory-content");
  allFolders.forEach((folder) => folder.classList.remove("active"));

  const selectedFolder = document.getElementById(folderId);
  if (selectedFolder) {
    selectedFolder.classList.add("active");

    // 4. Mostra e atualiza o breadcrumb traduzido
    breadSeparator.style.display = "inline";
    breadCurrent.style.display = "inline";

    // Chama a tradução!
    updateBreadcrumbText();

    const topContent = document.querySelector(".page-content");
    if (topContent) topContent.scrollIntoView({ behavior: "smooth" });
  }
}

function closeFolder() {
  currentKey = null; // Limpa a chave atual

  const allFolders = document.querySelectorAll(".directory-content");
  allFolders.forEach((folder) => folder.classList.remove("active"));

  breadSeparator.style.display = "none";
  breadCurrent.style.display = "none";
  breadCurrent.textContent = "";

  foldersRoot.style.display = "grid";
  if (mainTitle) mainTitle.style.display = "block";
  if (mainSubtitle) mainSubtitle.style.display = "block";
}

// === OBSERVADOR DE MUDANÇA DE IDIOMA ===
// Se o usuário trocar a bandeira lá em cima, o breadcrumb atualiza sozinho
const breadcrumbObserver = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.attributeName === "lang") {
      updateBreadcrumbText();
    }
  });
});

breadcrumbObserver.observe(document.documentElement, {
  attributes: true,
  attributeFilter: ["lang"],
});
