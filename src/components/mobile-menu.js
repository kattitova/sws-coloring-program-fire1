function mobileButtonMenuHandler() {
  const leftButton = document.querySelector(".open-button.leftmenu");
  leftButton.addEventListener("click", () => {
    const leftContainer = document.querySelector(".left-container");
    leftContainer.classList.add("open");
  });

  const rightButton = document.querySelector(".open-button.rightmenu");
  rightButton.addEventListener("click", () => {
    const rightContainer = document.querySelector(".right-container__template-panel");
    rightContainer.classList.add("open");
  });
}

function closeLeftMenu() {
  const leftContainer = document.querySelector(".left-container");
  leftContainer.classList.remove("open");
}

function closeRightMenu() {
  const rightContainer = document.querySelector(".right-container__template-panel");
  const allButton = rightContainer.querySelectorAll("button");
  allButton.forEach((button) => {
    if (button.parentElement.className !== "logos-palette__logo-item") {
      button.addEventListener("click", () => {
        rightContainer.classList.remove("open");
      });
    }
  });
}

export { mobileButtonMenuHandler, closeLeftMenu, closeRightMenu };
