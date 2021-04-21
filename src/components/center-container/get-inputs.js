import create from "../create";

export default function genInputs(obj, cls) {
  const divWrapper = create("div", `${cls}-wrapper`);

  // выводим заголовок формы Step1, Step2, Step3
  const divTitle = create("div", "constructor__title");
  const divSubTitle = create("div", "constructor__sub-title");
  divSubTitle.setAttribute("data-lang", `title-${cls}`);
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
  obj.parts.forEach((block) => {
    const dataBlockCls = block.title ? block.title.toLowerCase().replaceAll(" ", "-") : "no-title";
    const dataBlock = create("div", ...["constructor__data-block", dataBlockCls]);
    Object.keys(block).forEach((item) => {
      let elem;
      switch (item) {
        case "title":
          elem = create("div", `data-row__${item}`);
          elem.setAttribute("data-val", block[item].toLowerCase().replaceAll(" ", "_"));
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
            check.radio.forEach((radio) => {
              const checkBlock = create("div", "constructor__data-check");
              const inp = create("input", "data-row__radio");
              const id = `${val}-${radio.toLowerCase()}`;
              inp.setAttribute("id", id);
              inp.setAttribute("data-text", radio);
              inp.setAttribute("type", "radio");
              const radioLabel = create("label", "data-row__label");
              radioLabel.setAttribute("for", id);
              const span = create("span", "data-row__name");
              span.setAttribute("data-lang", radio.toLowerCase());
              span.textContent = radio;

              checkBlock.appendChild(inp);
              radioLabel.appendChild(span);
              checkBlock.appendChild(radioLabel);
              rowCheks.appendChild(checkBlock);
            });
            row.appendChild(rowCheks);

            dataBlock.appendChild(row);
          });
          break;

        default: break;
      }
    });

    divInputsWrapper.appendChild(dataBlock);
  });
  divWrapper.appendChild(divInputsWrapper);
  return divWrapper;
}
