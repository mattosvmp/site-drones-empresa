const foldersRoot = document.getElementById("folders-root");
const breadSeparator = document.getElementById("breadcrumb-separator");
const breadCurrent = document.getElementById("breadcrumb-current");
const mainTitle = document.querySelector(
  'h1[data-translate-key="videoGalleryTitle"]'
);
const mainSubtitle = document.querySelector(".subtitle");

function openFolder(folderId, folderName) {
  foldersRoot.style.display = "none";
  mainTitle.style.display = "none";
  mainSubtitle.style.display = "none";

  const allFolders = document.querySelectorAll(".directory-content");
  allFolders.forEach((folder) => folder.classList.remove("active"));

  const selectedFolder = document.getElementById(folderId);
  if (selectedFolder) {
    selectedFolder.classList.add("active");

    breadSeparator.style.display = "inline";
    breadCurrent.style.display = "inline";
    breadCurrent.textContent = folderName;

    const topContent = document.querySelector(".page-content");
    if (topContent) topContent.scrollIntoView({ behavior: "smooth" });
  }
}

function closeFolder() {
  const allFolders = document.querySelectorAll(".directory-content");
  allFolders.forEach((folder) => folder.classList.remove("active"));

  breadSeparator.style.display = "none";
  breadCurrent.style.display = "none";
  breadCurrent.textContent = "";

  foldersRoot.style.display = "grid";
  mainTitle.style.display = "block";
  mainSubtitle.style.display = "block";
}
