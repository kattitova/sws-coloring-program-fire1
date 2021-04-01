import { onHoverElement, outHoverElement } from "../../../functions";
import create from "../../../create";

const form = document.querySelector(".form-constructor");

// применение цвета к подвесной системе по клику на детали
// запись цвета подвесной в общую форму
function setHarnessColor() {
  const color = localStorage.getItem("color");
  if (color !== null) {
    for (let i = 14; i < 18; i += 3) {
      const formItem = form.querySelector(`[data-target="area-${i}"]`);
      formItem.setAttribute("value", color);
      formItem.textContent = color;
    }
    const arrDetails = document.querySelectorAll("[data-id=\"harness\"] path");
    arrDetails.forEach((det) => {
      det.setAttribute("data-color", color);
    });
  }
}

// функция обработки кликов по кнопки Clear All
function addClear() {
  const harnessScreen = document.querySelector(".right-container__template-panel.container");

  function handlerClick(color) {
    for (let i = 14; i < 18; i += 3) {
      const formItem = form.querySelector(`[data-target="area-${i}"]`);
      formItem.setAttribute("value", color);
      formItem.textContent = color;
    }
    const arrDetails = document.querySelectorAll("[data-id=\"harness\"] path");
    arrDetails.forEach((det) => {
      det.setAttribute("data-color", color);
    });
  }

  const buttonClear = harnessScreen.querySelector(".template-panel__button-clear");
  buttonClear.addEventListener("click", () => {
    handlerClick("NULL");
  });
}

// функция навешивает события на пункты листа Schematics (hover, click)
function shematicsItemEvents(container, harness) {
  const shematicsItems = container.querySelectorAll(".schematics__list-item");
  shematicsItems.forEach((item) => {
    item.addEventListener("mouseover", () => {
      onHoverElement(harness);
    });

    item.addEventListener("mouseout", () => {
      outHoverElement(harness);
    });

    item.addEventListener("click", () => {
      setHarnessColor();
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
        for (let i = 14; i < 18; i += 3) {
          const detailInfo = create("div", "info-item");
          detailInfo.setAttribute("data-id", `area-${i}`);
          detailInfo.textContent = i;
          infoContainer.appendChild(detailInfo);
        }
      } else infoContainer.innerHTML = "";
    });
  });
}

export default function getHarnessElements() {
  const harnessScreen = document.querySelector(".constructor__item.harness");
  const harness = harnessScreen.querySelector(".schema__element[data-id = 'harness'");

  const backElem = harnessScreen.querySelectorAll(".schema__element");
  backElem.forEach((elem) => {
    const dataId = elem.getAttribute("data-id");
    if (dataId !== "harness") elem.classList.add("no-active");
    else {
      elem.classList.remove("no-active");

      elem.addEventListener("click", () => {
        setHarnessColor();
      });
    }
  });

  // добавляем в id камуфляжных текстур отличительный идентификатор harness,
  // чтобы id были уникальные на всех экаранах и к деталям применялся камуфляж,
  // прописанный в стилях
  const schema = harnessScreen.querySelector(".constructor__schema--img");
  const patterns = schema.querySelectorAll("pattern");
  patterns.forEach((pattern) => {
    pattern.setAttribute("id", `${pattern.getAttribute("id")}-harness`);
  });

  shematicsItemEvents(harnessScreen, harness);
  schematicsTitleEvents(harnessScreen, harness);
  addClear();
}
