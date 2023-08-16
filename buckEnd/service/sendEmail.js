const nodemailer = require("nodemailer");
require("dotenv").config();
const {META_PASSWORD} = process.env;
const transporter = nodemailer.createTransport({
  host: "smtp.meta.ua",
  port: 465,
  secure: true,
  auth: {
    user: "marchelo333@meta.ua",
    pass: META_PASSWORD,
  },
});

async function sendEmail({ userName, userEmail, userText }) {
  const emailContant = `
    <h2 style="color: green; ">Ви отримали листа від ${userName} </h2>
    <p style="color: rgb(187, 219, 9);">email для контактів ${userEmail}</p>
    <p style="color: blue;">Текст повідомлення ${userText}</p>
    <p>Дякуємо. Гарного дня</p>`;

  const info = await transporter.sendMail({
    from: "marchelo333@meta.ua", // sender address
    to: "jacenox161@backva.com", // list of receivers
    subject: "Звернення від користувача до директора", // Subject line
    text: userText, // plain text body
    html: emailContant, // html body
  });

  console.log("Message sent: %s", info.messageId);
}
module.exports = sendEmail;
