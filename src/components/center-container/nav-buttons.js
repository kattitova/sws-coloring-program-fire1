function setActive(index) {
  console.log(index);
  const allTabs = document.querySelectorAll(".tabs-list__tabs-item");
  allTabs.forEach((tab, i) => {
    if (index === i) tab.click();
  });
}

function getActive() {
  const constructor = document.querySelector(".center-container__constructor");
  const allItems = constructor.querySelectorAll(".constructor__item");
  let name;
  let ind;
  allItems.forEach((item, i) => {
    if (item.classList.contains("active")) {
      [, name] = item.className.split(" ");
      ind = i;
    }
  });
  return {
    tab: name,
    index: ind,
  };
}

function navigationButtonsClick() {
  // const constructor = document.querySelector(".center-container__constructor");
  // const allItems = constructor.querySelectorAll(".constructor__item");
  // let name;
  // let ind;
  // allItems.forEach((item, i) => {
  //   if (item.classList.contains("active")) {
  //     [, name] = item.className.split(" ");
  //     ind = i;
  //   }
  // });

  const panel = document.querySelector(".center-container__buttons-panel");
  panel.classList.add(getActive().tab);

  const allNavButton = panel.querySelectorAll(".navigation-buttons");
  allNavButton.forEach((button) => {
    button.addEventListener("click", () => {
      const type = button.className.split(" ")[1];
      let ind = getActive().index;
      switch (type) {
        case "back": ind -= 1; setActive(ind); break;
        case "next": ind += 1; setActive(ind); break;
        case "preview": {
          const prevButton = document.querySelector(".main-buttons__preview");
          prevButton.click();
          break;
        }
        case "order":
          // TODO check require filds and send order
          break;
        default: break;
      }
    });
  });
}

export { navigationButtonsClick };
