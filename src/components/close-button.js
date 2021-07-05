import create from "./create";

function getCloseButton(modal) {
  const closeButton = create("button", "modal-close");
  closeButton.innerHTML = "<i class=\"fas fa-times\"></i>";
  closeButton.addEventListener("click", () => {
    modal.classList.toggle("open");
  });
  return closeButton;
}

export { getCloseButton };
