import path from "path";
import fs from "fs";
import Excel from "exceljs";

const dirname = path.resolve();
const posJSON = fs.readFileSync("server/order-form-position.json", "utf8");
const positions = JSON.parse(posJSON)[0];

function spliceData(data) {
  const obj = {
    info: [],
    sizes: [],
    color: [],
    split: [],
    bp: [],
    logo: [],
    options: [],
  };
  data.forEach((item) => {
    switch (item.part) {
      case "information": obj.info.push(item); break;
      case "sizes": obj.sizes.push(item); break;
      case "color": obj.color.push(item); break;
      case "split-design-2":
      case "split-design-6":
        obj.split.push(item); break;
      case "bp": obj.bp.push(item); break;
      case "logo": obj.logo.push(item); break;
      case "options": obj.options.push(item); break;
      default: break;
    }
  });
  return obj;
}

function createOrderForm(data, lang, fileName) {
  const workbook = new Excel.Workbook();

  workbook.xlsx.readFile(`${dirname}\\server\\orders\\OrderFormTmp${lang}.xlsx`)
    .then(() => {
      const worksheet = workbook.getWorksheet(1);

      const obj = spliceData(data);

      Object.keys(obj).forEach((item) => {
        switch (item) {
          // расставляем блок информации
          case "info": {
            obj[item].forEach((info) => {
              const target = info["data-target"];
              const pos = positions[item].filter(elem => elem["data-target"] === target)[0];
              const row = worksheet.getRow(pos.row);
              row.getCell(pos.cell).value = info.text;
              row.commit();
            });
            break;
          }
          // расставляем блок размеров
          case "sizes": {
            obj[item].forEach((size) => {
              const target = size["data-target"];
              const pos = positions[item].filter(elem => elem["data-target"] === target)[0];
              let numRow;
              let numCell;
              let txt;
              if (target === "harness" || target === "container") {
                const { value } = size;
                numRow = pos[value].row;
                numCell = pos[value].cell;
                txt = "R";
              } else {
                numRow = pos.row;
                numCell = pos.cell;
                txt = size.text;
              }
              const row = worksheet.getRow(numRow);
              row.getCell(numCell).value = txt;
              row.commit();
            });
            break;
          }
          // расставляем блок цвета
          case "color": {
            obj[item].forEach((color, ind) => {
              let flagColor = true;
              const target = color["data-target"];
              const pos = positions[item].filter(elem => elem["data-target"] === target)[0];
              if (target[5] === "2") {
                if (obj.split[0].value === "active") {
                  if (target.length === 6) flagColor = false;
                } else if (target.length > 6) flagColor = false;
              }
              if (target[5] === "6") {
                if (obj.split[1].value === "active") {
                  if (target.length === 6) flagColor = false;
                } else if (target.length > 6) flagColor = false;
              }
              if (ind > 19) flagColor = false;
              if (flagColor) {
                const row = worksheet.getRow(pos.row);
                row.getCell(pos.cell).value = color.text;
                row.commit();
              }
            });
            break;
          }
          // расставляем блок лучи и окантовка
          case "bp": {
            obj[item].forEach((bp) => {
              const target = bp["data-target"];
              const pos = positions[item].filter(elem => elem["data-target"] === target)[0];
              const row = worksheet.getRow(pos.row);
              row.getCell(pos.cell).value = bp.text.toLowerCase() === "def" ? "" : bp.text;
              row.commit();
            });
            break;
          }
          // расставляем блок Логотипы
          case "logo": {
            obj[item].forEach((logo) => {
              const target = logo["data-target"];
              const { value } = logo;
              const pos = positions[item].filter(elem => elem["data-target"] === target)[0];
              let numRow;
              if (value !== "NULL") {
                switch (value) {
                  case "custom_text": numRow = pos.row + 1; break;
                  case "custom_logo": numRow = pos.row + 2; break;
                  default: numRow = pos.row; break;
                }
                const row = worksheet.getRow(numRow);
                row.getCell(pos.cell).value = "R";
                row.getCell(pos.cell + 1).value = logo["data-color"];
                if (value === "custom_text") row.getCell(pos.cell + 2).value = logo["data-text"];
                row.commit();
              }
            });
            break;
          }
          // расставляем блок информации
          case "options": {
            obj[item].forEach((options, ind) => {
              const target = options["data-target"];
              const pos = positions[item].filter(elem => elem["data-target"] === target)[0];
              let numRow;
              let numCell;
              let txt = "R";
              let flag = true;
              const { value } = options;
              if (value !== "NULL") {
                if (ind < obj[item].length - 4) {
                  if (value === "choose_color" || value === "soft_handle") {
                    txt = options["data-color"];
                  }
                  if (target === "swoop_options") {
                    const swoopValue = value.split("+");
                    swoopValue.forEach((val) => {
                      const row = worksheet.getRow(pos[val].row);
                      row.getCell(pos[val].cell).value = "R";
                      row.commit();
                    });
                    flag = false;
                  }
                  if (target === "main_pc" || target === "main_deployment_handle") {
                    if (options["data-color"] !== null) {
                      const row = worksheet.getRow(pos["data-color"].row);
                      row.getCell(pos["data-color"].cell).value = options["data-color"];
                      row.commit();
                    }
                  }
                  numRow = pos[value].row;
                  numCell = pos[value].cell;
                } else {
                  numRow = pos.row;
                  numCell = pos.cell;
                  if (target === "special_instructions") {
                    txt = options.text;
                  }
                }
                if (flag) {
                  const row = worksheet.getRow(numRow);
                  row.getCell(numCell).value = txt;
                  row.commit();
                }
              }
            });
            break;
          }
          default: break;
        }
      });
      workbook.xlsx.writeFile(`${dirname}\\server\\orders\\Fire1_OrderForm${lang}_${fileName}.xlsx`);
    });
}

export { createOrderForm, spliceData };
