import path from "path";
import fs from "fs";
import Excel from "exceljs";
import { spliceData } from "./create-order-form.mjs";

const dirname = path.resolve();
const posJSON = fs.readFileSync("server/confirmation-position.json", "utf8");
const positions = JSON.parse(posJSON)[0];

function recalc(workbook) {
  const worksheet = workbook.getWorksheet("PriceList");
  const arr = [10, 4, 5, 1, 6, 7];
  arr.forEach((cell) => {
    for (let i = 4; i <= 80; i += 1) {
      const row = worksheet.getRow(i);
      const val = row.getCell(cell).value;
      row.getCell(cell).value = val;
      row.commit();
    }
  });
  // make worksheet hidden
  worksheet.state = "hidden";
}

function setCamoOption(worksheet) {
  const row = worksheet.getRow(32);
  row.getCell(13).value = "x";
  row.commit();
}

function createConfirmation(data, lang, fileName) {
  const workbook = new Excel.Workbook();

  workbook.xlsx.readFile(`${dirname}\\server\\orders\\OrderConfirmationTmp${lang}.xlsx`)
    .then(() => {
      const worksheet = workbook.getWorksheet(1);

      const servRow = worksheet.getRow(10);
      servRow.getCell(4).value = "SWS Constructor Form";
      servRow.commit();

      const date = new Date();
      const getDateNow = `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
      const dateRow = worksheet.getRow(11);
      dateRow.getCell(4).value = getDateNow;
      dateRow.commit();

      const obj = spliceData(data);

      Object.keys(obj).forEach((item) => {
        switch (item) {
          // расставляем блок информации, цвета, размеры
          case "info":
          case "color":
          case "sizes": {
            let camoFlag = false;
            obj[item].forEach((subItem) => {
              const target = subItem["data-target"];
              const pos = positions[item].filter(elem => elem["data-target"] === target)[0];
              if (pos) {
                const row = worksheet.getRow(pos.row);
                const txt = item === "color" ? `${subItem.text[0].toUpperCase()}${subItem.text.slice(1)}` : subItem.text;
                row.getCell(pos.cell).value = txt;
                row.commit();
              }
              if (item === "color") {
                if (subItem.text.toLowerCase().includes("cam")) camoFlag = true;
              }
            });
            if (camoFlag) setCamoOption(worksheet);
            break;
          }
          // расставляем блок лучи и окантовка
          case "bp": {
            obj[item].forEach((bp) => {
              const target = bp["data-target"];
              const pos = positions[item].filter(elem => elem["data-target"] === target)[0];
              if (bp.text.toLowerCase() !== "def" && bp.text.toLowerCase() !== "") {
                const row = worksheet.getRow(pos.row);
                row.getCell(pos.cell).value = `${bp.text[0].toUpperCase()}${bp.text.slice(1)}`; // bp.text;
                row.commit();
              }
            });
            break;
          }
          // расставляем блок опции
          case "options": {
            let camoFlag = false;
            obj[item].forEach((options, ind) => {
              const target = options["data-target"];
              const pos = positions[item].filter(elem => elem["data-target"] === target)[0];
              if (pos) {
                let numRow;
                let numCell;
                let txt = "x";
                let flag = true;
                const { value } = options;
                if (value !== "NULL") {
                  if (ind < obj[item].length - 4) {
                    if (value === "choose_color" || value === "soft_handle") {
                      txt = `${options["data-color"][0].toUpperCase()}${options["data-color"].slice(1)}`; // options["data-color"];
                      if (options["data-color"].toLowerCase().includes("cam")) camoFlag = true;
                    }
                    if (target === "swoop_options") {
                      const swoopValue = value.split("+");
                      swoopValue.forEach((val) => {
                        const row = worksheet.getRow(pos[val].row);
                        row.getCell(pos[val].cell).value = "x";
                        row.commit();
                      });
                      flag = false;
                    }
                    if (target === "main_pc" || target === "main_deployment_handle") {
                      if (options["data-color"] !== null && options["data-color"] !== "") {
                        const row = worksheet.getRow(pos["data-color"].row);
                        row.getCell(pos["data-color"].cell).value = `${options["data-color"][0].toUpperCase()}${options["data-color"].slice(1)}`; // options["data-color"];
                        row.commit();
                        if (options["data-color"].toLowerCase().includes("cam")) camoFlag = true;
                      } else if (target === "main_pc") {
                        const row = worksheet.getRow(40);
                        row.getCell(19).value = "x";
                        row.commit();
                      }
                    }
                    if (target === "fabric_toggles" || target === "protected_main_pc_pocket") {
                      const row = worksheet.getRow(pos.row);
                      row.getCell(pos.cell).value = "x";
                      row.commit();
                      flag = false;
                    }
                    if (flag) {
                      numRow = pos[value].row;
                      numCell = pos[value].cell;
                    }
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
              }
            });
            if (camoFlag) setCamoOption(worksheet);
            break;
          }
          // расставляем блок Логотипы
          case "logo": {
            obj[item].forEach((logo) => {
              const target = logo["data-target"];
              const { value } = logo;
              const pos = positions[item].filter(elem => elem["data-target"] === target)[0];
              let numCell;
              if (value !== "NULL") {
                switch (value) {
                  case "custom_text": numCell = pos.cell + 3; break;
                  case "custom_logo": numCell = pos.cell + 6; break;
                  default: numCell = pos.cell; break;
                }
                const row = worksheet.getRow(pos.row);
                row.getCell(numCell).value = "x";
                row.getCell(pos.cell + 7).value = `${logo["data-color"][0].toUpperCase()}${logo["data-color"].slice(1)}`; // logo["data-color"];
                row.commit();
                if (value === "custom_text") {
                  const rowTxt = worksheet.getRow(44);
                  rowTxt.getCell(1).value = `${rowTxt.getCell(1).text}\n${target}: ${logo["data-text"]}`.trim();
                }
              }
            });
            break;
          }
          default: break;
        }
      });
      // --------------------

      return workbook.xlsx.writeFile(`${dirname}\\server\\orders\\Fire1_OrderConfirmation${lang}_${fileName}.xlsx`);
    })
    .then(() => {
      const book = new Excel.Workbook();
      book.xlsx.readFile(`${dirname}\\server\\orders\\Fire1_OrderConfirmation${lang}_${fileName}.xlsx`)
        .then(() => {
          book.calcProperties.fullCalcOnLoad = true;
          recalc(book);
          return book.xlsx.writeFile(`${dirname}\\server\\orders\\Fire1_OrderConfirmation${lang}_${fileName}.xlsx`);
        });
    });
}

export { createConfirmation };
