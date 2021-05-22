import express from "express";
import path from "path";
import bodyParser from "body-parser";
import Excel from "exceljs";
import fs from "fs";
import { sendContactMail } from "./nodemailer.mjs";

const dirname = path.resolve();
// console.log(`${dirname}\\dist`, path, path.join(dirname, "../dist"));

const app = express();
const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use(express.static(`${dirname}\\dist`));

const port = 3000;

app.get("/", urlencodedParser, (request, response) => {
  response.send("Hello from Express!");
});

app.post("/contact", jsonParser, (req, res) => {
  sendContactMail(req.body);
  // console.log(req.body);
  const name = `${req.body.full_name} ${req.body.phone}`;
  return res.redirect("back");
});

app.post("/order", jsonParser, (req, res) => {
  console.log(req.body);
  const name = `${req.body.full_name} ${req.body.phone}`;

  const filePath = `${dirname}\\server\\new.txt`;
  fs.writeFile(filePath, name, (err) => {
    if (err) return console.log(err);
    return console.log("ok");
  });

  // res.send(`${name} Submitted Successfully!`);

  // fs.writeFileSync("hello.txt", "Привет ми ми ми!");

  const workbook = new Excel.Workbook();
  // const worksheet = workbook.addWorksheet("My Sheet");
  // worksheet.addRow({ id: 1, name: "John Doe", dob: new Date(1970, 1, 1) });
  // await workbook.xlsx.writeFile("new.xlsx");

  workbook.xlsx.readFile(`${dirname}\\server\\test.xlsx`)
    .then(() => {
      const worksheet = workbook.getWorksheet(1);
      const row = worksheet.getRow(9);
      row.getCell(3).value = "Test OK!";
      row.commit();
      workbook.xlsx.writeFile(`${dirname}\\server\\new.xlsx`);
      return res.redirect("back");
    });
});

app.listen(port, (err) => {
  if (err) {
    return console.log("something bad happened", err);
  }
  return console.log(`server is listening on ${port}`);
});
