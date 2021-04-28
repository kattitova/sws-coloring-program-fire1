import tabsClick from "./left-container/tabs-item";
import posClick from "./center-container/pos-item";
import getContainerElements from "./center-container/screens/container/container";
import splitButtonsClick from "./center-container/split-buttons";
import getHarnessElements from "./center-container/screens/harness/harness";
import getBindingPinstripesElements from "./center-container/screens/bind_pinstripes/bind_pinstripes";
import getLogosElements from "./center-container/screens/logos/logos";

const form = document.querySelector(".form-constructor");

// применение цвета или очистка к подвесной
function handlerClickHarness(color) {
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

// применение цвета или очистка к деталям ранца
function handlerClickDetails(color) {
  const screens = document.querySelectorAll(".constructor__schema");
  screens.forEach((screen) => {
    const details = screen.querySelectorAll("path");
    details.forEach((item) => {
      const id = item.getAttribute("data-id");
      if (id !== null && id.indexOf("pinstripes") === -1) {
        item.setAttribute("data-color", color);
        const formItem = form.querySelector(`[data-target="${id}"]`);
        formItem.setAttribute("value", color);
        formItem.textContent = color;
      }
    });
  });
}

// сбравывает кнопки Окантовка и Лучи в неактивное положение
// сбрасывает цвета окантовки и лучей
function handlerClickBP() {
  // сброс активности кнопок включателей лучей и окантовки
  const switcherButtons = document.querySelectorAll(".position__pb-switch button");
  switcherButtons.forEach((but) => {
    if (but.classList.contains("active")) but.click();
  });

  // сброс цветов лучей
  const pinstripesAll = document.querySelectorAll(".constructor__item [data-id=\"pinstripes\"]");
  pinstripesAll.forEach((pinstripes) => {
    const pins = pinstripes.querySelectorAll(".schema__element");
    pins.forEach((pin) => {
      pin.setAttribute("data-color", "NULL");
      const dataId = pin.getAttribute("data-id");
      const formItem = form.querySelector(`[data-target="${dataId}"]`);
      formItem.setAttribute("value", "NULL");
      formItem.textContent = "NULL";
    });
  });

  // сброс цвета окантовки
  const bindingAll = document.querySelectorAll(".constructor__item [data-id=\"binding\"]");
  bindingAll.forEach((binding) => {
    const pathAll = binding.querySelectorAll("path");
    pathAll.forEach((path) => {
      path.setAttribute("data-color", "NULL");
    });
  });
  const formItem = form.querySelector("[data-target=\"binding\"]");
  formItem.setAttribute("value", "NULL");
  formItem.textContent = "NULL";
}

// функция обработки кликов по кнопки Clear All
// в зависимости от того, на каком экране она нажата
function clearAll() {
  const buttonClear = document.querySelector(".template-panel__button-clear");
  buttonClear.addEventListener("click", () => {
    const cls = buttonClear.className.split(" ");
    switch (cls[1]) {
      case "container":
        handlerClickDetails("NULL");
        break;
      case "harness":
        handlerClickHarness("NULL");
        break;
      case "binding_pinstripes":
        handlerClickBP();
        break;
      default: break;
    }
  });
}

// передаем информацию из input-ов на страницах Info, Sizes в Form-constructor
function getInputValue() {
  const inputs = document.querySelectorAll(".data-row__input");
  inputs.forEach((inp) => {
    const val = inp.getAttribute("data-val");
    const formItem = form.querySelector(`[data-target="${val}"]`);
    inp.addEventListener("input", (e) => {
      formItem.setAttribute("value", e.target.value);
      formItem.textContent = e.target.value;
    });
  });

  // Передаем информацию из поля Специальные инструкции в Form-constructor
  const textarea = document.querySelector(".data-row__textarea");
  textarea.addEventListener("input", (e) => {
    const val = textarea.getAttribute("data-val");
    const formItem = form.querySelector(`[data-target="${val}"]`);
    formItem.setAttribute("value", e.target.value);
    formItem.textContent = e.target.value;
  });

  // вешаем на кнопку Choose a dealer страница Info
  // открытие модального окна с выбором дилеров
  const findDealerLink = document.querySelector("[data-val=\"choose_a_dealer\"]");
  findDealerLink.addEventListener("click", () => {
    const modal = document.querySelector(".modal-dealer");
    modal.classList.toggle("open");
  });

  // очистка инпута Дилер по клику на кнопку Х
  const button = document.querySelector(".data-row__clear-button");
  button.addEventListener(("click"), () => {
    const input = document.querySelector(".data-row__input[data-val=\"dealer\"]");
    input.textContent = "";
    input.value = "";
    const formInput = document.querySelector(".preview-value[data-target=\"dealer\"]");
    formInput.textContent = "";
    formInput.value = "NULL";
  });
}

// передаем информацию из checkbox-ов в Form-constructor
// проверка checkbox-ов на мульти/соло выбор
function getCheksValue() {
  const items = document.querySelectorAll(".constructor__item");
  items.forEach((item) => {
    const title = item.className.split(" ")[1];
    const rowCheks = item.querySelectorAll(".constructor__data-row-checks");
    rowCheks.forEach((row) => {
      const val = row.getAttribute("data-val");
      let text;
      row.addEventListener("click", (e) => {
        const select = row.getAttribute("select");
        const ipts = row.querySelectorAll("input");
        const { id } = e.target;
        if (e.target.textContent !== "") text = e.target.textContent;
        const formItem = form.querySelector(`.${title}[data-target="${val}"]`);
        switch (select) {
          case "solo": {
            ipts.forEach((input) => {
            // eslint-disable-next-line no-param-reassign
              input.checked = false;
            });
            e.target.checked = true;

            if (id !== "") {
              formItem.setAttribute("value", e.target.getAttribute("data-text"));
              formItem.textContent = text;
            }
            break;
          }
          case "multi": {
          // если multy выбор
            let formValue = "";
            let formText = "";
            const br = "<br>";
            if (id !== "") {
              ipts.forEach((input) => {
                if (input.checked) {
                  formValue += `${input.getAttribute("data-text")}+`;
                  const label = input.nextElementSibling.querySelector(".data-row__name").textContent;
                  formText += `${label}${br}`;
                }
              });
              formItem.setAttribute("value", formValue.substring(0, formValue.length - 1));
              formItem.textContent = formText.substring(0, formText.length - br.length);
            }
            break;
          }
          case "add": {
          // если опцию можно выбрать, а можно и не выбирать
            if (ipts.length > 1) {
              if (e.target.checked) {
                ipts.forEach((input) => {
                  // eslint-disable-next-line no-param-reassign
                  input.checked = false;
                });
                e.target.checked = true;
              }
            }
            if (id !== "") {
              if (e.target.checked) {
                formItem.setAttribute("value", e.target.getAttribute("data-text"));
                formItem.textContent = text;
              } else {
                formItem.setAttribute("value", "NULL");
                formItem.textContent = e.target.getAttribute("");
              }
            }
            break;
          }
          default: break;
        }
      });
    });
  });
}

function onHoverElement(elem) {
  elem.classList.add("hover");
}

function outHoverElement(elem) {
  elem.classList.remove("hover");
}

function getAllDetailsByDataId(id) {
  return document.querySelectorAll(`.schema__element[data-id="${id}"]`);
}

function toCapitalizedCase(str) {
  return `${str[0].toUpperCase()}${str.slice(1)}`;
}

export default function funcInit() {
  tabsClick();
  posClick();
  getContainerElements();
  splitButtonsClick();
  getHarnessElements();
  getBindingPinstripesElements();
  getLogosElements();
  clearAll();
  getInputValue();
  getCheksValue();
}

export {
  onHoverElement,
  outHoverElement,
  getAllDetailsByDataId,
  handlerClickDetails,
  toCapitalizedCase,
};
