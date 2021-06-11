const loadDataToScreen = (data) => {
  data.forEach((item) => {
    switch (item.part) {
      case "color": {
        let allDetail;
        if (item["data-target"] === "area-14") {
          allDetail = document.querySelectorAll(".schema__element[data-id=\"harness\"] path");
        } else {
          allDetail = document.querySelectorAll(`.schema__element[data-id="${item["data-target"]}"]`);
        }
        if (allDetail) {
          allDetail.forEach((det) => {
            det.setAttribute("data-color", item.value);
          });
        }
        break;
      }
      case "bp": {
        let allDetail;
        if (item["data-target"] === "binding") {
          allDetail = document.querySelectorAll(".schema__element[data-id=\"binding\"] path");
        } else {
          allDetail = document.querySelectorAll(`.schema__element[data-id="${item["data-target"]}"]`);
        }
        if (allDetail) {
          allDetail.forEach((det) => {
            det.setAttribute("data-color", item.value);
          });
        }
        break;
      }
      case "split-design-2":
      case "split-design-6": {
        const allSplit = document.querySelectorAll(".panel__split-switch button");
        allSplit.forEach((split) => {
          const target = split.getAttribute("data-target");
          if (target === item["data-target"]) {
            if (item.value === "active" && !split.classList.contains("active")) split.click();
          }
        });
        break;
      }
      case "logo": {
        const allLogoArea = document.querySelectorAll(`.logos__area[data-logo="${item["data-target"]}"]`);
        if (item.value !== "NULL") {
          allLogoArea.forEach((area) => {
            area.classList.add("checked");
            area.setAttribute("data-color", item["data-color"]);
            area.setAttribute("data-value", item.value);
            const logo = area.querySelector(`.logo__${item.value}`);
            logo.classList.add("checked");
            if (item.value === "custom_text") {
              if (item["data-text"] !== null) logo.textContent = item["data-text"];
              else logo.textContent = "CUSTOM TEXT";
            }
          });
        }
        break;
      }
      case "information":
      case "sizes": {
        const constructor = document.querySelector(`.constructor__item.${item.part}`);
        const target = item["data-target"];
        if (target === "measurement_units" || target === "sex" || target === "harness" || target === "container") {
          const checks = constructor.querySelector(`.constructor__data-row-checks[data-val="${target}"]`);
          const input = checks.querySelector(`input[data-text="${item.value}"]`);
          if (input) input.click();
        } else {
          const input = constructor.querySelector(`.data-row__input[data-val="${target}"]`);
          if (item.value !== "NULL") {
            input.value = item.value;
            input.textContent = item.text;
          } else {
            input.value = "";
            input.textContent = "";
          }
        }
        break;
      }
      case "options": {
        const target = item["data-target"];
        const constructor = document.querySelector(".constructor__item.options");
        const checks = constructor.querySelector(`.constructor__data-row-checks[data-val="${target}"]`);
        if (target !== "swoop_options") {
          const label = checks.querySelector(`label[for="${target}-${item.value}"]`);
          if (label) label.click();
        } else if (item.value !== "NULL") {
          const arrOptions = item.value.split("+");
          arrOptions.forEach((opt) => {
            const label = checks.querySelector(`label[for="${target}-${opt}"]`);
            if (label) label.click();
          });
        }
        break;
      }
      default: break;
    }
  });
};

const loadData = (data) => {
  // загрузка данных в Form-constructor
  const form = document.querySelector(".form-constructor");
  data.forEach((item) => {
    const input = form.querySelector(`.${item.part}[data-target="${item["data-target"]}"]`);
    Object.keys(item).forEach((key) => {
      switch (key) {
        case "value": input.value = item.value; break;
        case "text": input.textContent = item.text; break;
        case "data-lang":
          if (item[key] !== null) {
            input.setAttribute("data-lang", item["data-lang"]);
          }
          break;
        case "data-text":
          if (item[key] !== null) {
            input.setAttribute("data-text", item["data-text"]);
          }
          break;
        case "data-color":
          if (item[key] !== null) {
            input.setAttribute("data-color", item["data-color"]);
          }
          break;
        default: break;
      }
    });
  });

  // загрузка данных во все части программы
  loadDataToScreen(data);
};

export { loadData };
