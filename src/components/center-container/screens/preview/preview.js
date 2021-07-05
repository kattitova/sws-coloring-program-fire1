/* eslint-disable no-param-reassign */
import create from "../../../create";
import getFront from "../container/container-front";
import getBack from "../container/container-back";

function getSchemeBlock() {
  const schemeBlock = create("div", ...["constructor__data-block", "schema"]);

  const schemaFront = create("div", ...["constructor__schema", "front"]);
  schemaFront.appendChild(getFront());
  schemeBlock.appendChild(schemaFront);

  const schemaBack = create("div", ...["constructor__schema", "back"]);
  schemaBack.appendChild(getBack());
  schemeBlock.appendChild(schemaBack);

  return schemeBlock;
}

function getPreviewScreen() {
  const previewScreen = create("div", "preview-wrapper");

  const previewTitle = create("div", "constructor__title");
  const arr = ["preview", "please fill required fiedls", "order form"];
  arr.forEach((item) => {
    const subTitle = create("div", "constructor__sub-title");
    subTitle.setAttribute("data-lang", item.replaceAll(" ", "_"));
    subTitle.textContent = item;
    previewTitle.appendChild(subTitle);
  });
  previewScreen.appendChild(previewTitle);

  const previewData = create("div", "constructor__data-wrapper");
  previewData.appendChild(getSchemeBlock());
  previewScreen.appendChild(previewData);

  return previewScreen;
}

function specialPreviewFunc() {
  // добавляем в id камуфляжных текстур отличительный идентификатор preview,
  // чтобы id были уникальные на всех экаранах и к деталям применялся камуфляж,
  // прописанный в стилях
  const previewScreen = document.querySelector(".constructor__item.preview");
  const allSchema = previewScreen.querySelectorAll(".constructor__schema--img");
  allSchema.forEach((schema) => {
    const patterns = schema.querySelectorAll("pattern");
    patterns.forEach((pattern) => {
      pattern.setAttribute("id", `${pattern.getAttribute("id")}-preview`);
    });
  });
}

function checkSplitDesign(form) {
  const allSplit = form.querySelectorAll(".split");
  const colorBlock = document.querySelector(".constructor__data-block.color");
  allSplit.forEach((split) => {
    const name = split.getAttribute("name");
    const num = name[name.length - 1];
    const allNumDetail = colorBlock.querySelectorAll(".preview-chain");
    if (split.value === "active") {
      allNumDetail.forEach((det) => {
        const target = det.getAttribute("data-target");
        if (target[5] === num) {
          if (target.length === 6) {
            det.classList.add("hidden");
            form.querySelector(`[data-target="${target}"]`).required = false;
          } else {
            det.classList.remove("hidden");
            form.querySelector(`[data-target="${target}"]`).required = true;
          }
        }
      });
    } else {
      allNumDetail.forEach((det) => {
        const target = det.getAttribute("data-target");
        if (target[5] === num) {
          if (target.length === 6) {
            det.classList.remove("hidden");
            form.querySelector(`[data-target="${target}"]`).required = true;
          } else {
            det.classList.add("hidden");
            form.querySelector(`[data-target="${target}"]`).required = false;
          }
        }
      });
    }
  });
}

function setRequiredFields(form) {
  const allInput = form.querySelectorAll("input");
  allInput.forEach((input) => {
    const part = input.className.split(" ")[1];
    const target = input.getAttribute("data-target");
    const name = input.getAttribute("name");
    switch (part) {
      case "color":
      case "sizes": {
        input.required = true;
        break;
      }
      case "bp":
        if (target === "binding") input.required = true;
        break;
      case "logo":
        if (input.value !== "NULL") input.required = true;
        else input.required = false;
        break;
      case "information":
        if (target !== "dealer") input.required = true;
        break;
      case "options":
        if (target !== "swoop_options" && !name.includes("Additional_options") && !name.includes("Special_Instructions")) {
          input.required = true;
        }
        break;
      default: break;
    }
  });
  checkSplitDesign(form);
}

function getPreviewInfo(form) {
  const constructor = document.querySelector(".constructor__item.preview");
  const wrapper = constructor.querySelector(".constructor__data-wrapper");
  const allBlocks = wrapper.querySelectorAll(".constructor__data-block");
  allBlocks.forEach((block) => {
    if (!block.classList.contains("schema")) block.remove();
  });
  const allInputs = form.querySelectorAll(".preview-value");

  let prevPart = "";
  let dataBlock;
  let blockCont;
  let prevSubTitle = "";
  let subCont;
  allInputs.forEach((input) => {
    const part = input.className.split(" ")[1];
    if (part !== prevPart) {
      dataBlock = create("div", ...["constructor__data-block", part]);
      const dataTitle = create("div", "data-block__title");
      if (part !== "bp") {
        dataTitle.setAttribute("data-lang", part);
        dataTitle.textContent = part;
      } else {
        dataTitle.setAttribute("data-lang", "pinstripes");
        dataTitle.textContent = "Pinstripes";
      }
      dataBlock.appendChild(dataTitle);
      blockCont = create("div", "data-block__container");
      dataBlock.appendChild(blockCont);
      prevPart = part;
      prevSubTitle = "";
    }

    const target = input.getAttribute("data-target");
    switch (part) {
      case "information":
      case "sizes":
      case "logo":
      case "bp": {
        const name = input.getAttribute("name").split("/")[1];
        const chain = create("div", "preview-chain");

        const chainTitle = create("div", "preview-chain__title");
        if (part !== "bp") {
          chainTitle.setAttribute("data-lang", target);
          chainTitle.textContent = name;
        } else {
          let bp = name.replace("Pinstripes-", "");
          if (bp.length === 2) bp = `${bp[0]}/${bp[1]}`;
          chainTitle.textContent = bp;
        }
        chain.appendChild(chainTitle);

        const chainVal = create("div", "preview-chain__value");
        const value = input.textContent;
        chainVal.textContent = value;

        const lang = input.getAttribute("data-lang");
        if (lang !== null) chainVal.setAttribute("data-lang", lang);

        chain.appendChild(chainVal);

        if (part === "logo" && value !== "") {
          const chainColor = create("div", "preview-chain__value");
          const color = input.getAttribute("data-color");
          const setColor = color === null ? "NULL" : color;
          chainColor.textContent = setColor;
          chain.appendChild(chainColor);
        }
        chain.setAttribute("data-target", target);
        blockCont.appendChild(chain);
        break;
      }
      case "color":
      case "options": {
        const ind = part === "color" ? 1 : 0;
        const subTitle = input.getAttribute("name").split("/")[ind];
        if (subTitle !== "Special_Instructions") {
          if (subTitle !== prevSubTitle) {
            const subTitleDiv = create("div", "preview-chain__subtitle");
            subTitleDiv.setAttribute("data-lang", subTitle.toLowerCase());
            subTitleDiv.textContent = subTitle.replaceAll("_", " ");
            blockCont.appendChild(subTitleDiv);
            subCont = create("div", "data-block__sub-container");
            blockCont.appendChild(subCont);
            prevSubTitle = subTitle;
          }
          const chain = create("div", "preview-chain");

          const chainTitle = create("div", "preview-chain__title");
          if (part === "options") {
            chainTitle.setAttribute("data-lang", target);
          }
          const name = input.getAttribute("name").split("/")[ind + 1];
          chainTitle.textContent = name;
          chain.appendChild(chainTitle);

          chain.setAttribute("data-target", target);

          const chainVal = create("div", "preview-chain__value");
          chainVal.innerHTML = input.textContent;

          const lang = input.getAttribute("data-lang");
          if (lang !== null) chainVal.setAttribute("data-lang", lang);

          let dataColor = input.getAttribute("data-color");
          if (dataColor === "def") {
            dataColor = "";
            input.setAttribute("data-color", "");
          }
          if (dataColor !== "" && dataColor !== null) {
            chainVal.innerHTML = `${input.textContent}<br>Color: ${dataColor}`;
            if (input.getAttribute("data-target") === "main_pc") {
              chainVal.innerHTML = `${input.textContent}<br>Color: ${dataColor}($)`;
            }
          }
          chain.appendChild(chainVal);

          subCont.appendChild(chain);
        } else {
          dataBlock = create("div", ...["constructor__data-block", subTitle.toLowerCase()]);
          const dataTitle = create("div", "data-block__title");
          dataTitle.setAttribute("data-lang", subTitle.toLowerCase());
          dataTitle.textContent = subTitle.replace("_", " ");
          dataBlock.appendChild(dataTitle);
          blockCont = create("div", "data-block__container");
          blockCont.textContent = input.textContent;
          dataBlock.appendChild(blockCont);
        }
        break;
      }
      default: break;
    }
    wrapper.appendChild(dataBlock);
  });
  // checkSplitDesign();
}

function openPreviewScreen() {
  const form = document.querySelector(".form-constructor");
  const previewButton = document.querySelector(".main-buttons__preview");
  const allScreens = document.querySelectorAll(".constructor__item");
  previewButton.addEventListener("click", () => {
    // перекидываем данные из опций для подушки отцепки и кольца ЗП
    // в раздел Form-constructor - Color
    const cutawayHandle = form.querySelector("[data-target=\"cutaway_handle\"]");
    const area15 = form.querySelector("[data-target=\"area-15\"]");
    let color;
    if (cutawayHandle.value !== "choose_color") {
      cutawayHandle.setAttribute("data-color", "");
      color = cutawayHandle.textContent;
    } else color = cutawayHandle.getAttribute("data-color");
    area15.value = color;
    area15.textContent = color;

    const reserveHandle = form.querySelector("[data-target=\"reserve_handle\"]");
    if (reserveHandle.value !== "soft_handle") {
      reserveHandle.setAttribute("data-color", "");
      color = reserveHandle.textContent;
    } else color = reserveHandle.getAttribute("data-color");
    const area16 = form.querySelector("[data-target=\"area-16\"]");
    area16.value = color;
    area16.textContent = color;
    // --------------------

    // назначаем активный экран
    allScreens.forEach((screen) => {
      if (screen.classList.contains("preview")) {
        screen.classList.add("active");
        screen.parentElement.className = "center-container__constructor preview";
        const rightPanel = document.querySelector(".right-container__template-panel");
        rightPanel.className = "right-container__template-panel preview";
      } else screen.classList.remove("active");
    });
    const allTabs = document.querySelectorAll(".tabs-list__tabs-item");
    allTabs.forEach((tab) => {
      tab.classList.remove("active");
    });

    const panel = document.querySelector(".center-container__buttons-panel");
    panel.className = "center-container__buttons-panel preview";

    getPreviewInfo(form);
    setRequiredFields(form);

    // снять класс error со всех элементов
    const preview = document.querySelector(".constructor__item.preview");
    const allDiv = preview.querySelectorAll("div");
    allDiv.forEach((div) => {
      div.classList.remove("error");
    });
  });
}

export { getPreviewScreen, specialPreviewFunc, openPreviewScreen };
