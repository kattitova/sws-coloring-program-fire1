// function for changin active position (Isometric, Front, Back, Side)
// it's applying for all tabs (Container, Harness, B&P, Logos)

export default function posClick() {
  const constItems = document.querySelectorAll(".constructor__item");
  let activeTab;

  function setActive(tab) {
    activeTab.classList.remove("active");
    activeTab = tab;
    activeTab.classList.add("active");
  }

  constItems.forEach((item) => {
    if (item.classList.contains("container") || item.classList.contains("harness") || item.classList.contains("binding_pinstripes") || item.classList.contains("logos")) {
      const posList = item.querySelector(".position__tabs-list");
      const positions = posList.querySelectorAll(".tabs-list__position-item");
      const allSchemas = item.querySelectorAll(".constructor__schema");
      const allPanels = item.querySelectorAll(".constructor__panel");
      posList.addEventListener("click", (e) => {
        positions.forEach((pos) => {
          if (pos.classList.contains("active")) activeTab = pos;
        });
        allSchemas.forEach((schema) => {
          schema.classList.remove("active");
        });
        allPanels.forEach((panel) => {
          panel.classList.remove("active");
        });
        const activePos = e.target.className.split(" ");
        item.querySelector(`.constructor__schema.${activePos[1]}`).classList.add("active");
        // если появится боковая панель у окантовки и/или логотипов,
        // то это условие убрать / скорректировать
        if (item.classList.contains("container") || item.classList.contains("harness")) {
          item.querySelector(`.constructor__panel.${activePos[1]}`).classList.add("active");
        }
        setActive(e.target);
      });
    }
  });
}
