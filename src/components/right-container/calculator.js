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

// функция проверки добавлена уже опция или нет
function checkAddedOption(select, title, value, subtitle, remote) {
  console.log(select, title, value, subtitle, remote);
  const calcBlocks = document.querySelectorAll(".invoice__calc-block");
  let flag = true;
  // if (select === "solo" || select === "add") {
  calcBlocks.forEach((block) => {
    const option = block.querySelector(".calc-block__title");
    if (option.getAttribute("data-name") === title) {
      flag = false;
      // доп проверкa subtitle
      if (value !== undefined) {
        const sub = option.querySelector("b");
        const newSub = subtitle.toLowerCase().replace(/[ +,-][_]*/g, "_").replace(/_{1,}/g, "_");
        // не работает, нужна другая логика для мульти
        if (select === "multi") {
          if (sub.getAttribute("data-lang") !== newSub) {
            flag = true;
            // calcBlocks.forEach((item) => {
            //   const subPrev = item.querySelector("b");
            //   if (subPrev === sub) flag = false;
            // });
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
  });
  // }
  setTimeout(sumTotal, 500);
  return flag;
}

// функцция добавляет новую строку опции в панель Счета
function addCalcBlock(parrent, title, value, subtitle, select) {
  const check = checkAddedOption(select, title, value, subtitle);
  if (title === "Fire" || check) {
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
export {
  addCalcBlock,
  checkAddedOption,
};
