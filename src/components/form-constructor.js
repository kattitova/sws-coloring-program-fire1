// этот модуль собирает форму со всеми данными программы,
// чтобы в дальнейшем использовать ее для отправки и получения данных
// при сохранении, оформлении заказа, и загрузке кода
import create from "./create";
import { detailNames } from "./center-container/center-container";
import { toCapitalizedCase } from "./functions";

const form = document.querySelector(".form-constructor");

function createFormInput(arr, name, target) {
  const input = create("input", ...arr);
  input.setAttribute("name", name);
  input.setAttribute("data-target", target);
  input.setAttribute("type", "hidden");
  input.setAttribute("value", "NULL");
  form.appendChild(input);
}

// поля для хранения выбранных цветов
function getDetailColors() {
  let symb;
  for (let i = 1; i < detailNames.length; i += 1) {
    if (i === 2) symb = 97;
    if (i === 6) symb = 100;

    if (i < 14) {
      if (i === 2 || i === 6) {
        for (let j = symb; j < symb + 3; j += 1) {
          createFormInput(["preview-value", "color"], `Color/Container/${i}${String.fromCharCode(j)}`, `area-${i}${String.fromCharCode(j)}`);
        }
      }
      createFormInput(["preview-value", "color"], `Color/Container/${i}`, `area-${i}`);
    } else createFormInput(["preview-value", "color"], `Color/Harness/${i}`, `area-${i}`);
  }
}

function getPinstrips() {
  createFormInput(["preview-value", "bp"], "Color/Pinstripes-ab", "pinstripes-ab");
  createFormInput(["preview-value", "bp"], "Color/Pinstripes-bc", "pinstripes-bc");
  createFormInput(["preview-value", "bp"], "Color/Pinstripes-de", "pinstripes-de");
  createFormInput(["preview-value", "bp"], "Color/Pinstripes-ef", "pinstripes-ef");
  createFormInput(["preview-value", "bp"], "Color/Pinstripes-3", "pinstripes-3");
  createFormInput(["preview-value", "bp"], "Color/Pinstripes-9", "pinstripes-9");
}

function getBinding() {
  createFormInput(["preview-value", "bp"], "Color/Binding", "binding");
}

function getSplitButton() {
  for (let i = 2; i < 7; i += 4) {
    createFormInput(["split", `split-design-${i}`], `Split-Design-${i}`, `split-design-${i}`);
  }
}

function getInfoSizeOptionsInputs() {
  createFormInput(["preview-value", "info"], "Info/Dealer", "dealer");
  const infoPages = document.querySelectorAll(".constructor__data-block");
  infoPages.forEach((info) => {
    const lbs = info.querySelectorAll(".data-row__label");
    const pageName = info.parentElement.parentElement.className.split("-")[0];
    const title = info.className.split(" ")[1];
    lbs.forEach((label) => {
      if (label.parentElement.className !== "constructor__data-check") {
        const val = label.getAttribute("data-lang");
        const txt = label.textContent;
        if (pageName === "options") {
          createFormInput(["preview-value", pageName], `${toCapitalizedCase(title)}/${txt}`, val);
        } else {
          createFormInput(["preview-value", pageName], `${toCapitalizedCase(pageName)}/${txt}`, val);
        }
      }
    });
  });
  createFormInput(["preview-value", "options"], "Special Instructions/Text", "special_instructions");
}

export default function getFormConstructor() {
  getDetailColors();
  getPinstrips();
  getBinding();
  getSplitButton();
  getInfoSizeOptionsInputs();
}
