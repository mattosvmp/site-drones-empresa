document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("imageModal");
  const modalImg = document.getElementById("modalImage");
  const closeBtn = document.querySelector(".close-btn");
  const prevBtn = document.querySelector(".prev");
  const nextBtn = document.querySelector(".next");
  const counterText = document.getElementById("imageCounter");

  const galleryItems = document.querySelectorAll(".gallery-item img");

  let currentSectionImages = [];
  let currentIndex = 0;
  let touchStartX = 0;
  let touchEndX = 0;

  const openModal = (imgElement) => {
    const parentGrid = imgElement.closest(".gallery-grid");
    if (!parentGrid) return;

    const imagesInThisSection = parentGrid.querySelectorAll("img");
    currentSectionImages = Array.from(imagesInThisSection);
    currentIndex = currentSectionImages.indexOf(imgElement);

    updateModalImage();
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  };

  const updateModalImage = () => {
    if (currentSectionImages.length > 0) {
      const imgElement = currentSectionImages[currentIndex];
      modalImg.src = imgElement.src;
      modalImg.alt = imgElement.alt;

      counterText.textContent = `${currentIndex + 1} / ${
        currentSectionImages.length
      }`;

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

  galleryItems.forEach((img) => {
    img.addEventListener("click", () => openModal(img));
  });

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
      handleSwipe();
    },
    { passive: true }
  );

  const handleSwipe = () => {
    if (touchStartX - touchEndX > 50) showNext();
    if (touchEndX - touchStartX > 50) showPrev();
  };
});
