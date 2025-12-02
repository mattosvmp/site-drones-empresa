document.addEventListener("DOMContentLoaded", () => {
  carregarFotos();
  carregarVideos();
});

// --- FUNÇÃO DE FOTOS ---
function carregarFotos() {
  const urlFotos = "data/fotos.json";

  fetch(urlFotos)
    .then((response) => {
      if (!response.ok) return null;
      return response.json();
    })
    .then((data) => {
      if (data && data.lista_fotos) {
        renderizarFotos(data.lista_fotos);
      }
    })
    .catch((error) =>
      console.log("Info: Nenhuma foto dinâmica ou erro ao ler JSON.")
    );
}

function renderizarFotos(fotos) {
  fotos.forEach((foto) => {
    const container = document.getElementById(foto.categoria);
    if (container) {
      const itemDiv = document.createElement("div");
      itemDiv.classList.add("gallery-item");

      const img = document.createElement("img");
      img.src = foto.imagem_url;
      img.alt = foto.titulo;
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

  // Atualiza o contador/setas do modal se ele já estiver carregado
  /* Pequeno delay para garantir que o DOM atualizou */
  setTimeout(() => {
    // Se houver alguma lógica de reinicialização do modal, pode ir aqui
  }, 500);
}

// --- FUNÇÃO DE VÍDEOS (NOVA) ---
function carregarVideos() {
  const urlVideos = "data/videos.json";

  fetch(urlVideos)
    .then((response) => {
      if (!response.ok) return null;
      return response.json();
    })
    .then((data) => {
      if (data && data.lista_videos) {
        renderizarVideos(data.lista_videos);
      }
    })
    .catch((error) =>
      console.log("Info: Nenhum vídeo dinâmico ou erro ao ler JSON.")
    );
}

function renderizarVideos(videos) {
  videos.forEach((video) => {
    // O 'id' do container é a categoria salva no CMS (ex: folder-commercial)
    const container = document.getElementById(video.categoria);

    if (container) {
      // Cria a estrutura HTML do vídeo
      const groupDiv = document.createElement("div");
      groupDiv.classList.add("enterprise-group");

      // Monta o HTML interno (Título + Iframe)
      // Nota: Usamos o ID do YouTube para montar o link embed
      groupDiv.innerHTML = `
        <h3 class="enterprise-title">${video.titulo}</h3>
        <div class="video-wrapper">
          <iframe
            src="https://www.youtube.com/embed/${video.youtube_id}"
            title="${video.titulo}"
            allowfullscreen
            loading="lazy"
          ></iframe>
        </div>
      `;

      // Adiciona ao final da pasta correspondente
      container.appendChild(groupDiv);
    }
  });
}
