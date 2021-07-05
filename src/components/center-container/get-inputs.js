import create from "../create";
import getOptionsNav from "./screens/options/options-nav";
// import price from "./screens/options/price.json";

function addCheckbox(type, radio, val, parrent, price) {
  const checkBlock = create("div", "constructor__data-check");
  const inp = create("input", "data-row__radio");
  const txt = radio.toLowerCase().replace(/[ +,-][_]*/g, "_").replace(/_{1,}/g, "_");
  const id = `${val}-${txt}`;
  inp.setAttribute("id", id);
  inp.setAttribute("data-text", txt);
  inp.setAttribute("type", type);
  const radioLabel = create("label", "data-row__label");
  radioLabel.setAttribute("for", id);
  const span = create("span", "data-row__name");
  span.setAttribute("data-lang", txt);
  span.textContent = radio;

  checkBlock.appendChild(inp);
  radioLabel.appendChild(span);
  // TODO if cls==="options" add span with price
  if (price) {
    const priceSpan = create("span", "data-row__price");
    priceSpan.textContent = price;
    radioLabel.appendChild(priceSpan);
  }
  checkBlock.appendChild(radioLabel);
  parrent.appendChild(checkBlock);
}

export default function genInputs(obj, cls) {
  const divWrapper = create("div", `${cls}-wrapper`);

  // выводим заголовок формы Step1, Step2, Step3
  const divTitle = create("div", "constructor__title");
  const divSubTitle = create("div", "constructor__sub-title");
  divSubTitle.setAttribute("data-lang", `title_${cls}`);
  divSubTitle.textContent = obj.title;
  divTitle.appendChild(divSubTitle);

  const divOrderTitle = create("div", "constructor__sub-title");
  divOrderTitle.setAttribute("data-lang", "order_form");
  divOrderTitle.textContent = "order form";
  divTitle.appendChild(divOrderTitle);

  divWrapper.appendChild(divTitle);
  // -------------

  // формируем заголовки и инпуты для ввода
  const divInputsWrapper = create("div", "constructor__data-wrapper");
  obj.parts.forEach((block, i) => {
    const dataBlockCls = block.title ? block.title.toLowerCase().replaceAll(" ", "_") : "no-title";
    const dataBlock = create("div", ...["constructor__data-block", dataBlockCls]);
    if (cls === "options" && i === 0) dataBlock.classList.add("active");
    let title;
    Object.keys(block).forEach((item) => {
      let elem;
      switch (item) {
        case "title":
          title = block[item].toLowerCase().replaceAll(" ", "_");
          elem = create("div", `data-row__${item}`);
          elem.setAttribute("data-val", title);
          elem.setAttribute("data-lang", title);
          elem.textContent = block[item];
          dataBlock.appendChild(elem);
          break;

        case "button":
        case "clear-button":
          elem = create("button", `data-row__${item}`);
          elem.setAttribute("data-val", block[item].toLowerCase().replaceAll(" ", "_"));
          elem.textContent = block[item];
          dataBlock.appendChild(elem);
          break;

        case "input": {
          const inp = create("input", "data-row__input");
          inp.setAttribute("data-val", block.input.toLowerCase().replaceAll(" ", "_"));
          dataBlock.appendChild(inp);
          break;
        }

        case "inputs":
          block[item].forEach((input) => {
            const row = create("div", "constructor__data-row");
            const label = create("div", "data-row__label");
            label.setAttribute("data-lang", input.toLowerCase().replaceAll(" ", "_"));
            label.textContent = input;
            row.appendChild(label);

            const inp = create("input", "data-row__input");
            inp.setAttribute("data-val", input.toLowerCase().replaceAll(" ", "_"));
            row.appendChild(inp);
            dataBlock.appendChild(row);
          });
          break;

        case "check-box":
          block[item].forEach((check) => {
            const row = create("div", "constructor__data-row");
            const label = create("div", "data-row__label");
            const val = check.label.toLowerCase().replaceAll(" ", "_");
            label.setAttribute("data-lang", val);
            label.textContent = check.label;
            row.appendChild(label);

            const rowCheks = create("div", "constructor__data-row-checks");
            rowCheks.setAttribute("data-val", val);
            rowCheks.setAttribute("select", check.select);
            if (check.radio) {
              check.radio.forEach((radio, ind) => {
                if (check.price) {
                  addCheckbox("radio", radio, val, rowCheks, check.price[ind]);
                } else addCheckbox("radio", radio, val, rowCheks);
              });
            }
            if (check.checkbox) {
              check.checkbox.forEach((radio, ind) => {
                if (check.price) addCheckbox("checkbox", radio, val, rowCheks, check.price[ind]);
                else addCheckbox("checkbox", radio, val, rowCheks);
              });
            }
            row.appendChild(rowCheks);

            dataBlock.appendChild(row);
          });
          break;

        case "textarea":
          elem = create("textarea", `data-row__${item}`);
          elem.setAttribute("data-val", block.title.toLowerCase().replaceAll(" ", "_"));
          elem.setAttribute("data-lang", `${block.title.toLowerCase().replaceAll(" ", "_")}_placeholder`);
          elem.setAttribute("placeholder", block[item]);
          dataBlock.appendChild(elem);
          break;

        default: break;
      }
    });

    divInputsWrapper.appendChild(dataBlock);
  });
  if (cls === "options") divInputsWrapper.appendChild(getOptionsNav(obj.parts));
  divWrapper.appendChild(divInputsWrapper);
  return divWrapper;
}
