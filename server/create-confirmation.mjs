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
  // worksheet.state = 'hidden';
}

function createConfirmation(data, lang, fileName) {
  const workbook = new Excel.Workbook();

  workbook.xlsx.readFile(`${dirname}\\server\\orders\\OrderConfirmationTmp${lang}.xlsx`)
    .then(() => {
      const worksheet = workbook.getWorksheet(1);

      // TODO здесь организовать рассталение данных в ячейки
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
                row.getCell(pos.cell).value = subItem.text;
                row.commit();
              }
              if (item === "color") {
                if (subItem.text.toLowerCase().includes("cam")) camoFlag = true;
              }
            });
            if (camoFlag) {
              const row = worksheet.getRow(32);
              row.getCell(13).value = "x";
              row.commit();
            }
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
          default: break;
        }
      });

      let row = worksheet.getRow(22);
      row.getCell(23).value = "x";
      row.commit();

      row = worksheet.getRow(23);
      row.getCell(19).value = "x";
      row.commit();

      // --------------------

      return workbook.xlsx.writeFile(`${dirname}\\server\\orders\\Fire1_OrderConfirmation${lang}_${fileName}.xlsx`);
    })
    .then(() => {
      console.log("xlsx file is written");
      const book = new Excel.Workbook();
      book.xlsx.readFile(`${dirname}\\server\\orders\\Fire1_OrderConfirmation${lang}_${fileName}.xlsx`)
        .then(() => {
          book.calcProperties.fullCalcOnLoad = true;
          recalc(book);
          return book.xlsx.writeFile(`${dirname}\\server\\orders\\Fire1_OrderConfirmation${lang}_${fileName}.xlsx`);
        })
        .then(() => {
          console.log("xlsx file is recalc");
        });
    });
}

export { createConfirmation };
