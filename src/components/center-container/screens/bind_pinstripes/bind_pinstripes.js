import { setContainerColor } from "../container/container";
import {
  onHoverElement, outHoverElement, getAllDetailsByDataId,
} from "../../../functions";

function addPinstripesHover() {
  const constructor = document.querySelector(".constructor__item.binding_pinstripes [data-id=\"pinstripes\"]");
  const shemaItems = constructor.querySelectorAll(".schema__element.active");
  shemaItems.forEach((item) => {
    const dataId = item.getAttribute("data-id");
    const details = getAllDetailsByDataId(dataId);

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
  });
}

function switcherButtonsClick() {
  const switcherButtons = document.querySelectorAll(".position__pb-switch button");
  switcherButtons.forEach((button, ind) => {
    button.addEventListener("click", () => {
      for (let i = 0; i < switcherButtons.length; i += 1) {
        if (i === ind) switcherButtons[i].classList.toggle("active");
        else switcherButtons[i].classList.remove("active");
      }

      // если активна кнопка Окантовки, доступен выбор цвета к окантовке
      const bindingAll = document.querySelectorAll(".constructor__item.binding_pinstripes [data-id=\"binding\"]");
      if (switcherButtons[1].classList.contains("active")) {
        bindingAll.forEach((binding) => {
          binding.classList.remove("no-active");
          binding.classList.add("active");
        });
      } else {
        bindingAll.forEach((binding) => {
          binding.classList.remove("active");
          binding.classList.add("no-active");
        });
      }

      // если активна кнопка Лучи, доступна покраска лучей
      const pinstripesAll = document.querySelectorAll(".constructor__item.binding_pinstripes [data-id=\"pinstripes\"]");
      if (switcherButtons[0].classList.contains("active")) {
        pinstripesAll.forEach((pinstripes) => {
          pinstripes.classList.remove("no-active");
          pinstripes.classList.add("active");
          const pins = pinstripes.querySelectorAll(".schema__element");
          pins.forEach((pin) => {
            pin.classList.remove("no-active");
            pin.classList.add("active");
            pin.addEventListener("click", () => {
              const dataId = pin.getAttribute("data-id");
              const allPinsOnAllScreens = document.querySelectorAll(`.schema__element[data-id="${dataId}"]`);
              setContainerColor(allPinsOnAllScreens, dataId);
            });
          });
        });
        addPinstripesHover();
      } else {
        pinstripesAll.forEach((pinstripes) => {
          pinstripes.classList.remove("active");
          pinstripes.classList.add("no-active");
          const pins = pinstripes.querySelectorAll(".schema__element");
          pins.forEach((pin) => {
            pin.classList.remove("active");
            pin.classList.add("no-active");
          });
        });
      }
    });
  });
}

export default function getBindingPinstripesElements() {
  const bpScreen = document.querySelector(".constructor__item.binding_pinstripes");
  // добавляем в id камуфляжных текстур отличительный идентификатор binding_pinstripes,
  // чтобы id были уникальные на всех экаранах и к деталям применялся камуфляж,
  // прописанный в стилях
  const schemas = bpScreen.querySelectorAll(".constructor__schema--img");
  schemas.forEach((schema) => {
    const patterns = schema.querySelectorAll("pattern");
    patterns.forEach((pattern) => {
      pattern.setAttribute("id", `${pattern.getAttribute("id")}-binding_pinstripes`);
    });
  });

  switcherButtonsClick();
}
