import path from "path";
import Excel from "exceljs";

const dirname = path.resolve();

function spliceData(data) {
  const obj = {
    info: [],
    sizes: [],
  };
  data.forEach((item) => {
    switch (item.part) {
      case "information": obj.info.push(item); break;
      case "sizes": obj.sizes.push(item); break;
      default: break;
    }
  });
  return obj;
}

function createOrderForm(data, lang, fileName) {
  const workbook = new Excel.Workbook();
  // const worksheet = workbook.addWorksheet("My Sheet");
  // worksheet.addRow({ id: 1, name: "John Doe", dob: new Date(1970, 1, 1) });
  // await workbook.xlsx.writeFile("new.xlsx");

  workbook.xlsx.readFile(`${dirname}\\server\\orders\\OrderFormTmp${lang}.xlsx`)
    .then(() => {
      const worksheet = workbook.getWorksheet(1);

      const obj = spliceData(data);

      obj.info.forEach((infoItem, ind) => {
        const row = worksheet.getRow(ind + 9);
        const cell = ind > 4 ? 5 : 3;
        row.getCell(cell).value = infoItem.text;
        row.commit();
      });

      let sizeH = 17;
      obj.sizes.forEach((sizesItem, ind) => {
        if (ind === 6 || ind === 13) sizeH = 12;
        if (ind === 11) sizeH = 13;
        if (ind === 12) sizeH = 16;
        const row = worksheet.getRow(ind + sizeH);
        let cell;
        if (ind === 0) cell = 6;
        else if (ind < 6) cell = 3;
        else if (ind < 11) cell = 8;
        else if (ind > 12) cell = 5;
        const target = sizesItem["data-target"];
        if (target === "harness" || target === "container") {
          switch (sizesItem.value) {
            case "normal": cell = 2; break;
            case "loose": cell = 5; break;
            case "tight": cell = 8; break;
            default: break;
          }
          row.getCell(cell).value = "R";
        } else row.getCell(cell).value = sizesItem.text;
        row.commit();
      });

      workbook.xlsx.writeFile(`${dirname}\\server\\orders\\Fire1_OrderForm${lang}_${fileName}.xlsx`);
    });
}

export { createOrderForm };
