/* eslint-disable no-param-reassign */
import tabsClick from "./left-container/tabs-item";
import posClick from "./center-container/pos-item";
import getContainerElements from "./center-container/screens/container/container";
import splitButtonsClick from "./center-container/split-buttons";
import { navigationButtonsClick } from "./center-container/nav-buttons";
import getHarnessElements from "./center-container/screens/harness/harness";
import getBindingPinstripesElements from "./center-container/screens/bind_pinstripes/bind_pinstripes";
import getLogosElements from "./center-container/screens/logos/logos";
import getTooltipColor from "./center-container/screens/options/options";
import json from "./center-container/info.json";
import { addCalcBlock, checkAddedOption } from "./right-container/calculator";
import { specOptionsInit } from "./center-container/screens/options/spec-options";
import { specialPreviewFunc, openPreviewScreen } from "./center-container/screens/preview/preview";
import { getColorInfo } from "./color-info/color-info";
import { saveColoring } from "./save-coloring/save-coloring";
// import saveOrders from "./save-orders/save-orders";

const form = document.querySelector(".form-constructor");
const priceList = json[3].parts[0];

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
  const invoisList = document.querySelector(".calc-panel__invoice");
  items.forEach((item) => {
    const title = item.className.split(" ")[1];
    const rowCheks = item.querySelectorAll(".constructor__data-row-checks");
    rowCheks.forEach((row) => {
      const val = row.getAttribute("data-val");
      let text;

      const labels = row.querySelectorAll(".data-row__label");
      labels.forEach((label) => {
        label.addEventListener("click", () => {
          const rowChecks = label.parentElement.parentElement;
          const select = rowChecks.getAttribute("select");
          const ipts = rowChecks.querySelectorAll("input");
          const checkedInput = label.previousSibling;
          text = label.textContent;
          const [name, price] = text.split("$");
          const formItem = form.querySelector(`.${title}[data-target="${val}"]`);

          checkedInput.addEventListener("change", () => {
            switch (select) {
              case "solo": {
                let countCheckbox = 0;
                const dataText = checkedInput.getAttribute("data-text");
                if (dataText !== "choose_color") {
                  ipts.forEach((input, ind) => {
                    if (ind === ipts.length - 1 && ind > 2) {
                      countCheckbox += 1;
                    } else input.checked = false;
                  });
                  checkedInput.checked = true;
                } else if (checkedInput.parentElement.parentElement.getAttribute("data-val") === "cutaway_handle") {
                  ipts.forEach((input) => {
                    input.checked = false;
                  });
                  checkedInput.checked = true;
                }

                // флаг для опций раздела Main deployment, где выбирается одновременно опция и цвет
                let flagColorOpt = false;
                if (dataText === "choose_color" && checkedInput.parentElement.parentElement.getAttribute("data-val") !== "cutaway_handle") {
                  flagColorOpt = true;
                }

                if (!flagColorOpt) {
                  formItem.setAttribute("value", checkedInput.getAttribute("data-text"));
                  formItem.setAttribute("data-lang", checkedInput.getAttribute("data-text"));
                }
                if (price !== undefined) {
                  if (!flagColorOpt) formItem.textContent = `${name}($)`;
                  if (checkedInput.getAttribute("type") !== "radio" && !checkedInput.checked) {
                    checkAddedOption(invoisList, select, val, price, name, true);
                  } else addCalcBlock(invoisList, val, price, name, select);
                } else {
                  if (!flagColorOpt) formItem.textContent = text.replace("Standart", "");
                  if (countCheckbox > 0) {
                    checkAddedOption(invoisList, select, val, price, name, false);
                  } else {
                    checkAddedOption(invoisList, select, val, price, name, true);
                  }
                }

                break;
              }
              case "multi": {
                // если multy выбор
                let formValue = "";
                let formText = "";
                const br = "<br>";
                let count = 0;
                ipts.forEach((input) => {
                  const subtitle = input.nextElementSibling.querySelector(".data-row__name").textContent;
                  if (input.checked) {
                    formValue += `${input.getAttribute("data-text")}+`;
                    formText += `${subtitle}($)${br}`;
                    count += 1;
                  }
                });
                if (count === 0) formValue = "NULL ";
                formItem.setAttribute("value", formValue.substring(0, formValue.length - 1));
                formItem.setAttribute("data-lang", formValue.substring(0, formValue.length - 1));
                formItem.textContent = formText.substring(0, formText.length - br.length);

                const subtitle = label.querySelector(".data-row__name").textContent;
                if (checkedInput.checked) {
                  addCalcBlock(invoisList, val, price, subtitle, select);
                } else checkAddedOption(invoisList, select, val, price, subtitle, true);
                break;
              }
              case "add": {
                // если опцию можно выбрать, а можно и не выбирать
                if (ipts.length > 1) {
                  if (checkedInput.checked) {
                    ipts.forEach((input) => {
                      input.checked = false;
                    });
                    checkedInput.checked = true;
                  }
                }
                if (checkedInput.checked) {
                  formItem.setAttribute("value", checkedInput.getAttribute("data-text"));
                  formItem.setAttribute("data-lang", checkedInput.getAttribute("data-text"));
                  formItem.textContent = text;
                  if (price !== undefined) {
                    formItem.textContent = `${name}($)`;
                    addCalcBlock(invoisList, val, price, name, select);
                  } else {
                    formItem.textContent = text;
                    checkAddedOption(invoisList, select, val, price, name);
                  }
                } else {
                  formItem.setAttribute("value", "NULL");
                  formItem.textContent = "";
                  checkAddedOption(invoisList, select, val, price, name, true);
                }
                break;
              }
              default: break;
            }
          });
        });
      });
    });
  });
}

// расставляем цены на опции, которые не входят в лист Опции
function setAddPrice() {
  Object.keys(priceList).forEach((option) => {
    const spans = document.querySelectorAll(`span[data-id="${option}"]`);
    spans.forEach((span) => {
      if (span) span.textContent = priceList[option];
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

function isValid(type, str) {
  if (/^\s*$/.test(str)) return false;
  let reg;
  switch (type) {
    case "tel": {
      reg = /^(\+)?(\(\d{2,3}\) ?\d|\d)(([ -]?\d)|( ?\(\d{2,3}\) ?)){5,12}\d$/;
      break;
    }
    case "email": reg = /^\S+@\S+\.\S+$/; break;
    case "number": reg = /^[0-9]$/; break;
    default: return true;
  }
  return reg.test(str);
}

export default function funcInit() {
  getContainerElements();
  splitButtonsClick();
  getHarnessElements();
  getBindingPinstripesElements();
  getLogosElements();
  tabsClick();
  posClick();
  navigationButtonsClick();
  getTooltipColor();
  clearAll();
  getInputValue();
  getCheksValue();
  setAddPrice();
  specOptionsInit();
  openPreviewScreen();
  specialPreviewFunc();
  getColorInfo();
  saveColoring();
  // Temp
  // saveOrders();
}

export {
  onHoverElement,
  outHoverElement,
  getAllDetailsByDataId,
  handlerClickDetails,
  toCapitalizedCase,
  isValid,
};
