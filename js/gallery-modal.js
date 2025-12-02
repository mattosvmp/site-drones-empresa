document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("imageModal");
  const modalImg = document.getElementById("modalImage");
  const closeBtn = document.querySelector(".close-btn");
  const prevBtn = document.querySelector(".prev");
  const nextBtn = document.querySelector(".next");
  const counterText = document.getElementById("imageCounter");

  // Removemos a seleção inicial de galleryItems pois agora são dinâmicos

  let currentSectionImages = [];
  let currentIndex = 0;
  let touchStartX = 0;
  let touchEndX = 0;

  // --- Função Principal de Abrir ---
  // Tornamos ela acessível globalmente via window
  window.abrirModalExterno = (imgElement) => {
    // 1. Descobre em qual grid a imagem está
    const parentGrid = imgElement.closest(".gallery-grid");
    if (!parentGrid) return;

    // 2. Recalcula a lista de imagens daquele grid naquele momento
    const imagesInThisSection = parentGrid.querySelectorAll("img");
    currentSectionImages = Array.from(imagesInThisSection);

    // 3. Descobre a posição da imagem clicada
    currentIndex = currentSectionImages.indexOf(imgElement);

    updateModalImage();
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  };

  const updateModalImage = () => {
    if (currentSectionImages.length > 0) {
      const imgElement = currentSectionImages[currentIndex];
      modalImg.src = imgElement.src;
      modalImg.alt = imgElement.alt || "Imagem da Galeria";

      counterText.textContent = `${currentIndex + 1} / ${
        currentSectionImages.length
      }`;

      // Esconde setas se só tiver 1 imagem
      if (currentSectionImages.length <= 1) {
        prevBtn.style.visibility = "hidden";
        nextBtn.style.visibility = "hidden";
      } else {
        prevBtn.style.visibility = "visible";
        nextBtn.style.visibility = "visible";
      }
    }
  };

  const closeModal = () => {
    modal.classList.remove("active");
    setTimeout(() => {
      modalImg.src = "";
    }, 200);
    document.body.style.overflow = "auto";
  };

  const showNext = () => {
    currentIndex = (currentIndex + 1) % currentSectionImages.length;
    updateModalImage();
  };

  const showPrev = () => {
    currentIndex =
      (currentIndex - 1 + currentSectionImages.length) %
      currentSectionImages.length;
    updateModalImage();
  };

  // --- Event Listeners dos Controles ---
  nextBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    showNext();
  });
  prevBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    showPrev();
  });
  closeBtn.addEventListener("click", closeModal);

  modal.addEventListener("click", (e) => {
    if (
      e.target === modal ||
      e.target.classList.contains("modal-content-wrapper")
    ) {
      closeModal();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (!modal.classList.contains("active")) return;
    if (e.key === "Escape") closeModal();
    if (e.key === "ArrowLeft") showPrev();
    if (e.key === "ArrowRight") showNext();
  });

  // Gestos de Touch (Swipe)
  modal.addEventListener(
    "touchstart",
    (e) => {
      touchStartX = e.changedTouches[0].screenX;
    },
    { passive: true }
  );

  modal.addEventListener(
    "touchend",
    (e) => {
      touchEndX = e.changedTouches[0].screenX;
      if (touchStartX - touchEndX > 50) showNext();
      if (touchEndX - touchStartX > 50) showPrev();
    },
    { passive: true }
  );
});
