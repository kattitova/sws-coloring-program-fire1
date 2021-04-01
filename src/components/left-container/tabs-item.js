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
    const constructorActive = document.querySelector(`.constructor__item.${activeTab.className.split(" ")[1]}`);
    constructorActive.classList.remove("active");

    const templatePanel = document.querySelector(".right-container__template-panel");
    templatePanel.classList.remove(activeTab.className.split(" ")[1]);
    templatePanel.classList.add(tabs[1]);

    const clearButton = document.querySelector(".template-panel__button-clear");
    clearButton.classList.remove(activeTab.className.split(" ")[1]);
    clearButton.classList.add(tabs[1]);

    setActive(e.target);
  });
}
