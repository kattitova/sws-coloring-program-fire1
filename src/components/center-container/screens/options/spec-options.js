// обработка отдельной логики опций
import * as Calc from "../../../right-container/calculator";
import json from "../../info.json";

const priceList = json[3].parts[0];

// 1.Выбор черного или стального металла => изменение стоимости опции 4Rings
function changeMetal() {
  const metals = document.querySelectorAll(".constructor__data-row-checks[data-val=\"metal\"] input");
  metals.forEach((metal) => {
    const { id } = metal;
    metal.addEventListener("change", () => {
      const opt4rings = document.querySelector(".data-row__label[for=\"harness_type-4rings\"] .data-row__price");
      let optCost;
      if (id === "metal-black" || id === "metal-ss") {
        optCost = priceList[`4rings_${id.split("-")[1]}`];
      }
      if (id === "metal-cad") {
        // eslint-disable-next-line prefer-destructuring
        optCost = json[2].parts[0]["check-box"][2].price[1];
      }
      opt4rings.textContent = optCost;

      const calcPos = document.querySelector(".calc-block__title[data-name=\"harness_type\"]");
      if (calcPos) {
        const subtitle = calcPos.querySelector("b[data-lang=\"4rings\"]");
        if (subtitle) {
          calcPos.nextElementSibling.textContent = optCost.replace("$", "");
        }
      }
    });
  });
}

const getPartsPrice = (options, name) => {
  const mainParts = options.querySelector(`.constructor__data-row-checks[data-val="${name}"] label`);
  const mainPartsPriceTxt = mainParts.querySelector(".data-row__price");
  return parseInt(mainPartsPriceTxt.textContent.replace("$", ""), 10);
};

const setPartsPrice = (options, calc, newPrice, name) => {
  const mainParts = options.querySelector(`.constructor__data-row-checks[data-val="${name}"] label`);
  const mainPartsPriceTxt = mainParts.querySelector(".data-row__price");
  mainPartsPriceTxt.textContent = `$${newPrice}`;
  const mainPartsCalc = calc.querySelector(`[data-name="${name}"]`);
  if (mainPartsCalc) {
    mainPartsCalc.nextElementSibling.textContent = newPrice;
  }
};

// 2. Изменение стоимости комплекта запасных частей ОП в зависимости от выбранных опций:
// свуп СК, камера LazyBag, цвет медузы ОП
// изменения вносятся как в стоимость самой опции, так и в панель калькуляции, если опция выбрана
function MainPartsChangePrice() {
  const name = "main_parts_kit";
  const calc = document.querySelector(".calc-panel__invoice");
  const options = document.querySelector(".options-wrapper");
  const swoopOptions = options.querySelectorAll(".constructor__data-row-checks[data-val=\"swoop_options\"] input");
  let newPrice;
  let mainPartsPrice;
  let price;
  // обработка свуп СК
  swoopOptions.forEach((opt) => {
    opt.addEventListener("change", () => {
      mainPartsPrice = getPartsPrice(options, name);
      price = opt.nextElementSibling.querySelector(".data-row__price").textContent.replace("$", "");
      if (opt.checked) {
        newPrice = mainPartsPrice + parseInt(price, 10);
      } else {
        newPrice = mainPartsPrice - parseInt(price, 10);
      }
      setPartsPrice(options, calc, newPrice, name);
    });
  });

  // обработка LazyBag
  const mainDbag = options.querySelectorAll(".constructor__data-row-checks[data-val=\"main_dbag\"] input");
  let flagMainDbag = false;
  mainDbag.forEach((opt) => {
    opt.addEventListener("change", () => {
      price = options.querySelector("label[for=\"main_dbag-lazy_bag\"] .data-row__price").textContent.replace("$", "");
      const data = opt.getAttribute("data-text");
      mainPartsPrice = getPartsPrice(options, name);
      if (data === "lazy_bag") {
        newPrice = mainPartsPrice + parseInt(price, 10);
        flagMainDbag = true;
      } else if (flagMainDbag) {
        newPrice = mainPartsPrice - parseInt(price, 10);
      }
      setPartsPrice(options, calc, newPrice, name);
    });
  });

  // обработка цвета медузы ОП
  const mainPcColor = options.querySelector("input[id=\"main_pc-choose_color\"]");
  let flagMainPcColor = false;
  mainPcColor.addEventListener("click", () => {
    let globalFlag = true;
    const palette = document.querySelector(".opitons__colors.main_pc");
    const colors = palette.querySelectorAll(".pick-block__colors button");
    price = options.querySelector("label[for=\"main_pc-choose_color\"] .data-row__price").textContent.replace("$", "");
    mainPartsPrice = getPartsPrice(options, name);
    colors.forEach((color) => {
      color.addEventListener("click", () => {
        if (globalFlag) {
          const data = color.getAttribute("data-color");
          if (data !== "def") {
            if (!flagMainPcColor) {
              newPrice = mainPartsPrice + parseInt(price, 10);
              flagMainPcColor = true;
            } else newPrice = mainPartsPrice;
          } else if (flagMainPcColor) {
            newPrice = mainPartsPrice - parseInt(price, 10);
            flagMainPcColor = false;
          }
          setPartsPrice(options, calc, newPrice, name);
          setTimeout(Calc.sumTotal, 500);
          globalFlag = false;
        }
      });
    });
  });
}
// -------------------

// 4. Изменение стоимости комплекта запасных частей ЗП в зависимости от выбранных опций:
// цвет подушки отцепки, подушка запаски
// изменения вносятся как в стоимость самой опции, так и в панель калькуляции, если опция выбрана
function ReservePartsChangePrice() {
  const name = "reserve_parts_kit";
  const calc = document.querySelector(".calc-panel__invoice");
  const options = document.querySelector(".options-wrapper");
  let price;
  let mainPartsPrice;
  let newPrice;

  function func(val, color, standart) {
    const flag = {
      cutaway_handle: false,
      reserve_handle: false,
    };
    const item = options.querySelector(`.constructor__data-row-checks[data-val="${val}"]`);
    const inputs = item.querySelectorAll("input");
    inputs.forEach((inp) => {
      inp.addEventListener("change", () => {
        price = options.querySelector("label[for=\"main_pc-choose_color\"] .data-row__price").textContent.replace("$", "");
        mainPartsPrice = getPartsPrice(options, name);
        const data = inp.getAttribute("data-text");
        switch (data) {
          case color:
            if (!flag[val]) {
              newPrice = mainPartsPrice + parseInt(price, 10);
              flag[val] = true;
            } else newPrice = mainPartsPrice;
            break;
          case standart:
            if (flag[val]) {
              newPrice = mainPartsPrice - parseInt(price, 10);
              flag[val] = false;
            }
            break;
          default: break;
        }
        setPartsPrice(options, calc, newPrice, name);
        setTimeout(Calc.sumTotal, 500);
      });
    });
  }

  // обработка цвета подушки отцепки
  func("cutaway_handle", "choose_color", "red");
  // обработка цвета подушки запаски
  func("reserve_handle", "soft_handle", "d_ring");
}
// -----------------

// 5. добавление в панель калькуляции опций Split Design, Pinstripes, если они выбраны
function addSwitchOptionsToCalc() {
  const calc = document.querySelector(".calc-panel__invoice");

  function func(arr, title, price) {
    arr.forEach((button) => {
      button.addEventListener("click", () => {
        let activeBut = 0;
        arr.forEach((but) => {
          if (but.classList.contains("active")) activeBut += 1;
        });
        if (activeBut > 0) Calc.addCalcBlock(calc, title, price, "", "solo");
        else Calc.removeBlock(title, "");
      });
    });
  }

  const split = document.querySelector(".panel__split-switch");
  const splitButtons = split.querySelectorAll("button");
  const priceSplit = split.querySelector("[data-id=\"split_design\"]").textContent.replace("$", "");
  func(splitButtons, "split_design", priceSplit);

  const pintripes = document.querySelector(".position__pb-switch");
  const pintripesButtons = pintripes.querySelectorAll("[data-target=\"pinstripes\"]");
  const pricePin = pintripes.querySelector("[data-id=\"pinstripes\"]").textContent.replace("$", "");
  func(pintripesButtons, "pinstripes", pricePin);
}
//------------------

function checkCamo(form) {
  const details = form.querySelectorAll(".preview-value.color");
  let camoFlag = false;
  details.forEach((det) => {
    const color = det.value.toLowerCase();
    if (color.includes("cam")) camoFlag = true;
  });
  return camoFlag;
}

function checkOptionsCamo(form) {
  const camoFlag = checkCamo(form);
  if (!camoFlag) {
    const options = form.querySelectorAll(".preview-value.options");
    let camoSubFlag = false;
    options.forEach((opt) => {
      const target = opt.getAttribute("data-target");
      if (target === "cutaway_handle" || target === "reserve_handle") {
        if (opt.value.toLowerCase().includes("cam")) {
          camoSubFlag = true;
        }
      }
    });

    if (!camoSubFlag) {
      Calc.removeBlock("camo_pattern", "");
      Calc.sumTotal();
    }
  }
}

// 6. Добавление в панель калькуляции опции Камуфляж, если она выбрана
function addCamoToCalc() {
  const form = document.querySelector(".form-constructor");
  const calc = document.querySelector(".calc-panel__invoice");
  const price = document.querySelector(".colors-palette__camo-block span[data-id=\"camo\"]").textContent.replace("$", "");
  function func() {
    const camoFlag = checkCamo(form);
    if (camoFlag) Calc.addCalcBlock(calc, "camo_pattern", price, "", "solo");
    else {
      Calc.removeBlock("camo_pattern", "");
      Calc.sumTotal();
    }
  }

  const optionsTab = document.querySelector(".tabs-list__tabs-item.options");
  optionsTab.addEventListener("click", () => {
    func();
  });

  const previewButton = document.querySelector(".main-buttons__preview");
  previewButton.addEventListener("click", () => {
    func();
  });

  const colors = document.querySelectorAll(".opitons__colors button");
  colors.forEach((color) => {
    color.addEventListener("click", () => {
      const data = color.getAttribute("data-color");
      // если выбран в палитре цветов Опций камуфляж
      if (data.toLowerCase().includes("cam")) {
        Calc.addCalcBlock(calc, "camo_pattern", price, "", "solo");
      } else { // если в палитре цветов Опций выбран НЕ камуфляж
        checkOptionsCamo(form);
      }
    });
  });

  const cutawayRed = document.querySelector(".constructor__data-check input[data-text=\"red\"]");
  cutawayRed.addEventListener("change", () => {
    setTimeout(() => {
      checkOptionsCamo(form);
    }, 500);
  });

  const dRing = document.querySelector(".constructor__data-check input[data-text=\"d_ring\"]");
  dRing.addEventListener("change", () => {
    setTimeout(() => {
      checkOptionsCamo(form);
    }, 500);
  });
}

function specOptionsInit() {
  changeMetal();
  MainPartsChangePrice();
  ReservePartsChangePrice();
  addSwitchOptionsToCalc();
  addCamoToCalc();
}

export {
  specOptionsInit,
};
