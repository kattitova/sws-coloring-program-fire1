import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "sws.nodemailer@gmail.com",
    pass: "sws.nodemailer.2021",
  },
});

const adminEmail = "titova.kat.85@gmail.com"; // TODO change on order@sws.aero
// const copyEmail = "skyinsur@gmail.com";
const fromName = "SWS Coloring Program";

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
    from: fromName,
    to: adminEmail,
    // bcc: copyEmail, // hidden email copy
    subject: "Contact Form Message",
    html: mes,
  });

  console.log(result);
}

export { sendContactMail };
