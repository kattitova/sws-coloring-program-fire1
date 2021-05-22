// // import { orderRuXLSX } from "xlsx-populate";

// // export default function saveOrders() {
// //   orderRuXLSX.fromFileAsync("./test.xlsx")
// //     .then((workbook) => {
// //       // Modify the workbook
// //       workbook.sheet("Order Form").cell("C9").value("Test OK!");

// //       // Write to file.
// //       return workbook.toFileAsync("./out.xlsx");
// //     });
// // }

// // const Excel = require("exceljs");

// // import { Workbook } from "exceljs";
// import * as Excel from "exceljs";
// import { saveAs } from "file-saver";

// const fs = require("fs");

// export default async function saveOrders() {
//   const workbook = new Excel.Workbook();
//   // const worksheet = workbook.addWorksheet("data");
//   // const row = worksheet.getRow(9);
//   // row.getCell(3).value = "Test OK!";
//   // row.commit();
//   const worksheet = workbook.addWorksheet("My Sheet");

//   worksheet.columns = [
//     { header: "Id", key: "id", width: 10 },
//     { header: "Name", key: "name", width: 32 },
//     { header: "D.O.B.", key: "dob", width: 15 },
//   ];

//   worksheet.addRow({ id: 1, name: "John Doe", dob: new Date(1970, 1, 1) });
//   worksheet.addRow({ id: 2, name: "Jane Doe", dob: new Date(1965, 1, 7) });

//   const buffer = await workbook.xlsx.writeBuffer();
//   const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
//   const fileExtension = ".xlsx";

//   const blob = new Blob([buffer], { type: fileType });

//   // saveAs(blob, `fileName${fileExtension}`); диалог сохранения на клиентской стороне

//   fs.writeFileSync("hello.txt", "Привет ми ми ми!");
//   // fs.writeFile(`fileName${fileExtension}`, blob);


//   // console.log(workbook);
//   // workbook.xlsx.readFile("./test.xlsx")
//   //   .then(() => {
//   //     const worksheet = workbook.getWorksheet(0);
//   //     const row = worksheet.getRow(9);
//   //     row.getCell(3).value = "Test OK!";
//   //     row.commit();
//   //     return workbook.xlsx.writeFile("./new.xlsx");
//   //   });
// }

// // const xlsxFile = require("read-excel-file/node");

// // export default function saveOrders() {
// //   xlsxFile("./test.xlsx").then((rows) => {
// //     console.log(rows);
// //     console.table(rows);
// //   });
// // }
// saveOrders();
