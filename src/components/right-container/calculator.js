/* eslint-disable no-param-reassign */
import create from "../create";
import json from "../center-container/info.json";
import { toCapitalizedCase } from "../functions";

function sumTotal() {
  const calcBlocks = document.querySelectorAll(".invoice__calc-block");
  const totalDiv = document.querySelector(".calc-panel__footer .footer__sum");
  if (totalDiv) {
    let total = 0;
    calcBlocks.forEach((block) => {
      const value = parseInt(block.querySelector(".calc-block__value").textContent, 10);
      total += value;
    });
    totalDiv.textContent = total;
  }
}

function addBlock(parrent, title, value, subtitle) {
  const calcBlock = create("div", "invoice__calc-block");

  const calcBlockTitle = create("div", "calc-block__title");
  calcBlockTitle.setAttribute("data-name", title.toLowerCase());
  const calcBlockTitleSpan = create("span");
  calcBlockTitleSpan.textContent = toCapitalizedCase(title).replaceAll("_", " ");
  calcBlockTitleSpan.setAttribute("data-lang", title);
  calcBlockTitle.appendChild(calcBlockTitleSpan);
  if (subtitle) {
    const calcBlockTitleB = create("b");
    calcBlockTitleB.textContent = subtitle;
    calcBlockTitleB.setAttribute("data-lang", subtitle.toLowerCase().replace(/[ +,-][_]*/g, "_").replace(/_{1,}/g, "_"));
    calcBlockTitle.appendChild(calcBlockTitleB);
  }
  calcBlock.appendChild(calcBlockTitle);

  const calcBlockValue = create("div", "calc-block__value");
  calcBlockValue.textContent = value;
  calcBlock.appendChild(calcBlockValue);

  parrent.append(calcBlock);
}

// функция проверки добавлена уже опция или нет
function checkAddedOption(parrent, select, title, value, subtitle, remote) {
  const calcBlocks = document.querySelectorAll(".invoice__calc-block");
  let flag = true;
  // if (select === "solo" || select === "add") {
  calcBlocks.forEach((block) => {
    const option = block.querySelector(".calc-block__title");
    const newSub = subtitle.toLowerCase().replace(/[ +,-][_]*/g, "_").replace(/_{1,}/g, "_");
    if (option.getAttribute("data-name") === title) {
      flag = false;
      // доп проверкa subtitle
      if (value !== undefined) {
        const sub = option.querySelector("b");
        // логика для мульти
        if (select === "multi") {
          if (sub.getAttribute("data-lang") !== newSub) {
            flag = true;
          } else if (remote) {
            block.remove();
          }
        } else if (sub.getAttribute("data-lang") !== newSub) {
          sub.textContent = subtitle;
          sub.setAttribute("data-lang", newSub);
          option.nextElementSibling.textContent = value;
        } else if (remote) block.remove();
      } else if (remote) block.remove();
    }

    // обработка отдельной логики опций
    // 1.Выбор черного или стального металла + опции 4 Кольца =>
    // изменение видимости опции Металл в панеле Калькулятора
    if (title === "metal" && value !== undefined) {
      const calcPos = document.querySelector(".calc-block__title[data-name=\"harness_type\"]");
      if (calcPos) {
        const calcPosSub = calcPos.querySelector("b[data-lang=\"4rings\"]");
        if (calcPosSub) flag = false;
      }
    }

    if (title === "harness_type" && value !== undefined) {
      // изменение видимости опции Металл в панеле Калькулятора
      const calcPos = document.querySelector(".calc-block__title[data-name=\"metal\"]");
      if (calcPos) {
        calcPos.parentElement.remove();
      }

      // изменение доступности опций Металл в списке опций при выборе подвесной Adjustable
      if (newSub === "adjustable") {
        const metals = document.querySelectorAll(".constructor__data-row-checks[data-val=\"metal\"] input");
        metals.forEach((metal) => {
          const { id } = metal;
          if (id === "metal-cad") {
            metal.checked = true;
          } else {
            metal.checked = false;
            metal.classList.add("disabled");
          }
        });
      }
    }
    if (title === "harness_type" && newSub !== "adjustable") {
      const metals = document.querySelectorAll(".constructor__data-row-checks[data-val=\"metal\"] input");
      metals.forEach((metal) => {
        metal.classList.remove("disabled");
      });
    }

    // при клике на опцию 2Кольца возврат в Калькуляцию строки с типом Металла, если он выбран
    if (title === "harness_type" && newSub.replace("standart", "") === "2rings") {
      let flagCheck = false;
      const blocks = document.querySelectorAll(".invoice__calc-block");
      blocks.forEach((item) => {
        const optionCheck = item.querySelector(".calc-block__title");
        if (optionCheck.getAttribute("data-name") === "metal") {
          flagCheck = true;
        }
      });
      if (!flagCheck) {
        const metals = document.querySelectorAll(".constructor__data-row-checks[data-val=\"metal\"] input");
        metals.forEach((metal) => {
          if (metal.checked && metal.id !== "metal-cad") {
            const label = metal.nextElementSibling;
            const name = label.querySelector(".data-row__name").textContent;
            const cost = label.querySelector(".data-row__price").textContent.replace("$", "");
            addBlock(parrent, "Metal", cost, name);
          }
        });
        flag = false;
      }
    }

    // при выборе варианта RSL (кроме No), устанавливать DRD в No
    if (title === "rsl" && newSub.replace("standart", "") !== "no") {
      const drd = document.querySelector(".data-row__label[for=\"drd-no\"]");
      drd.click();
    }

    // при выборе варианта DRD (кроме No), устанавливать RSL в No
    if (title === "drd" && newSub.replace("standart", "") !== "no") {
      const rsl = document.querySelector(".data-row__label[for=\"rsl-no\"]");
      rsl.click();
    }
  });
  setTimeout(sumTotal, 500);
  return flag;
}

// функцция добавляет новую строку опции в панель Счета
function addCalcBlock(parrent, title, value, subtitle, select) {
  const check = checkAddedOption(parrent, select, title, value, subtitle);
  if (title === "Fire" || check) {
    addBlock(parrent, title, value, subtitle);
  }
}

export default function getCalculatorPanel() {
  const calcPanel = create("div", "right-container__calc-panel");

  const calcTitle = create("div", "calc-panel__title");
  calcTitle.textContent = "calculation";
  calcTitle.setAttribute("data-lang", "calc");
  calcPanel.appendChild(calcTitle);

  const calcInvoice = create("div", "calc-panel__invoice");
  addCalcBlock(calcInvoice, "Fire", json[3].parts[0].fire.replace("$", ""));
  calcPanel.appendChild(calcInvoice);

  const calcFooter = create("div", "calc-panel__footer");

  const calcTotal = create("div", "footer__total");
  calcTotal.textContent = "Total $";
  calcTotal.setAttribute("data-lang", "total");
  calcFooter.appendChild(calcTotal);

  const calcSum = create("div", "footer__sum");
  calcSum.textContent = json[3].parts[0].fire.replace("$", "");
  calcFooter.appendChild(calcSum);

  calcPanel.appendChild(calcFooter);

  return calcPanel;
}

function removeBlock(title, subtitle) {
  const invoice = document.querySelector(".calc-panel__invoice");
  Array.from(invoice.children).forEach((block) => {
    const blockTitle = block.querySelector(".calc-block__title");
    if (blockTitle.getAttribute("data-name") === title) {
      const blockSubtitle = blockTitle.querySelector("b");
      if (blockSubtitle.getAttribute("data-lang") === subtitle) {
        block.remove();
      }
    }
  });
}

export {
  addCalcBlock,
  checkAddedOption,
  removeBlock,
};
