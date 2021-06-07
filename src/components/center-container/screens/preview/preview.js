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
  const arr = ["preview", "order form"];
  arr.forEach((item) => {
    const subTitle = create("div", "constructor__sub-title");
    subTitle.setAttribute("data-lang", item.replace(" ", "_"));
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

function checkSplitDesign() {
  const form = document.querySelector(".form-constructor");
  const allSplit = form.querySelectorAll(".split");
  const colorBlock = document.querySelector(".constructor__data-block.color");
  allSplit.forEach((split) => {
    const name = split.getAttribute("name");
    const num = name[name.length - 1];
    const allNumDetail = colorBlock.querySelectorAll(".preview-chain");
    if (split.value === "active") {
      allNumDetail.forEach((det) => {
        const target = det.getAttribute("data-target");
        if (target[0] === num) {
          if (target.length === 1) det.classList.add("hidden");
          else det.classList.remove("hidden");
        }
      });
    } else {
      allNumDetail.forEach((det) => {
        const target = det.getAttribute("data-target");
        if (target[0] === num) {
          if (target.length === 1) det.classList.remove("hidden");
          else det.classList.add("hidden");
        }
      });
    }
  });
}

function getPreviewInfo() {
  const constructor = document.querySelector(".constructor__item.preview");
  const wrapper = constructor.querySelector(".constructor__data-wrapper");
  const allBlocks = wrapper.querySelectorAll(".constructor__data-block");
  allBlocks.forEach((block) => {
    if (!block.classList.contains("schema")) block.remove();
  });
  const form = document.querySelector(".form-constructor");
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
        chain.appendChild(chainVal);

        if (part === "logo" && value !== "") {
          const chainColor = create("div", "preview-chain__value");
          const color = input.getAttribute("data-color");
          const setColor = color === null ? "NULL" : color;
          chainColor.textContent = setColor;
          chain.appendChild(chainColor);
        }

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

          if (part === "color") {
            chain.setAttribute("data-target", name);
          }

          const chainVal = create("div", "preview-chain__value");
          chainVal.innerHTML = input.textContent;
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
  checkSplitDesign();
}

export { getPreviewScreen, specialPreviewFunc, getPreviewInfo };
