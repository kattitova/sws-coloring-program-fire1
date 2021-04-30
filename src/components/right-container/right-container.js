import create from "../create";
import colors from "../colors.json";
import camo from "../camo.json";
import neon from "../neon.json";
import getCalculatorPanel from "./calculator";

// класс отрисовки правой панели
export default class RightContainer {
  static init() {
    const rightContainer = document.querySelector(".main");
    rightContainer.appendChild(RightContainer.getEnterCode());
    rightContainer.appendChild(RightContainer.getTemplatePanel());
  }

  // добавление формы ввода кода сохранения
  static getEnterCode() {
    const divEnterCode = create("form", "right-container__enter-code");

    const label = create("label", "enter-code__label");
    label.setAttribute("data-lang", "enter_code");
    label.textContent = "Enter code";
    const input = create("input", "enter-code__input");
    input.setAttribute("type", "text");
    input.setAttribute("name", "id");
    const button = create("button", "enter-code__button");
    button.setAttribute("type", "submit");

    divEnterCode.appendChild(label);
    divEnterCode.appendChild(input);
    divEnterCode.appendChild(button);
    return divEnterCode;
  }

  // добавление блока - выбора цветов, текстур + кнопки Применить ко всем, Очистить все
  static getTemplatePanel() {
    const divTemplatePanel = create("div", ...["right-container__template-panel", "container"]);

    divTemplatePanel.appendChild(RightContainer.getColorPanel());

    const buttonApplayAll = create("button", "template-panel__button-apply");
    buttonApplayAll.setAttribute("data-lang", "apply_all");
    buttonApplayAll.textContent = "Apply to all areas";
    divTemplatePanel.appendChild(buttonApplayAll);

    const buttonClearAll = create("button", ...["template-panel__button-clear", "container"]);
    buttonClearAll.setAttribute("data-lang", "clear_all");
    buttonClearAll.textContent = "Clear all colors";
    divTemplatePanel.appendChild(buttonClearAll);

    divTemplatePanel.appendChild(RightContainer.panelContactUs());
    divTemplatePanel.appendChild(getCalculatorPanel());

    return divTemplatePanel;
  }

  // добавление блока выбора цветов, текстур
  static getColorPanel() {
    const divColorPanel = create("div", "right-container__color-panel");

    const divColorPanelTitle = create("div", "color-panel__title");
    divColorPanelTitle.setAttribute("data-lang", "colors");
    divColorPanelTitle.textContent = "colors";
    divColorPanel.appendChild(divColorPanelTitle);

    const divColorsPalette = create("div", "color-panel__colors-palette");
    divColorsPalette.appendChild(RightContainer.getPickBlock());
    divColorsPalette.appendChild(RightContainer.getPickBlockCamo());
    divColorsPalette.appendChild(RightContainer.getPickBlockNeon());
    divColorPanel.appendChild(divColorsPalette);

    const divColorPanelFooter = create("div", "color-panel__footer");
    divColorPanelFooter.setAttribute("data-lang", "colors_msg");
    divColorPanelFooter.textContent = "Some colors are not active in all areas.";
    divColorPanel.appendChild(divColorPanelFooter);
    return divColorPanel;
  }

  // добавление блока - палитра цветов
  static getPickBlock() {
    const pickBlock = create("div", "colors-palette__pick-block");

    const pickBlockTitle = create("div", "pick-block__title");
    pickBlockTitle.setAttribute("data-lang", "basic");
    pickBlockTitle.textContent = "Basic:";
    pickBlock.appendChild(pickBlockTitle);

    pickBlock.appendChild(RightContainer.getPickBlockColors());

    // запоминаем выбранный цвет
    pickBlock.addEventListener("click", (e) => {
      const color = e.target.getAttribute("data-color");
      if (color !== null) {
        localStorage.setItem("color", color);
        RightContainer.checkBinding(color);
      } else localStorage.removeItem("color");
    });

    return pickBlock;
  }

  // добавление блока - базовые цвета
  static getPickBlockColors() {
    const pickBlockColors = create("div", "pick-block__colors");

    Object.keys(colors[0]).forEach((i) => {
      const colorButton = create("button", i);
      colorButton.setAttribute("data-color", i);
      colorButton.setAttribute("data-harness", colors[0][i].harness);
      colorButton.setAttribute("title", colors[0][i][i]);
      pickBlockColors.appendChild(colorButton);
    });
    return pickBlockColors;
  }

  // добавление блока - камуфлированные текстуры
  static getPickBlockCamo() {
    const pickBlockCamo = create("div", "colors-palette__camo-block");

    const pickBlockCamoTitle = create("div", "camo-block__title");
    pickBlockCamoTitle.setAttribute("data-lang", "camo");
    pickBlockCamoTitle.textContent = "Camo:";
    pickBlockCamo.appendChild(pickBlockCamoTitle);

    const pickBlockCamoPatterns = create("div", "camo-block__camo-patterns");
    camo.forEach((i) => {
      const camoButton = create("button", i);
      camoButton.setAttribute("data-color", i);
      camoButton.setAttribute("title", i);
      pickBlockCamoPatterns.appendChild(camoButton);
    });
    pickBlockCamo.appendChild(pickBlockCamoPatterns);

    // запоминаем выбранный камуфляж
    pickBlockCamo.addEventListener("click", (e) => {
      localStorage.setItem("color", e.target.getAttribute("data-color"));
    });

    const tip = create("div", "tip");
    const tipTitle = create("b");
    tipTitle.setAttribute("data-lang", "camo_pattern");
    tipTitle.textContent = "*Camo Pattern";
    tip.appendChild(tipTitle);
    tip.appendChild(document.createTextNode(" - "));
    const tipPrice = create("span");
    tipPrice.setAttribute("data-id", "camo");
    tip.appendChild(tipPrice);
    pickBlockCamo.appendChild(tip);

    return pickBlockCamo;
  }

  // добавление блока - неоновые цвет
  static getPickBlockNeon() {
    const pickBlockNeon = create("div", "colors-palette__neon-block");

    const pickBlockNeonTitle = create("div", "neon-block__title");
    pickBlockNeonTitle.setAttribute("data-lang", "neon");
    pickBlockNeonTitle.textContent = "Neon:";
    pickBlockNeon.appendChild(pickBlockNeonTitle);

    const pickBlockNeonColors = create("div", "neon-block__neon-colors");
    neon.forEach((i) => {
      const neonButton = create("button", i.color);
      neonButton.setAttribute("data-color", i.color);
      neonButton.setAttribute("data-container", i.container);
      neonButton.setAttribute("title", i.color);
      pickBlockNeonColors.appendChild(neonButton);
    });
    pickBlockNeon.appendChild(pickBlockNeonColors);

    // запоминаем выбранный цвет неон
    pickBlockNeon.addEventListener("click", (e) => {
      const color = e.target.getAttribute("data-color");
      if (color !== null) {
        localStorage.setItem("color", color);
        RightContainer.checkBinding(color);
      } else localStorage.removeItem("color");
    });

    return pickBlockNeon;
  }

  static checkBinding(color) {
    const button = document.querySelector(".position__pb-switch button[data-target=\"binding\"]");
    if (button.classList.contains("active")) {
      const bindingAll = document.querySelectorAll("[data-id=\"binding\"]");
      bindingAll.forEach((binding) => {
        const pathAll = binding.querySelectorAll("path");
        pathAll.forEach((path) => {
          path.setAttribute("data-color", color);
        });
      });

      const form = document.querySelector(".form-constructor");
      const formItem = form.querySelector("[data-target=\"binding\"]");
      formItem.setAttribute("value", color);
      formItem.textContent = color;
    }
  }

  static panelContactUs() {
    const divContactUsPanel = create("div", "right-container__contact-panel");

    const divTitle = create("div", "contact-panel__title");
    divTitle.setAttribute("data-lang", "contact_us");
    divTitle.textContent = "contact us";
    divContactUsPanel.appendChild(divTitle);

    const divInfoWrapper = create("div", "contact-panel__info-wrapper");
    const divInfo = create("div", "contact-panel__info");
    divInfo.setAttribute("data-lang", "contact_msg");
    divInfo.textContent = "Contact SWS Company for any of Your support needs";
    divInfoWrapper.appendChild(divInfo);

    const divEmail = create("div", "contact-panel__email");
    divEmail.textContent = "Email:";
    divInfoWrapper.appendChild(divEmail);
    const spanEmail = create("span", "contact-panel__email");
    spanEmail.textContent = "info@sws.aero";
    divInfoWrapper.appendChild(spanEmail);

    const divPhone = create("div", "contact-panel__phone");
    divPhone.setAttribute("data-lang", "contact_phone");
    divPhone.textContent = "Phone:";
    divInfoWrapper.appendChild(divPhone);
    const spanPhone = create("span", "contact-panel__phone");
    spanPhone.textContent = "+38 (067) 404 00 16";
    divInfoWrapper.appendChild(spanPhone);

    divContactUsPanel.appendChild(divInfoWrapper);
    return divContactUsPanel;
  }
}
