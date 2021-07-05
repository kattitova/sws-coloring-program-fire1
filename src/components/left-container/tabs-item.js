export default function tabsClick() {
  const tabsList = document.querySelector(".left-container__tabs-list");
  let activeTab = tabsList.querySelector(".container");

  function setActive(tab) {
    activeTab.classList.remove("active");
    activeTab = tab;
    activeTab.classList.add("active");
  }

  tabsList.addEventListener("click", (e) => {
    localStorage.removeItem("color");
    const tabs = e.target.className.split(" ");
    const constructorSetActive = document.querySelector(`.constructor__item.${tabs[1]}`);
    constructorSetActive.classList.add("active");
    if (e.target !== activeTab) {
      const constructorActive = document.querySelector(`.constructor__item.${activeTab.className.split(" ")[1]}`);
      constructorActive.classList.remove("active");
    }

    const templatePanel = document.querySelector(".right-container__template-panel");
    templatePanel.className = `right-container__template-panel ${tabs[1]}`;

    const navButtonPanel = document.querySelector(".center-container__buttons-panel");
    navButtonPanel.className = `center-container__buttons-panel ${tabs[1]}`;

    const clearButton = document.querySelector(".template-panel__button-clear");
    clearButton.classList.remove(activeTab.className.split(" ")[1]);
    clearButton.classList.add(tabs[1]);

    const constructor = document.querySelector(".center-container__constructor");
    constructor.className = `center-container__constructor ${tabs[1]}`;

    const bpButtons = document.querySelectorAll(".position__pb-switch button");
    bpButtons.forEach((button) => {
      if (button.getAttribute("data-target") === "binding") {
        button.classList.remove("active");
      }
    });

    setActive(e.target);

    const previewScreen = constructor.querySelector(".constructor__item.preview");
    if (previewScreen.classList.contains("active")) {
      previewScreen.classList.remove("active");
    }
  });
}
