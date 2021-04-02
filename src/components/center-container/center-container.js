import create from "../create";
import { arrTabs } from "../left-container/left-container";
import getIsometric from "./screens/container/container-isometric";
import getFront from "./screens/container/container-front";
import getBack from "./screens/container/container-back";
import getSide from "./screens/container/container-side";
import infoJSON from "./info-inputs.json";
import genInputs from "./get-inputs";

// объект с пунктами меню, для каждого пункта описаны виды,
// и функция, которая выводит каждую схему ранца
const objPositionTabs = {
  container: {
    isometric: getIsometric,
    front: getFront,
    back: getBack, // change on getBack
    side: getSide, // change on getSide
  },
  harness: {
    back: getBack, // change on getBackHarness
  },
  binding_pinstripes: {
    front: getFront, // change on FrontBP
    back: getBack, // change on getBackBP
  },
  logos: {
    front: getFront, // change on FrontLogos
    back: getBack, // change on getBackLogos
    side: getSide, // change on getSideLogos
  },
};

// detail names
export const detailNames = ["", "Reserve Container", "Central panel", "Main pincover flap", "Main container", "Riser cover", "Reserve pincover flap", "Yoke", "Lateral cover", "Reserve PC", "Leg strap cover", "Handle pockets", "Three rings covers", "Backpad", "Chest strap", "", "", "Harness webbings"];

export default class CenterContainer {
  static init() {
    const centerContainer = document.querySelector(".main");
    centerContainer.appendChild(CenterContainer.getConstructor());
    centerContainer.appendChild(CenterContainer.getButtonsPanel());
    CenterContainer.getPanelList();
  }

  // add constructor area with screens "container", "harness", .ets
  static getConstructor() {
    const divConstructor = create("div", "center-container__constructor");


    arrTabs.forEach((i) => {
      // генерируем экраны для разделов меню
      const screen = create("div", ...["constructor__item", `${i}`]);
      if (i === "container") screen.classList.add("active");

      // для пунктов меню Container, Harness, Binding & Pinstripes, Logos
      // генерируем три области на экране: таблички с видом, схема ранца, названия деталей ранца
      if (i === "container" || i === "harness" || i === "binding_pinstripes" || i === "logos") {
        const position = create("div", "constructor__position");
        const tabsList = create("div", "position__tabs-list");
        Object.keys(objPositionTabs[i]).forEach((pos, ind) => {
          // таблички с видом ранца Front, Back, etc
          const item = create("button", ...["tabs-list__position-item", `${pos}`]);
          if (ind === 0) item.classList.add("active");
          item.textContent = pos;
          tabsList.appendChild(item);

          // для каждого вида добавляем свою схему ранца
          const schema = create("div", ...["constructor__schema", `${pos}`]);
          if (ind === 0) schema.classList.add("active");
          schema.appendChild(objPositionTabs[i][pos]());
          const info = create("div", "constructor__schema--info");
          schema.appendChild(info);
          screen.appendChild(schema);

          // панель с обозначением деталей ранца
          // на ней будет отображаться либо shematic, либо другие элемнеты управления
          // в зависимости от активной вкладки
          const panel = create("div", ...["constructor__panel", `${pos}`]);
          if (ind === 0) panel.classList.add("active");

          // добавляем shematic только для разделов container и harness
          if (i === "container" || i === "harness") {
            const schematics = create("div", "panel__schematics");
            const panelTitle = create("div", ...["schematics__title", `${pos}`]);
            panelTitle.textContent = "schematics";
            panelTitle.setAttribute("data-lang", "schematics");
            schematics.appendChild(panelTitle);
            const panelList = create("div", "schematics__list");
            schematics.appendChild(panelList);
            panel.appendChild(schematics);

            // кнопки Split|Solid
            if (i === "container") {
              if (pos === "isometric" || pos === "front") {
                const splitButtons = create("div", "panel__split-switch");
                splitButtons.append(CenterContainer.getSplitButton(2));
                splitButtons.append(CenterContainer.getSplitButton(6));

                const tip = create("div", "split-switch__tip");
                const tipText = create("div");
                tipText.setAttribute("data-lang", "split_design_txt");
                tipText.textContent = "*Split Design of container panels #2 or/and #6";
                tip.appendChild(tipText);
                tip.appendChild(document.createTextNode(" - "));
                const price = create("span");
                price.setAttribute("data-id", "price74");
                tip.appendChild(price);

                splitButtons.appendChild(tip);
                panel.appendChild(splitButtons);
              }
            }

            screen.appendChild(panel);
          }
        });
        position.appendChild(tabsList);

        // если раздел Окантовка и Лучи, то добавляем переключатели
        if (i === "binding_pinstripes") {
          const switcherBlock = create("div", "position__pb-switch");

          // pinstarp button switcher
          const pinstrapButton = create("button");
          pinstrapButton.setAttribute("data-target", "pinstripes");

          const pinB = create("b");
          pinB.setAttribute("data-lang", "pinstripes");
          pinB.textContent = "pinstripes";
          pinstrapButton.appendChild(pinB);

          const pinSpan = create("span");
          pinSpan.setAttribute("data-id", "price68");

          pinstrapButton.appendChild(pinSpan);
          switcherBlock.appendChild(pinstrapButton);
          // ------

          // binding button switcher
          const bindingButton = create("button");
          bindingButton.setAttribute("data-target", "binding");
          bindingButton.setAttribute("data-lang", "binding");

          const bindB = create("b");
          bindB.textContent = "binding";
          bindingButton.appendChild(bindB);
          switcherBlock.appendChild(bindingButton);
          // ------

          position.appendChild(switcherBlock);
        }
        screen.appendChild(position);
      }

      if (i === "information") {
        screen.appendChild(genInputs(infoJSON[0], "info"));
      }

      if (i === "sizes") {
        screen.appendChild(genInputs(infoJSON[1], "sizes"));
      }

      if (i === "options") {
        screen.appendChild(genInputs(infoJSON[2], "options"));
      }

      divConstructor.appendChild(screen);
    });
    return divConstructor;
  }

  static getSplitButton(num) {
    const splitBut = create("button", "split-switch__button");
    splitBut.setAttribute("data-target", `split-design-${num}`);
    splitBut.setAttribute("data-num", num);

    const butNum = create("span", "split-switch__button--num");
    butNum.textContent = num;
    splitBut.appendChild(butNum);

    const butName = create("span", "split-switch__button--name");
    butName.setAttribute("data-lang", "split_design");
    butName.textContent = "split design";
    splitBut.appendChild(butName);

    return splitBut;
  }

  static getPanelList() {
    // делаем выборку номеров деталей в каждой схеме
    for (let i = 0; i < 2; i += 1) {
      const constructor = document.querySelector(`.constructor__item.${arrTabs[i]}`);
      Object.keys(objPositionTabs[arrTabs[i]]).forEach((pos) => {
        const schema = constructor.querySelector(`.constructor__schema.${pos}`);
        const paths = schema.querySelectorAll("path");
        let arr = [];
        if (arrTabs[i] === "container") {
          paths.forEach((item) => {
            const dataId = item.getAttribute("data-id");
            if (dataId !== null && !item.classList.contains("no-active")) arr.push(parseInt(dataId.match(/\d+/g).join(""), 10));
          });
          arr = Array.from(new Set(arr.sort((a, b) => a - b)));
        } else arr = [14, 17]; // если вкладка harness

        // добавляем детали в список Schematics
        const list = constructor.querySelector(`.constructor__panel.${pos} .schematics__list`);
        arr.forEach((num) => {
          const listItem = create("div", "schematics__list-item");
          listItem.setAttribute("data-target", `area-${num}`);

          const itemNum = create("div", "list-item__num");
          itemNum.textContent = num;

          const itemName = create("div", "list-item__name");
          itemName.setAttribute("data-lang", `${detailNames[num].replace(" ", "_").toLowerCase()}`);
          itemName.textContent = detailNames[num];

          listItem.appendChild(itemNum);
          listItem.appendChild(itemName);
          list.appendChild(listItem);

          // добаляем доп детали 2a,2b,2c,6d,6e,6f в лист Схематикс
          const symb = num === 2 ? 97 : 100;
          if (num === 2 || num === 6) {
            const listItemDopContainer = create("div", ...["schematics__split-switch", "hidden"]);
            listItemDopContainer.setAttribute("data-target", `split-design-${num}`);
            for (let j = symb; j < symb + 3; j += 1) {
              const listItemDop = create("div", "schematics__list-item");
              listItemDop.setAttribute("data-target", `area-${num}${String.fromCharCode(j)}`);

              const itemNumDop = create("div", "list-item__num");
              itemNumDop.textContent = `${num}${String.fromCharCode(j)}`;

              const itemNameDop = create("div", "list-item__name");
              itemNameDop.setAttribute("data-lang", "panel");
              itemNameDop.textContent = "panel";

              listItemDop.appendChild(itemNumDop);
              listItemDop.appendChild(itemNameDop);
              listItemDopContainer.appendChild(listItemDop);
            }
            list.appendChild(listItemDopContainer);
          }
        });
      });
    }
  }

  // кнопки Preview, Saev, Next, Back
  static getButtonsPanel() {
    const divButtonsPanel = create("div", "center-container__buttons-panel");
    divButtonsPanel.appendChild(CenterContainer.getMainButtons());
    divButtonsPanel.appendChild(CenterContainer.getNavigationButtons());
    return divButtonsPanel;
  }

  static getMainButtons() {
    const divMainButtons = create("div", "buttons-panel__main-buttons");
    const arrMainButtons = ["preview", "save"];
    arrMainButtons.forEach((i) => {
      const button = create("button", `main-buttons__${i}`);
      button.setAttribute("data-lang", i);
      button.textContent = i;
      divMainButtons.appendChild(button);
    });
    return divMainButtons;
  }

  static getNavigationButtons() {
    const divNavigationButtons = create("div", "buttons-panel__navigation-buttons");
    const arrNavButtons = ["back", "next", "preview"];
    arrNavButtons.forEach((i) => {
      let button;
      if (i === "preview") button = create("button", ...[`navigation-buttons__${i}`, `navigation-buttons__${i}--hidden`]);
      else button = create("button", `navigation-buttons__${i}`);
      button.setAttribute("data-lang", i);
      button.textContent = i;
      divNavigationButtons.appendChild(button);
    });
    return divNavigationButtons;
  }
}
