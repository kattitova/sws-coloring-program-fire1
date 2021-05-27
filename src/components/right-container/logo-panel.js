import create from "../create";
import logos from "./logos.json";

function getLogoPanel() {
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
        default: break;
      }
    });
    divLogoItem.appendChild(logoButton);
    if (tip !== undefined) divLogoItem.appendChild(tip);
    divLogoPalette.appendChild(divLogoItem);
  });
  divLogoPanel.appendChild(divLogoPalette);

  return divLogoPanel;
}

export { getLogoPanel };
