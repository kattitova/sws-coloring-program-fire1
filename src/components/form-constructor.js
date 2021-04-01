// этот модуль собирает форму со всеми данными программы,
// чтобы в дальнейшем использовать ее для отправки и получения данных
// при сохранении, оформлении заказа, и загрузке кода
import create from "./create";
import { detailNames } from "./center-container/center-container";

function createFormInput(form, arr, name, target) {
  const input = create("input", ...arr);
  input.setAttribute("name", name);
  input.setAttribute("data-target", target);
  input.setAttribute("type", "hidden");
  input.setAttribute("value", "NULL");
  form.appendChild(input);
}

// поля для хранения выбранных цветов
function getDetailColors(form) {
  let symb;
  for (let i = 1; i < detailNames.length; i += 1) {
    if (i === 2) symb = 97;
    if (i === 6) symb = 100;

    if (i < 14) {
      if (i === 2 || i === 6) {
        for (let j = symb; j < symb + 3; j += 1) {
          createFormInput(form, ["preview-value", "color"], `Color/Container/${i}${String.fromCharCode(j)}`, `area-${i}${String.fromCharCode(j)}`);
        }
      }
      createFormInput(form, ["preview-value", "color"], `Color/Container/${i}`, `area-${i}`);
    } else createFormInput(form, ["preview-value", "color"], `Color/Harness/${i}`, `area-${i}`);
  }
}

function getPinstrips(form) {
  createFormInput(form, ["preview-value", "bp"], "Color/Pinstripes-ab", "pinstripes-ab");
  createFormInput(form, ["preview-value", "bp"], "Color/Pinstripes-bc", "pinstripes-bc");
  createFormInput(form, ["preview-value", "bp"], "Color/Pinstripes-de", "pinstripes-de");
  createFormInput(form, ["preview-value", "bp"], "Color/Pinstripes-ef", "pinstripes-ef");
  createFormInput(form, ["preview-value", "bp"], "Color/Pinstripes-3", "pinstripes-3");
  createFormInput(form, ["preview-value", "bp"], "Color/Pinstripes-9", "pinstripes-9");
}

function getBinding(form) {
  createFormInput(form, ["preview-value", "bp"], "Color/Binding", "binding");
}

function getSplitButton(form) {
  for (let i = 2; i < 7; i += 4) {
    createFormInput(form, ["split", `split-design-${i}`], `Split-Design-${i}`, `split-design-${i}`);
  }
}

export default function getFormConstructor() {
  const form = document.querySelector(".form-constructor");
  getDetailColors(form);
  getPinstrips(form);
  getBinding(form);
  getSplitButton(form);
}
