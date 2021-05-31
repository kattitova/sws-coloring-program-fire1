import * as Func from "../../../functions";
import create from "../../../create";
import { getFireLogo } from "./fire";
import { getSwsLogo } from "./sws";
import { getXLogo } from "./xlogo";
import { getCustomLogo } from "./custom_logo";
import { getCustomText } from "./custom_text";
import getSide from "../container/container-side";

// активация выбранного логотипа на детали
function addLogoChecked(data, value) {
  const allLogoAreas = document.querySelectorAll(`.logos__area[data-logo="${data}"]`);
  allLogoAreas.forEach((area) => {
    area.classList.add("checked");
    const allLogos = area.querySelectorAll("div");
    allLogos.forEach((logo) => {
      logo.classList.remove("checked");
    });
    const selectedLogos = area.querySelectorAll(`.logo__${value}`);
    selectedLogos.forEach((logo) => {
      logo.classList.add("checked");
    });
  });
}

// обработка лого областей
function setLogoAreasActions() {
  const constructor = document.querySelector(".constructor__item.logos");
  const elements = constructor.querySelectorAll(".schema__element");
  const logoButtons = document.querySelectorAll(".logo-panel__logos-palette button");

  elements.forEach((elem) => {
    if (elem.classList.contains("logo-area")) {
      elem.addEventListener("mouseover", () => {
        Func.onHoverElement(elem);
      });
      elem.addEventListener("mouseout", () => {
        Func.outHoverElement(elem);
      });
      elem.addEventListener("click", () => {
        const data = elem.getAttribute("data-logo");

        elements.forEach((el) => {
          el.classList.remove("active");
        });
        elem.classList.add("active");

        logoButtons.forEach((button) => {
          if (!button.classList.contains(data)) button.classList.add("disabled");
          else {
            button.classList.remove("disabled");
            if (button.classList.contains("checked")) {
              const value = button.getAttribute("data-val");
              addLogoChecked(data, value);
            }
          }
        });
      });
    }
  });

  logoButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (button.classList.contains("checked")) {
        const schema = constructor.querySelector(".constructor__schema.active");
        const details = schema.querySelectorAll(".schema__element");
        details.forEach((det) => {
          if (det.classList.contains("active")) {
            const data = det.getAttribute("data-logo");
            if (button.classList.contains(data)) {
              const value = button.getAttribute("data-val");
              addLogoChecked(data, value);
            }
          }
        });
      }
    });
  });
}

// добавляем логотипы на все виды ранце на всех экранах
function addLogosToConstructor() {
  const allConstructors = document.querySelectorAll(".constructor__item");
  allConstructors.forEach((cons) => {
    const allSchemas = cons.querySelectorAll(".constructor__schema");
    allSchemas.forEach((schema, ind) => {
      const screen = schema.className.split(" ")[1];
      const logos = create("div", "constructor__logos");
      logos.classList.add(screen);
      if (ind === 0) logos.classList.add("active");

      const logoAreas = {
        isometric: ["left-side", "central-detail"],
        front: ["central-detail"],
        back: ["rc-left", "rc-right"],
        side: ["left-side", "right-side"],
      };

      logoAreas[screen].forEach((area) => {
        const divArea = create("div", "logos__area");
        divArea.setAttribute("data-logo", area);
        switch (area) {
          case "left-side":
          case "right-side":
            divArea.appendChild(getFireLogo());
            break;
          case "central-detail":
            divArea.appendChild(getXLogo());
            break;
          case "rc-left":
            divArea.appendChild(getFireLogo());
            break;
          case "rc-right":
            divArea.appendChild(getSwsLogo());
            break;
          default: break;
        }
        divArea.appendChild(getCustomLogo());
        divArea.appendChild(getCustomText());
        logos.appendChild(divArea);
      });

      const schemaImg = schema.querySelector(".constructor__schema--img");
      schemaImg.appendChild(logos);
    });
  });
}

export default function getLogosElements() {
  const logoScreen = document.querySelector(".constructor__item.logos");
  // добавляем в id камуфляжных текстур отличительный идентификатор logos,
  // чтобы id были уникальные на всех экаранах и к деталям применялся камуфляж,
  // прописанный в стилях
  const schemas = logoScreen.querySelectorAll(".constructor__schema--img");
  schemas.forEach((schema) => {
    const patterns = schema.querySelectorAll("pattern");
    patterns.forEach((pattern) => {
      pattern.setAttribute("id", `${pattern.getAttribute("id")}-logos`);
    });
  });

  addLogosToConstructor();


  // добавляем правую боковую сторону
  const side = logoScreen.querySelector(".constructor__schema.side");

  const sideSchema = side.querySelector(".constructor__schema--img");
  const clone = sideSchema.cloneNode(true);
  clone.classList.add("right");
  sideSchema.after(clone);
  sideSchema.classList.add("left");

  const rightSide = clone.querySelector(".schema__element[data-logo=\"left-side\"]");
  rightSide.setAttribute("data-logo", "right-side");

  setLogoAreasActions();
}
