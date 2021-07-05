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

// async function check(file) {
//   let flag;
//   fs.access(file, (error) => {
//     if (error) {
//       flag = false;
//       console.log("Файл не найден");
//     } else {
//       console.log("Файл найден");
//     }
//   });
//   return flag;
// }

// async function checkFiles(arrAttach) {
//   let flag = true;
//   for (const file of arrAttach) {
//     fs.access(file.path, (error) => {
//       if (error) {
//         flag = false;
//         console.log("Файл не найден");
//       } else {
//         console.log("Файл найден");
//       }
//     });
//   }
//   console.log("func", flag);
//   return flag;
// }

// отправка письма с заказом
async function sendOrderMail(fileName, name, email, phone) {
  const arrAttach = [];
  const arrFile = ["Fire1_OrderFormRu", "Fire1_OrderFormEng", "Fire1_OrderConfirmationRu", "Fire1_OrderConfirmationEng"];
  arrFile.forEach((file) => {
    const obj = {
      filename: "",
      path: "",
    };
    obj.filename = `${file}_${fileName}.xlsx`;
    obj.path = `${dirname}/server/orders/${obj.filename}`;
    arrAttach.push(obj);
  });

  // const sendPromise = new Promise((resolve) => {
  //   if (checkFiles(arrAttach)) resolve(true);
  //   else resolve(checkFiles(arrAttach));
  // });
  // sendPromise.then((flag) => {
  //   console.log(flag);
  //   if (flag) {
  const result = await transporter.sendMail({
    from: `"${fromName}" <${adminEmail}>`,
    to: adminEmail,
    // bcc: copyEmail, // hidden email copy
    subject: "Fire1: Оформлен новый заказ",
    html: `Вы получили заказ на ранец Fire1<br>
    Заказчик: ${name}<br>
    E-mail: ${email}<br>
    Телефон: ${phone}`,
    attachments: arrAttach,
  });

  console.log(result);
  //   }
  // });
}

// отправка письма клиенту
async function sendClientMail(name, email) {
  const result = await transporter.sendMail({
    from: `"${fromName}" <${adminEmail}>`,
    to: email,
    // bcc: copyEmail, // hidden email copy
    subject: "Fire1: Оформлен новый заказ",
    html: `Здравствуйте, ${name}!<br><br>
    Благодарим за заказ. Менеджер SWS свяжется с вами в ближайшее время.<br><br>
    С уважением, компания SWS<br><br><br>
    Hello, ${name}!<br><br>
    Thanks for your order. SWS manager will contact you shortly.<br><br>
    Have a good day,<br>
    SWS Company`,
  });

  console.log(result);
}

export { sendContactMail, sendOrderMail, sendClientMail };
