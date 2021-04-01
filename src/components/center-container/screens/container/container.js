import {
  onHoverElement, outHoverElement, getAllDetailsByDataId, handlerClickDetails,
} from "../../../functions";
import create from "../../../create";
import { letters } from "../../split-buttons";

const form = document.querySelector(".form-constructor");

function setContainerColor(details, dataTarget) {
  const color = localStorage.getItem("color");
  if (color !== null) {
    const formItem = form.querySelector(`[data-target="${dataTarget}"]`);
    formItem.setAttribute("value", color);
    formItem.textContent = color;
    details.forEach((det) => {
      det.setAttribute("data-color", color);
    });
  }
}

// функция обработки кликов по кнопкам Apply to All
function addApplyAll() {
  const container = document.querySelector(".right-container__template-panel.container");
  const buttonApply = container.querySelector(".template-panel__button-apply");
  buttonApply.addEventListener("click", () => {
    const color = localStorage.getItem("color");
    if (color !== null) {
      handlerClickDetails(color);
    }
  });
}

// функция навешивает события на пункты листа Shematics (hover, click)
function shematicsItemEvents(container) {
  const shematicsItems = container.querySelectorAll(".schematics__list-item");
  shematicsItems.forEach((item) => {
    const dataTarget = item.getAttribute("data-target");
    const details = getAllDetailsByDataId(dataTarget);

    item.addEventListener("mouseover", () => {
      details.forEach((det) => {
        onHoverElement(det);
      });
    });

    item.addEventListener("mouseout", () => {
      details.forEach((det) => {
        outHoverElement(det);
      });
    });

    item.addEventListener("click", () => {
      setContainerColor(details, dataTarget);
    });
  });
}

// функция навешивает события на заголовок листа Shematics (click)
function schematicsTitleEvents(container) {
  const shematicsTitles = container.querySelectorAll(".schematics__title");
  shematicsTitles.forEach((title) => {
    title.addEventListener("click", () => {
      title.classList.toggle("active");

      // формируем подсказки к деталям
      // проходим по всем деталям схемы и добавляем их координаты в массив объектов
      // далее выставляем цифры рядом с деталями по координатам
      const pos = title.className.split(" ")[1];
      const schema = container.querySelector(`.constructor__schema.${pos}`);
      const infoContainer = schema.querySelector(".constructor__schema--info");
      if (title.classList.contains("active")) {
        const details = schema.querySelectorAll(".schema__element");
        const elemCoord = [];

        details.forEach((det) => {
          const dataId = det.getAttribute("data-id");
          if (dataId !== null && !det.classList.contains("no-active")) {
            const coordObj = {
              id: dataId,
              item: det,
              num: dataId.split("-")[1],
            };
            const checkId = elemCoord.some(item => item.id === dataId);
            if (!checkId && coordObj.top !== 0) {
              elemCoord.push(coordObj);
              const detailInfo = create("div", "info-item");
              detailInfo.setAttribute("data-id", coordObj.id);
              detailInfo.textContent = coordObj.num;
              // if (coordObj.num.length === 2) detailInfo.classList.add("hidden");
              infoContainer.appendChild(detailInfo);
            }
          }
        });
      } else infoContainer.innerHTML = "";
    });
  });
}

// функция проверяет активность кнопки Split Design
// и в зависимости от активности показывает значки инфо нужнух деталей
function checkSplitActivity(container) {
  const shematicsTitles = container.querySelectorAll(".schematics__title");
  shematicsTitles.forEach((title) => {
    title.addEventListener("click", () => {
      const pos = title.className.split(" ")[1];
      const schema = container.querySelector(`.constructor__schema.${pos}`);
      const infoContainer = schema.querySelector(".constructor__schema--info");
      if (title.classList.contains("active")) {
        const splitButtons = container.querySelectorAll(`.constructor__panel.${pos} .split-switch__button`);
        splitButtons.forEach((button) => {
          const num = button.getAttribute("data-num");
          if (button.classList.contains("active")) {
            const infoItem = infoContainer.querySelector(`.info-item[data-id="area-${num}"]`);
            infoItem.classList.add("hidden");
          } else {
            const ind = parseInt(num, 10) === 2 ? 0 : 3;
            for (let i = ind; i < ind + 3; i += 1) {
              const infoItem = infoContainer.querySelector(`.info-item[data-id="area-${num}${letters[i]}"]`);
              infoItem.classList.add("hidden");
            }
          }
        });
      }
    });
  });
}

export default function getContainerElements() {
  const container = document.querySelector(".constructor__item.container");
  const containerScreens = container.querySelectorAll(".constructor__schema");

  containerScreens.forEach((screen) => {
    // вешаем события на детали hover, click
    const details = screen.querySelectorAll("path");
    details.forEach((item) => {
      const dataId = item.getAttribute("data-id");
      if (dataId !== null) {
        let arrDetails;
        item.addEventListener("mouseover", () => {
          arrDetails = getAllDetailsByDataId(dataId);
          arrDetails.forEach((det) => {
            onHoverElement(det);
          });
        });

        item.addEventListener("mouseout", () => {
          arrDetails.forEach((det) => {
            outHoverElement(det);
          });
        });

        item.addEventListener("click", () => {
          setContainerColor(arrDetails, dataId);
        });
      }
    });
  });

  shematicsItemEvents(container);
  schematicsTitleEvents(container);
  checkSplitActivity(container);
  addApplyAll();
}

export { setContainerColor };
