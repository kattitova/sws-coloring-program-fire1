import nodemailer from "nodemailer";
import path from "path";
import fs from "fs";

const dirname = path.resolve();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "sws.nodemailer@gmail.com",
    pass: "sws.nodemailer.2021",
  },
  // host: "smtp.gmail.com",
  // port: 465,
  // secure: true,
  // auth: {
  //   user: "sws.nodemailer@gmail.com",
  //   pass: "sws.nodemailer.2021",
  // },
});

const adminEmail = "titova.kat.85@gmail.com"; // TODO change on order@sws.aero
// const copyEmail = "skyinsur@gmail.com";
const fromName = "SWS Constructor Form";

// отправка письма из контактной формы
async function sendContactMail(data) {
  console.log(data);
  let mes = "<table style=\"width: 100%\">";
  Object.keys(data).forEach((key, ind) => {
    mes += ind % 2 === 0 ? "<tr>" : "<tr style=\"background-color: #f8f8f8;\">";
    mes += `<td style='padding: 10px; border: #e9e9e9 1px solid;'><b>${key.replace("_", " ").toUpperCase()}</b></td>
<td style='padding: 10px; border: #e9e9e9 1px solid;'>${data[key]}</td>
</tr>`;
  });
  mes += "</table>";

  const result = await transporter.sendMail({
    from: `"${fromName}" <${adminEmail}>`,
    to: adminEmail,
    // bcc: copyEmail, // hidden email copy
    subject: "Contact Form Message",
    html: mes,
  });

  console.log(result);
}

// отправка письма С заказом
async function sendOrderMail(fileName, name, email, phone) {
  const filePath = `${dirname}/server/orders/Fire1_OrderFormRu_${fileName}.xlsx`;
  const result = await transporter.sendMail({
    from: `"${fromName}" <${adminEmail}>`,
    to: adminEmail,
    // bcc: copyEmail, // hidden email copy
    subject: "Fire1: Оформлен новый заказ",
    html: `Вы получили заказ на ранец Fire1<br>
    Заказчик: ${name}<br>
    E-mail: ${email}<br>
    Телефон: ${phone}`,
    attachments: [
      { filename: `Fire1_OrderFormRu_${fileName}.xlsx`, path: filePath },
      // { filename: `Fire1_OrderFormEng_${fileName}.xlsx`, path: filePath },
      // { filename: `Fire1_OrderConfirmationRu_${fileName}.xlsx`, path: filePath },
      // { filename: `Fire1_OrderConfirmationEng_${fileName}.xlsx`, path: filePath },
    ],
  });

  console.log(result);
}

export { sendContactMail, sendOrderMail };
