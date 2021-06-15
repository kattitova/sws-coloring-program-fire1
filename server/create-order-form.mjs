import path from "path";
import fs from "fs";
import Excel from "exceljs";

const dirname = path.resolve();
const posJSON = fs.readFileSync("server/order-form-position.json", "utf8");
const positions = JSON.parse(posJSON)[0];
// console.log(JSON.parse(posJSON)[0].color);

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
          default: break;
        }
      });

      // расставляем блок цветов
      let colorH;
      let cell;
      obj.color.forEach((colorItem, ind) => {
        let colorFlag = true;
        switch (ind) {
          case 0: colorH = 31; cell = 2; break;
          case 1:
          case 2:
          case 3: {
            if (obj.split[0].value === "active") {
              colorH = 39 - ind;
              cell = 2 * ind + 1;
            } else colorFlag = false;
            break;
          }
          case 4: {
            colorH = 28;
            cell = 2;
            if (obj.split[0].value === "active") colorFlag = false;
            break;
          }
          case 8:
          case 9:
          case 10: {
            if (obj.split[1].value === "active") {
              colorH = 40 - ind;
              if (ind === 8) cell = 3;
              if (ind === 9) cell = 5;
              if (ind === 10) cell = 7;
            } else colorFlag = false;
            break;
          }
          case 11: {
            colorH = 25;
            cell = 2;
            if (obj.split[0].value === "active") colorFlag = false;
            break;
          }
          case 13: {
            colorH = 18;
            cell = 6;
            break;
          }
          case 19: {
            colorH = 26;
            cell = 4;
            break;
          }
          case 20:
          case 21:
          case 22:
            colorFlag = false; break;
          default: break;
        }

        if (colorFlag) {
          const row = worksheet.getRow(ind + colorH);
          row.getCell(cell).value = colorItem.text;
          row.commit();
        }
      });

      // расставляем лучи и окантовку
      let numRow = 41;
      obj.bp.forEach((bpItem, ind) => {
        if (ind % 2 === 0) {
          cell = 3;
          numRow += 1;
        } else {
          cell = 6;
        }
        if (ind === 6) {
          cell = 4;
          numRow = 46;
        }
        const row = worksheet.getRow(numRow);
        row.getCell(cell).value = bpItem.text.toLowerCase() === "def" ? "" : bpItem.text;
        row.commit();
      });

      // расставляем логотипы
      obj.logo.forEach((logoItem) => {
        const target = logoItem["data-target"];
        const { value } = logoItem;
        cell = 4;
        switch (target) {
          case "left-side": numRow = 61; break;
          case "right-side": numRow = 57; break;
          case "rc-left": numRow = 53; break;
          case "rc-right": numRow = 49; break;
          case "central-detail": numRow = 65; break;
          default: break;
        }

        switch (value) {
          case "custom_text": numRow += 1; break;
          case "custom_logo": numRow += 2; break;
          default: break;
        }
        const row = worksheet.getRow(numRow);
        row.getCell(cell).value = "R";
        row.getCell(cell + 1).value = logoItem["data-color"];
        if (value === "custom_text") row.getCell(cell + 2).value = logoItem["data-text"];
        row.commit();
      });

      workbook.xlsx.writeFile(`${dirname}\\server\\orders\\Fire1_OrderForm${lang}_${fileName}.xlsx`);
    });
}

export { createOrderForm };
