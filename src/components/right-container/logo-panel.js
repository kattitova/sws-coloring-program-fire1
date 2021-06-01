import create from "../create";
import logos from "./logos.json";

function unCheckedAllLogos(palette, panels) {
  const constructor = document.querySelector(".constructor__item.logos");
  const tabs = constructor.querySelectorAll(".tabs-list__position-item");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const buttons = palette.querySelectorAll("button");
      buttons.forEach((button) => {
        button.classList.remove("checked", "disabled");
      });
      panels.forEach((panel) => {
        const blocks = panel.querySelectorAll(".panel__block");
        blocks.forEach((block) => {
          block.classList.remove("active");
        });
      });
    });
  });
}

function getLogoPanel() {
  const constructor = document.querySelector(".constructor__item.logos");
  const panels = constructor.querySelectorAll(".constructor__panel");

  const divLogoPanel = create("div", "right-container__logo-panel");

  const divLogoPanelTitle = create("div", "logo-panel__title");
  divLogoPanelTitle.setAttribute("data-lang", "logos");
  divLogoPanelTitle.textContent = "logos";
  divLogoPanel.appendChild(divLogoPanelTitle);

  const divLogoPalette = create("div", "logo-panel__logos-palette");
  logos.forEach((logo) => {
    const divLogoItem = create("div", "logos-palette__logo-item");
    const logoButton = create("button");
    logoButton.addEventListener("click", () => {
      const buttons = divLogoPalette.querySelectorAll("button");
      const data = logoButton.getAttribute("data-val");
      buttons.forEach((button) => {
        if (data !== button.getAttribute("data-val")) {
          button.classList.remove("checked");
        }
      });
      logoButton.classList.toggle("checked");
      if (data === "custom_text" || data === "custom_logo") {
        panels.forEach((panel) => {
          if (panel.classList.contains("active")) {
            const blocks = panel.querySelectorAll(".panel__block");
            blocks.forEach((block) => {
              if (logoButton.classList.contains("checked")) {
                if (block.getAttribute("data-id") === data) block.classList.add("active");
                else block.classList.remove("active");
              } else if (block.getAttribute("data-id") === data) block.classList.remove("active");
            });
          }
        });
      } else {
        panels.forEach((panel) => {
          if (panel.classList.contains("active")) {
            const blocks = panel.querySelectorAll(".panel__block");
            blocks.forEach((block) => {
              block.classList.remove("active");
            });
          }
        });
      }
    });
    let tip;
    Object.keys(logo).forEach((key) => {
      const { title } = logo;
      switch (key) {
        case "title": logoButton.setAttribute("data-val", title);
          break;
        case "cont": {
          if (logo.cont === "img") {
            const img = create("img");
            img.src = `./images/${title}.svg`;
            img.setAttribute("alt", title);
            logoButton.appendChild(img);
          } else {
            const txt = create("b");
            txt.textContent = logo.cont;
            txt.setAttribute("data-lang", title);
            logoButton.appendChild(txt);
          }
          break;
        }
        case "tip": {
          tip = create("span", "tip");
          tip.textContent = logo.tip;
          tip.setAttribute("data-lang", `${title}_msg`);
          break;
        }
        case "price": {
          const span = create("span");
          span.textContent = logo.price;
          span.setAttribute("data-id", title);
          logoButton.appendChild(span);
          break;
        }
        case "area": {
          logoButton.className = logo.area;
          break;
        }
        default: break;
      }
    });
    divLogoItem.appendChild(logoButton);
    if (tip !== undefined) divLogoItem.appendChild(tip);
    divLogoPalette.appendChild(divLogoItem);
  });
  divLogoPanel.appendChild(divLogoPalette);

  unCheckedAllLogos(divLogoPalette, panels);

  return divLogoPanel;
}

export { getLogoPanel };
