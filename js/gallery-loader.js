document.addEventListener("DOMContentLoaded", () => {
  // Variáveis para guardar os dados brutos (cache)
  let dadosFotos = [];
  let dadosVideos = [];

  // 1. Carrega os dados iniciais
  carregarDados();

  // 2. "Vigia" se o idioma mudou no HTML (Observer)
  // O seu script.js altera o atributo lang="pt-br" no <html lang="...">
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "attributes" && mutation.attributeName === "lang") {
        // Se o idioma mudou, renderiza tudo de novo com o novo idioma
        console.log("Idioma mudou! Atualizando galeria...");
        renderizarTudo();
      }
    });
  });

  observer.observe(document.documentElement, {
    attributes: true, // Observa atributos
    attributeFilter: ["lang"], // Apenas o atributo 'lang'
  });

  // --- FUNÇÕES DE CARREGAMENTO ---

  function carregarDados() {
    // Busca Fotos
    fetch("data/fotos.json")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data && data.lista_fotos) {
          dadosFotos = data.lista_fotos;
          renderizarFotos(); // Primeira renderização
        }
      });

    // Busca Vídeos
    fetch("data/videos.json")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data && data.lista_videos) {
          dadosVideos = data.lista_videos;
          renderizarVideos(); // Primeira renderização
        }
      });
  }

  function renderizarTudo() {
    renderizarFotos();
    renderizarVideos();
  }

  // --- FUNÇÃO AUXILIAR DE TRADUÇÃO ---
  function getTituloTraduzido(item) {
    const lang = document.documentElement.lang.toLowerCase(); // ex: 'pt-br', 'en', 'es'

    // Tenta pegar a tradução específica, se não existir, usa o padrão (PT)
    if (lang.includes("en") && item.titulo_en) return item.titulo_en;
    if (lang.includes("es") && item.titulo_es) return item.titulo_es;

    return item.titulo; // Fallback para Português
  }

  // --- RENDERIZADORES ---

  function renderizarFotos() {
    // Primeiro, limpa os containers para não duplicar
    const containers = document.querySelectorAll(".gallery-grid");
    containers.forEach((div) => (div.innerHTML = ""));

    dadosFotos.forEach((foto) => {
      const container = document.getElementById(foto.categoria);
      if (container) {
        const itemDiv = document.createElement("div");
        itemDiv.classList.add("gallery-item");

        const img = document.createElement("img");
        img.src = foto.imagem_url;

        // AQUI ESTÁ O SEGREDO: Usa o título traduzido
        const tituloTexto = getTituloTraduzido(foto);
        img.alt = tituloTexto;
        img.title = tituloTexto; // Tooltip ao passar o mouse
        img.loading = "lazy";

        img.addEventListener("click", () => {
          if (typeof window.abrirModalExterno === "function") {
            window.abrirModalExterno(img);
          }
        });

        itemDiv.appendChild(img);
        container.appendChild(itemDiv);
      }
    });
  }

  function renderizarVideos() {
    // Limpa apenas os itens dinâmicos (mantendo o cabeçalho se houver, mas seu HTML já separa os containers)
    // No seu caso, os containers são #folder-commercial, etc. Precisamos limpar apenas os .enterprise-group gerados
    // Estratégia: Limpar o conteúdo DEPOIS do cabeçalho seria complexo.
    // Melhor estratégia: Limpar tudo e deixar o cabeçalho fixo no HTML (que já está fora da div de conteúdo no design anterior? Vamos verificar).

    // Ajuste: No seu HTML, o container #folder-commercial contém o cabeçalho E os vídeos.
    // Para não apagar o botão "Voltar", vamos procurar apenas os vídeos antigos e remover.

    const containersIds = [
      "folder-commercial",
      "folder-realestate",
      "folder-postcards",
    ];

    containersIds.forEach((id) => {
      const container = document.getElementById(id);
      if (!container) return;

      // Remove apenas os elementos de vídeo adicionados dinamicamente
      const videosAntigos = container.querySelectorAll(".enterprise-group");
      videosAntigos.forEach((el) => el.remove());
    });

    dadosVideos.forEach((video) => {
      const container = document.getElementById(video.categoria);
      if (container) {
        const groupDiv = document.createElement("div");
        groupDiv.classList.add("enterprise-group");

        const tituloTexto = getTituloTraduzido(video);

        groupDiv.innerHTML = `
          <h3 class="enterprise-title">${tituloTexto}</h3>
          <div class="video-wrapper">
            <iframe
              src="https://www.youtube.com/embed/${video.youtube_id}"
              title="${tituloTexto}"
              allowfullscreen
              loading="lazy"
            ></iframe>
          </div>
        `;
        container.appendChild(groupDiv);
      }
    });
  }
});
