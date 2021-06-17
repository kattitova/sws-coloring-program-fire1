import express from "express";
import path from "path";
import fs from "fs";
import { sendContactMail } from "./nodemailer.mjs";
import { saveColoring } from "./save-coloring.mjs";
import { createOrderForm } from "./create-order-form.mjs";
import { createConfirmation } from "./create-confirmation.mjs";

const dirname = path.resolve();
// console.log(`${dirname}\\dist`, path, path.join(dirname, "../dist"));

const app = express();
const jsonParser = express.json();
const urlencodedParser = express.urlencoded({ extended: false });
app.use(express.static(`${dirname}\\dist`));

const port = 3000;

app.get("/", urlencodedParser, (request, response) => {
  response.send("Hello from Express!");
});

// отправка сообщения из контактной формы
app.post("/contact", jsonParser, (req, res) => {
  sendContactMail(req.body);
  return res.redirect("back");
});

// сохранение результатов раскрашивания пользоватлей
app.post("/save-coloring", jsonParser, (req, res) => {
  const fileName = saveColoring(req.body);
  res.send(`${fileName}`);
  return res.redirect("back");
});

// загрузка данных из сохраненного файла
app.post("/enter-code", jsonParser, (req, res) => {
  const file = req.body.code;
  try {
    const content = fs.readFileSync(`server/save/${file}.json`, "utf8");
    res.send(content);
  } catch (e) {
    res.send({ error: "nofile" });
  }
  // res.redirect("back");
});

app.post("/send-order", jsonParser, (req, res) => {
  console.log(req.body);
  const data = req.body;
  const name = data.filter(elem => elem["data-target"] === "full_name")[0];
  const dealer = data.filter(elem => elem["data-target"] === "dealer")[0];
  const dealerValue = dealer.value === "NULL" ? "No dealer" : dealer.text;
  const date = new Date();
  const getDateNow = `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}_${date.getHours()}.${date.getMinutes()}`;
  const fileName = `${name.text}_${dealerValue}_${getDateNow}`;
  try {
    createOrderForm(data, "Ru", fileName);
    createOrderForm(data, "Eng", fileName);
    createConfirmation(data, "Ru", fileName);
    res.send({ result: "ok" });
  } catch (e) {
    console.log(e);
  }
});

app.listen(port, (err) => {
  if (err) {
    return console.log("something bad happened", err);
  }
  return console.log(`server is listening on ${port}`);
});
